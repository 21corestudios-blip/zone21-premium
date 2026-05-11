"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";

import NavigationDrawer from "@/app/(zone21)/_components/layout/NavigationDrawer";
import { useScrolledHeader } from "@/hooks/useScrolledHeader";
import { useTalentsCart } from "../cart/TalentsCartProvider";

const linkClassName =
  "relative font-sans text-[13px] uppercase tracking-widest text-white/82 transition-colors duration-300 hover:text-white after:absolute after:-bottom-2 after:left-0 after:h-px after:w-0 after:bg-white/80 after:transition-all after:duration-300 hover:after:w-full";

const divisionLinkClassName =
  "relative font-sans text-[12px] uppercase tracking-[0.22em] text-white/72 transition-colors duration-300 hover:text-white after:absolute after:-bottom-2 after:left-0 after:h-px after:w-0 after:bg-white/65 after:transition-all after:duration-300 hover:after:w-full";

export default function HeaderTalents() {
  const isScrolled = useScrolledHeader();
  const { itemCount, isHydrated } = useTalentsCart();
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);

  const openDrawer = () => setIsDrawerOpen(true);
  const closeDrawer = () => setIsDrawerOpen(false);

  return (
    <>
      <header
        className={`fixed left-0 top-0 z-50 w-full transition-all duration-700 ease-[cubic-bezier(0.25,1,0.5,1)] ${
          isScrolled
            ? "h-24 border-b border-white/10 bg-[#121110]/92 backdrop-blur-md"
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
              href="/talents-agency"
              aria-label="Retour à l’accueil EKKO"
              className="flex h-20 w-20 flex-shrink-0 items-center justify-center drop-shadow-[0_2px_10px_rgba(0,0,0,0.55)] transition-opacity duration-500 hover:opacity-80"
            >
              <Image
                src="/images/ui/EKKO_header_blanc_500px.svg"
                alt="ARCANE"
                width={500}
                height={500}
                priority
                className="h-20 w-20 object-contain"
              />
            </Link>

            <nav
              className="hidden items-center gap-5 lg:flex"
              aria-label="Divisions EKKO"
            >
              <Link
                href="/talents-agency/fashion-luxury"
                className={divisionLinkClassName}
              >
                Fashion & Luxury
              </Link>
              <Link
                href="/talents-agency/lifestyle-hospitality"
                className={divisionLinkClassName}
              >
                Lifestyle
              </Link>
              <Link
                href="/talents-agency/sport-performance"
                className={divisionLinkClassName}
              >
                Sport
              </Link>
              <Link
                href="/talents-agency/culture-digital"
                className={divisionLinkClassName}
              >
                Culture & Digital
              </Link>
            </nav>
          </div>

          <div className="flex items-center gap-4 md:gap-6 lg:gap-8">
            <nav
              className="hidden items-center gap-6 md:flex lg:gap-8"
              aria-label="Navigation EKKO"
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
              href="/talents-agency/panier"
              className="inline-flex h-11 min-w-11 items-center justify-center border border-white/18 px-3 font-serif text-[0.68rem] uppercase tracking-[0.18em] text-white/90 drop-shadow-[0_2px_10px_rgba(0,0,0,0.55)] transition-colors duration-300 hover:border-white/35 hover:bg-white hover:text-[#121110] sm:gap-3 sm:px-4 sm:py-2"
              aria-label="Voir le panier EKKO"
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
