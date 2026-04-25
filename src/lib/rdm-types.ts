import type { CollaboratorRole } from "./permissions";

export type DocumentType = "DOC" | "DIR";

export type DocumentStatus =
  | "Validé"
  | "Document de travail"
  | "Archivé";

export type DownloadFormat = "docx" | "pdf";

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
  normativeSources: string[];
  collaboratorAccess: string;
  confidentiality: string;
  replaces: string | null;
  replacedBy: string | null;
  registerDecision: string | null;
  observations: string;
  allowedRoles: CollaboratorRole[];
  availableFormats: DownloadFormat[];
}
