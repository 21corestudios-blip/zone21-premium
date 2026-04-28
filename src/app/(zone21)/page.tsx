import type { Metadata } from "next";

import HomePageSections from "./_components/home/HomePageSections";

export const metadata: Metadata = {
  title: "Accueil",
  description:
    "ZONE 21 construit des univers hors tendance, mais dans la bonne direction : vêtement, image, musique, production et récits autour d’une même exigence créative.",
  openGraph: {
    title: "ZONE 21 | Hors tendance. Dans la bonne direction.",
    description:
      "ZONE 21 construit des univers créatifs entre culture street, image, vêtement, musique, production et narration.",
    url: "/",
    siteName: "ZONE 21",
    locale: "fr_FR",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "ZONE 21 | Hors tendance. Dans la bonne direction.",
    description:
      "Un territoire créatif entre culture street, image, vêtement, musique, production et narration.",
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
