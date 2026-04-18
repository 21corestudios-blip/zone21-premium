import type { Metadata } from "next";

import TalentsPageSections from "../_components/talents/TalentsPageSections";

export const metadata: Metadata = {
  title: "21 TALENTS AGENCY",
  description:
    "Découvrez 21 Talents Agency, l'agence de promotion de talents et d'influence de l'écosystème Zone 21.",
  alternates: {
    canonical: "/talents-agency",
  },
  openGraph: {
    title: "21 TALENTS AGENCY | Influence, Visibility & Talent Growth",
    description:
      "Représentation, campagnes, activations et cadrage de profils talent signés 21 Talents Agency.",
    url: "/talents-agency",
    siteName: "ZONE 21",
    locale: "fr_FR",
    type: "website",
  },
};

export default function TalentsPage() {
  return (
    <main className="flex min-h-screen flex-col bg-[#F7F5F0]">
      <TalentsPageSections />
    </main>
  );
}
