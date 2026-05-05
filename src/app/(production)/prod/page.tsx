import type { Metadata } from "next";

import ProductionPageSections from "../_components/production/ProductionPageSections";

export const metadata: Metadata = {
  title: "21 Production - Label et ressources créatives",
  description:
    "21 Production réunit label, artistes et ressources créatives premium: beats, templates, loops et outils pensés pour produire avec signature.",
  alternates: {
    canonical: "/prod",
  },
  openGraph: {
    title: "21 Production | Label et ressources créatives",
    description:
      "21 Production réunit label, artistes et ressources créatives premium: beats, templates, loops et outils pensés pour produire avec signature.",
    url: "/prod",
    siteName: "ZONE 21",
    locale: "fr_FR",
    type: "website",
    images: [
      {
        url: "/images/brands/21-production/z21-21-production-hero.webp",
        width: 2048,
        height: 1136,
        alt: "21 Production - label et ressources créatives",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "21 Production | Label et ressources créatives",
    description:
      "21 Production réunit label, artistes et ressources créatives premium: beats, templates, loops et outils pensés pour produire avec signature.",
    images: [
      {
        url: "/images/brands/21-production/z21-21-production-hero.webp",
        alt: "21 Production - label et ressources créatives",
      },
    ],
  },
};

export default function ProductionPage() {
  return (
    <main className="flex min-h-screen flex-col bg-[#F7F5F0]">
      <ProductionPageSections />
    </main>
  );
}
