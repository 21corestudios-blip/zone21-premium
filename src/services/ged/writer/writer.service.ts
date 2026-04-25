import { buildDryRunWriterResult } from "./writer.dryrun";
import { assertWriterLocked } from "./writer.guard";
import type { WriterInput } from "./writer.types";
import {
  getWriterRulesSummary,
  listWriterAllowedObjectsByDomain,
  validateWriterInput,
} from "./writer.validator";

export const WRITER_ENABLED = false as const;

export function runWriterDryRun(input: WriterInput) {
  assertWriterLocked(WRITER_ENABLED);
  const validation = validateWriterInput(input);

  return buildDryRunWriterResult(input, {
    status: validation.status,
    controls: validation.controls,
    errors: validation.errors,
    theoreticalPaths: validation.theoreticalPaths,
  });
}

export function getWriterDryRunConfiguration() {
  const writerLocked = assertWriterLocked(WRITER_ENABLED);

  return {
    enabled: WRITER_ENABLED,
    writerLocked,
    mode: "dry-run" as const,
    message: "Writer en mode simulation — aucune écriture réelle autorisée",
    rules: getWriterRulesSummary(),
    allowedObjectsByDomain: listWriterAllowedObjectsByDomain(),
  };
}
