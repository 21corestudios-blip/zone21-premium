import type { Metadata } from "next";

import EcosystemePageSections from "../_components/ecosysteme/EcosystemePageSections";

export const metadata: Metadata = {
  title: "Écosystème",
  description:
    "Découvrez l'écosystème ARCANE à travers ses maisons, ses univers et ses expressions créatives.",
  alternates: {
    canonical: "/ecosysteme",
  },
  openGraph: {
    title: "Écosystème | ARCANE",
    description:
      "Découvrez l'écosystème ARCANE à travers ses maisons, ses univers et ses expressions créatives.",
    url: "/ecosysteme",
    siteName: "ARCANE",
    locale: "fr_FR",
    type: "website",
  },
};

export default function EcosystemePage() {
  return (
    <main className="flex min-h-screen flex-col bg-paper">
      <EcosystemePageSections />
    </main>
  );
}
