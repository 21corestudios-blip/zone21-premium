import type { Metadata } from "next";

import { createMetadata } from "@/lib/seo/createMetadata";

import AboutPageSections from "../_components/about/AboutPageSections";

export const metadata: Metadata = createMetadata({
  title: "À Propos",
  socialTitle: "À Propos | ARCANE",
  description:
    "Découvrez la vision fondatrice de ARCANE, son origine, ses influences et les valeurs qui structurent son écosystème créatif.",
  path: "/a-propos",
});

export default function AboutPage() {
  return (
    <main className="flex min-h-screen flex-col bg-paper">
      <AboutPageSections />
    </main>
  );
}
