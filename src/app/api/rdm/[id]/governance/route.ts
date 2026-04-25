import { NextRequest, NextResponse } from "next/server";

import { getRequestSession } from "@/lib/auth";
import { governancePolicySummary } from "@/lib/governance-policy";
import { serializeGovernanceRecord } from "@/lib/governance-service";
import { getRdmRecordById } from "@/lib/rdm-service";

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

  return NextResponse.json({
    session,
    governance: {
      policy: governancePolicySummary,
      record: serializeGovernanceRecord(session.role, record),
    },
  });
}
