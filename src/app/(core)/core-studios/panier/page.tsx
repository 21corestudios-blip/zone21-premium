import type { Metadata } from "next";

import CoreCartPage from "@/app/(core)/_components/cart/CoreCartPage";

export const metadata: Metadata = {
  title: "Panier",
  description:
    "Retrouvez votre sélection 21 Core Studios avant cadrage et validation.",
  alternates: {
    canonical: "/core-studios/panier",
  },
};

export default function CoreCartRoutePage() {
  return (
    <main className="flex min-h-screen flex-col bg-white">
      <CoreCartPage />
    </main>
  );
}
