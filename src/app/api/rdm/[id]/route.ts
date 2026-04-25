import { NextRequest, NextResponse } from "next/server";

import { getRequestSession } from "@/lib/auth";
import {
  getActiveBaseState,
  getRdmRecordById,
  serializeRdmRecord,
} from "@/lib/rdm-service";

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
    },
    record: serializeRdmRecord(record, session.role),
  });
}
