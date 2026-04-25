import { existsSync } from "node:fs";
import path from "node:path";

import type { CollaboratorRole } from "./permissions";
import type { RdmRecord } from "./rdm-types";
import {
  canPerformGovernanceAction,
  governancePolicySummary,
  getGovernanceWorkflowStateLabel,
} from "./governance-policy";
import type {
  GovernanceActionAvailability,
  GovernanceValidationCheck,
  GovernanceValidationSummary,
  GovernanceWorkflowState,
} from "./governance-types";
import { canDownloadRecord } from "./rbac";
import { getActiveBaseState, resolveSystemPath } from "./rdm-service";

function matchesReferenceVersion(reference: string, version: string) {
  return reference.endsWith(`-${version}`);
}

function getExpectedDocxName(record: RdmRecord) {
  return `${record.reference}.docx`;
}

function getExpectedPdfName(record: RdmRecord) {
  return `${record.reference}.pdf`;
}

function buildValidationChecks(record: RdmRecord): GovernanceValidationCheck[] {
  const activeBaseState = getActiveBaseState();
  const docxResolved = resolveSystemPath(record.docxPath);
  const pdfResolved = resolveSystemPath(record.pdfPath);
  const docxExists = docxResolved.systemPath
    ? existsSync(docxResolved.systemPath)
    : false;
  const pdfExists = pdfResolved.systemPath
    ? existsSync(pdfResolved.systemPath)
    : false;
  const docxPathConforms =
    record.docxPath.startsWith("/ZONE21_DEV/") &&
    record.docxPath.includes("/01_DOCX/") &&
    path.posix.basename(record.docxPath) === getExpectedDocxName(record);
  const pdfPathConforms =
    record.pdfPath.startsWith("/ZONE21_DEV/") &&
    record.pdfPath.includes("/02_PDF/") &&
    path.posix.basename(record.pdfPath) === getExpectedPdfName(record);

  return [
    {
      id: "active_base_available",
      label: "Base active accessible",
      blocking: true,
      passed: activeBaseState.isAvailable,
      detail: activeBaseState.isAvailable
        ? "La base active ZONE21_DEV est disponible côté serveur."
        : activeBaseState.error ??
          "La base active n'est pas disponible pour un contrôle physique.",
    },
    {
      id: "docx_exists_physically",
      label: "DOCX officiel présent physiquement",
      blocking: true,
      passed: docxExists,
      detail: docxExists
        ? "Le DOCX officiel a été retrouvé dans ZONE21_DEV."
        : "Le DOCX officiel n'a pas été confirmé physiquement dans ZONE21_DEV.",
    },
    {
      id: "pdf_exists_physically",
      label: "PDF officiel présent physiquement",
      blocking: true,
      passed: pdfExists,
      detail: pdfExists
        ? "Le PDF officiel a été retrouvé dans ZONE21_DEV."
        : "Le PDF officiel requis n'a pas été confirmé physiquement dans ZONE21_DEV.",
    },
    {
      id: "docx_path_conforms",
      label: "Emplacement DOCX conforme",
      blocking: true,
      passed: docxPathConforms,
      detail: docxPathConforms
        ? "Le DOCX respecte le classement attendu en 01_DOCX."
        : "Le DOCX ne respecte pas la charte de classement attendue.",
    },
    {
      id: "pdf_path_conforms",
      label: "Emplacement PDF conforme",
      blocking: true,
      passed: pdfPathConforms,
      detail: pdfPathConforms
        ? "Le PDF respecte le classement attendu en 02_PDF."
        : "Le PDF ne respecte pas la charte de classement attendue.",
    },
    {
      id: "reference_conforms",
      label: "Référence conforme",
      blocking: true,
      passed: /^[A-Z]+-Z21-[A-Z0-9-]+-v\d+\.\d+$/.test(record.reference),
      detail: "La référence doit suivre la codification ZONE 21.",
    },
    {
      id: "version_conforms",
      label: "Version conforme",
      blocking: true,
      passed: matchesReferenceVersion(record.reference, record.version),
      detail:
        "La version exposée doit correspondre à la version encodée dans la référence.",
    },
    {
      id: "title_present",
      label: "Titre document renseigné",
      blocking: true,
      passed: record.title.trim().length > 0,
      detail: "Le titre officiel ne doit pas être vide.",
    },
    {
      id: "status_governance_aligned",
      label: "Statut de gouvernance aligné",
      blocking: true,
      passed:
        record.status === "Validé" ? record.governanceSyncStatus === "à jour" : true,
      detail:
        "Un document Validé ne peut être exposé comme tel que si la gouvernance est à jour.",
    },
  ];
}

export function getGovernanceValidationSummary(
  record: RdmRecord,
): GovernanceValidationSummary {
  const checks = buildValidationChecks(record);
  const failedBlockingCheckIds = checks
    .filter((check) => check.blocking && !check.passed)
    .map((check) => check.id);
  const failedNonBlockingCheckIds = checks
    .filter((check) => !check.blocking && !check.passed)
    .map((check) => check.id);

  return {
    canExposeAsValidated:
      record.status === "Validé" && failedBlockingCheckIds.length === 0,
    checks,
    failedBlockingCheckIds,
    failedNonBlockingCheckIds,
  };
}

export function inferGovernanceWorkflowState(
  record: RdmRecord,
): GovernanceWorkflowState {
  if (record.status === "Archivé") {
    return "archivé";
  }

  if (record.status === "Document de travail") {
    return "brouillon";
  }

  return getGovernanceValidationSummary(record).canExposeAsValidated
    ? "validé"
    : "en_validation";
}

export function getGovernanceActionAvailability(
  role: CollaboratorRole,
  record: RdmRecord,
): GovernanceActionAvailability[] {
  const validationSummary = getGovernanceValidationSummary(record);
  const workflowState = inferGovernanceWorkflowState(record);

  const checks = {
    read_record: true,
    download_official: canDownloadRecord(role, record, "docx") ||
      canDownloadRecord(role, record, "pdf"),
    create_draft: true,
    edit_draft: workflowState === "brouillon",
    submit_for_review: workflowState === "brouillon",
    resume_validation: workflowState === "en_validation",
    approve_publication:
      workflowState === "en_validation" &&
      validationSummary.failedBlockingCheckIds.length === 0,
    reject_submission:
      workflowState === "en_validation" || workflowState === "brouillon",
    archive_document: workflowState === "validé",
    create_next_version: workflowState === "validé",
  } as const;

  return (
    Object.keys(checks) as Array<keyof typeof checks>
  ).map((action) => {
    const allowedByRole = canPerformGovernanceAction(role, action);
    const allowedByState = checks[action];

    return {
      action,
      allowed: allowedByRole && allowedByState,
      reason: allowedByRole
        ? allowedByState
          ? "Action autorisée dans l'état courant."
          : "Action bloquée par l'état documentaire ou les garde-fous physiques."
        : "Action non autorisée pour ce rôle.",
    };
  });
}

export function serializeGovernanceRecord(
  role: CollaboratorRole,
  record: RdmRecord,
) {
  const validationSummary = getGovernanceValidationSummary(record);
  const workflowState = inferGovernanceWorkflowState(record);

  return {
    sourceOfTruth: governancePolicySummary.sourceOfTruth,
    workflowState,
    workflowStateLabel: getGovernanceWorkflowStateLabel(workflowState),
    validation: validationSummary,
    actions: getGovernanceActionAvailability(role, record),
  };
}
