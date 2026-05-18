"use client";

import { useCartStore } from "@/lib/cart-store";

interface AddToCartButtonProps {
  id: string;
  name: string;
  price: string;
  image: string;
  collection: string;
}

export default function AddToCartButton({
  id,
  name,
  price,
  image,
  collection,
}: AddToCartButtonProps) {
  const addItem = useCartStore((state) => state.addItem);

  return (
    <button
      type="button"
      onClick={() =>
        addItem({
          id,
          name,
          price,
          image,
          collection,
        })
      }
      className="inline-flex items-center justify-center rounded-none bg-bg px-8 py-4 text-paper transition-colors duration-300 hover:bg-black"
    >
      <span className="font-serif text-xs uppercase tracking-[0.18em]">
        Ajouter au panier
      </span>
    </button>
  );
}
