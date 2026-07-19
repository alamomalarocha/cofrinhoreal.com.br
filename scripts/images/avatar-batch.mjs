import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { createOpenAIImageProvider } from "./providers/openai-image-provider.mjs";
import { loadRuntimeEnvironment } from "./env-file.mjs";
import { decodePng, encodeRgbaPng, removeTechnicalBackground } from "./png-lib.mjs";
import { validateImageFile } from "./validate-file.mjs";
import { validateColorFidelity } from "./validate-color-fidelity.mjs";
import { fileSha256, loadContext, parseArgs } from "./lib.mjs";

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "../..");
const MANIFEST = path.join(ROOT, "data/image-automation/avatar-batch-24.json");
const CHECKPOINT = path.join(ROOT, "data/image-automation/runtime/avatar-batch-003-004-006-011-checkpoint.json");
const OUTPUT = path.join(ROOT, "data/image-automation/tmp/image-pilot-review/avatar-batch-24");

function readJson(file) { return JSON.parse(fs.readFileSync(file, "utf8")); }
function writeJson(file, value) {
  fs.mkdirSync(path.dirname(file), { recursive: true });
  fs.writeFileSync(file, `${JSON.stringify(value, null, 2)}\n`, "utf8");
}
function slug(value) { return String(value).normalize("NFD").replace(/[\u0300-\u036f]/gu, "").toLowerCase().replace(/[^a-z0-9]+/gu, "-").replace(/^-|-$/gu, ""); }

export function buildAvatarBatch({ context = loadContext(), manifest = readJson(MANIFEST) } = {}) {
  if (manifest.allowed_phases.includes("005") || !manifest.blocked_phases.includes("005")) throw new Error("Fase 005 deve permanecer bloqueada.");
  if (manifest.identities.map((item) => item.key).join(",") !== "azul,rosa,arco_iris") throw new Error("Identidades oficiais inválidas.");
  const items = [];
  for (const numero of manifest.allowed_phases) {
    const phase = context.phaseBootstrap.phases.find((item) => String(item.numero) === numero);
    if (!phase) throw new Error(`Fase não declarada: ${numero}.`);
    for (const identity of manifest.identities) {
      const base = phase.base_asset;
      const basename = `${numero}-${slug(phase.name)}-${identity.key.replace("_", "-")}.png`;
      items.push({
        uid: `AVA-${numero}-${identity.code}`,
        numero,
        phase_name: phase.name,
        identity: identity.key,
        base,
        output: `data/image-automation/tmp/image-pilot-review/avatar-batch-24/validated/${basename}`,
        raw: `data/image-automation/tmp/image-pilot-review/avatar-batch-24/raw/${basename}`,
        prompt: [
          "Wholesome, family-friendly, educational non-human cartoon pig mascot.",
          `Create the ${identity.presentation} ${identity.key} identity for the exact same ${phase.name} character in the reference.`,
          `Change only the identity styling: ${identity.clothing}. Fully clothed and appropriate for this life stage.`,
          "Preserve face, snout, eyes, ears, hair, age, height, proportions, body, pose, expression, framing, hands, feet and anatomy exactly.",
          "One character, full body, neutral pose, plain #777777 technical background, no text.",
        ].join(" "),
      });
    }
  }
  if (items.length !== 24 || new Set(items.map((item) => item.uid)).size !== 24) throw new Error("O lote deve conter exatamente 24 itens únicos.");
  return { manifest, items };
}

export function preflightAvatarBatch({ context = loadContext(), root = ROOT } = {}) {
  const batch = buildAvatarBatch({ context });
  const checks = [];
  for (const item of batch.items) {
    const basePath = path.join(root, item.base);
    const reportPath = path.join(root, "data/image-automation/tmp/image-pilot-review/reports", `${path.basename(item.base)}.review.json`);
    const report = fs.existsSync(reportPath) ? readJson(reportPath) : null;
    checks.push({ uid: item.uid, base: item.base, exists: fs.existsSync(basePath), approved: report?.decision === "approved", installed: report?.internal_phase_base_installed === true, hash_matches: Boolean(report?.sha256 && fs.existsSync(basePath) && report.sha256 === fileSha256(basePath)) });
  }
  const ready = checks.every((item) => item.exists && item.approved && item.installed && item.hash_matches);
  return { ready, count: batch.items.length, api_calls: 0, max_cost_usd: batch.manifest.limits.max_total_cost_usd, checks, items: batch.items };
}

export async function runAvatarBatch({ args = parseArgs(), context = loadContext(), provider } = {}) {
  const preflight = preflightAvatarBatch({ context });
  if (!preflight.ready) throw new Error("Preflight do lote bloqueado por base não aprovada ou não instalada.");
  if (args["--dry-run"] === true) return { mode: "dry-run", paid_generation_started: false, ...preflight };
  if (args["--execute-paid-generation"] !== true) throw new Error("Execução paga exige --execute-paid-generation.");
  if (Number(args["--max-attempts"]) !== 1 || Number(args["--max-cost-usd"]) !== 1.474320) throw new Error("Limites pagos devem ser exatamente 1 tentativa e US$ 1.474320.");
  const env = loadRuntimeEnvironment(args, process.env);
  if (!env.OPENAI_API_KEY || env.IMAGE_PROVIDER !== "openai" || env.IMAGE_GENERATION_AUTHORIZED !== "true") throw new Error("Ativação externa incompleta.");
  const imageProvider = provider || createOpenAIImageProvider({ stopRequested: () => fs.existsSync(path.join(ROOT, "data/image-automation/STOP")) });
  const checkpoint = fs.existsSync(CHECKPOINT) ? readJson(CHECKPOINT) : { schema_version: "1.0.0", completed: {}, calls: 0, max_calls: 24 };
  for (const item of preflight.items) {
    if (checkpoint.completed[item.uid]?.state === "validated") continue;
    if (checkpoint.calls >= 24) throw new Error("Chamada 25 bloqueada.");
    const referencePath = path.join(ROOT, item.base);
    const result = await imageProvider.generateEdit({ apiKey: env.OPENAI_API_KEY, referenceFiles: [{ bytes: fs.readFileSync(referencePath), name: path.basename(referencePath) }], prompt: item.prompt, model: context.config.provider.primary_model, quality: "medium", size: "1024x1536", outputFormat: "png", maxAttempts: 1, pauseMs: 0 });
    checkpoint.calls += 1;
    const rawPath = path.join(ROOT, item.raw);
    fs.mkdirSync(path.dirname(rawPath), { recursive: true });
    fs.writeFileSync(rawPath, result.png_bytes);
    const original = decodePng(rawPath);
    const processed = removeTechnicalBackground(original, { background: [119, 119, 119], tolerance: context.config.validation.background_color_tolerance, feather: context.config.validation.background_feather, shadowTolerance: context.config.validation.background_shadow_tolerance });
    const validatedPath = path.join(ROOT, item.output);
    fs.mkdirSync(path.dirname(validatedPath), { recursive: true });
    encodeRgbaPng(processed, validatedPath);
    const validation = validateImageFile(validatedPath, context.config);
    const fidelity = validateColorFidelity(original, processed);
    if (!validation.valid || !fidelity.valid) {
      checkpoint.completed[item.uid] = { state: "failed", request_id: result.request_id, validation, fidelity };
      writeJson(CHECKPOINT, checkpoint);
      throw new Error(`Validação falhou em ${item.uid}.`);
    }
    checkpoint.completed[item.uid] = { state: "validated", request_id: result.request_id, attempts: 1, reference: item.base, raw: item.raw, validated: item.output, sha256: validation.sha256, max_cost_usd: 0.061430, human_review_required: true };
    writeJson(CHECKPOINT, checkpoint);
  }
  return { mode: "execute", paid_generation_started: checkpoint.calls > 0, calls: checkpoint.calls, checkpoint: path.relative(ROOT, CHECKPOINT).replaceAll("\\", "/"), completed: checkpoint.completed };
}

if (process.argv[1] && path.resolve(process.argv[1]) === fileURLToPath(import.meta.url)) {
  try { console.log(JSON.stringify(await runAvatarBatch(), null, 2)); }
  catch (error) { console.error(error.message); process.exitCode = 1; }
}
