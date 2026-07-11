import Link from "next/link";
import { notFound } from "next/navigation";

import CollaboratorAccessGate from "../../_components/CollaboratorAccessGate";
import { getSession } from "@/lib/auth";
import { roleDetails } from "@/lib/permissions";
import {
  getCollaboratorAccessLabel,
  getConfidentialityLabel,
  getFileAvailabilityLabel,
  getGovernanceSyncClasses,
  getGovernanceSyncLabel,
  getSourceNormativeLabel,
} from "@/lib/rdm-presenters";
import { hasPermission } from "@/lib/rbac";
import {
  getActiveBaseState,
  getRdmRecordById,
  serializeRegistry,
} from "@/lib/rdm-service";

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

  const activeBaseState = getActiveBaseState();
  const canManageAccess = hasPermission(session.role, "manage_access");
  const canEditRecord = hasPermission(session.role, "edit");
  const registry = serializeRegistry();
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
          className="rounded-full border border-accent/35 px-4 py-2 text-[0.62rem] uppercase tracking-[0.24em] text-accent-soft transition-colors duration-500 hover:border-accent/55 hover:text-paper"
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
          className="rounded-full border border-accent/35 px-4 py-2 text-[0.62rem] uppercase tracking-[0.24em] text-accent-soft transition-colors duration-500 hover:border-accent/55 hover:text-paper"
        >
          Télécharger le DOCX
        </a>
      </div>

      <section className="grid gap-8 lg:grid-cols-[minmax(0,1.4fr)_24rem]">
        <div>
          <p className="text-[0.68rem] uppercase tracking-[0.28em] text-accent">
            {record.reference}
          </p>
          <h1 className="mt-4 font-serif text-4xl text-paper md:text-5xl">
            {record.title}
          </h1>
          <p className="mt-5 max-w-4xl text-sm leading-7 text-white/68 md:text-base">
            Cette fiche reflète le registre officiel stocké dans ZONE 21
            HOLDING. Les modifications passent par le site puis sont écrites et
            relues dans Drive.
          </p>

          <div className="mt-6 flex flex-wrap gap-3">
            <span className="rounded-full border border-white/10 px-4 py-2 text-[0.62rem] uppercase tracking-[0.22em] text-white/72">
              Source de vérité : {record.sourceOfTruth}
            </span>
            <span className="rounded-full border border-white/10 px-4 py-2 text-[0.62rem] uppercase tracking-[0.22em] text-white/72">
              Mode : {activeBaseState.mode}
            </span>
            <span
              className={`rounded-full border px-4 py-2 text-[0.62rem] uppercase tracking-[0.22em] ${getGovernanceSyncClasses(
                record.governanceSyncStatus,
              )}`}
            >
              Synchronisation gouvernance :{" "}
              {getGovernanceSyncLabel(record)}
            </span>
          </div>
        </div>

        <div className="rounded-[1.75rem] border border-white/10 bg-white/3 p-6 shadow-[0_24px_80px_rgba(0,0,0,0.28)]">
          <p className="text-[0.62rem] uppercase tracking-[0.28em] text-white/35">
            Profil actif
          </p>
          <h2 className="mt-3 text-lg uppercase tracking-[0.18em] text-paper">
            {roleDetails[session.role].label}
          </h2>
          <p className="mt-3 text-sm leading-6 text-white/62">
            {roleDetails[session.role].summary}
          </p>
          {canManageAccess ? (
            <div className="mt-6 rounded-[1.25rem] border border-accent/20 bg-accent/8 p-4 text-sm leading-6 text-white/70">
              Ce profil voit aussi la matrice de rôles autorisés pour ce
              document et pourra piloter les droits lors de la phase RBAC
              avancée.
            </div>
          ) : null}
        </div>
      </section>

      {activeBaseState.error ? (
        <section className="rounded-[1.5rem] border border-amber-500/25 bg-amber-500/10 p-5 text-sm leading-7 text-amber-100">
          <p className="text-[0.62rem] uppercase tracking-[0.24em] text-amber-200/80">
            Base active à vérifier
          </p>
          <p className="mt-3">{activeBaseState.error}</p>
        </section>
      ) : null}

      <section className="grid gap-5 lg:grid-cols-[minmax(0,1.2fr)_0.8fr]">
        <article className="rounded-[1.75rem] border border-white/10 bg-panel p-6 shadow-[0_20px_70px_rgba(0,0,0,0.24)]">
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
            <div>
              <dt className="text-[0.58rem] uppercase tracking-[0.24em] text-white/35">
                Source normative
              </dt>
              <dd className="mt-2 text-sm text-white/78">
                {getSourceNormativeLabel(record)}
              </dd>
            </div>
            <div>
              <dt className="text-[0.58rem] uppercase tracking-[0.24em] text-white/35">
                Disponibilité fichiers
              </dt>
              <dd className="mt-2 text-sm text-white/78">
                {getFileAvailabilityLabel(record.fileAvailability)}
              </dd>
            </div>
            <div className="md:col-span-2">
              <dt className="text-[0.58rem] uppercase tracking-[0.24em] text-white/35">
                Source normative de référence
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
          <article className="rounded-[1.75rem] border border-white/10 bg-white/3 p-6 shadow-[0_20px_70px_rgba(0,0,0,0.2)]">
            <h2 className="text-[0.7rem] uppercase tracking-[0.28em] text-white/35">
              Référence système
            </h2>

            <div className="mt-5 space-y-4 text-sm leading-7 text-white/70">
              <p>Source de vérité : {record.sourceOfTruth}</p>
              <p>Mode : lecture seule</p>
              <p>
                Synchronisation gouvernance : {record.governanceSyncStatus}
              </p>
              <p>
                Accès collaborateurs : {getCollaboratorAccessLabel(record)}
              </p>
              <p>Confidentialité : {getConfidentialityLabel(record)}</p>
            </div>
          </article>

          <article className="rounded-[1.75rem] border border-white/10 bg-white/3 p-6 shadow-[0_20px_70px_rgba(0,0,0,0.2)]">
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

          <article className="rounded-[1.75rem] border border-white/10 bg-white/3 p-6 shadow-[0_20px_70px_rgba(0,0,0,0.2)]">
            <h2 className="text-[0.7rem] uppercase tracking-[0.28em] text-white/35">
              Gouvernance web
            </h2>
            <div className="mt-5 space-y-4 text-sm leading-7 text-white/70">
              <p>Décision registre liée : {record.registerDecision ?? "Aucune"}</p>
              <p>
                Code anomalie gouvernance :{" "}
                {record.governanceIssueCode ?? "Aucun"}
              </p>
              <p>Remplace : {record.replaces ?? "Aucun"}</p>
              <p>Remplacé par : {record.replacedBy ?? "Aucun"}</p>
              {canManageAccess ? (
                <p>
                  Rôles autorisés :{" "}
                  {record.allowedRoles
                    .map((role) => roleDetails[role].label)
                    .join(", ")}
                </p>
              ) : null}
            </div>
          </article>
        </aside>
      </section>

      {canEditRecord ? (
        <section className="rounded-[1.75rem] border border-white/10 bg-panel p-6 shadow-[0_20px_70px_rgba(0,0,0,0.24)]">
          <div className="flex flex-wrap items-start justify-between gap-4">
            <div>
              <p className="text-[0.62rem] uppercase tracking-[0.28em] text-white/35">
                Modification Drive
              </p>
              <h2 className="mt-2 font-serif text-2xl text-paper">
                Mettre à jour cette entrée
              </h2>
            </div>
            <span className="rounded-full border border-white/10 px-3 py-1 text-[0.62rem] uppercase tracking-[0.18em] text-white/62">
              révision {registry.revision}
            </span>
          </div>

          <form
            action={`/api/rdm/${record.id}`}
            method="post"
            encType="multipart/form-data"
            className="mt-6 grid gap-4 lg:grid-cols-2"
          >
            <input
              type="hidden"
              name="expectedRegistryRevision"
              value={registry.revision}
            />
            <label className="flex flex-col gap-2 text-[0.62rem] uppercase tracking-[0.22em] text-white/42">
              Référence
              <input
                required
                name="reference"
                defaultValue={record.reference}
                className="rounded-full border border-white/10 bg-bg px-4 py-3 text-sm normal-case tracking-normal text-paper outline-none transition-colors focus:border-accent/55"
              />
            </label>
            <label className="flex flex-col gap-2 text-[0.62rem] uppercase tracking-[0.22em] text-white/42">
              Titre
              <input
                required
                name="title"
                defaultValue={record.title}
                className="rounded-full border border-white/10 bg-bg px-4 py-3 text-sm normal-case tracking-normal text-paper outline-none transition-colors focus:border-accent/55"
              />
            </label>
            <label className="flex flex-col gap-2 text-[0.62rem] uppercase tracking-[0.22em] text-white/42">
              Nature
              <input
                required
                name="type"
                defaultValue={record.type}
                className="rounded-full border border-white/10 bg-bg px-4 py-3 text-sm normal-case tracking-normal text-paper outline-none transition-colors focus:border-accent/55"
              />
            </label>
            <label className="flex flex-col gap-2 text-[0.62rem] uppercase tracking-[0.22em] text-white/42">
              Statut
              <select
                name="status"
                defaultValue={record.status}
                className="rounded-full border border-white/10 bg-bg px-4 py-3 text-sm normal-case tracking-normal text-paper outline-none transition-colors focus:border-accent/55"
              >
                {["A_CREER", "BROUILLON", "VALIDE", "PUBLIE", "ARCHIVE", "A_VERIFIER", "BLOQUE"].map((item) => (
                  <option key={item} value={item}>
                    {item}
                  </option>
                ))}
              </select>
            </label>
            <label className="flex flex-col gap-2 text-[0.62rem] uppercase tracking-[0.22em] text-white/42">
              Version
              <input
                name="version"
                defaultValue={record.version}
                className="rounded-full border border-white/10 bg-bg px-4 py-3 text-sm normal-case tracking-normal text-paper outline-none transition-colors focus:border-accent/55"
              />
            </label>
            <label className="flex flex-col gap-2 text-[0.62rem] uppercase tracking-[0.22em] text-white/42">
              Entité
              <input
                required
                name="ownerEntity"
                defaultValue={record.ownerEntity}
                className="rounded-full border border-white/10 bg-bg px-4 py-3 text-sm normal-case tracking-normal text-paper outline-none transition-colors focus:border-accent/55"
              />
            </label>
            <label className="flex flex-col gap-2 text-[0.62rem] uppercase tracking-[0.22em] text-white/42">
              Chemin DOCX
              <input
                name="docxPath"
                defaultValue={record.docxPath}
                className="rounded-full border border-white/10 bg-bg px-4 py-3 text-sm normal-case tracking-normal text-paper outline-none transition-colors focus:border-accent/55"
              />
            </label>
            <label className="flex flex-col gap-2 text-[0.62rem] uppercase tracking-[0.22em] text-white/42">
              Chemin PDF
              <input
                name="pdfPath"
                defaultValue={record.pdfPath}
                className="rounded-full border border-white/10 bg-bg px-4 py-3 text-sm normal-case tracking-normal text-paper outline-none transition-colors focus:border-accent/55"
              />
            </label>
            <label className="flex flex-col gap-2 text-[0.62rem] uppercase tracking-[0.22em] text-white/42 lg:col-span-2">
              Notes
              <textarea
                name="observations"
                rows={3}
                defaultValue={record.observations}
                className="rounded-[1.25rem] border border-white/10 bg-bg px-4 py-3 text-sm normal-case tracking-normal text-paper outline-none transition-colors focus:border-accent/55"
              />
            </label>
            <label className="flex flex-col gap-2 text-[0.62rem] uppercase tracking-[0.22em] text-white/42">
              Ajouter DOCX
              <input
                type="file"
                name="docxFile"
                accept=".docx"
                className="rounded-full border border-white/10 bg-bg px-4 py-3 text-sm normal-case tracking-normal text-paper outline-none"
              />
            </label>
            <label className="flex flex-col gap-2 text-[0.62rem] uppercase tracking-[0.22em] text-white/42">
              Ajouter PDF
              <input
                type="file"
                name="pdfFile"
                accept="application/pdf,.pdf"
                className="rounded-full border border-white/10 bg-bg px-4 py-3 text-sm normal-case tracking-normal text-paper outline-none"
              />
            </label>
            <div className="lg:col-span-2">
              <button
                type="submit"
                className="rounded-full border border-accent/55 bg-accent/12 px-5 py-3 text-[0.64rem] uppercase tracking-[0.24em] text-paper transition-colors duration-500 hover:bg-accent/20"
              >
                Enregistrer dans Drive
              </button>
            </div>
          </form>
        </section>
      ) : null}

      <section className="overflow-hidden rounded-[1.75rem] border border-white/10 bg-panel shadow-[0_20px_70px_rgba(0,0,0,0.24)]">
        <div className="flex items-center justify-between gap-4 border-b border-white/8 px-6 py-5">
          <div>
            <p className="text-[0.62rem] uppercase tracking-[0.28em] text-white/35">
              Aperçu intégré
            </p>
            <h2 className="mt-2 font-serif text-2xl text-paper">
              Visualisation PDF
            </h2>
          </div>

          <a
            href={pdfPreviewUrl}
            target="_blank"
            rel="noreferrer"
            className="rounded-full border border-accent/35 px-4 py-2 text-[0.62rem] uppercase tracking-[0.24em] text-accent-soft transition-colors duration-500 hover:border-accent/55 hover:text-paper"
          >
            Plein écran
          </a>
        </div>

        <div className="p-4 md:p-6">
          <div className="overflow-hidden rounded-[1.25rem] border border-white/8 bg-bg">
            <object
              data={pdfPreviewUrl}
              type="application/pdf"
              className="h-[70vh] w-full"
            >
              <div className="flex min-h-[18rem] flex-col items-center justify-center gap-4 px-6 py-10 text-center">
                <p className="max-w-2xl text-sm leading-7 text-white/62">
                  L&apos;aperçu PDF intégré n&apos;est pas disponible dans ce navigateur
                  ou le fichier n&apos;est pas accessible pour cette session.
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
                    className="rounded-full border border-accent/35 px-4 py-2 text-[0.62rem] uppercase tracking-[0.24em] text-accent-soft transition-colors duration-500 hover:border-accent/55 hover:text-paper"
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
