import { productionArtists } from "@/data/production.artists";
import {
  getProductionStorefrontCategoryBySlug,
  getProductionStorefrontItems,
  type ProductionStorefrontCategorySlug,
} from "@/data/production.products";

export function getProductionArtistStorefrontContext(
  artistSlug: string,
  categorySlug: ProductionStorefrontCategorySlug,
) {
  const artist = productionArtists.find((item) => item.slug === artistSlug);
  const category = getProductionStorefrontCategoryBySlug(categorySlug);

  if (!artist || !category) {
    return null;
  }

  const items = getProductionStorefrontItems(artistSlug, categorySlug);

  return {
    artist,
    category,
    items,
  };
}
