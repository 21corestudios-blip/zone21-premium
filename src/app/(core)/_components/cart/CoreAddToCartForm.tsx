"use client";

import { useState } from "react";

import type { CoreProduct } from "@/data/core.products";

import { useCoreCart } from "./CoreCartProvider";

interface CoreAddToCartFormProps {
  product: CoreProduct;
}

export default function CoreAddToCartForm({
  product,
}: CoreAddToCartFormProps) {
  const [feedbackMessage, setFeedbackMessage] = useState<string | null>(null);
  const { addItem } = useCoreCart();

  const handleAddToCart = () => {
    addItem(product);
    setFeedbackMessage(`${product.name} a été ajouté au panier.`);
  };

  const currentBenefits = [
    product.kind,
    product.deliveryFormat ?? "Livrable studio",
    product.timeline ?? "Sur demande",
  ];

  return (
    <div className="flex flex-col gap-6">
      <div className="flex items-center justify-between gap-4">
        <p className="font-sans text-[0.65rem] uppercase tracking-[0.24em] text-bg/45">
          Format
        </p>
        <p className="font-sans text-[0.65rem] uppercase tracking-[0.18em] text-bg/55">
          Offre studio
        </p>
      </div>

      <div className="grid gap-3 sm:grid-cols-3">
        {currentBenefits.map((benefit) => (
          <div
            key={benefit}
            className="border border-bg/10 px-4 py-4 font-sans text-[0.68rem] uppercase tracking-[0.18em] text-bg/68"
          >
            {benefit}
          </div>
        ))}
      </div>

      {feedbackMessage ? (
        <div className="border border-bg/10 bg-bg/3 px-4 py-4">
          <p className="font-sans text-sm font-light leading-relaxed text-bg/70">
            {feedbackMessage}
          </p>
        </div>
      ) : null}

      <button
        type="button"
        onClick={handleAddToCart}
        className="inline-flex items-center justify-center rounded-none bg-bg px-8 py-4 text-paper transition-colors duration-300 hover:bg-black"
      >
        <span className="font-serif text-xs uppercase tracking-[0.18em]">
          Ajouter au panier
        </span>
      </button>
    </div>
  );
}
