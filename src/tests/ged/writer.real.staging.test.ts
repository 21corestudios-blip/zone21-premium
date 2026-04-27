import test from "node:test";
import assert from "node:assert/strict";
import { mkdir, readFile, rm, writeFile } from "node:fs/promises";
import path from "node:path";

import { resetActiveBaseStateCache } from "@/lib/rdm-service";
import {
  buildRealWriterInput,
  executeRealWriter,
} from "@/services/ged/writer/real/writer.real.service";
import type { WriterInput } from "@/services/ged/writer/writer.types";

function buildValidInput(): WriterInput {
  return {
    draftId: "GED-STAGING-REAL-0001",
    documentType: "NOTE-Z21",
    domain: "MEDIA",
    object: "BRIEF-CAMPAGNE",
    reference: "NOTE-Z21-MEDIA-BRIEF-CAMPAGNE-v2.0",
    title: "Brief staging reel",
    fileName: "NOTE-Z21-MEDIA-BRIEF-CAMPAGNE-v2.0.docx",
    versionTarget: "v2.0",
    pathTarget:
      "/ZONE21_DEV/90_GED_PHASE_1/NOTE-Z21/MEDIA/01_DOCX/NOTE-Z21-MEDIA-BRIEF-CAMPAGNE-v2.0.docx",
    validatedBy: "Admin documentaire",
    validationDecision: "validé",
    templateKey: "note-z21-standard-v1",
    contentSummary: "Execution reelle staging controlee.",
  };
}

function withWriterExecutionEnv<T>(callback: () => T | Promise<T>) {
  const previousEnv = process.env.NODE_ENV;
  const previousWriterEnabled = process.env.WRITER_ENABLED;
  const previousConfirmed = process.env.WRITER_REAL_EXECUTION_CONFIRMED;
  const previousBase = process.env.Z21_ACTIVE_BASE_PATH;
  const previousSandbox = process.env.GED_SANDBOX_PATH;

  return async (basePath: string, sandboxPath: string) => {
    process.env.NODE_ENV = "staging";
    process.env.WRITER_ENABLED = "true";
    process.env.WRITER_REAL_EXECUTION_CONFIRMED = "true";
    process.env.Z21_ACTIVE_BASE_PATH = basePath;
    process.env.GED_SANDBOX_PATH = sandboxPath;
    resetActiveBaseStateCache();

    try {
      return await callback();
    } finally {
      if (previousEnv === undefined) {
        delete process.env.NODE_ENV;
      } else {
        process.env.NODE_ENV = previousEnv;
      }
      if (previousWriterEnabled === undefined) {
        delete process.env.WRITER_ENABLED;
      } else {
        process.env.WRITER_ENABLED = previousWriterEnabled;
      }
      if (previousConfirmed === undefined) {
        delete process.env.WRITER_REAL_EXECUTION_CONFIRMED;
      } else {
        process.env.WRITER_REAL_EXECUTION_CONFIRMED = previousConfirmed;
      }
      if (previousBase === undefined) {
        delete process.env.Z21_ACTIVE_BASE_PATH;
      } else {
        process.env.Z21_ACTIVE_BASE_PATH = previousBase;
      }
      if (previousSandbox === undefined) {
        delete process.env.GED_SANDBOX_PATH;
      } else {
        process.env.GED_SANDBOX_PATH = previousSandbox;
      }
      resetActiveBaseStateCache();
    }
  };
}

async function setupControlledBase(baseRoot: string, input: WriterInput) {
  const currentDocx = path.join(
    baseRoot,
    "90_GED_PHASE_1/NOTE-Z21/MEDIA/01_DOCX/NOTE-Z21-MEDIA-BRIEF-CAMPAGNE-v1.9.docx",
  );
  const currentPdf = path.join(
    baseRoot,
    "90_GED_PHASE_1/NOTE-Z21/MEDIA/02_PDF/NOTE-Z21-MEDIA-BRIEF-CAMPAGNE-v1.9.pdf",
  );

  await mkdir(path.dirname(currentDocx), { recursive: true });
  await mkdir(path.dirname(currentPdf), { recursive: true });
  await writeFile(currentDocx, Buffer.from("old-docx"));
  await writeFile(currentPdf, Buffer.from("old-pdf"));

  const realInput = buildRealWriterInput(input, {
    archiveRequired: true,
    sourceReference: "NOTE-Z21-MEDIA-BRIEF-CAMPAGNE-v1.9",
    sourceVersion: "v1.9",
  });

  return realInput;
}

async function cleanup(basePath: string, sandboxPath: string) {
  await rm(basePath, { recursive: true, force: true });
  await rm(sandboxPath, { recursive: true, force: true });
}

test("ecriture reelle en sandbox puis ZONE21_DEV controle", async () => {
  const basePath = "/tmp/zone21_ged_staging_base_success/90_GED_PHASE_1/TEST";
  const sandboxPath = "/tmp/zone21_ged_staging_sandbox_success";
  const executeInEnv = withWriterExecutionEnv(async () => {
    const realInput = await setupControlledBase(basePath, buildValidInput());

    const result = await executeRealWriter(realInput, {
      executeDocxSandboxGeneration: async (input, sandboxTargetPath) => {
        await mkdir(path.dirname(sandboxTargetPath), { recursive: true });
        await writeFile(sandboxTargetPath, Buffer.from(`docx:${input.reference}`));
        return {
          format: "docx" as const,
          sandboxPath: sandboxTargetPath,
          verified: true,
          sizeBytes: 12,
        };
      },
      executePdfSandboxConversion: async (input, _docxPath, sandboxPdfPath) => {
        await mkdir(path.dirname(sandboxPdfPath), { recursive: true });
        await writeFile(sandboxPdfPath, Buffer.from(`pdf:${input.reference}`));
        return {
          format: "pdf" as const,
          sandboxPath: sandboxPdfPath,
          verified: true,
          sizeBytes: 10,
        };
      },
      copySandboxFileToZone21Dev: async (sandboxPathArg, zonePathArg) => {
        const zoneFilePath = path.join(
          basePath,
          zonePathArg.replace(/^\/ZONE21_DEV\//, ""),
        );
        await mkdir(path.dirname(zoneFilePath), { recursive: true });
        const data = await readFile(sandboxPathArg);
        await writeFile(zoneFilePath, data);
        return zoneFilePath;
      },
      moveZone21DevFileToArchive: async (sourceVirtualPath, archiveVirtualPath) => {
        const sourcePath = path.join(
          basePath,
          sourceVirtualPath.replace(/^\/ZONE21_DEV\//, ""),
        );
        const archivePath = path.join(
          basePath,
          archiveVirtualPath.replace(/^\/ZONE21_DEV\//, ""),
        );
        await mkdir(path.dirname(archivePath), { recursive: true });
        const data = await readFile(sourcePath);
        await writeFile(archivePath, data);
        await rm(sourcePath, { force: true });
        return { sourceSystemPath: sourcePath, archiveSystemPath: archivePath };
      },
      restoreZone21DevArchivedFile: async (archiveVirtualPath, sourceVirtualPath) => {
        const archivePath = path.join(
          basePath,
          archiveVirtualPath.replace(/^\/ZONE21_DEV\//, ""),
        );
        const sourcePath = path.join(
          basePath,
          sourceVirtualPath.replace(/^\/ZONE21_DEV\//, ""),
        );
        await mkdir(path.dirname(sourcePath), { recursive: true });
        const data = await readFile(archivePath);
        await writeFile(sourcePath, data);
        await rm(archivePath, { force: true });
        return { archiveSystemPath: archivePath, sourceSystemPath: sourcePath };
      },
      deleteZone21DevFile: async (virtualPath) => {
        const filePath = path.join(basePath, virtualPath.replace(/^\/ZONE21_DEV\//, ""));
        await rm(filePath, { force: true });
      },
      verifyZone21DevFile: async (virtualPath) => {
        const filePath = path.join(basePath, virtualPath.replace(/^\/ZONE21_DEV\//, ""));
        const content = await readFile(filePath);
        return { systemPath: filePath, exists: true, sizeBytes: content.byteLength };
      },
    });

    const writtenDocx = await readFile(result.docxPath, "utf8");
    const writtenPdf = await readFile(result.pdfPath, "utf8");

    assert.equal(result.status, "written");
    assert.equal(result.rereadConfirmed, true);
    assert.ok(writtenDocx.includes("NOTE-Z21-MEDIA-BRIEF-CAMPAGNE-v2.0"));
    assert.ok(writtenPdf.includes("NOTE-Z21-MEDIA-BRIEF-CAMPAGNE-v2.0"));
  });

  try {
    await executeInEnv(basePath, sandboxPath);
  } finally {
    await cleanup(basePath, sandboxPath);
  }
});

test("rollback sur erreur", async () => {
  const basePath = "/tmp/zone21_ged_staging_base_rollback/90_GED_PHASE_1/TEST";
  const sandboxPath = "/tmp/zone21_ged_staging_sandbox_rollback";
  const executeInEnv = withWriterExecutionEnv(async () => {
    const realInput = await setupControlledBase(basePath, buildValidInput());

    await assert.rejects(
      async () => {
        await executeRealWriter(realInput, {
          executeDocxSandboxGeneration: async (_input, sandboxTargetPath) => {
            await mkdir(path.dirname(sandboxTargetPath), { recursive: true });
            await writeFile(sandboxTargetPath, Buffer.from("docx"));
            return {
              format: "docx" as const,
              sandboxPath: sandboxTargetPath,
              verified: true,
              sizeBytes: 4,
            };
          },
          executePdfSandboxConversion: async (_input, _docxPath, sandboxPdfPath) => {
            await mkdir(path.dirname(sandboxPdfPath), { recursive: true });
            await writeFile(sandboxPdfPath, Buffer.from("pdf"));
            return {
              format: "pdf" as const,
              sandboxPath: sandboxPdfPath,
              verified: true,
              sizeBytes: 3,
            };
          },
          copySandboxFileToZone21Dev: async (sandboxPathArg, zonePathArg) => {
            const zoneFilePath = path.join(
              basePath,
              zonePathArg.replace(/^\/ZONE21_DEV\//, ""),
            );
            await mkdir(path.dirname(zoneFilePath), { recursive: true });
            const data = await readFile(sandboxPathArg);
            await writeFile(zoneFilePath, data);
            if (zonePathArg.endsWith(".pdf")) {
              throw new Error("forced-copy-failure");
            }
            return zoneFilePath;
          },
          moveZone21DevFileToArchive: async (sourceVirtualPath, archiveVirtualPath) => {
            const sourcePath = path.join(
              basePath,
              sourceVirtualPath.replace(/^\/ZONE21_DEV\//, ""),
            );
            const archivePath = path.join(
              basePath,
              archiveVirtualPath.replace(/^\/ZONE21_DEV\//, ""),
            );
            await mkdir(path.dirname(archivePath), { recursive: true });
            const data = await readFile(sourcePath);
            await writeFile(archivePath, data);
            await rm(sourcePath, { force: true });
            return { sourceSystemPath: sourcePath, archiveSystemPath: archivePath };
          },
          restoreZone21DevArchivedFile: async (archiveVirtualPath, sourceVirtualPath) => {
            const archivePath = path.join(
              basePath,
              archiveVirtualPath.replace(/^\/ZONE21_DEV\//, ""),
            );
            const sourcePath = path.join(
              basePath,
              sourceVirtualPath.replace(/^\/ZONE21_DEV\//, ""),
            );
            await mkdir(path.dirname(sourcePath), { recursive: true });
            const data = await readFile(archivePath);
            await writeFile(sourcePath, data);
            await rm(archivePath, { force: true });
            return { archiveSystemPath: archivePath, sourceSystemPath: sourcePath };
          },
          deleteZone21DevFile: async (virtualPath) => {
            const filePath = path.join(basePath, virtualPath.replace(/^\/ZONE21_DEV\//, ""));
            await rm(filePath, { force: true });
          },
          verifyZone21DevFile: async (virtualPath) => {
            const filePath = path.join(basePath, virtualPath.replace(/^\/ZONE21_DEV\//, ""));
            const content = await readFile(filePath);
            return { systemPath: filePath, exists: true, sizeBytes: content.byteLength };
          },
        });
      },
      /forced-copy-failure/,
    );

    const restoredDocx = await readFile(
      path.join(
        basePath,
        "90_GED_PHASE_1/NOTE-Z21/MEDIA/01_DOCX/NOTE-Z21-MEDIA-BRIEF-CAMPAGNE-v1.9.docx",
      ),
      "utf8",
    );
    const restoredPdf = await readFile(
      path.join(
        basePath,
        "90_GED_PHASE_1/NOTE-Z21/MEDIA/02_PDF/NOTE-Z21-MEDIA-BRIEF-CAMPAGNE-v1.9.pdf",
      ),
      "utf8",
    );

    assert.equal(restoredDocx, "old-docx");
    assert.equal(restoredPdf, "old-pdf");
  });

  try {
    await executeInEnv(basePath, sandboxPath);
  } finally {
    await cleanup(basePath, sandboxPath);
  }
});

test("refus hors staging", async () => {
  const previousEnv = process.env.NODE_ENV;
  const previousWriterEnabled = process.env.WRITER_ENABLED;
  const previousConfirmed = process.env.WRITER_REAL_EXECUTION_CONFIRMED;

  process.env.NODE_ENV = "development";
  process.env.WRITER_ENABLED = "true";
  process.env.WRITER_REAL_EXECUTION_CONFIRMED = "true";

  try {
    await assert.rejects(
      async () => {
        await executeRealWriter(buildRealWriterInput(buildValidInput()));
      },
      /staging/,
    );
  } finally {
    if (previousEnv === undefined) delete process.env.NODE_ENV;
    else process.env.NODE_ENV = previousEnv;
    if (previousWriterEnabled === undefined) delete process.env.WRITER_ENABLED;
    else process.env.WRITER_ENABLED = previousWriterEnabled;
    if (previousConfirmed === undefined) {
      delete process.env.WRITER_REAL_EXECUTION_CONFIRMED;
    } else {
      process.env.WRITER_REAL_EXECUTION_CONFIRMED = previousConfirmed;
    }
  }
});
