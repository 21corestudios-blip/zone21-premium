import { access, mkdir, stat } from "node:fs/promises";
import path from "node:path";
import { execFile } from "node:child_process";
import { promisify } from "node:util";

import { gedConfig } from "@/config/ged.config";

import { assertSandboxPath } from "./writer.real.fs";
import type { GenerationPlan, RealWriterInput } from "./writer.real.types";

const execFileAsync = promisify(execFile);

export function buildLibreOfficeCommandPreview(
  input: RealWriterInput,
  docxPath: string,
  targetPath: string,
) {
  const outdir = targetPath.replace(/\/[^/]+$/, "");

  return [
    gedConfig.libreOfficePath,
    "--headless",
    "--convert-to",
    "pdf",
    "--outdir",
    `"${outdir}"`,
    `"${docxPath}"`,
    `# reference=${input.reference}`,
  ].join(" ");
}

export function buildPdfGenerationPlan(
  input: RealWriterInput,
  targetPath: string,
): GenerationPlan {
  const docxPath = targetPath.replace("/02_PDF/", "/01_DOCX/").replace(
    /\.pdf$/,
    ".docx",
  );
  const commandPreview = buildLibreOfficeCommandPreview(
    input,
    docxPath,
    targetPath,
  );

  return {
    format: "pdf",
    templateKey: input.templateKey,
    targetPath,
    execute: false,
    templateLoaded: true,
    inMemoryOnly: true,
    simulatedBufferByteLength: 0,
    commandPreview,
    pipeline: [
      "recevoir le document source DOCX theorique",
      "preparer la conversion PDF via LibreOffice",
      "appliquer les regles de rendu attendues",
      "simuler le resultat de conversion sans exec reel",
      "transmettre au plan d'ecriture sans persistance",
    ],
    inputs: {
      reference: input.reference,
      title: input.title,
      version: input.versionTarget,
      domain: input.domain,
      object: input.object,
      contentSummary: input.contentSummary,
    },
  };
}

export async function getLibreOfficeBinaryPath() {
  try {
    await access(gedConfig.libreOfficePath);
    return gedConfig.libreOfficePath;
  } catch {
    return null;
  }
}

export async function executePdfSandboxConversion(
  input: RealWriterInput,
  sandboxDocxPath: string,
  sandboxPdfPath: string,
) {
  const { resolvedTarget: resolvedDocxPath } = assertSandboxPath(sandboxDocxPath);
  const { resolvedTarget: resolvedPdfPath } = assertSandboxPath(sandboxPdfPath);

  const libreOfficeBinaryPath = await getLibreOfficeBinaryPath();

  if (!libreOfficeBinaryPath) {
    return {
      format: "pdf" as const,
      sandboxPath: resolvedPdfPath,
      verified: false,
      sizeBytes: 0,
      skipped: true,
      reason: "LibreOffice introuvable sur cette machine.",
      commandExecuted: buildLibreOfficeCommandPreview(
        input,
        resolvedDocxPath,
        resolvedPdfPath,
      ),
    };
  }

  const outdir = path.dirname(resolvedPdfPath);
  const args = [
    "--headless",
    "--convert-to",
    "pdf",
    "--outdir",
    outdir,
    resolvedDocxPath,
  ];

  await mkdir(outdir, { recursive: true });
  await execFileAsync(libreOfficeBinaryPath, args, {
    timeout: gedConfig.conversionTimeoutMs,
  });

  const fileStats = await stat(resolvedPdfPath);
  const fileNameMatches =
    path.basename(resolvedPdfPath) === `${input.reference}.pdf`;

  return {
    format: "pdf" as const,
    sandboxPath: resolvedPdfPath,
    verified: fileStats.size > 0 && fileNameMatches,
    sizeBytes: fileStats.size,
    commandExecuted: [libreOfficeBinaryPath, ...args].join(" "),
  };
}
