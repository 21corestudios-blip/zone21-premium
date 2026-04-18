import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";

import TalentsAddToCartForm from "@/app/(talents)/_components/cart/TalentsAddToCartForm";
import { talentDivisions } from "@/data/talents.divisions";
import { formatTalentsPrice, talentsProducts } from "@/data/talents.products";

type PageProps = {
  params: Promise<{
    division: string;
    productId: string;
  }>;
};

export async function generateMetadata({
  params,
}: PageProps): Promise<Metadata> {
  const { division, productId } = await params;
  const currentProduct = talentsProducts.find(
    (product) => product.division === division && product.id === productId,
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
  return talentsProducts.map((product) => ({
    division: product.division,
    productId: product.id,
  }));
}

export default async function TalentsProductPage({ params }: PageProps) {
  const { division, productId } = await params;

  const currentDivision = talentDivisions.find((item) => item.slug === division);
  const currentProduct = talentsProducts.find(
    (product) => product.division === division && product.id === productId,
  );

  if (!currentDivision || !currentProduct) {
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
                href={`/talents-agency/${division}`}
                className="font-sans text-[0.65rem] uppercase tracking-[0.2em] text-[#121110]/45 transition-colors duration-300 hover:text-[#121110]"
              >
                {currentDivision.name}
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
                  {formatTalentsPrice(
                    currentProduct.priceCents,
                    currentProduct.currency,
                  )}
                </p>
                {currentProduct.timeline ? (
                  <>
                    <span className="h-3 w-px bg-[#121110]/12" />
                    <p className="font-sans text-sm uppercase tracking-[0.15em] text-[#121110]/55 md:text-base">
                      {currentProduct.timeline}
                    </p>
                  </>
                ) : null}
                {currentProduct.deliveryFormat ? (
                  <>
                    <span className="h-3 w-px bg-[#121110]/12" />
                    <p className="font-sans text-sm uppercase tracking-[0.15em] text-[#121110]/55 md:text-base">
                      {currentProduct.deliveryFormat}
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
                Chaque offre 21 Talents Agency est pensée pour renforcer la
                lecture du profil, la qualité des activations et la cohérence de
                visibilité du talent dans la durée.
              </p>

              <div className="pt-2">
                <p className="font-sans text-[0.62rem] uppercase tracking-[0.24em] text-[#121110]/40">
                  Inclus
                </p>
                <div className="mt-5 space-y-3">
                  {currentProduct.includes.map((item) => (
                    <p
                      key={item}
                      className="font-sans text-sm font-light leading-relaxed text-[#121110]/70 md:text-base"
                    >
                      {item}
                    </p>
                  ))}
                </div>
              </div>
            </div>

            <div className="flex flex-col gap-6 pt-4">
              <TalentsAddToCartForm product={currentProduct} />
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
