import { NextRequest, NextResponse } from "next/server";

import { getRequestSession } from "@/lib/auth";
import {
  getAccessibleCategories,
  getAccessibleStatuses,
  getAccessibleTypes,
  getActiveBaseState,
  getGovernanceOverview,
  listRdmRecords,
  serializeRdmRecord,
  type RdmSortKey,
  type RdmStatusFilter,
  type RdmTypeFilter,
  type SortDirection,
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
    records: records.map((record) => serializeRdmRecord(record, session.role)),
  });
}
