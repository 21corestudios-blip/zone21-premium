import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";

import { wearCollections } from "@/data/wear.catalog";
import { wearProducts } from "@/data/wear.products";

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
                href={`/wear/${collection}`}
                className="font-sans text-[0.65rem] uppercase tracking-[0.2em] text-[#121110]/45 transition-colors duration-300 hover:text-[#121110]"
              >
                {currentCollection.name}
              </Link>

              <h1 className="font-serif text-4xl leading-[1.02] tracking-[-0.02em] text-[#121110] md:text-5xl lg:text-[4.25rem]">
                {currentProduct.name}
              </h1>

              <p className="font-sans text-sm uppercase tracking-[0.15em] text-[#121110]/55 md:text-base">
                {currentProduct.price}
              </p>
            </div>

            <div className="flex flex-col gap-6">
              <p className="font-sans text-base font-light leading-relaxed text-[#121110]/72 md:text-lg">
                {currentProduct.description}
              </p>

              <p className="font-sans text-base font-light leading-relaxed text-[#121110]/72 md:text-lg">
                Chaque pièce 21 Wear s’inscrit dans une approche de construction
                lente, de précision des volumes et d’exigence textile. Cette
                version constitue ici une base de catalogue premium, prête à
                accueillir ensuite les variantes, tailles, stocks et modules
                d’achat.
              </p>
            </div>

            <div className="flex flex-col gap-4 pt-4 sm:flex-row">
              <button
                type="button"
                className="inline-flex items-center justify-center bg-[#121110] px-8 py-4 text-[#F7F5F0] transition-colors duration-500 hover:bg-[#2A2826]"
              >
                <span className="font-sans text-[0.65rem] font-bold uppercase tracking-[0.25em]">
                  Ajouter au panier
                </span>
              </button>

              <Link
                href="/contact"
                className="inline-flex items-center justify-center border border-[#121110]/15 px-8 py-4 text-[#121110] transition-colors duration-500 hover:border-[#121110]/35"
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
