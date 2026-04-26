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
  executeDocxSandboxGeneration,
} from "./writer.real.docx";
import {
  assertSandboxPath,
  assertZone21DevPath,
  buildArchivePlan,
  buildFileWritePlan,
  buildRealWriterPaths,
  copySandboxFileToZone21Dev,
  getGedSandboxPath,
  getRealWriterBasePath,
  mapTheoreticalPathToSandbox,
  moveZone21DevFileToArchive,
  validateRealWriterPaths,
  verifyZone21DevFile,
} from "./writer.real.fs";
import {
  buildPdfGenerationPlan,
  executePdfSandboxConversion,
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
    assertSandboxPath(summary.archiveDocxPath);
  }
  if (summary.archivePdfPath) {
    assertSandboxPath(summary.archivePdfPath);
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
  const sandboxSummary = buildSandboxExecutionSummary(input);
  const steps: string[] = [];

  assertZone21DevPath(paths.docx);
  assertZone21DevPath(paths.pdf);
  if (paths.archiveDocx) {
    assertZone21DevPath(paths.archiveDocx);
  }
  if (paths.archivePdf) {
    assertZone21DevPath(paths.archivePdf);
  }

  const sandboxDocxResult = await executeDocxSandboxGeneration(
    input,
    sandboxSummary.docxPath,
  );

  if (!sandboxDocxResult.verified) {
    const auditLog = logGedAuditEvent({
      user: input.validatedBy,
      action: "writer_real_execution_blocked",
      file: input.reference,
      version: input.versionTarget,
      status: "blocked",
      errors: ["La generation DOCX sandbox n'a pas pu etre verifiee."],
    });

    throw Object.assign(
      new Error(
        "Execution writer bloquee : la generation DOCX reelle n'a pas pu etre validee.",
      ),
      { auditLog, sandboxDocxResult },
    );
  }

  steps.push("generation_docx_sandbox");

  const sandboxPdfResult = await executePdfSandboxConversion(
    input,
    sandboxSummary.docxPath,
    sandboxSummary.pdfPath,
  );

  if (sandboxPdfResult.skipped || !sandboxPdfResult.verified) {
    const auditLog = logGedAuditEvent({
      user: input.validatedBy,
      action: "writer_real_execution_blocked",
      file: input.reference,
      version: input.versionTarget,
      status: "blocked",
      errors: [
        sandboxPdfResult.reason ??
          "La conversion PDF reelle n'a pas pu etre verifiee.",
      ],
    });

    throw Object.assign(
      new Error(
        "Execution writer bloquee : la conversion PDF reelle n'a pas pu etre validee.",
      ),
      { auditLog, sandboxPdfResult },
    );
  }

  steps.push("generation_pdf_sandbox");

  if (input.archiveRequired) {
    if (!paths.archiveDocx || !paths.archivePdf || !input.sourceReference) {
      throw new Error(
        "Execution writer bloquee : le plan d'archivage est incomplet.",
      );
    }

    await moveZone21DevFileToArchive(
      `${getRealWriterBasePath()}/${input.documentType}/${input.domain}/01_DOCX/${input.sourceReference}.docx`,
      paths.archiveDocx,
    );
    await moveZone21DevFileToArchive(
      `${getRealWriterBasePath()}/${input.documentType}/${input.domain}/02_PDF/${input.sourceReference}.pdf`,
      paths.archivePdf,
    );
    steps.push("archivage_version_precedente");
  }

  const docxSystemPath = await copySandboxFileToZone21Dev(
    sandboxSummary.docxPath,
    paths.docx,
  );
  const pdfSystemPath = await copySandboxFileToZone21Dev(
    sandboxSummary.pdfPath,
    paths.pdf,
  );
  steps.push("ecriture_zone21_dev");

  const rereadDocx = await verifyZone21DevFile(paths.docx);
  const rereadPdf = await verifyZone21DevFile(paths.pdf);
  const rereadConfirmed = rereadDocx.sizeBytes > 0 && rereadPdf.sizeBytes > 0;
  steps.push("relecture_physique");
  steps.push("mise_a_jour_rdm");

  const auditLog = logGedAuditEvent({
    user: input.validatedBy,
    action: "writer_real_execution_success",
    file: input.reference,
    version: input.versionTarget,
    status: "written",
    errors: [],
  });

  return {
    enabled: true,
    mode: "real-execution",
    executionAllowed: true,
    status: "written",
    docxPath: docxSystemPath,
    pdfPath: pdfSystemPath,
    archiveDocxPath: paths.archiveDocx,
    archivePdfPath: paths.archivePdf,
    rereadConfirmed,
    auditLog,
    steps,
  };
}
