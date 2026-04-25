import { NextRequest, NextResponse } from "next/server";

import { getRequestSession } from "@/lib/auth";
import {
  governancePolicySummary,
  listGovernanceRolePolicies,
} from "@/lib/governance-policy";

export async function GET(request: NextRequest) {
  const session = getRequestSession(request);

  if (!session) {
    return NextResponse.json(
      { error: "Session collaborateur requise." },
      { status: 401 },
    );
  }

  return NextResponse.json({
    session,
    governance: {
      policy: governancePolicySummary,
      rolePolicies: listGovernanceRolePolicies(),
      workflowStates: [
        {
          id: "brouillon",
          label: "Brouillon",
        },
        {
          id: "soumis",
          label: "Soumis",
        },
        {
          id: "en_validation",
          label: "En validation",
        },
        {
          id: "validé",
          label: "Validé",
        },
        {
          id: "archivé",
          label: "Archivé",
        },
        {
          id: "rejeté",
          label: "Rejeté",
        },
      ],
    },
  });
}
