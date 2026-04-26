import type { RealWriterInput, GenerationPlan } from "./writer.real.types";

export function buildDocxGenerationPlan(
  input: RealWriterInput,
  targetPath: string,
): GenerationPlan {
  return {
    format: "docx",
    templateKey: input.templateKey,
    targetPath,
    execute: false,
    pipeline: [
      "charger le modele documentaire",
      "injecter les metadonnees de reference",
      "injecter le contenu structure",
      "produire un buffer DOCX en memoire",
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
