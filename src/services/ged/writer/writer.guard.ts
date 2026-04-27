import { gedConfig } from "@/config/ged.config";
import {
  getWriterRuntimeConfig,
  type WriterRuntimeConfig,
} from "@/config/env.config";
import { getActiveBaseState, resolveSystemPath } from "@/lib/rdm-service";
import { logGedAuditEvent } from "@/services/ged/audit/logger";
import path from "node:path";

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

function normalizeVirtualTargetPath(value: string) {
  const normalized = value.replace(/\\/g, "/").trim();

  if (!normalized || normalized.includes("\0")) {
    return null;
  }

  const withLeadingSlash = normalized.startsWith("/")
    ? normalized
    : `/${normalized}`;

  return withLeadingSlash.replace(/\/+/g, "/");
}

function toScopeLabel(allowedPath: string): WriterScopeLabel {
  return allowedPath.includes("/90_GED_PHASE_1/TEST/") ? "TEST" : "PHASE_2";
}

function getVirtualPrefixesForScope(scope: WriterScopeLabel) {
  return scope === "TEST"
    ? ["/90_GED_PHASE_1/TEST/", "/90_GED_PHASE_1/"]
    : ["/90_GED_PHASE_2/"];
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

export function assertTargetPathAllowed(
  targetPath: string,
  allowedWritePaths = gedConfig.writer.allowedWritePaths,
) {
  const normalizedTargetPath = normalizeVirtualTargetPath(targetPath);

  if (!normalizedTargetPath) {
    logGedAuditEvent({
      level: "failure",
      user: "writer-guard",
      action: "writer_target_path_check",
      file: "n/a",
      version: "n/a",
      status: "blocked",
      errors: [
        "Chemin cible invalide : le chemin est vide ou contient un caractère interdit.",
      ],
      targetPath,
      controlResult: "blocked",
    });
    throw new Error(
      "Chemin cible interdit : le chemin est vide ou contient un caractère interdit.",
    );
  }

  if (!normalizedTargetPath.startsWith("/ZONE21_DEV/")) {
    logGedAuditEvent({
      level: "failure",
      user: "writer-guard",
      action: "writer_target_path_check",
      file: "n/a",
      version: "n/a",
      status: "blocked",
      errors: [
        "Chemin cible interdit : l'écriture réelle doit viser un chemin logique sous /ZONE21_DEV/.",
      ],
      targetPath: normalizedTargetPath,
      controlResult: "blocked",
    });
    throw new Error(
      "Chemin cible interdit : l'écriture réelle doit viser un chemin logique sous /ZONE21_DEV/.",
    );
  }

  if (normalizedTargetPath.includes("/../") || normalizedTargetPath.endsWith("/..")) {
    logGedAuditEvent({
      level: "failure",
      user: "writer-guard",
      action: "writer_target_path_check",
      file: "n/a",
      version: "n/a",
      status: "blocked",
      errors: [
        "Chemin cible interdit : la présence de segments '..' est refusée.",
      ],
      targetPath: normalizedTargetPath,
      controlResult: "blocked",
    });
    throw new Error(
      "Chemin cible interdit : la présence de segments '..' est refusée.",
    );
  }

  const scopeInfo = assertWriterScopeAllowed(allowedWritePaths);
  const resolvedTarget = resolveSystemPath(normalizedTargetPath);
  const relativeTargetPath = `/${
    normalizedTargetPath.replace(/^\/?ZONE21_DEV\/?/, "")
  }`;
  const normalizedRelativeTargetPath = normalizeScopePath(relativeTargetPath);

  if (!normalizedRelativeTargetPath) {
    logGedAuditEvent({
      level: "failure",
      user: "writer-guard",
      action: "writer_target_path_check",
      file: "n/a",
      version: "n/a",
      status: "blocked",
      errors: [
        "Chemin cible interdit : le chemin relatif ne peut pas être normalisé.",
      ],
      targetPath: normalizedTargetPath,
      controlResult: "blocked",
      scope: scopeInfo.label,
    });
    throw new Error(
      "Chemin cible interdit : le chemin relatif ne peut pas être normalisé.",
    );
  }

  const allowedVirtualPrefixes = getVirtualPrefixesForScope(scopeInfo.label)
    .map((candidate) => normalizeScopePath(candidate))
    .filter((candidate): candidate is string => Boolean(candidate));

  if (
    !allowedVirtualPrefixes.some((prefix) =>
      normalizedRelativeTargetPath.startsWith(prefix)
    )
  ) {
    logGedAuditEvent({
      level: "failure",
      user: "writer-guard",
      action: "writer_target_path_check",
      file: "n/a",
      version: "n/a",
      status: "blocked",
      errors: [
        `Chemin cible interdit : ${normalizedRelativeTargetPath} ne correspond pas au scope virtuel ${scopeInfo.label}.`,
      ],
      targetPath: normalizedTargetPath,
      controlResult: "blocked",
      scope: scopeInfo.label,
    });
    throw new Error(
      `Chemin cible interdit : ${normalizedRelativeTargetPath} ne correspond pas au scope virtuel ${scopeInfo.label}.`,
    );
  }

  if (!resolvedTarget.systemPath) {
    logGedAuditEvent({
      level: "failure",
      user: "writer-guard",
      action: "writer_target_path_check",
      file: "n/a",
      version: "n/a",
      status: "blocked",
      errors: [
        resolvedTarget.error ??
          "Chemin cible interdit : impossible de résoudre le chemin physique cible.",
      ],
      targetPath: normalizedTargetPath,
      controlResult: "blocked",
    });
    throw new Error(
      resolvedTarget.error ??
        "Chemin cible interdit : impossible de résoudre le chemin physique cible.",
    );
  }

  const resolvedBasePath = path.resolve(scopeInfo.basePath);
  const resolvedSystemPath = path.resolve(resolvedTarget.systemPath);
  const basePrefix = `${resolvedBasePath}${path.sep}`;

  if (
    resolvedSystemPath !== resolvedBasePath &&
    !resolvedSystemPath.startsWith(basePrefix)
  ) {
    logGedAuditEvent({
      level: "failure",
      user: "writer-guard",
      action: "writer_target_path_check",
      file: "n/a",
      version: "n/a",
      status: "blocked",
      errors: [
        `Chemin cible interdit : ${resolvedSystemPath} sort du périmètre physique autorisé.`,
      ],
      targetPath: normalizedTargetPath,
      controlResult: "blocked",
      scope: scopeInfo.label,
    });
    throw new Error(
      `Chemin cible interdit : ${resolvedSystemPath} sort du périmètre physique autorisé.`,
    );
  }

  logGedAuditEvent({
    level: "step",
    user: "writer-guard",
    action: "writer_target_path_check",
    file: "n/a",
    version: "n/a",
    status: "allowed",
    errors: [],
    scope: scopeInfo.label,
    targetPath: normalizedTargetPath,
    controlResult: "allowed",
  });

  return {
    normalizedTargetPath,
    resolvedSystemPath,
    matchedPath: scopeInfo.matchedPath,
    scope: scopeInfo.label,
  };
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
