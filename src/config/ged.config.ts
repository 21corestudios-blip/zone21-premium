export const gedConfig = {
  libreOfficePath: "/Applications/LibreOffice.app/Contents/MacOS/soffice",
  conversionTimeoutMs: 30_000,
  security: {
    simulationOnly: true,
    forbidFilesystemWrites: true,
    forbidRealExec: true,
  },
  writer: {
    mode: "simulation",
    realExecutionEnabled: false,
  },
} as const;
