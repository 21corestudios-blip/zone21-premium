import type { Metadata } from "next";

import TalentsPageSections from "../_components/talents/TalentsPageSections";

export const metadata: Metadata = {
  title: "EKKO - Influence et talents premium",
  description:
    "EKKO accompagne talents, profils créatifs et campagnes d’influence avec stratégie, visibilité, représentation et activation premium.",
  alternates: {
    canonical: "/talents-agency",
  },
  openGraph: {
    title: "EKKO | Influence et talents premium",
    description:
      "EKKO accompagne talents, profils créatifs et campagnes d’influence avec stratégie, visibilité, représentation et activation premium.",
    url: "/talents-agency",
    siteName: "ARCANE",
    locale: "fr_FR",
    type: "website",
    images: [
      {
        url: "/images/brands/21-talents/z21-21-talents-agency-hero-1.webp",
        width: 2048,
        height: 1136,
        alt: "EKKO - influence et talents premium",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "EKKO | Influence et talents premium",
    description:
      "EKKO accompagne talents, profils créatifs et campagnes d’influence avec stratégie, visibilité, représentation et activation premium.",
    images: [
      {
        url: "/images/brands/21-talents/z21-21-talents-agency-hero-1.webp",
        alt: "EKKO - influence et talents premium",
      },
    ],
  },
};

export default function TalentsPage() {
  return (
    <main className="flex min-h-screen flex-col bg-[#F7F5F0]">
      <TalentsPageSections />
    </main>
  );
}
