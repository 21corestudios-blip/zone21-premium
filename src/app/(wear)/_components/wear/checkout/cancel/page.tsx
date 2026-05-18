import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Paiement annulé | 21 Wear",
  description: "Le paiement a été annulé. Votre panier 21 Wear a été conservé.",
  robots: {
    index: false,
    follow: false,
  },
  alternates: {
    canonical: "/wear/checkout/cancel",
  },
};

export default function CancelPage() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-center bg-bg px-6 text-center text-text">
      <div className="mb-8 flex h-20 w-20 items-center justify-center rounded-full bg-white/5">
        <svg
          className="h-10 w-10 text-accent"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
          aria-hidden="true"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth="2"
            d="M6 6l12 12M18 6 6 18"
          />
        </svg>
      </div>

      <h1 className="mb-4 font-serif text-3xl md:text-5xl">Paiement annulé</h1>

      <p className="mb-12 max-w-md font-sans text-sm uppercase tracking-[0.2em] opacity-50">
        Votre panier a été conservé. Vous pouvez reprendre vos achats à tout
        moment.
      </p>

      <Link
        href="/wear"
        className="text-[0.7rem] uppercase tracking-widest text-accent underline underline-offset-8 transition-colors hover:text-text"
      >
        Retourner au catalogue
      </Link>
    </main>
  );
}
