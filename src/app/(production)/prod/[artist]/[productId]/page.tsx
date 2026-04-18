import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";

import ProductionAddToCartForm from "@/app/(production)/_components/cart/ProductionAddToCartForm";
import { productionArtists } from "@/data/production.artists";
import {
  formatProductionPrice,
  productionProducts,
} from "@/data/production.products";

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
      <section className="mx-auto w-full max-w-7xl px-6 pb-20 pt-28 md:px-12 md:pb-28 md:pt-36">
        <div className="grid grid-cols-1 gap-16 lg:grid-cols-[minmax(0,1.1fr)_minmax(360px,0.9fr)] lg:gap-20">
          <div className="relative aspect-[4/5] w-full overflow-hidden bg-[#EAE8E3]">
            <Image
              src={currentProduct.image}
              alt={currentProduct.name}
              fill
              priority
              sizes="(max-width: 1024px) 100vw, 55vw"
              className="object-cover"
            />
          </div>

          <div className="flex flex-col justify-center gap-10">
            <div className="flex flex-col gap-4">
              <Link
                href={`/prod/${artist}`}
                className="font-sans text-[0.65rem] uppercase tracking-[0.2em] text-[#121110]/45 transition-colors duration-300 hover:text-[#121110]"
              >
                {currentArtist.name}
              </Link>

              <h1 className="font-serif text-4xl leading-[1.02] tracking-[-0.02em] text-[#121110] md:text-5xl lg:text-[4.25rem]">
                {currentProduct.name}
              </h1>

              <div className="flex flex-wrap items-center gap-4">
                <p className="font-sans text-sm uppercase tracking-[0.15em] text-[#121110]/55 md:text-base">
                  {currentProduct.kind}
                </p>
                <span className="h-3 w-px bg-[#121110]/12" />
                <p className="font-sans text-sm uppercase tracking-[0.15em] text-[#121110]/55 md:text-base">
                  {formatProductionPrice(
                    currentProduct.priceCents,
                    currentProduct.currency,
                  )}
                </p>
                {currentProduct.bpm ? (
                  <>
                    <span className="h-3 w-px bg-[#121110]/12" />
                    <p className="font-sans text-sm uppercase tracking-[0.15em] text-[#121110]/55 md:text-base">
                      {currentProduct.bpm} BPM
                    </p>
                  </>
                ) : null}
                {currentProduct.key ? (
                  <>
                    <span className="h-3 w-px bg-[#121110]/12" />
                    <p className="font-sans text-sm uppercase tracking-[0.15em] text-[#121110]/55 md:text-base">
                      {currentProduct.key}
                    </p>
                  </>
                ) : null}
              </div>
            </div>

            <div className="flex flex-col gap-6">
              <p className="font-sans text-base font-light leading-relaxed text-[#121110]/72 md:text-lg">
                {currentProduct.description}
              </p>

              <p className="font-sans text-base font-light leading-relaxed text-[#121110]/72 md:text-lg">
                Chaque ressource 21 Production est pensée comme une base de
                travail immédiatement exploitable, avec une direction sonore
                claire et une finition conçue pour l’usage réel en session,
                en performance ou en écriture.
              </p>
            </div>

            <div className="flex flex-col gap-6 pt-4">
              <ProductionAddToCartForm product={currentProduct} />
              <Link
                href="/contact"
                className="inline-flex items-center justify-center border border-[#121110]/15 px-8 py-4 text-[#121110] transition-colors duration-500 hover:border-[#121110]/35 sm:w-fit"
              >
                <span className="font-sans text-[0.65rem] font-bold uppercase tracking-[0.25em]">
                  Demande Privée
                </span>
              </Link>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}
