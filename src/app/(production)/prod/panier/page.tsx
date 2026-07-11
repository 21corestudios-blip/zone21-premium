import type { Metadata } from "next";

import ProductionCartPage from "@/app/(production)/_components/cart/ProductionCartPage";
import { noIndexRobots } from "@/lib/seo/createMetadata";

export const metadata: Metadata = {
  title: "Panier",
  description:
    "Retrouvez votre sélection BACKSPIN avant validation de l'accès.",
  alternates: {
    canonical: "/prod/panier",
  },
  robots: noIndexRobots,
};

export default function ProductionCartRoutePage() {
  return (
    <main className="flex min-h-screen flex-col bg-white">
      <ProductionCartPage />
    </main>
  );
}
