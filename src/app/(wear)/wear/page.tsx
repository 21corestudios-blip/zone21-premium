import type { Metadata } from "next";

import WearPageSections from "../_components/wear/WearPageSections";

export const metadata: Metadata = {
  title: "21 WEAR",
  description:
    "Découvrez 21 Wear, la maison de prêt-à-porter de l'écosystème Zone 21.",
  alternates: {
    canonical: "/wear",
  },
  openGraph: {
    title: "21 WEAR | L'Essence de la Matière",
    description:
      "Découvrez 21 Wear, la maison de prêt-à-porter de l'écosystème Zone 21.",
    url: "/wear",
    siteName: "ZONE 21",
    locale: "fr_FR",
    type: "website",
  },
};

export default function WearPage() {
  return (
    <main className="flex min-h-screen flex-col bg-[#F7F5F0]">
      <WearPageSections />
    </main>
  );
}
