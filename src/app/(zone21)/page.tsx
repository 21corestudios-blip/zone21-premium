import type { Metadata } from "next";

import HomePageSections from "./_components/home/HomePageSections";

export const metadata: Metadata = {
  title: "Accueil",
  description:
    "ZONE 21 trace une direction hors tendance, entre maison créative, vêtement premium, image, musique, production, talents et narration.",
  openGraph: {
    title: "ZONE 21 | Hors tendance. Dans la bonne direction.",
    description:
      "Une maison créative indépendante pour des univers cohérents entre culture street, image, vêtement, musique, production et narration.",
    url: "/",
    siteName: "ZONE 21",
    locale: "fr_FR",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "ZONE 21 | Hors tendance. Dans la bonne direction.",
    description:
      "Un territoire hors tendance, dans la bonne direction, entre culture street, image, vêtement, musique, production et narration.",
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
