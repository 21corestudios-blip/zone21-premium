export const writerAllowedPrefixes = ["NOTE-Z21", "PROC-Z21"] as const;

export type WriterPrefix = (typeof writerAllowedPrefixes)[number];

export const writerDomains = [
  "DOC",
  "MEDIA",
  "WEAR",
  "PROD",
  "SITE",
  "OPS",
  "FIN",
  "IA",
] as const;

export type WriterDomain = (typeof writerDomains)[number];

export const writerActiveDomains = [
  "DOC",
  "MEDIA",
  "WEAR",
  "OPS",
  "IA",
] as const satisfies readonly WriterDomain[];

export const writerConditionalDomains = [
  "PROD",
  "SITE",
] as const satisfies readonly WriterDomain[];

export const writerForbiddenDomains = [
  "FIN",
] as const satisfies readonly WriterDomain[];

export type WriterStatus = "ready" | "blocked" | "invalid";

export interface WriterInput {
  draftId: string;
  documentType: WriterPrefix;
  domain: WriterDomain;
  object: string;
  reference: string;
  title: string;
  fileName: string;
  versionTarget: string;
  pathTarget: string;
  validatedBy: string;
  validationDecision: "validé" | "rejeté";
  templateKey: string;
  contentSummary: string;
  simulateVersionConflict?: boolean;
}

export interface WriterError {
  code: string;
  message: string;
  blocking: boolean;
  field?: string;
}

export interface WriterControlResult {
  id: string;
  label: string;
  passed: boolean;
  blocking: boolean;
  detail: string;
}

export interface WriterAuditPreview {
  eventType: "writer_dry_run";
  sourceOfTruth: "ZONE21_DEV";
  draftId: string;
  reference: string;
  documentType: WriterPrefix;
  domain: WriterDomain;
  decision: "validé" | "rejeté";
  initiatedBy: string;
  targetDocxPath: string;
  targetPdfPath: string;
  archiveDocxPath: string;
  archivePdfPath: string;
  status: WriterStatus;
  timestamp: string;
}

export interface WriterTheoreticalPaths {
  docx: string;
  pdf: string;
  archiveDocx: string;
  archivePdf: string;
}

export interface WriterResult {
  enabled: false;
  mode: "dry-run";
  status: WriterStatus;
  controls: WriterControlResult[];
  errors: WriterError[];
  targetPath: string;
  archivePath: string;
  theoreticalPaths: WriterTheoreticalPaths;
  simulatedActions: string[];
  auditPreview: WriterAuditPreview;
}

export interface WriterRulesSummary {
  prefixesAllowed: WriterPrefix[];
  domainsActive: WriterDomain[];
  domainsConditional: WriterDomain[];
  domainsForbidden: WriterDomain[];
  basePath: string;
  pathPattern: string;
}
