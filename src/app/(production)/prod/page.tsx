import type { Metadata } from "next";

import { createMetadata } from "@/lib/seo/createMetadata";

import ProductionPageSections from "../_components/production/ProductionPageSections";

export const metadata: Metadata = createMetadata({
  title: "BACKSPIN - Label et ressources créatives",
  socialTitle: "BACKSPIN | Label et ressources créatives",
  description:
    "BACKSPIN réunit label, artistes et ressources créatives premium: beats, templates, loops et outils pensés pour produire avec signature.",
  path: "/prod",
  image: {
    url: "/images/brands/21-production/z21-21-production-hero.webp",
    width: 2048,
    height: 1136,
    alt: "BACKSPIN - label et ressources créatives",
  },
});

export default function ProductionPage() {
  return (
    <main className="flex min-h-screen flex-col bg-paper">
      <ProductionPageSections />
    </main>
  );
}
