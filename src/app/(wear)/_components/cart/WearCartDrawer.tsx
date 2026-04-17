"use client";

import { useEffect } from "react";
import Image from "next/image";
import Link from "next/link";

import { useWearCart } from "./WearCartProvider";

export default function WearCartDrawer() {
  const {
    clearCart,
    closeCart,
    decrementItem,
    incrementItem,
    isOpen,
    itemCount,
    items,
    removeItem,
    subtotalFormatted,
  } = useWearCart();

  useEffect(() => {
    if (!isOpen) {
      return;
    }

    const handleEscape = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        closeCart();
      }
    };

    window.addEventListener("keydown", handleEscape);

    return () => {
      window.removeEventListener("keydown", handleEscape);
    };
  }, [closeCart, isOpen]);

  if (!isOpen) {
    return null;
  }

  return (
    <div className="fixed inset-0 z-[100] flex justify-end">
      <button
        type="button"
        aria-label="Fermer le panier"
        onClick={closeCart}
        className="absolute inset-0 bg-[#121110]/55 backdrop-blur-sm"
      />

      <aside
        role="dialog"
        aria-modal="true"
        aria-label="Panier 21 Wear"
        className="relative flex h-full w-full max-w-xl flex-col border-l border-white/10 bg-[#121110] text-[#EAE8E3] shadow-2xl"
      >
        <div className="flex items-center justify-between border-b border-white/10 px-6 py-5">
          <div>
            <p className="font-sans text-[0.62rem] uppercase tracking-[0.28em] text-white/45">
              21 Wear
            </p>
            <h2 className="mt-2 font-serif text-2xl text-white">
              Panier ({itemCount})
            </h2>
          </div>

          <button
            type="button"
            onClick={closeCart}
            className="text-[0.68rem] uppercase tracking-[0.24em] text-white/55 transition-colors duration-300 hover:text-white"
          >
            Fermer
          </button>
        </div>

        {items.length === 0 ? (
          <div className="flex flex-1 flex-col items-center justify-center px-8 text-center">
            <p className="font-sans text-[0.65rem] uppercase tracking-[0.32em] text-white/45">
              Le panier est vide
            </p>
            <p className="mt-5 max-w-sm font-sans text-sm font-light leading-relaxed text-white/60">
              Commence par sélectionner une pièce, puis choisis sa taille pour
              l’ajouter à ta sélection.
            </p>
          </div>
        ) : (
          <>
            <div className="flex-1 space-y-6 overflow-y-auto px-6 py-6">
              {items.map((item) => (
                <article
                  key={`${item.productId}-${item.size}`}
                  className="grid grid-cols-[80px_minmax(0,1fr)] gap-4 border-b border-white/8 pb-6"
                >
                  <div className="relative aspect-[4/5] overflow-hidden bg-white/5">
                    <Image
                      src={item.product.image}
                      alt={item.product.name}
                      fill
                      sizes="80px"
                      className="object-cover"
                    />
                  </div>

                  <div className="flex min-w-0 flex-col justify-between gap-4">
                    <div className="space-y-2">
                      <div className="flex items-start justify-between gap-4">
                        <h3 className="font-sans text-sm uppercase tracking-[0.18em] text-white">
                          {item.product.name}
                        </h3>
                        <button
                          type="button"
                          onClick={() => removeItem(item.productId, item.size)}
                          className="text-[0.6rem] uppercase tracking-[0.24em] text-white/40 transition-colors duration-300 hover:text-white"
                          aria-label={`Retirer ${item.product.name} du panier`}
                        >
                          Retirer
                        </button>
                      </div>

                      <p className="font-sans text-[0.62rem] uppercase tracking-[0.22em] text-white/45">
                        Taille {item.size}
                      </p>
                    </div>

                    <div className="flex items-end justify-between gap-4">
                      <div className="inline-flex items-center border border-white/10">
                        <button
                          type="button"
                          onClick={() => decrementItem(item.productId, item.size)}
                          className="px-3 py-2 text-sm text-white/75 transition-colors duration-300 hover:text-white"
                          aria-label={`Diminuer la quantité de ${item.product.name}`}
                        >
                          -
                        </button>
                        <span className="min-w-10 px-2 text-center font-sans text-[0.72rem] uppercase tracking-[0.18em] text-white/70">
                          {item.quantity}
                        </span>
                        <button
                          type="button"
                          onClick={() => incrementItem(item.productId, item.size)}
                          className="px-3 py-2 text-sm text-white/75 transition-colors duration-300 hover:text-white"
                          aria-label={`Augmenter la quantité de ${item.product.name}`}
                        >
                          +
                        </button>
                      </div>

                      <p className="font-serif text-lg text-[#D5C4AE]">
                        {item.lineTotalFormatted}
                      </p>
                    </div>
                  </div>
                </article>
              ))}
            </div>

            <div className="border-t border-white/10 bg-[#181715] px-6 py-6">
              <div className="flex items-end justify-between gap-4">
                <div>
                  <p className="font-sans text-[0.62rem] uppercase tracking-[0.28em] text-white/45">
                    Sous-total
                  </p>
                  <p className="mt-2 font-serif text-3xl text-[#D5C4AE]">
                    {subtotalFormatted}
                  </p>
                </div>

                <button
                  type="button"
                  onClick={clearCart}
                  className="text-[0.62rem] uppercase tracking-[0.24em] text-white/45 transition-colors duration-300 hover:text-white"
                >
                  Vider
                </button>
              </div>

              <p className="mt-5 max-w-md font-sans text-sm font-light leading-relaxed text-white/58">
                Le checkout 21 Wear est prêt à reprendre ta sélection pour
                finaliser les informations client avant l’étape paiement.
              </p>

              <div className="mt-6 flex flex-col gap-3 sm:flex-row">
                <Link
                  href="/wear/checkout"
                  onClick={closeCart}
                  className="inline-flex items-center justify-center bg-[#D5C4AE] px-6 py-4 text-[#121110] transition-colors duration-300 hover:bg-[#EAE8E3] sm:flex-1"
                >
                  <span className="font-sans text-[0.65rem] font-bold uppercase tracking-[0.24em]">
                    Passer au checkout
                  </span>
                </Link>

                <button
                  type="button"
                  onClick={closeCart}
                  className="inline-flex items-center justify-center border border-white/12 px-6 py-4 text-white/75 transition-colors duration-300 hover:border-white/25 hover:text-white sm:flex-1"
                >
                  <span className="font-sans text-[0.65rem] font-bold uppercase tracking-[0.24em]">
                    Continuer
                  </span>
                </button>
              </div>
            </div>
          </>
        )}
      </aside>
    </div>
  );
}
