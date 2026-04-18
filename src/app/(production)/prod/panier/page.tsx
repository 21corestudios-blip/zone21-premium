import type { Metadata } from "next";

import ProductionCartPage from "@/app/(production)/_components/cart/ProductionCartPage";

export const metadata: Metadata = {
  title: "Panier",
  description:
    "Retrouvez votre sélection 21 Production avant validation de l'accès.",
  alternates: {
    canonical: "/prod/panier",
  },
};

export default function ProductionCartRoutePage() {
  return (
    <main className="flex min-h-screen flex-col bg-white">
      <ProductionCartPage />
    </main>
  );
}
