import fs from "node:fs";
import path from "node:path";

function normalizeAsset(value = "") {
  return String(value).trim().replaceAll("\\", "/").replace(/^\.\//u, "");
}

function atomicWriteJson(filePath, value) {
  fs.mkdirSync(path.dirname(filePath), { recursive: true });
  const temporary = `${filePath}.${process.pid}.${Date.now()}.tmp`;
  fs.writeFileSync(temporary, `${JSON.stringify(value, null, 2)}\n`, "utf8");
  fs.renameSync(temporary, filePath);
}

export function loadRunnerCheckpoint(filePath) {
  if (!fs.existsSync(filePath)) return null;
  return JSON.parse(fs.readFileSync(filePath, "utf8"));
}

function freshItem(record, now) {
  return {
    asset: normalizeAsset(record.arquivo),
    uid: record.uid,
    numero: record.numero,
    nome: record.nome,
    estilo: record.estilo || null,
    kind: record.kind || "character",
    current_step: record.referencias_prontas === false
      ? "waiting_for_approved_reference"
      : "planned",
    completed_steps: [],
    prompt_hash: record.prompt_hash,
    attempts: 0,
    updated_at: now,
  };
}

export function reconcileRunnerCheckpoint(
  previous,
  records,
  options = {},
  now = new Date().toISOString(),
) {
  const previousItems = new Map(
    (previous?.items || []).map((item) => [normalizeAsset(item.asset), item]),
  );
  const seen = new Set();
  const items = [];
  for (const record of records) {
    const asset = normalizeAsset(record.arquivo);
    if (seen.has(asset)) continue;
    seen.add(asset);
    const prior = previousItems.get(asset);
    items.push(prior
      ? {
        ...prior,
        uid: record.uid,
        numero: record.numero,
        nome: record.nome,
        estilo: record.estilo || null,
        kind: record.kind || prior.kind || "character",
        prompt_hash: record.prompt_hash,
        updated_at: now,
      }
      : freshItem(record, now));
  }
  for (const prior of previous?.items || []) {
    const asset = normalizeAsset(prior.asset);
    if (seen.has(asset)) continue;
    items.push(prior);
  }
  const active = items.find((item) => !["approved", "published"].includes(item.current_step))
    || null;
  return {
    schema_version: "1.0.0",
    updated_at: now,
    mode: options.mode || previous?.mode || "dry-run",
    pilot: options.pilot === true,
    resume: options.resume === true,
    until_complete: options.untilComplete === true,
    stop_on_error: options.stopOnError !== false,
    current_asset: active?.asset || null,
    current_step: active?.current_step || "complete",
    items,
  };
}

export function persistRunnerCheckpoint(filePath, checkpoint) {
  atomicWriteJson(filePath, checkpoint);
  return checkpoint;
}

export function updateRunnerStep(
  filePath,
  asset,
  step,
  { completedStep, error, now = new Date().toISOString() } = {},
) {
  const checkpoint = loadRunnerCheckpoint(filePath);
  if (!checkpoint) throw new Error("Checkpoint do runner ainda nao existe.");
  const normalized = normalizeAsset(asset);
  const item = checkpoint.items.find((candidate) => candidate.asset === normalized);
  if (!item) throw new Error(`Item ausente no checkpoint: ${normalized}`);
  item.current_step = step;
  item.updated_at = now;
  if (completedStep && !item.completed_steps.includes(completedStep)) {
    item.completed_steps.push(completedStep);
  }
  if (error) item.last_error = String(error);
  checkpoint.updated_at = now;
  checkpoint.current_asset = normalized;
  checkpoint.current_step = step;
  persistRunnerCheckpoint(filePath, checkpoint);
  return checkpoint;
}
