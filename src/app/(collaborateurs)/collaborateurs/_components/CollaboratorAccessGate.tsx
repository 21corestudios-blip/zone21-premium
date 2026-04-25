import { collaboratorRoles, permissionLabels, roleDetails } from "@/lib/permissions";
import { listPermissionsForRole } from "@/lib/rbac";

interface CollaboratorAccessGateProps {
  redirectTo: string;
  title?: string;
  description?: string;
}

export default function CollaboratorAccessGate({
  redirectTo,
  title = "Accès collaborateurs",
  description = "Connexion prototype locale pour cadrer l'espace collaborateurs, les rôles et les permissions avant branchement sur une authentification forte.",
}: CollaboratorAccessGateProps) {
  return (
    <>
      <section className="mx-auto flex w-full max-w-7xl flex-col gap-8 px-6 py-12 pb-16 lg:px-12 lg:pb-20">
        <div className="max-w-3xl">
          <p className="text-[0.68rem] uppercase tracking-[0.28em] text-[#C5B39B]">
            Portail interne
          </p>
          <h1 className="mt-4 font-serif text-4xl text-[#F7F5F0] md:text-5xl">
            {title}
          </h1>
          <p className="mt-4 max-w-2xl text-sm leading-7 text-white/68 md:text-base">
            {description}
          </p>
        </div>

        <div className="grid items-start gap-5 md:grid-cols-2 xl:grid-cols-3">
          {collaboratorRoles.map((role) => {
            const details = roleDetails[role];

            return (
              <form
                key={role}
                action="/api/auth/session"
                method="post"
                className="flex min-h-[22rem] flex-col rounded-[1.75rem] border border-white/10 bg-[#181715] p-6 shadow-[0_14px_34px_rgba(0,0,0,0.16)]"
              >
                <div>
                  <p className="text-[0.64rem] uppercase tracking-[0.28em] text-white/35">
                    Profil
                  </p>
                  <h2 className={`mt-3 text-lg uppercase tracking-[0.18em] ${details.accent}`}>
                    {details.label}
                  </h2>
                  <p className="mt-3 text-sm leading-6 text-white/62">
                    {details.summary}
                  </p>

                  <div className="mt-6 flex flex-wrap gap-2">
                    {listPermissionsForRole(role).map((permission) => (
                      <span
                        key={permission}
                        className="rounded-full border border-white/10 px-3 py-1 text-[0.62rem] uppercase tracking-[0.18em] text-white/62"
                      >
                        {permissionLabels[permission]}
                      </span>
                    ))}
                  </div>
                </div>

              <div className="mt-8 pt-2">
                <input type="hidden" name="role" value={role} />
                <input type="hidden" name="redirectTo" value={redirectTo} />
                <button
                    type="submit"
                    className="w-full rounded-full border border-[#C5B39B]/60 bg-[#C5B39B]/12 px-5 py-3 text-[0.68rem] uppercase tracking-[0.26em] text-[#F7F5F0] transition-colors duration-500 hover:bg-[#C5B39B]/20"
                  >
                    Ouvrir la session
                  </button>
                </div>
              </form>
            );
          })}
        </div>
      </section>

      <footer className="border-t border-white/8 bg-[#0A0A09]">
        <div className="mx-auto grid w-full max-w-7xl gap-8 px-6 py-10 lg:grid-cols-[minmax(0,1.1fr)_0.9fr_auto] lg:px-12">
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
            <a
              href="/contact"
              className="rounded-full border border-white/12 px-4 py-2 text-[0.64rem] uppercase tracking-[0.24em] text-white/72 transition-colors duration-500 hover:border-white/25 hover:text-white"
            >
              Support collaborateurs
            </a>
          </div>
        </div>
      </footer>
    </>
  );
}
