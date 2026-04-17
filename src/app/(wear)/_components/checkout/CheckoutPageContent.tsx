'use client';

import { useEffect, useMemo, useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';

import Button from '@/components/ui/Button';
import Icon from '@/components/ui/Icon';
import { type Region } from '@/data/products.data';
import useIsClient from '@/hooks/useIsClient';
import { useCartStore } from '@/store/cartStore';

const DEFAULT_REGION: Region = 'EU';

function getCurrencyForRegion(region: Region): string {
  return region === 'EU' ? 'EUR' : 'USD';
}

export default function CheckoutPageContent() {
  const {
    items,
    region,
    removeItem,
    getTotalItems,
    getTotalPrice,
    hydrateRegionFromCookie,
  } = useCartStore();

  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const isClient = useIsClient();

  useEffect(() => {
    hydrateRegionFromCookie();
  }, [hydrateRegionFromCookie]);

  const currentRegion: Region = isClient ? region : DEFAULT_REGION;
  const currency = getCurrencyForRegion(currentRegion);
  const totalItems = isClient ? getTotalItems() : 0;
  const totalPrice = isClient ? getTotalPrice() : 0;

  const formattedTotal = useMemo(() => {
    if (!isClient) {
      return '—';
    }

    return new Intl.NumberFormat('fr-FR', {
      style: 'currency',
      currency,
    }).format(totalPrice);
  }, [currency, isClient, totalPrice]);

  const handleCheckout = async () => {
    if (!items.length) {
      return;
    }

    setIsLoading(true);
    setErrorMessage(null);

    try {
      const response = await fetch('/api/checkout', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          items,
          region: currentRegion,
        }),
      });

      const data = (await response.json()) as { error?: string; url?: string };

      if (!response.ok || !data.url) {
        throw new Error(data.error || 'Impossible de créer la session de paiement.');
      }

      window.location.href = data.url;
    } catch (error) {
      const message =
        error instanceof Error ? error.message : 'Impossible de créer la session de paiement.';

      setErrorMessage(message);
      setIsLoading(false);
    }
  };

  if (!isClient) {
    return null;
  }

  return (
    <main className="min-h-screen bg-[#121110] px-6 pb-20 pt-32 text-[#EAE8E3] md:px-12 lg:px-24">
      <div className="mx-auto flex w-full max-w-7xl flex-col gap-10">
        <header className="flex max-w-3xl flex-col gap-5">
          <span className="font-sans text-[0.65rem] uppercase tracking-[0.3em] text-white/40">
            21 Wear
          </span>

          <div className="flex flex-col gap-4">
            <h1 className="font-serif text-4xl leading-[1.02] tracking-[-0.02em] md:text-6xl">
              Finaliser la commande.
            </h1>

            <p className="max-w-2xl font-sans text-sm font-light leading-relaxed text-white/70 md:text-base">
              Vérifiez votre sélection, confirmez votre région active et poursuivez vers le
              paiement sécurisé Stripe.
            </p>
          </div>
        </header>

        {items.length === 0 ? (
          <section className="flex min-h-[50vh] flex-col items-center justify-center border border-white/10 bg-white/[0.03] px-8 py-12 text-center">
            <div className="mb-6 flex h-20 w-20 items-center justify-center rounded-full bg-white/5">
              <Icon size={40} className="text-[#C5B39B]">
                <path d="M6 2 3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4Z" />
                <path d="M3 6h18" />
                <path d="M16 10a4 4 0 0 1-8 0" />
              </Icon>
            </div>

            <h2 className="font-serif text-2xl md:text-4xl">Votre panier est vide</h2>

            <p className="mt-4 max-w-md font-sans text-sm font-light leading-relaxed text-white/60">
              Ajoutez une pièce à votre sélection avant de poursuivre vers le checkout.
            </p>

            <div className="mt-8">
              <Button href="/wear" variant="gold">
                Retour à la boutique
              </Button>
            </div>
          </section>
        ) : (
          <div className="grid grid-cols-1 gap-10 lg:grid-cols-[minmax(0,1.1fr)_420px]">
            <section className="border border-white/10 bg-white/[0.03] p-6 md:p-8">
              <div className="mb-8 flex items-end justify-between gap-6 border-b border-white/10 pb-6">
                <div>
                  <p className="font-sans text-[0.65rem] uppercase tracking-[0.2em] text-white/40">
                    Sélection
                  </p>
                  <h2 className="mt-3 font-serif text-2xl md:text-3xl">
                    {totalItems} article{totalItems > 1 ? 's' : ''}
                  </h2>
                </div>

                <Link
                  href="/wear"
                  className="font-sans text-[0.65rem] uppercase tracking-[0.18em] text-[#C5B39B] transition-colors hover:text-white"
                >
                  Continuer les achats
                </Link>
              </div>

              <div className="flex flex-col gap-6">
                {items.map((item) => {
                  const regionalInfo =
                    item.product.regions[currentRegion] ?? item.product.regions[DEFAULT_REGION];

                  const formattedUnitPrice = new Intl.NumberFormat('fr-FR', {
                    style: 'currency',
                    currency: regionalInfo.currency,
                  }).format(regionalInfo.price);

                  return (
                    <article
                      key={`${item.product.id}-${item.size}`}
                      className="grid grid-cols-[110px_1fr] gap-5 border-b border-white/10 pb-6"
                    >
                      <div className="aspect-[4/5] overflow-hidden bg-[#1a1918]">
                        <Image
                          src={item.product.image}
                          alt={item.product.name}
                          width={110}
                          height={138}
                          sizes="110px"
                          className="block h-full w-full object-cover"
                        />
                      </div>

                      <div className="flex flex-col justify-between gap-5">
                        <div className="flex flex-col gap-2">
                          <div className="flex flex-wrap items-center gap-2">
                            <span className="border border-white/10 px-3 py-1 font-sans text-[0.6rem] uppercase tracking-[0.16em] text-white/45">
                              {item.product.collection}
                            </span>

                            <span className="border border-white/10 px-3 py-1 font-sans text-[0.6rem] uppercase tracking-[0.16em] text-white/45">
                              Taille {item.size}
                            </span>
                          </div>

                          <h3 className="font-serif text-xl text-white">{item.product.name}</h3>

                          <p className="font-sans text-sm font-light leading-relaxed text-white/65">
                            {formattedUnitPrice} · Quantité {item.quantity}
                          </p>
                        </div>

                        <button
                          type="button"
                          onClick={() => removeItem(item.product.id, item.size)}
                          className="w-fit font-sans text-[0.65rem] uppercase tracking-[0.18em] text-white/40 transition-colors hover:text-[#C5B39B]"
                        >
                          Retirer
                        </button>
                      </div>
                    </article>
                  );
                })}
              </div>
            </section>

            <aside className="h-fit border border-white/10 bg-[#1a1918] p-6 md:p-8 lg:sticky lg:top-32">
              <div className="border-b border-white/10 pb-6">
                <p className="font-sans text-[0.65rem] uppercase tracking-[0.2em] text-white/40">
                  Récapitulatif
                </p>

                <h2 className="mt-3 font-serif text-2xl md:text-3xl">Sous-total</h2>
              </div>

              <div className="space-y-4 py-6">
                <div className="flex items-center justify-between font-sans text-sm text-white/65">
                  <span>Articles</span>
                  <span>{totalItems}</span>
                </div>

                <div className="flex items-center justify-between font-sans text-sm text-white/65">
                  <span>Région</span>
                  <span>{currentRegion}</span>
                </div>

                <div className="flex items-center justify-between border-t border-white/10 pt-4">
                  <span className="font-sans text-[0.7rem] uppercase tracking-[0.2em] text-white/45">
                    Sous-total
                  </span>

                  <span className="font-serif text-2xl text-[#C5B39B]">{formattedTotal}</span>
                </div>
              </div>

              <p className="mb-6 font-sans text-sm font-light leading-relaxed text-white/55">
                Les frais de livraison et taxes éventuelles seront calculés dans Stripe selon
                l’adresse de destination.
              </p>

              {errorMessage ? (
                <div className="mb-6 border border-[#C5B39B]/20 bg-[#C5B39B]/5 px-4 py-4">
                  <p className="font-sans text-sm font-light leading-relaxed text-white/80">
                    {errorMessage}
                  </p>
                </div>
              ) : null}

              <Button
                variant="gold"
                size="lg"
                className="w-full"
                onClick={handleCheckout}
                disabled={isLoading}
              >
                {isLoading ? 'Connexion Stripe...' : 'Passer au paiement'}
              </Button>

              <div className="mt-6 flex items-center gap-3 border-t border-white/10 pt-6 text-white/45">
                <Icon size={18}>
                  <path d="M12 2 4 5v6c0 5.55 3.84 10.74 8 12 4.16-1.26 8-6.45 8-12V5l-8-3Z" />
                  <path d="m9 12 2 2 4-4" />
                </Icon>

                <p className="font-sans text-[0.68rem] uppercase tracking-[0.16em]">
                  Paiement sécurisé via Stripe
                </p>
              </div>
            </aside>
          </div>
        )}
      </div>
    </main>
  );
}
