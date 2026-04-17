import type { Metadata } from "next";
import { Suspense } from "react";

import WearCheckoutStatus from "@/app/(wear)/_components/checkout/WearCheckoutStatus";

export const metadata: Metadata = {
  title: "Paiement",
  description:
    "Consultez le statut réel du paiement 21 Wear après le retour Stripe.",
  alternates: {
    canonical: "/wear/checkout/success",
  },
};

export default function WearCheckoutSuccessPage() {
  return (
    <main className="flex min-h-screen flex-col bg-[#F7F5F0]">
      <Suspense
        fallback={
          <section className="mx-auto flex min-h-[60vh] w-full max-w-5xl items-center justify-center px-6 py-24 md:px-12">
            <p className="font-sans text-[0.68rem] uppercase tracking-[0.3em] text-[#121110]/45">
              Vérification du paiement...
            </p>
          </section>
        }
      >
        <WearCheckoutStatus />
      </Suspense>
    </main>
  );
}
