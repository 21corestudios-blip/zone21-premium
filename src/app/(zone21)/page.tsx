import type { Metadata } from "next";

import HomePageSections from "./_components/home/HomePageSections";

export const metadata: Metadata = {
  title: "Accueil",
  description:
    "Découvrez Zone 21 : l'architecture créative dédiée à l'émergence des maisons de demain. Explorez 21 Wear, 21 Core Studios et 21 Production.",
  openGraph: {
    title: "ZONE 21 | L'Exigence pour Signature",
    description:
      "Découvrez Zone 21 : l'architecture créative dédiée à l'émergence des maisons de demain. Explorez 21 Wear, 21 Core Studios et 21 Production.",
    url: "/",
    siteName: "ZONE 21",
    locale: "fr_FR",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "ZONE 21 | L'Exigence pour Signature",
    description:
      "Découvrez Zone 21 : l'architecture créative dédiée à l'émergence des maisons de demain. Explorez 21 Wear, 21 Core Studios et 21 Production.",
  },
  alternates: {
    canonical: "/",
  },
};

export default function HomePage() {
  return (
    <main className="flex min-h-screen w-full flex-col bg-[#F7F5F0] selection:bg-[#121110] selection:text-[#F7F5F0]">
      <HomePageSections />
    </main>
  );
}
