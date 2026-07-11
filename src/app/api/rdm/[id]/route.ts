import { NextRequest, NextResponse } from "next/server";

import { getRequestSession } from "@/lib/auth";
import { governancePolicySummary } from "@/lib/governance-policy";
import { serializeGovernanceRecord } from "@/lib/governance-service";
import {
  attachUploadedFiles,
  getActiveBaseState,
  getRdmRecordById,
  saveRdmRecord,
  serializeRegistry,
  serializeRdmRecord,
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

export async function GET(
  request: NextRequest,
  context: { params: Promise<{ id: string }> },
) {
  const session = getRequestSession(request);

  if (!session) {
    return NextResponse.json(
      { error: "Session collaborateur requise." },
      { status: 401 },
    );
  }

  const { id } = await context.params;
  const record = getRdmRecordById(id, session.role);

  if (!record) {
    return NextResponse.json(
      { error: "Document introuvable ou non autorisé." },
      { status: 404 },
    );
  }

  const activeBaseState = getActiveBaseState();

  return NextResponse.json({
    session,
    registry: {
      sourceOfTruth: activeBaseState.sourceOfTruth,
      mode: activeBaseState.mode,
      activeBasePath: activeBaseState.basePath,
      activeBaseAvailable: activeBaseState.isAvailable,
      activeBaseError: activeBaseState.error,
      governancePolicy: governancePolicySummary,
      officialRegistry: serializeRegistry(),
    },
    record: {
      ...serializeRdmRecord(record, session.role),
      governance: serializeGovernanceRecord(session.role, record),
    },
  });
}

export async function POST(
  request: NextRequest,
  context: { params: Promise<{ id: string }> },
) {
  const session = getRequestSession(request);

  if (!session) {
    return NextResponse.json(
      { error: "Session collaborateur requise." },
      { status: 401 },
    );
  }

  if (!hasPermission(session.role, "edit")) {
    return NextResponse.json(
      { error: "Droits insuffisants pour modifier une entrée RDM." },
      { status: 403 },
    );
  }

  try {
    const { id } = await context.params;
    const formData = await request.formData();
    const result = saveRdmRecord({
      id,
      reference: getFormString(formData, "reference"),
      title: getFormString(formData, "title"),
      type: getFormString(formData, "type") as DocumentType,
      status: getFormString(formData, "status") as DocumentStatus,
      version: getFormString(formData, "version") || "v1.0",
      docxPath: getFormString(formData, "docxPath"),
      pdfPath: getFormString(formData, "pdfPath"),
      ownerEntity: getFormString(formData, "ownerEntity"),
      category: getFormString(formData, "category") || undefined,
      observations: getFormString(formData, "observations"),
      expectedRegistryRevision:
        Number(getFormString(formData, "expectedRegistryRevision")) || undefined,
      actor: session.displayName,
      action: "update",
    });

    await attachUploadedFiles({
      record: result.record,
      docxFile: getFormFile(formData, "docxFile"),
      pdfFile: getFormFile(formData, "pdfFile"),
    });

    return NextResponse.redirect(
      new URL(`/collaborateurs/documents/${id}`, request.url),
      303,
    );
  } catch (error) {
    return NextResponse.json(
      {
        error:
          error instanceof Error
            ? error.message
            : "Modification RDM impossible.",
      },
      { status: 400 },
    );
  }
}
