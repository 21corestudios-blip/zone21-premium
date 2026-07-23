import {
  buildWearVariantId,
  wearLaunchColors,
  wearProducts,
  type WearProductColor,
  type WearProductSize,
} from "@/data/wear.products";
import { getCommerceRepository } from "@/lib/commerce/persistence/repository";
import type { ProviderMappingBundle } from "@/lib/commerce/persistence/types";
import type { FulfillmentProvider } from "@/lib/commerce/types";

export interface WearSourceVariantMapping {
  productId: string;
  variantId: string;
  size: WearProductSize;
  color: WearProductColor;
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
    product.availableSizes.flatMap((size) =>
      (product.availableColors || [wearLaunchColors[0]]).map((color) => ({
        productId: product.id,
        variantId: buildWearVariantId(size, color),
        size,
        color,
        sku: `${product.id}-${size}-${color}`.toUpperCase(),
        providers: {},
      })),
    ),
  );
}

export function getWearSourceMapping(productId: string, variantId: string) {
  return getWearSourceMappings().find(
    (mapping) =>
      mapping.productId === productId && mapping.variantId === variantId,
  );
}

export async function getPersistedWearProviderMapping({
  productId,
  variantId,
  provider,
  region,
}: {
  productId: string;
  variantId: string;
  provider: Extract<FulfillmentProvider, "printify" | "gelato">;
  region?: string;
}): Promise<ProviderMappingBundle | null> {
  return getCommerceRepository().getProviderMapping({
    productId,
    variantId,
    provider,
    region,
  });
}
