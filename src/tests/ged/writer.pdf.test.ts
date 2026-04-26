import test from "node:test";
import assert from "node:assert/strict";

import {
  buildLibreOfficeCommandPreview,
  buildPdfGenerationPlan,
  getLibreOfficeBinaryPath,
} from "@/services/ged/writer/real/writer.real.pdf";
import type { RealWriterInput } from "@/services/ged/writer/real/writer.real.types";

function buildInput(): RealWriterInput {
  return {
    draftId: "GED-PDF-TEST-0001",
    documentType: "NOTE-Z21",
    domain: "MEDIA",
    object: "BRIEF-CAMPAGNE",
    reference: "NOTE-Z21-MEDIA-BRIEF-CAMPAGNE-v1.0",
    title: "Brief campagne media",
    fileName: "NOTE-Z21-MEDIA-BRIEF-CAMPAGNE-v1.0.docx",
    versionTarget: "v1.0",
    pathTarget:
      "/ZONE21_DEV/90_GED_PHASE_1/NOTE-Z21/MEDIA/01_DOCX/NOTE-Z21-MEDIA-BRIEF-CAMPAGNE-v1.0.docx",
    validatedBy: "Admin documentaire",
    validationDecision: "validé",
    templateKey: "note-z21-standard-v1",
    contentSummary: "Simulation de brief campagne conforme.",
    sourceReference: null,
    sourceVersion: null,
    archiveRequired: false,
  };
}

function withPdfEngine<T>(engine: "linux" | "local", callback: () => T) {
  const previousEngine = process.env.PDF_ENGINE;

  process.env.PDF_ENGINE = engine;

  try {
    return callback();
  } finally {
    if (previousEngine === undefined) {
      delete process.env.PDF_ENGINE;
    } else {
      process.env.PDF_ENGINE = previousEngine;
    }
  }
}

test("commande construite", () => {
  const command = buildLibreOfficeCommandPreview(
    buildInput(),
    "/ZONE21_DEV/90_GED_PHASE_1/NOTE-Z21/MEDIA/01_DOCX/NOTE-Z21-MEDIA-BRIEF-CAMPAGNE-v1.0.docx",
    "/ZONE21_DEV/90_GED_PHASE_1/NOTE-Z21/MEDIA/02_PDF/NOTE-Z21-MEDIA-BRIEF-CAMPAGNE-v1.0.pdf",
  );

  assert.ok(command.includes("--headless"));
  assert.ok(command.includes("--convert-to"));
  assert.ok(command.includes("pdf"));
});

test("coherence parametres en moteur linux", () => {
  const plan = withPdfEngine("linux", () =>
    buildPdfGenerationPlan(
      buildInput(),
      "/ZONE21_DEV/90_GED_PHASE_1/NOTE-Z21/MEDIA/02_PDF/NOTE-Z21-MEDIA-BRIEF-CAMPAGNE-v1.0.pdf",
    )
  );

  assert.equal(plan.inMemoryOnly, true);
  assert.equal(plan.execute, false);
  assert.ok(Boolean(plan.commandPreview));
  assert.ok(plan.commandPreview?.includes("limactl shell"));
});

test("fallback local si PDF_ENGINE=local", () => {
  const plan = withPdfEngine("local", () =>
    buildPdfGenerationPlan(
      buildInput(),
      "/ZONE21_DEV/90_GED_PHASE_1/NOTE-Z21/MEDIA/02_PDF/NOTE-Z21-MEDIA-BRIEF-CAMPAGNE-v1.0.pdf",
    )
  );

  assert.equal(plan.execute, false);
  assert.ok(Boolean(plan.commandPreview));
  assert.ok(plan.commandPreview?.includes("LibreOffice.app"));
});

test("aucun exec implicite dans le plan PDF", async () => {
  const plan = withPdfEngine("linux", () =>
    buildPdfGenerationPlan(
      buildInput(),
      "/ZONE21_DEV/90_GED_PHASE_1/NOTE-Z21/MEDIA/02_PDF/NOTE-Z21-MEDIA-BRIEF-CAMPAGNE-v1.0.pdf",
    )
  );

  assert.equal(plan.execute, false);
  assert.ok(Boolean(plan.commandPreview));
  await getLibreOfficeBinaryPath();
});
