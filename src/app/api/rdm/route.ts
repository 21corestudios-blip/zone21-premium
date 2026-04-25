import { NextRequest, NextResponse } from "next/server";

import { getRequestSession } from "@/lib/auth";
import {
  getAccessibleCategories,
  getAccessibleStatuses,
  listRdmRecords,
  serializeRdmRecord,
} from "@/lib/rdm-service";

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
  const type = searchParams.get("type") ?? "all";
  const status = searchParams.get("status") ?? "all";
  const category = searchParams.get("category") ?? "all";
  const sort = searchParams.get("sort") ?? "updatedAt";
  const dir = searchParams.get("dir") ?? "desc";

  const records = listRdmRecords({
    role: session.role,
    query,
    type: type as "all" | "DOC" | "DIR",
    status: status as "all" | "Validé" | "Document de travail" | "Archivé",
    category,
    sortKey: sort as
      | "id"
      | "reference"
      | "title"
      | "status"
      | "ownerEntity"
      | "category"
      | "version"
      | "updatedAt",
    sortDirection: dir as "asc" | "desc",
  });

  return NextResponse.json({
    session,
    filters: {
      query: query ?? "",
      type,
      status,
      category,
      sort,
      dir,
      categories: getAccessibleCategories(session.role),
      statuses: getAccessibleStatuses(session.role),
    },
    total: records.length,
    records: records.map((record) => serializeRdmRecord(record, session.role)),
  });
}
