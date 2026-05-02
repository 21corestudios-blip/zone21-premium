"use client";

import Image from "next/image";
import Link from "next/link";

const footerLinkClassName =
  "font-sans text-sm text-white/70 transition-colors duration-300 hover:text-white";

export default function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="border-t border-white/5 bg-[#121110] px-6 pb-12 pt-24 text-[#EAE8E3] md:px-12">
      <div className="mx-auto flex max-w-7xl flex-col gap-20">
        <div className="grid grid-cols-1 gap-16 md:grid-cols-12 md:gap-8">
          <div className="flex flex-col gap-8 md:col-span-8">
            <Link
              href="/"
              aria-label="Retour à l’accueil Zone 21"
              className="inline-block transition-opacity duration-500 hover:opacity-80"
            >
              <Image
                src="/images/ui/logo-zone21-light.svg"
                alt="ZONE 21"
                width={120}
                height={30}
                className="h-3 w-auto md:h-4"
              />
            </Link>

            <p className="max-w-sm font-sans text-sm font-light leading-relaxed text-white/60 md:text-base">
              L&apos;architecture créative dédiée à l&apos;émergence des maisons
              de demain.
            </p>

            <form
              className="mt-4 flex max-w-sm flex-col gap-4"
              onSubmit={(event) => event.preventDefault()}
            >
              <label
                htmlFor="footer-email"
                className="font-sans text-[0.65rem] uppercase tracking-[0.2em] text-white/40"
              >
                Rejoindre le Cercle
              </label>

              <div className="flex items-center border-b border-white/20 pb-2 transition-colors duration-500 focus-within:border-white/60">
                <input
                  id="footer-email"
                  name="email"
                  type="email"
                  autoComplete="email"
                  placeholder="Votre adresse email"
                  className="w-full bg-transparent font-sans text-sm text-white placeholder:text-white/30 focus:outline-none"
                />

                <button
                  type="submit"
                  className="text-[0.65rem] uppercase tracking-[0.2em] text-white/70 transition-colors duration-300 hover:text-white"
                >
                  S&apos;inscrire
                </button>
              </div>
            </form>
          </div>

          <div className="flex flex-col gap-6 md:col-span-4 md:pl-12">
            <span className="mb-2 font-sans text-[0.65rem] uppercase tracking-[0.2em] text-white/40">
              La Maison
            </span>

            <Link href="/a-propos" className={footerLinkClassName}>
              À Propos
            </Link>

            <Link href="/contact" className={footerLinkClassName}>
              Contact
            </Link>

            <Link href="/collaborateurs" className={footerLinkClassName}>
              Accès collaborateurs
            </Link>

            <Link
              href="/mentions-legales"
              className={`${footerLinkClassName} mt-4 md:mt-0`}
            >
              Mentions Légales
            </Link>
          </div>
        </div>

        <div className="flex flex-col items-center justify-between gap-4 border-t border-white/5 pt-8 text-center md:flex-row md:text-left">
          <span className="font-sans text-[0.65rem] uppercase tracking-[0.1em] text-white/30">
            © {currentYear} Zone 21. Tous droits réservés.
          </span>

          <span className="font-sans text-[0.65rem] uppercase tracking-[0.1em] text-white/30">
            Conçu par{" "}
            <Link
              href="/core-studios"
              className="text-white/50 transition-colors hover:text-white"
            >
              21 Core Studios
            </Link>
          </span>
        </div>
      </div>
    </footer>
  );
}
