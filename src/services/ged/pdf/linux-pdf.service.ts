import { execFile } from "node:child_process";
import { mkdir, rm, stat } from "node:fs/promises";
import path from "node:path";
import { promisify } from "node:util";

import { gedConfig } from "@/config/ged.config";
import type { RealWriterInput, SandboxExecutionResult } from "@/services/ged/writer/real/writer.real.types";

const execFileAsync = promisify(execFile);

interface LinuxPdfJobPaths {
  remoteRoot: string;
  remoteInputDir: string;
  remoteOutputDir: string;
  remoteDocxPath: string;
  remotePdfPath: string;
}

export interface LinuxPdfServiceDependencies {
  ensureLocalDirectory: (targetDir: string) => Promise<void>;
  removeLocalFile: (targetPath: string) => Promise<void>;
  statLocalFile: (targetPath: string) => Promise<{ size: number }>;
  prepareRemoteDirectories: (jobPaths: LinuxPdfJobPaths) => Promise<void>;
  copyHostDocxToRemote: (
    hostDocxPath: string,
    jobPaths: LinuxPdfJobPaths,
  ) => Promise<void>;
  executeRemoteConversion: (
    input: RealWriterInput,
    jobPaths: LinuxPdfJobPaths,
  ) => Promise<void>;
  copyRemotePdfToHost: (
    jobPaths: LinuxPdfJobPaths,
    hostPdfPath: string,
  ) => Promise<void>;
  cleanupRemoteArtifacts: (jobPaths: LinuxPdfJobPaths) => Promise<void>;
}

function getLinuxPdfInstance() {
  return gedConfig.pdf.linuxInstance;
}

function buildRemoteShellCommand(script: string) {
  return [
    "shell",
    getLinuxPdfInstance(),
    "/bin/bash",
    "-lc",
    script,
  ];
}

async function runLimactlCommand(args: string[]) {
  await execFileAsync("limactl", args, {
    timeout: gedConfig.conversionTimeoutMs,
  });
}

function buildLinuxPdfJobPaths(reference: string): LinuxPdfJobPaths {
  const remoteRoot = path.posix.join(gedConfig.pdf.linuxPath, reference);

  return {
    remoteRoot,
    remoteInputDir: path.posix.join(remoteRoot, "in"),
    remoteOutputDir: path.posix.join(remoteRoot, "out"),
    remoteDocxPath: path.posix.join(remoteRoot, "in", `${reference}.docx`),
    remotePdfPath: path.posix.join(remoteRoot, "out", `${reference}.pdf`),
  };
}

function buildRemoteCommandPreview(
  input: RealWriterInput,
  jobPaths: LinuxPdfJobPaths,
) {
  return [
    "limactl shell",
    gedConfig.pdf.linuxInstance,
    "soffice --headless --convert-to pdf",
    `--outdir "${jobPaths.remoteOutputDir}"`,
    `"${jobPaths.remoteDocxPath}"`,
    `# reference=${input.reference}`,
  ].join(" ");
}

const defaultLinuxPdfServiceDependencies: LinuxPdfServiceDependencies = {
  ensureLocalDirectory: async (targetDir) => {
    await mkdir(targetDir, { recursive: true });
  },
  removeLocalFile: async (targetPath) => {
    await rm(targetPath, { force: true });
  },
  statLocalFile: async (targetPath) => stat(targetPath),
  prepareRemoteDirectories: async (jobPaths) => {
    if (gedConfig.pdf.linuxMode !== "local") {
      throw new Error("Le mode PDF_LINUX_MODE=remote n'est pas implemente.");
    }

    await runLimactlCommand(
      buildRemoteShellCommand(
        `set -e; mkdir -p "${jobPaths.remoteInputDir}" "${jobPaths.remoteOutputDir}"`,
      ),
    );
  },
  copyHostDocxToRemote: async (hostDocxPath, jobPaths) => {
    await runLimactlCommand([
      "copy",
      "--backend=scp",
      hostDocxPath,
      `${getLinuxPdfInstance()}:${jobPaths.remoteDocxPath}`,
    ]);
  },
  executeRemoteConversion: async (_input, jobPaths) => {
    await runLimactlCommand(
      buildRemoteShellCommand(
        [
          "set -e",
          `rm -f "${jobPaths.remotePdfPath}"`,
          `soffice --headless --convert-to pdf --outdir "${jobPaths.remoteOutputDir}" "${jobPaths.remoteDocxPath}"`,
        ].join("; "),
      ),
    );
  },
  copyRemotePdfToHost: async (jobPaths, hostPdfPath) => {
    await runLimactlCommand([
      "copy",
      "--backend=scp",
      `${getLinuxPdfInstance()}:${jobPaths.remotePdfPath}`,
      hostPdfPath,
    ]);
  },
  cleanupRemoteArtifacts: async (jobPaths) => {
    try {
      await runLimactlCommand(
        buildRemoteShellCommand(`rm -rf "${jobPaths.remoteRoot}"`),
      );
    } catch {
      // Best-effort cleanup only.
    }
  },
};

export function buildLinuxPdfCommandPreview(
  input: RealWriterInput,
  sandboxDocxPath: string,
  sandboxPdfPath: string,
) {
  void sandboxDocxPath;
  void sandboxPdfPath;
  return buildRemoteCommandPreview(input, buildLinuxPdfJobPaths(input.reference));
}

export async function executeLinuxPdfConversion(
  input: RealWriterInput,
  sandboxDocxPath: string,
  sandboxPdfPath: string,
  dependencies: LinuxPdfServiceDependencies = defaultLinuxPdfServiceDependencies,
): Promise<SandboxExecutionResult> {
  const jobPaths = buildLinuxPdfJobPaths(input.reference);
  const commandPreview = buildRemoteCommandPreview(input, jobPaths);

  await dependencies.ensureLocalDirectory(path.dirname(sandboxPdfPath));

  try {
    await dependencies.prepareRemoteDirectories(jobPaths);
    await dependencies.copyHostDocxToRemote(sandboxDocxPath, jobPaths);
    await dependencies.executeRemoteConversion(input, jobPaths);
    await dependencies.copyRemotePdfToHost(jobPaths, sandboxPdfPath);

    const fileStats = await dependencies.statLocalFile(sandboxPdfPath);
    const fileNameMatches =
      path.basename(sandboxPdfPath) === `${input.reference}.pdf`;
    const verified = fileStats.size > 0 && fileNameMatches;

    if (!verified) {
      await dependencies.removeLocalFile(sandboxPdfPath);

      return {
        format: "pdf",
        sandboxPath: sandboxPdfPath,
        verified: false,
        sizeBytes: 0,
        reason:
          "Le PDF Linux a ete recupere mais il est vide ou son nom est incoherent.",
        commandExecuted: commandPreview,
      };
    }

    return {
      format: "pdf",
      sandboxPath: sandboxPdfPath,
      verified: true,
      sizeBytes: fileStats.size,
      commandExecuted: commandPreview,
    };
  } catch (error) {
    await dependencies.removeLocalFile(sandboxPdfPath).catch(() => undefined);

    const reason = error instanceof Error
      ? error.message
      : "Erreur inconnue lors de la conversion PDF Linux.";

    return {
      format: "pdf",
      sandboxPath: sandboxPdfPath,
      verified: false,
      sizeBytes: 0,
      reason,
      commandExecuted: commandPreview,
    };
  } finally {
    await dependencies.cleanupRemoteArtifacts(jobPaths);
  }
}
