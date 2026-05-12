"use client";

import { Elements } from "@stripe/react-stripe-js";
import Link from "next/link";
import { useEffect, useMemo, useState } from "react";

import { useWearCart } from "@/app/(wear)/_components/cart/WearCartProvider";

import WearPaymentElementForm from "./WearPaymentElementForm";
import { isStripeConfigured, stripePromise } from "./stripe";

interface CheckoutIntentResponse {
  clientSecret: string;
  orderReference: string;
}

export default function WearCheckoutClient() {
  const { isHydrated, itemCount, items, subtotalFormatted } = useWearCart();

  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [city, setCity] = useState("");
  const [country, setCountry] = useState("France");
  const [notes, setNotes] = useState("");
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [intentClientSecret, setIntentClientSecret] = useState<string | null>(
    null,
  );
  const [intentOrderReference, setIntentOrderReference] = useState<
    string | null
  >(null);
  const [isPreparingIntent, setIsPreparingIntent] = useState(false);

  useEffect(() => {
    if (!isHydrated || !items.length || !isStripeConfigured()) {
      return;
    }

    let isMounted = true;

    async function createPaymentIntent() {
      setIsPreparingIntent(true);
      setErrorMessage(null);

      try {
        const response = await fetch("/api/wear/checkout", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            mode: "create_intent",
            items: items.map((item) => ({
              productId: item.productId,
              size: item.size,
              quantity: item.quantity,
            })),
          }),
        });

        const data = (await response.json()) as
          | CheckoutIntentResponse
          | { error?: string };

        if (!response.ok || !("clientSecret" in data)) {
          if (!isMounted) {
            return;
          }

          setErrorMessage(
            "error" in data && data.error
              ? data.error
              : "Impossible d’initialiser le paiement Stripe.",
          );
          setIsPreparingIntent(false);
          return;
        }

        if (!isMounted) {
          return;
        }

        setIntentClientSecret(data.clientSecret);
        setIntentOrderReference(data.orderReference);
      } catch {
        if (!isMounted) {
          return;
        }

        setErrorMessage(
          "Une erreur est survenue pendant l’initialisation du paiement.",
        );
      } finally {
        if (isMounted) {
          setIsPreparingIntent(false);
        }
      }
    }

    void createPaymentIntent();

    return () => {
      isMounted = false;
    };
  }, [isHydrated, items]);

  const elementOptions = useMemo(() => {
    if (!intentClientSecret) {
      return null;
    }

    return {
      clientSecret: intentClientSecret,
      appearance: {
        theme: "stripe" as const,
        variables: {
          colorPrimary: "#121110",
          colorBackground: "#ffffff",
          colorText: "#121110",
          colorDanger: "#8B2E1B",
          fontFamily:
            "var(--font-texte), ui-sans-serif, system-ui, sans-serif",
          borderRadius: "0px",
        },
        rules: {
          ".Label": {
            fontSize: "12px",
            textTransform: "uppercase",
            letterSpacing: "0.18em",
          },
          ".Input": {
            border: "1px solid rgba(18,17,16,0.12)",
            boxShadow: "none",
          },
        },
      },
    };
  }, [intentClientSecret]);

  if (!isHydrated) {
    return (
      <section className="mx-auto flex min-h-[60vh] w-full max-w-7xl items-center justify-center px-6 py-24 md:px-12">
        <p className="font-sans text-[0.68rem] uppercase tracking-[0.3em] text-[#121110]/45">
          Préparation du checkout...
        </p>
      </section>
    );
  }

  if (!items.length) {
    return (
      <section className="mx-auto flex min-h-[60vh] w-full max-w-4xl flex-col items-center justify-center px-6 py-24 text-center md:px-12">
        <p className="font-sans text-[0.68rem] uppercase tracking-[0.3em] text-[#121110]/45">
          21 Wear Checkout
        </p>
        <h1 className="mt-6 font-serif text-4xl leading-none text-[#121110] md:text-5xl">
          Ton panier est vide
        </h1>
        <p className="mt-6 max-w-2xl font-sans text-base font-light leading-relaxed text-[#121110]/68 md:text-lg">
          Reviens sur les collections pour sélectionner tes pièces avant de
          finaliser le checkout.
        </p>
        <Link
          href="/wear/panier"
          className="mt-10 inline-flex items-center justify-center bg-[#121110] px-8 py-4 text-[#F7F5F0] transition-colors duration-300 hover:bg-[#2A2826]"
        >
          <span className="font-sans text-[0.65rem] font-bold uppercase tracking-[0.24em]">
            Aller au panier
          </span>
        </Link>
      </section>
    );
  }

  return (
    <section className="mx-auto w-full max-w-[1480px] bg-white px-6 pb-20 pt-28 md:px-12 md:pb-28 md:pt-36">
      <div className="border-b border-[#121110]/10 pb-8">
        <nav className="flex items-center gap-3 font-sans text-[0.62rem] uppercase tracking-[0.24em] text-[#121110]/42">
          <Link
            href="/wear"
            className="transition-colors duration-300 hover:text-[#121110]"
          >
            21 Wear
          </Link>
          <span>/</span>
          <Link
            href="/wear/panier"
            className="transition-colors duration-300 hover:text-[#121110]"
          >
            Panier
          </Link>
          <span>/</span>
          <span className="text-[#121110]/70">Checkout</span>
        </nav>

        <div className="mt-6 flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
          <div>
            <p className="font-sans text-[0.68rem] uppercase tracking-[0.32em] text-[#121110]/42">
              Checkout
            </p>
            <h1 className="mt-4 font-serif text-4xl leading-none text-[#121110] md:text-6xl">
              Paiement
            </h1>
          </div>

          <div className="flex flex-wrap items-center gap-4 font-sans text-[0.65rem] uppercase tracking-[0.22em] text-[#121110]/48">
            <span>{itemCount} article{itemCount > 1 ? "s" : ""}</span>
            <span className="h-3 w-px bg-[#121110]/12" />
            <span>Paiement sécurisé Stripe</span>
            <span className="h-3 w-px bg-[#121110]/12" />
            <span>Interface 21 Wear</span>
          </div>
        </div>
      </div>

      <div className="grid gap-12 pt-10 lg:grid-cols-[minmax(0,1.2fr)_380px] lg:items-start">
        <div className="space-y-10">
          <section className="border border-[#121110]/10 bg-white p-6 md:p-8">
            <div className="mb-8">
              <p className="font-sans text-[0.65rem] uppercase tracking-[0.26em] text-[#121110]/42">
                Informations client
              </p>
              <h2 className="mt-4 font-serif text-3xl text-[#121110]">
                Coordonnées principales
              </h2>
            </div>

            <div className="grid gap-5 md:grid-cols-2">
              <label className="flex flex-col gap-3 md:col-span-2">
                <span className="font-sans text-[0.68rem] uppercase tracking-[0.2em] text-[#121110]/55">
                  Nom complet
                </span>
                <input
                  required
                  value={fullName}
                  onChange={(event) => setFullName(event.target.value)}
                  className="border border-[#121110]/12 bg-white px-4 py-4 font-sans text-base text-[#121110] outline-none transition-colors duration-300 placeholder:text-[#121110]/30 focus:border-[#121110]/35"
                  placeholder="Prénom Nom"
                />
              </label>

              <label className="flex flex-col gap-3">
                <span className="font-sans text-[0.68rem] uppercase tracking-[0.2em] text-[#121110]/55">
                  Email
                </span>
                <input
                  required
                  type="email"
                  value={email}
                  onChange={(event) => setEmail(event.target.value)}
                  className="border border-[#121110]/12 bg-white px-4 py-4 font-sans text-base text-[#121110] outline-none transition-colors duration-300 placeholder:text-[#121110]/30 focus:border-[#121110]/35"
                  placeholder="nom@exemple.com"
                />
              </label>

              <label className="flex flex-col gap-3">
                <span className="font-sans text-[0.68rem] uppercase tracking-[0.2em] text-[#121110]/55">
                  Téléphone
                </span>
                <input
                  required
                  value={phone}
                  onChange={(event) => setPhone(event.target.value)}
                  className="border border-[#121110]/12 bg-white px-4 py-4 font-sans text-base text-[#121110] outline-none transition-colors duration-300 placeholder:text-[#121110]/30 focus:border-[#121110]/35"
                  placeholder="+33 ..."
                />
              </label>

              <label className="flex flex-col gap-3">
                <span className="font-sans text-[0.68rem] uppercase tracking-[0.2em] text-[#121110]/55">
                  Ville
                </span>
                <input
                  required
                  value={city}
                  onChange={(event) => setCity(event.target.value)}
                  className="border border-[#121110]/12 bg-white px-4 py-4 font-sans text-base text-[#121110] outline-none transition-colors duration-300 placeholder:text-[#121110]/30 focus:border-[#121110]/35"
                  placeholder="Paris"
                />
              </label>

              <label className="flex flex-col gap-3">
                <span className="font-sans text-[0.68rem] uppercase tracking-[0.2em] text-[#121110]/55">
                  Pays
                </span>
                <input
                  required
                  value={country}
                  onChange={(event) => setCountry(event.target.value)}
                  className="border border-[#121110]/12 bg-white px-4 py-4 font-sans text-base text-[#121110] outline-none transition-colors duration-300 placeholder:text-[#121110]/30 focus:border-[#121110]/35"
                  placeholder="France"
                />
              </label>
            </div>
          </section>

          <section className="border border-[#121110]/10 bg-white p-6 md:p-8">
            <div className="mb-8">
              <p className="font-sans text-[0.65rem] uppercase tracking-[0.26em] text-[#121110]/42">
                Notes
              </p>
              <h2 className="mt-4 font-serif text-3xl text-[#121110]">
                Préférences ou précisions
              </h2>
            </div>

            <label className="flex flex-col gap-3">
              <span className="font-sans text-[0.68rem] uppercase tracking-[0.2em] text-[#121110]/55">
                Message complémentaire
              </span>
              <textarea
                rows={6}
                value={notes}
                onChange={(event) => setNotes(event.target.value)}
                className="border border-[#121110]/12 bg-white px-4 py-4 font-sans text-base text-[#121110] outline-none transition-colors duration-300 placeholder:text-[#121110]/30 focus:border-[#121110]/35"
                placeholder="Exigences de livraison, disponibilité souhaitée, contexte particulier..."
              />
            </label>
          </section>

          <section className="border border-[#121110]/10 bg-white p-6 md:p-8">
            <div className="mb-8">
              <p className="font-sans text-[0.65rem] uppercase tracking-[0.26em] text-[#121110]/42">
                Paiement
              </p>
              <h2 className="mt-4 font-serif text-3xl text-[#121110]">
                Stripe Elements
              </h2>
            </div>

            {!isStripeConfigured() ? (
              <div className="border border-[#A43C2A]/18 bg-[#A43C2A]/[0.04] px-5 py-4">
                <p className="font-sans text-sm font-light leading-relaxed text-[#7F2214]">
                  `NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY` et `STRIPE_SECRET_KEY`
                  doivent être définies pour activer le paiement custom.
                </p>
              </div>
            ) : isPreparingIntent || !elementOptions ? (
              <div className="border border-[#121110]/10 bg-white px-5 py-6">
                <p className="font-sans text-[0.68rem] uppercase tracking-[0.24em] text-[#121110]/45">
                  Initialisation sécurisée du module de paiement...
                </p>
              </div>
            ) : (
              <>
                <p className="mb-6 max-w-2xl font-sans text-sm font-light leading-relaxed text-[#121110]/65">
                  Le paiement reste entièrement intégré au site, avec Stripe
                  Elements pour la saisie sécurisée de la méthode de règlement.
                </p>

                <Elements stripe={stripePromise} options={elementOptions}>
                  <WearPaymentElementForm
                    clientSecret={intentClientSecret!}
                    orderReference={intentOrderReference ?? "En préparation"}
                    customer={{
                      fullName,
                      email,
                      phone,
                      city,
                      country,
                      notes,
                    }}
                    items={items}
                    onPreparingPayment={setIsPreparingIntent}
                    onError={setErrorMessage}
                    onSuccess={() => setErrorMessage(null)}
                  />
                </Elements>
              </>
            )}
          </section>

          {errorMessage ? (
            <div className="border border-[#A43C2A]/18 bg-[#A43C2A]/[0.04] px-5 py-4">
              <p className="font-sans text-sm font-light leading-relaxed text-[#7F2214]">
                {errorMessage}
              </p>
            </div>
          ) : null}
        </div>

        <aside className="space-y-4 lg:sticky lg:top-28">
          <div className="border border-[#121110]/10 bg-white p-6 md:p-8">
            <p className="font-sans text-[0.65rem] uppercase tracking-[0.28em] text-[#121110]/42">
              Order Summary
            </p>
            <h2 className="mt-4 font-serif text-3xl text-[#121110]">
              Résumé du checkout
            </h2>

            <div className="mt-8 space-y-5">
            {items.map((item) => (
              <article
                key={`${item.productId}-${item.size}`}
                className="border-b border-[#121110]/10 pb-5"
              >
                <div className="flex items-start justify-between gap-4">
                  <div>
                    <h3 className="font-sans text-sm uppercase tracking-[0.18em] text-[#121110]">
                      {item.product.name}
                    </h3>
                    <p className="mt-2 font-sans text-[0.65rem] uppercase tracking-[0.22em] text-[#121110]/45">
                      Taille {item.size} · Quantité {item.quantity}
                    </p>
                  </div>
                  <p className="font-serif text-lg text-[#121110]">
                    {item.lineTotalFormatted}
                  </p>
                </div>
              </article>
            ))}
            </div>

            <div className="mt-8 space-y-4 border-t border-[#121110]/10 pt-6">
              <div className="flex items-center justify-between gap-4 font-sans text-sm text-[#121110]/72">
                <span>Sous-total</span>
                <span>{subtotalFormatted}</span>
              </div>
              <div className="flex items-center justify-between gap-4 font-sans text-sm text-[#121110]/72">
                <span>Livraison standard</span>
                <span>Offerte</span>
              </div>
              <div className="flex items-center justify-between gap-4 border-t border-[#121110]/10 pt-4">
                <span className="font-sans text-[0.68rem] uppercase tracking-[0.24em] text-[#121110]/52">
                  Total estimé
                </span>
                <span className="font-serif text-2xl text-[#121110]">
                  {subtotalFormatted}
                </span>
              </div>
            </div>

            <p className="mt-5 font-sans text-[0.72rem] font-light leading-relaxed text-[#121110]/58">
              Référence checkout
              {intentOrderReference
                ? ` : ${intentOrderReference}`
                : " en préparation"}.
            </p>
          </div>

          <div className="border border-[#121110]/10 bg-white p-6">
            <div className="space-y-4">
              <div>
                <p className="font-sans text-[0.62rem] uppercase tracking-[0.24em] text-[#121110]/40">
                  Paiement
                </p>
                <p className="mt-2 font-sans text-sm font-light leading-relaxed text-[#121110]/66">
                  Saisie sécurisée de la carte et des moyens de paiement via
                  Stripe Elements, sans sortir de l’univers 21 Wear.
                </p>
              </div>

              <div className="border-t border-[#121110]/8 pt-4">
                <p className="font-sans text-[0.62rem] uppercase tracking-[0.24em] text-[#121110]/40">
                  Livraison
                </p>
                <p className="mt-2 font-sans text-sm font-light leading-relaxed text-[#121110]/66">
                  Les taxes et options définitives sont consolidées avant la
                  confirmation du paiement.
                </p>
              </div>

              <div className="border-t border-[#121110]/8 pt-4">
                <p className="font-sans text-[0.62rem] uppercase tracking-[0.24em] text-[#121110]/40">
                  Retour
                </p>
                <p className="mt-2 font-sans text-sm font-light leading-relaxed text-[#121110]/66">
                  Tu peux revenir au panier à tout moment pour ajuster la
                  sélection avant validation.
                </p>
              </div>
            </div>
          </div>
        </aside>
      </div>
    </section>
  );
}
