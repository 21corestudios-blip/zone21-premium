import type { Metadata } from "next";

import CorePageSections from "../_components/core/CorePageSections";

export const metadata: Metadata = {
  title: "Core Studios - Design, web et objets de marque",
  description:
    "Core Studios crée identités visuelles, sites premium et objets marketing pour marques ambitieuses, avec direction artistique et exécution précise.",
  alternates: {
    canonical: "/core-studios",
  },
  openGraph: {
    title: "Core Studios | Design, web et objets de marque",
    description:
      "Core Studios crée identités visuelles, sites premium et objets marketing pour marques ambitieuses, avec direction artistique et exécution précise.",
    url: "/core-studios",
    siteName: "ARCANE",
    locale: "fr_FR",
    type: "website",
    images: [
      {
        url: "/images/brands/21-core/z21-21-core-studios-hero.webp",
        width: 2048,
        height: 1136,
        alt: "Core Studios - design, web et objets de marque",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Core Studios | Design, web et objets de marque",
    description:
      "Core Studios crée identités visuelles, sites premium et objets marketing pour marques ambitieuses, avec direction artistique et exécution précise.",
    images: [
      {
        url: "/images/brands/21-core/z21-21-core-studios-hero.webp",
        alt: "Core Studios - design, web et objets de marque",
      },
    ],
  },
};

export default function CorePage() {
  return (
    <main className="flex min-h-screen flex-col bg-paper">
      <CorePageSections />
    </main>
  );
}
