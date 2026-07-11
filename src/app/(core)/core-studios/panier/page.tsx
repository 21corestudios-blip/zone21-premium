import type { Metadata } from "next";

import CoreCartPage from "@/app/(core)/_components/cart/CoreCartPage";
import { noIndexRobots } from "@/lib/seo/createMetadata";

export const metadata: Metadata = {
  title: "Panier",
  description:
    "Retrouvez votre sélection Core Studios avant cadrage et validation.",
  alternates: {
    canonical: "/core-studios/panier",
  },
  robots: noIndexRobots,
};

export default function CoreCartRoutePage() {
  return (
    <main className="flex min-h-screen flex-col bg-white">
      <CoreCartPage />
    </main>
  );
}
