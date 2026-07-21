import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";

import WearAddToCartForm from "@/app/(wear)/_components/cart/WearAddToCartForm";
import { wearCollections } from "@/data/wear.catalog";
import { formatWearPrice, wearProducts } from "@/data/wear.products";

type PageProps = {
  params: Promise<{
    collection: string;
    productId: string;
  }>;
};

export async function generateMetadata({
  params,
}: PageProps): Promise<Metadata> {
  const { collection, productId } = await params;

  const currentProduct = wearProducts.find(
    (product) => product.collection === collection && product.id === productId,
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
  return wearProducts.map((product) => ({
    collection: product.collection,
    productId: product.id,
  }));
}

export default async function WearProductPage({ params }: PageProps) {
  const { collection, productId } = await params;

  const currentCollection = wearCollections.find(
    (item) => item.slug === collection,
  );
  const currentProduct = wearProducts.find(
    (product) => product.collection === collection && product.id === productId,
  );

  if (!currentCollection || !currentProduct) {
    notFound();
  }

  return (
    <main className="flex min-h-screen flex-col bg-paper">
      <section className="mx-auto w-full max-w-7xl px-6 pb-24 pt-32 md:px-10 md:pb-32 md:pt-40 lg:px-16">
        <div className="grid grid-cols-1 gap-16 lg:grid-cols-[minmax(0,1.1fr)_minmax(360px,0.9fr)] lg:gap-20">
          <div className="relative aspect-[4/5] w-full overflow-hidden bg-commerce-surface">
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
                href={`/wear/${collection}`}
                className="font-sans text-[0.65rem] uppercase tracking-[0.2em] text-bg/45 transition-colors duration-300 hover:text-bg"
              >
                {currentCollection.name}
              </Link>

              <h1 className="font-serif text-4xl leading-[1.02] tracking-[-0.02em] text-bg md:text-5xl lg:text-[4.25rem]">
                {currentProduct.name}
              </h1>

              <p className="font-sans text-sm uppercase tracking-[0.15em] text-bg/55 md:text-base">
                {formatWearPrice(
                  currentProduct.priceCents,
                  currentProduct.currency,
                )}
              </p>
            </div>

            <div className="flex flex-col gap-6">
              <p className="font-sans text-base font-light leading-relaxed text-bg/72 md:text-lg">
                {currentProduct.description}
              </p>

              <p className="font-sans text-base font-light leading-relaxed text-bg/72 md:text-lg">
                Chaque pièce CO-KAIN s’inscrit dans une approche de construction
                lente, de précision des volumes et d’exigence textile. Cette
                base intègre désormais la sélection de taille et le panier, en
                préparation de l’étape checkout.
              </p>
            </div>

            <div className="flex flex-col gap-6 pt-4">
              <WearAddToCartForm product={currentProduct} />
              <Link
                href="/contact"
                className="inline-flex items-center justify-center rounded-none border border-bg/15 px-8 py-4 text-bg transition-colors duration-300 hover:border-bg hover:bg-bg hover:text-paper sm:w-fit"
              >
                <span className="font-serif text-xs uppercase tracking-[0.18em]">
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
