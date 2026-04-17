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
    <section className="mx-auto w-full max-w-7xl px-6 pb-20 pt-28 md:px-12 md:pb-28 md:pt-36">
      <div className="mb-14 max-w-3xl">
        <p className="font-sans text-[0.68rem] uppercase tracking-[0.32em] text-[#121110]/42">
          21 Wear Checkout
        </p>
        <h1 className="mt-6 font-serif text-4xl leading-[0.96] text-[#121110] md:text-6xl">
          Finaliser la sélection avant paiement
        </h1>
        <p className="mt-6 max-w-2xl font-sans text-base font-light leading-relaxed text-[#121110]/68 md:text-lg">
          Cette étape consolide les informations client et valide le panier côté
          application. Le paiement est maintenant intégré via Stripe Elements
          dans une interface 21 Wear conservée sur le site.
        </p>
      </div>

      <div className="grid gap-12 lg:grid-cols-[minmax(0,1.1fr)_minmax(340px,0.9fr)] lg:items-start">
        <div className="space-y-10">
          <section className="border border-[#121110]/10 bg-white/55 p-6 md:p-8">
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

          <section className="border border-[#121110]/10 bg-white/55 p-6 md:p-8">
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

          <section className="border border-[#121110]/10 bg-white/55 p-6 md:p-8">
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

        <aside className="border border-[#121110]/10 bg-[#121110] p-6 text-[#EAE8E3] md:p-8 lg:sticky lg:top-28">
          <p className="font-sans text-[0.65rem] uppercase tracking-[0.28em] text-white/42">
            Résumé
          </p>
          <h2 className="mt-4 font-serif text-3xl text-white">
            Sélection en cours
          </h2>

          <div className="mt-8 space-y-5">
            {items.map((item) => (
              <article
                key={`${item.productId}-${item.size}`}
                className="border-b border-white/10 pb-5"
              >
                <div className="flex items-start justify-between gap-4">
                  <div>
                    <h3 className="font-sans text-sm uppercase tracking-[0.18em] text-white">
                      {item.product.name}
                    </h3>
                    <p className="mt-2 font-sans text-[0.65rem] uppercase tracking-[0.22em] text-white/45">
                      Taille {item.size} · Quantité {item.quantity}
                    </p>
                  </div>
                  <p className="font-serif text-lg text-[#D5C4AE]">
                    {item.lineTotalFormatted}
                  </p>
                </div>
              </article>
            ))}
          </div>

          <div className="mt-8 border-t border-white/10 pt-6">
            <div className="flex items-end justify-between gap-4">
              <div>
                <p className="font-sans text-[0.65rem] uppercase tracking-[0.28em] text-white/42">
                  Sous-total
                </p>
              <p className="mt-3 font-serif text-3xl text-[#D5C4AE]">
                {subtotalFormatted}
              </p>
            </div>
            <p className="font-sans text-[0.65rem] uppercase tracking-[0.2em] text-white/45">
              {itemCount} article{itemCount > 1 ? "s" : ""}
            </p>
            </div>

            <p className="mt-5 font-sans text-sm font-light leading-relaxed text-white/58">
              Référence checkout
              {intentOrderReference ? ` : ${intentOrderReference}` : " en préparation"}.
            </p>
          </div>
        </aside>
      </div>
    </section>
  );
}
