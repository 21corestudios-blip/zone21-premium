import type { CollaboratorRole } from "./permissions";

export type DocumentType =
  | "RDM"
  | "CH"
  | "ENT"
  | "GOV"
  | "BR"
  | "REF"
  | "PROC"
  | "NOTE"
  | "MOD"
  | "REG"
  | "DEC"
  | "AUD";

export type DocumentStatus =
  | "A_CREER"
  | "BROUILLON"
  | "VALIDE"
  | "PUBLIE"
  | "ARCHIVE"
  | "A_VERIFIER"
  | "BLOQUE";

export type DownloadFormat = "docx" | "pdf";

export type GovernanceSyncStatus =
  | "A_SYNCHRONISER"
  | "SYNCHRONISE"
  | "A_VERIFIER"
  | "BLOQUE";

export type FileAvailabilityStatus = "présent" | "manquant" | "à vérifier";
export type GovernanceIssueCode =
  | "REFERENCE_INVALIDE"
  | "VERSION_OBSOLETE"
  | "FICHIER_MANQUANT"
  | "CHEMIN_INVALIDE"
  | "CONFLIT_DRIVE"
  | "DROITS_INSUFFISANTS"
  | "RDM_A_CREER";

export type CollaboratorAccessLevel = "Oui" | "Non" | "Restreint";

export type ConfidentialityLevel = "interne" | "restreint" | "admin";

export type RdmActiveSourceOfTruth = "ZONE 21 HOLDING";
export type RdmHistoricalAuditSource =
  | "ZONE21"
  | "ZONE21_DEV"
  | "ZONE 21_PROJET_PAUSED";
export type RdmSourceOfTruth =
  | RdmActiveSourceOfTruth
  | RdmHistoricalAuditSource;

export interface FileAvailability {
  docx: FileAvailabilityStatus;
  pdf: FileAvailabilityStatus;
}

export interface RdmRecord {
  id: string;
  reference: string;
  title: string;
  type: DocumentType;
  status: DocumentStatus;
  version: string;
  docxPath: string;
  pdfPath: string;
  ownerEntity: string;
  category: string;
  createdAt: string;
  updatedAt: string;
  isNormativeSource: boolean;
  normativeSources: string[];
  collaboratorAccess: CollaboratorAccessLevel;
  confidentiality: ConfidentialityLevel;
  replaces: string | null;
  replacedBy: string | null;
  registerDecision: string | null;
  observations: string;
  sourceOfTruth: RdmSourceOfTruth;
  governanceSyncStatus: GovernanceSyncStatus;
  governanceIssueCode?: GovernanceIssueCode;
  fileAvailability: FileAvailability;
  allowedRoles: CollaboratorRole[];
  availableFormats: DownloadFormat[];
}

export interface RdmRegistryEvent {
  at: string;
  actor: string;
  action: string;
  detail: string;
}

export interface RdmRegistry {
  schemaVersion: 1;
  reference: "RDM-Z21H-CENTRAL-DOCUMENTS-OFFICIELS-v1.0";
  title: string;
  version: string;
  status: DocumentStatus;
  sourceOfTruth: RdmActiveSourceOfTruth;
  updatedAt: string;
  updatedBy: string;
  revision: number;
  documents: RdmRecord[];
  eventLog: RdmRegistryEvent[];
}
