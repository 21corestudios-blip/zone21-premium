import { getWriterRuntimeConfig } from "@/config/env.config";
import { logGedAuditEvent } from "@/services/ged/audit/logger";
import {
  assertWriterActivationAllowed,
  isWriterActivationAllowed,
} from "@/services/ged/writer/writer.guard";
import type { WriterInput } from "../writer.types";
import { validateWriterInput } from "../writer.validator";

import {
  executeDocxSandboxGeneration,
  buildDocxGenerationPlan,
} from "./writer.real.docx";
import {
  assertSandboxPath,
  assertZone21DevPath,
  buildArchivePlan,
  buildFileWritePlan,
  buildRealWriterPaths,
  copySandboxFileToZone21Dev,
  deleteZone21DevFile,
  getGedSandboxPath,
  getRealWriterBasePath,
  mapTheoreticalPathToSandbox,
  moveZone21DevFileToArchive,
  restoreZone21DevArchivedFile,
  validateRealWriterPaths,
  verifyZone21DevFile,
} from "./writer.real.fs";
import {
  executePdfSandboxConversion,
  buildPdfGenerationPlan,
} from "./writer.real.pdf";
import type {
  RealWriterInput,
  RealWriterExecutionResult,
  RealWriterOutput,
  SandboxExecutionSummary,
} from "./writer.real.types";

interface RealWriterDependencies {
  executeDocxSandboxGeneration: typeof executeDocxSandboxGeneration;
  executePdfSandboxConversion: typeof executePdfSandboxConversion;
  copySandboxFileToZone21Dev: typeof copySandboxFileToZone21Dev;
  moveZone21DevFileToArchive: typeof moveZone21DevFileToArchive;
  restoreZone21DevArchivedFile: typeof restoreZone21DevArchivedFile;
  deleteZone21DevFile: typeof deleteZone21DevFile;
  verifyZone21DevFile: typeof verifyZone21DevFile;
}

const defaultRealWriterDependencies: RealWriterDependencies = {
  executeDocxSandboxGeneration,
  executePdfSandboxConversion,
  copySandboxFileToZone21Dev,
  moveZone21DevFileToArchive,
  restoreZone21DevArchivedFile,
  deleteZone21DevFile,
  verifyZone21DevFile,
};

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
  dependencies: RealWriterDependencies = defaultRealWriterDependencies,
): Promise<RealWriterExecutionResult> {
  assertWriterActivationAllowed(getWriterRuntimeConfig());

  const validation = validateWriterInput(input);

  if (validation.status !== "ready") {
    const auditLog = logGedAuditEvent({
      level: "failure",
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
  const rollbackActions: Array<() => Promise<void>> = [];

  assertZone21DevPath(paths.docx);
  assertZone21DevPath(paths.pdf);
  if (paths.archiveDocx) {
    assertZone21DevPath(paths.archiveDocx);
  }
  if (paths.archivePdf) {
    assertZone21DevPath(paths.archivePdf);
  }

  logGedAuditEvent({
    level: "start",
    user: input.validatedBy,
    action: "writer_real_execution_start",
    file: input.reference,
    version: input.versionTarget,
    status: "start",
    errors: [],
  });

  try {
    logGedAuditEvent({
      level: "step",
      user: input.validatedBy,
      action: "validation_ged_complete",
      file: input.reference,
      version: input.versionTarget,
      status: validation.status,
      errors: [],
    });
    steps.push("validation_ged_complete");

    if (!input.templateKey.trim()) {
      throw new Error("Aucun template documentaire n'est renseigne.");
    }

    const sandboxDocxResult = await dependencies.executeDocxSandboxGeneration(
      input,
      sandboxSummary.docxPath,
    );

    if (!sandboxDocxResult.verified || sandboxDocxResult.sizeBytes <= 0) {
      throw new Error(
        "La generation DOCX sandbox n'a pas pu etre verifiee.",
      );
    }

    logGedAuditEvent({
      level: "step",
      user: input.validatedBy,
      action: "generation_docx_sandbox",
      file: input.reference,
      version: input.versionTarget,
      status: "ok",
      errors: [],
    });
    steps.push("generation_docx_sandbox");

    const sandboxPdfResult = await dependencies.executePdfSandboxConversion(
      input,
      sandboxSummary.docxPath,
      sandboxSummary.pdfPath,
    );

    if (
      sandboxPdfResult.skipped ||
      !sandboxPdfResult.verified ||
      sandboxPdfResult.sizeBytes <= 0
    ) {
      throw new Error(
        sandboxPdfResult.reason ??
          "La conversion PDF sandbox n'a pas pu etre verifiee.",
      );
    }

    logGedAuditEvent({
      level: "step",
      user: input.validatedBy,
      action: "generation_pdf_sandbox",
      file: input.reference,
      version: input.versionTarget,
      status: "ok",
      errors: [],
    });
    steps.push("generation_pdf_sandbox");

    if (input.archiveRequired) {
      if (!paths.archiveDocx || !paths.archivePdf || !input.sourceReference) {
        throw new Error("Le plan d'archivage est incomplet.");
      }

      const sourceDocxPath =
        `${getRealWriterBasePath()}/${input.documentType}/${input.domain}/01_DOCX/${input.sourceReference}.docx`;
      const sourcePdfPath =
        `${getRealWriterBasePath()}/${input.documentType}/${input.domain}/02_PDF/${input.sourceReference}.pdf`;

      await dependencies.moveZone21DevFileToArchive(
        sourceDocxPath,
        paths.archiveDocx,
      );
      rollbackActions.push(async () => {
        await dependencies.restoreZone21DevArchivedFile(
          paths.archiveDocx!,
          sourceDocxPath,
        );
      });

      await dependencies.moveZone21DevFileToArchive(
        sourcePdfPath,
        paths.archivePdf,
      );
      rollbackActions.push(async () => {
        await dependencies.restoreZone21DevArchivedFile(
          paths.archivePdf!,
          sourcePdfPath,
        );
      });

      logGedAuditEvent({
        level: "step",
        user: input.validatedBy,
        action: "archivage_version_precedente",
        file: input.reference,
        version: input.versionTarget,
        status: "ok",
        errors: [],
      });
      steps.push("archivage_version_precedente");
    }

    const docxSystemPath = await dependencies.copySandboxFileToZone21Dev(
      sandboxSummary.docxPath,
      paths.docx,
    );
    rollbackActions.push(() => dependencies.deleteZone21DevFile(paths.docx));
    logGedAuditEvent({
      level: "step",
      user: input.validatedBy,
      action: "copie_docx_zone21_dev",
      file: input.reference,
      version: input.versionTarget,
      status: "ok",
      errors: [],
    });
    steps.push("copie_docx_zone21_dev");

    const pdfSystemPath = await dependencies.copySandboxFileToZone21Dev(
      sandboxSummary.pdfPath,
      paths.pdf,
    );
    rollbackActions.push(() => dependencies.deleteZone21DevFile(paths.pdf));
    logGedAuditEvent({
      level: "step",
      user: input.validatedBy,
      action: "copie_pdf_zone21_dev",
      file: input.reference,
      version: input.versionTarget,
      status: "ok",
      errors: [],
    });
    steps.push("copie_pdf_zone21_dev");

    const rereadDocx = await dependencies.verifyZone21DevFile(paths.docx);
    const rereadPdf = await dependencies.verifyZone21DevFile(paths.pdf);
    const rereadConfirmed = rereadDocx.sizeBytes > 0 && rereadPdf.sizeBytes > 0;

    if (!rereadConfirmed) {
      throw new Error(
        "La relecture physique des fichiers ecrits dans ZONE21_DEV a echoue.",
      );
    }

    logGedAuditEvent({
      level: "step",
      user: input.validatedBy,
      action: "relecture_physique_zone21_dev",
      file: input.reference,
      version: input.versionTarget,
      status: "ok",
      errors: [],
    });
    steps.push("relecture_physique_zone21_dev");

    const auditLog = logGedAuditEvent({
      level: "success",
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
      summary: [
        "Execution reelle authorisee et finalisee en staging.",
        "DOCX et PDF ont ete ecrits dans ZONE21_DEV apres validation complete.",
        "La relecture physique a confirme des fichiers de taille strictement positive.",
      ],
    };
  } catch (error) {
    for (const rollbackAction of [...rollbackActions].reverse()) {
      try {
        await rollbackAction();
      } catch {
        // Best-effort rollback only.
      }
    }

    const message = error instanceof Error
      ? error.message
      : "Erreur inconnue pendant l'execution reelle du writer.";

    const auditLog = logGedAuditEvent({
      level: "failure",
      user: input.validatedBy,
      action: "writer_real_execution_failure",
      file: input.reference,
      version: input.versionTarget,
      status: "failed",
      errors: [message],
    });

    throw Object.assign(new Error(message), { auditLog, steps });
  }
}
