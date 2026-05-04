import { wearProducts, type WearProductSize } from "@/data/wear.products";
import type { FulfillmentProvider } from "@/lib/commerce/types";

export interface WearSourceVariantMapping {
  productId: string;
  variantId: WearProductSize;
  sku: string;
  providers: Partial<
    Record<
      Extract<FulfillmentProvider, "printify" | "gelato">,
      {
        sourceProductId: string;
        sourceVariantId: string;
      }
    >
  >;
}

export function getWearSourceMappings(): WearSourceVariantMapping[] {
  return wearProducts.flatMap((product) =>
    product.availableSizes.map((size) => ({
      productId: product.id,
      variantId: size,
      sku: `${product.id}-${size}`.toUpperCase(),
      providers: {},
    })),
  );
}

export function getWearSourceMapping(productId: string, variantId: string) {
  return getWearSourceMappings().find(
    (mapping) =>
      mapping.productId === productId && mapping.variantId === variantId,
  );
}
