import type { Metadata } from "next";
import Image from "next/image";
import { notFound } from "next/navigation";

import WearProductsGrid from "@/app/(wear)/_components/wear/WearProductsGrid";
import { wearCollections } from "@/data/wear.catalog";
import { wearProducts } from "@/data/wear.products";

const collectionDescriptions: Record<string, string> = {
  classic:
    "CO-KAIN Classic Collection: t-shirts, hoodies et casquettes en premium streetwear sobre, cadrés pour un test POD Gelato sur le site ZONE 21.",
  urban:
    "Urban Collection par CO-KAIN: silhouettes confortables, volumes précis et énergie street pour une présence premium au quotidien, mobile et affirmée.",
  heritage:
    "Heritage Collection par CO-KAIN: mémoire des coupes, matières choisies et direction contemporaine pour un vestiaire premium affirmé, sobre et durable.",
  studio:
    "Studio Collection par CO-KAIN: textures, geste créatif et pièces expérimentales pour exprimer la signature atelier de CO-KAIN avec une présence premium.",
};

function getCollectionBrand(collectionSlug: string) {
  return collectionSlug === "classic" ? "CO-KAIN" : "CO-KAIN";
}

function getCollectionMetadataTitle(collectionSlug: string, name: string) {
  if (collectionSlug === "classic") {
    return "CO-KAIN Classic Collection - premium streetwear sobre";
  }

  return `${name} - CO-KAIN premium`;
}

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

  const brandName = getCollectionBrand(currentCollection.slug);
  const title = getCollectionMetadataTitle(
    currentCollection.slug,
    currentCollection.name,
  );
  const description =
    collectionDescriptions[currentCollection.slug] ||
    currentCollection.description;
  const canonical = `/wear/${currentCollection.slug}`;

  return {
    title,
    description,
    alternates: {
      canonical,
    },
    openGraph: {
      title: `${currentCollection.name} | ${brandName}`,
      description,
      url: canonical,
      siteName: "ARCANE",
      locale: "fr_FR",
      type: "website",
      images: [
        {
          url: currentCollection.heroImage,
          width: 2048,
          height: 1136,
          alt: `${currentCollection.name} - ${brandName}`,
        },
      ],
    },
    twitter: {
      card: "summary_large_image",
      title: `${currentCollection.name} | ${brandName}`,
      description,
      images: [
        {
          url: currentCollection.heroImage,
          alt: `${currentCollection.name} - ${brandName}`,
        },
      ],
    },
    robots: {
      index: true,
      follow: true,
    },
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

  const collectionProducts = wearProducts.filter(
    (product) => product.collection === collection,
  );
  const brandName = getCollectionBrand(currentCollection.slug);

  return (
    <main className="flex min-h-screen flex-col bg-paper">
      <section className="relative h-dvh min-h-screen w-full overflow-hidden bg-bg">
        <Image
          src={currentCollection.heroImage}
          alt={currentCollection.name}
          fill
          priority
          sizes="100vw"
          className="object-cover"
        />

        <div className="pointer-events-none absolute inset-0 bg-gradient-to-b from-transparent via-bg/10 to-bg/80 mix-blend-multiply" />

        <div className="absolute bottom-10 left-0 z-10 flex w-full justify-center px-6 md:bottom-16">
          <h1 className="font-serif text-3xl font-light tracking-wide text-white md:text-5xl lg:text-6xl">
            {currentCollection.name}
          </h1>
        </div>
      </section>

      <section className="mx-auto w-full max-w-4xl px-6 py-20 text-center md:px-12 md:py-24">
        <span className="font-sans text-[0.65rem] uppercase tracking-[0.3em] text-bg/40">
          {brandName}
        </span>

        <p className="mt-8 font-sans text-base font-light leading-relaxed text-bg/70 md:text-lg">
          {currentCollection.description}
        </p>
      </section>

      <WearProductsGrid collection={collection} products={collectionProducts} />
    </main>
  );
}
