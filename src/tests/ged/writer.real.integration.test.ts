import test from "node:test";
import assert from "node:assert/strict";
import { access, readFile, rm, stat } from "node:fs/promises";
import path from "node:path";

import { gedConfig } from "@/config/ged.config";
import { executeDocxSandboxGeneration } from "@/services/ged/writer/real/writer.real.docx";
import { assertSandboxPath } from "@/services/ged/writer/real/writer.real.fs";
import {
  executePdfSandboxConversion,
  getLibreOfficeBinaryPath,
} from "@/services/ged/writer/real/writer.real.pdf";
import {
  buildRealWriterInput,
  buildSandboxExecutionSummary,
} from "@/services/ged/writer/real/writer.real.service";
import type { WriterInput } from "@/services/ged/writer/writer.types";

function buildValidInput(): WriterInput {
  return {
    draftId: "GED-REAL-INTEGRATION-0001",
    documentType: "NOTE-Z21",
    domain: "MEDIA",
    object: "BRIEF-CAMPAGNE",
    reference: "NOTE-Z21-MEDIA-BRIEF-CAMPAGNE-v1.2",
    title: "Brief campagne media sandbox",
    fileName: "NOTE-Z21-MEDIA-BRIEF-CAMPAGNE-v1.2.docx",
    versionTarget: "v1.2",
    pathTarget:
      "/ZONE21_DEV/90_GED_PHASE_1/NOTE-Z21/MEDIA/01_DOCX/NOTE-Z21-MEDIA-BRIEF-CAMPAGNE-v1.2.docx",
    validatedBy: "Admin documentaire",
    validationDecision: "validé",
    templateKey: "note-z21-standard-v1",
    contentSummary: "Validation reelle en sandbox du moteur DOCX/PDF.",
    simulateVersionConflict: false,
  };
}

async function cleanupSandboxArtifacts(paths: string[]) {
  for (const targetPath of paths) {
    await rm(targetPath, { force: true });
  }

  await rm(gedConfig.sandbox.path, { recursive: true, force: true });
}

test("generation DOCX reelle dans sandbox", async () => {
  const input = buildRealWriterInput(buildValidInput());
  const summary = buildSandboxExecutionSummary(input);

  try {
    const result = await executeDocxSandboxGeneration(input, summary.docxPath);
    const writtenFile = await stat(summary.docxPath);
    const buffer = await readFile(summary.docxPath);

    assert.equal(result.verified, true);
    assert.ok(writtenFile.size > 0);
    assert.ok(buffer.byteLength > 0);
    assert.equal(result.sandboxPath, path.resolve(summary.docxPath));
    assert.equal(result.sandboxPath.includes("/ZONE21_DEV/"), false);
  } finally {
    await cleanupSandboxArtifacts([summary.docxPath, summary.pdfPath]);
  }
});

test("conversion PDF reelle dans sandbox si LibreOffice est disponible", async (t) => {
  if (process.platform === "darwin") {
    t.skip(
      "La conversion PDF locale LibreOffice sur macOS n'est plus le chemin de validation prioritaire.",
    );
    return;
  }

  const libreOfficeBinaryPath = await getLibreOfficeBinaryPath();

  if (!libreOfficeBinaryPath) {
    t.skip("LibreOffice absent sur cette machine de test.");
    return;
  }

  const input = buildRealWriterInput(buildValidInput());
  const summary = buildSandboxExecutionSummary(input);

  try {
    await executeDocxSandboxGeneration(input, summary.docxPath);
    const pdfResult = await executePdfSandboxConversion(
      input,
      summary.docxPath,
      summary.pdfPath,
    );
    const pdfStats = await stat(summary.pdfPath);

    assert.equal(pdfResult.skipped, undefined);
    assert.equal(pdfResult.verified, true);
    assert.ok(pdfStats.size > 0);
    assert.equal(path.basename(summary.pdfPath), `${input.reference}.pdf`);
  } finally {
    await cleanupSandboxArtifacts([summary.docxPath, summary.pdfPath]);
  }
});

test("interdiction hors sandbox", async () => {
  await assert.rejects(
    async () => {
      assertSandboxPath("/ZONE21_DEV/90_GED_PHASE_1/NOTE-Z21/MEDIA/01_DOCX/test.docx");
    },
    /ZONE21_DEV/,
  );

  await assert.rejects(
    async () => {
      assertSandboxPath("/tmp/zone21_elsewhere/test.docx");
    },
    /GED_SANDBOX_PATH/,
  );
});

test("cleanup fichiers", async () => {
  const input = buildRealWriterInput(buildValidInput());
  const summary = buildSandboxExecutionSummary(input);

  await executeDocxSandboxGeneration(input, summary.docxPath);
  await access(summary.docxPath);
  await cleanupSandboxArtifacts([summary.docxPath, summary.pdfPath]);

  await assert.rejects(
    async () => {
      await access(summary.docxPath);
    },
    /ENOENT/,
  );
});
