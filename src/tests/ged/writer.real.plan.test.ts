import test from "node:test";
import assert from "node:assert/strict";

import {
  buildRealWriterInput,
  buildRealWriterPlan,
} from "@/services/ged/writer/real/writer.real.service";
import type { WriterInput } from "@/services/ged/writer/writer.types";

function buildValidInput(): WriterInput {
  return {
    draftId: "GED-REAL-PLAN-0001",
    documentType: "NOTE-Z21",
    domain: "MEDIA",
    object: "BRIEF-CAMPAGNE",
    reference: "NOTE-Z21-MEDIA-BRIEF-CAMPAGNE-v1.1",
    title: "Brief campagne media",
    fileName: "NOTE-Z21-MEDIA-BRIEF-CAMPAGNE-v1.1.docx",
    versionTarget: "v1.1",
    pathTarget:
      "/ZONE21_DEV/90_GED_PHASE_1/NOTE-Z21/MEDIA/01_DOCX/NOTE-Z21-MEDIA-BRIEF-CAMPAGNE-v1.1.docx",
    validatedBy: "Admin documentaire",
    validationDecision: "validé",
    templateKey: "note-z21-standard-v1",
    contentSummary: "Simulation de brief campagne conforme.",
  };
}

test("generation correcte du plan", () => {
  const realInput = buildRealWriterInput(buildValidInput(), {
    sourceReference: "NOTE-Z21-MEDIA-BRIEF-CAMPAGNE-v1.0",
    sourceVersion: "v1.0",
    archiveRequired: true,
  });
  const plan = buildRealWriterPlan(realInput);

  assert.equal(plan.mode, "real-plan");
  assert.equal(plan.enabled, false);
  assert.equal(plan.executionAllowed, false);
  assert.equal(plan.status, "ready");
  assert.equal(plan.generationPlan.docx.format, "docx");
  assert.equal(plan.generationPlan.pdf.format, "pdf");
  assert.equal(plan.fileWritePlan.length, 2);
});

test("chemins conformes au cadrage GED phase 1", () => {
  const plan = buildRealWriterPlan(buildRealWriterInput(buildValidInput()));

  assert.equal(
    plan.targetPath,
    "/ZONE21_DEV/90_GED_PHASE_1/NOTE-Z21/MEDIA/01_DOCX/NOTE-Z21-MEDIA-BRIEF-CAMPAGNE-v1.1.docx",
  );
  assert.equal(
    plan.generationPlan.pdf.targetPath,
    "/ZONE21_DEV/90_GED_PHASE_1/NOTE-Z21/MEDIA/02_PDF/NOTE-Z21-MEDIA-BRIEF-CAMPAGNE-v1.1.pdf",
  );
});

test("aucune execution reelle", () => {
  const realInput = buildRealWriterInput(buildValidInput(), {
    sourceReference: "NOTE-Z21-MEDIA-BRIEF-CAMPAGNE-v1.0",
    archiveRequired: true,
  });
  const plan = buildRealWriterPlan(realInput);

  assert.equal(plan.executionAllowed, false);
  assert.equal(plan.generationPlan.docx.execute, false);
  assert.equal(plan.generationPlan.pdf.execute, false);
  assert.equal(plan.archivePlan.execute, false);
  assert.ok(plan.fileWritePlan.every((item) => item.execute === false));
  assert.equal(plan.signalPlan.execute, false);
});

test("coherence archive + cible", () => {
  const realInput = buildRealWriterInput(buildValidInput(), {
    sourceReference: "NOTE-Z21-MEDIA-BRIEF-CAMPAGNE-v1.0",
    sourceVersion: "v1.0",
    archiveRequired: true,
  });
  const plan = buildRealWriterPlan(realInput);

  assert.equal(
    plan.archivePlan.archiveDocxPath,
    "/ZONE21_DEV/90_GED_PHASE_1/NOTE-Z21/MEDIA/99_ARCHIVES/01_DOCX/NOTE-Z21-MEDIA-BRIEF-CAMPAGNE-v1.0.docx",
  );
  assert.equal(
    plan.archivePlan.archivePdfPath,
    "/ZONE21_DEV/90_GED_PHASE_1/NOTE-Z21/MEDIA/99_ARCHIVES/02_PDF/NOTE-Z21-MEDIA-BRIEF-CAMPAGNE-v1.0.pdf",
  );
  assert.equal(
    plan.archivePlan.sourceDocxPath,
    "/ZONE21_DEV/90_GED_PHASE_1/NOTE-Z21/MEDIA/01_DOCX/NOTE-Z21-MEDIA-BRIEF-CAMPAGNE-v1.0.docx",
  );
  assert.equal(
    plan.archivePlan.sourcePdfPath,
    "/ZONE21_DEV/90_GED_PHASE_1/NOTE-Z21/MEDIA/02_PDF/NOTE-Z21-MEDIA-BRIEF-CAMPAGNE-v1.0.pdf",
  );
});
