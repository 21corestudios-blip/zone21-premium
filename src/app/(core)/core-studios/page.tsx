import type { Metadata } from "next";

import CorePageSections from "../_components/core/CorePageSections";

export const metadata: Metadata = {
  title: "21 CORE STUDIOS",
  description:
    "Découvrez 21 Core Studios, l'agence design, web design, codage et graphisme de l'écosystème Zone 21.",
  alternates: {
    canonical: "/core-studios",
  },
  openGraph: {
    title: "21 CORE STUDIOS | Design, Web & Brand Objects",
    description:
      "Prestations créatives, design systems, expériences web et produits marketing signés 21 Core Studios.",
    url: "/core-studios",
    siteName: "ZONE 21",
    locale: "fr_FR",
    type: "website",
  },
};

export default function CorePage() {
  return (
    <main className="flex min-h-screen flex-col bg-[#F7F5F0]">
      <CorePageSections />
    </main>
  );
}
