import Link from "next/link";
import { notFound } from "next/navigation";

import CollaboratorAccessGate from "../../_components/CollaboratorAccessGate";
import { getSession } from "@/lib/auth";
import { hasPermission } from "@/lib/rbac";
import { getRdmRecordById } from "@/lib/rdm-service";
import { roleDetails } from "@/lib/permissions";

export default async function CollaboratorDocumentPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const session = await getSession();

  if (!session) {
    return (
      <CollaboratorAccessGate
        redirectTo={`/collaborateurs/documents/${id}`}
        title="Authentification requise"
        description="Choisissez un rôle prototype pour ouvrir cette fiche documentaire. Les contrôles d'accès sont déjà appliqués côté données et côté API."
      />
    );
  }

  const record = getRdmRecordById(id, session.role);

  if (!record) {
    notFound();
  }

  const canManageAccess = hasPermission(session.role, "manage_access");
  const pdfPreviewUrl = `/api/documents/${record.id}/download?format=pdf&disposition=inline`;

  return (
    <main className="flex w-full flex-col gap-10 px-6 py-12 lg:px-10 2xl:px-14">
      <div className="flex flex-wrap items-center gap-4">
        <Link
          href="/collaborateurs"
          className="rounded-full border border-white/12 px-4 py-2 text-[0.62rem] uppercase tracking-[0.24em] text-white/75 transition-colors duration-500 hover:border-white/25 hover:text-white"
        >
          Retour au portail
        </Link>
        <a
          href={`/api/documents/${record.id}/download?format=pdf`}
          className="rounded-full border border-[#C5B39B]/35 px-4 py-2 text-[0.62rem] uppercase tracking-[0.24em] text-[#D5C1A1] transition-colors duration-500 hover:border-[#C5B39B]/55 hover:text-[#F7F5F0]"
        >
          Télécharger le PDF
        </a>
        <a
          href={pdfPreviewUrl}
          target="_blank"
          rel="noreferrer"
          className="rounded-full border border-white/12 px-4 py-2 text-[0.62rem] uppercase tracking-[0.24em] text-white/75 transition-colors duration-500 hover:border-white/25 hover:text-white"
        >
          Ouvrir le PDF
        </a>
        <a
          href={`/api/documents/${record.id}/download?format=docx`}
          className="rounded-full border border-[#C5B39B]/35 px-4 py-2 text-[0.62rem] uppercase tracking-[0.24em] text-[#D5C1A1] transition-colors duration-500 hover:border-[#C5B39B]/55 hover:text-[#F7F5F0]"
        >
          Télécharger le DOCX
        </a>
      </div>

      <section className="grid gap-8 lg:grid-cols-[minmax(0,1.4fr)_24rem]">
        <div>
          <p className="text-[0.68rem] uppercase tracking-[0.28em] text-[#C5B39B]">
            {record.reference}
          </p>
          <h1 className="mt-4 font-serif text-4xl text-[#F7F5F0] md:text-5xl">
            {record.title}
          </h1>
          <p className="mt-5 max-w-3xl text-sm leading-7 text-white/68 md:text-base">
            {record.observations}
          </p>
        </div>

        <div className="rounded-[1.75rem] border border-white/10 bg-white/[0.03] p-6 shadow-[0_24px_80px_rgba(0,0,0,0.28)]">
          <p className="text-[0.62rem] uppercase tracking-[0.28em] text-white/35">
            Profil actif
          </p>
          <h2 className="mt-3 text-lg uppercase tracking-[0.18em] text-[#F7F5F0]">
            {roleDetails[session.role].label}
          </h2>
          <p className="mt-3 text-sm leading-6 text-white/62">
            {roleDetails[session.role].summary}
          </p>
          {canManageAccess ? (
            <div className="mt-6 rounded-[1.25rem] border border-[#C5B39B]/20 bg-[#C5B39B]/8 p-4 text-sm leading-6 text-white/70">
              Ce profil voit aussi la matrice de rôles autorisés pour ce
              document et pourra piloter les droits lors de la phase RBAC
              avancée.
            </div>
          ) : null}
        </div>
      </section>

      <section className="grid gap-5 lg:grid-cols-[minmax(0,1.2fr)_0.8fr]">
        <article className="rounded-[1.75rem] border border-white/10 bg-[#161513] p-6 shadow-[0_20px_70px_rgba(0,0,0,0.24)]">
          <h2 className="text-[0.7rem] uppercase tracking-[0.28em] text-white/35">
            Métadonnées documentaires
          </h2>

          <dl className="mt-6 grid gap-5 md:grid-cols-2">
            <div>
              <dt className="text-[0.58rem] uppercase tracking-[0.24em] text-white/35">
                ID RDM
              </dt>
              <dd className="mt-2 text-sm text-white/78">{record.id}</dd>
            </div>
            <div>
              <dt className="text-[0.58rem] uppercase tracking-[0.24em] text-white/35">
                Type
              </dt>
              <dd className="mt-2 text-sm text-white/78">{record.type}</dd>
            </div>
            <div>
              <dt className="text-[0.58rem] uppercase tracking-[0.24em] text-white/35">
                Statut
              </dt>
              <dd className="mt-2 text-sm text-white/78">{record.status}</dd>
            </div>
            <div>
              <dt className="text-[0.58rem] uppercase tracking-[0.24em] text-white/35">
                Version
              </dt>
              <dd className="mt-2 text-sm text-white/78">{record.version}</dd>
            </div>
            <div>
              <dt className="text-[0.58rem] uppercase tracking-[0.24em] text-white/35">
                Entité propriétaire
              </dt>
              <dd className="mt-2 text-sm text-white/78">{record.ownerEntity}</dd>
            </div>
            <div>
              <dt className="text-[0.58rem] uppercase tracking-[0.24em] text-white/35">
                Catégorie documentaire
              </dt>
              <dd className="mt-2 text-sm text-white/78">{record.category}</dd>
            </div>
            <div>
              <dt className="text-[0.58rem] uppercase tracking-[0.24em] text-white/35">
                Date création
              </dt>
              <dd className="mt-2 text-sm text-white/78">{record.createdAt}</dd>
            </div>
            <div>
              <dt className="text-[0.58rem] uppercase tracking-[0.24em] text-white/35">
                Dernière mise à jour
              </dt>
              <dd className="mt-2 text-sm text-white/78">{record.updatedAt}</dd>
            </div>
            <div className="md:col-span-2">
              <dt className="text-[0.58rem] uppercase tracking-[0.24em] text-white/35">
                Source normative
              </dt>
              <dd className="mt-2 text-sm leading-7 text-white/78">
                {record.normativeSources.join(" ; ")}
              </dd>
            </div>
            <div className="md:col-span-2">
              <dt className="text-[0.58rem] uppercase tracking-[0.24em] text-white/35">
                Observations
              </dt>
              <dd className="mt-2 text-sm leading-7 text-white/78">
                {record.observations}
              </dd>
            </div>
          </dl>
        </article>

        <aside className="space-y-5">
          <article className="rounded-[1.75rem] border border-white/10 bg-white/[0.03] p-6 shadow-[0_20px_70px_rgba(0,0,0,0.2)]">
            <h2 className="text-[0.7rem] uppercase tracking-[0.28em] text-white/35">
              Chemins actifs
            </h2>

            <div className="mt-5 space-y-4">
              <div>
                <p className="text-[0.58rem] uppercase tracking-[0.22em] text-white/35">
                  DOCX
                </p>
                <p className="mt-2 break-all text-sm leading-6 text-white/72">
                  {record.docxPath}
                </p>
              </div>

              <div>
                <p className="text-[0.58rem] uppercase tracking-[0.22em] text-white/35">
                  PDF
                </p>
                <p className="mt-2 break-all text-sm leading-6 text-white/72">
                  {record.pdfPath}
                </p>
              </div>
            </div>
          </article>

          <article className="rounded-[1.75rem] border border-white/10 bg-white/[0.03] p-6 shadow-[0_20px_70px_rgba(0,0,0,0.2)]">
            <h2 className="text-[0.7rem] uppercase tracking-[0.28em] text-white/35">
              Gouvernance web
            </h2>
            <div className="mt-5 space-y-4 text-sm leading-7 text-white/70">
              <p>Accès collaborateurs : {record.collaboratorAccess}</p>
              <p>Confidentialité : {record.confidentiality}</p>
              <p>Décision registre liée : {record.registerDecision ?? "Aucune"}</p>
              <p>Remplace : {record.replaces ?? "Aucun"}</p>
              <p>Remplacé par : {record.replacedBy ?? "Aucun"}</p>
              {canManageAccess ? (
                <p>
                  Rôles autorisés : {record.allowedRoles.map((role) => roleDetails[role].label).join(", ")}
                </p>
              ) : null}
            </div>
          </article>
        </aside>
      </section>

      <section className="overflow-hidden rounded-[1.75rem] border border-white/10 bg-[#161513] shadow-[0_20px_70px_rgba(0,0,0,0.24)]">
        <div className="flex items-center justify-between gap-4 border-b border-white/8 px-6 py-5">
          <div>
            <p className="text-[0.62rem] uppercase tracking-[0.28em] text-white/35">
              Aperçu intégré
            </p>
            <h2 className="mt-2 font-serif text-2xl text-[#F7F5F0]">
              Visualisation PDF
            </h2>
          </div>

          <a
            href={pdfPreviewUrl}
            target="_blank"
            rel="noreferrer"
            className="rounded-full border border-[#C5B39B]/35 px-4 py-2 text-[0.62rem] uppercase tracking-[0.24em] text-[#D5C1A1] transition-colors duration-500 hover:border-[#C5B39B]/55 hover:text-[#F7F5F0]"
          >
            Plein écran
          </a>
        </div>

        <div className="p-4 md:p-6">
          <div className="overflow-hidden rounded-[1.25rem] border border-white/8 bg-[#121110]">
            <object
              data={pdfPreviewUrl}
              type="application/pdf"
              className="h-[70vh] w-full"
            >
              <div className="flex min-h-[18rem] flex-col items-center justify-center gap-4 px-6 py-10 text-center">
                <p className="max-w-2xl text-sm leading-7 text-white/62">
                  L’aperçu PDF intégré n’est pas disponible dans ce navigateur ou
                  le fichier n’est pas accessible pour cette session.
                </p>
                <div className="flex flex-wrap justify-center gap-3">
                  <a
                    href={pdfPreviewUrl}
                    target="_blank"
                    rel="noreferrer"
                    className="rounded-full border border-white/12 px-4 py-2 text-[0.62rem] uppercase tracking-[0.24em] text-white/75 transition-colors duration-500 hover:border-white/25 hover:text-white"
                  >
                    Ouvrir le PDF
                  </a>
                  <a
                    href={`/api/documents/${record.id}/download?format=pdf`}
                    className="rounded-full border border-[#C5B39B]/35 px-4 py-2 text-[0.62rem] uppercase tracking-[0.24em] text-[#D5C1A1] transition-colors duration-500 hover:border-[#C5B39B]/55 hover:text-[#F7F5F0]"
                  >
                    Télécharger le PDF
                  </a>
                </div>
              </div>
            </object>
          </div>
        </div>
      </section>
    </main>
  );
}
