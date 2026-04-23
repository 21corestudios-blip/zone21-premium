import type { Metadata } from "next";
import Image from "next/image";
import { notFound } from "next/navigation";

import ProductionMiniPlayer from "@/app/(production)/_components/production/ProductionMiniPlayer";
import ProductionProductsGrid from "@/app/(production)/_components/production/ProductionProductsGrid";
import ProductionStorefrontCategories from "@/app/(production)/_components/production/ProductionStorefrontCategories";
import { productionArtists } from "@/data/production.artists";
import { productionProducts } from "@/data/production.products";

type PageProps = {
  params: Promise<{
    artist: string;
  }>;
};

export async function generateMetadata({
  params,
}: PageProps): Promise<Metadata> {
  const { artist } = await params;
  const currentArtist = productionArtists.find((item) => item.slug === artist);

  if (!currentArtist) {
    return {
      title: "Artiste introuvable",
    };
  }

  return {
    title: currentArtist.name,
    description: currentArtist.description,
  };
}

export async function generateStaticParams() {
  return productionArtists.map((artist) => ({
    artist: artist.slug,
  }));
}

export default async function ProductionArtistPage({ params }: PageProps) {
  const { artist } = await params;
  const currentArtist = productionArtists.find((item) => item.slug === artist);

  if (!currentArtist) {
    notFound();
  }

  const artistProducts = productionProducts.filter(
    (product) => product.artist === artist,
  );
  const audioProducts = artistProducts.filter(
    (product) => product.kind === "Beat" || product.kind === "Album",
  );

  return (
    <main className="flex min-h-screen flex-col bg-[#F7F5F0]">
      <section className="relative h-[100dvh] min-h-screen w-full overflow-hidden bg-[#121110]">
        <Image
          src={currentArtist.heroImage}
          alt={currentArtist.name}
          fill
          priority
          sizes="100vw"
          className="object-cover"
        />

        <div className="pointer-events-none absolute inset-0 bg-gradient-to-b from-transparent via-[#121110]/12 to-[#121110]/82 mix-blend-multiply" />

        <div className="absolute bottom-10 left-0 z-10 flex w-full justify-center px-6 md:bottom-16">
          <div className="text-center">
            <p className="font-sans text-[0.68rem] uppercase tracking-[0.3em] text-white/58">
              {currentArtist.role}
            </p>
            <h1 className="mt-6 font-serif text-4xl font-light tracking-wide text-white md:text-6xl lg:text-7xl">
              {currentArtist.name}
            </h1>
          </div>
        </div>
      </section>

      <section className="mx-auto w-full max-w-4xl px-6 py-20 text-center md:px-12 md:py-24">
        <span className="font-sans text-[0.65rem] uppercase tracking-[0.3em] text-[#121110]/40">
          21 Production
        </span>

        <p className="mt-8 font-sans text-base font-light leading-relaxed text-[#121110]/70 md:text-lg">
          {currentArtist.description}
        </p>

        <p className="mt-6 font-sans text-base font-light leading-relaxed text-[#121110]/70 md:text-lg">
          {currentArtist.tagline}
        </p>
      </section>

      <ProductionStorefrontCategories artistSlug={artist} />

      {audioProducts.length ? (
        <ProductionMiniPlayer products={audioProducts} />
      ) : null}

      <ProductionProductsGrid artistSlug={artist} products={artistProducts} />
    </main>
  );
}
