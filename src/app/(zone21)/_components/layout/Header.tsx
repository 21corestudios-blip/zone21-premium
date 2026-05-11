"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";

import { useScrolledHeader } from "@/hooks/useScrolledHeader";
import NavigationDrawer from "./NavigationDrawer";

const desktopLinkClassName =
  "relative font-sans text-[13px] uppercase tracking-widest text-white/82 transition-colors duration-300 hover:text-white after:absolute after:-bottom-2 after:left-0 after:h-px after:w-0 after:bg-white/80 after:transition-all after:duration-300 hover:after:w-full";

export default function Header() {
  const isScrolled = useScrolledHeader();
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
          <div className="flex items-center gap-12 lg:gap-16">
            <Link
              href="/"
              aria-label="Retour à l’accueil ARCANE"
              className="flex h-20 w-20 flex-shrink-0 items-center justify-center drop-shadow-[0_2px_10px_rgba(0,0,0,0.55)] transition-opacity duration-500 hover:opacity-80"
            >
              <Image
                src="/images/ui/ARCANE_header_blanc_500px.svg"
                alt="ARCANE"
                width={500}
                height={500}
                priority
                className="h-20 w-20 object-contain"
              />
            </Link>

            <nav
              className="hidden items-center gap-6 md:flex lg:gap-8"
              aria-label="Navigation principale"
            >
              <Link href="/ecosysteme" className={desktopLinkClassName}>
                Écosystème
              </Link>
              <Link href="/a-propos" className={desktopLinkClassName}>
                À Propos
              </Link>
            </nav>
          </div>

          <div className="flex items-center justify-end">
            <nav
              className="hidden items-center gap-6 md:flex lg:gap-8"
              aria-label="Navigation secondaire"
            >
              <Link href="/contact" className={desktopLinkClassName}>
                Contact
              </Link>

              <span aria-hidden="true" className="h-3 w-[1px] bg-white/20" />

              <button
                type="button"
                onClick={openDrawer}
                aria-label="Ouvrir le menu"
                aria-expanded={isDrawerOpen}
                aria-controls="navigation-drawer"
                className={`${desktopLinkClassName} drop-shadow-[0_2px_10px_rgba(0,0,0,0.55)]`}
              >
                Menu
              </button>
            </nav>

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
