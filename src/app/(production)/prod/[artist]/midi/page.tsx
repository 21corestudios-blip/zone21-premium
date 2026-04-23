import type { Metadata } from "next";
import { notFound } from "next/navigation";

import ProductionStorefrontCategoryPageContent from "@/app/(production)/_components/production/ProductionStorefrontCategoryPageContent";
import { getProductionArtistStorefrontContext } from "@/app/(production)/_components/production/productionStorefrontPage";

type PageProps = {
  params: Promise<{
    artist: string;
  }>;
};

export async function generateMetadata({
  params,
}: PageProps): Promise<Metadata> {
  const { artist } = await params;
  const context = getProductionArtistStorefrontContext(artist, "midi");

  if (!context) {
    return { title: "Catégorie introuvable" };
  }

  return {
    title: `${context.category.name} - ${context.artist.name}`,
    description: context.category.description,
  };
}

export default async function ProductionArtistMidiPage({ params }: PageProps) {
  const { artist } = await params;
  const context = getProductionArtistStorefrontContext(artist, "midi");

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
