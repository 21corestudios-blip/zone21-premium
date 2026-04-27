import test from "node:test";
import assert from "node:assert/strict";
import { mkdirSync, rmSync } from "node:fs";
import os from "node:os";
import path from "node:path";

import { resetActiveBaseStateCache } from "@/lib/rdm-service";
import {
  assertWriterScopeAllowed,
  getWriterScopeInfo,
} from "@/services/ged/writer/writer.guard";

function withScopedBasePath<T>(
  relativePath: string,
  callback: (basePath: string) => T | Promise<T>,
) {
  const previousBase = process.env.Z21_ACTIVE_BASE_PATH;
  const basePath = path.join(os.tmpdir(), "zone21_ged_scope", relativePath);

  mkdirSync(basePath, { recursive: true });
  process.env.Z21_ACTIVE_BASE_PATH = basePath;
  resetActiveBaseStateCache();

  const run = async () => callback(basePath);

  return run().finally(() => {
    if (previousBase === undefined) {
      delete process.env.Z21_ACTIVE_BASE_PATH;
    } else {
      process.env.Z21_ACTIVE_BASE_PATH = previousBase;
    }
    resetActiveBaseStateCache();

    rmSync(path.join(os.tmpdir(), "zone21_ged_scope"), {
      recursive: true,
      force: true,
    });
  });
}

test("ecriture autorisee sur TEST", async () => {
  await withScopedBasePath("90_GED_PHASE_1/TEST", async (basePath) => {
    const scopeInfo = getWriterScopeInfo(basePath);

    assert.equal(scopeInfo?.label, "TEST");
    assert.equal(assertWriterScopeAllowed().label, "TEST");
  });
});

test("ecriture autorisee sur PHASE_2", async () => {
  await withScopedBasePath("90_GED_PHASE_2", async (basePath) => {
    const scopeInfo = getWriterScopeInfo(basePath);

    assert.equal(scopeInfo?.label, "PHASE_2");
    assert.equal(assertWriterScopeAllowed().label, "PHASE_2");
  });
});

test("ecriture refusee hors perimetre", async () => {
  await withScopedBasePath("90_GED_PHASE_3", async () => {
    assert.equal(getWriterScopeInfo(), null);
    assert.throws(
      () => assertWriterScopeAllowed(),
      /périmètre autorisé/,
    );
  });
});
