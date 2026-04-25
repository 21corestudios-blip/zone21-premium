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
    <section className="mx-auto flex w-full max-w-7xl flex-col gap-8 px-6 py-12 lg:px-12">
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

      <div className="grid gap-5 md:grid-cols-2 xl:grid-cols-3">
        {collaboratorRoles.map((role) => {
          const details = roleDetails[role];

          return (
            <form
              key={role}
              action="/api/auth/session"
              method="post"
              className="flex h-full flex-col justify-between rounded-[1.75rem] border border-white/10 bg-white/[0.03] p-6 shadow-[0_24px_80px_rgba(0,0,0,0.28)] backdrop-blur-sm"
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

              <div className="mt-8">
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
  );
}
