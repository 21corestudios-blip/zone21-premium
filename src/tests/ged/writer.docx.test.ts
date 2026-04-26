import test from "node:test";
import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import path from "node:path";

import {
  buildDocxGenerationPlan,
  renderDocxTemplateInMemory,
} from "@/services/ged/writer/real/writer.real.docx";
import type { RealWriterInput } from "@/services/ged/writer/real/writer.real.types";

function buildInput(): RealWriterInput {
  return {
    draftId: "GED-DOCX-TEST-0001",
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

test("chargement template", () => {
  const plan = buildDocxGenerationPlan(
    buildInput(),
    "/ZONE21_DEV/90_GED_PHASE_1/NOTE-Z21/MEDIA/01_DOCX/NOTE-Z21-MEDIA-BRIEF-CAMPAGNE-v1.0.docx",
  );

  assert.equal(plan.templateLoaded, true);
  assert.equal(plan.inMemoryOnly, true);
});

test("injection correcte", () => {
  const plan = buildDocxGenerationPlan(
    buildInput(),
    "/ZONE21_DEV/90_GED_PHASE_1/NOTE-Z21/MEDIA/01_DOCX/NOTE-Z21-MEDIA-BRIEF-CAMPAGNE-v1.0.docx",
  );

  assert.equal(plan.inputs.reference, "NOTE-Z21-MEDIA-BRIEF-CAMPAGNE-v1.0");
  assert.equal(plan.inputs.title, "Brief campagne media");
  assert.equal(plan.inputs.version, "v1.0");
});

test("buffer genere en memoire", () => {
  const buffer = renderDocxTemplateInMemory(buildInput());

  assert.ok(Buffer.isBuffer(buffer));
  assert.ok(buffer.byteLength > 0);
});

test("aucune ecriture disque", () => {
  const content = readFileSync(
    path.join(
      process.cwd(),
      "src/services/ged/writer/real/writer.real.docx.ts",
    ),
    "utf-8",
  );

  const forbiddenPatterns = [
    "writeFile",
    "writeFileSync",
    "appendFile",
    "appendFileSync",
    "mkdir",
  ];

  for (const pattern of forbiddenPatterns) {
    assert.equal(
      content.includes(pattern),
      false,
      `Pattern ${pattern} found in writer.real.docx.ts`,
    );
  }
});
