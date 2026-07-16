import fs from "node:fs";
import path from "node:path";
import { fromRoot, normalizeAsset } from "./lib.mjs";

export const REVIEW_STAGES = [
  "raw",
  "background-removed",
  "validated",
  "approved",
  "rejected",
  "reports",
];

export const DEFAULT_REVIEW_ROOT = fromRoot(
  "data",
  "image-automation",
  "tmp",
  "image-pilot-review",
);

export function resolveReviewRoot(value = DEFAULT_REVIEW_ROOT) {
  return path.isAbsolute(value) ? path.resolve(value) : path.resolve(fromRoot(), value);
}

export function ensureReviewWorkspace(root = DEFAULT_REVIEW_ROOT) {
  const resolved = resolveReviewRoot(root);
  for (const stage of REVIEW_STAGES) {
    fs.mkdirSync(path.join(resolved, stage), { recursive: true });
  }
  return resolved;
}

export function assetBasename(asset) {
  const basename = path.posix.basename(normalizeAsset(asset));
  if (!basename.toLowerCase().endsWith(".png")) {
    throw new Error(`O asset deve ser PNG: ${asset}`);
  }
  return basename;
}

export function stagePath(root, stage, asset) {
  if (!REVIEW_STAGES.includes(stage)) throw new Error(`Estagio desconhecido: ${stage}`);
  return path.join(resolveReviewRoot(root), stage, assetBasename(asset));
}

export function reportPath(root, asset, kind) {
  return path.join(
    resolveReviewRoot(root),
    "reports",
    `${assetBasename(asset)}.${kind}.json`,
  );
}

export function readJsonIfExists(filePath) {
  if (!fs.existsSync(filePath)) return null;
  return JSON.parse(fs.readFileSync(filePath, "utf8"));
}

export function writeJsonFile(filePath, value) {
  fs.mkdirSync(path.dirname(filePath), { recursive: true });
  fs.writeFileSync(filePath, `${JSON.stringify(value, null, 2)}\n`, "utf8");
}

export function copyPreservingSource(source, destination) {
  if (!fs.existsSync(source)) throw new Error(`Arquivo de origem ausente: ${source}`);
  fs.mkdirSync(path.dirname(destination), { recursive: true });
  fs.copyFileSync(source, destination);
  return destination;
}

export function newestCandidate(root, asset) {
  for (const stage of ["validated", "background-removed", "raw"]) {
    const candidate = stagePath(root, stage, asset);
    if (fs.existsSync(candidate)) return { stage, file: candidate };
  }
  return null;
}
