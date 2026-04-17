import type { Metadata } from "next";

import ContactPageSections from "../_components/contact/ContactPageSections";

export const metadata: Metadata = {
  title: "Contact",
  description:
    "Contactez Zone 21 pour une collaboration, une demande sur mesure ou toute question liée à l'écosystème de la maison.",
  alternates: {
    canonical: "/contact",
  },
  openGraph: {
    title: "Contact | ZONE 21",
    description:
      "Contactez Zone 21 pour une collaboration, une demande sur mesure ou toute question liée à l'écosystème de la maison.",
    url: "/contact",
    siteName: "ZONE 21",
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
