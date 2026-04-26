import type { WriterInput } from "../writer.types";
import { validateWriterInput } from "../writer.validator";

import { buildDocxGenerationPlan } from "./writer.real.docx";
import {
  assertSandboxPath,
  buildArchivePlan,
  buildFileWritePlan,
  buildRealWriterPaths,
  getGedSandboxPath,
  getRealWriterBasePath,
  mapTheoreticalPathToSandbox,
  validateRealWriterPaths,
} from "./writer.real.fs";
import { buildPdfGenerationPlan } from "./writer.real.pdf";
import type {
  RealWriterInput,
  RealWriterOutput,
  SandboxExecutionSummary,
} from "./writer.real.types";

export function buildRealWriterInput(
  input: WriterInput,
  overrides?: Partial<
    Pick<RealWriterInput, "sourceReference" | "sourceVersion" | "archiveRequired">
  >,
): RealWriterInput {
  return {
    ...input,
    sourceReference: overrides?.sourceReference ?? null,
    sourceVersion: overrides?.sourceVersion ?? null,
    archiveRequired: overrides?.archiveRequired ?? false,
  };
}

export function buildRealWriterPlan(input: RealWriterInput): RealWriterOutput {
  const validation = validateWriterInput(input);
  const paths = buildRealWriterPaths(input);
  const pathValidation = validateRealWriterPaths(input, paths);
  const docxPlan = buildDocxGenerationPlan(input, paths.docx);
  const pdfPlan = buildPdfGenerationPlan(input, paths.pdf);
  const archivePlan = buildArchivePlan(input, paths);
  const fileWritePlan = buildFileWritePlan(input, paths);

  return {
    enabled: false,
    mode: "real-plan",
    executionAllowed: false,
    status: validation.status,
    controls: validation.controls,
    errors: validation.errors,
    targetPath: paths.docx,
    archivePath: archivePlan.archiveDocxPath,
    generationPlan: {
      docx: docxPlan,
      pdf: pdfPlan,
    },
    archivePlan,
    fileWritePlan,
    signalPlan: {
      refreshRdm: true,
      updateAudit: true,
      execute: false,
    },
    summary: [
      `Writer reel prepare en plan uniquement depuis ${getRealWriterBasePath()}.`,
      `DOCX theorique conforme: ${String(pathValidation.docxConforms)}.`,
      `PDF theorique conforme: ${String(pathValidation.pdfConforms)}.`,
      `Racine GED phase 1 respectee: ${String(pathValidation.usesGedPhaseOneRoot)}.`,
      `Buffer DOCX memoire prepare: ${String(docxPlan.simulatedBufferByteLength > 0)}.`,
      `Commande PDF simulee: ${String(Boolean(pdfPlan.commandPreview))}.`,
      "Aucune operation filesystem n'est executee dans cette etape.",
    ],
  };
}

export function buildSandboxExecutionSummary(
  input: RealWriterInput,
): SandboxExecutionSummary {
  const paths = buildRealWriterPaths(input);
  const summary = {
    sandboxRoot: getGedSandboxPath(),
    docxPath: mapTheoreticalPathToSandbox(paths.docx),
    pdfPath: mapTheoreticalPathToSandbox(paths.pdf),
    archiveDocxPath: paths.archiveDocx
      ? mapTheoreticalPathToSandbox(paths.archiveDocx)
      : null,
    archivePdfPath: paths.archivePdf
      ? mapTheoreticalPathToSandbox(paths.archivePdf)
      : null,
  };

  assertSandboxPath(summary.docxPath);
  assertSandboxPath(summary.pdfPath);
  if (summary.archiveDocxPath) {
    assertSandboxPath(summary.archiveDocxPath);
  }
  if (summary.archivePdfPath) {
    assertSandboxPath(summary.archivePdfPath);
  }

  return summary;
}
