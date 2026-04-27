import test from "node:test";
import assert from "node:assert/strict";
import { mkdirSync, rmSync } from "node:fs";
import os from "node:os";
import path from "node:path";

import { resetActiveBaseStateCache } from "@/lib/rdm-service";
import { assertTargetPathAllowed } from "@/services/ged/writer/writer.guard";

function withAllowedBasePath<T>(callback: () => T | Promise<T>) {
  const previousBase = process.env.Z21_ACTIVE_BASE_PATH;
  const previousPhase2Enabled = process.env.PHASE_2_ENABLED;
  const basePath = path.join(
    os.tmpdir(),
    "zone21_ged_path_security",
    "90_GED_PHASE_1",
    "TEST",
  );

  mkdirSync(basePath, { recursive: true });
  process.env.Z21_ACTIVE_BASE_PATH = basePath;
  delete process.env.PHASE_2_ENABLED;
  resetActiveBaseStateCache();

  const run = async () => callback();

  return run().finally(() => {
    if (previousBase === undefined) {
      delete process.env.Z21_ACTIVE_BASE_PATH;
    } else {
      process.env.Z21_ACTIVE_BASE_PATH = previousBase;
    }
    if (previousPhase2Enabled === undefined) {
      delete process.env.PHASE_2_ENABLED;
    } else {
      process.env.PHASE_2_ENABLED = previousPhase2Enabled;
    }

    resetActiveBaseStateCache();
    rmSync(path.join(os.tmpdir(), "zone21_ged_path_security"), {
      recursive: true,
      force: true,
    });
  });
}

test("chemin valide -> OK", async () => {
  await withAllowedBasePath(async () => {
    const result = assertTargetPathAllowed(
      "/ZONE21_DEV/90_GED_PHASE_1/TEST/NOTE-Z21/MEDIA/01_DOCX/NOTE-Z21-MEDIA-BRIEF-CAMPAGNE-v1.1.docx",
    );

    assert.equal(result.scope, "TEST");
    assert.equal(result.matchedPath, "/90_GED_PHASE_1/TEST/");
  });
});

test("chemin hors perimetre -> refus", async () => {
  await withAllowedBasePath(async () => {
    assert.throws(
      () =>
        assertTargetPathAllowed(
          "/ZONE21_DEV/90_GED_PHASE_3/NOTE-Z21/MEDIA/01_DOCX/NOTE-Z21-MEDIA-BRIEF-CAMPAGNE-v1.1.docx",
        ),
      /scope virtuel TEST/,
    );
  });
});

test("tentative injection chemin -> refus", async () => {
  await withAllowedBasePath(async () => {
    assert.throws(
      () =>
        assertTargetPathAllowed(
          "/ZONE21_DEV/90_GED_PHASE_1/TEST/../../SECRETS/NOTE-Z21-MEDIA-BRIEF-CAMPAGNE-v1.1.docx",
        ),
      /segments '\.\.'/,
    );
  });
});

test("PHASE_2 refusee si flag absent", async () => {
  await withAllowedBasePath(async () => {
    assert.throws(
      () =>
        assertTargetPathAllowed(
          "/ZONE21_DEV/90_GED_PHASE_2/NOTE-Z21/MEDIA/01_DOCX/NOTE-Z21-MEDIA-BRIEF-CAMPAGNE-v1.1.docx",
        ),
      /scope virtuel TEST/,
    );
  });
});

test("PHASE_2 autorisee si flag actif", async () => {
  const previousBase = process.env.Z21_ACTIVE_BASE_PATH;
  const previousPhase2Enabled = process.env.PHASE_2_ENABLED;
  const basePath = path.join(
    os.tmpdir(),
    "zone21_ged_path_security_phase2",
    "90_GED_PHASE_2",
  );

  mkdirSync(basePath, { recursive: true });
  process.env.Z21_ACTIVE_BASE_PATH = basePath;
  process.env.PHASE_2_ENABLED = "true";
  resetActiveBaseStateCache();

  try {
    const result = assertTargetPathAllowed(
      "/ZONE21_DEV/90_GED_PHASE_2/NOTE-Z21/MEDIA/01_DOCX/NOTE-Z21-MEDIA-BRIEF-CAMPAGNE-v1.1.docx",
    );

    assert.equal(result.scope, "PHASE_2");
    assert.equal(result.matchedPath, "/90_GED_PHASE_2/");
  } finally {
    if (previousBase === undefined) {
      delete process.env.Z21_ACTIVE_BASE_PATH;
    } else {
      process.env.Z21_ACTIVE_BASE_PATH = previousBase;
    }
    if (previousPhase2Enabled === undefined) {
      delete process.env.PHASE_2_ENABLED;
    } else {
      process.env.PHASE_2_ENABLED = previousPhase2Enabled;
    }
    resetActiveBaseStateCache();
    rmSync(path.join(os.tmpdir(), "zone21_ged_path_security_phase2"), {
      recursive: true,
      force: true,
    });
  }
});
