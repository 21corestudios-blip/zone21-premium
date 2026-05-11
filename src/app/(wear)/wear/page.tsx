import type { Metadata } from "next";

import WearPageSections from "../_components/wear/WearPageSections";

export const metadata: Metadata = {
  title: "M33 - Vêtement premium et culture street",
  description:
    "M33 signe un vestiaire premium entre coupes essentielles, matières maîtrisées et culture street, pour des silhouettes sobres, durables et affirmées.",
  alternates: {
    canonical: "/wear",
  },
  openGraph: {
    title: "M33 | Vêtement premium et culture street",
    description:
      "M33 signe un vestiaire premium entre coupes essentielles, matières maîtrisées et culture street, pour des silhouettes sobres, durables et affirmées.",
    url: "/wear",
    siteName: "ARCANE",
    locale: "fr_FR",
    type: "website",
    images: [
      {
        url: "/images/brands/21-wear/z21-21-wear-hero-1.webp",
        width: 2048,
        height: 1136,
        alt: "M33 - vêtement premium et culture street",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "M33 | Vêtement premium et culture street",
    description:
      "M33 signe un vestiaire premium entre coupes essentielles, matières maîtrisées et culture street, pour des silhouettes sobres, durables et affirmées.",
    images: [
      {
        url: "/images/brands/21-wear/z21-21-wear-hero-1.webp",
        alt: "M33 - vêtement premium et culture street",
      },
    ],
  },
};

export default function WearPage() {
  return (
    <main className="flex min-h-screen flex-col bg-[#F7F5F0]">
      <WearPageSections />
    </main>
  );
}
