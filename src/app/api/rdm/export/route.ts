import { NextRequest, NextResponse } from "next/server";
import * as XLSX from "xlsx";

import { getRequestSession } from "@/lib/auth";
import {
  getCollaboratorAccessLabel,
  getConfidentialityLabel,
  getSourceNormativeLabel,
} from "@/lib/rdm-presenters";
import { listRdmRecords, type RdmSortKey, type RdmStatusFilter, type RdmTypeFilter, type SortDirection } from "@/lib/rdm-service";
import type { RdmRecord } from "@/lib/rdm-types";

const exportHeaders = [
  "ID RDM",
  "Référence document",
  "Titre document",
  "Type",
  "Statut",
  "Version",
  "Emplacement DOCX",
  "Emplacement PDF",
  "Entité propriétaire",
  "Catégorie documentaire",
  "Date création",
  "Date dernière mise à jour",
  "Source normative",
  "Accès collaborateurs",
  "Niveau de confidentialité",
  "Remplace",
  "Remplacé par",
  "Décision registre liée",
  "Code anomalie gouvernance",
  "Observations",
] as const;

function buildExportRows(records: RdmRecord[]) {
  return records.map((record) => [
    record.id,
    record.reference,
    record.title,
    record.type,
    record.status,
    record.version,
    record.docxPath,
    record.pdfPath,
    record.ownerEntity,
    record.category,
    record.createdAt,
    record.updatedAt,
    getSourceNormativeLabel(record),
    getCollaboratorAccessLabel(record),
    getConfidentialityLabel(record),
    record.replaces ?? "",
    record.replacedBy ?? "",
    record.registerDecision ?? "",
    record.governanceIssueCode ?? "",
    record.observations,
  ]);
}

function escapeCsvCell(value: string) {
  const normalized = value.replace(/\r?\n/g, " ").trim();
  const escaped = normalized.replace(/"/g, "\"\"");

  return /[",;\n]/.test(escaped) ? `"${escaped}"` : escaped;
}

function buildCsvBuffer(records: RdmRecord[]) {
  const lines = [
    exportHeaders.join(";"),
    ...buildExportRows(records).map((row) => row.map(escapeCsvCell).join(";")),
  ];

  return Buffer.from(`\uFEFF${lines.join("\n")}`, "utf-8");
}

function buildXlsxBuffer(records: RdmRecord[]) {
  const sheet = XLSX.utils.aoa_to_sheet([
    [...exportHeaders],
    ...buildExportRows(records),
  ]);

  sheet["!cols"] = [
    { wch: 16 },
    { wch: 34 },
    { wch: 44 },
    { wch: 10 },
    { wch: 20 },
    { wch: 10 },
    { wch: 56 },
    { wch: 56 },
    { wch: 24 },
    { wch: 24 },
    { wch: 16 },
    { wch: 20 },
    { wch: 18 },
    { wch: 18 },
    { wch: 20 },
    { wch: 18 },
    { wch: 18 },
    { wch: 20 },
    { wch: 24 },
    { wch: 48 },
  ];

  sheet["!autofilter"] = {
    ref: XLSX.utils.encode_range({
      s: { c: 0, r: 0 },
      e: { c: exportHeaders.length - 1, r: Math.max(records.length, 1) },
    }),
  };
  sheet["!freeze"] = { xSplit: 0, ySplit: 1 };

  const workbook = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(workbook, sheet, "RDM");

  return Buffer.from(
    XLSX.write(workbook, {
      type: "buffer",
      bookType: "xlsx",
      compression: true,
    }),
  );
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
  const format = searchParams.get("format") ?? "csv";

  const records = listRdmRecords({
    role: session.role,
    query,
    type,
    status,
    category,
    sortKey: sort,
    sortDirection: dir,
  });

  if (format === "csv") {
    return new NextResponse(new Uint8Array(buildCsvBuffer(records)), {
      status: 200,
      headers: {
        "Content-Type": "text/csv; charset=utf-8",
        "Content-Disposition": 'attachment; filename="zone21-rdm-export.csv"',
        "Cache-Control": "private, no-store",
      },
    });
  }

  if (format === "xlsx") {
    return new NextResponse(new Uint8Array(buildXlsxBuffer(records)), {
      status: 200,
      headers: {
        "Content-Type":
          "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
        "Content-Disposition": 'attachment; filename="zone21-rdm-export.xlsx"',
        "Cache-Control": "private, no-store",
      },
    });
  }

  return NextResponse.json(
    { error: "Format d'export non supporté." },
    { status: 400 },
  );
}
