import type { Metadata } from "next";
import Image from "next/image";
import { notFound } from "next/navigation";

import TalentsProductsGrid from "@/app/(talents)/_components/talents/TalentsProductsGrid";
import { talentDivisions } from "@/data/talents.divisions";
import { talentsProducts } from "@/data/talents.products";

type PageProps = {
  params: Promise<{
    division: string;
  }>;
};

export async function generateMetadata({
  params,
}: PageProps): Promise<Metadata> {
  const { division } = await params;
  const currentDivision = talentDivisions.find((item) => item.slug === division);

  if (!currentDivision) {
    return {
      title: "Division introuvable",
    };
  }

  return {
    title: currentDivision.name,
    description: currentDivision.description,
  };
}

export async function generateStaticParams() {
  return talentDivisions.map((division) => ({
    division: division.slug,
  }));
}

export default async function TalentsDivisionPage({ params }: PageProps) {
  const { division } = await params;
  const currentDivision = talentDivisions.find((item) => item.slug === division);

  if (!currentDivision) {
    notFound();
  }

  const divisionProducts = talentsProducts.filter(
    (product) => product.division === division,
  );

  return (
    <main className="flex min-h-screen flex-col bg-[#F7F5F0]">
      <section className="relative h-[100dvh] min-h-screen w-full overflow-hidden bg-[#121110]">
        <Image
          src={currentDivision.heroImage}
          alt={currentDivision.name}
          fill
          priority
          sizes="100vw"
          className="object-cover"
        />

        <div className="pointer-events-none absolute inset-0 bg-gradient-to-b from-transparent via-[#121110]/10 to-[#121110]/80 mix-blend-multiply" />

        <div className="absolute bottom-10 left-0 z-10 flex w-full justify-center px-6 md:bottom-16">
          <div className="text-center">
            <p className="font-sans text-[0.68rem] uppercase tracking-[0.3em] text-white/58">
              {currentDivision.role}
            </p>
            <h1 className="mt-6 font-serif text-3xl font-light tracking-wide text-white md:text-5xl lg:text-6xl">
              {currentDivision.name}
            </h1>
          </div>
        </div>
      </section>

      <section className="mx-auto w-full max-w-4xl px-6 py-20 text-center md:px-12 md:py-24">
        <span className="font-sans text-[0.65rem] uppercase tracking-[0.3em] text-[#121110]/40">
          21 Talents Agency
        </span>

        <p className="mt-8 font-sans text-base font-light leading-relaxed text-[#121110]/70 md:text-lg">
          {currentDivision.description}
        </p>

        <p className="mt-6 font-sans text-base font-light leading-relaxed text-[#121110]/70 md:text-lg">
          {currentDivision.tagline}
        </p>
      </section>

      <TalentsProductsGrid divisionSlug={division} products={divisionProducts} />
    </main>
  );
}
