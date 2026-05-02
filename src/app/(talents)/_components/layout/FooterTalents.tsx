"use client";

import Image from "next/image";
import Link from "next/link";

const footerLinkClassName =
  "font-sans text-sm text-white/70 transition-colors duration-300 hover:text-white";

export default function FooterTalents() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="border-t border-white/5 bg-[#121110] px-6 pb-12 pt-24 text-[#EAE8E3] md:px-12">
      <div className="mx-auto flex max-w-7xl flex-col gap-20">
        <div className="grid grid-cols-1 gap-16 md:grid-cols-12 md:gap-8">
          <div className="flex flex-col gap-8 md:col-span-8">
            <Link
              href="/talents-agency"
              aria-label="Retour à l’accueil 21 Talents Agency"
              className="inline-block transition-opacity duration-500 hover:opacity-80"
            >
              <Image
                src="/images/ui/logo-zone21-light.svg"
                alt="ZONE 21"
                width={140}
                height={40}
                className="h-6 w-auto md:h-7"
              />
            </Link>

            <p className="max-w-md font-sans text-sm font-light leading-relaxed text-white/60 md:text-base">
              Agence de promotion de talents, influence, campagnes et activations
              de visibilité pour l&apos;écosystème Zone 21.
            </p>

            <form
              className="mt-4 flex max-w-sm flex-col gap-4"
              onSubmit={(event) => event.preventDefault()}
            >
              <label
                htmlFor="footer-talents-email"
                className="font-sans text-[0.65rem] uppercase tracking-[0.2em] text-white/40"
              >
                Recevoir les actualités talents
              </label>

              <div className="flex items-center border-b border-white/20 pb-2 transition-colors duration-500 focus-within:border-white/60">
                <input
                  id="footer-talents-email"
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
              21 Talents Agency
            </span>

            <Link href="/talents-agency/fashion-luxury" className={footerLinkClassName}>
              Fashion & Luxury
            </Link>
            <Link
              href="/talents-agency/lifestyle-hospitality"
              className={footerLinkClassName}
            >
              Lifestyle & Hospitality
            </Link>
            <Link href="/talents-agency/sport-performance" className={footerLinkClassName}>
              Sport & Performance
            </Link>
            <Link href="/talents-agency/culture-digital" className={footerLinkClassName}>
              Culture & Digital
            </Link>
            <Link href="/collaborateurs" className={footerLinkClassName}>
              Accès collaborateurs
            </Link>
          </div>
        </div>

        <div className="flex flex-col items-center justify-between gap-4 border-t border-white/5 pt-8 text-center md:flex-row md:text-left">
          <span className="font-sans text-[0.65rem] uppercase tracking-[0.1em] text-white/30">
            © {currentYear} 21 Talents Agency. Tous droits reserves.
          </span>

          <span className="font-sans text-[0.65rem] uppercase tracking-[0.1em] text-white/30">
            Une maison de{" "}
            <Link
              href="/"
              className="text-white/50 transition-colors hover:text-white"
            >
              Zone 21
            </Link>
          </span>
        </div>
      </div>
    </footer>
  );
}
