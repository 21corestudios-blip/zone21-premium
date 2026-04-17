import type { Metadata } from 'next';

import CheckoutPageContent from '@/app/(wear)/_components/checkout/CheckoutPageContent';

export const metadata: Metadata = {
  title: 'Checkout | 21 Wear',
  description: 'Finalisez votre commande 21 Wear avant redirection vers le paiement sécurisé.',
  robots: {
    index: false,
    follow: false,
  },
  alternates: {
    canonical: '/wear/checkout',
  },
};

export default function CheckoutPage() {
  return <CheckoutPageContent />;
}
