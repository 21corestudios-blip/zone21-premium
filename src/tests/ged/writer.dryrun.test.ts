import test from "node:test";
import assert from "node:assert/strict";

import { runWriterDryRun } from "@/services/ged/writer/writer.service";
import type { WriterInput } from "@/services/ged/writer/writer.types";

function buildValidInput(): WriterInput {
  return {
    draftId: "GED-TEST-0001",
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
  };
}

test("cas valide : entree conforme -> status ready", () => {
  const result = runWriterDryRun(buildValidInput());

  assert.equal(result.enabled, false);
  assert.equal(result.status, "ready");
  assert.equal(result.errors.length, 0);
});

test("domaine interdit : FIN -> status blocked", () => {
  const result = runWriterDryRun({
    ...buildValidInput(),
    domain: "FIN",
    object: "NOTE-COUT",
    reference: "NOTE-Z21-FIN-NOTE-COUT-v1.0",
    fileName: "NOTE-Z21-FIN-NOTE-COUT-v1.0.docx",
    pathTarget:
      "/ZONE21_DEV/90_GED_PHASE_1/NOTE-Z21/FIN/01_DOCX/NOTE-Z21-FIN-NOTE-COUT-v1.0.docx",
  });

  assert.equal(result.status, "blocked");
  assert.ok(result.errors.some((error) => error.code === "FORBIDDEN_FIN_DOMAIN"));
});

test("objet non autorise : objet inconnu -> blocked", () => {
  const result = runWriterDryRun({
    ...buildValidInput(),
    object: "OBJET-INCONNU",
    reference: "NOTE-Z21-MEDIA-OBJET-INCONNU-v1.0",
    fileName: "NOTE-Z21-MEDIA-OBJET-INCONNU-v1.0.docx",
    pathTarget:
      "/ZONE21_DEV/90_GED_PHASE_1/NOTE-Z21/MEDIA/01_DOCX/NOTE-Z21-MEDIA-OBJET-INCONNU-v1.0.docx",
  });

  assert.equal(result.status, "blocked");
  assert.ok(
    result.errors.some((error) => error.code === "ALLOWED_OBJECT_FOR_DOMAIN"),
  );
});

test("version invalide : version absente ou incorrecte -> invalid", () => {
  const result = runWriterDryRun({
    ...buildValidInput(),
    versionTarget: "1.0",
    reference: "NOTE-Z21-MEDIA-BRIEF-CAMPAGNE-1.0",
    fileName: "NOTE-Z21-MEDIA-BRIEF-CAMPAGNE-1.0.docx",
    pathTarget:
      "/ZONE21_DEV/90_GED_PHASE_1/NOTE-Z21/MEDIA/01_DOCX/NOTE-Z21-MEDIA-BRIEF-CAMPAGNE-1.0.docx",
  });

  assert.equal(result.status, "invalid");
  assert.ok(result.errors.some((error) => error.code === "MISSING_VERSION"));
});

test("reference incoherente : mismatch reference / domaine -> invalid", () => {
  const result = runWriterDryRun({
    ...buildValidInput(),
    domain: "OPS",
    reference: "NOTE-Z21-MEDIA-BRIEF-CAMPAGNE-v1.0",
    fileName: "NOTE-Z21-MEDIA-BRIEF-CAMPAGNE-v1.0.docx",
    pathTarget:
      "/ZONE21_DEV/90_GED_PHASE_1/NOTE-Z21/OPS/01_DOCX/NOTE-Z21-MEDIA-BRIEF-CAMPAGNE-v1.0.docx",
  });

  assert.equal(result.status, "invalid");
  assert.ok(result.errors.some((error) => error.code === "INVALID_REFERENCE"));
});

test("conflit simule : simulateVersionConflict = true -> blocked", () => {
  const result = runWriterDryRun({
    ...buildValidInput(),
    documentType: "PROC-Z21",
    domain: "OPS",
    object: "PLAN-ACTION",
    reference: "PROC-Z21-OPS-PLAN-ACTION-v1.0",
    fileName: "PROC-Z21-OPS-PLAN-ACTION-v1.0.docx",
    pathTarget:
      "/ZONE21_DEV/90_GED_PHASE_1/PROC-Z21/OPS/01_DOCX/PROC-Z21-OPS-PLAN-ACTION-v1.0.docx",
    templateKey: "proc-z21-standard-v1",
    simulateVersionConflict: true,
  });

  assert.equal(result.status, "blocked");
  assert.ok(
    result.errors.some((error) => error.code === "SIMULATED_VERSION_CONFLICT"),
  );
});
