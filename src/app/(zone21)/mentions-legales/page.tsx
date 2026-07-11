import type { Metadata } from "next";

import { createMetadata } from "@/lib/seo/createMetadata";

import LegalContent from "../_components/legal/LegalContent";

export const metadata: Metadata = createMetadata({
  title: "Mentions Légales",
  socialTitle: "Mentions Légales | ARCANE",
  description:
    "Consultez les mentions légales de la plateforme ARCANE : éditeur, hébergement, propriété intellectuelle, données personnelles et responsabilité.",
  path: "/mentions-legales",
  robots: {
    index: true,
    follow: true,
  },
});

export default function LegalPage() {
  return (
    <main className="min-h-screen bg-bg text-white">
      <LegalContent />
    </main>
  );
}
