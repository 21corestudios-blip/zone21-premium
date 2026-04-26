import { gedConfig } from "@/config/ged.config";

import type { GenerationPlan, RealWriterInput } from "./writer.real.types";

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
