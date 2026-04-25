import { NextRequest, NextResponse } from "next/server";

import { getRequestSession } from "@/lib/auth";
import {
  getWriterDryRunConfiguration,
  runWriterDryRun,
} from "@/services/ged/writer/writer.service";
import type { WriterInput } from "@/services/ged/writer/writer.types";

function buildExampleInput(): WriterInput {
  return {
    draftId: "GED-DRYRUN-0001",
    documentType: "NOTE-Z21",
    domain: "MEDIA",
    object: "BRIEF-CAMPAGNE",
    reference: "NOTE-Z21-MEDIA-BRIEF-CAMPAGNE-v1.0",
    title: "Brief campagne media phase 1",
    fileName: "NOTE-Z21-MEDIA-BRIEF-CAMPAGNE-v1.0.docx",
    versionTarget: "v1.0",
    pathTarget:
      "/ZONE21_DEV/90_GED_PHASE_1/NOTE-Z21/MEDIA/01_DOCX/NOTE-Z21-MEDIA-BRIEF-CAMPAGNE-v1.0.docx",
    validatedBy: "Admin documentaire",
    validationDecision: "validé",
    templateKey: "note-z21-standard-v1",
    contentSummary:
      "Brief structure pour la campagne media de test GED phase 1.",
  };
}

function buildForbiddenDomainInput(): WriterInput {
  return {
    draftId: "GED-DRYRUN-0002",
    documentType: "NOTE-Z21",
    domain: "FIN",
    object: "NOTE-COUT",
    reference: "NOTE-Z21-FIN-NOTE-COUT-v1.0",
    title: "Note cout budgetaire",
    fileName: "NOTE-Z21-FIN-NOTE-COUT-v1.0.docx",
    versionTarget: "v1.0",
    pathTarget:
      "/ZONE21_DEV/90_GED_PHASE_1/NOTE-Z21/FIN/01_DOCX/NOTE-Z21-FIN-NOTE-COUT-v1.0.docx",
    validatedBy: "Admin documentaire",
    validationDecision: "validé",
    templateKey: "note-z21-standard-v1",
    contentSummary: "Simulation d'un domaine interdit en phase 1.",
  };
}

function buildConflictInput(): WriterInput {
  return {
    draftId: "GED-DRYRUN-0003",
    documentType: "PROC-Z21",
    domain: "OPS",
    object: "PLAN-ACTION",
    reference: "PROC-Z21-OPS-PLAN-ACTION-v1.0",
    title: "Plan action operations",
    fileName: "PROC-Z21-OPS-PLAN-ACTION-v1.0.docx",
    versionTarget: "v1.0",
    pathTarget:
      "/ZONE21_DEV/90_GED_PHASE_1/PROC-Z21/OPS/01_DOCX/PROC-Z21-OPS-PLAN-ACTION-v1.0.docx",
    validatedBy: "Validateur GED",
    validationDecision: "validé",
    templateKey: "proc-z21-standard-v1",
    contentSummary: "Simulation d'un conflit de version force.",
    simulateVersionConflict: true,
  };
}

export async function GET(request: NextRequest) {
  const session = getRequestSession(request);

  if (!session) {
    return NextResponse.json(
      { error: "Session collaborateur requise." },
      { status: 401 },
    );
  }

  const configuration = getWriterDryRunConfiguration();
  const exampleInput = buildExampleInput();
  const forbiddenDomainInput = buildForbiddenDomainInput();
  const conflictInput = buildConflictInput();

  return NextResponse.json({
    session,
    writer: configuration,
    domains: {
      active: configuration.rules.domainsActive,
      conditional: configuration.rules.domainsConditional,
      forbidden: configuration.rules.domainsForbidden,
    },
    prefixesAllowed: configuration.rules.prefixesAllowed,
    exampleInput,
    simulation: runWriterDryRun(exampleInput),
    blockedScenarios: [
      {
        label: "Domaine interdit FIN",
        input: forbiddenDomainInput,
        result: runWriterDryRun(forbiddenDomainInput),
      },
      {
        label: "Conflit de version simule",
        input: conflictInput,
        result: runWriterDryRun(conflictInput),
      },
    ],
    message: "Writer en mode simulation — aucune écriture réelle autorisée",
  });
}
