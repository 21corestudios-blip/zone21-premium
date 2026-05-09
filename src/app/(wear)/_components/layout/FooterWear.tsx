"use client";

import Image from "next/image";
import Link from "next/link";

const footerLinkClassName =
  "font-sans text-xs uppercase tracking-[0.16em] text-white/55 transition-colors duration-300 hover:text-white";

export default function FooterWear() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="border-t border-white/10 bg-[#121110] px-6 pb-12 pt-24 text-[#EAE8E3] md:px-10 lg:px-16">
      <div className="mx-auto flex max-w-7xl flex-col gap-20">
        <div className="grid grid-cols-1 gap-16 md:grid-cols-12 md:gap-8">
          <div className="flex flex-col gap-8 md:col-span-8">
            <Link
              href="/wear"
              aria-label="Retour à l’accueil 21 Wear"
              className="inline-flex h-[120px] w-[120px] items-center justify-center transition-opacity duration-500 hover:opacity-80"
            >
              <Image
                src="/images/ui/Z21_21_WEAR_logo-01.svg"
                alt="ZONE 21"
                width={500}
                height={500}
                className="h-[120px] w-[120px] object-contain"
              />
            </Link>

            <p className="max-w-sm font-sans text-sm font-light leading-relaxed text-white/60 md:text-base">
              La maison de prêt-à-porter de l’écosystème Zone 21.
            </p>

            <form
              className="mt-4 flex max-w-sm flex-col gap-4"
              onSubmit={(event) => event.preventDefault()}
            >
              <label
                htmlFor="footer-wear-email"
                className="font-sans text-[13px] font-bold uppercase tracking-[0.2em] text-white/48"
              >
                Rejoindre le Cercle
              </label>

              <div className="flex items-center border-b border-white/20 pb-2 transition-colors duration-500 focus-within:border-white/60">
                <input
                  id="footer-wear-email"
                  name="email"
                  type="email"
                  autoComplete="email"
                  placeholder="Votre adresse email"
                  className="w-full bg-transparent font-sans text-sm text-white placeholder:text-white/30 focus:outline-none"
                />

                <button
                  type="submit"
                  className="font-serif text-[0.75rem] uppercase tracking-[0.16em] text-white/76 transition-colors duration-300 hover:text-white"
                >
                  S&apos;inscrire
                </button>
              </div>
            </form>
          </div>

          <div className="flex flex-col gap-6 md:col-span-4 md:pl-12">
            <span className="mb-2 font-sans text-[13px] font-bold uppercase tracking-[0.2em] text-white/48">
              21 Wear
            </span>

            <Link href="/wear/classic" className={footerLinkClassName}>
              Classic Collection
            </Link>

            <Link href="/wear/urban" className={footerLinkClassName}>
              Urban Collection
            </Link>

            <Link href="/wear/heritage" className={footerLinkClassName}>
              Heritage Collection
            </Link>

            <Link href="/wear/studio" className={footerLinkClassName}>
              Studio Collection
            </Link>

            <Link href="/collaborateurs" className={footerLinkClassName}>
              Accès collaborateurs
            </Link>
          </div>
        </div>

        <div className="flex flex-col items-center justify-between gap-4 border-t border-white/5 pt-8 text-center md:flex-row md:text-left">
          <span className="font-sans text-[0.65rem] uppercase tracking-[0.1em] text-white/30">
            © {currentYear} 21 Wear. Tous droits réservés.
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
