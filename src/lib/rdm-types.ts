import type { CollaboratorRole } from "./permissions";

export type DocumentType =
  | "DOC"
  | "DIR"
  | "REF"
  | "RDM"
  | "PROC"
  | "NOTE";

export type DocumentStatus =
  | "Document de travail"
  | "Validé"
  | "Archivé";

export type DownloadFormat = "docx" | "pdf";

export type GovernanceSyncStatus =
  | "à jour"
  | "à vérifier"
  | "bloqué"
  | "archivé";

export type FileAvailabilityStatus = "présent" | "manquant" | "à vérifier";

export type CollaboratorAccessLevel = "Oui" | "Non" | "Restreint";

export type ConfidentialityLevel =
  | "Public interne"
  | "Restreint"
  | "Admin";

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
  sourceOfTruth: "ZONE21_DEV";
  governanceSyncStatus: GovernanceSyncStatus;
  fileAvailability: FileAvailability;
  allowedRoles: CollaboratorRole[];
  availableFormats: DownloadFormat[];
}
