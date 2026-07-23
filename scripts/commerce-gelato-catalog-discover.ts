import { createGelatoClient } from "@/lib/commerce/providers/gelato/client";

import { loadCommerceScriptEnv } from "./lib/load-commerce-env";

loadCommerceScriptEnv();

async function main() {
  if (!process.env.GELATO_API_KEY) {
    throw new Error("GELATO_API_KEY is required for Gelato catalog discovery.");
  }

  const client = createGelatoClient();
  const catalogs = await client.listCatalogs();
  const catalogUid = process.env.GELATO_WEAR_CATALOG_UID;

  if (!catalogUid) {
    console.log(
      JSON.stringify(
        {
          status: "catalog-selection-required",
          catalogs,
          next: "Set GELATO_WEAR_CATALOG_UID to the apparel catalog UID.",
        },
        null,
        2,
      ),
    );
    return;
  }

  const attributeFilters = parseAttributeFilters(
    process.env.GELATO_WEAR_ATTRIBUTE_FILTERS,
  );
  const result = await client.searchCatalogProducts({
    catalogUid,
    attributeFilters,
  });
  const launchCountries = ["FR", "US", "CA", "AU", "NZ"];

  console.log(
    JSON.stringify(
      {
        status: "ok",
        catalogUid,
        attributeFilters,
        products: result.products.map((product) => ({
          productUid: product.productUid,
          attributes: product.attributes,
          launchCountryCoverage: launchCountries.filter((country) =>
            product.supportedCountries.includes(country),
          ),
          supportedCountries: product.supportedCountries,
        })),
      },
      null,
      2,
    ),
  );
}

function parseAttributeFilters(value?: string) {
  if (!value) {
    return {};
  }

  const parsed = JSON.parse(value) as unknown;

  if (!parsed || typeof parsed !== "object" || Array.isArray(parsed)) {
    throw new Error("GELATO_WEAR_ATTRIBUTE_FILTERS must be a JSON object.");
  }

  return parsed as Record<string, string[]>;
}

main().catch((error) => {
  console.error(error);
  process.exit(1);
});
