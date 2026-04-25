import type { CollaboratorRole } from "./permissions";
import type {
  GovernanceAction,
  GovernanceRolePolicy,
  GovernanceWorkflowState,
  GovernancePolicySummary,
} from "./governance-types";

const roleGovernanceActions: Record<CollaboratorRole, GovernanceAction[]> = {
  direction: [
    "read_record",
    "download_official",
    "create_draft",
    "edit_draft",
    "submit_for_review",
    "resume_validation",
    "approve_publication",
    "reject_submission",
    "archive_document",
    "create_next_version",
  ],
  admin_documentaire: [
    "read_record",
    "download_official",
    "create_draft",
    "edit_draft",
    "submit_for_review",
    "resume_validation",
    "approve_publication",
    "reject_submission",
    "archive_document",
    "create_next_version",
  ],
  validateur: [
    "read_record",
    "download_official",
    "resume_validation",
    "approve_publication",
    "reject_submission",
  ],
  editeur: [
    "read_record",
    "download_official",
    "create_draft",
    "edit_draft",
    "submit_for_review",
    "create_next_version",
  ],
  contributeur: [
    "read_record",
    "download_official",
    "create_draft",
    "edit_draft",
    "submit_for_review",
  ],
  lecteur: [
    "read_record",
    "download_official",
  ],
};

const workflowStateLabels: Record<GovernanceWorkflowState, string> = {
  brouillon: "Brouillon",
  soumis: "Soumis",
  en_validation: "En validation",
  validé: "Validé",
  archivé: "Archivé",
  rejeté: "Rejeté",
};

export const governancePolicySummary: GovernancePolicySummary = {
  sourceOfTruth: "ZONE21_DEV",
  recommendedStrategy: "A+E",
  writerMode: "writer-server-unique",
  frontWriteAllowed: false,
  applicationDataRule:
    "La base applicative ne peut contenir que des brouillons, des états transitoires, des métadonnées de workflow et des journaux d'audit.",
  truthChain: [
    "workflow applicatif prépare",
    "service documentaire écrit",
    "ZONE21_DEV fait foi",
    "RDM web relit et expose",
  ],
  antiDoubleSourceGuardrails: [
    "interdiction d'écriture directe par le front",
    "writer serveur unique",
    "journal d'audit obligatoire",
    "verrouillage des documents en cours de validation",
    "relecture physique de ZONE21_DEV après écriture",
    "statut à vérifier ou bloqué en cas de doute",
  ],
};

export function listGovernanceActionsForRole(role: CollaboratorRole) {
  return roleGovernanceActions[role];
}

export function canPerformGovernanceAction(
  role: CollaboratorRole,
  action: GovernanceAction,
) {
  return roleGovernanceActions[role].includes(action);
}

export function listGovernanceRolePolicies(): GovernanceRolePolicy[] {
  return (Object.keys(roleGovernanceActions) as CollaboratorRole[]).map(
    (role) => ({
      role,
      actions: roleGovernanceActions[role],
    }),
  );
}

export function getGovernanceWorkflowStateLabel(
  state: GovernanceWorkflowState,
) {
  return workflowStateLabels[state];
}
