"use client";

import Image from "next/image";
import Link from "next/link";

import { useCartStore } from "@/lib/cart-store";

export default function CartDrawer() {
  const {
    items,
    isOpen,
    closeCart,
    removeItem,
    increaseItem,
    decreaseItem,
    clearCart,
  } = useCartStore();

  return (
    <>
      <div
        className={`fixed inset-0 z-[60] bg-[#121110]/40 backdrop-blur-sm transition-all duration-700 ease-[cubic-bezier(0.25,1,0.5,1)] ${
          isOpen ? "visible opacity-100" : "invisible opacity-0"
        }`}
        onClick={closeCart}
        aria-hidden="true"
      />

      <div
        className={`fixed right-0 top-0 z-[70] flex h-full w-full transform flex-col border-l border-white/5 bg-[#121110] transition-transform duration-700 ease-[cubic-bezier(0.25,1,0.5,1)] md:w-[460px] ${
          isOpen ? "translate-x-0" : "translate-x-full"
        }`}
        role="dialog"
        aria-modal="true"
        aria-label="Panier 21 Wear"
      >
        <div className="flex items-center justify-between border-b border-white/5 p-6 md:p-8">
          <div>
            <p className="font-sans text-[0.65rem] uppercase tracking-[0.2em] text-white/40">
              21 Wear
            </p>
            <h2 className="mt-2 font-serif text-2xl tracking-tight text-white">
              Panier
            </h2>
          </div>

          <button
            type="button"
            onClick={closeCart}
            aria-label="Fermer le panier"
            className="text-[0.65rem] uppercase tracking-[0.25em] text-white/70 transition-colors duration-500 hover:text-white"
          >
            Fermer
          </button>
        </div>

        <div className="flex-1 overflow-y-auto p-6 md:p-8">
          {items.length === 0 ? (
            <div className="flex h-full flex-col items-center justify-center text-center">
              <p className="font-serif text-2xl text-white">Panier vide</p>
              <p className="mt-4 max-w-sm font-sans text-sm font-light leading-relaxed text-white/60">
                Aucune pièce n’a encore été ajoutée à votre sélection.
              </p>
            </div>
          ) : (
            <div className="flex flex-col gap-6">
              {items.map((item) => (
                <div
                  key={item.id}
                  className="grid grid-cols-[96px_1fr] gap-4 border-b border-white/5 pb-6"
                >
                  <div className="relative aspect-[4/5] overflow-hidden bg-white/5">
                    <Image
                      src={item.image}
                      alt={item.name}
                      fill
                      sizes="96px"
                      className="object-cover"
                    />
                  </div>

                  <div className="flex flex-col justify-between gap-4">
                    <div className="flex flex-col gap-2">
                      <span className="font-sans text-[0.6rem] uppercase tracking-[0.18em] text-white/40">
                        {item.collection}
                      </span>

                      <h3 className="font-serif text-lg text-white">
                        {item.name}
                      </h3>

                      <p className="font-sans text-sm uppercase tracking-[0.12em] text-white/55">
                        {item.price}
                      </p>
                    </div>

                    <div className="flex items-center justify-between gap-4">
                      <div className="flex items-center border border-white/10">
                        <button
                          type="button"
                          onClick={() => decreaseItem(item.id)}
                          className="px-3 py-2 text-white/70 transition hover:text-white"
                        >
                          -
                        </button>

                        <span className="min-w-[40px] text-center font-sans text-sm text-white">
                          {item.quantity}
                        </span>

                        <button
                          type="button"
                          onClick={() => increaseItem(item.id)}
                          className="px-3 py-2 text-white/70 transition hover:text-white"
                        >
                          +
                        </button>
                      </div>

                      <button
                        type="button"
                        onClick={() => removeItem(item.id)}
                        className="font-sans text-[0.65rem] uppercase tracking-[0.18em] text-white/45 transition hover:text-white"
                      >
                        Retirer
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        <div className="border-t border-white/5 p-6 md:p-8">
          {items.length > 0 ? (
            <div className="flex flex-col gap-4">
              <button
                type="button"
                onClick={clearCart}
                className="font-sans text-[0.65rem] uppercase tracking-[0.2em] text-white/45 transition hover:text-white"
              >
                Vider le panier
              </button>

              <Link
                href="/contact"
                onClick={closeCart}
                className="inline-flex items-center justify-center bg-white px-6 py-4 text-black transition-opacity duration-300 hover:opacity-90"
              >
                <span className="font-sans text-[0.65rem] font-bold uppercase tracking-[0.25em]">
                  Finaliser la demande
                </span>
              </Link>
            </div>
          ) : null}
        </div>
      </div>
    </>
  );
}
