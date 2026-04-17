import type { Metadata } from "next";
import Image from "next/image";
import { notFound } from "next/navigation";

import { wearCollections } from "@/data/wear.catalog";

type PageProps = {
  params: Promise<{
    collection: string;
  }>;
};

export async function generateMetadata({
  params,
}: PageProps): Promise<Metadata> {
  const { collection } = await params;
  const currentCollection = wearCollections.find(
    (item) => item.slug === collection,
  );

  if (!currentCollection) {
    return {
      title: "Collection introuvable",
    };
  }

  return {
    title: currentCollection.name,
    description: currentCollection.description,
  };
}

export async function generateStaticParams() {
  return wearCollections.map((collection) => ({
    collection: collection.slug,
  }));
}

export default async function WearCollectionPage({ params }: PageProps) {
  const { collection } = await params;
  const currentCollection = wearCollections.find(
    (item) => item.slug === collection,
  );

  if (!currentCollection) {
    notFound();
  }

  return (
    <main className="flex min-h-screen flex-col bg-[#F7F5F0]">
      <section className="relative h-[100dvh] min-h-screen w-full overflow-hidden bg-[#121110]">
        <Image
          src={currentCollection.heroImage}
          alt={currentCollection.name}
          fill
          priority
          sizes="100vw"
          className="object-cover"
        />

        <div className="pointer-events-none absolute inset-0 bg-gradient-to-b from-transparent via-[#121110]/10 to-[#121110]/80 mix-blend-multiply" />

        <div className="absolute bottom-10 left-0 z-10 flex w-full justify-center px-6 md:bottom-16">
          <h1 className="font-serif text-3xl font-light tracking-wide text-white md:text-5xl lg:text-6xl">
            {currentCollection.name}
          </h1>
        </div>
      </section>

      <section className="flex min-h-screen items-center justify-center px-6 py-24 md:px-12">
        <div className="max-w-3xl text-center">
          <span className="font-sans text-[0.65rem] uppercase tracking-[0.3em] text-[#121110]/40">
            21 Wear
          </span>

          <p className="mt-8 font-sans text-base font-light leading-relaxed text-[#121110]/70 md:text-lg">
            {currentCollection.description}
          </p>
        </div>
      </section>
    </main>
  );
}
