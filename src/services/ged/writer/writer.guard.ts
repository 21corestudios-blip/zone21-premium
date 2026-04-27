import { gedConfig } from "@/config/ged.config";
import {
  getWriterRuntimeConfig,
  type WriterRuntimeConfig,
} from "@/config/env.config";
import { getActiveBaseState } from "@/lib/rdm-service";

export type WriterScopeLabel = "TEST" | "PHASE_2";

export interface WriterScopeInfo {
  label: WriterScopeLabel;
  matchedPath: string;
  basePath: string;
}

function normalizeScopePath(value: string) {
  const normalized = value.replace(/\\/g, "/").trim().replace(/\/+/g, "/");

  if (!normalized) {
    return null;
  }

  const withLeadingSlash = normalized.startsWith("/")
    ? normalized
    : `/${normalized}`;

  return withLeadingSlash.endsWith("/")
    ? withLeadingSlash
    : `${withLeadingSlash}/`;
}

function toScopeLabel(allowedPath: string): WriterScopeLabel {
  return allowedPath.includes("/90_GED_PHASE_1/TEST/") ? "TEST" : "PHASE_2";
}

export function getWriterScopeInfo(
  basePath = getActiveBaseState().basePath,
  allowedWritePaths = gedConfig.writer.allowedWritePaths,
): WriterScopeInfo | null {
  if (!basePath) {
    return null;
  }

  const normalizedBasePath = normalizeScopePath(basePath);

  if (!normalizedBasePath) {
    return null;
  }

  for (const allowedPath of allowedWritePaths) {
    const normalizedAllowedPath = normalizeScopePath(allowedPath);

    if (!normalizedAllowedPath) {
      continue;
    }

    if (normalizedBasePath.endsWith(normalizedAllowedPath)) {
      return {
        label: toScopeLabel(normalizedAllowedPath),
        matchedPath: normalizedAllowedPath,
        basePath,
      };
    }
  }

  return null;
}

export function assertWriterScopeAllowed(
  allowedWritePaths = gedConfig.writer.allowedWritePaths,
) {
  const activeBaseState = getActiveBaseState();

  if (!activeBaseState.basePath) {
    throw new Error(
      activeBaseState.error ??
        "Activation writer refusée : Z21_ACTIVE_BASE_PATH est obligatoire pour contrôler le périmètre d'écriture.",
    );
  }

  const scopeInfo = getWriterScopeInfo(activeBaseState.basePath, allowedWritePaths);

  if (!scopeInfo) {
    throw new Error(
      `Activation writer refusée : Z21_ACTIVE_BASE_PATH doit rester strictement dans un périmètre autorisé (${allowedWritePaths.join(", ")}).`,
    );
  }

  return scopeInfo;
}

export function assertWriterLocked(writerEnabled: boolean) {
  if (writerEnabled !== false) {
    throw new Error(
      "Writer GED verrouillé: toute activation du writer réel exige une modification explicite et revue.",
    );
  }

  return true as const;
}

export function isWriterActivationAllowed(
  runtimeConfig: WriterRuntimeConfig = getWriterRuntimeConfig(),
) {
  return runtimeConfig.writerEnabled && runtimeConfig.writerEnvAllowed &&
    runtimeConfig.env !== "production" &&
    runtimeConfig.writerRealExecutionConfirmed;
}

export function assertWriterActivationAllowed(
  runtimeConfig: WriterRuntimeConfig = getWriterRuntimeConfig(),
) {
  if (!runtimeConfig.writerEnabled) {
    throw new Error(
      "Activation writer refusée : WRITER_ENABLED=true est obligatoire.",
    );
  }

  if (runtimeConfig.env === "production") {
    throw new Error(
      "Activation writer refusée : aucune écriture réelle n'est autorisée en production.",
    );
  }

  if (!runtimeConfig.writerEnvAllowed) {
    throw new Error(
      "Activation writer refusée : l'environnement doit être strictement staging.",
    );
  }

  if (!runtimeConfig.writerRealExecutionConfirmed) {
    throw new Error(
      "Activation writer refusée : WRITER_REAL_EXECUTION_CONFIRMED=true est obligatoire.",
    );
  }

  return true as const;
}
