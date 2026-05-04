import { coreProducts } from "@/data/core.products";
import { productionProducts } from "@/data/production.products";
import { talentsProducts } from "@/data/talents.products";
import { wearProducts } from "@/data/wear.products";
import {
  normalizeCoreProduct,
  normalizeProductionProduct,
  normalizeTalentsProduct,
  normalizeWearProduct,
} from "@/lib/commerce/catalog/normalize";
import type {
  CommerceBrandId,
  CommerceProduct,
  CommerceSource,
} from "@/lib/commerce/types";

function flattenProductionProducts() {
  return productionProducts.flatMap((product) => [
    product,
    ...(product.tracks || []),
    ...(product.editions || []),
  ]);
}

export function getUnifiedCatalog(): CommerceProduct[] {
  return [
    ...wearProducts.map(normalizeWearProduct),
    ...coreProducts.map(normalizeCoreProduct),
    ...flattenProductionProducts().map(normalizeProductionProduct),
    ...talentsProducts.map(normalizeTalentsProduct),
  ];
}

export function getCommerceProductsByBrand(brand: CommerceBrandId) {
  return getUnifiedCatalog().filter((product) => product.brand === brand);
}

export function getCommerceProductsBySource(source: CommerceSource) {
  return getUnifiedCatalog().filter((product) => product.source === source);
}

export function getCommerceProductById(productId: string) {
  return getUnifiedCatalog().find((product) => product.id === productId);
}
