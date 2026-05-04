import type { CommerceMoney, CommerceProduct } from "@/lib/commerce/types";

export function isPositiveInteger(value: unknown): value is number {
  return Number.isInteger(value) && typeof value === "number" && value > 0;
}

export function formatCommerceMoney(money: CommerceMoney) {
  return new Intl.NumberFormat("fr-FR", {
    style: "currency",
    currency: money.currency,
  }).format(money.amountCents / 100);
}

export function assertCommerceProduct(product: CommerceProduct) {
  if (!product.id || !product.slug || !product.title) {
    throw new Error("Commerce product identity is incomplete.");
  }

  if (product.currency !== product.displayPrice.currency) {
    throw new Error(`Currency mismatch for product ${product.id}.`);
  }

  if (product.currency !== product.checkoutPrice.currency) {
    throw new Error(`Checkout currency mismatch for product ${product.id}.`);
  }

  if (!product.variants.length) {
    throw new Error(`Product ${product.id} must expose at least one variant.`);
  }

  return product;
}
