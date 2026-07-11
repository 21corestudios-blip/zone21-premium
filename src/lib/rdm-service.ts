import { existsSync, mkdirSync, readFileSync, writeFileSync } from "node:fs";
import { readFile, writeFile } from "node:fs/promises";
import path from "node:path";

import { canAccessRecord, canDownloadRecord } from "./rbac";
import type { CollaboratorRole } from "./permissions";
import type {
  DocumentStatus,
  DocumentType,
  DownloadFormat,
  FileAvailabilityStatus,
  GovernanceIssueCode,
  GovernanceSyncStatus,
  RdmActiveSourceOfTruth,
  RdmRegistry,
  RdmRecord,
} from "./rdm-types";

export const RDM_ACTIVE_SOURCE_OF_TRUTH: RdmActiveSourceOfTruth =
  "ZONE 21 HOLDING";
export const RDM_REGISTRY_REFERENCE =
  "RDM-Z21H-CENTRAL-DOCUMENTS-OFFICIELS-v1.0" as const;

const RDM_ACTIVE_VIRTUAL_ROOT = `/${RDM_ACTIVE_SOURCE_OF_TRUTH}/`;
const RDM_REGISTRY_VIRTUAL_PATH =
  `/${RDM_ACTIVE_SOURCE_OF_TRUTH}/00_MASTER_SYSTEM/00_RDM_CENTRAL/${RDM_REGISTRY_REFERENCE}.json`;
const RDM_ARCHIVE_VIRTUAL_DIR =
  `/${RDM_ACTIVE_SOURCE_OF_TRUTH}/00_MASTER_SYSTEM/00_RDM_CENTRAL/99_ARCHIVES/RDM-Z21H-CENTRAL-DOCUMENTS-OFFICIELS`;
const RDM_LEGACY_AUDIT_VIRTUAL_ROOTS = [
  "/ZONE21/",
  "/ZONE21_DEV/",
  "/ZONE 21_PROJET_PAUSED/",
] as const;

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
  sourceOfTruth: RdmActiveSourceOfTruth;
  mode: "lecture/ecriture";
  envVarName: "Z21_ACTIVE_BASE_PATH";
  basePath: string | null;
  isAvailable: boolean;
  error: string | null;
  registryVirtualPath: string;
}

interface ResolvedPathResult {
  systemPath: string | null;
  error: string | null;
}

interface FilePresenceInspection {
  availability: FileAvailabilityStatus;
  error: string | null;
}

export interface RdmWriteInput {
  id?: string;
  reference: string;
  title: string;
  type: DocumentType;
  status?: DocumentStatus;
  version?: string;
  docxPath?: string;
  pdfPath?: string;
  ownerEntity: string;
  category?: string;
  observations?: string;
  confidentiality?: "interne" | "restreint" | "admin";
  availableFormats?: DownloadFormat[];
  expectedRegistryRevision?: number;
  actor: string;
  action: "create" | "update";
}

let cachedActiveBaseState: ActiveBaseState | null = null;
let cachedRegistry: RdmRegistry | null = null;

export function resetActiveBaseStateCache() {
  cachedActiveBaseState = null;
  cachedRegistry = null;
}

function normalizeSearchValue(value: string) {
  return value
    .normalize("NFD")
    .replace(/\p{Diacritic}/gu, "")
    .toLowerCase();
}

function getSortableValue(record: RdmRecord, sortKey: RdmSortKey) {
  switch (sortKey) {
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
    case "updatedAt":
    default:
      return Date.parse(record.updatedAt) || 0;
  }
}

function buildEmptyRegistry(status: DocumentStatus = "A_CREER"): RdmRegistry {
  return {
    schemaVersion: 1,
    reference: RDM_REGISTRY_REFERENCE,
    title: "RDM central officiel minimal ZONE 21 HOLDING",
    version: "v1.0",
    status,
    sourceOfTruth: RDM_ACTIVE_SOURCE_OF_TRUTH,
    updatedAt: new Date().toISOString(),
    updatedBy: "systeme",
    revision: 0,
    documents: [],
    eventLog: [],
  };
}

function assertRegistry(value: unknown): asserts value is RdmRegistry {
  if (!value || typeof value !== "object") {
    throw new Error("Le registre RDM Drive est illisible.");
  }

  const registry = value as Partial<RdmRegistry>;

  if (
    registry.reference !== RDM_REGISTRY_REFERENCE ||
    registry.sourceOfTruth !== RDM_ACTIVE_SOURCE_OF_TRUTH ||
    !Array.isArray(registry.documents)
  ) {
    throw new Error("Le registre RDM Drive ne respecte pas le schema minimal 5J.");
  }
}

function readRegistryFromDrive() {
  const resolvedPath = resolveSystemPath(RDM_REGISTRY_VIRTUAL_PATH);

  if (!resolvedPath.systemPath || !existsSync(resolvedPath.systemPath)) {
    return {
      registry: buildEmptyRegistry("A_CREER"),
      error:
        resolvedPath.error ??
        "Le registre RDM officiel minimal n'existe pas encore dans la base Drive active.",
    };
  }

  try {
    const parsed = JSON.parse(readFileSync(resolvedPath.systemPath, "utf-8"));
    assertRegistry(parsed);

    return {
      registry: parsed,
      error: null,
    };
  } catch (error) {
    return {
      registry: buildEmptyRegistry("BLOQUE"),
      error:
        error instanceof Error
          ? error.message
          : "Le registre RDM Drive ne peut pas etre lu.",
    };
  }
}

function inspectFilePresence(virtualPath: string): FilePresenceInspection {
  if (!virtualPath.trim()) {
    return {
      availability: "manquant",
      error: null,
    };
  }

  const resolvedPath = resolveSystemPath(virtualPath);

  if (!resolvedPath.systemPath) {
    return {
      availability: "à vérifier",
      error: resolvedPath.error,
    };
  }

  return {
    availability: existsSync(resolvedPath.systemPath) ? "présent" : "manquant",
    error: null,
  };
}

function deriveAvailableFormats(record: RdmRecord): DownloadFormat[] {
  const formats: DownloadFormat[] = [];

  if (record.docxPath.trim()) {
    formats.push("docx");
  }

  if (record.pdfPath.trim()) {
    formats.push("pdf");
  }

  return formats;
}

export function deriveGovernanceSyncStatus(record: RdmRecord): GovernanceSyncStatus {
  if (record.status === "BLOQUE") {
    return "BLOQUE";
  }

  if (!record.docxPath.trim() && !record.pdfPath.trim()) {
    return "A_SYNCHRONISER";
  }

  const docxPresence = inspectFilePresence(record.docxPath);
  const pdfPresence = inspectFilePresence(record.pdfPath);

  if (docxPresence.error || pdfPresence.error) {
    return "BLOQUE";
  }

  const declaredFormats = deriveAvailableFormats(record);

  if (
    declaredFormats.includes("docx") &&
    docxPresence.availability !== "présent"
  ) {
    return "A_VERIFIER";
  }

  if (
    declaredFormats.includes("pdf") &&
    pdfPresence.availability !== "présent"
  ) {
    return "A_VERIFIER";
  }

  return declaredFormats.length > 0 ? "SYNCHRONISE" : "A_SYNCHRONISER";
}

function hydrateRecord(record: RdmRecord): RdmRecord {
  const docxPresence = inspectFilePresence(record.docxPath);
  const pdfPresence = inspectFilePresence(record.pdfPath);

  return {
    ...record,
    governanceSyncStatus: deriveGovernanceSyncStatus(record),
    fileAvailability: {
      docx: docxPresence.availability,
      pdf: pdfPresence.availability,
    },
    availableFormats: deriveAvailableFormats(record),
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
      sourceOfTruth: RDM_ACTIVE_SOURCE_OF_TRUTH,
      mode: "lecture/ecriture",
      envVarName: "Z21_ACTIVE_BASE_PATH",
      basePath: null,
      isAvailable: false,
      error:
        "La variable d'environnement Z21_ACTIVE_BASE_PATH est absente. Le RDM officiel Drive ne peut pas etre lu ni modifie cote serveur.",
      registryVirtualPath: RDM_REGISTRY_VIRTUAL_PATH,
    };

    return cachedActiveBaseState;
  }

  if (!existsSync(basePath)) {
    cachedActiveBaseState = {
      sourceOfTruth: RDM_ACTIVE_SOURCE_OF_TRUTH,
      mode: "lecture/ecriture",
      envVarName: "Z21_ACTIVE_BASE_PATH",
      basePath: null,
      isAvailable: false,
      error:
        "La variable d'environnement Z21_ACTIVE_BASE_PATH pointe vers un dossier introuvable. Le RDM officiel Drive reste inaccessible cote serveur.",
      registryVirtualPath: RDM_REGISTRY_VIRTUAL_PATH,
    };

    return cachedActiveBaseState;
  }

  cachedActiveBaseState = {
    sourceOfTruth: RDM_ACTIVE_SOURCE_OF_TRUTH,
    mode: "lecture/ecriture",
    envVarName: "Z21_ACTIVE_BASE_PATH",
    basePath,
    isAvailable: true,
    error: null,
    registryVirtualPath: RDM_REGISTRY_VIRTUAL_PATH,
  };

  return cachedActiveBaseState;
}

export function resolveSystemPath(virtualPath: string): ResolvedPathResult {
  const activeBaseState = getActiveBaseState();

  if (!virtualPath.startsWith(RDM_ACTIVE_VIRTUAL_ROOT)) {
    const legacyRoot = RDM_LEGACY_AUDIT_VIRTUAL_ROOTS.find((root) =>
      virtualPath.startsWith(root),
    );

    return {
      systemPath: null,
      error: legacyRoot
        ? `Le chemin virtuel demande depend de ${legacyRoot.slice(1, -1)}, source historique/audit non active. Seuls les chemins /${RDM_ACTIVE_SOURCE_OF_TRUTH}/ sont resolus cote serveur.`
        : `Le chemin virtuel demande ne depend pas de /${RDM_ACTIVE_SOURCE_OF_TRUTH}/ et ne peut pas etre resolu cote serveur.`,
    };
  }

  if (!activeBaseState.basePath) {
    return {
      systemPath: null,
      error: activeBaseState.error,
    };
  }

  const virtualRelativePath = virtualPath
    .slice(RDM_ACTIVE_VIRTUAL_ROOT.length)
    .replace(/^\/+/, "");
  const baseSegments = path
    .resolve(/* turbopackIgnore: true */ activeBaseState.basePath)
    .split(path.sep)
    .filter(Boolean);
  const virtualSegments = virtualRelativePath
    .split("/")
    .filter(Boolean);

  let overlapLength = 0;
  const maxOverlap = Math.min(baseSegments.length, virtualSegments.length);

  for (let length = maxOverlap; length > 0; length -= 1) {
    const baseTail = baseSegments.slice(-length).join("/");
    const virtualHead = virtualSegments.slice(0, length).join("/");

    if (baseTail === virtualHead) {
      overlapLength = length;
      break;
    }
  }

  const resolvedRelativePath = virtualSegments
    .slice(overlapLength)
    .join(path.sep);

  return {
    systemPath: path.join(
      /* turbopackIgnore: true */ activeBaseState.basePath,
      resolvedRelativePath,
    ),
    error: null,
  };
}

export function getRdmRegistry() {
  if (cachedRegistry) {
    return {
      registry: cachedRegistry,
      error: null,
    };
  }

  const result = readRegistryFromDrive();
  cachedRegistry = result.registry;

  return result;
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
  const { registry } = getRdmRegistry();

  const filteredRecords = registry.documents
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
  const { registry } = getRdmRegistry();
  const record = registry.documents.find((item) => item.id === id);

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
      getRdmRegistry().registry.documents
        .map(hydrateRecord)
        .filter((record) => canAccessRecord(role, record))
        .map((record) => record.category),
    ),
  ).sort((a, b) => a.localeCompare(b, "fr"));
}

export function getAccessibleTypes(role: CollaboratorRole) {
  return Array.from(
    new Set(
      getRdmRegistry().registry.documents
        .map(hydrateRecord)
        .filter((record) => canAccessRecord(role, record))
        .map((record) => record.type),
    ),
  ).sort((a, b) => a.localeCompare(b, "fr"));
}

export function getAccessibleStatuses(role: CollaboratorRole) {
  return Array.from(
    new Set(
      getRdmRegistry().registry.documents
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
      A_SYNCHRONISER: 0,
      SYNCHRONISE: 0,
      A_VERIFIER: 0,
      BLOQUE: 0,
    } satisfies Record<GovernanceSyncStatus, number>,
  );

  let overallStatus: GovernanceSyncStatus = "SYNCHRONISE";

  if (counts.BLOQUE > 0) {
    overallStatus = "BLOQUE";
  } else if (counts.A_VERIFIER > 0) {
    overallStatus = "A_VERIFIER";
  } else if (records.length === 0 || counts.A_SYNCHRONISER > 0) {
    overallStatus = "A_SYNCHRONISER";
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

function buildRecord(input: RdmWriteInput, existing?: RdmRecord): RdmRecord {
  const now = new Date().toISOString();
  const id = existing?.id ?? input.id?.trim() ?? `RDM-${Date.now()}`;
  const version = input.version?.trim() || existing?.version || "v1.0";
  const docxPath = input.docxPath?.trim() ?? existing?.docxPath ?? "";
  const pdfPath = input.pdfPath?.trim() ?? existing?.pdfPath ?? "";
  const availableFormats = input.availableFormats ?? [
    ...(docxPath ? (["docx"] as const) : []),
    ...(pdfPath ? (["pdf"] as const) : []),
  ];

  return hydrateRecord({
    id,
    reference: input.reference.trim(),
    title: input.title.trim(),
    type: input.type,
    status: input.status ?? existing?.status ?? "BROUILLON",
    version,
    docxPath,
    pdfPath,
    ownerEntity: input.ownerEntity.trim(),
    category: input.category?.trim() || existing?.category || "RDM central",
    createdAt: existing?.createdAt ?? now,
    updatedAt: now,
    isNormativeSource: false,
    normativeSources: [],
    collaboratorAccess: "Restreint",
    confidentiality:
      input.confidentiality ?? existing?.confidentiality ?? "interne",
    replaces: existing?.replaces ?? null,
    replacedBy: existing?.replacedBy ?? null,
    registerDecision: existing?.registerDecision ?? null,
    observations: input.observations?.trim() ?? existing?.observations ?? "",
    sourceOfTruth: RDM_ACTIVE_SOURCE_OF_TRUTH,
    governanceSyncStatus: "A_SYNCHRONISER",
    fileAvailability: {
      docx: "à vérifier",
      pdf: "à vérifier",
    },
    allowedRoles: ["admin", "editeur", "lecteur"],
    availableFormats,
  });
}

function validateWriteInput(input: RdmWriteInput, registry: RdmRegistry) {
  if (input.expectedRegistryRevision !== undefined) {
    if (input.expectedRegistryRevision !== registry.revision) {
      throw new Error("La version Drive du RDM a change. Ecriture bloquee.");
    }
  }

  if (!input.reference.trim() || !input.title.trim() || !input.ownerEntity.trim()) {
    throw new Error("Reference, titre et entite sont obligatoires.");
  }

  if (
    !/^(RDM|CH|ENT|GOV|BR|REF|PROC|NOTE|MOD|REG|DEC|AUD)-(Z21H|Z21I|Z21M|ARC|CORE|BACK|CO|CY|EK|Z21V)-[A-Z0-9]+-[A-Z0-9-]+-v\d+\.\d+$/.test(
      input.reference.trim(),
    )
  ) {
    throw new Error("La reference ne suit pas la grammaire minimale 5G.");
  }
}

function writeRegistryToDrive(registry: RdmRegistry) {
  const resolvedPath = resolveSystemPath(RDM_REGISTRY_VIRTUAL_PATH);

  if (!resolvedPath.systemPath) {
    throw new Error(resolvedPath.error ?? "Chemin RDM Drive introuvable.");
  }

  mkdirSync(path.dirname(resolvedPath.systemPath), { recursive: true });
  writeFileSync(resolvedPath.systemPath, `${JSON.stringify(registry, null, 2)}\n`);
  cachedRegistry = registry;
}

function archiveRegistry(registry: RdmRegistry) {
  if (registry.revision <= 0) {
    return null;
  }

  const archiveResolved = resolveSystemPath(RDM_ARCHIVE_VIRTUAL_DIR);

  if (!archiveResolved.systemPath) {
    throw new Error(archiveResolved.error ?? "Chemin archive RDM introuvable.");
  }

  const stamp = new Date().toISOString().replace(/[:.]/g, "-");
  const archivePath = path.join(
    archiveResolved.systemPath,
    `revision-${registry.revision}-${stamp}.json`,
  );

  mkdirSync(path.dirname(archivePath), { recursive: true });
  writeFileSync(archivePath, `${JSON.stringify(registry, null, 2)}\n`);

  return archivePath;
}

export function saveRdmRecord(input: RdmWriteInput) {
  const activeBaseState = getActiveBaseState();

  if (!activeBaseState.isAvailable) {
    throw new Error(activeBaseState.error ?? "Base Drive active indisponible.");
  }

  const { registry } = getRdmRegistry();
  validateWriteInput(input, registry);

  const existingIndex = registry.documents.findIndex((record) =>
    input.id
      ? record.id === input.id
      : record.reference === input.reference.trim(),
  );

  if (input.action === "create" && existingIndex >= 0) {
    throw new Error("Une entree RDM existe deja avec cet identifiant ou cette reference.");
  }

  if (input.action === "update" && existingIndex < 0) {
    throw new Error("Entree RDM introuvable pour modification.");
  }

  const archivedPath = archiveRegistry(registry);
  const existing = existingIndex >= 0 ? registry.documents[existingIndex] : undefined;
  const record = buildRecord(input, existing);
  const nextDocuments = [...registry.documents];

  if (existingIndex >= 0) {
    nextDocuments[existingIndex] = record;
  } else {
    nextDocuments.push(record);
  }

  const nextRegistry: RdmRegistry = {
    ...registry,
    status: registry.status === "A_CREER" ? "BROUILLON" : registry.status,
    updatedAt: record.updatedAt,
    updatedBy: input.actor,
    revision: registry.revision + 1,
    documents: nextDocuments,
    eventLog: [
      ...registry.eventLog,
      {
        at: record.updatedAt,
        actor: input.actor,
        action: input.action === "create" ? "CREATION_ENTREE" : "MODIFICATION_ENTREE",
        detail: `${record.reference}${archivedPath ? " apres archivage de la revision precedente" : ""}.`,
      },
    ],
  };

  writeRegistryToDrive(nextRegistry);

  return {
    registry: nextRegistry,
    record,
    archivedPath,
  };
}

export async function attachUploadedFiles(options: {
  record: RdmRecord;
  docxFile?: File | null;
  pdfFile?: File | null;
}) {
  const writes: Array<Promise<void>> = [];

  async function persistFile(file: File, virtualPath: string) {
    if (!virtualPath.trim()) {
      throw new Error("Un chemin Drive est requis pour ajouter un fichier.");
    }

    const resolvedPath = resolveSystemPath(virtualPath);

    if (!resolvedPath.systemPath) {
      throw new Error(resolvedPath.error ?? "Chemin fichier Drive invalide.");
    }

    mkdirSync(path.dirname(resolvedPath.systemPath), { recursive: true });
    const buffer = Buffer.from(await file.arrayBuffer());
    await writeFile(resolvedPath.systemPath, buffer);
  }

  if (options.docxFile && options.docxFile.size > 0) {
    writes.push(persistFile(options.docxFile, options.record.docxPath));
  }

  if (options.pdfFile && options.pdfFile.size > 0) {
    writes.push(persistFile(options.pdfFile, options.record.pdfPath));
  }

  await Promise.all(writes);
  resetActiveBaseStateCache();
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

export function serializeRegistry() {
  const { registry, error } = getRdmRegistry();

  return {
    reference: registry.reference,
    title: registry.title,
    version: registry.version,
    status: registry.status,
    sourceOfTruth: registry.sourceOfTruth,
    updatedAt: registry.updatedAt,
    updatedBy: registry.updatedBy,
    revision: registry.revision,
    totalDocuments: registry.documents.length,
    registryError: error,
  };
}

export function mapStatusToIssue(status: GovernanceSyncStatus): GovernanceIssueCode | undefined {
  switch (status) {
    case "A_VERIFIER":
      return "FICHIER_MANQUANT";
    case "BLOQUE":
      return "CONFLIT_DRIVE";
    default:
      return undefined;
  }
}
