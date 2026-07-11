import type { Metadata } from "next";

import WearCheckoutClient from "@/app/(wear)/_components/checkout/WearCheckoutClient";
import { noIndexRobots } from "@/lib/seo/createMetadata";

export const metadata: Metadata = {
  title: "Checkout",
  description:
    "Finalisez votre sélection 21 Wear avant le paiement et vérifiez vos informations client.",
  alternates: {
    canonical: "/wear/checkout",
  },
  robots: noIndexRobots,
};

export default function WearCheckoutPage() {
  return (
    <main className="flex min-h-screen flex-col bg-white">
      <WearCheckoutClient />
    </main>
  );
}
