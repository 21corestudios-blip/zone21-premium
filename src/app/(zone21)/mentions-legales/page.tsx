import type { Metadata } from "next";

import LegalContent from "../_components/legal/LegalContent";

export const metadata: Metadata = {
  title: "Mentions Légales",
  description:
    "Consultez les mentions légales de la plateforme Zone 21 : éditeur, hébergement, propriété intellectuelle, données personnelles et responsabilité.",
  alternates: {
    canonical: "/mentions-legales",
  },
  openGraph: {
    title: "Mentions Légales | ZONE 21",
    description:
      "Consultez les mentions légales de la plateforme Zone 21 : éditeur, hébergement, propriété intellectuelle, données personnelles et responsabilité.",
    url: "/mentions-legales",
    siteName: "ZONE 21",
    locale: "fr_FR",
    type: "website",
  },
  robots: {
    index: true,
    follow: true,
  },
};

export default function LegalPage() {
  return (
    <main className="min-h-screen bg-[#121110] text-white">
      <LegalContent />
    </main>
  );
}
