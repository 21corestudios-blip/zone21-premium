"use client";

import Image from "next/image";
import Link from "next/link";
import { useMemo, useState } from "react";

import { getProductionArtistBySlug } from "@/data/production.artists";
import { formatProductionPrice } from "@/data/production.products";

import { useProductionCart } from "./ProductionCartProvider";

export default function ProductionCartPage() {
  const {
    clearCart,
    decrementItem,
    incrementItem,
    isHydrated,
    itemCount,
    items,
    removeItem,
    subtotalFormatted,
  } = useProductionCart();

  const artistLabels = useMemo(
    () =>
      new Map(
        items.map((item) => [
          item.product.artist,
          getProductionArtistBySlug(item.product.artist)?.name ??
            item.product.artist,
        ]),
      ),
    [items],
  );
  const [selectedItems, setSelectedItems] = useState<string[]>([]);

  const availableSelectionKeys = useMemo(
    () => items.map((item) => item.productId),
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
      if (!validSelectedItems.includes(item.productId)) {
        return;
      }

      removeItem(item.productId);
    });

    setSelectedItems([]);
  };

  if (!isHydrated) {
    return (
      <section className="mx-auto flex min-h-[60vh] w-full max-w-6xl items-center justify-center px-6 py-24 md:px-12">
        <p className="font-sans text-[0.68rem] uppercase tracking-[0.3em] text-[#121110]/45">
          Préparation du panier...
        </p>
      </section>
    );
  }

  if (!items.length) {
    return (
      <section className="mx-auto flex min-h-[60vh] w-full max-w-4xl flex-col items-center justify-center px-6 py-24 text-center md:px-12">
        <p className="font-sans text-[0.68rem] uppercase tracking-[0.3em] text-[#121110]/45">
          21 Production Panier
        </p>
        <h1 className="mt-6 font-serif text-4xl leading-none text-[#121110] md:text-5xl">
          Ton panier est vide
        </h1>
        <p className="mt-6 max-w-2xl font-sans text-base font-light leading-relaxed text-[#121110]/68 md:text-lg">
          Sélectionne tes beats, templates et ressources dans les boutiques
          artistes de 21 Production.
        </p>
        <Link
          href="/prod"
          className="mt-10 inline-flex items-center justify-center bg-[#121110] px-8 py-4 text-[#F7F5F0] transition-colors duration-300 hover:bg-[#2A2826]"
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
      <div className="border-b border-[#121110]/10 pb-8">
        <nav className="flex items-center gap-3 font-sans text-[0.62rem] uppercase tracking-[0.24em] text-[#121110]/42">
          <Link href="/prod" className="transition-colors duration-300 hover:text-[#121110]">
            21 Production
          </Link>
          <span>/</span>
          <span className="text-[#121110]/70">Panier</span>
        </nav>

        <div className="mt-6 flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
          <div>
            <p className="font-sans text-[0.68rem] uppercase tracking-[0.32em] text-[#121110]/42">
              Shopping Bag
            </p>
            <h1 className="mt-4 font-serif text-4xl leading-none text-[#121110] md:text-6xl">
              Panier
            </h1>
          </div>

          <div className="flex flex-wrap items-center gap-4 font-sans text-[0.65rem] uppercase tracking-[0.22em] text-[#121110]/48">
            <span>{itemCount} article{itemCount > 1 ? "s" : ""}</span>
            <span className="h-3 w-px bg-[#121110]/12" />
            <span>Accès digital rapide</span>
            <span className="h-3 w-px bg-[#121110]/12" />
            <span>Ressources premium</span>
          </div>
        </div>
      </div>

      <div className="grid gap-12 pt-10 lg:grid-cols-[minmax(0,1.2fr)_380px] lg:items-start">
        <div className="bg-white">
          <div className="mb-8 flex items-end justify-between gap-4 border-b border-[#121110]/10 pb-6">
            <div>
              <p className="font-sans text-[0.65rem] uppercase tracking-[0.26em] text-[#121110]/42">
                Sélection
              </p>
              <h2 className="mt-4 font-serif text-3xl text-[#121110]">
                {itemCount} article{itemCount > 1 ? "s" : ""}
              </h2>
            </div>

            <div className="flex items-center gap-4">
              <button
                type="button"
                onClick={toggleSelectAll}
                className="text-[0.62rem] uppercase tracking-[0.24em] text-[#121110]/45 transition-colors duration-300 hover:text-[#121110]"
              >
                {allSelected ? "Tout désélectionner" : "Tout sélectionner"}
              </button>

              <button
                type="button"
                onClick={clearCart}
                className="text-[0.62rem] uppercase tracking-[0.24em] text-[#121110]/45 transition-colors duration-300 hover:text-[#121110]"
              >
                Vider
              </button>
            </div>
          </div>

          <div className="mb-6 flex items-center justify-between gap-4 border-b border-[#121110]/8 pb-5">
            <p className="font-sans text-[0.62rem] uppercase tracking-[0.24em] text-[#121110]/38">
              {selectedCount > 0
                ? `${selectedCount} produit${selectedCount > 1 ? "s" : ""} sélectionné${selectedCount > 1 ? "s" : ""}`
                : "Sélectionne un ou plusieurs produits pour les retirer"}
            </p>

            <button
              type="button"
              onClick={removeSelectedItems}
              disabled={selectedCount === 0}
              className="inline-flex items-center justify-center border border-[#121110]/12 px-4 py-3 text-[0.62rem] uppercase tracking-[0.24em] text-[#121110] transition-colors duration-300 hover:border-[#121110]/24 disabled:cursor-not-allowed disabled:opacity-35"
            >
              Supprimer la sélection
            </button>
          </div>

          <div className="space-y-0">
            {items.map((item) => {
              const isSelected = validSelectedItems.includes(item.productId);
              const artistName =
                artistLabels.get(item.product.artist) ?? item.product.artist;

              return (
                <article key={item.productId} className="border-b border-[#121110]/8 py-6">
                  <div className="flex items-start gap-4">
                    <input
                      type="checkbox"
                      checked={isSelected}
                      onChange={() => toggleItemSelection(item.productId)}
                      className="mt-1 h-4 w-4 accent-[#121110]"
                      aria-label={`Sélectionner ${item.product.name}`}
                    />

                    <div className="min-w-0 flex-1">
                      <div className="grid grid-cols-[72px_minmax(0,1fr)] gap-4 sm:grid-cols-[88px_minmax(0,1fr)] sm:gap-5">
                        <Link
                          href={`/prod/${item.product.artist}/${item.product.id}`}
                          className="relative aspect-[4/5] overflow-hidden border border-[#121110]/8 bg-white"
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
                              href={`/prod/${item.product.artist}/${item.product.id}`}
                              className="block font-sans text-sm uppercase tracking-[0.18em] text-[#121110] transition-colors duration-300 hover:text-[#121110]/70"
                            >
                              {item.product.name}
                            </Link>

                            <button
                              type="button"
                              onClick={() => removeItem(item.productId)}
                              className="text-[0.58rem] uppercase tracking-[0.24em] text-[#121110]/35 transition-colors duration-300 hover:text-[#121110]"
                              aria-label={`Retirer ${item.product.name} du panier`}
                            >
                              Retirer
                            </button>
                          </div>

                          <div className="mt-3 flex flex-wrap items-center gap-x-4 gap-y-2 font-sans text-[0.62rem] uppercase tracking-[0.22em] text-[#121110]/48">
                            <span>{artistName}</span>
                            <span className="hidden h-3 w-px bg-[#121110]/10 sm:block" />
                            <span>{item.product.kind}</span>
                            <span className="hidden h-3 w-px bg-[#121110]/10 sm:block" />
                            <span>
                              Prix unitaire{" "}
                              {formatProductionPrice(
                                item.product.priceCents,
                                item.product.currency,
                              )}
                            </span>
                          </div>

                          <p className="mt-3 max-w-xl font-sans text-sm font-light leading-relaxed text-[#121110]/62">
                            {item.product.shortDescription}
                          </p>
                        </div>
                      </div>

                      <div className="mt-5 flex flex-wrap items-center justify-between gap-4 border-t border-[#121110]/8 pt-4">
                        <div className="flex items-center gap-3">
                          <span className="font-sans text-[0.62rem] uppercase tracking-[0.24em] text-[#121110]/38">
                            Quantité
                          </span>
                          <div className="inline-flex items-center border border-[#121110]/12">
                            <button
                              type="button"
                              onClick={() => decrementItem(item.productId)}
                              className="px-4 py-3 text-sm text-[#121110]/75 transition-colors duration-300 hover:text-[#121110]"
                              aria-label={`Diminuer la quantité de ${item.product.name}`}
                            >
                              -
                            </button>
                            <span className="min-w-12 px-2 text-center font-sans text-[0.72rem] uppercase tracking-[0.18em] text-[#121110]/70">
                              {item.quantity}
                            </span>
                            <button
                              type="button"
                              onClick={() => incrementItem(item.productId)}
                              className="px-4 py-3 text-sm text-[#121110]/75 transition-colors duration-300 hover:text-[#121110]"
                              aria-label={`Augmenter la quantité de ${item.product.name}`}
                            >
                              +
                            </button>
                          </div>
                        </div>

                        <div className="flex items-center gap-4">
                          <span className="font-sans text-[0.62rem] uppercase tracking-[0.24em] text-[#121110]/38">
                            Total ligne
                          </span>
                          <p className="font-serif text-xl text-[#121110]">
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
          <div className="border border-[#121110]/10 bg-white p-6 md:p-8">
            <p className="font-sans text-[0.65rem] uppercase tracking-[0.28em] text-[#121110]/42">
              Order Summary
            </p>
            <h2 className="mt-4 font-serif text-3xl text-[#121110]">
              Résumé du panier
            </h2>

            <div className="mt-8 space-y-4 border-t border-[#121110]/10 pt-6">
              <div className="flex items-center justify-between gap-4 font-sans text-sm text-[#121110]/72">
                <span>Sous-total</span>
                <span>{subtotalFormatted}</span>
              </div>
              <div className="flex items-center justify-between gap-4 font-sans text-sm text-[#121110]/72">
                <span>Livraison digitale</span>
                <span>Incluse</span>
              </div>
              <div className="flex items-center justify-between gap-4 border-t border-[#121110]/10 pt-4">
                <span className="font-sans text-[0.68rem] uppercase tracking-[0.24em] text-[#121110]/52">
                  Total estimé
                </span>
                <span className="font-serif text-2xl text-[#121110]">
                  {subtotalFormatted}
                </span>
              </div>
            </div>

            <p className="mt-5 font-sans text-[0.72rem] font-light leading-relaxed text-[#121110]/58">
              Validation et conditions d’accès finalisées avec l’équipe 21 Production.
            </p>

            <div className="mt-8 flex flex-col gap-3">
              <Link
                href="/contact"
                className="inline-flex items-center justify-center bg-[#121110] px-6 py-4 text-[#F7F5F0] transition-colors duration-300 hover:bg-[#2A2826]"
              >
                <span className="font-sans text-[0.65rem] font-bold uppercase tracking-[0.24em]">
                  Obtenir l&apos;accès
                </span>
              </Link>

              <Link
                href="/prod"
                className="inline-flex items-center justify-center border border-[#121110]/12 px-6 py-4 text-[#121110]/75 transition-colors duration-300 hover:border-[#121110]/24 hover:text-[#121110]"
              >
                <span className="font-sans text-[0.65rem] font-bold uppercase tracking-[0.24em]">
                  Continuer les achats
                </span>
              </Link>
            </div>
          </div>

          <div className="border border-[#121110]/10 bg-white p-6">
            <div className="space-y-4">
              <div>
                <p className="font-sans text-[0.62rem] uppercase tracking-[0.24em] text-[#121110]/40">
                  Accès
                </p>
                <p className="mt-2 font-sans text-sm font-light leading-relaxed text-[#121110]/66">
                  Ressources digitales, templates et assets délivrés après validation.
                </p>
              </div>

              <div className="border-t border-[#121110]/8 pt-4">
                <p className="font-sans text-[0.62rem] uppercase tracking-[0.24em] text-[#121110]/40">
                  Utilisation
                </p>
                <p className="mt-2 font-sans text-sm font-light leading-relaxed text-[#121110]/66">
                  Les conditions d’usage dépendent du type de ressource et du cadre du projet.
                </p>
              </div>

              <div className="border-t border-[#121110]/8 pt-4">
                <p className="font-sans text-[0.62rem] uppercase tracking-[0.24em] text-[#121110]/40">
                  Support
                </p>
                <p className="mt-2 font-sans text-sm font-light leading-relaxed text-[#121110]/66">
                  L’équipe peut accompagner l’intégration ou la personnalisation sur demande.
                </p>
              </div>
            </div>
          </div>
        </aside>
      </div>
    </section>
  );
}
