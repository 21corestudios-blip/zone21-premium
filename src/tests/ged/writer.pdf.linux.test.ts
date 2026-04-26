import test from "node:test";
import assert from "node:assert/strict";
import { mkdir, readFile, rm, stat, writeFile } from "node:fs/promises";

import {
  buildLinuxPdfCommandPreview,
  executeLinuxPdfConversion,
} from "@/services/ged/pdf/linux-pdf.service";
import { buildPdfGenerationPlan } from "@/services/ged/writer/real/writer.real.pdf";
import type { RealWriterInput } from "@/services/ged/writer/real/writer.real.types";

function buildInput(): RealWriterInput {
  return {
    draftId: "GED-PDF-LINUX-0001",
    documentType: "NOTE-Z21",
    domain: "MEDIA",
    object: "BRIEF-CAMPAGNE",
    reference: "NOTE-Z21-MEDIA-BRIEF-CAMPAGNE-v1.0",
    title: "Brief campagne media linux",
    fileName: "NOTE-Z21-MEDIA-BRIEF-CAMPAGNE-v1.0.docx",
    versionTarget: "v1.0",
    pathTarget:
      "/ZONE21_DEV/90_GED_PHASE_1/NOTE-Z21/MEDIA/01_DOCX/NOTE-Z21-MEDIA-BRIEF-CAMPAGNE-v1.0.docx",
    validatedBy: "Admin documentaire",
    validationDecision: "validé",
    templateKey: "note-z21-standard-v1",
    contentSummary: "Pipeline PDF Linux isole.",
    sourceReference: null,
    sourceVersion: null,
    archiveRequired: false,
  };
}

async function cleanup(paths: string[]) {
  for (const targetPath of paths) {
    await rm(targetPath, { force: true, recursive: true });
  }
}

function withPdfEngine<T>(engine: "linux" | "local", callback: () => T) {
  const previousEngine = process.env.PDF_ENGINE;

  process.env.PDF_ENGINE = engine;

  try {
    return callback();
  } finally {
    if (previousEngine === undefined) {
      delete process.env.PDF_ENGINE;
    } else {
      process.env.PDF_ENGINE = previousEngine;
    }
  }
}

test("conversion OK", async () => {
  const sandboxDocxPath = "/tmp/zone21_pdf_linux_test/source.docx";
  const sandboxPdfPath =
    "/tmp/zone21_pdf_linux_test/NOTE-Z21-MEDIA-BRIEF-CAMPAGNE-v1.0.pdf";
  let cleanupCalled = false;

  try {
    await mkdir("/tmp/zone21_pdf_linux_test", { recursive: true });
    await writeFile(sandboxDocxPath, Buffer.from("docx"));

    const result = await executeLinuxPdfConversion(
      buildInput(),
      sandboxDocxPath,
      sandboxPdfPath,
      {
        ensureLocalDirectory: async (targetDir) => {
          await mkdir(targetDir, { recursive: true });
        },
        removeLocalFile: async (targetPath) => {
          await rm(targetPath, { force: true });
        },
        statLocalFile: async (targetPath) => stat(targetPath),
        prepareRemoteDirectories: async () => undefined,
        copyHostDocxToRemote: async () => undefined,
        executeRemoteConversion: async () => undefined,
        copyRemotePdfToHost: async (_jobPaths, hostPdfPath) => {
          await writeFile(hostPdfPath, Buffer.from("pdf-linux"));
        },
        cleanupRemoteArtifacts: async () => {
          cleanupCalled = true;
        },
      },
    );

    const pdfBuffer = await readFile(sandboxPdfPath);

    assert.equal(result.verified, true);
    assert.ok(result.sizeBytes > 0);
    assert.ok(result.commandExecuted?.includes("limactl shell"));
    assert.equal(pdfBuffer.byteLength > 0, true);
    assert.equal(cleanupCalled, true);
  } finally {
    await cleanup([
      "/tmp/zone21_pdf_linux_test/source.docx",
      "/tmp/zone21_pdf_linux_test/result.pdf",
      "/tmp/zone21_pdf_linux_test",
    ]);
  }
});

test("conversion KO si PDF vide", async () => {
  const sandboxDocxPath = "/tmp/zone21_pdf_linux_test/source-empty.docx";
  const sandboxPdfPath = "/tmp/zone21_pdf_linux_test/result-empty.pdf";

  try {
    await mkdir("/tmp/zone21_pdf_linux_test", { recursive: true });
    await writeFile(sandboxDocxPath, Buffer.from("docx"));

    const result = await executeLinuxPdfConversion(
      buildInput(),
      sandboxDocxPath,
      sandboxPdfPath,
      {
        ensureLocalDirectory: async (targetDir) => {
          await mkdir(targetDir, { recursive: true });
        },
        removeLocalFile: async (targetPath) => {
          await rm(targetPath, { force: true });
        },
        statLocalFile: async (targetPath) => stat(targetPath),
        prepareRemoteDirectories: async () => undefined,
        copyHostDocxToRemote: async () => undefined,
        executeRemoteConversion: async () => undefined,
        copyRemotePdfToHost: async (_jobPaths, hostPdfPath) => {
          await writeFile(hostPdfPath, Buffer.alloc(0));
        },
        cleanupRemoteArtifacts: async () => undefined,
      },
    );

    assert.equal(result.verified, false);
    assert.match(
      result.reason ?? "",
      /vide|incoherent/,
    );

    await assert.rejects(async () => stat(sandboxPdfPath), /ENOENT/);
  } finally {
    await cleanup([
      "/tmp/zone21_pdf_linux_test/source-empty.docx",
      "/tmp/zone21_pdf_linux_test/result-empty.pdf",
      "/tmp/zone21_pdf_linux_test",
    ]);
  }
});

test("timeout conversion", async () => {
  const sandboxDocxPath = "/tmp/zone21_pdf_linux_test/source-timeout.docx";
  const sandboxPdfPath = "/tmp/zone21_pdf_linux_test/result-timeout.pdf";

  try {
    await mkdir("/tmp/zone21_pdf_linux_test", { recursive: true });
    await writeFile(sandboxDocxPath, Buffer.from("docx"));

    const result = await executeLinuxPdfConversion(
      buildInput(),
      sandboxDocxPath,
      sandboxPdfPath,
      {
        ensureLocalDirectory: async (targetDir) => {
          await mkdir(targetDir, { recursive: true });
        },
        removeLocalFile: async (targetPath) => {
          await rm(targetPath, { force: true });
        },
        statLocalFile: async (targetPath) => stat(targetPath),
        prepareRemoteDirectories: async () => undefined,
        copyHostDocxToRemote: async () => undefined,
        executeRemoteConversion: async () => {
          throw new Error("timeout while waiting for remote LibreOffice");
        },
        copyRemotePdfToHost: async () => undefined,
        cleanupRemoteArtifacts: async () => undefined,
      },
    );

    assert.equal(result.verified, false);
    assert.match(result.reason ?? "", /timeout/);
  } finally {
    await cleanup([
      "/tmp/zone21_pdf_linux_test/source-timeout.docx",
      "/tmp/zone21_pdf_linux_test/result-timeout.pdf",
      "/tmp/zone21_pdf_linux_test",
    ]);
  }
});

test("fallback local", () => {
  const preview = buildLinuxPdfCommandPreview(
    buildInput(),
    "/tmp/source.docx",
    "/tmp/result.pdf",
  );
  const localPlan = withPdfEngine("local", () =>
    buildPdfGenerationPlan(
      buildInput(),
      "/ZONE21_DEV/90_GED_PHASE_1/NOTE-Z21/MEDIA/02_PDF/NOTE-Z21-MEDIA-BRIEF-CAMPAGNE-v1.0.pdf",
    )
  );

  assert.ok(preview.includes("limactl shell"));
  assert.ok(localPlan.commandPreview?.includes("LibreOffice.app"));
});
