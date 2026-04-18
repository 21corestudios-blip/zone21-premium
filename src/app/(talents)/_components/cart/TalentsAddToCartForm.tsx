"use client";

import { useState } from "react";

import type { TalentsProduct } from "@/data/talents.products";

import { useTalentsCart } from "./TalentsCartProvider";

interface TalentsAddToCartFormProps {
  product: TalentsProduct;
}

export default function TalentsAddToCartForm({
  product,
}: TalentsAddToCartFormProps) {
  const [feedbackMessage, setFeedbackMessage] = useState<string | null>(null);
  const { addItem } = useTalentsCart();

  const handleAddToCart = () => {
    addItem(product);
    setFeedbackMessage(`${product.name} a été ajouté au panier.`);
  };

  const currentBenefits = [
    product.kind,
    product.deliveryFormat ?? "Livrable agence",
    product.timeline ?? "Sur demande",
  ];

  return (
    <div className="flex flex-col gap-6">
      <div className="flex items-center justify-between gap-4">
        <p className="font-sans text-[0.65rem] uppercase tracking-[0.24em] text-[#121110]/45">
          Format
        </p>
        <p className="font-sans text-[0.65rem] uppercase tracking-[0.18em] text-[#121110]/55">
          Offre talent agency
        </p>
      </div>

      <div className="grid gap-3 sm:grid-cols-3">
        {currentBenefits.map((benefit) => (
          <div
            key={benefit}
            className="border border-[#121110]/10 px-4 py-4 font-sans text-[0.68rem] uppercase tracking-[0.18em] text-[#121110]/68"
          >
            {benefit}
          </div>
        ))}
      </div>

      {feedbackMessage ? (
        <div className="border border-[#121110]/10 bg-[#121110]/[0.03] px-4 py-4">
          <p className="font-sans text-sm font-light leading-relaxed text-[#121110]/70">
            {feedbackMessage}
          </p>
        </div>
      ) : null}

      <button
        type="button"
        onClick={handleAddToCart}
        className="inline-flex items-center justify-center bg-[#121110] px-8 py-4 text-[#F7F5F0] transition-colors duration-500 hover:bg-[#2A2826]"
      >
        <span className="font-sans text-[0.65rem] font-bold uppercase tracking-[0.25em]">
          Ajouter au panier
        </span>
      </button>
    </div>
  );
}
