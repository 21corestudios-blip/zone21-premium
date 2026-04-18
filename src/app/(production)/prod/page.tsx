import type { Metadata } from "next";

import ProductionPageSections from "../_components/production/ProductionPageSections";

export const metadata: Metadata = {
  title: "21 PRODUCTION",
  description:
    "Découvrez 21 Production, le label et studio de ressources créatives de l'écosystème Zone 21.",
  alternates: {
    canonical: "/prod",
  },
  openGraph: {
    title: "21 PRODUCTION | Label & Artist Stores",
    description:
      "Roster d'artistes, beats, templates, plug-ins et outils créatifs signés 21 Production.",
    url: "/prod",
    siteName: "ZONE 21",
    locale: "fr_FR",
    type: "website",
  },
};

export default function ProductionPage() {
  return (
    <main className="flex min-h-screen flex-col bg-[#F7F5F0]">
      <ProductionPageSections />
    </main>
  );
}
