export const collaboratorRoles = ["lecteur", "editeur", "admin"] as const;

export type CollaboratorRole = (typeof collaboratorRoles)[number];

export const permissions = [
  "read",
  "download",
  "create",
  "edit",
  "validate",
  "archive",
  "manage_access",
] as const;

export type Permission = (typeof permissions)[number];

export const roleDetails: Record<
  CollaboratorRole,
  {
    label: string;
    summary: string;
    accent: string;
  }
> = {
  lecteur: {
    label: "Lecteur",
    summary: "Consultation du RDM et ouverture des fichiers autorisés.",
    accent: "text-white/80",
  },
  editeur: {
    label: "Éditeur",
    summary: "Création et modification des entrées RDM avec archivage automatique.",
    accent: "text-text",
  },
  admin: {
    label: "Admin",
    summary: "Validation, archivage, droits et résolution des erreurs de synchronisation.",
    accent: "text-accent-soft",
  },
};

export const permissionLabels: Record<Permission, string> = {
  read: "Lecture",
  download: "Téléchargement",
  create: "Création",
  edit: "Édition",
  validate: "Validation",
  archive: "Archivage",
  manage_access: "Gestion des accès",
};
