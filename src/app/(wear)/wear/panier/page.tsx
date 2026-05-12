import type { Metadata } from "next";

import WearCartPage from "@/app/(wear)/_components/cart/WearCartPage";

export const metadata: Metadata = {
  title: "Panier",
  description:
    "Retrouvez votre sélection 21 Wear avant de passer au checkout.",
  alternates: {
    canonical: "/wear/panier",
  },
};

export default function WearCartRoutePage() {
  return (
    <main className="flex min-h-screen flex-col bg-white">
      <WearCartPage />
    </main>
  );
}
