import { readFile } from "node:fs/promises";
import path from "node:path";

import mysql from "mysql2/promise";

import { loadCommerceScriptEnv } from "./lib/load-commerce-env";

loadCommerceScriptEnv();

type SeedMapping = {
  id: string;
  brand: string;
  internalProductId: string;
  provider: "printify" | "gelato";
  providerProductId: string;
  providerVariantId?: string | null;
  providerShopId?: string | null;
  providerRegion: string;
  currency: string;
  active: boolean;
  metadata?: Record<string, unknown>;
  variants?: Array<{
    internalVariantId: string;
    providerVariantId: string;
    sku?: string;
  }>;
};

const seedPath = path.join(
  process.cwd(),
  "db",
  "seeds",
  "wear-provider-mappings.json",
);

async function main() {
  if (!process.env.DATABASE_URL) {
    throw new Error("DATABASE_URL is required to seed Wear provider mappings.");
  }

  const raw = await readFile(seedPath, "utf8");
  const mappings = JSON.parse(raw) as SeedMapping[];
  const connection = await mysql.createConnection(process.env.DATABASE_URL);

  try {
    for (const mapping of mappings) {
      await connection.execute(
        `INSERT INTO provider_product_mappings
          (id, brand, internal_product_id, provider, provider_product_id,
           provider_variant_id, provider_shop_id, provider_region, currency,
           active, metadata_json)
         VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
         ON DUPLICATE KEY UPDATE
           provider_product_id = VALUES(provider_product_id),
           provider_variant_id = VALUES(provider_variant_id),
           provider_shop_id = VALUES(provider_shop_id),
           provider_region = VALUES(provider_region),
           currency = VALUES(currency),
           active = VALUES(active),
           metadata_json = VALUES(metadata_json)`,
        [
          mapping.id,
          mapping.brand,
          mapping.internalProductId,
          mapping.provider,
          mapping.providerProductId,
          mapping.providerVariantId || null,
          mapping.providerShopId || null,
          mapping.providerRegion,
          mapping.currency,
          mapping.active,
          JSON.stringify(mapping.metadata || null),
        ],
      );

      for (const variant of mapping.variants || []) {
        await connection.execute(
          `INSERT INTO provider_variant_mappings
            (id, product_mapping_id, internal_product_id, internal_variant_id,
             provider, provider_product_id, provider_variant_id, sku, active,
             metadata_json)
           VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
           ON DUPLICATE KEY UPDATE
             provider_product_id = VALUES(provider_product_id),
             provider_variant_id = VALUES(provider_variant_id),
             sku = VALUES(sku),
             active = VALUES(active),
             metadata_json = VALUES(metadata_json)`,
          [
            `${mapping.id}:${variant.internalVariantId}`,
            mapping.id,
            mapping.internalProductId,
            variant.internalVariantId,
            mapping.provider,
            mapping.providerProductId,
            variant.providerVariantId,
            variant.sku || null,
            mapping.active,
            JSON.stringify(mapping.metadata || null),
          ],
        );
      }
    }
  } finally {
    await connection.end();
  }

  console.log(
    JSON.stringify(
      {
        status: "seeded",
        mappings: mappings.length,
        activeMappings: mappings.filter((mapping) => mapping.active).length,
      },
      null,
      2,
    ),
  );
}

main().catch((error) => {
  console.error(error);
  process.exit(1);
});
