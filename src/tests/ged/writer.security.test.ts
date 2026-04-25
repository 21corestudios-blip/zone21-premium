import test from "node:test";
import assert from "node:assert/strict";
import { readFileSync } from "node:fs";

import * as writerRoute from "@/app/api/ged/writer/dry-run/route";
import { assertWriterLocked } from "@/services/ged/writer/writer.guard";
import * as writerService from "@/services/ged/writer/writer.service";
import {
  WRITER_ENABLED,
  getWriterDryRunConfiguration,
} from "@/services/ged/writer/writer.service";

test("writer toujours disabled", () => {
  assert.equal(WRITER_ENABLED, false);
  assert.equal(assertWriterLocked(WRITER_ENABLED), true);
  assert.equal(getWriterDryRunConfiguration().enabled, false);
  assert.equal(getWriterDryRunConfiguration().writerLocked, true);
});

test("aucune fonction d'ecriture exposee", () => {
  const serviceExports = Object.keys(writerService).sort();

  assert.deepEqual(serviceExports, [
    "WRITER_ENABLED",
    "getWriterDryRunConfiguration",
    "runWriterDryRun",
  ]);
});

test("aucune mutation filesystem possible dans la couche writer", () => {
  const filesToCheck = [
    "/Users/gregloupiac/zone21-premium/src/services/ged/writer/writer.service.ts",
    "/Users/gregloupiac/zone21-premium/src/services/ged/writer/writer.guard.ts",
    "/Users/gregloupiac/zone21-premium/src/services/ged/writer/writer.validator.ts",
    "/Users/gregloupiac/zone21-premium/src/services/ged/writer/writer.dryrun.ts",
  ];

  const forbiddenPatterns = [
    "node:fs",
    "node:fs/promises",
    "writeFile",
    "appendFile",
    "mkdir",
    "rename",
    "rm(",
    "unlink",
    "copyFile",
  ];

  for (const filePath of filesToCheck) {
    const content = readFileSync(filePath, "utf-8");

    for (const pattern of forbiddenPatterns) {
      assert.equal(
        content.includes(pattern),
        false,
        `Pattern ${pattern} found in ${filePath}`,
      );
    }
  }
});

test("aucune route autre que GET disponible", () => {
  assert.equal(typeof writerRoute.GET, "function");
  assert.equal("POST" in writerRoute, false);
  assert.equal("PUT" in writerRoute, false);
  assert.equal("PATCH" in writerRoute, false);
  assert.equal("DELETE" in writerRoute, false);
});
