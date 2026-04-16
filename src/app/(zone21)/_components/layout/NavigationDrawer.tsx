"use client";

import { useEffect } from "react";
import Image from "next/image";
import Link from "next/link";

interface NavigationDrawerProps {
  isOpen: boolean;
  onClose: () => void;
}

const primaryLinks = [
  { name: "Accueil", href: "/" },
  { name: "Écosystème", href: "/ecosysteme" },
  { name: "À propos", href: "/a-propos" },
  { name: "Contact", href: "/contact" },
];

const secondaryLinks = [
  { name: "Contact", href: "/contact" },
  { name: "Espace Client (Login)", href: "/login" },
];

export default function NavigationDrawer({
  isOpen,
  onClose,
}: NavigationDrawerProps) {
  useEffect(() => {
    if (!isOpen) {
      document.body.style.overflow = "unset";
      return;
    }

    document.body.style.overflow = "hidden";

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        onClose();
      }
    };

    window.addEventListener("keydown", handleKeyDown);

    return () => {
      document.body.style.overflow = "unset";
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [isOpen, onClose]);

  return (
    <>
      <div
        className={`fixed inset-0 z-[60] bg-[#121110]/40 backdrop-blur-sm transition-all duration-700 ease-[cubic-bezier(0.25,1,0.5,1)] ${
          isOpen ? "visible opacity-100" : "invisible opacity-0"
        }`}
        onClick={onClose}
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
            onClick={onClose}
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
            onClick={onClose}
            aria-label="Fermer le menu"
            className="text-[0.65rem] uppercase tracking-[0.25em] text-white/70 transition-colors duration-500 hover:text-white"
          >
            Fermer
          </button>
        </div>

        <nav
          className="mt-12 flex flex-col gap-6 overflow-y-auto px-6 md:px-12"
          aria-label="Navigation principale du menu"
        >
          {primaryLinks.map((item) => (
            <Link
              key={item.name}
              href={item.href}
              className="group flex w-max items-center"
              onClick={onClose}
            >
              <span className="font-serif text-4xl font-light tracking-wide text-white/90 transition-all duration-500 ease-out group-hover:translate-x-3 group-hover:text-white md:text-5xl">
                {item.name}
              </span>
            </Link>
          ))}
        </nav>

        <div className="mt-auto flex flex-col gap-6 border-t border-white/5 p-6 md:p-12">
          {secondaryLinks.map((item) => (
            <Link
              key={item.name}
              href={item.href}
              onClick={onClose}
              className="text-[0.65rem] uppercase tracking-[0.25em] text-white/50 transition-colors duration-500 hover:text-white"
            >
              {item.name}
            </Link>
          ))}
        </div>
      </div>
    </>
  );
}
