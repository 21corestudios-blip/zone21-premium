"use client";

import { useState } from "react";

import {
  wearColorLabels,
  wearLaunchColors,
  type WearProduct,
  type WearProductColor,
  type WearProductSize,
} from "@/data/wear.products";

import { useWearCart } from "./WearCartProvider";

interface WearAddToCartFormProps {
  product: WearProduct;
}

export default function WearAddToCartForm({
  product,
}: WearAddToCartFormProps) {
  const [selectedSize, setSelectedSize] = useState<WearProductSize | null>(
    product.availableSizes[2] ?? product.availableSizes[0] ?? null,
  );
  const [selectedColor, setSelectedColor] = useState<WearProductColor>(
    product.availableColors?.[0] || wearLaunchColors[0],
  );
  const [feedbackMessage, setFeedbackMessage] = useState<string | null>(null);

  const { addItem } = useWearCart();

  const handleAddToCart = () => {
    if (!selectedSize) {
      setFeedbackMessage("Aucune taille n’est disponible pour cette pièce.");
      return;
    }

    addItem(product, selectedSize, selectedColor);
    setFeedbackMessage(
      `${product.name} en taille ${selectedSize}, ${wearColorLabels[selectedColor]}, a été ajouté au panier.`,
    );
  };

  return (
    <div className="flex flex-col gap-6">
      <div className="flex items-center justify-between gap-4">
        <p className="font-sans text-[0.65rem] uppercase tracking-[0.24em] text-bg/45">
          Taille
        </p>
        <p className="font-sans text-[0.65rem] uppercase tracking-[0.18em] text-bg/55">
          Sélection requise
        </p>
      </div>

      <div
        className="grid grid-cols-5 gap-3"
        role="radiogroup"
        aria-label="Sélection de la taille"
      >
        {product.availableSizes.map((size) => {
          const isSelected = selectedSize === size;

          return (
            <button
              key={size}
              type="button"
              role="radio"
              aria-checked={isSelected}
              onClick={() => {
                setSelectedSize(size);
                setFeedbackMessage(null);
              }}
              className={`border px-4 py-3 font-sans text-sm uppercase tracking-[0.18em] transition-colors duration-300 ${
                isSelected
                  ? "border-bg bg-bg text-paper"
                  : "border-bg/15 text-bg hover:border-bg/35"
              }`}
            >
              {size}
            </button>
          );
        })}
      </div>

      <div className="flex items-center justify-between gap-4">
        <p className="font-sans text-[0.65rem] uppercase tracking-[0.24em] text-bg/45">
          Couleur
        </p>
        <p className="font-sans text-[0.65rem] uppercase tracking-[0.18em] text-bg/55">
          {wearColorLabels[selectedColor]}
        </p>
      </div>

      <div
        className="grid grid-cols-3 gap-3"
        role="radiogroup"
        aria-label="Sélection de la couleur"
      >
        {(product.availableColors || [wearLaunchColors[0]]).map((color) => {
          const isSelected = selectedColor === color;

          return (
            <button
              key={color}
              type="button"
              role="radio"
              aria-checked={isSelected}
              onClick={() => {
                setSelectedColor(color);
                setFeedbackMessage(null);
              }}
              className={`border px-3 py-3 font-sans text-[0.65rem] uppercase tracking-[0.14em] transition-colors duration-300 ${
                isSelected
                  ? "border-bg bg-bg text-paper"
                  : "border-bg/15 text-bg hover:border-bg/35"
              }`}
            >
              {wearColorLabels[color]}
            </button>
          );
        })}
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
