import type { Metadata } from "next";

import TalentsCartPage from "@/app/(talents)/_components/cart/TalentsCartPage";

export const metadata: Metadata = {
  title: "Panier",
  description:
    "Retrouvez votre sélection 21 Talents Agency avant cadrage et validation.",
  alternates: {
    canonical: "/talents-agency/panier",
  },
};

export default function TalentsCartRoutePage() {
  return (
    <main className="flex min-h-screen flex-col bg-white">
      <TalentsCartPage />
    </main>
  );
}
