import type {
  FileAvailability,
  GovernanceSyncStatus,
  RdmRecord,
} from "./rdm-types";

export function getSourceNormativeLabel(record: RdmRecord) {
  return record.isNormativeSource ? "Oui" : "Non";
}

export function getCollaboratorAccessLabel(record: RdmRecord) {
  return record.collaboratorAccess;
}

export function getConfidentialityLabel(record: RdmRecord) {
  return record.confidentiality;
}

export function getGovernanceSyncLabel(record: RdmRecord) {
  return record.governanceSyncStatus;
}

export function getGovernanceSyncClasses(status: GovernanceSyncStatus) {
  switch (status) {
    case "à jour":
      return "border-emerald-500/25 bg-emerald-500/10 text-emerald-200";
    case "à vérifier":
      return "border-amber-500/25 bg-amber-500/10 text-amber-200";
    case "bloqué":
      return "border-rose-500/25 bg-rose-500/10 text-rose-200";
    case "archivé":
      return "border-white/10 bg-white/[0.06] text-white/65";
    default:
      return "border-white/10 bg-white/[0.06] text-white/65";
  }
}

export function getFileAvailabilityLabel(availability: FileAvailability) {
  return `DOCX ${availability.docx} / PDF ${availability.pdf}`;
}
