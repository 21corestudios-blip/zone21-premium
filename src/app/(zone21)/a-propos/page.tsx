import type { Metadata } from "next";

import AboutPageSections from "../_components/about/AboutPageSections";

export const metadata: Metadata = {
  title: "À Propos",
  description:
    "Découvrez la vision fondatrice de Zone 21, son origine, ses influences et les valeurs qui structurent son écosystème créatif.",
  alternates: {
    canonical: "/a-propos",
  },
  openGraph: {
    title: "À Propos | ZONE 21",
    description:
      "Découvrez la vision fondatrice de Zone 21, son origine, ses influences et les valeurs qui structurent son écosystème créatif.",
    url: "/a-propos",
    siteName: "ZONE 21",
    locale: "fr_FR",
    type: "website",
  },
};

export default function AboutPage() {
  return (
    <main className="flex min-h-screen flex-col bg-[#F7F5F0]">
      <AboutPageSections />
    </main>
  );
}
