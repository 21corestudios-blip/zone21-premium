export const gedConfig = {
  libreOfficePath: "/Applications/LibreOffice.app/Contents/MacOS/soffice",
  conversionTimeoutMs: 30_000,
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
    path: process.env.GED_SANDBOX_PATH ?? "/tmp/zone21_ged_sandbox",
  },
} as const;
