import { spawn } from "node:child_process";
import { existsSync } from "node:fs";

import { NextRequest, NextResponse } from "next/server";

import { getRequestSession } from "@/lib/auth";
import {
  getCollaboratorAccessLabel,
  getConfidentialityLabel,
  getSourceNormativeLabel,
} from "@/lib/rdm-presenters";
import { listRdmRecords } from "@/lib/rdm-service";
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
  "Observations",
];

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

function resolvePythonExecutable() {
  const candidates = [
    process.env.Z21_PYTHON_BIN,
    "/Users/gregloupiac/.cache/codex-runtimes/codex-primary-runtime/dependencies/python/bin/python3",
    "python3",
  ].filter(Boolean) as string[];

  return candidates.find((candidate) => candidate === "python3" || existsSync(candidate));
}

async function buildXlsxBuffer(records: RdmRecord[]) {
  const pythonExecutable = resolvePythonExecutable();

  if (!pythonExecutable) {
    throw new Error("Aucun interpréteur Python disponible pour l'export XLSX.");
  }

  const pythonScript = `
import io
import json
import sys
from openpyxl import Workbook
from openpyxl.styles import Font, PatternFill, Border, Side, Alignment
from openpyxl.utils import get_column_letter

payload = json.load(sys.stdin)
headers = payload["headers"]
rows = payload["rows"]

wb = Workbook()
ws = wb.active
ws.title = "RDM"
ws.freeze_panes = "A2"

header_fill = PatternFill(fill_type="solid", fgColor="1A1918")
header_font = Font(color="F7F5F0", bold=True)
thin_side = Side(style="thin", color="2B2825")

for col_idx, header in enumerate(headers, start=1):
    cell = ws.cell(row=1, column=col_idx, value=header)
    cell.fill = header_fill
    cell.font = header_font
    cell.alignment = Alignment(horizontal="center", vertical="center")
    cell.border = Border(left=thin_side, right=thin_side, top=thin_side, bottom=thin_side)

for row_idx, row in enumerate(rows, start=2):
    for col_idx, value in enumerate(row, start=1):
        cell = ws.cell(row=row_idx, column=col_idx, value=value)
        cell.alignment = Alignment(vertical="top", wrap_text=True)
        cell.border = Border(left=thin_side, right=thin_side, top=thin_side, bottom=thin_side)

widths = [16, 30, 42, 10, 20, 10, 55, 55, 24, 24, 16, 18, 18, 18, 20, 18, 18, 20, 44]
for idx, width in enumerate(widths, start=1):
    ws.column_dimensions[get_column_letter(idx)].width = width

output = io.BytesIO()
wb.save(output)
sys.stdout.buffer.write(output.getvalue())
`.trim();

  const payload = JSON.stringify({
    headers: exportHeaders,
    rows: buildExportRows(records),
  });

  return await new Promise<Buffer>((resolve, reject) => {
    const child = spawn(pythonExecutable, ["-c", pythonScript], {
      stdio: ["pipe", "pipe", "pipe"],
    });
    const stdoutChunks: Buffer[] = [];
    const stderrChunks: Buffer[] = [];

    child.stdout.on("data", (chunk: Buffer) => {
      stdoutChunks.push(chunk);
    });

    child.stderr.on("data", (chunk: Buffer) => {
      stderrChunks.push(chunk);
    });

    child.on("error", (error) => {
      reject(error);
    });

    child.on("close", (code) => {
      if (code === 0) {
        resolve(Buffer.concat(stdoutChunks));
        return;
      }

      reject(
        new Error(
          Buffer.concat(stderrChunks).toString("utf-8") ||
            `Export XLSX impossible (code ${code ?? "inconnu"}).`,
        ),
      );
    });

    child.stdin.write(payload);
    child.stdin.end();
  });
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
  const type = searchParams.get("type") ?? "all";
  const status = searchParams.get("status") ?? "all";
  const category = searchParams.get("category") ?? "all";
  const sort = searchParams.get("sort") ?? "updatedAt";
  const dir = searchParams.get("dir") ?? "desc";
  const format = searchParams.get("format") ?? "csv";

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
    try {
      const buffer = await buildXlsxBuffer(records);

      return new NextResponse(new Uint8Array(buffer), {
        status: 200,
        headers: {
          "Content-Type":
            "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
          "Content-Disposition": 'attachment; filename="zone21-rdm-export.xlsx"',
          "Cache-Control": "private, no-store",
        },
      });
    } catch (error) {
      return NextResponse.json(
        {
          error:
            error instanceof Error
              ? error.message
              : "Export XLSX indisponible.",
        },
        { status: 500 },
      );
    }
  }

  return NextResponse.json({ error: "Format d'export non supporté." }, { status: 400 });
}
