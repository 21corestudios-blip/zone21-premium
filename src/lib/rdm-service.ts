import { existsSync } from "node:fs";
import { readFile } from "node:fs/promises";
import path from "node:path";

import { rdmRecords } from "@/data/rdm.records";

import { canAccessRecord, canDownloadRecord } from "./rbac";
import type { CollaboratorRole } from "./permissions";
import type {
  DownloadFormat,
  DocumentStatus,
  DocumentType,
  FileAvailabilityStatus,
  GovernanceSyncStatus,
  RdmRecord,
} from "./rdm-types";

export type RdmSortKey =
  | "id"
  | "reference"
  | "title"
  | "status"
  | "ownerEntity"
  | "category"
  | "version"
  | "updatedAt";

export type SortDirection = "asc" | "desc";
export type RdmTypeFilter = DocumentType | "all";
export type RdmStatusFilter = DocumentStatus | "all";

export interface ActiveBaseState {
  sourceOfTruth: "ZONE21_DEV";
  mode: "lecture seule";
  envVarName: "Z21_ACTIVE_BASE_PATH";
  basePath: string | null;
  isAvailable: boolean;
  error: string | null;
}

interface ResolvedPathResult {
  systemPath: string | null;
  error: string | null;
}

let cachedActiveBaseState: ActiveBaseState | null = null;

function normalizeSearchValue(value: string) {
  return value
    .normalize("NFD")
    .replace(/\p{Diacritic}/gu, "")
    .toLowerCase();
}

function parseFrenchDate(value: string) {
  const [day, month, year] = value.split("/").map(Number);

  if (!day || !month || !year) {
    return 0;
  }

  return new Date(year, month - 1, day).getTime();
}

function getSortableValue(record: RdmRecord, sortKey: RdmSortKey) {
  switch (sortKey) {
    case "updatedAt":
      return parseFrenchDate(record.updatedAt);
    case "id":
      return record.id;
    case "reference":
      return record.reference;
    case "title":
      return record.title;
    case "status":
      return record.status;
    case "ownerEntity":
      return record.ownerEntity;
    case "category":
      return record.category;
    case "version":
      return record.version;
    default:
      return record.updatedAt;
  }
}

function resolveFilePresence(virtualPath: string): FileAvailabilityStatus {
  const resolvedPath = resolveSystemPath(virtualPath);

  if (!resolvedPath.systemPath) {
    return "à vérifier";
  }

  return existsSync(resolvedPath.systemPath) ? "présent" : "manquant";
}

function hydrateRecord(record: RdmRecord): RdmRecord {
  return {
    ...record,
    fileAvailability: {
      docx: resolveFilePresence(record.docxPath),
      pdf: resolveFilePresence(record.pdfPath),
    },
  };
}

export function sortRdmRecords(
  records: RdmRecord[],
  sortKey: RdmSortKey = "updatedAt",
  sortDirection: SortDirection = "desc",
) {
  const directionFactor = sortDirection === "asc" ? 1 : -1;

  return [...records].sort((left, right) => {
    const leftValue = getSortableValue(left, sortKey);
    const rightValue = getSortableValue(right, sortKey);

    if (typeof leftValue === "number" && typeof rightValue === "number") {
      return (leftValue - rightValue) * directionFactor;
    }

    return (
      String(leftValue).localeCompare(String(rightValue), "fr", {
        sensitivity: "base",
      }) * directionFactor
    );
  });
}

export function getActiveBaseState(): ActiveBaseState {
  if (cachedActiveBaseState) {
    return cachedActiveBaseState;
  }

  const basePath = process.env.Z21_ACTIVE_BASE_PATH?.trim() || null;

  if (!basePath) {
    cachedActiveBaseState = {
      sourceOfTruth: "ZONE21_DEV",
      mode: "lecture seule",
      envVarName: "Z21_ACTIVE_BASE_PATH",
      basePath: null,
      isAvailable: false,
      error:
        "La variable d'environnement Z21_ACTIVE_BASE_PATH est absente. Le RDM reste consultable en métadonnées, mais la vérification des fichiers et les téléchargements ne peuvent pas être garantis.",
    };

    return cachedActiveBaseState;
  }

  if (!existsSync(basePath)) {
    cachedActiveBaseState = {
      sourceOfTruth: "ZONE21_DEV",
      mode: "lecture seule",
      envVarName: "Z21_ACTIVE_BASE_PATH",
      basePath: null,
      isAvailable: false,
      error:
        "La variable d'environnement Z21_ACTIVE_BASE_PATH pointe vers un dossier introuvable. Le RDM reste affichable, mais la base active n'est pas exploitable côté serveur.",
    };

    return cachedActiveBaseState;
  }

  cachedActiveBaseState = {
    sourceOfTruth: "ZONE21_DEV",
    mode: "lecture seule",
    envVarName: "Z21_ACTIVE_BASE_PATH",
    basePath,
    isAvailable: true,
    error: null,
  };

  return cachedActiveBaseState;
}

export function resolveSystemPath(virtualPath: string): ResolvedPathResult {
  const activeBaseState = getActiveBaseState();

  if (!virtualPath.startsWith("/ZONE21_DEV/")) {
    return {
      systemPath: null,
      error:
        "Le chemin virtuel demandé ne dépend pas de /ZONE21_DEV/ et ne peut pas être résolu côté serveur.",
    };
  }

  if (!activeBaseState.basePath) {
    return {
      systemPath: null,
      error: activeBaseState.error,
    };
  }

  return {
    systemPath: path.join(
      /* turbopackIgnore: true */ activeBaseState.basePath,
      virtualPath.replace(/^\/?ZONE21_DEV\/?/, ""),
    ),
    error: null,
  };
}

export function listRdmRecords(options: {
  role: CollaboratorRole;
  query?: string;
  type?: RdmTypeFilter;
  status?: RdmStatusFilter;
  category?: string | "all";
  sortKey?: RdmSortKey;
  sortDirection?: SortDirection;
}) {
  const query = options.query?.trim();
  const normalizedQuery = query ? normalizeSearchValue(query) : null;

  const filteredRecords = rdmRecords
    .map(hydrateRecord)
    .filter((record) => {
      if (!canAccessRecord(options.role, record)) {
        return false;
      }

      if (options.type && options.type !== "all" && record.type !== options.type) {
        return false;
      }

      if (
        options.status &&
        options.status !== "all" &&
        record.status !== options.status
      ) {
        return false;
      }

      if (
        options.category &&
        options.category !== "all" &&
        record.category !== options.category
      ) {
        return false;
      }

      if (!normalizedQuery) {
        return true;
      }

      const haystack = normalizeSearchValue(
        [
          record.id,
          record.reference,
          record.title,
          record.ownerEntity,
          record.category,
          record.observations,
          record.governanceSyncStatus,
        ].join(" "),
      );

      return haystack.includes(normalizedQuery);
    });

  return sortRdmRecords(
    filteredRecords,
    options.sortKey ?? "updatedAt",
    options.sortDirection ?? "desc",
  );
}

export function getRdmRecordById(id: string, role: CollaboratorRole) {
  const record = rdmRecords.find((item) => item.id === id);

  if (!record) {
    return null;
  }

  const hydratedRecord = hydrateRecord(record);

  if (!canAccessRecord(role, hydratedRecord)) {
    return null;
  }

  return hydratedRecord;
}

export function getAccessibleCategories(role: CollaboratorRole) {
  return Array.from(
    new Set(
      rdmRecords
        .map(hydrateRecord)
        .filter((record) => canAccessRecord(role, record))
        .map((record) => record.category),
    ),
  ).sort((a, b) => a.localeCompare(b, "fr"));
}

export function getAccessibleTypes(role: CollaboratorRole) {
  return Array.from(
    new Set(
      rdmRecords
        .map(hydrateRecord)
        .filter((record) => canAccessRecord(role, record))
        .map((record) => record.type),
    ),
  ).sort((a, b) => a.localeCompare(b, "fr"));
}

export function getAccessibleStatuses(role: CollaboratorRole) {
  return Array.from(
    new Set(
      rdmRecords
        .map(hydrateRecord)
        .filter((record) => canAccessRecord(role, record))
        .map((record) => record.status),
    ),
  );
}

export function getGovernanceOverview(records: RdmRecord[]) {
  const counts = records.reduce(
    (accumulator, record) => {
      accumulator[record.governanceSyncStatus] += 1;
      return accumulator;
    },
    {
      "à jour": 0,
      "à vérifier": 0,
      "bloqué": 0,
      "archivé": 0,
    } satisfies Record<GovernanceSyncStatus, number>,
  );

  let overallStatus: GovernanceSyncStatus = "à jour";

  if (counts["bloqué"] > 0) {
    overallStatus = "bloqué";
  } else if (counts["à vérifier"] > 0) {
    overallStatus = "à vérifier";
  } else if (records.length > 0 && counts["archivé"] === records.length) {
    overallStatus = "archivé";
  }

  return {
    overallStatus,
    counts,
  };
}

export function serializeRdmRecord(record: RdmRecord, role: CollaboratorRole) {
  const activeBaseState = getActiveBaseState();

  return {
    ...record,
    detailUrl: `/collaborateurs/documents/${record.id}`,
    activeBaseError: activeBaseState.error,
    downloadUrls: {
      docx: canDownloadRecord(role, record, "docx")
        ? `/api/documents/${record.id}/download?format=docx`
        : null,
      pdf: canDownloadRecord(role, record, "pdf")
        ? `/api/documents/${record.id}/download?format=pdf`
        : null,
    },
  };
}

export async function getDownloadPayload(options: {
  id: string;
  role: CollaboratorRole;
  format: DownloadFormat;
}) {
  const record = getRdmRecordById(options.id, options.role);

  if (!record || !canDownloadRecord(options.role, record, options.format)) {
    return null;
  }

  const virtualPath =
    options.format === "pdf" ? record.pdfPath : record.docxPath;
  const resolvedPath = resolveSystemPath(virtualPath);

  if (!resolvedPath.systemPath) {
    return {
      record,
      systemPath: null,
      baseError: resolvedPath.error,
      fileName: path.basename(virtualPath),
      buffer: null,
      mimeType:
        options.format === "pdf"
          ? "application/pdf"
          : "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
    };
  }

  if (!existsSync(resolvedPath.systemPath)) {
    return {
      record,
      systemPath: resolvedPath.systemPath,
      baseError: null,
      fileName: path.basename(virtualPath),
      buffer: null,
      mimeType:
        options.format === "pdf"
          ? "application/pdf"
          : "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
    };
  }

  return {
    record,
    systemPath: resolvedPath.systemPath,
    baseError: null,
    fileName: path.basename(resolvedPath.systemPath),
    buffer: await readFile(resolvedPath.systemPath),
    mimeType:
      options.format === "pdf"
        ? "application/pdf"
        : "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
  };
}
