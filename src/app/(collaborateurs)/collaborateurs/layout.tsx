import Image from "next/image";
import Link from "next/link";
import type { Metadata } from "next";

import { getSession } from "@/lib/auth";

export const metadata: Metadata = {
  title: "Collaborateurs",
  description:
    "Portail collaborateurs ZONE 21 pour consultation structurée du registre documentaire et des accès par rôle.",
  robots: {
    index: false,
    follow: false,
  },
};

export default async function CollaboratorsLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await getSession();

  return (
    <div className="min-h-screen bg-[#121110] text-[#EAE8E3]">
      <header className="border-b border-white/8 bg-[#121110]/92 backdrop-blur-md">
        <div className="flex w-full items-center justify-between gap-6 px-6 py-5 lg:px-10 2xl:px-14">
          <div className="flex items-center gap-5">
            <Link
              href="/"
              aria-label="Retour au site ZONE 21"
              className="transition-opacity duration-500 hover:opacity-80"
            >
              <Image
                src="/images/ui/logo-zone21-light.svg"
                alt="ZONE 21"
                width={150}
                height={40}
                className="h-5 w-auto"
              />
            </Link>

            <div className="hidden h-4 w-px bg-white/10 md:block" />

            <div className="hidden md:block">
              <p className="text-[0.62rem] uppercase tracking-[0.28em] text-white/35">
                Portail collaborateurs
              </p>
              <p className="mt-1 text-sm text-white/65">
                Lecture sécurisée du RDM et des documents actifs.
              </p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            {session ? (
              <>
                <div className="hidden rounded-full border border-white/10 px-4 py-2 text-right md:block">
                  <p className="text-[0.6rem] uppercase tracking-[0.28em] text-white/35">
                    Session
                  </p>
                  <p className="mt-1 text-sm text-[#F7F5F0]">
                    {session.roleLabel}
                  </p>
                </div>

                <form action="/api/auth/logout" method="post">
                  <input type="hidden" name="redirectTo" value="/collaborateurs" />
                  <button
                    type="submit"
                    className="rounded-full border border-white/12 px-4 py-2 text-[0.64rem] uppercase tracking-[0.24em] text-white/72 transition-colors duration-500 hover:border-white/25 hover:text-white"
                  >
                    Fermer
                  </button>
                </form>
              </>
            ) : (
              <Link
                href="/contact"
                className="rounded-full border border-white/12 px-4 py-2 text-[0.64rem] uppercase tracking-[0.24em] text-white/72 transition-colors duration-500 hover:border-white/25 hover:text-white"
              >
                Besoin d&apos;aide
              </Link>
            )}
          </div>
        </div>
      </header>

      {children}

      <footer className="border-t border-white/8">
        <div className="flex w-full flex-col gap-3 px-6 py-6 text-[0.68rem] uppercase tracking-[0.22em] text-white/35 md:flex-row md:items-center md:justify-between lg:px-10 2xl:px-14">
          <span>ZONE21_DEV reste la base active unique de référence.</span>
          <span>Portail lecture seule en phase de structuration.</span>
        </div>
      </footer>
    </div>
  );
}
