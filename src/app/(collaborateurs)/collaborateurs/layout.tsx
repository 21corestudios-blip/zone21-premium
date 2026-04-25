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
  const showGlobalFooter = Boolean(session);

  return (
    <div className="flex min-h-screen flex-col overflow-x-clip bg-[#121110] text-[#EAE8E3]">
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

      <div className="flex-1">
        {children}
      </div>

      {showGlobalFooter ? (
        <footer className="mt-12 border-t border-white/8 bg-[#0A0A09]">
          <div className="grid w-full gap-8 px-6 py-10 lg:grid-cols-[minmax(0,1.1fr)_0.9fr_auto] lg:px-10 2xl:px-14">
            <div>
              <p className="text-[0.62rem] uppercase tracking-[0.28em] text-[#C5B39B]">
                Portail collaborateurs
              </p>
              <p className="mt-3 max-w-2xl text-sm leading-7 text-white/60">
                Interface de consultation, filtrage, export et téléchargement des
                documents actifs, sans déplacement de l&apos;autorité normative hors
                de ZONE21_DEV.
              </p>
            </div>

            <div className="space-y-3 text-[0.68rem] uppercase tracking-[0.22em] text-white/35">
              <p>ZONE21_DEV reste la base active unique de référence.</p>
              <p>Portail lecture seule en phase de structuration.</p>
            </div>

            <div className="flex items-start lg:justify-end">
              <Link
                href="/contact"
                className="rounded-full border border-white/12 px-4 py-2 text-[0.64rem] uppercase tracking-[0.24em] text-white/72 transition-colors duration-500 hover:border-white/25 hover:text-white"
              >
                Support collaborateurs
              </Link>
            </div>
          </div>
        </footer>
      ) : null}
    </div>
  );
}
