import type { Metadata } from "next";

import EcosystemePageSections from "../_components/ecosysteme/EcosystemePageSections";

export const metadata: Metadata = {
  title: "Écosystème",
  description:
    "Découvrez l'écosystème Zone 21 à travers ses maisons, ses univers et ses expressions créatives.",
  alternates: {
    canonical: "/ecosysteme",
  },
  openGraph: {
    title: "Écosystème | ZONE 21",
    description:
      "Découvrez l'écosystème Zone 21 à travers ses maisons, ses univers et ses expressions créatives.",
    url: "/ecosysteme",
    siteName: "ZONE 21",
    locale: "fr_FR",
    type: "website",
  },
};

export default function EcosystemePage() {
  return (
    <main className="flex min-h-screen flex-col bg-[#F7F5F0]">
      <EcosystemePageSections />
    </main>
  );
}
