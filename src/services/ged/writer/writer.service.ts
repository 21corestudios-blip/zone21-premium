import { buildDryRunWriterResult } from "./writer.dryrun";
import type { WriterInput } from "./writer.types";
import {
  getWriterRulesSummary,
  listWriterAllowedObjectsByDomain,
  validateWriterInput,
} from "./writer.validator";

export function runWriterDryRun(input: WriterInput) {
  const validation = validateWriterInput(input);

  return buildDryRunWriterResult(input, {
    status: validation.status,
    controls: validation.controls,
    errors: validation.errors,
    theoreticalPaths: validation.theoreticalPaths,
  });
}

export function getWriterDryRunConfiguration() {
  return {
    enabled: false,
    mode: "dry-run" as const,
    message: "Writer en mode simulation — aucune écriture réelle autorisée",
    rules: getWriterRulesSummary(),
    allowedObjectsByDomain: listWriterAllowedObjectsByDomain(),
  };
}
