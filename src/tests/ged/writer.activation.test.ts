import test from "node:test";
import assert from "node:assert/strict";
import { mkdirSync, rmSync } from "node:fs";
import os from "node:os";
import path from "node:path";

import { resetActiveBaseStateCache } from "@/lib/rdm-service";
import { getWriterRuntimeConfig } from "@/config/env.config";
import {
  executeRealWriter,
  buildRealWriterInput,
  runRealWriter,
} from "@/services/ged/writer/real/writer.real.service";
import {
  assertWriterActivationAllowed,
  isWriterActivationAllowed,
} from "@/services/ged/writer/writer.guard";
import type { WriterInput } from "@/services/ged/writer/writer.types";

function withWriterEnv<T>(
  env: string,
  enabled: string | undefined,
  confirmed: string | undefined,
  basePath: string | undefined,
  callback: () => T | Promise<T>,
) {
  const previousEnv = process.env.NODE_ENV;
  const previousWriterEnabled = process.env.WRITER_ENABLED;
  const previousConfirmed = process.env.WRITER_REAL_EXECUTION_CONFIRMED;
  const previousBase = process.env.Z21_ACTIVE_BASE_PATH;

  process.env.NODE_ENV = env;

  if (enabled === undefined) {
    delete process.env.WRITER_ENABLED;
  } else {
    process.env.WRITER_ENABLED = enabled;
  }
  if (confirmed === undefined) {
    delete process.env.WRITER_REAL_EXECUTION_CONFIRMED;
  } else {
    process.env.WRITER_REAL_EXECUTION_CONFIRMED = confirmed;
  }
  if (basePath === undefined) {
    delete process.env.Z21_ACTIVE_BASE_PATH;
  } else {
    process.env.Z21_ACTIVE_BASE_PATH = basePath;
  }
  resetActiveBaseStateCache();

  const run = async () => callback();

  return run().finally(() => {
    if (previousEnv === undefined) {
      delete process.env.NODE_ENV;
    } else {
      process.env.NODE_ENV = previousEnv;
    }

    if (previousWriterEnabled === undefined) {
      delete process.env.WRITER_ENABLED;
    } else {
      process.env.WRITER_ENABLED = previousWriterEnabled;
    }
    if (previousConfirmed === undefined) {
      delete process.env.WRITER_REAL_EXECUTION_CONFIRMED;
    } else {
      process.env.WRITER_REAL_EXECUTION_CONFIRMED = previousConfirmed;
    }
    if (previousBase === undefined) {
      delete process.env.Z21_ACTIVE_BASE_PATH;
    } else {
      process.env.Z21_ACTIVE_BASE_PATH = previousBase;
    }
    resetActiveBaseStateCache();
  });
}

function createAllowedTestScope() {
  const basePath = path.join(
    os.tmpdir(),
    "zone21_ged_activation_scope",
    "90_GED_PHASE_1",
    "TEST",
  );
  mkdirSync(basePath, { recursive: true });
  return basePath;
}

function buildValidInput(): WriterInput {
  return {
    draftId: "GED-ACTIVATION-0001",
    documentType: "NOTE-Z21",
    domain: "MEDIA",
    object: "BRIEF-CAMPAGNE",
    reference: "NOTE-Z21-MEDIA-BRIEF-CAMPAGNE-v1.3",
    title: "Brief activation staging",
    fileName: "NOTE-Z21-MEDIA-BRIEF-CAMPAGNE-v1.3.docx",
    versionTarget: "v1.3",
    pathTarget:
      "/ZONE21_DEV/90_GED_PHASE_1/NOTE-Z21/MEDIA/01_DOCX/NOTE-Z21-MEDIA-BRIEF-CAMPAGNE-v1.3.docx",
    validatedBy: "Admin documentaire",
    validationDecision: "validé",
    templateKey: "note-z21-standard-v1",
    contentSummary: "Cas de validation activation staging.",
  };
}

test("activation refusee en DEV", async () => {
  await withWriterEnv("development", "true", "true", undefined, async () => {
    assert.equal(isWriterActivationAllowed(getWriterRuntimeConfig()), false);
    assert.throws(
      () => assertWriterActivationAllowed(getWriterRuntimeConfig()),
      /staging/,
    );

    const plan = runRealWriter(buildRealWriterInput(buildValidInput()));
    assert.equal("mode" in plan, true);
    assert.equal(plan.mode, "real-plan");
  });
});

test("activation refusee sans flag", async () => {
  await withWriterEnv("staging", undefined, "true", undefined, async () => {
    assert.equal(isWriterActivationAllowed(getWriterRuntimeConfig()), false);
    assert.throws(
      () => assertWriterActivationAllowed(getWriterRuntimeConfig()),
      /WRITER_ENABLED=true/,
    );
  });
});

test("activation autorisee en STAGING", async () => {
  await withWriterEnv("staging", "true", "true", undefined, async () => {
    assert.equal(isWriterActivationAllowed(getWriterRuntimeConfig()), true);
    assert.equal(assertWriterActivationAllowed(getWriterRuntimeConfig()), true);
  });
});

test("ecriture bloquee si erreur", async () => {
  const scopeBasePath = createAllowedTestScope();

  try {
    await withWriterEnv("staging", "true", "true", scopeBasePath, async () => {
      const invalidInput = buildRealWriterInput({
        ...buildValidInput(),
        versionTarget: "invalid",
      reference: "NOTE-Z21-MEDIA-BRIEF-CAMPAGNE-invalid",
      fileName: "NOTE-Z21-MEDIA-BRIEF-CAMPAGNE-invalid.docx",
      pathTarget:
        "/ZONE21_DEV/90_GED_PHASE_1/NOTE-Z21/MEDIA/01_DOCX/NOTE-Z21-MEDIA-BRIEF-CAMPAGNE-invalid.docx",
    });

    await assert.rejects(
      async () => {
        await executeRealWriter(invalidInput);
      },
      /validation GED/,
    );
    });
  } finally {
    rmSync(path.join(os.tmpdir(), "zone21_ged_activation_scope"), {
      recursive: true,
      force: true,
    });
  }
});

test("activation refusee sans confirmation explicite", async () => {
  await withWriterEnv("staging", "true", undefined, undefined, async () => {
    assert.equal(isWriterActivationAllowed(getWriterRuntimeConfig()), false);
    assert.throws(
      () => assertWriterActivationAllowed(getWriterRuntimeConfig()),
      /WRITER_REAL_EXECUTION_CONFIRMED=true/,
    );
  });
});
