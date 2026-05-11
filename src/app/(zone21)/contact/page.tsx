import type { Metadata } from "next";

import ContactPageSections from "../_components/contact/ContactPageSections";

export const metadata: Metadata = {
  title: "Contact",
  description:
    "Contactez ARCANE pour une collaboration, une demande sur mesure ou toute question liée à l'écosystème de la maison.",
  alternates: {
    canonical: "/contact",
  },
  openGraph: {
    title: "Contact | ARCANE",
    description:
      "Contactez ARCANE pour une collaboration, une demande sur mesure ou toute question liée à l'écosystème de la maison.",
    url: "/contact",
    siteName: "ARCANE",
    locale: "fr_FR",
    type: "website",
  },
};

export default function ContactPage() {
  return (
    <main className="flex min-h-screen flex-col bg-[#F7F5F0]">
      <ContactPageSections />
    </main>
  );
}
