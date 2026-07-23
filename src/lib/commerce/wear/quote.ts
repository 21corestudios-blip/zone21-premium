import {
  getWearProductById,
  parseWearVariantId,
  wearLaunchColors,
} from "@/data/wear.products";
import type { CommerceMoney, FulfillmentProvider } from "@/lib/commerce/types";
import { createGelatoClient } from "../providers/gelato/client";
import { resolveGelatoPrintFiles } from "../providers/gelato/print-files";
import { createPrintifyClient } from "../providers/printify/client";
import { getWearProviderCandidates, type WearDestination } from "./routing";
import { getPersistedWearProviderMapping } from "./source-mapping";

export interface WearQuoteInput {
  productId: string;
  variantId: string;
  quantity: number;
  destination: WearDestination;
}

export interface WearQuote {
  productId: string;
  variantId: string;
  quantity: number;
  provider: Extract<FulfillmentProvider, "printify" | "gelato">;
  providerDecisionReason: string;
  itemTotal: CommerceMoney;
  shipping: CommerceMoney;
  total: CommerceMoney;
  sourceProductId?: string;
  sourceVariantId?: string;
  providerMappingId?: string;
  fallbackReason?: string;
  quoteId?: string;
  shipmentMethodUid?: string;
  rawQuote?: unknown;
}

export async function quoteWearLine(input: WearQuoteInput): Promise<WearQuote> {
  const product = getWearProductById(input.productId);

  if (!product) {
    throw new Error("WEAR_PRODUCT_NOT_FOUND");
  }

  const variant = parseWearVariantId(input.variantId);

  if (!variant) {
    throw new Error("WEAR_VARIANT_INVALID");
  }

  if (
    !product.availableSizes.includes(variant.size) ||
    !(product.availableColors || [wearLaunchColors[0]]).includes(variant.color)
  ) {
    throw new Error("WEAR_VARIANT_UNAVAILABLE");
  }

  if (!Number.isInteger(input.quantity) || input.quantity < 1) {
    throw new Error("WEAR_QUANTITY_INVALID");
  }

  if (!input.destination.country) {
    throw new Error("WEAR_DESTINATION_REQUIRED");
  }

  const candidates = getWearProviderCandidates(input.destination);
  const itemTotalCents = product.priceCents * input.quantity;
  const quoteErrors: string[] = [];

  for (const candidate of candidates) {
    const mapping = await getPersistedWearProviderMapping({
      productId: input.productId,
      variantId: input.variantId,
      provider: candidate.provider,
      region: candidate.providerRegion,
    });

    if (!mapping) {
      quoteErrors.push(`${candidate.provider}:mapping_missing`);
      continue;
    }

    try {
      const providerQuote = await quoteProviderShipping({
        provider: candidate.provider,
        mapping,
        input,
        itemTotalCents,
      });

      return {
        productId: input.productId,
        variantId: input.variantId,
        quantity: input.quantity,
        provider: candidate.provider,
        providerDecisionReason: `${candidate.reason} (${candidate.providerRegion})`,
        itemTotal: { amountCents: itemTotalCents, currency: "EUR" },
        shipping: {
          amountCents: providerQuote.shippingCents,
          currency: "EUR",
        },
        total: {
          amountCents: itemTotalCents + providerQuote.shippingCents,
          currency: "EUR",
        },
        sourceProductId: mapping.productMapping.providerProductId,
        sourceVariantId: mapping.variantMapping.providerVariantId,
        providerMappingId: mapping.productMapping.id,
        quoteId: providerQuote.quoteId,
        shipmentMethodUid: providerQuote.shipmentMethodUid,
        rawQuote: providerQuote.rawQuote,
      };
    } catch (error) {
      quoteErrors.push(
        `${candidate.provider}:${
          error instanceof Error ? error.message : "quote_failed"
        }`,
      );
    }
  }

  if (process.env.WEAR_ALLOW_ESTIMATED_QUOTES !== "true") {
    throw new Error(`WEAR_REAL_QUOTE_UNAVAILABLE:${quoteErrors.join(",")}`);
  }

  const fallbackCandidate = candidates[0];
  const shippingCents = estimateWearShippingCents(
    fallbackCandidate.provider,
    input.destination.country,
    input.quantity,
  );

  return {
    productId: input.productId,
    variantId: input.variantId,
    quantity: input.quantity,
    provider: fallbackCandidate.provider,
    providerDecisionReason: fallbackCandidate.reason,
    itemTotal: { amountCents: itemTotalCents, currency: "EUR" },
    shipping: { amountCents: shippingCents, currency: "EUR" },
    total: { amountCents: itemTotalCents + shippingCents, currency: "EUR" },
    fallbackReason: `estimated quote enabled after failures: ${quoteErrors.join(",")}`,
  };
}

async function quoteProviderShipping({
  provider,
  mapping,
  input,
}: {
  provider: Extract<FulfillmentProvider, "printify" | "gelato">;
  mapping: Awaited<ReturnType<typeof getPersistedWearProviderMapping>>;
  input: WearQuoteInput;
  itemTotalCents: number;
}) {
  if (!mapping) {
    throw new Error("mapping_missing");
  }

  if (provider === "gelato") {
    const client = createGelatoClient();
    const files = resolveGelatoPrintFiles(mapping.productMapping.metadata);

    if (!files.length) {
      throw new Error("gelato_print_files_missing");
    }

    const quote = await client.quoteShipping({
      orderReferenceId: `quote-${input.productId}-${Date.now()}`,
      customerReferenceId: "zone21-customer-pending",
      productUid: mapping.productMapping.providerProductId,
      itemReferenceId: `${input.productId}:${input.variantId}`,
      files,
      quantity: input.quantity,
      currency: "EUR",
      country: input.destination.country,
      postalCode: input.destination.postalCode,
      city: input.destination.city,
      state: input.destination.region,
    });
    const shipment = quote.quotes?.[0]?.shipmentMethods?.[0];

    if (!shipment) {
      throw new Error("gelato_quote_empty");
    }

    return {
      shippingCents: Math.round(shipment.price * 100),
      quoteId: quote.quotes?.[0]?.id,
      shipmentMethodUid: shipment.shipmentMethodUid,
      rawQuote: quote,
    };
  }

  const client = createPrintifyClient();
  const quote = await client.quoteShipping({
    variant_id: Number(mapping.variantMapping.providerVariantId),
    quantity: input.quantity,
    address_to: {
      country: input.destination.country,
      region: input.destination.region,
      city: input.destination.city,
      zip: input.destination.postalCode,
    },
  });
  const shippingAmount = quote.standard ?? quote.express;

  if (typeof shippingAmount !== "number") {
    throw new Error("printify_quote_empty");
  }

  return {
    shippingCents: Math.round(shippingAmount * 100),
    rawQuote: quote,
  };
}

function estimateWearShippingCents(
  provider: Extract<FulfillmentProvider, "printify" | "gelato">,
  country: string,
  quantity: number,
) {
  const base = provider === "gelato" ? 690 : 790;
  const internationalSurcharge = ["FR", "DE", "ES", "IT", "US"].includes(
    country.toUpperCase(),
  )
    ? 0
    : 400;

  return base + internationalSurcharge + Math.max(quantity - 1, 0) * 180;
}
