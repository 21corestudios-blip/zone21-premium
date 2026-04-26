import type {
  WriterControlResult,
  WriterError,
  WriterInput,
  WriterStatus,
} from "../writer.types";
import type { GedAuditLogEntry } from "../../audit/logger";

export interface RealWriterInput extends WriterInput {
  sourceReference?: string | null;
  sourceVersion?: string | null;
  archiveRequired?: boolean;
}

export interface FileWritePlan {
  kind: "create";
  format: "docx" | "pdf";
  targetPath: string;
  sourcePlan: "docx-generation" | "pdf-generation";
  execute: false;
  reason: string;
}

export interface ArchivePlan {
  kind: "archive";
  archiveRequired: boolean;
  sourceReference: string | null;
  sourceDocxPath: string | null;
  sourcePdfPath: string | null;
  archiveDocxPath: string | null;
  archivePdfPath: string | null;
  execute: false;
  reason: string;
}

export interface GenerationPlan {
  format: "docx" | "pdf";
  templateKey: string;
  targetPath: string;
  execute: false;
  pipeline: string[];
  templateLoaded: boolean;
  inMemoryOnly: true;
  simulatedBufferByteLength: number;
  commandPreview?: string;
  inputs: {
    reference: string;
    title: string;
    version: string;
    domain: string;
    object: string;
    contentSummary: string;
  };
}

export interface SandboxExecutionResult {
  format: "docx" | "pdf";
  sandboxPath: string;
  verified: boolean;
  sizeBytes: number;
  skipped?: boolean;
  reason?: string;
  commandExecuted?: string;
}

export interface SandboxExecutionSummary {
  sandboxRoot: string;
  docxPath: string;
  pdfPath: string;
  archiveDocxPath: string | null;
  archivePdfPath: string | null;
}

export interface RealWriterOutput {
  enabled: false;
  mode: "real-plan";
  executionAllowed: false;
  status: WriterStatus;
  controls: WriterControlResult[];
  errors: WriterError[];
  targetPath: string;
  archivePath: string | null;
  generationPlan: {
    docx: GenerationPlan;
    pdf: GenerationPlan;
  };
  archivePlan: ArchivePlan;
  fileWritePlan: FileWritePlan[];
  signalPlan: {
    refreshRdm: true;
    updateAudit: true;
    execute: false;
  };
  summary: string[];
}

export interface RealWriterExecutionResult {
  enabled: true;
  mode: "staging-authorization";
  executionAllowed: true;
  status: "authorized";
  targetPath: string;
  archivePath: string | null;
  auditLog: GedAuditLogEntry;
  steps: string[];
  summary: string[];
}
