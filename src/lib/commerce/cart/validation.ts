import { getCommerceProductById } from "@/lib/commerce/catalog";
import type {
  CommerceCartLine,
  CommerceCartValidation,
  CommerceLineInput,
  CommerceMoney,
} from "@/lib/commerce/types";

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
      map.set(
        line.brand,
        previous + line.checkoutPrice.amountCents * line.quantity,
      );
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

function sumLines(lines: CommerceCartLine[]): CommerceMoney {
  const currency = lines[0]?.currency || "EUR";

  return {
    amountCents: lines.reduce(
      (total, line) => total + line.checkoutPrice.amountCents * line.quantity,
      0,
    ),
    currency,
  };
}
