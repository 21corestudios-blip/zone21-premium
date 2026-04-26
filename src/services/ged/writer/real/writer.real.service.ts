import { getWriterRuntimeConfig } from "@/config/env.config";
import { logGedAuditEvent } from "@/services/ged/audit/logger";
import {
  assertWriterActivationAllowed,
  isWriterActivationAllowed,
} from "@/services/ged/writer/writer.guard";
import type { WriterInput } from "../writer.types";
import { validateWriterInput } from "../writer.validator";

import {
  buildDocxGenerationPlan,
} from "./writer.real.docx";
import {
  assertSandboxPath,
  assertZone21DevPath,
  buildArchivePlan,
  buildFileWritePlan,
  buildRealWriterPaths,
  getGedSandboxPath,
  getRealWriterBasePath,
  mapTheoreticalPathToSandbox,
  validateRealWriterPaths,
} from "./writer.real.fs";
import {
  buildPdfGenerationPlan,
} from "./writer.real.pdf";
import type {
  RealWriterInput,
  RealWriterExecutionResult,
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
    assertZone21DevPath(paths.archiveDocx!);
  }
  if (summary.archivePdfPath) {
    assertZone21DevPath(paths.archivePdf!);
  }

  return summary;
}

export function runRealWriter(input: RealWriterInput) {
  if (!isWriterActivationAllowed(getWriterRuntimeConfig())) {
    return buildRealWriterPlan(input);
  }

  return executeRealWriter(input);
}

export async function executeRealWriter(
  input: RealWriterInput,
): Promise<RealWriterExecutionResult> {
  assertWriterActivationAllowed(getWriterRuntimeConfig());

  const validation = validateWriterInput(input);

  if (validation.status !== "ready") {
    const auditLog = logGedAuditEvent({
      user: input.validatedBy,
      action: "writer_real_execution_blocked",
      file: input.reference,
      version: input.versionTarget,
      status: validation.status,
      errors: validation.errors.map((error) => error.message),
    });

    throw Object.assign(
      new Error(
        "Execution writer bloquee : la validation GED n'est pas complete.",
      ),
      { auditLog, validation },
    );
  }

  const paths = buildRealWriterPaths(input);
  const steps: string[] = [];

  assertZone21DevPath(paths.docx);
  assertZone21DevPath(paths.pdf);
  if (paths.archiveDocx) {
    assertZone21DevPath(paths.archiveDocx);
  }
  if (paths.archivePdf) {
    assertZone21DevPath(paths.archivePdf);
  }

  steps.push("validation_ged_complete");
  steps.push("activation_theorique_staging_autorisee");
  steps.push("verification_theorique_des_chemins_zone21_dev");
  steps.push("aucune_ecriture_finale_executee");

  const auditLog = logGedAuditEvent({
    user: input.validatedBy,
    action: "writer_staging_authorized_non_writing",
    file: input.reference,
    version: input.versionTarget,
    status: "authorized",
    errors: [],
  });

  return {
    enabled: true,
    mode: "staging-authorization",
    executionAllowed: true,
    status: "authorized",
    targetPath: paths.docx,
    archivePath: paths.archiveDocx,
    auditLog,
    steps,
    summary: [
      "Activation theorique autorisee en staging.",
      "Aucune ecriture physique n'a ete effectuee dans ZONE21_DEV.",
      "Le writer reste non-ecrivant a ce stade.",
    ],
  };
}
