import { rdmRecords } from "@/data/rdm.records";

import type {
  WriterControlResult,
  WriterDomain,
  WriterError,
  WriterInput,
  WriterPrefix,
  WriterRulesSummary,
  WriterStatus,
} from "./writer.types";
import {
  writerActiveDomains,
  writerAllowedPrefixes,
  writerConditionalDomains,
  writerForbiddenDomains,
} from "./writer.types";

const writerAllowedObjectsByDomain: Record<WriterDomain, string[]> = {
  DOC: [
    "VALIDATION-NOTE",
    "VALIDATION-PROC",
    "CONTROLE-RDM",
    "CONTROLE-CODIFICATION",
  ],
  MEDIA: [
    "BRIEF-CAMPAGNE",
    "SCRIPT-CONTENU",
    "CALENDRIER-PUBLICATION",
  ],
  WEAR: [
    "LANCEMENT-PRODUIT",
    "FICHE-PRODUIT",
    "SUIVI-COLLECTION",
  ],
  PROD: [
    "CHECKLIST-PUBLICATION",
    "SUIVI-PRODUCTION",
    "CONTROLE-QUALITE",
  ],
  SITE: [
    "MAJ-CONTENU",
    "AJOUT-SECTION",
    "MODIFICATION-PAGE",
  ],
  OPS: [
    "SUIVI-TACHE",
    "COMPTE-RENDU",
    "PLAN-ACTION",
  ],
  FIN: [
    "SUIVI-BUDGET",
    "NOTE-COUT",
    "PREVISIONNEL",
  ],
  IA: [
    "PROMPT-SYSTEME",
    "CONTROLE-SOURCE",
    "CONSIGNE-AGENT",
  ],
};

const writerBasePath = "/ZONE21_DEV/90_GED_PHASE_1" as const;

interface WriterValidationResult {
  status: WriterStatus;
  controls: WriterControlResult[];
  errors: WriterError[];
  theoreticalPaths: {
    docx: string;
    pdf: string;
    archiveDocx: string;
    archivePdf: string;
  };
}

function isWriterPrefix(value: string): value is WriterPrefix {
  return writerAllowedPrefixes.includes(value as WriterPrefix);
}

function domainListIncludes(
  domains: readonly WriterDomain[],
  domain: WriterDomain,
) {
  return domains.includes(domain);
}

function parseReferenceParts(reference: string) {
  const match = reference.match(
    /^(NOTE-Z21|PROC-Z21)-([A-Z]+)-([A-Z0-9-]+)-(v\d+\.\d+)$/,
  );

  if (!match) {
    return null;
  }

  return {
    prefix: match[1] as WriterPrefix,
    domain: match[2] as WriterDomain,
    object: match[3],
    version: match[4],
  };
}

function buildDocxPath(
  documentType: WriterPrefix,
  domain: WriterDomain,
  reference: string,
) {
  return `${writerBasePath}/${documentType}/${domain}/01_DOCX/${reference}.docx`;
}

function buildPdfPath(
  documentType: WriterPrefix,
  domain: WriterDomain,
  reference: string,
) {
  return `${writerBasePath}/${documentType}/${domain}/02_PDF/${reference}.pdf`;
}

function buildArchiveDocxPath(
  documentType: WriterPrefix,
  domain: WriterDomain,
  reference: string,
) {
  return `${writerBasePath}/${documentType}/${domain}/99_ARCHIVES/01_DOCX/${reference}.docx`;
}

function buildArchivePdfPath(
  documentType: WriterPrefix,
  domain: WriterDomain,
  reference: string,
) {
  return `${writerBasePath}/${documentType}/${domain}/99_ARCHIVES/02_PDF/${reference}.pdf`;
}

function buildErrorsFromControls(controls: WriterControlResult[]): WriterError[] {
  return controls
    .filter((control) => !control.passed)
    .map((control) => ({
      code: control.id.toUpperCase(),
      message: control.detail,
      blocking: control.blocking,
    }));
}

function resolveWriterStatus(errors: WriterError[]) {
  if (errors.length === 0) {
    return "ready" satisfies WriterStatus;
  }

  const hasInvalidError = errors.some((error) =>
    [
      "MISSING_VERSION",
      "INVALID_REFERENCE",
      "FILENAME_REFERENCE_MISMATCH",
      "THEORETICAL_PATH_MISMATCH",
      "INVALID_TITLE",
      "MISSING_TEMPLATE",
      "EMPTY_CONTENT_SUMMARY",
    ].includes(error.code),
  );

  return hasInvalidError ? "invalid" : "blocked";
}

export function getWriterRulesSummary(): WriterRulesSummary {
  return {
    prefixesAllowed: [...writerAllowedPrefixes],
    domainsActive: [...writerActiveDomains],
    domainsConditional: [...writerConditionalDomains],
    domainsForbidden: [...writerForbiddenDomains],
    basePath: writerBasePath,
    pathPattern:
      "/ZONE21_DEV/90_GED_PHASE_1/[NOTE-Z21|PROC-Z21]/[DOMAINE]/01_DOCX/[REFERENCE].docx",
  };
}

export function listWriterAllowedObjectsByDomain() {
  return writerAllowedObjectsByDomain;
}

export function validateWriterInput(input: WriterInput): WriterValidationResult {
  const referenceParts = parseReferenceParts(input.reference);
  const theoreticalPaths = {
    docx: buildDocxPath(input.documentType, input.domain, input.reference),
    pdf: buildPdfPath(input.documentType, input.domain, input.reference),
    archiveDocx: buildArchiveDocxPath(
      input.documentType,
      input.domain,
      input.reference,
    ),
    archivePdf: buildArchivePdfPath(
      input.documentType,
      input.domain,
      input.reference,
    ),
  };

  const domainActive = domainListIncludes(writerActiveDomains, input.domain);
  const domainConditional = domainListIncludes(
    writerConditionalDomains,
    input.domain,
  );
  const domainForbidden = domainListIncludes(
    writerForbiddenDomains,
    input.domain,
  );
  const allowedObjects = writerAllowedObjectsByDomain[input.domain] ?? [];
  const filenameConforms = input.fileName === `${input.reference}.docx`;
  const referenceConforms =
    referenceParts !== null &&
    referenceParts.prefix === input.documentType &&
    referenceParts.domain === input.domain &&
    referenceParts.object === input.object &&
    referenceParts.version === input.versionTarget;
  const theoreticalPathConforms = input.pathTarget === theoreticalPaths.docx;
  const hasVersionConflict =
    input.simulateVersionConflict === true ||
    rdmRecords.some(
      (record) =>
        record.reference === input.reference ||
        record.docxPath === input.pathTarget ||
        record.pdfPath === theoreticalPaths.pdf,
    );

  const controls: WriterControlResult[] = [
    {
      id: "allowed_prefix",
      label: "Prefixe autorise",
      passed: isWriterPrefix(input.documentType),
      blocking: true,
      detail: isWriterPrefix(input.documentType)
        ? "Le prefixe documentaire est autorise pour la phase 1."
        : "Le prefixe documentaire n'est pas autorise pour la phase 1.",
    },
    {
      id: "allowed_domain",
      label: "Domaine autorise",
      passed: domainActive || domainConditional,
      blocking: true,
      detail: domainActive || domainConditional
        ? "Le domaine est autorise en phase 1."
        : "Le domaine n'est pas autorise en phase 1.",
    },
    {
      id: "forbidden_fin_domain",
      label: "Domaine FIN exclu",
      passed: !domainForbidden,
      blocking: true,
      detail: domainForbidden
        ? "Le domaine FIN est explicitement interdit en phase 1."
        : "Le domaine ne fait pas partie des exclusions phase 1.",
    },
    {
      id: "conditional_domain_review",
      label: "Domaine sous reserve",
      passed: true,
      blocking: false,
      detail: domainConditional
        ? "Le domaine est autorise sous reserve et doit etre surveille de pres."
        : "Le domaine n'est pas classe sous reserve.",
    },
    {
      id: "allowed_object_for_domain",
      label: "Objet autorise par domaine",
      passed: allowedObjects.includes(input.object),
      blocking: true,
      detail: allowedObjects.includes(input.object)
        ? "L'objet est autorise pour ce domaine."
        : "L'objet n'est pas autorise pour ce domaine.",
    },
    {
      id: "missing_version",
      label: "Version presente",
      passed: /^v\d+\.\d+$/.test(input.versionTarget),
      blocking: true,
      detail: /^v\d+\.\d+$/.test(input.versionTarget)
        ? "La version cible est correctement renseignee."
        : "La version cible est manquante ou invalide.",
    },
    {
      id: "invalid_reference",
      label: "Reference conforme",
      passed: referenceConforms,
      blocking: true,
      detail: referenceConforms
        ? "La reference respecte la convention GED phase 1."
        : "La reference n'est pas conforme au prefixe, au domaine, a l'objet ou a la version attendus.",
    },
    {
      id: "filename_reference_mismatch",
      label: "Nom de fichier coherent",
      passed: filenameConforms,
      blocking: true,
      detail: filenameConforms
        ? "Le nom de fichier DOCX correspond a la reference."
        : "Le nom de fichier ne correspond pas exactement a la reference attendue.",
    },
    {
      id: "theoretical_path_mismatch",
      label: "Chemin theorique conforme",
      passed: theoreticalPathConforms,
      blocking: true,
      detail: theoreticalPathConforms
        ? "Le chemin theorique respecte le cadrage /90_GED_PHASE_1/."
        : "Le chemin theorique ne respecte pas la structure /90_GED_PHASE_1/ attendue.",
    },
    {
      id: "missing_template",
      label: "Modele present",
      passed: input.templateKey.trim().length > 0,
      blocking: true,
      detail:
        input.templateKey.trim().length > 0
          ? "Le modele documentaire de reference est renseigne."
          : "Aucun modele documentaire n'a ete renseigne pour la simulation.",
    },
    {
      id: "invalid_title",
      label: "Titre renseigne",
      passed: input.title.trim().length > 0,
      blocking: true,
      detail:
        input.title.trim().length > 0
          ? "Le titre documentaire est renseigne."
          : "Le titre documentaire est vide ou incoherent.",
    },
    {
      id: "empty_content_summary",
      label: "Contenu coherent",
      passed: input.contentSummary.trim().length > 0,
      blocking: true,
      detail:
        input.contentSummary.trim().length > 0
          ? "Le resume du contenu permet une verification de coherence."
          : "Le contenu structure de simulation est vide.",
    },
    {
      id: "simulated_version_conflict",
      label: "Absence de conflit de version",
      passed: !hasVersionConflict,
      blocking: true,
      detail: hasVersionConflict
        ? "Un conflit de version ou de reference a ete simule pour cette publication."
        : "Aucun conflit de version n'a ete detecte en dry-run.",
    },
  ];

  const errors = buildErrorsFromControls(controls);

  return {
    status: resolveWriterStatus(errors),
    controls,
    errors,
    theoreticalPaths,
  };
}
