import type {
  WriterAuditPreview,
  WriterInput,
  WriterResult,
  WriterStatus,
} from "./writer.types";

interface DryRunBuildOptions {
  status: WriterStatus;
  theoreticalPaths: {
    docx: string;
    pdf: string;
    archiveDocx: string;
    archivePdf: string;
  };
}

function buildSimulatedActions(status: WriterStatus) {
  const baseActions = [
    "simulation generation DOCX",
    "simulation generation PDF",
    "simulation archivage version precedente",
    "simulation mise a jour journal d'audit",
    "simulation signal de rafraichissement RDM",
  ];

  if (status === "ready") {
    return baseActions;
  }

  return [
    "simulation refusee avant toute ecriture",
    "aucun fichier cree",
    "aucun deplacement de fichier",
    "journalisation de blocage preparee",
  ];
}

export function buildWriterAuditPreview(
  input: WriterInput,
  status: WriterStatus,
  theoreticalPaths: DryRunBuildOptions["theoreticalPaths"],
): WriterAuditPreview {
  return {
    eventType: "writer_dry_run",
    sourceOfTruth: "ZONE21_DEV",
    draftId: input.draftId,
    reference: input.reference,
    documentType: input.documentType,
    domain: input.domain,
    decision: input.validationDecision,
    initiatedBy: input.validatedBy,
    targetDocxPath: theoreticalPaths.docx,
    targetPdfPath: theoreticalPaths.pdf,
    archiveDocxPath: theoreticalPaths.archiveDocx,
    archivePdfPath: theoreticalPaths.archivePdf,
    status,
    timestamp: new Date().toISOString(),
  };
}

export function buildDryRunWriterResult(
  input: WriterInput,
  options: DryRunBuildOptions & {
    controls: WriterResult["controls"];
    errors: WriterResult["errors"];
  },
): WriterResult {
  return {
    enabled: false,
    mode: "dry-run",
    status: options.status,
    controls: options.controls,
    errors: options.errors,
    targetPath: options.theoreticalPaths.docx,
    archivePath: options.theoreticalPaths.archiveDocx,
    theoreticalPaths: options.theoreticalPaths,
    simulatedActions: buildSimulatedActions(options.status),
    auditPreview: buildWriterAuditPreview(
      input,
      options.status,
      options.theoreticalPaths,
    ),
  };
}
