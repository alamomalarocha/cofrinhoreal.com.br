import crypto from "node:crypto";
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
export const ROSA_MANIFEST = path.join(ROOT, "data/image-automation/avatar-rosa-correction-8.json");
export const ROSA_CHECKPOINT = path.join(ROOT, "data/image-automation/runtime/avatar-rosa-correction-8-checkpoint.json");
export const PRIOR_CHECKPOINT = path.join(ROOT, "data/image-automation/runtime/avatar-batch-003-004-006-011-checkpoint.json");
const OUTPUT = "data/image-automation/tmp/image-pilot-review/rosa-correction-8";

function readJson(file) { return JSON.parse(fs.readFileSync(file, "utf8")); }
function writeJson(file, value) { fs.mkdirSync(path.dirname(file), { recursive: true }); fs.writeFileSync(file, `${JSON.stringify(value, null, 2)}\n`, "utf8"); }
function shaText(value) { return crypto.createHash("sha256").update(value).digest("hex"); }
function slug(value) { return String(value).normalize("NFD").replace(/[\u0300-\u036f]/gu, "").toLowerCase().replace(/[^a-z0-9]+/gu, "-").replace(/^-|-$/gu, ""); }

function femininePrompt(phase) {
  const minor = ["003", "004", "006"].includes(String(phase.numero));
  const age = minor
    ? "Use child-friendly, age-appropriate, wholesome, fully clothed, innocent cartoon styling suitable for an educational mascot."
    : "Keep the presentation wholesome, fully clothed, family-friendly and appropriate to this exact life stage.";
  return [
    "Create the feminine Rosa identity for this exact life-stage character.",
    `This character is ${phase.name}, ${phase.age}; preserve that exact age group.`,
    "Preserve the same individual character, life stage, face identity, snout, eyes, ears, body proportions, height, pose, expression, framing, hands, feet and anatomy from the approved private phase reference.",
    "The result must read clearly as a female character appropriate to this exact age group, not as a masculine character recolored pink.",
    "Use age-appropriate feminine styling through a coherent combination of hairstyle, facial presentation, clothing cut, footwear and small accessories when suitable.",
    age,
    "Use a harmonious Rosa and pink palette while ensuring femininity comes from the complete character design rather than color alone.",
    "One non-human cartoon pig character, full body, neutral pose, plain #777777 technical background, transparent-background-ready composition, no text."
  ].join(" ");
}

export function buildRosaCorrection({ context = loadContext(), manifest = readJson(ROSA_MANIFEST) } = {}) {
  const phases = manifest.allowed_phases;
  if (manifest.identity !== "rosa" || phases.join(",") !== "003,004,006,007,008,009,010,011" || !manifest.blocked_phases.includes("005")) throw new Error("Escopo Rosa inválido ou fase 005 desbloqueada.");
  if (manifest.items.length !== 8 || new Set(manifest.items.map((item) => item.uid)).size !== 8) throw new Error("A correção deve conter oito UIDs únicos.");
  const items = manifest.items.map((declared) => {
    if (declared.uid !== `AVA-${declared.phase}-RSA` || !phases.includes(declared.phase)) throw new Error(`UID ou fase não autorizado: ${declared.uid}.`);
    const phase = context.phaseBootstrap.phases.find((item) => String(item.numero) === declared.phase);
    if (!phase) throw new Error(`Fase ausente: ${declared.phase}.`);
    const name = `${declared.phase}-${slug(phase.name)}-rosa-candidate.png`;
    return { ...declared, numero: declared.phase, phase_name: phase.name, identity: "rosa", base: phase.base_asset, raw: `${OUTPUT}/raw/${name}`, transparent: `${OUTPUT}/transparent/${name}`, validated: `${OUTPUT}/validated/${name}`, prompt: femininePrompt(phase) };
  });
  return { manifest, items };
}

export function preflightRosaCorrection({ context = loadContext(), root = ROOT } = {}) {
  const batch = buildRosaCorrection({ context });
  const checks = batch.items.map((item) => {
    const basePath = path.join(root, item.base);
    const reportPath = path.join(root, "data/image-automation/tmp/image-pilot-review/reports", `${path.basename(item.base)}.review.json`);
    const report = fs.existsSync(reportPath) ? readJson(reportPath) : null;
    return { uid: item.uid, base: item.base, references: 1, exists: fs.existsSync(basePath), approved: report?.decision === "approved", installed: report?.internal_phase_base_installed === true, hash_matches: Boolean(report?.sha256 && fs.existsSync(basePath) && report.sha256 === fileSha256(basePath)) };
  });
  return { ready: checks.every((item) => item.exists && item.approved && item.installed && item.hash_matches), items: batch.items, count: 8, identities: "rosa_only", api_calls: 0, png_created: 0, retry: false, fallback: false, stop_on_error: true, per_item_ceiling_usd: 0.061430, total_ceiling_usd: 0.491440, catalog: false, publish: false, deploy: false, push_images: false, checks };
}

export async function runRosaCorrection({ args = parseArgs(), context = loadContext(), provider } = {}) {
  const preflight = preflightRosaCorrection({ context });
  if (!preflight.ready) throw new Error("Preflight Rosa bloqueado por base não aprovada, ausente ou divergente.");
  if (args["--dry-run"] === true) return { mode: "dry-run", paid_generation_started: false, ...preflight };
  if (args["--execute-paid-generation"] !== true) throw new Error("Execução paga exige --execute-paid-generation.");
  if (Number(args["--max-attempts"]) !== 1 || Number(args["--max-cost-usd"]) !== 0.491440) throw new Error("Limites devem ser uma tentativa e US$ 0.491440.");
  const env = loadRuntimeEnvironment(args, process.env);
  if (!env.OPENAI_API_KEY || env.IMAGE_PROVIDER !== "openai" || env.IMAGE_GENERATION_AUTHORIZED !== "true") throw new Error("Ativação externa incompleta.");
  const imageProvider = provider || createOpenAIImageProvider({ stopRequested: () => fs.existsSync(path.join(ROOT, "data/image-automation/STOP")) });
  const priorHash = fs.existsSync(PRIOR_CHECKPOINT) ? fileSha256(PRIOR_CHECKPOINT) : null;
  const checkpoint = fs.existsSync(ROSA_CHECKPOINT) ? readJson(ROSA_CHECKPOINT) : { schema_version: "1.0.0", authorization: "Alamo Rocha", authorized_items: preflight.items.map((item) => item.uid), calls: 0, max_calls: 8, max_total_cost_usd: 0.491440, completed: {}, failures: [], stopped: false, human_review_required: true, feminine_presentation_human_review_required: true, reviewer_pending: "Alamo Rocha", prior_checkpoint_sha256: priorHash };
  for (const item of preflight.items) {
    if (checkpoint.completed[item.uid]?.state === "validated") continue;
    if (checkpoint.calls >= 8) throw new Error("Chamada nove bloqueada.");
    const referencePath = path.join(ROOT, item.base);
    let result;
    try {
      result = await imageProvider.generateEdit({ apiKey: env.OPENAI_API_KEY, referenceFiles: [{ bytes: fs.readFileSync(referencePath), name: path.basename(referencePath) }], prompt: item.prompt, model: context.config.provider.primary_model, quality: "medium", size: "1024x1536", outputFormat: "png", maxAttempts: 1, pauseMs: 0 });
      checkpoint.calls += 1;
    } catch (error) {
      checkpoint.calls += 1; checkpoint.stopped = true; checkpoint.failures.push({ uid: item.uid, message: String(error.message || error), timestamp: new Date().toISOString() }); writeJson(ROSA_CHECKPOINT, checkpoint); throw error;
    }
    const rawPath = path.join(ROOT, item.raw); fs.mkdirSync(path.dirname(rawPath), { recursive: true }); fs.writeFileSync(rawPath, result.png_bytes);
    const original = decodePng(rawPath);
    const processed = removeTechnicalBackground(original, { background: [119, 119, 119], tolerance: context.config.validation.background_color_tolerance, feather: context.config.validation.background_feather, shadowTolerance: context.config.validation.background_shadow_tolerance });
    const transparentPath = path.join(ROOT, item.transparent); fs.mkdirSync(path.dirname(transparentPath), { recursive: true }); encodeRgbaPng(processed, transparentPath);
    const validatedPath = path.join(ROOT, item.validated); fs.mkdirSync(path.dirname(validatedPath), { recursive: true }); fs.copyFileSync(transparentPath, validatedPath);
    const validation = validateImageFile(validatedPath, context.config); const fidelity = validateColorFidelity(original, processed);
    if (!validation.valid || !fidelity.valid) { checkpoint.completed[item.uid] = { state: "failed", request_id: result.request_id, validation, fidelity }; checkpoint.stopped = true; writeJson(ROSA_CHECKPOINT, checkpoint); throw new Error(`Validação falhou em ${item.uid}.`); }
    checkpoint.completed[item.uid] = { state: "validated", request_id: result.request_id, attempts: 1, reference: item.base, reference_sha256: fileSha256(referencePath), prompt: item.prompt, prompt_revision: "rosa-feminine-v2", prompt_sha256: shaText(item.prompt), model: context.config.provider.primary_model, quality: "medium", size: "1024x1536", raw: item.raw, raw_sha256: fileSha256(rawPath), transparent: item.transparent, transparent_sha256: fileSha256(transparentPath), validated: item.validated, validated_sha256: validation.sha256, max_cost_usd: 0.061430, human_review_required: true, feminine_presentation_human_review_required: true, reviewer_pending: "Alamo Rocha", completed_at: new Date().toISOString() };
    writeJson(ROSA_CHECKPOINT, checkpoint);
  }
  if (priorHash && fileSha256(PRIOR_CHECKPOINT) !== priorHash) throw new Error("Checkpoint histórico foi alterado.");
  return { mode: "execute", paid_generation_started: checkpoint.calls > 0, calls: checkpoint.calls, checkpoint: path.relative(ROOT, ROSA_CHECKPOINT).replaceAll("\\", "/"), completed: checkpoint.completed, human_review_required: true };
}

if (process.argv[1] && path.resolve(process.argv[1]) === fileURLToPath(import.meta.url)) {
  try { console.log(JSON.stringify(await runRosaCorrection(), null, 2)); }
  catch (error) { console.error(error.message); process.exitCode = 1; }
}
