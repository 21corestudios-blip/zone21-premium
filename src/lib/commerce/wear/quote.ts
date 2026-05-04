import { getWearProductById, isWearProductSize } from "@/data/wear.products";
import type { CommerceMoney, FulfillmentProvider } from "@/lib/commerce/types";
import { getWearProviderCandidates, type WearDestination } from "./routing";
import { getWearSourceMapping } from "./source-mapping";

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
  itemTotal: CommerceMoney;
  shipping: CommerceMoney;
  total: CommerceMoney;
  sourceProductId?: string;
  sourceVariantId?: string;
  fallbackReason?: string;
}

export function quoteWearLine(input: WearQuoteInput): WearQuote {
  const product = getWearProductById(input.productId);

  if (!product) {
    throw new Error("WEAR_PRODUCT_NOT_FOUND");
  }

  if (!isWearProductSize(input.variantId)) {
    throw new Error("WEAR_VARIANT_INVALID");
  }

  if (!product.availableSizes.includes(input.variantId)) {
    throw new Error("WEAR_VARIANT_UNAVAILABLE");
  }

  if (!Number.isInteger(input.quantity) || input.quantity < 1) {
    throw new Error("WEAR_QUANTITY_INVALID");
  }

  if (!input.destination.country) {
    throw new Error("WEAR_DESTINATION_REQUIRED");
  }

  const candidates = getWearProviderCandidates(input.destination);
  const mapping = getWearSourceMapping(input.productId, input.variantId);
  const selected =
    candidates.find((candidate) => mapping?.providers[candidate.provider]) ||
    candidates[0];
  const providerMapping = mapping?.providers[selected.provider];
  const itemTotalCents = product.priceCents * input.quantity;
  const shippingCents = estimateWearShippingCents(
    selected.provider,
    input.destination.country,
    input.quantity,
  );

  return {
    productId: input.productId,
    variantId: input.variantId,
    quantity: input.quantity,
    provider: selected.provider,
    itemTotal: { amountCents: itemTotalCents, currency: "EUR" },
    shipping: { amountCents: shippingCents, currency: "EUR" },
    total: { amountCents: itemTotalCents + shippingCents, currency: "EUR" },
    sourceProductId: providerMapping?.sourceProductId,
    sourceVariantId: providerMapping?.sourceVariantId,
    fallbackReason: providerMapping ? undefined : "provider mapping pending",
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
