import { existsSync } from "node:fs";
import { readFile } from "node:fs/promises";
import path from "node:path";

import { rdmRecords } from "@/data/rdm.records";

import { canAccessRecord, canDownloadRecord } from "./rbac";
import type { CollaboratorRole } from "./permissions";
import type { DownloadFormat, DocumentStatus, DocumentType, RdmRecord } from "./rdm-types";

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

const activeBaseCandidates = [
  process.env.Z21_ACTIVE_BASE_PATH,
  "/Users/gregloupiac/Mon Drive (21corestudios@gmail.com)/ZONE21_DEV",
  "/Users/gregloupiac/Mon\u00a0Drive (21corestudios@gmail.com)/ZONE21_DEV",
  "/Users/gregloupiac/Library/CloudStorage/GoogleDrive-21corestudios@gmail.com/Mon Drive/ZONE21_DEV",
  "/Users/gregloupiac/Library/CloudStorage/GoogleDrive-21corestudios@gmail.com/Mon\u00a0Drive/ZONE21_DEV",
].filter(Boolean) as string[];

let cachedActiveBasePath: string | null | undefined;

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

export function resolveActiveBasePath() {
  if (cachedActiveBasePath !== undefined) {
    return cachedActiveBasePath;
  }

  cachedActiveBasePath =
    activeBaseCandidates.find((candidate) => existsSync(candidate)) ?? null;

  return cachedActiveBasePath;
}

export function resolveSystemPath(virtualPath: string) {
  const activeBasePath = resolveActiveBasePath();

  if (!activeBasePath) {
    return null;
  }

  const relativePath = virtualPath.replace(/^\/?ZONE21_DEV\/?/, "");

  return path.join(activeBasePath, relativePath);
}

export function listRdmRecords(options: {
  role: CollaboratorRole;
  query?: string;
  type?: DocumentType | "all";
  status?: DocumentStatus | "all";
  category?: string | "all";
  sortKey?: RdmSortKey;
  sortDirection?: SortDirection;
}) {
  const query = options.query?.trim();
  const normalizedQuery = query ? normalizeSearchValue(query) : null;

  const filteredRecords = rdmRecords.filter((record) => {
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

  if (!record || !canAccessRecord(role, record)) {
    return null;
  }

  return record;
}

export function getAccessibleCategories(role: CollaboratorRole) {
  return Array.from(
    new Set(
      rdmRecords
        .filter((record) => canAccessRecord(role, record))
        .map((record) => record.category),
    ),
  ).sort((a, b) => a.localeCompare(b, "fr"));
}

export function getAccessibleStatuses(role: CollaboratorRole) {
  return Array.from(
    new Set(
      rdmRecords
        .filter((record) => canAccessRecord(role, record))
        .map((record) => record.status),
    ),
  );
}

export function serializeRdmRecord(record: RdmRecord, role: CollaboratorRole) {
  return {
    ...record,
    detailUrl: `/collaborateurs/documents/${record.id}`,
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

  const virtualPath = options.format === "pdf" ? record.pdfPath : record.docxPath;
  const systemPath = resolveSystemPath(virtualPath);

  if (!systemPath || !existsSync(systemPath)) {
    return {
      record,
      systemPath,
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
    systemPath,
    fileName: path.basename(systemPath),
    buffer: await readFile(systemPath),
    mimeType:
      options.format === "pdf"
        ? "application/pdf"
        : "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
  };
}
