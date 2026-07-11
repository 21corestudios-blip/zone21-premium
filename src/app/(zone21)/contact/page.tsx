import type { Metadata } from "next";

import { createMetadata } from "@/lib/seo/createMetadata";

import ContactPageSections from "../_components/contact/ContactPageSections";

export const metadata: Metadata = createMetadata({
  title: "Contact",
  socialTitle: "Contact | ARCANE",
  description:
    "Contactez ARCANE pour une collaboration, une demande sur mesure ou toute question liée à l'écosystème de la maison.",
  path: "/contact",
});

export default function ContactPage() {
  return (
    <main className="flex min-h-screen flex-col bg-paper">
      <ContactPageSections />
    </main>
  );
}
