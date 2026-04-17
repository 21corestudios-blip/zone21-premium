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
      className="inline-flex items-center justify-center bg-[#121110] px-8 py-4 text-[#F7F5F0] transition-colors duration-500 hover:bg-[#2A2826]"
    >
      <span className="font-sans text-[0.65rem] font-bold uppercase tracking-[0.25em]">
        Ajouter au panier
      </span>
    </button>
  );
}
