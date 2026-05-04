import { getCommerceProductById } from "@/lib/commerce/catalog";
import type {
  CommerceCartLine,
  CommerceCartValidation,
  CommerceCustomer,
  CommerceLineInput,
  CommerceMoney,
} from "@/lib/commerce/types";
import { quoteWearLine } from "@/lib/commerce/wear/quote";

function lineIdFor(productId: string, variantId: string) {
  return `${productId}:${variantId}`;
}

export function validateCommerceCart(
  inputLines: CommerceLineInput[],
): CommerceCartValidation {
  if (!inputLines.length) {
    throw new Error("CART_EMPTY");
  }

  const lines: CommerceCartLine[] = inputLines.map((input) => {
    const product = getCommerceProductById(input.productId);

    if (!product || !product.sellable) {
      throw new Error("PRODUCT_UNSELLABLE");
    }

    if (!Number.isInteger(input.quantity) || input.quantity < 1) {
      throw new Error("QUANTITY_INVALID");
    }

    const variantId = input.variantId || "default";
    const variant = product.variants.find((entry) => entry.id === variantId);

    if (!variant || variant.availability.status === "unavailable") {
      throw new Error("VARIANT_UNAVAILABLE");
    }

    return {
      lineId: lineIdFor(product.id, variant.id),
      productId: product.id,
      variantId: variant.id,
      brand: product.brand,
      source: product.source,
      quantity: Math.min(input.quantity, 10),
      displayPrice: variant.displayPrice,
      checkoutPrice: variant.checkoutPrice,
      currency: product.currency,
      fulfillmentProvider: variant.fulfillmentProvider,
      metadata: {
        productTitle: product.title,
        sku: variant.sku || product.sku || null,
        editorialContentRef: product.editorialContentRef || null,
      },
    };
  });

  const total = sumLines(lines);
  const brandSubtotals = Array.from(
    lines.reduce((map, line) => {
      const previous = map.get(line.brand) || 0;
      map.set(line.brand, previous + lineAmountCents(line));
      return map;
    }, new Map<CommerceCartLine["brand"], number>()),
  ).map(([brand, amountCents]) => ({
    brand,
    amountCents,
    currency: total.currency,
  }));

  return {
    lines,
    brandSubtotals,
    total,
  };
}

export async function validateCommerceCartForCheckout({
  items,
  customer,
}: {
  items: CommerceLineInput[];
  customer?: CommerceCustomer;
}): Promise<CommerceCartValidation> {
  const baseValidation = validateCommerceCart(items);
  const lines = await Promise.all(
    baseValidation.lines.map(async (line) => {
      if (
        line.brand !== "wear" ||
        (line.fulfillmentProvider !== "printify" &&
          line.fulfillmentProvider !== "gelato")
      ) {
        return line;
      }

      const destination = customer?.shippingAddress;

      if (!destination?.country) {
        throw new Error("WEAR_SHIPPING_ADDRESS_REQUIRED");
      }

      const quote = await quoteWearLine({
        productId: line.productId,
        variantId: line.variantId,
        quantity: line.quantity,
        destination: {
          country: destination.country,
          postalCode: destination.postalCode,
          city: destination.city,
        },
      });

      if (
        quote.fallbackReason &&
        process.env.WEAR_ALLOW_ESTIMATED_QUOTES !== "true"
      ) {
        throw new Error("WEAR_REAL_QUOTE_REQUIRED");
      }

      return {
        ...line,
        fulfillmentProvider: quote.provider,
        providerMappingId: quote.providerMappingId,
        lineTotal: quote.total,
        shippingAmount: quote.shipping,
        metadata: {
          ...line.metadata,
          providerDecisionReason: quote.providerDecisionReason,
          providerMappingId: quote.providerMappingId || null,
          sourceProductId: quote.sourceProductId || null,
          sourceVariantId: quote.sourceVariantId || null,
          quoteId: quote.quoteId || null,
          shipmentMethodUid: quote.shipmentMethodUid || null,
          shippingAmountCents: quote.shipping.amountCents,
          checkoutLineTotalCents: quote.total.amountCents,
        },
      } satisfies CommerceCartLine;
    }),
  );
  const total = sumLines(lines);
  const brandSubtotals = Array.from(
    lines.reduce((map, line) => {
      const previous = map.get(line.brand) || 0;
      map.set(line.brand, previous + lineAmountCents(line));
      return map;
    }, new Map<CommerceCartLine["brand"], number>()),
  ).map(([brand, amountCents]) => ({
    brand,
    amountCents,
    currency: total.currency,
  }));

  return { lines, brandSubtotals, total };
}

function sumLines(lines: CommerceCartLine[]): CommerceMoney {
  const currency = lines[0]?.currency || "EUR";

  return {
    amountCents: lines.reduce(
      (total, line) => total + lineAmountCents(line),
      0,
    ),
    currency,
  };
}

function lineAmountCents(line: CommerceCartLine) {
  return line.lineTotal?.amountCents ?? line.checkoutPrice.amountCents * line.quantity;
}
