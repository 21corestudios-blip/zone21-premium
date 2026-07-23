import { readFile } from "node:fs/promises";
import path from "node:path";

import { loadCommerceScriptEnv } from "./lib/load-commerce-env";
import {
  buildWearVariantId,
  wearLaunchColors,
  wearStandardSizes,
} from "../src/data/wear.products";
import { resolveGelatoPrintFiles } from "../src/lib/commerce/providers/gelato/print-files";

loadCommerceScriptEnv();

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

const requiredWearSizes = wearStandardSizes;
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
      const printFiles = resolveGelatoPrintFiles(mapping.metadata);

      if (!printFiles.length) {
        issues.push(`${mapping.id}.metadata.printFiles is empty`);
      }
    }

    for (const size of requiredWearSizes) {
      for (const color of wearLaunchColors) {
        const internalVariantId = buildWearVariantId(size, color);
        const variant = mapping.variants?.find(
          (entry) => entry.internalVariantId === internalVariantId,
        );

        if (!variant) {
          issues.push(`${mapping.id}.variants missing ${internalVariantId}`);
          continue;
        }

        assertRealValue(
          variant.providerVariantId,
          `${mapping.id}.variants.${internalVariantId}.providerVariantId`,
          issues,
        );
      }
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
