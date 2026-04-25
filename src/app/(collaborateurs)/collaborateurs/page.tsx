import Link from "next/link";

import CollaboratorAccessGate from "./_components/CollaboratorAccessGate";
import { getSession } from "@/lib/auth";
import { permissionLabels } from "@/lib/permissions";
import {
  getCollaboratorAccessLabel,
  getConfidentialityLabel,
  getSourceNormativeLabel,
} from "@/lib/rdm-presenters";
import { listPermissionsForRole } from "@/lib/rbac";
import {
  getAccessibleCategories,
  getAccessibleStatuses,
  listRdmRecords,
  type RdmSortKey,
  type SortDirection,
} from "@/lib/rdm-service";

function getFirstValue(value: string | string[] | undefined) {
  return Array.isArray(value) ? value[0] : value;
}

function isSortKey(value: string): value is RdmSortKey {
  return [
    "id",
    "reference",
    "title",
    "status",
    "ownerEntity",
    "category",
    "version",
    "updatedAt",
  ].includes(value);
}

function isSortDirection(value: string): value is SortDirection {
  return value === "asc" || value === "desc";
}

function buildQueryString(
  filters: Record<string, string>,
  overrides: Record<string, string | undefined>,
) {
  const params = new URLSearchParams();

  for (const [key, value] of Object.entries({ ...filters, ...overrides })) {
    if (value && value !== "all") {
      params.set(key, value);
    }
  }

  return params.toString();
}

function getSortArrow(
  activeSort: RdmSortKey,
  activeDirection: SortDirection,
  column: RdmSortKey,
) {
  if (activeSort !== column) {
    return "↕";
  }

  return activeDirection === "asc" ? "↑" : "↓";
}

export default async function CollaboratorsPage({
  searchParams,
}: {
  searchParams: Promise<Record<string, string | string[] | undefined>>;
}) {
  const params = await searchParams;
  const session = await getSession();

  if (!session) {
    return <CollaboratorAccessGate redirectTo="/collaborateurs" />;
  }

  const query = getFirstValue(params.q) ?? "";
  const category = getFirstValue(params.category) ?? "all";
  const status = getFirstValue(params.status) ?? "all";
  const type = getFirstValue(params.type) ?? "all";
  const rawSort = getFirstValue(params.sort) ?? "updatedAt";
  const rawDir = getFirstValue(params.dir) ?? "desc";
  const sort = isSortKey(rawSort) ? rawSort : "updatedAt";
  const dir = isSortDirection(rawDir) ? rawDir : "desc";

  const currentFilters = {
    q: query,
    category,
    status,
    type,
    sort,
    dir,
  };

  const records = listRdmRecords({
    role: session.role,
    query,
    category,
    status: status as "all" | "Validé" | "Document de travail" | "Archivé",
    type: type as "all" | "DOC" | "DIR",
    sortKey: sort,
    sortDirection: dir,
  });
  const categories = getAccessibleCategories(session.role);
  const statuses = getAccessibleStatuses(session.role);
  const downloadableCount = records.filter(
    (record) => record.availableFormats.length > 0,
  ).length;

  const exportCsvHref = `/api/rdm/export?${buildQueryString(currentFilters, {
    format: "csv",
  })}`;
  const exportXlsxHref = `/api/rdm/export?${buildQueryString(currentFilters, {
    format: "xlsx",
  })}`;

  const buildSortHref = (column: RdmSortKey) => {
    const nextDirection =
      sort === column ? (dir === "asc" ? "desc" : "asc") : column === "updatedAt" ? "desc" : "asc";

    return `/collaborateurs?${buildQueryString(currentFilters, {
      sort: column,
      dir: nextDirection,
    })}`;
  };

  return (
    <main className="flex w-full flex-col gap-10 px-6 py-12 lg:px-10 2xl:px-14">
      <section className="grid gap-8 lg:grid-cols-[minmax(0,1.35fr)_24rem]">
        <div>
          <p className="text-[0.68rem] uppercase tracking-[0.28em] text-[#C5B39B]">
            RDM web
          </p>
          <h1 className="mt-4 font-serif text-4xl text-[#F7F5F0] md:text-5xl">
            Accès collaborateurs au registre documentaire central
          </h1>
          <p className="mt-4 max-w-3xl text-sm leading-7 text-white/68 md:text-base">
            Ce portail consomme une couche documentaire en lecture seule,
            filtrée selon le rôle actif. La source de vérité reste dans
            ZONE21_DEV, et ce portail prépare la future expérience
            collaborateurs sans déplacer l&apos;autorité documentaire hors de la
            base active.
          </p>
        </div>

        <div className="rounded-[1.75rem] border border-white/10 bg-white/[0.03] p-6 shadow-[0_24px_80px_rgba(0,0,0,0.28)]">
          <p className="text-[0.62rem] uppercase tracking-[0.28em] text-white/35">
            Session active
          </p>
          <h2 className="mt-3 text-lg uppercase tracking-[0.18em] text-[#F7F5F0]">
            {session.roleLabel}
          </h2>
          <p className="mt-3 text-sm leading-6 text-white/62">
            {session.summary}
          </p>

          <div className="mt-6 flex flex-wrap gap-2">
            {listPermissionsForRole(session.role).map((permission) => (
              <span
                key={permission}
                className="rounded-full border border-white/10 px-3 py-1 text-[0.62rem] uppercase tracking-[0.18em] text-white/62"
              >
                {permissionLabels[permission]}
              </span>
            ))}
          </div>
        </div>
      </section>

      <section className="grid gap-4 md:grid-cols-3">
        <div className="rounded-[1.6rem] border border-white/8 bg-[#171614] p-5">
          <p className="text-[0.62rem] uppercase tracking-[0.24em] text-white/35">
            Documents visibles
          </p>
          <p className="mt-3 font-serif text-4xl text-[#F7F5F0]">
            {records.length}
          </p>
        </div>

        <div className="rounded-[1.6rem] border border-white/8 bg-[#171614] p-5">
          <p className="text-[0.62rem] uppercase tracking-[0.24em] text-white/35">
            Catégories actives
          </p>
          <p className="mt-3 font-serif text-4xl text-[#F7F5F0]">
            {categories.length}
          </p>
        </div>

        <div className="rounded-[1.6rem] border border-white/8 bg-[#171614] p-5">
          <p className="text-[0.62rem] uppercase tracking-[0.24em] text-white/35">
            Téléchargements disponibles
          </p>
          <p className="mt-3 font-serif text-4xl text-[#F7F5F0]">
            {downloadableCount}
          </p>
        </div>
      </section>

      <section className="rounded-[1.75rem] border border-white/10 bg-white/[0.03] p-6 shadow-[0_24px_80px_rgba(0,0,0,0.22)]">
        <form className="grid gap-4 lg:grid-cols-[minmax(0,1.4fr)_0.8fr_0.8fr_0.65fr_auto]">
          <label className="flex flex-col gap-2 text-[0.62rem] uppercase tracking-[0.22em] text-white/42">
            Recherche
            <input
              type="search"
              name="q"
              defaultValue={query}
              placeholder="Référence, titre, entité..."
              className="rounded-full border border-white/10 bg-[#121110] px-4 py-3 text-sm normal-case tracking-normal text-[#F7F5F0] outline-none transition-colors focus:border-[#C5B39B]/55"
            />
          </label>

          <label className="flex flex-col gap-2 text-[0.62rem] uppercase tracking-[0.22em] text-white/42">
            Catégorie
            <select
              name="category"
              defaultValue={category}
              className="rounded-full border border-white/10 bg-[#121110] px-4 py-3 text-sm normal-case tracking-normal text-[#F7F5F0] outline-none transition-colors focus:border-[#C5B39B]/55"
            >
              <option value="all">Toutes</option>
              {categories.map((item) => (
                <option key={item} value={item}>
                  {item}
                </option>
              ))}
            </select>
          </label>

          <label className="flex flex-col gap-2 text-[0.62rem] uppercase tracking-[0.22em] text-white/42">
            Statut
            <select
              name="status"
              defaultValue={status}
              className="rounded-full border border-white/10 bg-[#121110] px-4 py-3 text-sm normal-case tracking-normal text-[#F7F5F0] outline-none transition-colors focus:border-[#C5B39B]/55"
            >
              <option value="all">Tous</option>
              {statuses.map((item) => (
                <option key={item} value={item}>
                  {item}
                </option>
              ))}
            </select>
          </label>

          <label className="flex flex-col gap-2 text-[0.62rem] uppercase tracking-[0.22em] text-white/42">
            Type
            <select
              name="type"
              defaultValue={type}
              className="rounded-full border border-white/10 bg-[#121110] px-4 py-3 text-sm normal-case tracking-normal text-[#F7F5F0] outline-none transition-colors focus:border-[#C5B39B]/55"
            >
              <option value="all">Tous</option>
              <option value="DOC">DOC</option>
              <option value="DIR">DIR</option>
            </select>
          </label>

          <div className="flex items-end gap-3">
            <button
              type="submit"
              className="w-full rounded-full border border-[#C5B39B]/55 bg-[#C5B39B]/12 px-5 py-3 text-[0.64rem] uppercase tracking-[0.24em] text-[#F7F5F0] transition-colors duration-500 hover:bg-[#C5B39B]/20"
            >
              Filtrer
            </button>
          </div>
        </form>

        <div className="mt-5 flex flex-wrap gap-3">
          <a
            href={exportCsvHref}
            className="rounded-full border border-[#C5B39B]/35 px-4 py-2 text-[0.62rem] uppercase tracking-[0.24em] text-[#D5C1A1] transition-colors duration-500 hover:border-[#C5B39B]/55 hover:text-[#F7F5F0]"
          >
            Export CSV
          </a>
          <a
            href={exportXlsxHref}
            className="rounded-full border border-[#C5B39B]/35 px-4 py-2 text-[0.62rem] uppercase tracking-[0.24em] text-[#D5C1A1] transition-colors duration-500 hover:border-[#C5B39B]/55 hover:text-[#F7F5F0]"
          >
            Export XLSX
          </a>
        </div>
      </section>

      <section className="overflow-hidden rounded-[1.75rem] border border-white/10 bg-[#161513] shadow-[0_20px_70px_rgba(0,0,0,0.24)]">
        <div className="flex items-center justify-between gap-4 border-b border-white/8 px-6 py-5">
          <div>
            <p className="text-[0.62rem] uppercase tracking-[0.28em] text-white/35">
              Tableau RDM
            </p>
            <h2 className="mt-2 font-serif text-2xl text-[#F7F5F0]">
              Registre documentaire consultable
            </h2>
          </div>

          <p className="text-[0.62rem] uppercase tracking-[0.24em] text-white/35">
            tri {getSortArrow(sort, dir, sort)} sur {sort}
          </p>
        </div>

        {records.length === 0 ? (
          <div className="px-6 py-10 text-sm leading-7 text-white/62">
            Aucun document ne correspond aux filtres actifs.
          </div>
        ) : null}

        {records.length > 0 ? (
          <>
            <div className="hidden overflow-x-auto xl:block">
              <table className="min-w-full w-max table-auto border-collapse">
                <thead>
                  <tr className="border-b border-white/8 bg-white/[0.02] text-left">
                    {[
                      ["ID RDM", "id"],
                      ["Référence document", "reference"],
                      ["Titre document", "title"],
                      ["Statut", "status"],
                      ["Version", "version"],
                      ["Entité propriétaire", "ownerEntity"],
                      ["Catégorie", "category"],
                      ["Mise à jour", "updatedAt"],
                    ].map(([label, column]) => (
                      <th
                        key={label}
                        className="whitespace-nowrap px-6 py-4 text-[0.58rem] uppercase tracking-[0.24em] text-white/35"
                      >
                        <Link
                          href={buildSortHref(column as RdmSortKey)}
                          className="inline-flex items-center gap-2 transition-colors duration-500 hover:text-[#F7F5F0]"
                        >
                          <span>{label}</span>
                          <span>{getSortArrow(sort, dir, column as RdmSortKey)}</span>
                        </Link>
                      </th>
                    ))}
                    <th className="whitespace-nowrap px-6 py-4 text-[0.58rem] uppercase tracking-[0.24em] text-white/35">
                      Type
                    </th>
                    <th className="whitespace-nowrap px-6 py-4 text-[0.58rem] uppercase tracking-[0.24em] text-white/35">
                      Emplacement DOCX
                    </th>
                    <th className="whitespace-nowrap px-6 py-4 text-[0.58rem] uppercase tracking-[0.24em] text-white/35">
                      Emplacement PDF
                    </th>
                    <th className="whitespace-nowrap px-6 py-4 text-[0.58rem] uppercase tracking-[0.24em] text-white/35">
                      Date création
                    </th>
                    <th className="whitespace-nowrap px-6 py-4 text-[0.58rem] uppercase tracking-[0.24em] text-white/35">
                      Source normative
                    </th>
                    <th className="whitespace-nowrap px-6 py-4 text-[0.58rem] uppercase tracking-[0.24em] text-white/35">
                      Accès collaborateurs
                    </th>
                    <th className="whitespace-nowrap px-6 py-4 text-[0.58rem] uppercase tracking-[0.24em] text-white/35">
                      Confidentialité
                    </th>
                    <th className="whitespace-nowrap px-6 py-4 text-[0.58rem] uppercase tracking-[0.24em] text-white/35">
                      Remplace
                    </th>
                    <th className="whitespace-nowrap px-6 py-4 text-[0.58rem] uppercase tracking-[0.24em] text-white/35">
                      Remplacé par
                    </th>
                    <th className="whitespace-nowrap px-6 py-4 text-[0.58rem] uppercase tracking-[0.24em] text-white/35">
                      Décision registre
                    </th>
                    <th className="whitespace-nowrap px-6 py-4 text-[0.58rem] uppercase tracking-[0.24em] text-white/35">
                      Observations
                    </th>
                    <th className="whitespace-nowrap px-6 py-4 text-[0.58rem] uppercase tracking-[0.24em] text-white/35">
                      Accès
                    </th>
                  </tr>
                </thead>

                <tbody>
                  {records.map((record) => (
                    <tr
                      key={record.id}
                      className="border-b border-white/6 align-top transition-colors duration-500 hover:bg-white/[0.02]"
                    >
                      <td className="whitespace-nowrap px-6 py-5 text-sm text-white/78">
                        {record.id}
                      </td>
                      <td className="whitespace-nowrap px-6 py-5 text-sm text-white/78">
                        {record.reference}
                      </td>
                      <td className="px-6 py-5">
                        <div className="min-w-[20rem] max-w-[30rem]">
                          <p className="font-serif text-lg text-[#F7F5F0]">
                            {record.title}
                          </p>
                        </div>
                      </td>
                      <td className="px-6 py-5">
                        <span className="rounded-full border border-[#C5B39B]/20 px-3 py-1 text-[0.62rem] uppercase tracking-[0.22em] text-[#D5C1A1]">
                          {record.status}
                        </span>
                      </td>
                      <td className="whitespace-nowrap px-6 py-5 text-sm text-white/78">
                        {record.version}
                      </td>
                      <td className="px-6 py-5 text-sm text-white/78">
                        {record.ownerEntity}
                      </td>
                      <td className="px-6 py-5 text-sm text-white/78">
                        {record.category}
                      </td>
                      <td className="px-6 py-5 text-sm text-white/78">
                        {record.updatedAt}
                      </td>
                      <td className="px-6 py-5 text-sm text-white/78">{record.type}</td>
                      <td className="px-6 py-5 text-sm text-white/68">
                        <div className="min-w-[24rem] max-w-[34rem] break-all leading-6">
                          {record.docxPath}
                        </div>
                      </td>
                      <td className="px-6 py-5 text-sm text-white/68">
                        <div className="min-w-[24rem] max-w-[34rem] break-all leading-6">
                          {record.pdfPath}
                        </div>
                      </td>
                      <td className="whitespace-nowrap px-6 py-5 text-sm text-white/78">
                        {record.createdAt}
                      </td>
                      <td className="whitespace-nowrap px-6 py-5 text-sm text-white/78">
                        {getSourceNormativeLabel(record)}
                      </td>
                      <td
                        className="whitespace-nowrap px-6 py-5 text-sm text-white/78"
                        title={record.collaboratorAccess}
                      >
                        {getCollaboratorAccessLabel(record)}
                      </td>
                      <td className="whitespace-nowrap px-6 py-5 text-sm text-white/78">
                        {getConfidentialityLabel(record)}
                      </td>
                      <td className="whitespace-nowrap px-6 py-5 text-sm text-white/78">
                        {record.replaces ?? "Aucun"}
                      </td>
                      <td className="whitespace-nowrap px-6 py-5 text-sm text-white/78">
                        {record.replacedBy ?? "Aucun"}
                      </td>
                      <td className="whitespace-nowrap px-6 py-5 text-sm text-white/78">
                        {record.registerDecision ?? "Aucune"}
                      </td>
                      <td className="px-6 py-5 text-sm text-white/68">
                        <div className="min-w-[18rem] max-w-[28rem] leading-6">
                          {record.observations}
                        </div>
                      </td>
                      <td className="px-6 py-5">
                        <div className="flex flex-wrap gap-2">
                          <Link
                            href={`/collaborateurs/documents/${record.id}`}
                            className="rounded-full border border-white/12 px-4 py-2 text-[0.6rem] uppercase tracking-[0.22em] text-white/75 transition-colors duration-500 hover:border-white/25 hover:text-white"
                          >
                            Fiche
                          </Link>
                          <a
                            href={`/api/documents/${record.id}/download?format=pdf`}
                            className="rounded-full border border-[#C5B39B]/35 px-4 py-2 text-[0.6rem] uppercase tracking-[0.22em] text-[#D5C1A1] transition-colors duration-500 hover:border-[#C5B39B]/55 hover:text-[#F7F5F0]"
                          >
                            PDF
                          </a>
                          <a
                            href={`/api/documents/${record.id}/download?format=docx`}
                            className="rounded-full border border-[#C5B39B]/35 px-4 py-2 text-[0.6rem] uppercase tracking-[0.22em] text-[#D5C1A1] transition-colors duration-500 hover:border-[#C5B39B]/55 hover:text-[#F7F5F0]"
                          >
                            DOCX
                          </a>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            <div className="grid gap-4 p-4 xl:hidden">
              {records.map((record) => (
                <article
                  key={record.id}
                  className="rounded-[1.5rem] border border-white/8 bg-white/[0.02] p-5"
                >
                  <div className="flex flex-wrap items-center gap-3">
                    <span className="rounded-full border border-white/10 px-3 py-1 text-[0.62rem] uppercase tracking-[0.22em] text-white/48">
                      {record.id}
                    </span>
                    <span className="rounded-full border border-[#C5B39B]/20 px-3 py-1 text-[0.62rem] uppercase tracking-[0.22em] text-[#D5C1A1]">
                      {record.status}
                    </span>
                    <span className="rounded-full border border-white/10 px-3 py-1 text-[0.62rem] uppercase tracking-[0.22em] text-white/48">
                      {record.type}
                    </span>
                  </div>

                  <p className="mt-4 text-[0.62rem] uppercase tracking-[0.24em] text-white/35">
                    {record.reference}
                  </p>
                  <h3 className="mt-3 font-serif text-xl text-[#F7F5F0]">
                    {record.title}
                  </h3>

                  <dl className="mt-5 grid gap-4 sm:grid-cols-2">
                    <div>
                      <dt className="text-[0.58rem] uppercase tracking-[0.24em] text-white/35">
                        Entité
                      </dt>
                      <dd className="mt-2 text-sm text-white/78">
                        {record.ownerEntity}
                      </dd>
                    </div>
                    <div>
                      <dt className="text-[0.58rem] uppercase tracking-[0.24em] text-white/35">
                        Catégorie
                      </dt>
                      <dd className="mt-2 text-sm text-white/78">
                        {record.category}
                      </dd>
                    </div>
                    <div>
                      <dt className="text-[0.58rem] uppercase tracking-[0.24em] text-white/35">
                        Version
                      </dt>
                      <dd className="mt-2 text-sm text-white/78">
                        {record.version}
                      </dd>
                    </div>
                    <div>
                      <dt className="text-[0.58rem] uppercase tracking-[0.24em] text-white/35">
                        Date création
                      </dt>
                      <dd className="mt-2 text-sm text-white/78">
                        {record.createdAt}
                      </dd>
                    </div>
                    <div>
                      <dt className="text-[0.58rem] uppercase tracking-[0.24em] text-white/35">
                        Mise à jour
                      </dt>
                      <dd className="mt-2 text-sm text-white/78">
                        {record.updatedAt}
                      </dd>
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
                        Accès collaborateurs
                      </dt>
                      <dd className="mt-2 text-sm text-white/78">
                        {getCollaboratorAccessLabel(record)}
                      </dd>
                    </div>
                    <div>
                      <dt className="text-[0.58rem] uppercase tracking-[0.24em] text-white/35">
                        Confidentialité
                      </dt>
                      <dd className="mt-2 text-sm text-white/78">
                        {getConfidentialityLabel(record)}
                      </dd>
                    </div>
                    <div>
                      <dt className="text-[0.58rem] uppercase tracking-[0.24em] text-white/35">
                        Remplace
                      </dt>
                      <dd className="mt-2 text-sm text-white/78">
                        {record.replaces ?? "Aucun"}
                      </dd>
                    </div>
                    <div>
                      <dt className="text-[0.58rem] uppercase tracking-[0.24em] text-white/35">
                        Remplacé par
                      </dt>
                      <dd className="mt-2 text-sm text-white/78">
                        {record.replacedBy ?? "Aucun"}
                      </dd>
                    </div>
                    <div>
                      <dt className="text-[0.58rem] uppercase tracking-[0.24em] text-white/35">
                        Décision registre
                      </dt>
                      <dd className="mt-2 text-sm text-white/78">
                        {record.registerDecision ?? "Aucune"}
                      </dd>
                    </div>
                    <div className="sm:col-span-2">
                      <dt className="text-[0.58rem] uppercase tracking-[0.24em] text-white/35">
                        Emplacement DOCX
                      </dt>
                      <dd className="mt-2 break-all text-sm text-white/72">
                        {record.docxPath}
                      </dd>
                    </div>
                    <div className="sm:col-span-2">
                      <dt className="text-[0.58rem] uppercase tracking-[0.24em] text-white/35">
                        Emplacement PDF
                      </dt>
                      <dd className="mt-2 break-all text-sm text-white/72">
                        {record.pdfPath}
                      </dd>
                    </div>
                  </dl>

                  <p className="mt-5 text-sm leading-7 text-white/60">
                    {record.observations}
                  </p>

                  <div className="mt-6 flex flex-wrap gap-3">
                    <Link
                      href={`/collaborateurs/documents/${record.id}`}
                      className="rounded-full border border-white/12 px-4 py-2 text-[0.62rem] uppercase tracking-[0.24em] text-white/75 transition-colors duration-500 hover:border-white/25 hover:text-white"
                    >
                      Ouvrir la fiche
                    </Link>
                    <a
                      href={`/api/documents/${record.id}/download?format=pdf`}
                      className="rounded-full border border-[#C5B39B]/35 px-4 py-2 text-[0.62rem] uppercase tracking-[0.24em] text-[#D5C1A1] transition-colors duration-500 hover:border-[#C5B39B]/55 hover:text-[#F7F5F0]"
                    >
                      PDF
                    </a>
                    <a
                      href={`/api/documents/${record.id}/download?format=docx`}
                      className="rounded-full border border-[#C5B39B]/35 px-4 py-2 text-[0.62rem] uppercase tracking-[0.24em] text-[#D5C1A1] transition-colors duration-500 hover:border-[#C5B39B]/55 hover:text-[#F7F5F0]"
                    >
                      DOCX
                    </a>
                  </div>
                </article>
              ))}
            </div>
          </>
        ) : null}
      </section>
    </main>
  );
}
