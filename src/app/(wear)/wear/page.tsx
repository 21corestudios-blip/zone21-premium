import type { Metadata } from "next";

import { createMetadata } from "@/lib/seo/createMetadata";

import WearPageSections from "../_components/wear/WearPageSections";

export const metadata: Metadata = createMetadata({
  title: "21 Wear - Vêtement premium et culture street",
  socialTitle: "21 Wear | Vêtement premium et culture street",
  description:
    "21 Wear signe un vestiaire premium entre coupes essentielles, matières maîtrisées et culture street, pour des silhouettes sobres, durables et affirmées.",
  path: "/wear",
  image: {
    url: "/images/brands/21-wear/BLONDE T-SHIRT ROSE 16-9.jpg",
    width: 2048,
    height: 1136,
    alt: "21 Wear - vêtement premium et culture street",
  },
});

export default function WearPage() {
  return (
    <main className="flex min-h-screen flex-col bg-paper">
      <WearPageSections />
    </main>
  );
}
