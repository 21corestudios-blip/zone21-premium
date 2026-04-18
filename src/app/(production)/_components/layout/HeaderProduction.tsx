"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";

import NavigationDrawer from "@/app/(zone21)/_components/layout/NavigationDrawer";
import { useScrolledHeader } from "@/hooks/useScrolledHeader";
import { useProductionCart } from "../cart/ProductionCartProvider";

const linkClassName =
  "text-[0.65rem] uppercase tracking-[0.25em] text-white/78 transition-colors duration-500 hover:text-white";

const artistLinkClassName =
  "text-[0.6rem] uppercase tracking-[0.2em] text-white/72 transition-colors duration-500 hover:text-white";

export default function HeaderProduction() {
  const isScrolled = useScrolledHeader();
  const { itemCount, isHydrated } = useProductionCart();
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);

  const openDrawer = () => setIsDrawerOpen(true);
  const closeDrawer = () => setIsDrawerOpen(false);

  return (
    <>
      <header
        className={`fixed left-0 top-0 z-50 w-full transition-all duration-700 ease-[cubic-bezier(0.25,1,0.5,1)] ${
          isScrolled
            ? "border-b border-white/5 bg-[#121110]/90 py-4 shadow-sm backdrop-blur-md"
            : "border-transparent bg-transparent py-8"
        }`}
      >
        {!isScrolled ? (
          <div
            aria-hidden="true"
            className="pointer-events-none absolute inset-x-0 top-0 h-28 bg-gradient-to-b from-black/58 via-black/24 to-transparent"
          />
        ) : null}

        <div className="relative flex w-full items-center justify-between px-6 lg:px-12">
          <div className="flex items-center gap-10 lg:gap-14">
            <Link
              href="/prod"
              aria-label="Retour à l’accueil 21 Production"
              className="flex-shrink-0 drop-shadow-[0_2px_10px_rgba(0,0,0,0.55)] transition-opacity duration-500 hover:opacity-80"
            >
              <Image
                src="/images/ui/logo-zone21-light.svg"
                alt="ZONE 21"
                width={140}
                height={40}
                priority
                className="h-5 w-auto md:h-6"
              />
            </Link>

            <nav
              className="hidden items-center gap-5 lg:flex"
              aria-label="Artistes 21 Production"
            >
              <Link href="/prod/nova" className={artistLinkClassName}>
                Nova
              </Link>
              <Link href="/prod/elya" className={artistLinkClassName}>
                Elya
              </Link>
              <Link href="/prod/kael" className={artistLinkClassName}>
                Kael
              </Link>
            </nav>
          </div>

          <div className="flex items-center gap-4 md:gap-6 lg:gap-8">
            <nav
              className="hidden items-center gap-6 md:flex lg:gap-8"
              aria-label="Navigation 21 Production"
            >
              <Link href="/" className={linkClassName}>
                Zone 21
              </Link>
              <Link href="/ecosysteme" className={linkClassName}>
                Écosystème
              </Link>
              <Link href="/contact" className={linkClassName}>
                Contact
              </Link>

              <span aria-hidden="true" className="h-3 w-[1px] bg-white/20" />

              <button
                type="button"
                onClick={openDrawer}
                aria-label="Ouvrir le menu"
                aria-expanded={isDrawerOpen}
                aria-controls="navigation-drawer"
                className={`${linkClassName} drop-shadow-[0_2px_10px_rgba(0,0,0,0.55)]`}
              >
                Menu
              </button>
            </nav>

            <Link
              href="/prod/panier"
              className="inline-flex items-center gap-3 border border-white/16 px-4 py-2 text-[0.6rem] uppercase tracking-[0.25em] text-white/88 drop-shadow-[0_2px_10px_rgba(0,0,0,0.55)] transition-colors duration-500 hover:border-white/30 hover:text-white"
              aria-label="Voir le panier 21 Production"
            >
              <span>Panier</span>
              <span className="inline-flex min-w-6 items-center justify-center rounded-full border border-white/18 px-2 py-1 text-[0.58rem] tracking-[0.18em] text-white/72">
                {isHydrated ? itemCount : 0}
              </span>
            </Link>

            <div className="flex md:hidden">
              <button
                type="button"
                onClick={openDrawer}
                aria-label="Ouvrir le menu"
                aria-expanded={isDrawerOpen}
                aria-controls="navigation-drawer"
                className="flex flex-col gap-[5px] p-2 drop-shadow-[0_2px_10px_rgba(0,0,0,0.55)]"
              >
                <span className="h-[1px] w-5 bg-white transition-transform duration-500" />
                <span className="h-[1px] w-5 bg-white transition-transform duration-500" />
              </button>
            </div>
          </div>
        </div>
      </header>

      <NavigationDrawer isOpen={isDrawerOpen} onClose={closeDrawer} />
    </>
  );
}
