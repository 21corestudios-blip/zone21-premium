import type { Metadata } from 'next';
import Link from 'next/link';

import ClearCartOnSuccess from '@/app/(wear)/_components/checkout/ClearCartOnSuccess';

export const metadata: Metadata = {
  title: 'Commande confirmée | CO-KAIN',
  description: 'Votre commande CO-KAIN a bien été confirmée.',
  robots: {
    index: false,
    follow: false,
  },
  alternates: {
    canonical: '/wear/checkout/success',
  },
};

export default function SuccessPage() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-center bg-bg px-6 text-center text-text">
      <ClearCartOnSuccess />

      <div className="mb-8 flex h-20 w-20 items-center justify-center rounded-full bg-accent/10">
        <svg
          className="h-10 w-10 text-accent"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
          aria-hidden="true"
        >
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
        </svg>
      </div>

      <h1 className="mb-4 font-serif text-3xl md:text-5xl">Commande Confirmée</h1>

      <p className="mb-12 max-w-md font-sans text-sm uppercase tracking-[0.2em] opacity-50">
        Merci pour votre confiance. Vous recevrez un e-mail de confirmation sous peu.
      </p>

      <Link
        href="/wear"
        className="border border-text/20 px-8 py-4 text-[0.7rem] uppercase tracking-widest transition-all hover:bg-text hover:text-bg"
      >
        Retourner à la boutique
      </Link>
    </main>
  );
}
