import { permissions, type CollaboratorRole, type Permission } from "./permissions";
import type { DownloadFormat, RdmRecord } from "./rdm-types";

const rolePermissions: Record<CollaboratorRole, Permission[]> = {
  direction: [...permissions],
  admin_documentaire: [...permissions],
  validateur: ["read", "download", "create", "edit", "submit", "validate"],
  editeur: ["read", "download", "create", "edit", "submit"],
  contributeur: ["read", "download", "create", "submit"],
  lecteur: ["read", "download"],
};

export function listPermissionsForRole(role: CollaboratorRole) {
  return rolePermissions[role];
}

export function hasPermission(role: CollaboratorRole, permission: Permission) {
  return rolePermissions[role].includes(permission);
}

export function canAccessRecord(role: CollaboratorRole, record: RdmRecord) {
  return hasPermission(role, "read") && record.allowedRoles.includes(role);
}

export function canDownloadRecord(
  role: CollaboratorRole,
  record: RdmRecord,
  format: DownloadFormat,
) {
  return (
    canAccessRecord(role, record) &&
    hasPermission(role, "download") &&
    record.availableFormats.includes(format)
  );
}
