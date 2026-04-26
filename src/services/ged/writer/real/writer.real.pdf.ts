import type { GenerationPlan, RealWriterInput } from "./writer.real.types";

export function buildPdfGenerationPlan(
  input: RealWriterInput,
  targetPath: string,
): GenerationPlan {
  return {
    format: "pdf",
    templateKey: input.templateKey,
    targetPath,
    execute: false,
    pipeline: [
      "recevoir le document source DOCX theorique",
      "preparer la conversion PDF",
      "appliquer les regles de rendu attendues",
      "produire un buffer PDF en memoire",
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
