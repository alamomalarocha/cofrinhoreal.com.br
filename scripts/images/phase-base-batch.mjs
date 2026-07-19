import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { decodePng } from "./png-lib.mjs";
import { generateOne } from "./generate.mjs";
import { fileSha256, loadContext, parseArgs } from "./lib.mjs";
import { removeBackgroundFile } from "./remove-background.mjs";
import { runPreflight } from "./preflight.mjs";
import { safeErrorMessage } from "./safety.mjs";
import { validateColorFidelity } from "./validate-color-fidelity.mjs";
import { validateImageFile } from "./validate-file.mjs";

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "../..");
export const BATCH_PHASES = Object.freeze(["003", "004", "005", "006", "007", "008", "009", "010", "011"]);
export const MAX_ITEM_COST_USD = 0.061430;
export const MAX_BATCH_COST_USD = 0.552870;
export const CHECKPOINT_ASSET = "data/image-automation/runtime/phase-bases-003-011-checkpoint.json";
const REVIEW_ROOT = "data/image-automation/tmp/image-pilot-review";

function number(value) {
  const parsed = Number(value);
  return Number.isFinite(parsed) ? parsed : NaN;
}

export function validateBatchArgs(args, { execute = args["--dry-run"] !== true } = {}) {
  const failures = [];
  const perItem = number(args["--max-cost-usd-per-item"]);
  const total = number(args["--max-total-cost-usd"]);
  if (String(args["--from-phase"]) !== "003") failures.push("from_phase_must_be_003");
  if (String(args["--to-phase"]) !== "011") failures.push("to_phase_must_be_011");
  if (number(args["--max-attempts"]) !== 1) failures.push("single_attempt_only");
  if (!(perItem > 0 && perItem <= MAX_ITEM_COST_USD)) failures.push("per_item_ceiling");
  if (!(total > 0 && total <= MAX_BATCH_COST_USD)) failures.push("total_ceiling");
  if (Number((perItem * BATCH_PHASES.length).toFixed(6)) > total) failures.push("total_budget_insufficient");
  if (args["--stop-on-error"] !== true) failures.push("stop_on_error_required");
  if (args["--no-publish"] !== true) failures.push("no_publish_required");
  if (args["--no-push"] !== true) failures.push("no_push_required");
  if (args["--review-policy"] !== "human-mandatory") failures.push("human_review_required");
  if (args["--allow-model-fallback"] === true) failures.push("fallback_forbidden");
  if (execute) {
    if (args["--execute-paid-batch"] !== true) failures.push("execute_paid_batch_required");
    if (args["--execute-paid-generation"] !== true) failures.push("execute_paid_generation_required");
    if (args["--authorize-external-export"] !== true) failures.push("external_export_authorization_required");
    if (!args["--env-file"]) failures.push("external_env_file_required");
  }
  if (failures.length) {
    const error = new Error(`Lote de bases bloqueado: ${failures.join(", ")}.`);
    error.code = "PHASE_BASE_BATCH_BLOCKED";
    error.failures = failures;
    throw error;
  }
  return { perItem, total };
}

export function selectBatchPhases(context) {
  const selected = BATCH_PHASES.map((numero) => context.phaseBootstrap.phases.find((phase) => phase.numero === numero));
  if (selected.some((phase) => !phase)) throw new Error("Uma ou mais fases 003-011 nao estao declaradas.");
  return selected;
}

function stopPath(root) {
  return path.join(root, "data", "image-automation", "STOP");
}

function assertNotStopped(root) {
  if (fs.existsSync(stopPath(root))) {
    const error = new Error("Parada segura solicitada pelo arquivo STOP.");
    error.code = "STOP_REQUESTED";
    throw error;
  }
}

function writeJsonAtomic(file, value) {
  fs.mkdirSync(path.dirname(file), { recursive: true });
  const temporary = `${file}.${process.pid}.tmp`;
  fs.writeFileSync(temporary, `${JSON.stringify(value, null, 2)}\n`, "utf8");
  fs.renameSync(temporary, file);
}

function freshCheckpoint(phases, commit, now) {
  return {
    schema_version: "1.0.0", range: { from: "003", to: "011" }, initial_commit: commit,
    started_at: now, finished_at: null, current_phase: null, estimated_spent_usd: 0,
    phases: phases.map((phase) => ({ numero: phase.numero, uid: `PHASE-${phase.numero}-BASE`, asset: phase.base_asset, state: "pending" })),
  };
}

export function resumeDecision(checkpoint, phase) {
  const entry = checkpoint?.phases?.find((item) => item.numero === phase.numero);
  if (!entry) return "run";
  if (entry.state === "validated") return "skip";
  if (["generated", "background_removed", "failed", "generating"].includes(entry.state)) return "block";
  return "run";
}

function galleryHtml(phases, checkpoint) {
  const cards = phases.map((phase) => {
    const item = checkpoint.phases.find((entry) => entry.numero === phase.numero);
    const src = `../validated/${path.basename(phase.base_asset)}`;
    return `<article><h2>${phase.numero} — ${phase.name}</h2><p>${phase.age}</p><div class="samples"><div class="white"><img src="${src}"></div><div class="gray"><img src="${src}"></div><div class="black"><img src="${src}"></div></div><pre>${phase.base_asset}\nSHA-256: ${item.sha256 || "pending"}\n${item.width || "?"}x${item.height || "?"}\nvalidation=${item.validation || item.state}\ncost=${item.estimated_cost_usd || 0}\nrequest_id=${item.request_id || "pending"}</pre></article>`;
  }).join("\n");
  return `<!doctype html><meta charset="utf-8"><title>Phase bases 003-011 review</title><style>body{font-family:sans-serif}.samples{display:flex}.samples div{padding:12px}.samples img{width:180px}.white{background:#fff}.gray{background:#777}.black{background:#000}</style><h1>Revisao humana obrigatoria</h1>${cards}`;
}

export async function runBatch({
  args = parseArgs(), context = loadContext(), root = ROOT, env = process.env,
  generate = generateOne, preflight = runPreflight, commit = "unknown", now = () => new Date().toISOString(),
} = {}) {
  const dryRun = args["--dry-run"] === true;
  const budget = validateBatchArgs(args, { execute: !dryRun });
  const phases = selectBatchPhases(context);
  const reports = [];
  for (const phase of phases) {
    assertNotStopped(root);
    const itemArgs = {
      "--only-phase-base": phase.numero, "--max-cost-usd": budget.perItem.toFixed(6),
      "--max-attempts": "1", "--no-publish": true, "--no-push": true,
      "--review-policy": "human-mandatory", ...(dryRun ? { "--dry-run": true } : {
        "--env-file": args["--env-file"], "--execute-paid-generation": true,
      }),
    };
    const report = preflight({ args: itemArgs, context, env, root });
    reports.push(report);
    if (report.status === "BLOCKED") throw new Error(`Preflight ${phase.numero} bloqueado: ${report.failures.join(", ")}.`);
  }
  if (dryRun) return {
    mode: "dry-run", paid_generation_started: false, api_calls: 0, items_planned: phases.length,
    phases: phases.map((phase) => phase.numero), attempts_per_item: 1,
    max_cost_usd_per_item: budget.perItem, max_total_cost_usd: budget.total,
    fallback: null, key_required: false, images_created: 0, operational_writes: 0,
    preflights: reports.map((report) => ({ numero: report.selection.numero, status: report.status, failures: report.failures })),
  };

  const checkpointFile = path.join(root, CHECKPOINT_ASSET);
  let checkpoint = args["--resume"] === true && fs.existsSync(checkpointFile)
    ? JSON.parse(fs.readFileSync(checkpointFile, "utf8"))
    : freshCheckpoint(phases, commit, now());
  for (const phase of phases) {
    const decision = resumeDecision(checkpoint, phase);
    if (decision === "skip") continue;
    if (decision === "block") throw new Error(`Resume bloqueado para fase ${phase.numero}.`);
    const entry = checkpoint.phases.find((item) => item.numero === phase.numero);
    const persist = (state, extra = {}) => { Object.assign(entry, extra, { state, updated_at: now() }); checkpoint.current_phase = phase.numero; writeJsonAtomic(checkpointFile, checkpoint); };
    try {
      assertNotStopped(root); persist("preflight_ready", { estimated_cost_usd: budget.perItem });
      assertNotStopped(root); persist("generating");
      const result = await generate({ args: {
        "--only-phase-base": phase.numero, "--max-cost-usd": budget.perItem.toFixed(6), "--max-attempts": "1",
        "--no-publish": true, "--no-push": true, "--review-policy": "human-mandatory",
        "--env-file": args["--env-file"], "--execute-paid-generation": true,
      }, context, env });
      assertNotStopped(root); persist("generated", { request_id: result.request_id, attempts: result.attempts, model: result.model, raw_file: result.raw_file });
      const basename = path.basename(phase.base_asset);
      const raw = path.join(root, REVIEW_ROOT, "raw", basename);
      const background = path.join(root, REVIEW_ROOT, "background-removed", basename);
      assertNotStopped(root); const backgroundReport = removeBackgroundFile(raw, background, context.config); persist("background_removed", { background_report: backgroundReport });
      assertNotStopped(root); const validation = validateImageFile(background, context.config, { expectedAsset: phase.base_asset });
      const fidelity = validateColorFidelity(decodePng(raw), decodePng(background));
      if (!validation.valid || !fidelity.valid) throw new Error("Validacao tecnica ou fidelidade de cor falhou.");
      const validated = path.join(root, REVIEW_ROOT, "validated", basename);
      fs.mkdirSync(path.dirname(validated), { recursive: true }); fs.copyFileSync(background, validated);
      const reportDir = path.join(root, REVIEW_ROOT, "reports"); fs.mkdirSync(reportDir, { recursive: true });
      writeJsonAtomic(path.join(reportDir, `${basename}.validation.json`), validation);
      writeJsonAtomic(path.join(reportDir, `${basename}.color-fidelity.json`), fidelity);
      writeJsonAtomic(path.join(reportDir, `${basename}.visual.json`), { automatic_decision: "aguardando_revisao", human_review_required: true, asset: phase.base_asset });
      persist("validated", { sha256: fileSha256(validated), width: validation.width, height: validation.height, validation: true, validated_file: validated });
      assertNotStopped(root);
    } catch (error) {
      persist("failed", { failure: safeErrorMessage(error) });
      throw error;
    }
  }
  checkpoint.finished_at = now(); checkpoint.current_phase = null; writeJsonAtomic(checkpointFile, checkpoint);
  const gallery = path.join(root, REVIEW_ROOT, "reports", "phase-bases-003-011-review.html");
  fs.writeFileSync(gallery, galleryHtml(phases, checkpoint), "utf8");
  return { mode: "execute", paid_generation_started: true, api_calls: 9, checkpoint: CHECKPOINT_ASSET, gallery };
}

if (process.argv[1] && path.resolve(process.argv[1]) === fileURLToPath(import.meta.url)) {
  runBatch().then((result) => console.log(JSON.stringify(result, null, 2))).catch((error) => {
    console.error(safeErrorMessage(error)); process.exitCode = 1;
  });
}
