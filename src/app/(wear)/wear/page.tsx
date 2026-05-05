import type { Metadata } from "next";

import WearPageSections from "../_components/wear/WearPageSections";

export const metadata: Metadata = {
  title: "21 Wear - Vêtement premium et culture street",
  description:
    "21 Wear signe des vêtements premium entre coupes essentielles, matières maîtrisées et culture street, pensés pour une présence sobre et durable.",
  alternates: {
    canonical: "/wear",
  },
  openGraph: {
    title: "21 Wear | Vêtement premium et culture street",
    description:
      "21 Wear signe des vêtements premium entre coupes essentielles, matières maîtrisées et culture street, pensés pour une présence sobre et durable.",
    url: "/wear",
    siteName: "ZONE 21",
    locale: "fr_FR",
    type: "website",
    images: [
      {
        url: "/images/brands/21-wear/z21-21-wear-hero-1.webp",
        width: 2048,
        height: 1136,
        alt: "21 Wear - vêtement premium et culture street",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "21 Wear | Vêtement premium et culture street",
    description:
      "21 Wear signe des vêtements premium entre coupes essentielles, matières maîtrisées et culture street, pensés pour une présence sobre et durable.",
    images: [
      {
        url: "/images/brands/21-wear/z21-21-wear-hero-1.webp",
        alt: "21 Wear - vêtement premium et culture street",
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
