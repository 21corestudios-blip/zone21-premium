import type { Metadata } from "next";

import { createMetadata } from "@/lib/seo/createMetadata";

import CorePageSections from "../_components/core/CorePageSections";

export const metadata: Metadata = createMetadata({
  title: "Core Studios - Design, web et objets de marque",
  socialTitle: "Core Studios | Design, web et objets de marque",
  description:
    "Core Studios crée identités visuelles, sites premium et objets marketing pour marques ambitieuses, avec direction artistique et exécution précise.",
  path: "/core-studios",
  image: {
    url: "/images/brands/21-core/z21-21-core-studios-hero.webp",
    width: 2048,
    height: 1136,
    alt: "Core Studios - design, web et objets de marque",
  },
});

export default function CorePage() {
  return (
    <main className="flex min-h-screen flex-col bg-paper">
      <CorePageSections />
    </main>
  );
}
