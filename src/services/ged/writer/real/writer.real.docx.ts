import { readFileSync } from "node:fs";
import { mkdir, readFile, writeFile } from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";

import Docxtemplater from "docxtemplater";
import PizZip from "pizzip";

import { assertSandboxPath } from "./writer.real.fs";
import type { GenerationPlan, RealWriterInput } from "./writer.real.types";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

function resolveTemplatePath(templateKey: string) {
  const templateFileByKey: Record<string, string> = {
    "note-z21-standard-v1": "note-z21-standard-v1.docx",
  };

  const templateFileName = templateFileByKey[templateKey];

  if (!templateFileName) {
    throw new Error(`Modele DOCX introuvable pour la cle ${templateKey}.`);
  }

  return path.join(__dirname, "templates", templateFileName);
}

function loadTemplateBuffer(templateKey: string) {
  return readFileSync(resolveTemplatePath(templateKey));
}

function renderDocxTemplate(
  templateBuffer: Buffer,
  input: RealWriterInput,
) {
  const zip = new PizZip(templateBuffer);
  const doc = new Docxtemplater(zip, {
    paragraphLoop: true,
    linebreaks: true,
  });

  doc.render({
    title: input.title,
    reference: input.reference,
    version: input.versionTarget,
    contentSummary: input.contentSummary,
  });

  return doc.getZip().generate({
    type: "nodebuffer",
    compression: "DEFLATE",
  }) as Buffer;
}

export function renderDocxTemplateInMemory(input: RealWriterInput) {
  const templateBuffer = loadTemplateBuffer(input.templateKey);
  return renderDocxTemplate(templateBuffer, input);
}

export function buildDocxGenerationPlan(
  input: RealWriterInput,
  targetPath: string,
): GenerationPlan {
  const templateBuffer = loadTemplateBuffer(input.templateKey);
  const buffer = renderDocxTemplate(templateBuffer, input);

  return {
    format: "docx",
    templateKey: input.templateKey,
    targetPath,
    execute: false,
    templateLoaded: true,
    inMemoryOnly: true,
    simulatedBufferByteLength: buffer.byteLength,
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

export async function executeDocxSandboxGeneration(
  input: RealWriterInput,
  sandboxTargetPath: string,
) {
  const { resolvedTarget } = assertSandboxPath(sandboxTargetPath);
  const templateBuffer = loadTemplateBuffer(input.templateKey);
  const buffer = renderDocxTemplate(templateBuffer, input);

  await mkdir(path.dirname(resolvedTarget), { recursive: true });
  await writeFile(resolvedTarget, buffer);

  const writtenBuffer = await readFile(resolvedTarget);
  const zip = new PizZip(writtenBuffer);
  const documentXml = zip.file("word/document.xml")?.asText() ?? "";
  const contentMatches = documentXml.includes(input.title) &&
    documentXml.includes(input.reference) &&
    documentXml.includes(input.versionTarget);

  return {
    format: "docx" as const,
    sandboxPath: resolvedTarget,
    verified: contentMatches,
    sizeBytes: writtenBuffer.byteLength,
  };
}
