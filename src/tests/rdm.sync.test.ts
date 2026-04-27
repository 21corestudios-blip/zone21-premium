import assert from "node:assert/strict";
import { mkdirSync, rmSync } from "node:fs";
import { readFile, rm, writeFile } from "node:fs/promises";
import os from "node:os";
import path from "node:path";
import test from "node:test";

import { rdmRecords } from "@/data/rdm.records";
import type { CollaboratorRole } from "@/lib/permissions";
import {
  getDownloadPayload,
  getRdmRecordById,
  listRdmRecords,
  resetActiveBaseStateCache,
} from "@/lib/rdm-service";
import type { RdmRecord } from "@/lib/rdm-types";

const testRole: CollaboratorRole = "admin_documentaire";

function createSyncRecord(): RdmRecord {
  return {
    id: "RDM-Z21-SYNC-TEST",
    reference: "NOTE-Z21-MEDIA-BRIEF-CAMPAGNE-v1.1",
    title: "Brief campagne sync test",
    type: "NOTE",
    status: "Validé",
    version: "v1.1",
    docxPath:
      "/ZONE21_DEV/90_GED_PHASE_1/TEST/NOTE-Z21/MEDIA/01_DOCX/NOTE-Z21-MEDIA-BRIEF-CAMPAGNE-v1.1.docx",
    pdfPath:
      "/ZONE21_DEV/90_GED_PHASE_1/TEST/NOTE-Z21/MEDIA/02_PDF/NOTE-Z21-MEDIA-BRIEF-CAMPAGNE-v1.1.pdf",
    ownerEntity: "ZONE 21",
    category: "GED phase 1 test",
    createdAt: "27/04/2026",
    updatedAt: "27/04/2026",
    isNormativeSource: false,
    normativeSources: ["ZONE21_DEV"],
    collaboratorAccess: "Oui",
    confidentiality: "Public interne",
    replaces: "NOTE-Z21-MEDIA-BRIEF-CAMPAGNE-v1.0",
    replacedBy: null,
    registerDecision: "DS-009A-29",
    observations: "Record temporaire pour la synchronisation RDM.",
    sourceOfTruth: "ZONE21_DEV",
    governanceSyncStatus: "à vérifier",
    fileAvailability: {
      docx: "à vérifier",
      pdf: "à vérifier",
    },
    allowedRoles: [
      "direction",
      "admin_documentaire",
      "validateur",
      "editeur",
      "contributeur",
      "lecteur",
    ],
    availableFormats: ["docx", "pdf"],
  };
}

function withRdmSyncContext<T>(callback: (context: {
  basePath: string;
  docxPath: string;
  pdfPath: string;
  record: RdmRecord;
}) => T | Promise<T>) {
  const previousBasePath = process.env.Z21_ACTIVE_BASE_PATH;
  const basePath = path.join(
    os.tmpdir(),
    "zone21_rdm_sync",
    "90_GED_PHASE_1",
    "TEST",
  );
  const record = createSyncRecord();
  const docxPath = path.join(
    basePath,
    "NOTE-Z21/MEDIA/01_DOCX/NOTE-Z21-MEDIA-BRIEF-CAMPAGNE-v1.1.docx",
  );
  const pdfPath = path.join(
    basePath,
    "NOTE-Z21/MEDIA/02_PDF/NOTE-Z21-MEDIA-BRIEF-CAMPAGNE-v1.1.pdf",
  );

  mkdirSync(path.dirname(docxPath), { recursive: true });
  mkdirSync(path.dirname(pdfPath), { recursive: true });
  rdmRecords.push(record);
  process.env.Z21_ACTIVE_BASE_PATH = basePath;
  resetActiveBaseStateCache();

  const run = async () => callback({ basePath, docxPath, pdfPath, record });

  return run().finally(() => {
    rdmRecords.splice(
      rdmRecords.findIndex((item) => item.id === record.id),
      1,
    );
    if (previousBasePath === undefined) {
      delete process.env.Z21_ACTIVE_BASE_PATH;
    } else {
      process.env.Z21_ACTIVE_BASE_PATH = previousBasePath;
    }
    resetActiveBaseStateCache();
    rmSync(path.join(os.tmpdir(), "zone21_rdm_sync"), {
      recursive: true,
      force: true,
    });
  });
}

test("write -> visible immediatement dans le RDM et telechargements OK", async () => {
  await withRdmSyncContext(async ({ docxPath, pdfPath, record }) => {
    await writeFile(docxPath, Buffer.from("docx-sync-ok"));
    await writeFile(pdfPath, Buffer.from("pdf-sync-ok"));
    resetActiveBaseStateCache();

    const listedRecord = listRdmRecords({ role: testRole }).find((item) =>
      item.id === record.id
    );
    const detailedRecord = getRdmRecordById(record.id, testRole);
    const docxPayload = await getDownloadPayload({
      id: record.id,
      role: testRole,
      format: "docx",
    });
    const pdfPayload = await getDownloadPayload({
      id: record.id,
      role: testRole,
      format: "pdf",
    });

    assert.equal(listedRecord?.governanceSyncStatus, "à jour");
    assert.equal(detailedRecord?.governanceSyncStatus, "à jour");
    assert.equal(detailedRecord?.fileAvailability.docx, "présent");
    assert.equal(detailedRecord?.fileAvailability.pdf, "présent");
    assert.ok(docxPayload?.buffer);
    assert.ok(pdfPayload?.buffer);
    assert.equal((await readFile(docxPath)).byteLength > 0, true);
    assert.equal((await readFile(pdfPath)).byteLength > 0, true);
  });
});

test("suppression fichier -> RDM detecte immediatement l'incoherence", async () => {
  await withRdmSyncContext(async ({ docxPath, pdfPath, record }) => {
    await writeFile(docxPath, Buffer.from("docx-sync-ok"));
    await writeFile(pdfPath, Buffer.from("pdf-sync-ok"));
    await rm(pdfPath);
    resetActiveBaseStateCache();

    const detailedRecord = getRdmRecordById(record.id, testRole);
    const pdfPayload = await getDownloadPayload({
      id: record.id,
      role: testRole,
      format: "pdf",
    });

    assert.equal(detailedRecord?.governanceSyncStatus, "à vérifier");
    assert.equal(detailedRecord?.fileAvailability.docx, "présent");
    assert.equal(detailedRecord?.fileAvailability.pdf, "manquant");
    assert.equal(pdfPayload?.buffer, null);
    assert.equal(pdfPayload?.baseError, null);
  });
});

test("base active indisponible -> RDM remonte un statut bloque", async () => {
  const previousBasePath = process.env.Z21_ACTIVE_BASE_PATH;
  const record = createSyncRecord();

  rdmRecords.push(record);
  process.env.Z21_ACTIVE_BASE_PATH = path.join(
    os.tmpdir(),
    "zone21_rdm_sync_missing",
    "90_GED_PHASE_1",
    "TEST",
  );
  resetActiveBaseStateCache();

  try {
    const detailedRecord = getRdmRecordById(record.id, testRole);
    const pdfPayload = await getDownloadPayload({
      id: record.id,
      role: testRole,
      format: "pdf",
    });

    assert.equal(detailedRecord?.governanceSyncStatus, "bloqué");
    assert.equal(detailedRecord?.fileAvailability.docx, "à vérifier");
    assert.equal(detailedRecord?.fileAvailability.pdf, "à vérifier");
    assert.equal(pdfPayload?.buffer, null);
    assert.match(
      pdfPayload?.baseError ?? "",
      /Z21_ACTIVE_BASE_PATH pointe vers un dossier introuvable/,
    );
  } finally {
    rdmRecords.splice(
      rdmRecords.findIndex((item) => item.id === record.id),
      1,
    );
    if (previousBasePath === undefined) {
      delete process.env.Z21_ACTIVE_BASE_PATH;
    } else {
      process.env.Z21_ACTIVE_BASE_PATH = previousBasePath;
    }
    resetActiveBaseStateCache();
  }
});
