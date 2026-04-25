import type { CollaboratorRole } from "./permissions";

export const governanceWorkflowStates = [
  "brouillon",
  "soumis",
  "en_validation",
  "validé",
  "archivé",
  "rejeté",
] as const;

export type GovernanceWorkflowState =
  (typeof governanceWorkflowStates)[number];

export const governanceActions = [
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
] as const;

export type GovernanceAction = (typeof governanceActions)[number];

export interface GovernanceValidationCheck {
  id: string;
  label: string;
  blocking: boolean;
  passed: boolean;
  detail: string;
}

export interface GovernanceValidationSummary {
  canExposeAsValidated: boolean;
  checks: GovernanceValidationCheck[];
  failedBlockingCheckIds: string[];
  failedNonBlockingCheckIds: string[];
}

export interface GovernanceActionAvailability {
  action: GovernanceAction;
  allowed: boolean;
  reason: string;
}

export interface GovernanceRolePolicy {
  role: CollaboratorRole;
  actions: GovernanceAction[];
}

export interface GovernancePolicySummary {
  sourceOfTruth: "ZONE21_DEV";
  recommendedStrategy: "A+E";
  writerMode: "writer-server-unique";
  frontWriteAllowed: false;
  applicationDataRule: string;
  truthChain: string[];
  antiDoubleSourceGuardrails: string[];
}
