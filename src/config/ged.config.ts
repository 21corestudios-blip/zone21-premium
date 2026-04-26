function getPdfEngine() {
  return process.env.PDF_ENGINE === "local" ? "local" : "linux";
}

function getPdfLinuxMode() {
  return process.env.PDF_LINUX_MODE === "remote" ? "remote" : "local";
}

export const gedConfig = {
  get libreOfficePath() {
    return process.env.LIBREOFFICE_PATH ??
      "/Applications/LibreOffice.app/Contents/MacOS/soffice";
  },
  get conversionTimeoutMs() {
    return Number(process.env.GED_CONVERSION_TIMEOUT_MS ?? "30000");
  },
  security: {
    simulationOnly: true,
    forbidFilesystemWrites: true,
    forbidRealExec: true,
    realExecutionSandboxOnly: true,
  },
  writer: {
    mode: "simulation",
    realExecutionEnabled: false,
  },
  sandbox: {
    get path() {
      return process.env.GED_SANDBOX_PATH ?? "/tmp/zone21_ged_sandbox";
    },
  },
  pdf: {
    get engine() {
      return getPdfEngine();
    },
    get linuxPath() {
      return process.env.PDF_LINUX_PATH ?? "/tmp/zone21_pdf_linux_vm";
    },
    get linuxMode() {
      return getPdfLinuxMode();
    },
    get linuxInstance() {
      return process.env.PDF_LINUX_INSTANCE ?? "zone21-pdf-linux";
    },
  },
};
