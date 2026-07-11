import type { Metadata } from "next";

import { createMetadata } from "@/lib/seo/createMetadata";

import TalentsPageSections from "../_components/talents/TalentsPageSections";

export const metadata: Metadata = createMetadata({
  title: "EKKO - Influence et talents premium",
  socialTitle: "EKKO | Influence et talents premium",
  description:
    "EKKO accompagne talents, profils créatifs et campagnes d’influence avec stratégie, visibilité, représentation et activation premium.",
  path: "/talents-agency",
  image: {
    url: "/images/brands/21-talents/z21-21-talents-agency-hero-1.webp",
    width: 2048,
    height: 1136,
    alt: "EKKO - influence et talents premium",
  },
});

export default function TalentsPage() {
  return (
    <main className="flex min-h-screen flex-col bg-paper">
      <TalentsPageSections />
    </main>
  );
}
