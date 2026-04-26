import { mkdir, readFile, writeFile } from "node:fs/promises";
import path from "node:path";

import Docxtemplater from "docxtemplater";
import PizZip from "pizzip";

import { assertSandboxPath } from "./writer.real.fs";
import type { GenerationPlan, RealWriterInput } from "./writer.real.types";

const inMemoryTemplate = `<?xml version="1.0" encoding="UTF-8" standalone="yes"?>
<w:document xmlns:w="http://schemas.openxmlformats.org/wordprocessingml/2006/main">
  <w:body>
    <w:p><w:r><w:t>{title}</w:t></w:r></w:p>
    <w:p><w:r><w:t>{reference}</w:t></w:r></w:p>
    <w:p><w:r><w:t>{version}</w:t></w:r></w:p>
    <w:p><w:r><w:t>{contentSummary}</w:t></w:r></w:p>
  </w:body>
</w:document>`;

function buildTemplateArchive() {
  const zip = new PizZip();
  zip.file("[Content_Types].xml", `<?xml version="1.0" encoding="UTF-8" standalone="yes"?>
<Types xmlns="http://schemas.openxmlformats.org/package/2006/content-types">
  <Default Extension="rels" ContentType="application/vnd.openxmlformats-package.relationships+xml"/>
  <Default Extension="xml" ContentType="application/xml"/>
  <Override PartName="/word/document.xml" ContentType="application/vnd.openxmlformats-officedocument.wordprocessingml.document.main+xml"/>
</Types>`);
  zip.folder("_rels")?.file(".rels", `<?xml version="1.0" encoding="UTF-8" standalone="yes"?>
<Relationships xmlns="http://schemas.openxmlformats.org/package/2006/relationships">
  <Relationship Id="rId1" Type="http://schemas.openxmlformats.org/officeDocument/2006/relationships/officeDocument" Target="word/document.xml"/>
</Relationships>`);
  zip.folder("word")?.file("document.xml", inMemoryTemplate);

  return zip;
}

export function renderDocxTemplateInMemory(input: RealWriterInput) {
  const zip = buildTemplateArchive();
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

export function buildDocxGenerationPlan(
  input: RealWriterInput,
  targetPath: string,
): GenerationPlan {
  const buffer = renderDocxTemplateInMemory(input);

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
  const buffer = renderDocxTemplateInMemory(input);

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
