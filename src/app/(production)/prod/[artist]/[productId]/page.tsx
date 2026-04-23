import type { Metadata } from "next";
import { notFound } from "next/navigation";

import ProductionProductExperience from "@/app/(production)/_components/production/ProductionProductExperience";
import { productionArtists } from "@/data/production.artists";
import { productionProducts } from "@/data/production.products";

type PageProps = {
  params: Promise<{
    artist: string;
    productId: string;
  }>;
};

export async function generateMetadata({
  params,
}: PageProps): Promise<Metadata> {
  const { artist, productId } = await params;
  const currentProduct = productionProducts.find(
    (product) => product.artist === artist && product.id === productId,
  );

  if (!currentProduct) {
    return {
      title: "Produit introuvable",
    };
  }

  return {
    title: currentProduct.name,
    description: currentProduct.description,
  };
}

export async function generateStaticParams() {
  return productionProducts.map((product) => ({
    artist: product.artist,
    productId: product.id,
  }));
}

export default async function ProductionProductPage({ params }: PageProps) {
  const { artist, productId } = await params;

  const currentArtist = productionArtists.find((item) => item.slug === artist);
  const currentProduct = productionProducts.find(
    (product) => product.artist === artist && product.id === productId,
  );

  if (!currentArtist || !currentProduct) {
    notFound();
  }

  return (
    <main className="flex min-h-screen flex-col bg-[#F7F5F0]">
      <ProductionProductExperience
        artistName={currentArtist.name}
        artistSlug={artist}
        product={currentProduct}
      />
    </main>
  );
}
