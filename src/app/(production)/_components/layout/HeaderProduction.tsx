"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";

import NavigationDrawer from "@/app/(zone21)/_components/layout/NavigationDrawer";
import { useScrolledHeader } from "@/hooks/useScrolledHeader";
import { useProductionCart } from "../cart/ProductionCartProvider";

const linkClassName =
  "relative font-sans text-[13px] uppercase tracking-widest text-white/82 transition-colors duration-300 hover:text-white after:absolute after:-bottom-2 after:left-0 after:h-px after:w-0 after:bg-white/80 after:transition-all after:duration-300 hover:after:w-full";

const artistLinkClassName =
  "relative font-sans text-xs uppercase tracking-[0.22em] text-white/72 transition-colors duration-300 hover:text-white after:absolute after:-bottom-2 after:left-0 after:h-px after:w-0 after:bg-white/65 after:transition-all after:duration-300 hover:after:w-full";

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
            ? "h-24 border-b border-white/10 bg-bg/92 backdrop-blur-md"
            : "h-24 border-b border-transparent bg-transparent"
        }`}
      >
        {!isScrolled ? (
          <div
            aria-hidden="true"
            className="pointer-events-none absolute inset-x-0 top-0 h-24 bg-gradient-to-b from-black/58 via-black/24 to-transparent"
          />
        ) : null}

        <div className="relative flex h-full w-full items-center justify-between px-6 md:px-10 lg:px-16">
          <div className="flex items-center gap-10 lg:gap-14">
            <Link
              href="/prod"
              aria-label="Retour à l’accueil BACKSPIN"
              className="flex h-20 w-40 flex-shrink-0 items-center justify-center drop-shadow-[0_2px_10px_rgba(0,0,0,0.55)] transition-opacity duration-500 hover:opacity-80"
            >
              <Image
                src="/images/ui/BACKSPIN_LOGO_PRINCIPAL_ROUGE-SUR-BLANC_v2.svg"
                alt="BACKSPIN"
                width={6250}
                height={1753}
                priority
                className="h-auto w-40 object-contain"
              />
            </Link>

            <nav
              className="hidden items-center gap-5 lg:flex"
              aria-label="Artistes BACKSPIN"
            >
              <Link href="/prod/heka" className={artistLinkClassName}>
                Heka
              </Link>
              <Link href="/prod/axion" className={artistLinkClassName}>
                Axion
              </Link>
              <Link href="/prod/nova" className={artistLinkClassName}>
                Nova
              </Link>
            </nav>
          </div>

          <div className="flex items-center gap-4 md:gap-6 lg:gap-8">
            <nav
              className="hidden items-center gap-6 md:flex lg:gap-8"
              aria-label="Navigation BACKSPIN"
            >
              <Link href="/" className={linkClassName}>
                ARCANE
              </Link>
              <Link href="/ecosysteme" className={linkClassName}>
                Écosystème
              </Link>
              <Link href="/contact" className={linkClassName}>
                Contact
              </Link>

              <span aria-hidden="true" className="h-3 w-px bg-white/20" />

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
              className="inline-flex h-11 min-w-11 items-center justify-center border border-white/18 px-3 font-serif text-[0.68rem] uppercase tracking-[0.18em] text-white/90 drop-shadow-[0_2px_10px_rgba(0,0,0,0.55)] transition-colors duration-300 hover:border-white/35 hover:bg-white hover:text-bg sm:gap-3 sm:px-4 sm:py-2"
              aria-label="Voir le panier BACKSPIN"
            >
              <span className="hidden sm:inline">Panier</span>
              <span className="inline-flex min-w-6 items-center justify-center border-l border-current/20 px-2 py-1 font-sans text-[0.58rem] tracking-[0.18em]">
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
                <span className="h-px w-5 bg-white transition-transform duration-500" />
                <span className="h-px w-5 bg-white transition-transform duration-500" />
              </button>
            </div>
          </div>
        </div>
      </header>

      <NavigationDrawer isOpen={isDrawerOpen} onClose={closeDrawer} />
    </>
  );
}
