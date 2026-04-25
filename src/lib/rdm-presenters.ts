import type { RdmRecord } from "./rdm-types";

export function getSourceNormativeLabel(record: RdmRecord) {
  return record.normativeSources.length > 0 ? "Oui" : "Non";
}

export function getCollaboratorAccessLabel(record: RdmRecord) {
  const normalized = record.collaboratorAccess.toLowerCase();

  if (normalized.includes("non")) {
    return "Non";
  }

  if (normalized.includes("restreint") || record.allowedRoles.length < 6) {
    return "Restreint";
  }

  return "Oui";
}

export function getConfidentialityLabel(record: RdmRecord) {
  const normalized = record.confidentiality.toLowerCase();

  if (normalized.includes("admin")) {
    return "Admin";
  }

  if (normalized.includes("public")) {
    return "Public interne";
  }

  return "Restreint";
}
