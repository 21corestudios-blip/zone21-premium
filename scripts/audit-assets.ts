import { createHash } from "node:crypto";
import {
  existsSync,
  readdirSync,
  readFileSync,
  statSync,
} from "node:fs";
import path from "node:path";

const root = process.cwd();
const publicDir = path.join(root, "public");

const ignoredDirs = new Set([
  ".git",
  ".next",
  "node_modules",
  ".turbo",
  "coverage",
]);

const scannableExtensions = new Set([
  ".css",
  ".js",
  ".json",
  ".md",
  ".mjs",
  ".ts",
  ".tsx",
]);

const assetRefPattern =
  /["'`](\/(?:images|fonts|file\.svg|globe\.svg|next\.svg|window\.svg)[^"'`]*)["'`]/g;

function walkFiles(dir: string): string[] {
  if (!existsSync(dir)) {
    return [];
  }

  return readdirSync(dir, { withFileTypes: true }).flatMap((entry) => {
    if (ignoredDirs.has(entry.name)) {
      return [];
    }

    const fullPath = path.join(dir, entry.name);

    if (entry.isDirectory()) {
      return walkFiles(fullPath);
    }

    return [fullPath];
  });
}

function publicPathFromFile(filePath: string) {
  return `/${path.relative(publicDir, filePath).split(path.sep).join("/")}`;
}

function hashFile(filePath: string) {
  return createHash("sha256").update(readFileSync(filePath)).digest("hex");
}

const publicFiles = walkFiles(publicDir);
const publicAssets = new Set(publicFiles.map(publicPathFromFile));

const references = new Map<string, Set<string>>();
for (const filePath of walkFiles(root)) {
  const ext = path.extname(filePath);
  if (!scannableExtensions.has(ext)) {
    continue;
  }

  const relativePath = path.relative(root, filePath);
  const content = readFileSync(filePath, "utf8");

  for (const match of content.matchAll(assetRefPattern)) {
    const assetPath = match[1].trim();
    if (!references.has(assetPath)) {
      references.set(assetPath, new Set());
    }
    references.get(assetPath)?.add(relativePath);
  }
}

const missingReferences = [...references.keys()]
  .filter((assetPath) => !publicAssets.has(assetPath))
  .sort();

const referencedAssets = new Set(references.keys());
const unreferencedAssets = [...publicAssets]
  .filter((assetPath) => !referencedAssets.has(assetPath))
  .sort();

const hashes = new Map<string, string[]>();
for (const filePath of publicFiles) {
  const stats = statSync(filePath);
  if (!stats.isFile()) {
    continue;
  }

  const hash = hashFile(filePath);
  hashes.set(hash, [...(hashes.get(hash) ?? []), publicPathFromFile(filePath)]);
}

const duplicateAssets = [...hashes.values()]
  .filter((items) => items.length > 1)
  .map((items) => items.sort())
  .sort((a, b) => a[0].localeCompare(b[0]));

const suspiciousAssets = [...publicAssets]
  .filter((assetPath) => {
    const basename = path.basename(assetPath);

    return (
      assetPath.includes(".DS_Store") ||
      basename === "Icon" ||
      /\s/.test(assetPath) ||
      /\.webp\.webp$/i.test(assetPath)
    );
  })
  .sort();

function printList(title: string, items: string[]) {
  console.log(`\n${title} (${items.length})`);

  if (items.length === 0) {
    console.log("- none");
    return;
  }

  for (const item of items) {
    console.log(`- ${item}`);
  }
}

console.log("Asset audit");
console.log(`Public files: ${publicFiles.length}`);
console.log(`Referenced public assets: ${referencedAssets.size}`);

printList("Missing references", missingReferences);
printList("Suspicious filenames", suspiciousAssets);
printList("Unreferenced public assets", unreferencedAssets);

console.log(`\nDuplicate asset hashes (${duplicateAssets.length})`);
if (duplicateAssets.length === 0) {
  console.log("- none");
} else {
  for (const group of duplicateAssets) {
    console.log(`- ${group.join(" | ")}`);
  }
}
