function getPdfEngine() {
  return process.env.PDF_ENGINE === "local" ? "local" : "linux";
}

function getPdfLinuxMode() {
  return process.env.PDF_LINUX_MODE === "remote" ? "remote" : "local";
}

function normalizeAllowedWritePath(value: string) {
  const normalized = value.replace(/\\/g, "/").trim().replace(/\/+/g, "/");

  if (!normalized) {
    return null;
  }

  const withLeadingSlash = normalized.startsWith("/")
    ? normalized
    : `/${normalized}`;

  return withLeadingSlash.endsWith("/")
    ? withLeadingSlash
    : `${withLeadingSlash}/`;
}

function getAllowedWritePaths() {
  const fallback = [
    "/90_GED_PHASE_1/TEST/",
    "/90_GED_PHASE_2/",
  ];
  const raw = process.env.GED_ALLOWED_WRITE_PATHS?.trim();

  if (!raw) {
    return fallback;
  }

  let candidates: unknown;

  try {
    candidates = raw.startsWith("[") ? JSON.parse(raw) : raw.split(",");
  } catch {
    return fallback;
  }

  if (!Array.isArray(candidates)) {
    return fallback;
  }

  const normalized = candidates
    .map((value) => normalizeAllowedWritePath(String(value)))
    .filter((value): value is string => Boolean(value));

  return normalized.length > 0 ? normalized : fallback;
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
    get allowedWritePaths() {
      return getAllowedWritePaths();
    },
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
