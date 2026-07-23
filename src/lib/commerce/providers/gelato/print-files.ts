import type { GelatoPrintFile } from "./client";

export function resolveGelatoPrintFiles(
  metadata?: Record<string, unknown>,
): GelatoPrintFile[] {
  const configuredFiles = metadata?.printFiles;

  if (Array.isArray(configuredFiles)) {
    const files = configuredFiles.flatMap((entry) => {
      if (
        typeof entry === "object" &&
        entry !== null &&
        "type" in entry &&
        "url" in entry &&
        typeof entry.type === "string" &&
        typeof entry.url === "string" &&
        entry.type.trim() &&
        entry.url.trim()
      ) {
        return [{ type: entry.type.trim(), url: entry.url.trim() }];
      }

      return [];
    });

    if (files.length) {
      return files;
    }
  }

  const legacyFileUrl =
    typeof metadata?.fileUrl === "string"
      ? metadata.fileUrl
      : process.env.GELATO_DEFAULT_FILE_URL;

  return legacyFileUrl ? [{ type: "default", url: legacyFileUrl }] : [];
}
