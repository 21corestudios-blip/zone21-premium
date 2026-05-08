"use client";

import Image from "next/image";
import Link from "next/link";

const footerLinkClassName =
  "font-sans text-sm text-white/70 transition-colors duration-300 hover:text-white";

export default function FooterProduction() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="border-t border-white/5 bg-[#121110] px-6 pb-12 pt-24 text-[#EAE8E3] md:px-12">
      <div className="mx-auto flex max-w-7xl flex-col gap-20">
        <div className="grid grid-cols-1 gap-16 md:grid-cols-12 md:gap-8">
          <div className="flex flex-col gap-8 md:col-span-8">
            <Link
              href="/prod"
              aria-label="Retour à l’accueil 21 Production"
              className="inline-flex h-8 w-36 items-center transition-opacity duration-500 hover:opacity-80 md:h-9 md:w-40"
            >
              <Image
                src="/images/ui/Z21_21_prod_logo.svg"
                alt="ZONE 21"
                width={250}
                height={230}
                className="max-h-full max-w-full object-contain"
              />
            </Link>

            <p className="max-w-md font-sans text-sm font-light leading-relaxed text-white/60 md:text-base">
              Le label, studio et marketplace créative de l’ecosysteme Zone 21
              pour beatmakers, DJs et artistes.
            </p>

            <form
              className="mt-4 flex max-w-sm flex-col gap-4"
              onSubmit={(event) => event.preventDefault()}
            >
              <label
                htmlFor="footer-production-email"
                className="font-sans text-[0.65rem] uppercase tracking-[0.2em] text-white/40"
              >
                Recevoir les drops
              </label>

              <div className="flex items-center border-b border-white/20 pb-2 transition-colors duration-500 focus-within:border-white/60">
                <input
                  id="footer-production-email"
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
              21 Production
            </span>

            <Link href="/prod/heka" className={footerLinkClassName}>
              Heka
            </Link>
            <Link href="/prod/axion" className={footerLinkClassName}>
              Axion
            </Link>
            <Link href="/prod/nova" className={footerLinkClassName}>
              Nova
            </Link>
            <Link href="/contact" className={footerLinkClassName}>
              Contact prive
            </Link>
            <Link href="/collaborateurs" className={footerLinkClassName}>
              Accès collaborateurs
            </Link>
          </div>
        </div>

        <div className="flex flex-col items-center justify-between gap-4 border-t border-white/5 pt-8 text-center md:flex-row md:text-left">
          <span className="font-sans text-[0.65rem] uppercase tracking-[0.1em] text-white/30">
            © {currentYear} 21 Production. Tous droits reserves.
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
