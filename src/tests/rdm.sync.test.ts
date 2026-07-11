import assert from "node:assert/strict";
import { existsSync, mkdirSync, rmSync } from "node:fs";
import { readFile, writeFile } from "node:fs/promises";
import os from "node:os";
import path from "node:path";
import test from "node:test";

import type { CollaboratorRole } from "@/lib/permissions";
import {
  getDownloadPayload,
  getRdmRecordById,
  listRdmRecords,
  resetActiveBaseStateCache,
  saveRdmRecord,
} from "@/lib/rdm-service";
import type { RdmRegistry } from "@/lib/rdm-types";

const testRole: CollaboratorRole = "admin";
const registryRelativePath =
  "00_MASTER_SYSTEM/00_RDM_CENTRAL/RDM-Z21H-CENTRAL-DOCUMENTS-OFFICIELS-v1.0.json";

function createEmptyRegistry(): RdmRegistry {
  return {
    schemaVersion: 1,
    reference: "RDM-Z21H-CENTRAL-DOCUMENTS-OFFICIELS-v1.0",
    title: "RDM central officiel minimal ZONE 21 HOLDING",
    version: "v1.0",
    status: "A_CREER",
    sourceOfTruth: "ZONE 21 HOLDING",
    updatedAt: "2026-05-28T00:00:00.000Z",
    updatedBy: "test",
    revision: 1,
    documents: [],
    eventLog: [],
  };
}

async function withRdmSyncContext<T>(
  callback: (context: {
    basePath: string;
    docxPath: string;
    pdfPath: string;
    registryPath: string;
  }) => T | Promise<T>,
) {
  const previousBasePath = process.env.Z21_ACTIVE_BASE_PATH;
  const basePath = path.join(os.tmpdir(), "zone21_rdm_sync_official");
  const registryPath = path.join(basePath, registryRelativePath);
  const docxPath = path.join(
    basePath,
    "00_MASTER_SYSTEM/00_RDM_CENTRAL/01_DOCX/NOTE-Z21H-GOV-SYNC-TEST-v1.0.docx",
  );
  const pdfPath = path.join(
    basePath,
    "00_MASTER_SYSTEM/00_RDM_CENTRAL/02_PDF/NOTE-Z21H-GOV-SYNC-TEST-v1.0.pdf",
  );

  rmSync(basePath, { recursive: true, force: true });
  mkdirSync(path.dirname(registryPath), { recursive: true });
  await writeFile(registryPath, `${JSON.stringify(createEmptyRegistry(), null, 2)}\n`);
  process.env.Z21_ACTIVE_BASE_PATH = basePath;
  resetActiveBaseStateCache();

  try {
    return await callback({ basePath, docxPath, pdfPath, registryPath });
  } finally {
    if (previousBasePath === undefined) {
      delete process.env.Z21_ACTIVE_BASE_PATH;
    } else {
      process.env.Z21_ACTIVE_BASE_PATH = previousBasePath;
    }
    resetActiveBaseStateCache();
    rmSync(basePath, { recursive: true, force: true });
  }
}

test("RDM Drive vide -> aucun document integre au depart", async () => {
  await withRdmSyncContext(async () => {
    const records = listRdmRecords({ role: testRole });

    assert.equal(records.length, 0);
  });
});

test("ecriture web -> Drive, archive, relecture et telechargements OK", async () => {
  await withRdmSyncContext(async ({ docxPath, pdfPath, registryPath }) => {
    mkdirSync(path.dirname(docxPath), { recursive: true });
    mkdirSync(path.dirname(pdfPath), { recursive: true });
    await writeFile(docxPath, Buffer.from("docx-sync-ok"));
    await writeFile(pdfPath, Buffer.from("pdf-sync-ok"));

    const result = saveRdmRecord({
      reference: "NOTE-Z21H-GOV-SYNC-TEST-v1.0",
      title: "Note sync test",
      type: "NOTE",
      status: "BROUILLON",
      version: "v1.0",
      docxPath:
        "/ZONE 21 HOLDING/00_MASTER_SYSTEM/00_RDM_CENTRAL/01_DOCX/NOTE-Z21H-GOV-SYNC-TEST-v1.0.docx",
      pdfPath:
        "/ZONE 21 HOLDING/00_MASTER_SYSTEM/00_RDM_CENTRAL/02_PDF/NOTE-Z21H-GOV-SYNC-TEST-v1.0.pdf",
      ownerEntity: "Z21H",
      category: "RDM central",
      observations: "Record temporaire pour la synchronisation RDM.",
      expectedRegistryRevision: 1,
      actor: "test",
      action: "create",
    });
    resetActiveBaseStateCache();

    const listedRecord = listRdmRecords({ role: testRole }).find((item) =>
      item.id === result.record.id
    );
    const detailedRecord = getRdmRecordById(result.record.id, testRole);
    const docxPayload = await getDownloadPayload({
      id: result.record.id,
      role: testRole,
      format: "docx",
    });
    const pdfPayload = await getDownloadPayload({
      id: result.record.id,
      role: testRole,
      format: "pdf",
    });
    const registry = JSON.parse(await readFile(registryPath, "utf-8"));

    assert.equal(listedRecord?.governanceSyncStatus, "SYNCHRONISE");
    assert.equal(detailedRecord?.governanceSyncStatus, "SYNCHRONISE");
    assert.equal(detailedRecord?.fileAvailability.docx, "présent");
    assert.equal(detailedRecord?.fileAvailability.pdf, "présent");
    assert.ok(docxPayload?.buffer);
    assert.ok(pdfPayload?.buffer);
    assert.equal(registry.documents.length, 1);
    assert.equal(registry.revision, 2);
    assert.ok(result.archivedPath);
    assert.equal(existsSync(result.archivedPath ?? ""), true);
  });
});

test("fichier manquant -> RDM detecte immediatement l'incoherence", async () => {
  await withRdmSyncContext(async ({ docxPath }) => {
    mkdirSync(path.dirname(docxPath), { recursive: true });
    await writeFile(docxPath, Buffer.from("docx-sync-ok"));

    const result = saveRdmRecord({
      reference: "NOTE-Z21H-GOV-SYNC-TEST-v1.0",
      title: "Note sync test",
      type: "NOTE",
      status: "BROUILLON",
      version: "v1.0",
      docxPath:
        "/ZONE 21 HOLDING/00_MASTER_SYSTEM/00_RDM_CENTRAL/01_DOCX/NOTE-Z21H-GOV-SYNC-TEST-v1.0.docx",
      pdfPath:
        "/ZONE 21 HOLDING/00_MASTER_SYSTEM/00_RDM_CENTRAL/02_PDF/NOTE-Z21H-GOV-SYNC-TEST-v1.0.pdf",
      ownerEntity: "Z21H",
      actor: "test",
      action: "create",
    });
    resetActiveBaseStateCache();

    const detailedRecord = getRdmRecordById(result.record.id, testRole);
    const pdfPayload = await getDownloadPayload({
      id: result.record.id,
      role: testRole,
      format: "pdf",
    });

    assert.equal(detailedRecord?.governanceSyncStatus, "A_VERIFIER");
    assert.equal(detailedRecord?.fileAvailability.docx, "présent");
    assert.equal(detailedRecord?.fileAvailability.pdf, "manquant");
    assert.equal(pdfPayload?.buffer, null);
    assert.equal(pdfPayload?.baseError, null);
  });
});

test("base active indisponible -> RDM remonte un statut bloque", async () => {
  const previousBasePath = process.env.Z21_ACTIVE_BASE_PATH;

  process.env.Z21_ACTIVE_BASE_PATH = path.join(
    os.tmpdir(),
    "zone21_rdm_sync_missing",
  );
  resetActiveBaseStateCache();

  try {
    assert.throws(
      () =>
        saveRdmRecord({
          reference: "NOTE-Z21H-GOV-SYNC-TEST-v1.0",
          title: "Note sync test",
          type: "NOTE",
          ownerEntity: "Z21H",
          actor: "test",
          action: "create",
        }),
      /Z21_ACTIVE_BASE_PATH pointe vers un dossier introuvable/,
    );
  } finally {
    if (previousBasePath === undefined) {
      delete process.env.Z21_ACTIVE_BASE_PATH;
    } else {
      process.env.Z21_ACTIVE_BASE_PATH = previousBasePath;
    }
    resetActiveBaseStateCache();
  }
});
