"use client";

import { PaymentElement, useElements, useStripe } from "@stripe/react-stripe-js";
import { useState } from "react";

import type { WearCartItem } from "@/app/(wear)/_components/cart/WearCartProvider";

interface CustomerDetails {
  fullName: string;
  email: string;
  phone: string;
  city: string;
  country: string;
  notes: string;
}

interface WearPaymentElementFormProps {
  clientSecret: string;
  orderReference: string;
  customer: CustomerDetails;
  items: WearCartItem[];
  onPreparingPayment: (nextState: boolean) => void;
  onError: (message: string | null) => void;
  onSuccess: () => void;
}

interface PreparePaymentResponse {
  clientSecret: string;
  orderReference: string;
}

export default function WearPaymentElementForm({
  clientSecret,
  orderReference,
  customer,
  items,
  onPreparingPayment,
  onError,
  onSuccess,
}: WearPaymentElementFormProps) {
  const stripe = useStripe();
  const elements = useElements();

  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    if (!stripe || !elements) {
      onError("Le module de paiement Stripe est encore en cours de chargement.");
      return;
    }

    setIsSubmitting(true);
    onPreparingPayment(true);
    onError(null);

    try {
      const response = await fetch("/api/wear/checkout", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          mode: "prepare_payment",
          paymentIntentClientSecret: clientSecret,
          orderReference,
          customer,
          items: items.map((item) => ({
            productId: item.productId,
            size: item.size,
            quantity: item.quantity,
          })),
        }),
      });

      const data = (await response.json()) as
        | PreparePaymentResponse
        | { error?: string };

      if (!response.ok || !("orderReference" in data)) {
        onError(
          "error" in data && data.error
            ? data.error
            : "Impossible de préparer le paiement.",
        );
        setIsSubmitting(false);
        onPreparingPayment(false);
        return;
      }

      const result = await stripe.confirmPayment({
        elements,
        clientSecret: data.clientSecret,
        confirmParams: {
          return_url: `${window.location.origin}/wear/checkout/success?order=${encodeURIComponent(data.orderReference)}`,
          payment_method_data: {
            billing_details: {
              name: customer.fullName,
              email: customer.email,
              phone: customer.phone,
              address: {
                city: customer.city,
                country:
                  customer.country.trim().length === 2
                    ? customer.country.trim().toUpperCase()
                    : undefined,
              },
            },
          },
          receipt_email: customer.email,
        },
      });

      if (result.error) {
        onError(result.error.message ?? "Le paiement n’a pas pu être confirmé.");
        setIsSubmitting(false);
        onPreparingPayment(false);
        return;
      }

      onSuccess();
    } catch {
      onError("Une erreur est survenue pendant la confirmation du paiement.");
      setIsSubmitting(false);
      onPreparingPayment(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="border border-[#121110]/10 bg-white px-4 py-5">
        <PaymentElement
          options={{
            layout: {
              type: "accordion",
              defaultCollapsed: false,
            },
          }}
        />
      </div>

      <button
        type="submit"
        disabled={!stripe || !elements || isSubmitting}
        className="inline-flex items-center justify-center bg-[#121110] px-8 py-4 text-[#F7F5F0] transition-colors duration-300 hover:bg-[#2A2826] disabled:cursor-not-allowed disabled:opacity-55"
      >
        <span className="font-sans text-[0.65rem] font-bold uppercase tracking-[0.24em]">
          {isSubmitting ? "Confirmation..." : "Payer maintenant"}
        </span>
      </button>
    </form>
  );
}
