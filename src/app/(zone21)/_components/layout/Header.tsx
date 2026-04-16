"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";

import NavigationDrawer from "./NavigationDrawer";

const desktopLinkClassName =
  "text-[0.65rem] uppercase tracking-[0.25em] text-white/70 transition-colors duration-500 hover:text-white";

export default function Header() {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50);
    };

    handleScroll();
    window.addEventListener("scroll", handleScroll, { passive: true });

    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, []);

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
        <div className="flex w-full items-center justify-between px-6 lg:px-12">
          <div className="flex items-center gap-12 lg:gap-16">
            <Link
              href="/"
              aria-label="Retour à l’accueil Zone 21"
              className="flex-shrink-0 transition-opacity duration-500 hover:opacity-80"
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
                className={desktopLinkClassName}
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
                className="flex flex-col gap-[5px] p-2"
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
