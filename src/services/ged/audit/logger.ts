export type GedAuditLogLevel = "start" | "step" | "success" | "failure";

export interface GedAuditLogPayload {
  level: GedAuditLogLevel;
  user: string;
  action: string;
  file: string;
  version: string;
  status: string;
  errors: string[];
  scope?: "TEST" | "PHASE_2";
  targetPath?: string;
  controlResult?: "allowed" | "blocked";
}

export interface GedAuditLogEntry extends GedAuditLogPayload {
  timestamp: string;
}

export function createGedAuditLogEntry(
  payload: GedAuditLogPayload,
): GedAuditLogEntry {
  return {
    ...payload,
    timestamp: new Date().toISOString(),
  };
}

export function logGedAuditEvent(payload: GedAuditLogPayload) {
  const entry = createGedAuditLogEntry(payload);

  if (entry.level === "failure" || entry.errors.length > 0) {
    console.warn("[GED_AUDIT]", entry);
  } else {
    console.info("[GED_AUDIT]", entry);
  }

  return entry;
}
