import type { Metadata } from "next";
import { notFound } from "next/navigation";

import ProductionStorefrontCategoryPageContent from "@/app/(production)/_components/production/ProductionStorefrontCategoryPageContent";
import { getProductionArtistStorefrontContext } from "@/app/(production)/_components/production/productionStorefrontPage";
import { createMetadata } from "@/lib/seo/createMetadata";

type PageProps = {
  params: Promise<{
    artist: string;
  }>;
};

export async function generateMetadata({
  params,
}: PageProps): Promise<Metadata> {
  const { artist } = await params;
  const context = getProductionArtistStorefrontContext(artist, "templates");

  if (!context) {
    return { title: "Catégorie introuvable" };
  }

  return createMetadata({
    title: `${context.category.name} - ${context.artist.name}`,
    description: context.category.description,
    path: `/prod/${artist}/templates`,
    image: {
      url: context.artist.heroImage,
      alt: `${context.category.name} - ${context.artist.name}`,
    },
  });
}

export default async function ProductionArtistTemplatesPage({
  params,
}: PageProps) {
  const { artist } = await params;
  const context = getProductionArtistStorefrontContext(artist, "templates");

  if (!context) {
    notFound();
  }

  return (
    <ProductionStorefrontCategoryPageContent
      artistName={context.artist.name}
      artistSlug={artist}
      category={context.category}
      items={context.items}
    />
  );
}
