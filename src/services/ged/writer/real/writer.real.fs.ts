import path from "node:path";

import { gedConfig } from "@/config/ged.config";
import type { WriterDomain, WriterPrefix } from "../writer.types";

import type {
  ArchivePlan,
  FileWritePlan,
  RealWriterInput,
} from "./writer.real.types";

const realWriterBasePath = "/ZONE21_DEV/90_GED_PHASE_1" as const;
const zone21DevPrefix = "/ZONE21_DEV/";

interface RealWriterPaths {
  docx: string;
  pdf: string;
  archiveDocx: string | null;
  archivePdf: string | null;
}

function buildDocxPath(
  documentType: WriterPrefix,
  domain: WriterDomain,
  reference: string,
) {
  return `${realWriterBasePath}/${documentType}/${domain}/01_DOCX/${reference}.docx`;
}

function buildPdfPath(
  documentType: WriterPrefix,
  domain: WriterDomain,
  reference: string,
) {
  return `${realWriterBasePath}/${documentType}/${domain}/02_PDF/${reference}.pdf`;
}

function buildArchiveDocxPath(
  documentType: WriterPrefix,
  domain: WriterDomain,
  sourceReference: string,
) {
  return `${realWriterBasePath}/${documentType}/${domain}/99_ARCHIVES/01_DOCX/${sourceReference}.docx`;
}

function buildArchivePdfPath(
  documentType: WriterPrefix,
  domain: WriterDomain,
  sourceReference: string,
) {
  return `${realWriterBasePath}/${documentType}/${domain}/99_ARCHIVES/02_PDF/${sourceReference}.pdf`;
}

export function buildRealWriterPaths(input: RealWriterInput): RealWriterPaths {
  const sourceReference = input.sourceReference?.trim() || null;

  return {
    docx: buildDocxPath(input.documentType, input.domain, input.reference),
    pdf: buildPdfPath(input.documentType, input.domain, input.reference),
    archiveDocx:
      input.archiveRequired && sourceReference
        ? buildArchiveDocxPath(input.documentType, input.domain, sourceReference)
        : null,
    archivePdf:
      input.archiveRequired && sourceReference
        ? buildArchivePdfPath(input.documentType, input.domain, sourceReference)
        : null,
  };
}

export function validateRealWriterPaths(
  input: RealWriterInput,
  paths: RealWriterPaths,
) {
  const expectedDocxPath = buildDocxPath(
    input.documentType,
    input.domain,
    input.reference,
  );
  const expectedPdfPath = buildPdfPath(
    input.documentType,
    input.domain,
    input.reference,
  );

  return {
    docxConforms: paths.docx === expectedDocxPath,
    pdfConforms: paths.pdf === expectedPdfPath,
    docxFileNameConforms:
      path.posix.basename(paths.docx) === `${input.reference}.docx`,
    pdfFileNameConforms:
      path.posix.basename(paths.pdf) === `${input.reference}.pdf`,
    usesGedPhaseOneRoot: paths.docx.startsWith(`${realWriterBasePath}/`) &&
      paths.pdf.startsWith(`${realWriterBasePath}/`),
  };
}

export function buildFileWritePlan(
  input: RealWriterInput,
  paths: RealWriterPaths,
): FileWritePlan[] {
  return [
    {
      kind: "create",
      format: "docx",
      targetPath: paths.docx,
      sourcePlan: "docx-generation",
      execute: false,
      reason:
        `Preparation uniquement : le DOCX cible ${input.reference}.docx ne doit pas etre ecrit dans ZONE21_DEV.`,
    },
    {
      kind: "create",
      format: "pdf",
      targetPath: paths.pdf,
      sourcePlan: "pdf-generation",
      execute: false,
      reason:
        `Preparation uniquement : le PDF cible ${input.reference}.pdf ne doit pas etre ecrit dans ZONE21_DEV.`,
    },
  ];
}

export function buildArchivePlan(
  input: RealWriterInput,
  paths: RealWriterPaths,
): ArchivePlan {
  const sourceReference = input.sourceReference?.trim() || null;

  if (!input.archiveRequired || !sourceReference) {
    return {
      kind: "archive",
      archiveRequired: false,
      sourceReference,
      sourceDocxPath: null,
      sourcePdfPath: null,
      archiveDocxPath: null,
      archivePdfPath: null,
      execute: false,
      reason:
        "Aucun archivage reel prepare : aucune version source explicite n'a ete fournie.",
    };
  }

  return {
    kind: "archive",
    archiveRequired: true,
    sourceReference,
    sourceDocxPath: `${realWriterBasePath}/${input.documentType}/${input.domain}/01_DOCX/${sourceReference}.docx`,
    sourcePdfPath: `${realWriterBasePath}/${input.documentType}/${input.domain}/02_PDF/${sourceReference}.pdf`,
    archiveDocxPath: paths.archiveDocx,
    archivePdfPath: paths.archivePdf,
    execute: false,
    reason:
      "Archivage prepare en theorie uniquement : aucun deplacement de fichier n'est autorise a ce stade.",
  };
}

export function getRealWriterBasePath() {
  return realWriterBasePath;
}

export function getGedSandboxPath() {
  return path.resolve(gedConfig.sandbox.path);
}

export function isZone21DevPath(targetPath: string) {
  return targetPath.includes(zone21DevPrefix) ||
    targetPath.startsWith("/ZONE21_DEV/") ||
    targetPath === "/ZONE21_DEV";
}

export function assertSandboxPath(targetPath: string) {
  if (!gedConfig.security.realExecutionSandboxOnly) {
    throw new Error(
      "Execution sandbox obligatoire : toute ecriture reelle hors sandbox est interdite.",
    );
  }

  if (isZone21DevPath(targetPath)) {
    throw new Error(
      "Chemin interdit : aucune ecriture reelle n'est autorisee vers ZONE21_DEV.",
    );
  }

  const sandboxRoot = getGedSandboxPath();
  const resolvedTarget = path.resolve(targetPath);
  const sandboxPrefix = `${sandboxRoot}${path.sep}`;

  if (resolvedTarget !== sandboxRoot && !resolvedTarget.startsWith(sandboxPrefix)) {
    throw new Error(
      "Chemin interdit : toute execution reelle doit rester strictement dans GED_SANDBOX_PATH.",
    );
  }

  return {
    sandboxRoot,
    resolvedTarget,
  };
}

export function mapTheoreticalPathToSandbox(theoreticalPath: string) {
  if (!theoreticalPath.startsWith(zone21DevPrefix)) {
    throw new Error(
      "Chemin theorique invalide : le writer reel attend une cible logique issue de /ZONE21_DEV/.",
    );
  }

  const relativePath = theoreticalPath.slice(zone21DevPrefix.length);
  return path.join(getGedSandboxPath(), relativePath);
}
