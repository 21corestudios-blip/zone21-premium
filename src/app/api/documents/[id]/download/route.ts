import { NextRequest, NextResponse } from "next/server";

import { getRequestSession } from "@/lib/auth";
import { getDownloadPayload } from "@/lib/rdm-service";
import type { DownloadFormat } from "@/lib/rdm-types";

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
  const { searchParams } = new URL(request.url);
  const format = (searchParams.get("format") ?? "pdf") as DownloadFormat;
  const disposition = searchParams.get("disposition") === "inline" ? "inline" : "attachment";

  if (format !== "pdf" && format !== "docx") {
    return NextResponse.json({ error: "Format non supporté." }, { status: 400 });
  }

  const payload = await getDownloadPayload({
    id,
    role: session.role,
    format,
  });

  if (!payload) {
    return NextResponse.json(
      { error: "Document introuvable ou accès refusé." },
      { status: 404 },
    );
  }

  if (!payload.buffer) {
    return NextResponse.json(
      {
        error:
          "Le fichier source n'a pas été trouvé sur la base active ZONE21_DEV.",
        sourcePath: payload.systemPath,
      },
      { status: 503 },
    );
  }

  return new NextResponse(payload.buffer, {
    status: 200,
    headers: {
      "Content-Type": payload.mimeType,
      "Content-Disposition": `${disposition}; filename="${payload.fileName}"`,
      "Cache-Control": "private, no-store",
    },
  });
}
