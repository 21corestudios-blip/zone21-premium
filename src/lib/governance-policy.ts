import type { CollaboratorRole } from "./permissions";
import type {
  GovernanceAction,
  GovernanceRolePolicy,
  GovernanceWorkflowState,
  GovernancePolicySummary,
} from "./governance-types";
import type { RdmSourceOfTruth } from "./rdm-types";
import { RDM_ACTIVE_SOURCE_OF_TRUTH } from "./rdm-service";

type RdmGovernancePolicySummary = Omit<
  GovernancePolicySummary,
  "sourceOfTruth"
> & {
  sourceOfTruth: RdmSourceOfTruth;
  historicalAuditSources: Array<Exclude<RdmSourceOfTruth, "ZONE 21 HOLDING">>;
};

const roleGovernanceActions: Record<CollaboratorRole, GovernanceAction[]> = {
  admin: [
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
  editeur: [
    "read_record",
    "download_official",
    "create_draft",
    "edit_draft",
    "submit_for_review",
    "create_next_version",
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

export const governancePolicySummary: RdmGovernancePolicySummary = {
  sourceOfTruth: RDM_ACTIVE_SOURCE_OF_TRUTH,
  historicalAuditSources: [
    "ZONE21",
    "ZONE21_DEV",
    "ZONE 21_PROJET_PAUSED",
  ],
  recommendedStrategy: "A+E",
  writerMode: "rdm-drive-store",
  frontWriteAllowed: true,
  applicationDataRule:
    "La base applicative ne conserve pas de source autonome : elle lit et écrit le registre JSON officiel stocké dans ZONE 21 HOLDING.",
  truthChain: [
    "saisie web authentifiée",
    "archive automatique de la revision Drive precedente",
    "registre JSON officiel ecrit dans ZONE 21 HOLDING",
    "ZONE 21 HOLDING fait foi",
    "RDM web relit et expose",
  ],
  antiDoubleSourceGuardrails: [
    "aucune donnée RDM normative stockée uniquement dans Git",
    "journal d'audit minimal obligatoire",
    "archivage automatique avant modification",
    "relecture physique de ZONE 21 HOLDING après écriture",
    "statut A_VERIFIER ou BLOQUE en cas de doute",
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
