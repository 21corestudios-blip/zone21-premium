import { quoteWearLine } from "@/lib/commerce/wear/quote";
import { loadCommerceScriptEnv } from "./lib/load-commerce-env";

loadCommerceScriptEnv();

type QuoteScenario = {
  name: string;
  productId: string;
  variantId: string;
  country: string;
  postalCode?: string;
  city?: string;
};

const scenarios: QuoteScenario[] = [
  {
    name: "wear-eu-gelato",
    productId: process.env.COMMERCE_STAGING_WEAR_PRODUCT_ID || "classic-tee-01",
    variantId: process.env.COMMERCE_STAGING_WEAR_VARIANT_ID || "M",
    country: process.env.COMMERCE_STAGING_EU_COUNTRY || "FR",
    postalCode: process.env.COMMERCE_STAGING_EU_POSTAL_CODE || "75001",
    city: process.env.COMMERCE_STAGING_EU_CITY || "Paris",
  },
  {
    name: "wear-us-printify",
    productId:
      process.env.COMMERCE_STAGING_WEAR_US_PRODUCT_ID ||
      process.env.COMMERCE_STAGING_WEAR_PRODUCT_ID ||
      "classic-tee-01",
    variantId:
      process.env.COMMERCE_STAGING_WEAR_US_VARIANT_ID ||
      process.env.COMMERCE_STAGING_WEAR_VARIANT_ID ||
      "M",
    country: process.env.COMMERCE_STAGING_US_COUNTRY || "US",
    postalCode: process.env.COMMERCE_STAGING_US_POSTAL_CODE || "10001",
    city: process.env.COMMERCE_STAGING_US_CITY || "New York",
  },
];

async function main() {
  if (process.env.WEAR_ALLOW_ESTIMATED_QUOTES === "true") {
    throw new Error("WEAR_ALLOW_ESTIMATED_QUOTES must be false for real quote checks.");
  }

  const results = [];

  for (const scenario of scenarios) {
    try {
      const quote = await quoteWearLine({
        productId: scenario.productId,
        variantId: scenario.variantId,
        quantity: 1,
        destination: {
          country: scenario.country,
          postalCode: scenario.postalCode,
          city: scenario.city,
        },
      });
      results.push({
        name: scenario.name,
        status: "ok",
        provider: quote.provider,
        providerMappingId: quote.providerMappingId,
        sourceProductId: quote.sourceProductId,
        sourceVariantId: quote.sourceVariantId,
        shippingAmountCents: quote.shipping.amountCents,
        totalAmountCents: quote.total.amountCents,
        quoteId: quote.quoteId,
      });
    } catch (error) {
      results.push({
        name: scenario.name,
        status: "blocked",
        error: error instanceof Error ? error.message : "quote failed",
      });
    }
  }

  console.log(JSON.stringify({ results }, null, 2));

  if (results.some((result) => result.status === "blocked")) {
    process.exit(1);
  }
}

main().catch((error) => {
  console.error(error);
  process.exit(1);
});
