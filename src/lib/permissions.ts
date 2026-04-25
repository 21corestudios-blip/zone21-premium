export const collaboratorRoles = [
  "direction",
  "admin_documentaire",
  "validateur",
  "editeur",
  "contributeur",
  "lecteur",
] as const;

export type CollaboratorRole = (typeof collaboratorRoles)[number];

export const permissions = [
  "read",
  "download",
  "create",
  "edit",
  "submit",
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
  direction: {
    label: "Direction",
    summary: "Vue stratégique complète et arbitrages sensibles.",
    accent: "text-[#D5C1A1]",
  },
  admin_documentaire: {
    label: "Admin documentaire",
    summary: "Pilotage du registre, gouvernance documentaire et accès.",
    accent: "text-[#D5C1A1]",
  },
  validateur: {
    label: "Validateur",
    summary: "Contrôle, validation et suivi des documents clés.",
    accent: "text-[#EAE8E3]",
  },
  editeur: {
    label: "Éditeur",
    summary: "Production, mise à jour et préparation des contenus.",
    accent: "text-[#EAE8E3]",
  },
  contributeur: {
    label: "Contributeur",
    summary: "Contribution encadrée et soumission des évolutions.",
    accent: "text-[#EAE8E3]",
  },
  lecteur: {
    label: "Lecteur",
    summary: "Consultation et téléchargement sur périmètre autorisé.",
    accent: "text-white/80",
  },
};

export const permissionLabels: Record<Permission, string> = {
  read: "Lecture",
  download: "Téléchargement",
  create: "Création",
  edit: "Édition",
  submit: "Soumission",
  validate: "Validation",
  archive: "Archivage",
  manage_access: "Gestion des accès",
};
