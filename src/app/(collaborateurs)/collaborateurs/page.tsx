import Link from "next/link";

import CollaboratorAccessGate from "./_components/CollaboratorAccessGate";
import { getSession } from "@/lib/auth";
import { permissionLabels } from "@/lib/permissions";
import {
  getCollaboratorAccessLabel,
  getConfidentialityLabel,
  getFileAvailabilityLabel,
  getGovernanceSyncClasses,
  getSourceNormativeLabel,
} from "@/lib/rdm-presenters";
import { listPermissionsForRole } from "@/lib/rbac";
import {
  getAccessibleCategories,
  getAccessibleStatuses,
  getAccessibleTypes,
  getActiveBaseState,
  getGovernanceOverview,
  listRdmRecords,
  type RdmSortKey,
  type RdmStatusFilter,
  type RdmTypeFilter,
  type SortDirection,
} from "@/lib/rdm-service";

const sortableColumns: Array<{ label: string; column: RdmSortKey }> = [
  { label: "ID RDM", column: "id" },
  { label: "Référence document", column: "reference" },
  { label: "Titre document", column: "title" },
  { label: "Statut", column: "status" },
  { label: "Version", column: "version" },
  { label: "Entité propriétaire", column: "ownerEntity" },
  { label: "Catégorie documentaire", column: "category" },
  { label: "Date dernière mise à jour", column: "updatedAt" },
];

const desktopHeaderClass =
  "whitespace-nowrap px-6 py-4 text-[0.58rem] uppercase tracking-[0.24em] text-white/35";
const desktopCellClass = "px-6 py-5 text-sm text-white/78 align-top";

function getFirstValue(value: string | string[] | undefined) {
  return Array.isArray(value) ? value[0] : value;
}

function isSortKey(value: string): value is RdmSortKey {
  return sortableColumns.some((item) => item.column === value);
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

function renderSortableHeader(
  label: string,
  column: RdmSortKey,
  sort: RdmSortKey,
  dir: SortDirection,
  href: string,
) {
  return (
    <th className={desktopHeaderClass}>
      <Link
        href={href}
        className="inline-flex items-center gap-2 transition-colors duration-500 hover:text-[#F7F5F0]"
      >
        <span>{label}</span>
        <span>{getSortArrow(sort, dir, column)}</span>
      </Link>
    </th>
  );
}

function getTypeBadgeClass(type: string) {
  switch (type) {
    case "DIR":
      return "border-sky-500/25 bg-sky-500/10 text-sky-200";
    case "REF":
      return "border-emerald-500/25 bg-emerald-500/10 text-emerald-200";
    case "RDM":
      return "border-fuchsia-500/25 bg-fuchsia-500/10 text-fuchsia-200";
    case "PROC":
      return "border-orange-500/25 bg-orange-500/10 text-orange-200";
    case "NOTE":
      return "border-white/15 bg-white/[0.06] text-white/72";
    default:
      return "border-[#C5B39B]/25 bg-[#C5B39B]/10 text-[#E7D8BE]";
  }
}

function getStatusBadgeClass(status: string) {
  switch (status) {
    case "Validé":
      return "border-emerald-500/25 bg-emerald-500/10 text-emerald-200";
    case "Archivé":
      return "border-white/15 bg-white/[0.06] text-white/68";
    default:
      return "border-amber-500/25 bg-amber-500/10 text-amber-200";
  }
}

function getBinaryBadgeClass(value: string) {
  switch (value) {
    case "Oui":
      return "border-emerald-500/25 bg-emerald-500/10 text-emerald-200";
    case "Non":
      return "border-white/15 bg-white/[0.06] text-white/68";
    default:
      return "border-amber-500/25 bg-amber-500/10 text-amber-200";
  }
}

function getConfidentialityBadgeClass(value: string) {
  switch (value) {
    case "Admin":
      return "border-rose-500/25 bg-rose-500/10 text-rose-200";
    case "Restreint":
      return "border-amber-500/25 bg-amber-500/10 text-amber-200";
    default:
      return "border-sky-500/25 bg-sky-500/10 text-sky-200";
  }
}

function getDecisionBadgeClass(value: string | null) {
  if (!value) {
    return "border-white/15 bg-white/[0.06] text-white/68";
  }

  return "border-[#C5B39B]/25 bg-[#C5B39B]/10 text-[#E7D8BE]";
}

function getGovernanceCountBadgeClass(status: string) {
  switch (status) {
    case "à jour":
      return "border-emerald-500/25 bg-emerald-500/10 text-emerald-200";
    case "à vérifier":
      return "border-amber-500/25 bg-amber-500/10 text-amber-200";
    case "bloqué":
      return "border-rose-500/25 bg-rose-500/10 text-rose-200";
    case "archivé":
      return "border-white/15 bg-white/[0.06] text-white/68";
    default:
      return "border-white/15 bg-white/[0.06] text-white/68";
  }
}

function getGovernanceRowClass(status: string) {
  switch (status) {
    case "à jour":
      return "bg-[linear-gradient(90deg,rgba(16,185,129,0.08)_0,rgba(16,185,129,0.04)_10px,transparent_10px)]";
    case "à vérifier":
      return "bg-[linear-gradient(90deg,rgba(245,158,11,0.08)_0,rgba(245,158,11,0.04)_10px,transparent_10px)]";
    case "bloqué":
      return "bg-[linear-gradient(90deg,rgba(244,63,94,0.08)_0,rgba(244,63,94,0.04)_10px,transparent_10px)]";
    case "archivé":
      return "bg-[linear-gradient(90deg,rgba(255,255,255,0.05)_0,rgba(255,255,255,0.02)_10px,transparent_10px)]";
    default:
      return "";
  }
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
    status: status as RdmStatusFilter,
    type: type as RdmTypeFilter,
    sortKey: sort,
    sortDirection: dir,
  });
  const categories = getAccessibleCategories(session.role);
  const statuses = getAccessibleStatuses(session.role);
  const types = getAccessibleTypes(session.role);
  const downloadableCount = records.filter(
    (record) => record.availableFormats.length > 0,
  ).length;
  const activeBaseState = getActiveBaseState();
  const governanceOverview = getGovernanceOverview(records);

  const exportCsvHref = `/api/rdm/export?${buildQueryString(currentFilters, {
    format: "csv",
  })}`;
  const exportXlsxHref = `/api/rdm/export?${buildQueryString(currentFilters, {
    format: "xlsx",
  })}`;

  const buildSortHref = (column: RdmSortKey) => {
    const nextDirection =
      sort === column
        ? dir === "asc"
          ? "desc"
          : "asc"
        : column === "updatedAt"
          ? "desc"
          : "asc";

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
          <p className="mt-4 max-w-4xl text-sm leading-7 text-white/68 md:text-base">
            Ce portail reste une interface de consultation, filtrage, export et
            téléchargement. Il ne modifie jamais les documents maîtres : la
            source de vérité demeure strictement ZONE21_DEV.
          </p>

          <div className="mt-6 flex flex-wrap gap-3">
            <span className="rounded-full border border-white/10 px-4 py-2 text-[0.62rem] uppercase tracking-[0.22em] text-white/72">
              Source de vérité : {activeBaseState.sourceOfTruth}
            </span>
            <span className="rounded-full border border-white/10 px-4 py-2 text-[0.62rem] uppercase tracking-[0.22em] text-white/72">
              Mode : {activeBaseState.mode}
            </span>
            <span
              className={`rounded-full border px-4 py-2 text-[0.62rem] uppercase tracking-[0.22em] ${getGovernanceSyncClasses(
                governanceOverview.overallStatus,
              )}`}
            >
              Synchronisation gouvernance :{" "}
              {governanceOverview.overallStatus}
            </span>
          </div>
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

      {activeBaseState.error ? (
        <section className="rounded-[1.5rem] border border-amber-500/25 bg-amber-500/10 p-5 text-sm leading-7 text-amber-100">
          <p className="text-[0.62rem] uppercase tracking-[0.24em] text-amber-200/80">
            Base active à vérifier
          </p>
          <p className="mt-3">{activeBaseState.error}</p>
          <p className="mt-3 text-amber-100/80">
            Les métadonnées RDM restent consultables, mais les vérifications de
            présence et certains téléchargements peuvent être indisponibles tant
            que `Z21_ACTIVE_BASE_PATH` n&apos;est pas correctement configurée.
          </p>
        </section>
      ) : null}

      <section className="grid gap-4 md:grid-cols-4">
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

        <div className="rounded-[1.6rem] border border-white/8 bg-[#171614] p-5">
          <p className="text-[0.62rem] uppercase tracking-[0.24em] text-white/35">
            Gouvernance
          </p>
          <div className="mt-3 flex items-center gap-3">
            <span
              className={`rounded-full border px-3 py-1 text-[0.62rem] uppercase tracking-[0.22em] ${getGovernanceSyncClasses(
                governanceOverview.overallStatus,
              )}`}
            >
              {governanceOverview.overallStatus}
            </span>
          </div>
          <div className="mt-4 flex flex-wrap gap-2 text-[0.62rem] uppercase tracking-[0.18em]">
            <span
              className={`rounded-full border px-3 py-1 ${getGovernanceCountBadgeClass(
                "à jour",
              )}`}
            >
              {governanceOverview.counts["à jour"]} à jour
            </span>
            <span
              className={`rounded-full border px-3 py-1 ${getGovernanceCountBadgeClass(
                "à vérifier",
              )}`}
            >
              {governanceOverview.counts["à vérifier"]} à vérifier
            </span>
            <span
              className={`rounded-full border px-3 py-1 ${getGovernanceCountBadgeClass(
                "bloqué",
              )}`}
            >
              {governanceOverview.counts["bloqué"]} bloqués
            </span>
            <span
              className={`rounded-full border px-3 py-1 ${getGovernanceCountBadgeClass(
                "archivé",
              )}`}
            >
              {governanceOverview.counts["archivé"]} archivés
            </span>
          </div>
        </div>
      </section>

      <section className="rounded-[1.75rem] border border-white/10 bg-white/[0.03] p-6 shadow-[0_24px_80px_rgba(0,0,0,0.22)]">
        <form className="grid gap-4 lg:grid-cols-[minmax(0,1.4fr)_0.8fr_0.8fr_0.7fr_auto]">
          <label className="flex flex-col gap-2 text-[0.62rem] uppercase tracking-[0.22em] text-white/42">
            Recherche
            <input
              type="search"
              name="q"
              defaultValue={query}
              placeholder="Référence, titre, entité, gouvernance..."
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
              {types.map((item) => (
                <option key={item} value={item}>
                  {item}
                </option>
              ))}
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
            <div className="hidden overflow-x-auto md:block">
              <table className="min-w-full w-max table-auto border-collapse">
                <colgroup>
                  <col className="w-[10rem]" />
                  <col className="w-[20rem]" />
                  <col className="w-[30rem]" />
                  <col className="w-[7rem]" />
                  <col className="w-[12rem]" />
                  <col className="w-[8rem]" />
                  <col className="w-[34rem]" />
                  <col className="w-[34rem]" />
                  <col className="w-[14rem]" />
                  <col className="w-[15rem]" />
                  <col className="w-[10rem]" />
                  <col className="w-[12rem]" />
                  <col className="w-[9rem]" />
                  <col className="w-[10rem]" />
                  <col className="w-[12rem]" />
                  <col className="w-[10rem]" />
                  <col className="w-[10rem]" />
                  <col className="w-[12rem]" />
                  <col className="w-[28rem]" />
                  <col className="w-[7rem]" />
                </colgroup>
                <thead>
                  <tr className="border-b border-white/8 bg-white/[0.02] text-left">
                    {renderSortableHeader(
                      "ID RDM",
                      "id",
                      sort,
                      dir,
                      buildSortHref("id"),
                    )}
                    {renderSortableHeader(
                      "Référence document",
                      "reference",
                      sort,
                      dir,
                      buildSortHref("reference"),
                    )}
                    {renderSortableHeader(
                      "Titre document",
                      "title",
                      sort,
                      dir,
                      buildSortHref("title"),
                    )}
                    <th className={desktopHeaderClass}>
                      Type
                    </th>
                    {renderSortableHeader(
                      "Statut",
                      "status",
                      sort,
                      dir,
                      buildSortHref("status"),
                    )}
                    {renderSortableHeader(
                      "Version",
                      "version",
                      sort,
                      dir,
                      buildSortHref("version"),
                    )}
                    <th className={desktopHeaderClass}>
                      Emplacement DOCX
                    </th>
                    <th className={desktopHeaderClass}>
                      Emplacement PDF
                    </th>
                    {renderSortableHeader(
                      "Entité propriétaire",
                      "ownerEntity",
                      sort,
                      dir,
                      buildSortHref("ownerEntity"),
                    )}
                    {renderSortableHeader(
                      "Catégorie documentaire",
                      "category",
                      sort,
                      dir,
                      buildSortHref("category"),
                    )}
                    <th className={desktopHeaderClass}>
                      Date création
                    </th>
                    {renderSortableHeader(
                      "Date dernière mise à jour",
                      "updatedAt",
                      sort,
                      dir,
                      buildSortHref("updatedAt"),
                    )}
                    <th className={desktopHeaderClass}>
                      Source normative
                    </th>
                    <th className={desktopHeaderClass}>
                      Accès collaborateurs
                    </th>
                    <th className={desktopHeaderClass}>
                      Niveau de confidentialité
                    </th>
                    <th className={desktopHeaderClass}>
                      Remplace
                    </th>
                    <th className={desktopHeaderClass}>
                      Remplacé par
                    </th>
                    <th className={desktopHeaderClass}>
                      Décision registre liée
                    </th>
                    <th className={desktopHeaderClass}>
                      Observations
                    </th>
                    <th className={desktopHeaderClass}>
                      PDF
                    </th>
                  </tr>
                </thead>

                <tbody>
                  {records.map((record) => (
                    <tr
                      key={record.id}
                      className={`border-b border-white/6 align-top transition-colors duration-500 hover:bg-white/[0.02] ${getGovernanceRowClass(
                        record.governanceSyncStatus,
                      )}`}
                    >
                      <td className={`${desktopCellClass} whitespace-nowrap`}>
                        {record.id}
                      </td>
                      <td className={`${desktopCellClass} whitespace-nowrap`}>
                        {record.reference}
                      </td>
                      <td className={desktopCellClass}>
                        <div className="min-w-[22rem] max-w-[34rem] leading-6">
                          <Link
                            href={`/collaborateurs/documents/${record.id}`}
                            className="font-serif text-lg text-[#F7F5F0] transition-colors duration-500 hover:text-[#D5C1A1]"
                          >
                            {record.title}
                          </Link>
                        </div>
                      </td>
                      <td className={`${desktopCellClass} whitespace-nowrap`}>
                        <span
                          className={`rounded-full border px-3 py-1 text-[0.62rem] uppercase tracking-[0.22em] ${getTypeBadgeClass(
                            record.type,
                          )}`}
                        >
                          {record.type}
                        </span>
                      </td>
                      <td className={`${desktopCellClass} whitespace-nowrap`}>
                        <span
                          className={`rounded-full border px-3 py-1 text-[0.62rem] uppercase tracking-[0.22em] ${getStatusBadgeClass(
                            record.status,
                          )}`}
                        >
                          {record.status}
                        </span>
                      </td>
                      <td className={`${desktopCellClass} whitespace-nowrap`}>
                        {record.version}
                      </td>
                      <td className="px-6 py-5 align-top text-sm text-white/68">
                        <div className="min-w-[26rem] max-w-[38rem] break-all leading-6">
                          {record.docxPath}
                        </div>
                      </td>
                      <td className="px-6 py-5 align-top text-sm text-white/68">
                        <div className="min-w-[26rem] max-w-[38rem] break-all leading-6">
                          {record.pdfPath}
                        </div>
                      </td>
                      <td className={desktopCellClass}>
                        <div className="min-w-[12rem]">{record.ownerEntity}</div>
                      </td>
                      <td className={desktopCellClass}>
                        <div className="min-w-[12rem]">{record.category}</div>
                      </td>
                      <td className={`${desktopCellClass} whitespace-nowrap`}>
                        {record.createdAt}
                      </td>
                      <td className={`${desktopCellClass} whitespace-nowrap`}>
                        {record.updatedAt}
                      </td>
                      <td className={`${desktopCellClass} whitespace-nowrap`}>
                        <span
                          className={`rounded-full border px-3 py-1 text-[0.62rem] uppercase tracking-[0.22em] ${getBinaryBadgeClass(
                            getSourceNormativeLabel(record),
                          )}`}
                        >
                          {getSourceNormativeLabel(record)}
                        </span>
                      </td>
                      <td className={`${desktopCellClass} whitespace-nowrap`}>
                        <span
                          className={`rounded-full border px-3 py-1 text-[0.62rem] uppercase tracking-[0.22em] ${getBinaryBadgeClass(
                            getCollaboratorAccessLabel(record),
                          )}`}
                        >
                          {getCollaboratorAccessLabel(record)}
                        </span>
                      </td>
                      <td className={`${desktopCellClass} whitespace-nowrap`}>
                        <span
                          className={`rounded-full border px-3 py-1 text-[0.62rem] uppercase tracking-[0.22em] ${getConfidentialityBadgeClass(
                            getConfidentialityLabel(record),
                          )}`}
                        >
                          {getConfidentialityLabel(record)}
                        </span>
                      </td>
                      <td className={`${desktopCellClass} whitespace-nowrap`}>
                        {record.replaces ?? "Aucun"}
                      </td>
                      <td className={`${desktopCellClass} whitespace-nowrap`}>
                        {record.replacedBy ?? "Aucun"}
                      </td>
                      <td className={`${desktopCellClass} whitespace-nowrap`}>
                        <span
                          className={`rounded-full border px-3 py-1 text-[0.62rem] uppercase tracking-[0.22em] ${getDecisionBadgeClass(
                            record.registerDecision,
                          )}`}
                        >
                          {record.registerDecision ?? "Aucune"}
                        </span>
                      </td>
                      <td className="px-6 py-5 align-top text-sm text-white/68">
                        <div className="min-w-[20rem] max-w-[30rem] leading-6">
                          {record.observations}
                        </div>
                      </td>
                      <td className={`${desktopCellClass} whitespace-nowrap`}>
                        <a
                          href={`/api/documents/${record.id}/download?format=pdf&disposition=inline`}
                          target="_blank"
                          rel="noreferrer"
                          className="inline-flex rounded-full border border-[#C5B39B]/35 px-3 py-1 text-[0.62rem] uppercase tracking-[0.22em] text-[#D5C1A1] transition-colors duration-500 hover:border-[#C5B39B]/55 hover:text-[#F7F5F0]"
                        >
                          Voir
                        </a>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            <div className="grid gap-4 p-4 md:hidden">
              {records.map((record) => (
                <article
                  key={record.id}
                  className={`rounded-[1.5rem] border border-white/8 bg-white/[0.02] p-5 ${getGovernanceRowClass(
                    record.governanceSyncStatus,
                  )}`}
                >
                  <div className="flex flex-wrap items-center gap-3">
                    <span className="rounded-full border border-white/10 px-3 py-1 text-[0.62rem] uppercase tracking-[0.22em] text-white/48">
                      {record.id}
                    </span>
                    <span
                      className={`rounded-full border px-3 py-1 text-[0.62rem] uppercase tracking-[0.22em] ${getTypeBadgeClass(
                        record.type,
                      )}`}
                    >
                      {record.type}
                    </span>
                    <span
                      className={`rounded-full border px-3 py-1 text-[0.62rem] uppercase tracking-[0.22em] ${getGovernanceSyncClasses(
                        record.governanceSyncStatus,
                      )}`}
                    >
                      {record.governanceSyncStatus}
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
                        Statut
                      </dt>
                      <dd className="mt-2 text-sm text-white/78">
                        <span
                          className={`rounded-full border px-3 py-1 text-[0.62rem] uppercase tracking-[0.22em] ${getStatusBadgeClass(
                            record.status,
                          )}`}
                        >
                          {record.status}
                        </span>
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
                        Entité propriétaire
                      </dt>
                      <dd className="mt-2 text-sm text-white/78">
                        {record.ownerEntity}
                      </dd>
                    </div>
                    <div>
                      <dt className="text-[0.58rem] uppercase tracking-[0.24em] text-white/35">
                        Catégorie documentaire
                      </dt>
                      <dd className="mt-2 text-sm text-white/78">
                        {record.category}
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
                        Date dernière mise à jour
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
                        <span
                          className={`rounded-full border px-3 py-1 text-[0.62rem] uppercase tracking-[0.22em] ${getBinaryBadgeClass(
                            getSourceNormativeLabel(record),
                          )}`}
                        >
                          {getSourceNormativeLabel(record)}
                        </span>
                      </dd>
                    </div>
                    <div>
                      <dt className="text-[0.58rem] uppercase tracking-[0.24em] text-white/35">
                        Accès collaborateurs
                      </dt>
                      <dd className="mt-2 text-sm text-white/78">
                        <span
                          className={`rounded-full border px-3 py-1 text-[0.62rem] uppercase tracking-[0.22em] ${getBinaryBadgeClass(
                            getCollaboratorAccessLabel(record),
                          )}`}
                        >
                          {getCollaboratorAccessLabel(record)}
                        </span>
                      </dd>
                    </div>
                    <div>
                      <dt className="text-[0.58rem] uppercase tracking-[0.24em] text-white/35">
                        Niveau de confidentialité
                      </dt>
                      <dd className="mt-2 text-sm text-white/78">
                        <span
                          className={`rounded-full border px-3 py-1 text-[0.62rem] uppercase tracking-[0.22em] ${getConfidentialityBadgeClass(
                            getConfidentialityLabel(record),
                          )}`}
                        >
                          {getConfidentialityLabel(record)}
                        </span>
                      </dd>
                    </div>
                    <div>
                      <dt className="text-[0.58rem] uppercase tracking-[0.24em] text-white/35">
                        Source de vérité
                      </dt>
                      <dd className="mt-2 text-sm text-white/78">
                        {record.sourceOfTruth}
                      </dd>
                    </div>
                    <div className="sm:col-span-2">
                      <dt className="text-[0.58rem] uppercase tracking-[0.24em] text-white/35">
                        Disponibilité fichiers
                      </dt>
                      <dd className="mt-2 text-sm text-white/78">
                        {getFileAvailabilityLabel(record.fileAvailability)}
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
                        Décision registre liée
                      </dt>
                      <dd className="mt-2 text-sm text-white/78">
                        <span
                          className={`rounded-full border px-3 py-1 text-[0.62rem] uppercase tracking-[0.22em] ${getDecisionBadgeClass(
                            record.registerDecision,
                          )}`}
                        >
                          {record.registerDecision ?? "Aucune"}
                        </span>
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
                      href={`/api/documents/${record.id}/download?format=pdf&disposition=inline`}
                      target="_blank"
                      rel="noreferrer"
                      className="rounded-full border border-white/12 px-4 py-2 text-[0.62rem] uppercase tracking-[0.24em] text-white/75 transition-colors duration-500 hover:border-white/25 hover:text-white"
                    >
                      Voir PDF
                    </a>
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
