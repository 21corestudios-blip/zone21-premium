import type { Metadata } from "next";

import { createMetadata } from "@/lib/seo/createMetadata";

import EcosystemePageSections from "../_components/ecosysteme/EcosystemePageSections";

export const metadata: Metadata = createMetadata({
  title: "Écosystème",
  socialTitle: "Écosystème | ARCANE",
  description:
    "Découvrez l'écosystème ARCANE à travers ses maisons, ses univers et ses expressions créatives.",
  path: "/ecosysteme",
});

export default function EcosystemePage() {
  return (
    <main className="flex min-h-screen flex-col bg-paper">
      <EcosystemePageSections />
    </main>
  );
}
