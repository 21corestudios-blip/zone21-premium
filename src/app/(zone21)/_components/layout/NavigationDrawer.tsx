"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";

import { homeData } from "@/data/home.data";

interface NavigationDrawerProps {
  isOpen: boolean;
  onClose: () => void;
}

const primaryLinks = [
  { name: "Accueil", href: "/" },
  { name: "Collaborateurs", href: "/collaborateurs" },
  { name: "Contact", href: "/contact" },
  { name: "À propos", href: "/a-propos" },
  { name: "Mentions légales", href: "/mentions-legales" },
];

const sectionLabelClassName =
  "font-sans text-[0.62rem] uppercase tracking-[0.26em] text-white/35";

const primaryLinkTextClassName =
  "font-sans text-[0.92rem] uppercase tracking-[0.24em] text-white/88 transition-all duration-500 ease-out group-hover:translate-x-2 group-hover:text-white md:text-[1rem]";

const ecosystemTitleClassName =
  "font-sans text-[0.92rem] uppercase tracking-[0.24em] text-white/88 transition-all duration-500 ease-out group-hover:translate-x-2 group-hover:text-white md:text-[1rem]";

const ecosystemCategoryClassName =
  "font-sans text-[0.54rem] uppercase tracking-[0.2em] text-white/30 transition-colors duration-500 group-hover:text-white/48";

const ecosystemNameClassName =
  "mt-2 font-sans text-[0.82rem] uppercase tracking-[0.22em] text-white/88 transition-all duration-500 ease-out group-hover:translate-x-2 group-hover:text-white md:text-[0.88rem]";

export default function NavigationDrawer({
  isOpen,
  onClose,
}: NavigationDrawerProps) {
  const [isEcosystemOpen, setIsEcosystemOpen] = useState(false);
  const houses = homeData.maisons.map((house) => ({
    name: house.name,
    href: house.href,
    category: house.category,
  }));

  useEffect(() => {
    if (!isOpen) {
      document.body.style.overflow = "unset";
      return;
    }

    document.body.style.overflow = "hidden";

    const handleClose = () => {
      setIsEcosystemOpen(false);
      onClose();
    };

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        handleClose();
      }
    };

    window.addEventListener("keydown", handleKeyDown);

    return () => {
      document.body.style.overflow = "unset";
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [isOpen, onClose]);

  const handleClose = () => {
    setIsEcosystemOpen(false);
    onClose();
  };

  return (
    <>
      <div
        className={`fixed inset-0 z-[60] bg-[#121110]/40 backdrop-blur-sm transition-all duration-700 ease-[cubic-bezier(0.25,1,0.5,1)] ${
          isOpen ? "visible opacity-100" : "invisible opacity-0"
        }`}
        onClick={handleClose}
        aria-hidden="true"
      />

      <div
        id="navigation-drawer"
        className={`fixed right-0 top-0 z-[70] flex h-full w-full transform flex-col border-l border-white/5 bg-[#121110] transition-transform duration-700 ease-[cubic-bezier(0.25,1,0.5,1)] md:w-[450px] ${
          isOpen ? "translate-x-0" : "translate-x-full"
        }`}
        role="dialog"
        aria-modal="true"
        aria-label="Menu principal"
      >
        <div className="flex items-center justify-between p-6 md:p-12">
          <Link
            href="/"
            onClick={handleClose}
            aria-label="Retour à l’accueil Zone 21"
            className="transition-opacity duration-500 hover:opacity-80"
          >
            <Image
              src="/images/ui/logo-zone21-light.svg"
              alt="ZONE 21"
              width={200}
              height={60}
              className="h-4 w-auto md:h-5"
            />
          </Link>

          <button
            type="button"
            onClick={handleClose}
            aria-label="Fermer le menu"
            className="text-[0.65rem] uppercase tracking-[0.25em] text-white/70 transition-colors duration-500 hover:text-white"
          >
            Fermer
          </button>
        </div>

        <nav
          className="mt-8 flex flex-1 flex-col overflow-y-auto px-6 pb-8 md:px-12"
          aria-label="Navigation principale du menu"
        >
          <div className="border-b border-white/5 pb-10">
            <p className={`mb-6 ${sectionLabelClassName}`}>
              Navigation
            </p>

            <div className="flex flex-col gap-5">
              {primaryLinks.map((item) => (
                <Link
                  key={item.name}
                  href={item.href}
                  className="group flex w-max items-center"
                  onClick={handleClose}
                >
                  <span className={primaryLinkTextClassName}>
                    {item.name}
                  </span>
                </Link>
              ))}
            </div>
          </div>

          <div
            className="border-b border-white/5 py-10"
            onMouseEnter={() => setIsEcosystemOpen(true)}
              onMouseLeave={() => setIsEcosystemOpen(false)}
          >
            <button
              type="button"
              onClick={() => setIsEcosystemOpen((current) => !current)}
              className="group flex w-max items-center text-left"
              aria-expanded={isEcosystemOpen}
              aria-controls="drawer-ecosystem"
            >
              <span className={ecosystemTitleClassName}>
                Écosystème
              </span>
            </button>

            <div
              id="drawer-ecosystem"
              className={`grid overflow-hidden transition-[grid-template-rows,opacity,margin] duration-500 ease-[cubic-bezier(0.25,1,0.5,1)] ${
                isEcosystemOpen
                  ? "mt-8 grid-rows-[1fr] opacity-100"
                  : "mt-0 grid-rows-[0fr] opacity-0"
              }`}
            >
              <div className="min-h-0">
                <div className="flex flex-col gap-5 border-l border-white/10 pl-6">
                  <Link
                    href="/ecosysteme"
                    onClick={handleClose}
                    className="font-sans text-[0.72rem] uppercase tracking-[0.24em] text-white/52 transition-colors duration-500 hover:text-white/80"
                  >
                    Vue d&apos;ensemble
                  </Link>

                  {houses.map((item) => (
                    <Link
                      key={item.name}
                      href={item.href}
                      onClick={handleClose}
                      className="group block"
                    >
                      <p className={`whitespace-nowrap ${ecosystemCategoryClassName}`}>
                        {item.category}
                      </p>
                      <p className={ecosystemNameClassName}>
                        {item.name}
                      </p>
                    </Link>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </nav>
      </div>
    </>
  );
}
