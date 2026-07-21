import type { Metadata } from 'next';

import CheckoutPageContent from '@/app/(wear)/_components/checkout/CheckoutPageContent';

export const metadata: Metadata = {
  title: 'Checkout | CO-KAIN',
  description: 'Finalisez votre commande CO-KAIN avant redirection vers le paiement sécurisé.',
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
