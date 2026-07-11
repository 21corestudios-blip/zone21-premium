import { NextRequest, NextResponse } from "next/server";

import { getRequestSession } from "@/lib/auth";
import {
  governancePolicySummary,
  listGovernanceRolePolicies,
} from "@/lib/governance-policy";
import { serializeGovernanceRecord } from "@/lib/governance-service";
import {
  attachUploadedFiles,
  getAccessibleCategories,
  getAccessibleStatuses,
  getAccessibleTypes,
  getActiveBaseState,
  getGovernanceOverview,
  listRdmRecords,
  saveRdmRecord,
  serializeRegistry,
  serializeRdmRecord,
  type RdmSortKey,
  type RdmStatusFilter,
  type RdmTypeFilter,
  type SortDirection,
} from "@/lib/rdm-service";
import { hasPermission } from "@/lib/rbac";
import type { DocumentStatus, DocumentType } from "@/lib/rdm-types";

function getFormString(formData: FormData, key: string) {
  const value = formData.get(key);

  return typeof value === "string" ? value.trim() : "";
}

function getFormFile(formData: FormData, key: string) {
  const value = formData.get(key);

  return value instanceof File && value.size > 0 ? value : null;
}

export async function GET(request: NextRequest) {
  const session = getRequestSession(request);

  if (!session) {
    return NextResponse.json(
      { error: "Session collaborateur requise." },
      { status: 401 },
    );
  }

  const { searchParams } = new URL(request.url);
  const query = searchParams.get("q") ?? undefined;
  const type = (searchParams.get("type") ?? "all") as RdmTypeFilter;
  const status = (searchParams.get("status") ?? "all") as RdmStatusFilter;
  const category = searchParams.get("category") ?? "all";
  const sort = (searchParams.get("sort") ?? "updatedAt") as RdmSortKey;
  const dir = (searchParams.get("dir") ?? "desc") as SortDirection;

  const records = listRdmRecords({
    role: session.role,
    query,
    type,
    status,
    category,
    sortKey: sort,
    sortDirection: dir,
  });
  const activeBaseState = getActiveBaseState();
  const governanceOverview = getGovernanceOverview(records);

  return NextResponse.json({
    session,
    registry: {
      sourceOfTruth: activeBaseState.sourceOfTruth,
      mode: activeBaseState.mode,
      activeBasePath: activeBaseState.basePath,
      activeBaseAvailable: activeBaseState.isAvailable,
      activeBaseError: activeBaseState.error,
      governanceSyncStatus: governanceOverview.overallStatus,
      governanceCounts: governanceOverview.counts,
      governancePolicy: governancePolicySummary,
      officialRegistry: serializeRegistry(),
    },
    filters: {
      query: query ?? "",
      type,
      status,
      category,
      sort,
      dir,
      categories: getAccessibleCategories(session.role),
      statuses: getAccessibleStatuses(session.role),
      types: getAccessibleTypes(session.role),
    },
    total: records.length,
    governance: {
      rolePolicies: listGovernanceRolePolicies(),
      workflowStates: [
        "brouillon",
        "soumis",
        "en_validation",
        "validé",
        "archivé",
        "rejeté",
      ],
    },
    records: records.map((record) => ({
      ...serializeRdmRecord(record, session.role),
      governance: serializeGovernanceRecord(session.role, record),
    })),
  });
}

export async function POST(request: NextRequest) {
  const session = getRequestSession(request);

  if (!session) {
    return NextResponse.json(
      { error: "Session collaborateur requise." },
      { status: 401 },
    );
  }

  if (!hasPermission(session.role, "create")) {
    return NextResponse.json(
      { error: "Droits insuffisants pour créer une entrée RDM." },
      { status: 403 },
    );
  }

  try {
    const formData = await request.formData();
    const result = saveRdmRecord({
      reference: getFormString(formData, "reference"),
      title: getFormString(formData, "title"),
      type: getFormString(formData, "type") as DocumentType,
      status: getFormString(formData, "status") as DocumentStatus,
      version: getFormString(formData, "version") || "v1.0",
      docxPath: getFormString(formData, "docxPath"),
      pdfPath: getFormString(formData, "pdfPath"),
      ownerEntity: getFormString(formData, "ownerEntity"),
      category: getFormString(formData, "category") || "RDM central",
      observations: getFormString(formData, "observations"),
      expectedRegistryRevision:
        Number(getFormString(formData, "expectedRegistryRevision")) || undefined,
      actor: session.displayName,
      action: "create",
    });

    await attachUploadedFiles({
      record: result.record,
      docxFile: getFormFile(formData, "docxFile"),
      pdfFile: getFormFile(formData, "pdfFile"),
    });

    return NextResponse.redirect(new URL("/collaborateurs", request.url), 303);
  } catch (error) {
    return NextResponse.json(
      {
        error:
          error instanceof Error
            ? error.message
            : "Création RDM impossible.",
      },
      { status: 400 },
    );
  }
}
