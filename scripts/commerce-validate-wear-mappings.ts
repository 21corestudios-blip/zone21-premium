import { readFile } from "node:fs/promises";
import path from "node:path";

type SeedMapping = {
  id: string;
  internalProductId: string;
  provider: "printify" | "gelato";
  providerProductId: string;
  providerShopId?: string | null;
  providerRegion: string;
  active: boolean;
  metadata?: Record<string, unknown>;
  variants?: Array<{
    internalVariantId: string;
    providerVariantId: string;
    sku?: string;
  }>;
};

const requiredWearSizes = ["XS", "S", "M", "L", "XL"];
const seedPath = path.join(
  process.cwd(),
  "db",
  "seeds",
  "wear-provider-mappings.json",
);

async function main() {
  const raw = await readFile(seedPath, "utf8");
  const mappings = JSON.parse(raw) as SeedMapping[];
  const issues: string[] = [];
  const activeMappings = mappings.filter((mapping) => mapping.active);

  for (const mapping of activeMappings) {
    assertRealValue(
      mapping.providerProductId,
      `${mapping.id}.providerProductId`,
      issues,
    );

    if (mapping.provider === "printify") {
      assertRealValue(mapping.providerShopId, `${mapping.id}.providerShopId`, issues);
    }

    if (mapping.provider === "gelato") {
      const fileUrl =
        mapping.metadata?.fileUrl || process.env.GELATO_DEFAULT_FILE_URL;
      assertRealValue(fileUrl, `${mapping.id}.metadata.fileUrl`, issues);
    }

    for (const size of requiredWearSizes) {
      const variant = mapping.variants?.find(
        (entry) => entry.internalVariantId === size,
      );

      if (!variant) {
        issues.push(`${mapping.id}.variants missing ${size}`);
        continue;
      }

      assertRealValue(
        variant.providerVariantId,
        `${mapping.id}.variants.${size}.providerVariantId`,
        issues,
      );
    }
  }

  if (!activeMappings.length) {
    issues.push("no active Wear provider mapping found");
  }

  if (
    process.env.APP_ENV !== "local" &&
    process.env.WEAR_ALLOW_ESTIMATED_QUOTES === "true"
  ) {
    issues.push("WEAR_ALLOW_ESTIMATED_QUOTES must be false outside local");
  }

  if (issues.length) {
    console.error("Wear mapping validation failed:");
    for (const issue of issues) {
      console.error(`- ${issue}`);
    }
    process.exit(1);
  }

  console.log(
    JSON.stringify(
      {
        status: "ok",
        activeMappings: activeMappings.map((mapping) => ({
          id: mapping.id,
          provider: mapping.provider,
          internalProductId: mapping.internalProductId,
          providerRegion: mapping.providerRegion,
          variants: mapping.variants?.length || 0,
        })),
      },
      null,
      2,
    ),
  );
}

function assertRealValue(value: unknown, label: string, issues: string[]) {
  if (typeof value !== "string" || !value.trim()) {
    issues.push(`${label} is empty`);
    return;
  }

  if (/TODO|PLACEHOLDER|REPLACE|XXX/i.test(value)) {
    issues.push(`${label} still contains a placeholder`);
  }
}

main().catch((error) => {
  console.error(error);
  process.exit(1);
});
