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
export type GovernanceIssueCode =
  | "PDF_A_CONFIRMER"
  | "STATUT_A_CONFIRMER"
  | "VERSION_A_CONFIRMER"
  | "DOCX_DANS_02_PDF"
  | "ENTITE_STATUT_BLOQUE"
  | "RDM_SYNC_A_FINALISER";

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
  governanceIssueCode?: GovernanceIssueCode;
  fileAvailability: FileAvailability;
  allowedRoles: CollaboratorRole[];
  availableFormats: DownloadFormat[];
}
