"use client";

import Image from "next/image";
import Link from "next/link";
import { useMemo, useState } from "react";

import { wearCollections } from "@/data/wear.catalog";
import { formatWearPrice } from "@/data/wear.products";

import { useWearCart } from "./WearCartProvider";

export default function WearCartPage() {
  const {
    clearCart,
    decrementItem,
    incrementItem,
    isHydrated,
    itemCount,
    items,
    removeItem,
    subtotalFormatted,
  } = useWearCart();

  const collectionLabels = useMemo(
    () =>
      new Map(
        wearCollections.map((collection) => [collection.slug, collection.name]),
      ),
    [],
  );
  const [selectedItems, setSelectedItems] = useState<string[]>([]);

  const availableSelectionKeys = useMemo(
    () => items.map((item) => `${item.productId}-${item.size}`),
    [items],
  );
  const validSelectedItems = useMemo(
    () =>
      selectedItems.filter((selectionKey) =>
        availableSelectionKeys.includes(selectionKey),
      ),
    [availableSelectionKeys, selectedItems],
  );
  const selectedCount = validSelectedItems.length;
  const allSelected = items.length > 0 && selectedCount === items.length;

  const toggleItemSelection = (selectionKey: string) => {
    setSelectedItems((currentSelection) => {
      const normalizedSelection = currentSelection.filter((itemKey) =>
        availableSelectionKeys.includes(itemKey),
      );

      return normalizedSelection.includes(selectionKey)
        ? normalizedSelection.filter((itemKey) => itemKey !== selectionKey)
        : [...normalizedSelection, selectionKey];
    });
  };

  const toggleSelectAll = () => {
    setSelectedItems(allSelected ? [] : availableSelectionKeys);
  };

  const removeSelectedItems = () => {
    items.forEach((item) => {
      const selectionKey = `${item.productId}-${item.size}`;

      if (!validSelectedItems.includes(selectionKey)) {
        return;
      }

      removeItem(item.productId, item.size);
    });

    setSelectedItems([]);
  };

  if (!isHydrated) {
    return (
      <section className="mx-auto flex min-h-[60vh] w-full max-w-6xl items-center justify-center px-6 py-24 md:px-12">
        <p className="font-sans text-[0.68rem] uppercase tracking-[0.3em] text-bg/45">
          Préparation du panier...
        </p>
      </section>
    );
  }

  if (!items.length) {
    return (
      <section className="mx-auto flex min-h-[60vh] w-full max-w-4xl flex-col items-center justify-center px-6 py-24 text-center md:px-12">
        <p className="font-sans text-[0.68rem] uppercase tracking-[0.3em] text-bg/45">
          CO-KAIN Panier
        </p>
        <h1 className="mt-6 font-serif text-4xl leading-none text-bg md:text-5xl">
          Ton panier est vide
        </h1>
        <p className="mt-6 max-w-2xl font-sans text-base font-light leading-relaxed text-bg/68 md:text-lg">
          Sélectionne tes pièces dans les collections CO-KAIN pour préparer ton
          checkout.
        </p>
        <Link
          href="/wear"
          className="mt-10 inline-flex items-center justify-center bg-bg px-8 py-4 text-paper transition-colors duration-300 hover:bg-surface-hover"
        >
          <span className="font-sans text-[0.65rem] font-bold uppercase tracking-[0.24em]">
            Retour à la boutique
          </span>
        </Link>
      </section>
    );
  }

  return (
    <section className="mx-auto w-full max-w-[1480px] bg-white px-6 pb-20 pt-28 md:px-12 md:pb-28 md:pt-36">
      <div className="border-b border-bg/10 pb-8">
        <nav className="flex items-center gap-3 font-sans text-[0.62rem] uppercase tracking-[0.24em] text-bg/42">
          <Link href="/wear" className="transition-colors duration-300 hover:text-bg">
            CO-KAIN
          </Link>
          <span>/</span>
          <span className="text-bg/70">Panier</span>
        </nav>

        <div className="mt-6 flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
          <div>
            <p className="font-sans text-[0.68rem] uppercase tracking-[0.32em] text-bg/42">
              Shopping Bag
            </p>
            <h1 className="mt-4 font-serif text-4xl leading-none text-bg md:text-6xl">
              Panier
            </h1>
          </div>

          <div className="flex flex-wrap items-center gap-4 font-sans text-[0.65rem] uppercase tracking-[0.22em] text-bg/48">
            <span>{itemCount} article{itemCount > 1 ? "s" : ""}</span>
            <span className="h-3 w-px bg-bg/12" />
            <span>Livraison standard offerte</span>
            <span className="h-3 w-px bg-bg/12" />
            <span>Retours sous 30 jours</span>
          </div>
        </div>
      </div>

      <div className="grid gap-12 pt-10 lg:grid-cols-[minmax(0,1.2fr)_380px] lg:items-start">
        <div className="bg-white">
          <div className="mb-8 flex items-end justify-between gap-4 border-b border-bg/10 pb-6">
            <div>
              <p className="font-sans text-[0.65rem] uppercase tracking-[0.26em] text-bg/42">
                Sélection
              </p>
              <h2 className="mt-4 font-serif text-3xl text-bg">
                {itemCount} article{itemCount > 1 ? "s" : ""}
              </h2>
            </div>

            <div className="flex items-center gap-4">
              <button
                type="button"
                onClick={toggleSelectAll}
                className="text-[0.62rem] uppercase tracking-[0.24em] text-bg/45 transition-colors duration-300 hover:text-bg"
              >
                {allSelected ? "Tout désélectionner" : "Tout sélectionner"}
              </button>

              <button
                type="button"
                onClick={clearCart}
                className="text-[0.62rem] uppercase tracking-[0.24em] text-bg/45 transition-colors duration-300 hover:text-bg"
              >
                Vider
              </button>
            </div>
          </div>

          <div className="mb-6 flex items-center justify-between gap-4 border-b border-bg/8 pb-5">
            <p className="font-sans text-[0.62rem] uppercase tracking-[0.24em] text-bg/38">
              {selectedCount > 0
                ? `${selectedCount} produit${selectedCount > 1 ? "s" : ""} sélectionné${selectedCount > 1 ? "s" : ""}`
                : "Sélectionne un ou plusieurs produits pour les retirer"}
            </p>

            <button
              type="button"
              onClick={removeSelectedItems}
              disabled={selectedCount === 0}
              className="inline-flex items-center justify-center border border-bg/12 px-4 py-3 text-[0.62rem] uppercase tracking-[0.24em] text-bg transition-colors duration-300 hover:border-bg/24 disabled:cursor-not-allowed disabled:opacity-35"
            >
              Supprimer la sélection
            </button>
          </div>

          <div className="space-y-0">
            {items.map((item) => {
              const selectionKey = `${item.productId}-${item.size}`;
              const isSelected = validSelectedItems.includes(selectionKey);

              return (
                <article
                  key={selectionKey}
                  className="border-b border-bg/8 py-6"
                >
                  <div className="flex items-start gap-4">
                    <input
                      type="checkbox"
                      checked={isSelected}
                      onChange={() => toggleItemSelection(selectionKey)}
                      className="mt-1 h-4 w-4 accent-bg"
                      aria-label={`Sélectionner ${item.product.name}`}
                    />

                    <div className="min-w-0 flex-1">
                      <div className="grid grid-cols-[72px_minmax(0,1fr)] gap-4 sm:grid-cols-[88px_minmax(0,1fr)] sm:gap-5">
                        <Link
                          href={`/wear/${item.product.collection}/${item.product.id}`}
                          className="relative aspect-[4/5] overflow-hidden border border-bg/8 bg-white"
                        >
                          <Image
                            src={item.product.image}
                            alt={item.product.name}
                            fill
                            sizes="88px"
                            className="object-cover"
                          />
                        </Link>

                        <div className="min-w-0">
                          <div className="flex items-start justify-between gap-4">
                            <Link
                              href={`/wear/${item.product.collection}/${item.product.id}`}
                              className="block font-sans text-sm uppercase tracking-[0.18em] text-bg transition-colors duration-300 hover:text-bg/70"
                            >
                              {item.product.name}
                            </Link>

                            <button
                              type="button"
                              onClick={() => removeItem(item.productId, item.size)}
                              className="text-[0.58rem] uppercase tracking-[0.24em] text-bg/35 transition-colors duration-300 hover:text-bg"
                              aria-label={`Retirer ${item.product.name} du panier`}
                            >
                              Retirer
                            </button>
                          </div>

                          <div className="mt-3 flex flex-wrap items-center gap-x-4 gap-y-2 font-sans text-[0.62rem] uppercase tracking-[0.22em] text-bg/48">
                            <span>
                              {collectionLabels.get(item.product.collection) ??
                                item.product.collection}
                            </span>
                            <span className="hidden h-3 w-px bg-bg/10 sm:block" />
                            <span>Taille {item.size}</span>
                            <span className="hidden h-3 w-px bg-bg/10 sm:block" />
                            <span>
                              Prix unitaire{" "}
                              {formatWearPrice(
                                item.product.priceCents,
                                item.product.currency,
                              )}
                            </span>
                          </div>

                          <p className="mt-3 max-w-xl font-sans text-sm font-light leading-relaxed text-bg/62">
                            {item.product.description}
                          </p>
                        </div>
                      </div>

                      <div className="mt-5 flex flex-wrap items-center justify-between gap-4 border-t border-bg/8 pt-4">
                        <div className="flex items-center gap-3">
                          <span className="font-sans text-[0.62rem] uppercase tracking-[0.24em] text-bg/38">
                            Quantité
                          </span>
                          <div className="inline-flex items-center border border-bg/12">
                            <button
                              type="button"
                              onClick={() => decrementItem(item.productId, item.size)}
                              className="px-4 py-3 text-sm text-bg/75 transition-colors duration-300 hover:text-bg"
                              aria-label={`Diminuer la quantité de ${item.product.name}`}
                            >
                              -
                            </button>
                            <span className="min-w-12 px-2 text-center font-sans text-[0.72rem] uppercase tracking-[0.18em] text-bg/70">
                              {item.quantity}
                            </span>
                            <button
                              type="button"
                              onClick={() => incrementItem(item.productId, item.size)}
                              className="px-4 py-3 text-sm text-bg/75 transition-colors duration-300 hover:text-bg"
                              aria-label={`Augmenter la quantité de ${item.product.name}`}
                            >
                              +
                            </button>
                          </div>
                        </div>

                        <div className="flex items-center gap-4">
                          <span className="font-sans text-[0.62rem] uppercase tracking-[0.24em] text-bg/38">
                            Total ligne
                          </span>
                          <p className="font-serif text-xl text-bg">
                            {item.lineTotalFormatted}
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>
                </article>
              );
            })}
          </div>
        </div>

        <aside className="space-y-4 lg:sticky lg:top-28">
          <div className="border border-bg/10 bg-white p-6 md:p-8">
            <p className="font-sans text-[0.65rem] uppercase tracking-[0.28em] text-bg/42">
              Order Summary
            </p>
            <h2 className="mt-4 font-serif text-3xl text-bg">
              Résumé du panier
            </h2>

            <div className="mt-8 space-y-4 border-t border-bg/10 pt-6">
              <div className="flex items-center justify-between gap-4 font-sans text-sm text-bg/72">
                <span>Sous-total</span>
                <span>{subtotalFormatted}</span>
              </div>
              <div className="flex items-center justify-between gap-4 font-sans text-sm text-bg/72">
                <span>Livraison standard</span>
                <span>Offerte</span>
              </div>
              <div className="flex items-center justify-between gap-4 border-t border-bg/10 pt-4">
                <span className="font-sans text-[0.68rem] uppercase tracking-[0.24em] text-bg/52">
                  Total estimé
                </span>
                <span className="font-serif text-2xl text-bg">
                  {subtotalFormatted}
                </span>
              </div>
            </div>

            <p className="mt-5 font-sans text-[0.72rem] font-light leading-relaxed text-bg/58">
              Taxes et options de livraison définitives calculées à l’étape
              checkout.
            </p>

            <div className="mt-8 flex flex-col gap-3">
              <Link
                href="/wear/checkout"
                className="inline-flex items-center justify-center bg-bg px-6 py-4 text-paper transition-colors duration-300 hover:bg-surface-hover"
              >
                <span className="font-sans text-[0.65rem] font-bold uppercase tracking-[0.24em]">
                  Proceed to checkout
                </span>
              </Link>

              <Link
                href="/wear"
                className="inline-flex items-center justify-center border border-bg/12 px-6 py-4 text-bg/75 transition-colors duration-300 hover:border-bg/24 hover:text-bg"
              >
                <span className="font-sans text-[0.65rem] font-bold uppercase tracking-[0.24em]">
                  Continuer les achats
                </span>
              </Link>
            </div>
          </div>

          <div className="border border-bg/10 bg-white p-6">
            <div className="space-y-4">
              <div>
                <p className="font-sans text-[0.62rem] uppercase tracking-[0.24em] text-bg/40">
                  Livraison
                </p>
                <p className="mt-2 font-sans text-sm font-light leading-relaxed text-bg/66">
                  Standard offerte en France et en Europe sur cette phase de
                  lancement.
                </p>
              </div>

              <div className="border-t border-bg/8 pt-4">
                <p className="font-sans text-[0.62rem] uppercase tracking-[0.24em] text-bg/40">
                  Retours
                </p>
                <p className="mt-2 font-sans text-sm font-light leading-relaxed text-bg/66">
                  Retour possible sous 30 jours sur les pièces non portées.
                </p>
              </div>

              <div className="border-t border-bg/8 pt-4">
                <p className="font-sans text-[0.62rem] uppercase tracking-[0.24em] text-bg/40">
                  Paiement
                </p>
                <p className="mt-2 font-sans text-sm font-light leading-relaxed text-bg/66">
                  Paiement sécurisé via Stripe au checkout, directement dans
                  l’environnement CO-KAIN.
                </p>
              </div>
            </div>
          </div>
        </aside>
      </div>
    </section>
  );
}
