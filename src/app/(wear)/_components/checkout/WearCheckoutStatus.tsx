"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { useRouter } from "next/navigation";

import { useWearCart } from "@/app/(wear)/_components/cart/WearCartProvider";

import { isStripeConfigured, stripePromise } from "./stripe";

type PaymentStatus = "loading" | "succeeded" | "processing" | "requires_payment_method" | "unavailable";

interface PaymentState {
  status: PaymentStatus;
  message: string;
  amount: string;
}

const initialState: PaymentState = {
  status: "loading",
  message: "Vérification du statut de paiement en cours...",
  amount: "—",
};

export default function WearCheckoutStatus() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const { clearCart } = useWearCart();
  const [paymentState, setPaymentState] = useState<PaymentState>(initialState);

  const orderReference = searchParams.get("order") ?? "En préparation";
  const paymentIntentClientSecret =
    searchParams.get("payment_intent_client_secret");
  const unavailableState = useMemo<PaymentState | null>(() => {
    if (!isStripeConfigured()) {
      return {
        status: "unavailable",
        message:
          "Stripe n’est pas encore configuré sur cet environnement. Ajoute les clés pour vérifier le statut réel du paiement.",
        amount: "—",
      };
    }

    if (!paymentIntentClientSecret) {
      return {
        status: "unavailable",
        message:
          "Aucun statut Stripe n’a été renvoyé par le provider. Reviens au checkout pour relancer le paiement.",
        amount: "—",
      };
    }

    return null;
  }, [paymentIntentClientSecret]);

  useEffect(() => {
    if (unavailableState || !paymentIntentClientSecret) {
      return;
    }

    const clientSecret = paymentIntentClientSecret;
    let isMounted = true;

    async function loadPaymentIntent() {
      const stripe = await stripePromise;

      if (!stripe) {
        if (!isMounted) {
          return;
        }

        setPaymentState({
          status: "unavailable",
          message:
            "Stripe n’a pas pu être initialisé côté client pour lire le statut du paiement.",
          amount: "—",
        });
        return;
      }

      const { paymentIntent } = await stripe.retrievePaymentIntent(
        clientSecret,
      );

      if (!isMounted || !paymentIntent) {
        return;
      }

      const amount = new Intl.NumberFormat("fr-FR", {
        style: "currency",
        currency: paymentIntent.currency.toUpperCase(),
      }).format(paymentIntent.amount / 100);

      switch (paymentIntent.status) {
        case "succeeded":
          clearCart();
          setPaymentState({
            status: "succeeded",
            message:
              "Le paiement a été confirmé. La sélection 21 Wear est maintenant validée.",
            amount,
          });
          return;
        case "processing":
          clearCart();
          setPaymentState({
            status: "processing",
            message:
              "Le paiement est en cours de traitement. Stripe finalise encore la transaction.",
            amount,
          });
          return;
        case "requires_payment_method":
          setPaymentState({
            status: "requires_payment_method",
            message:
              "Le paiement n’a pas abouti. Tu peux revenir au checkout pour essayer une autre méthode.",
            amount,
          });
          return;
        default:
          setPaymentState({
            status: "unavailable",
            message:
              "Le statut retourné par Stripe nécessite une reprise depuis le checkout.",
            amount,
          });
      }
    }

    void loadPaymentIntent();

    return () => {
      isMounted = false;
    };
  }, [clearCart, paymentIntentClientSecret, unavailableState]);

  const displayedState = unavailableState ?? paymentState;

  return (
    <section className="mx-auto flex w-full max-w-5xl flex-1 flex-col items-center justify-center px-6 py-24 text-center md:px-12">
      <p className="font-sans text-[0.68rem] uppercase tracking-[0.32em] text-[#121110]/42">
        21 Wear Payment
      </p>
      <h1 className="mt-6 font-serif text-4xl leading-[0.96] text-[#121110] md:text-6xl">
        {displayedState.status === "succeeded"
          ? "Paiement confirmé"
          : displayedState.status === "processing"
            ? "Paiement en traitement"
            : displayedState.status === "loading"
              ? "Vérification en cours"
              : "Paiement à reprendre"}
      </h1>
      <p className="mt-6 max-w-2xl font-sans text-base font-light leading-relaxed text-[#121110]/68 md:text-lg">
        {displayedState.message}
      </p>

      <div className="mt-12 grid w-full gap-4 border border-[#121110]/10 bg-white/60 p-6 text-left md:grid-cols-2 md:p-8">
        <div>
          <p className="font-sans text-[0.62rem] uppercase tracking-[0.24em] text-[#121110]/42">
            Référence
          </p>
          <p className="mt-3 font-serif text-2xl text-[#121110]">
            {orderReference}
          </p>
        </div>
        <div>
          <p className="font-sans text-[0.62rem] uppercase tracking-[0.24em] text-[#121110]/42">
            Montant
          </p>
          <p className="mt-3 font-serif text-2xl text-[#121110]">
            {displayedState.amount}
          </p>
        </div>
      </div>

      <div className="mt-10 flex flex-col gap-3 sm:flex-row">
        <button
          type="button"
          onClick={() =>
            router.push(
              displayedState.status === "requires_payment_method"
                ? "/wear/checkout"
                : "/wear",
            )
          }
          className="inline-flex items-center justify-center bg-[#121110] px-8 py-4 text-[#F7F5F0] transition-colors duration-300 hover:bg-[#2A2826]"
        >
          <span className="font-sans text-[0.65rem] font-bold uppercase tracking-[0.24em]">
            {displayedState.status === "requires_payment_method"
              ? "Retour au checkout"
              : "Retour à la boutique"}
          </span>
        </button>
        <Link
          href="/contact"
          className="inline-flex items-center justify-center border border-[#121110]/15 px-8 py-4 text-[#121110] transition-colors duration-300 hover:border-[#121110]/35"
        >
          <span className="font-sans text-[0.65rem] font-bold uppercase tracking-[0.24em]">
            Contact privé
          </span>
        </Link>
      </div>
    </section>
  );
}
