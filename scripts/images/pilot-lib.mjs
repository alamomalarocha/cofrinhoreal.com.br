import crypto from "node:crypto";
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "../..");

function sha256(value) {
  return crypto.createHash("sha256").update(value).digest("hex");
}

function normalizeAsset(value = "") {
  return String(value).trim().replaceAll("\\", "/").replace(/^\.\//u, "");
}

function readJson(relativePath) {
  return JSON.parse(fs.readFileSync(path.join(ROOT, relativePath), "utf8"));
}

export function loadPilotManifest(relativePath = "data/image-automation/pilot-002-three-identities.json") {
  return readJson(relativePath);
}

export function pilotItemForAsset(manifest, asset) {
  const normalized = normalizeAsset(asset);
  return manifest.items.find((item) => normalizeAsset(item.asset) === normalized) || null;
}

export function buildPilotPrompt(item, manifest) {
  const pilotItem = pilotItemForAsset(manifest, item.asset_futuro);
  if (!pilotItem) {
    throw new Error(`Item fora do piloto fixo: ${normalizeAsset(item.asset_futuro)}`);
  }
  const actualHash = sha256(pilotItem.prompt);
  if (actualHash !== pilotItem.prompt_hash) {
    throw new Error(`Hash de prompt divergente no piloto: ${pilotItem.asset}`);
  }
  return pilotItem.prompt;
}

function firstPngInDirectory(relativeDirectory) {
  const absoluteDirectory = path.join(ROOT, relativeDirectory);
  if (!fs.existsSync(absoluteDirectory)) return null;
  const match = fs.readdirSync(absoluteDirectory, { withFileTypes: true })
    .filter((entry) => entry.isFile() && entry.name.toLowerCase().endsWith(".png"))
    .map((entry) => path.posix.join(normalizeAsset(relativeDirectory), entry.name))
    .sort()[0];
  return match || null;
}

export function pilotReferencePlan(item, manifest) {
  const pilotItem = pilotItemForAsset(manifest, item.asset_futuro);
  if (!pilotItem) return [];
  return pilotItem.reference_keys.map((key) => {
    const definition = manifest.references[key];
    if (!definition) {
      return {
        key,
        required: true,
        available: false,
        error: "reference-key-not-declared",
        asset: null
      };
    }
    const asset = definition.asset
      ? normalizeAsset(definition.asset)
      : firstPngInDirectory(definition.directory);
    const absolute = asset ? path.join(ROOT, asset) : null;
    const available = Boolean(absolute && fs.existsSync(absolute));
    const actualHash = available ? sha256(fs.readFileSync(absolute)) : null;
    const hashMatches = !definition.sha256 || definition.sha256 === actualHash;
    return {
      key,
      role: definition.role,
      required: definition.required === true,
      available: available && hashMatches,
      asset,
      directory: definition.directory || null,
      sha256: actualHash,
      expected_sha256: definition.sha256 || null,
      error: !available
        ? "missing-reference"
        : hashMatches
          ? null
          : "reference-hash-mismatch"
    };
  });
}

export function pilotReferenceReadiness(item, manifest) {
  const references = pilotReferencePlan(item, manifest);
  const blocking = references.filter((reference) => reference.required && !reference.available);
  return {
    ready: blocking.length === 0,
    blocking,
    references
  };
}

export function assertPilotReferencesReady(item, manifest) {
  const readiness = pilotReferenceReadiness(item, manifest);
  if (!readiness.ready) {
    const details = readiness.blocking
      .map((reference) => reference.asset || reference.directory || reference.key)
      .join(", ");
    throw new Error(`Piloto bloqueado por referencia obrigatoria ausente ou invalida: ${details}`);
  }
  return readiness;
}
