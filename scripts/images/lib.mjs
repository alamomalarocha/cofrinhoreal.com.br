import crypto from "node:crypto";
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import {
  buildIdentityPrompt,
  buildPhaseBasePrompt,
  buildPilotPrompt,
  loadPilotManifest,
  loadPhaseBootstrap,
  phaseBaseForAsset,
  phaseBaseItemForPhase,
  phaseByKey,
  phaseWorkflowItems,
  pilotReferenceReadiness,
  pilotWorkflowItems,
} from "./pilot-lib.mjs";

export const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "../..");
export const AUTOMATION_DIR = path.join(ROOT, "data/image-automation");
export const VALID_STATES = [
  "pendente",
  "gerando",
  "gerada",
  "fundo_removido",
  "validada",
  "aguardando_revisao",
  "aprovada",
  "publicada",
  "falhou",
];

export function fromRoot(...parts) {
  return path.join(ROOT, ...parts);
}

export function readJson(relativePath) {
  return JSON.parse(fs.readFileSync(fromRoot(relativePath), "utf8"));
}

export function writeJson(relativePath, value) {
  const target = fromRoot(relativePath);
  fs.mkdirSync(path.dirname(target), { recursive: true });
  fs.writeFileSync(target, `${JSON.stringify(value, null, 2)}\n`, "utf8");
}

export function readJsonl(relativePath) {
  const target = fromRoot(relativePath);
  if (!fs.existsSync(target)) return [];
  return fs.readFileSync(target, "utf8")
    .split(/\r?\n/u)
    .filter(Boolean)
    .map((line, index) => {
      try {
        return JSON.parse(line);
      } catch {
        throw new Error(`JSONL inválido em ${relativePath}:${index + 1}`);
      }
    });
}

export function appendJsonl(relativePath, value) {
  const target = fromRoot(relativePath);
  fs.mkdirSync(path.dirname(target), { recursive: true });
  fs.appendFileSync(target, `${JSON.stringify(value)}\n`, "utf8");
}

export function sha256(value) {
  return crypto.createHash("sha256").update(value).digest("hex");
}

export function fileSha256(filePath) {
  return sha256(fs.readFileSync(filePath));
}

export function normalizeAsset(value = "") {
  return String(value).trim().replaceAll("\\", "/").replace(/^\.\//u, "");
}

export function parseArgs(argv = process.argv.slice(2)) {
  const parsed = { _: [] };
  for (let index = 0; index < argv.length; index += 1) {
    const argument = argv[index];
    if (!argument.startsWith("--")) {
      parsed._.push(argument);
      continue;
    }
    const [name, inline] = argument.split(/=(.*)/su, 2);
    if (name === "--only-uid" && parsed[name] !== undefined) {
      throw new Error("--only-uid aceita exatamente um UID.");
    }
    if (inline !== undefined) {
      parsed[name] = inline;
      continue;
    }
    const next = argv[index + 1];
    if (next && !next.startsWith("--")) {
      parsed[name] = next;
      index += 1;
    } else {
      parsed[name] = true;
    }
  }
  return parsed;
}

export function numberOption(args, name, fallback) {
  if (args[name] === undefined) return fallback;
  const value = Number(args[name]);
  if (!Number.isFinite(value) || value < 0) throw new Error(`${name} deve ser numérico e não negativo.`);
  return value;
}

export function loadContext() {
  const config = readJson("data/image-automation/config.json");
  return {
    config,
    styles: readJson("data/image-automation/style-system.json"),
    phaseBootstrap: loadPhaseBootstrap(config.references.phase_bootstrap),
    queue: readJson("data/fila-imagens-personagens.json"),
    catalog: readJson("data/vila-pig-personagens.json"),
    events: readJsonl("data/image-automation/state.jsonl"),
    pilot: loadPilotManifest(config.pilot.manifest)
  };
}

export function latestStates(events) {
  const states = new Map();
  for (const event of events) {
    if (event.type !== "state" || !event.asset) continue;
    states.set(normalizeAsset(event.asset), event);
  }
  return states;
}

export function stateEvent(item, status, detail = {}) {
  if (!VALID_STATES.includes(status)) throw new Error(`Estado inválido: ${status}`);
  return {
    type: "state",
    schema_version: "1.0.0",
    timestamp: new Date().toISOString(),
    uid: item.uid,
    numero: item.numero,
    estilo: item.estilo || null,
    asset: normalizeAsset(item.asset_futuro),
    status,
    ...detail,
  };
}

export function isStopRequested() {
  return fs.existsSync(fromRoot("data/image-automation/STOP"));
}

export function reviewPolicy(item) {
  const sensitive = item.publicavel === false
    || item.situacao_fila === "bloqueada_revisao"
    || !["aprovado", "nao_aplicavel", "não aplicável", ""].includes(item.status_revisao_cultural || "");
  if (sensitive) return "specialized";
  const text = `${item.categoria || ""} ${item.regiao || ""} ${item.familia || ""}`.toLowerCase();
  if (/cultur|ind.gen|folcl|relig|fam.l|regi|defici|migra/u.test(text)) return "human";
  return "automatic-safe";
}

export function buildVisualPrompt(item) {
  const brief = String(item.visual_brief || item.descricao_curta || item.nome || "Personagem do universo Cofrinho Real")
    .trim()
    .replace(/[.!?]+$/u, "");
  const clothes = String(item.roupa || "roupa simples, sem marcas").trim().replace(/[.!?]+$/u, "");
  return [
    "Crie uma imagem nova do zero.",
    "",
    `${brief}.`,
    `Roupa: ${clothes}.`,
    "",
    "Sem texto, letras, números, símbolos, moedas, medalhas, logos, cenário, painel ou outros personagens.",
    "",
    "Fundo transparente real.",
  ].join("\n");
}

export function storagePlan(item, config) {
  const asset = normalizeAsset(item.asset_futuro);
  const basename = path.posix.basename(asset, path.posix.extname(asset));
  const prefix = config.storage.object_prefix || "characters";
  return {
    provider: config.storage.provider,
    enabled: config.storage.enabled,
    local_png: asset,
    object_original: `${prefix}/original/${basename}.png`,
    object_webp: `${prefix}/webp/${basename}.webp`,
    object_thumbnail: `${prefix}/thumb/${basename}.webp`,
    public_url: null,
  };
}

export function estimatedCost(item, config) {
  const perImage = Number(config.provider.estimated_cost_usd_per_image || 0);
  return Number.isFinite(perImage) ? perImage : 0;
}

export function filterQueue(items, args, states = new Map()) {
  const from = args["--from-number"] ? Number(args["--from-number"]) : null;
  const to = args["--to-number"] ? Number(args["--to-number"]) : null;
  const identity = args["--identity"] || "";
  const category = String(args["--category"] || "").toLowerCase();
  const region = String(args["--region"] || "").toLowerCase();
  const uf = String(args["--uf"] || "").toLowerCase();
  const phase = String(args["--phase"] || "").toLowerCase();
  return items
    .filter((item) => item.status_imagem === "pendente")
    .filter((item) => item.situacao_fila === "pronta_para_criacao")
    .filter((item) => item.publicavel !== false)
    .filter((item) => from === null || Number(item.numero) >= from)
    .filter((item) => to === null || Number(item.numero) <= to)
    .filter((item) => !identity || item.estilo === identity)
    .filter((item) => !category || String(item.categoria || "").toLowerCase().includes(category))
    .filter((item) => !region || String(item.regiao || "").toLowerCase() === region)
    .filter((item) => !uf || String(item.uf || "").toLowerCase() === uf)
    .filter((item) => !phase || String(item.fase_vida || "").toLowerCase() === phase)
    .filter((item) => {
      if (!args["--resume"]) return true;
      const last = states.get(normalizeAsset(item.asset_futuro));
      return !last || !["aprovada", "publicada"].includes(last.status);
    })
    .sort((left, right) => Number(left.ordem) - Number(right.ordem));
}

export function findAutomationItem(context, asset) {
  const normalized = normalizeAsset(asset);
  const queueItem = context.queue.itens.find(
    (candidate) => normalizeAsset(candidate.asset_futuro) === normalized,
  );
  if (queueItem) return queueItem;
  const phase = phaseBaseForAsset(context.phaseBootstrap, normalized);
  return phase ? phaseBaseItemForPhase(phase) : null;
}

export function selectPlan(context, args) {
  const states = latestStates(context.events);
  if (args["--only-uid"] !== undefined) {
    if (args["--only-phase-base"] !== undefined) {
      throw new Error("--only-uid nao pode ser combinado com --only-phase-base.");
    }
    const rawUid = args["--only-uid"];
    if (Array.isArray(rawUid) || typeof rawUid !== "string" || !rawUid.trim() || /[,\s]/u.test(rawUid.trim())) {
      throw new Error("--only-uid aceita exatamente um UID.");
    }
    const uid = rawUid.trim();
    const allowed = new Set(["AVA-002-AZL", "AVA-002-RSA", "AVA-002-ARC"]);
    if (!allowed.has(uid)) throw new Error(`UID de identidade nao autorizado: ${uid}.`);
    const pilotItem = context.pilot.items.find((candidate) => candidate.uid === uid);
    if (!pilotItem || pilotItem.kind !== "identity" || pilotItem.identity === "padrao") {
      throw new Error(`UID nao corresponde a uma identidade publica oficial: ${uid}.`);
    }
    const item = context.queue.itens.find((candidate) => candidate.uid === uid);
    if (!item || (item.kind && item.kind !== "character")) {
      throw new Error(`UID nao corresponde a um personagem da fila: ${uid}.`);
    }
    return [item];
  }
  if (args["--only-phase-base"] !== undefined) {
    const requested = String(args["--only-phase-base"]).trim().padStart(3, "0");
    const phases = context.phaseBootstrap.phases.filter(
      (phase) => String(phase.numero).padStart(3, "0") === requested,
    );
    if (phases.length !== 1) {
      const error = new Error(
        `Selecao exclusiva invalida para a base ${requested}: ${phases.length} fases encontradas.`,
      );
      error.code = "EXCLUSIVE_PHASE_BASE_SELECTION_INVALID";
      throw error;
    }
    const item = phaseBaseItemForPhase(phases[0]);
    const latest = states.get(normalizeAsset(item.asset_futuro));
    if (
      args["--resume"] === true
      && latest
      && ["aprovada", "publicada"].includes(latest.status)
    ) {
      return [];
    }
    return [item];
  }
  if (args["--pilot"]) {
    const items = pilotWorkflowItems({
      manifest: context.pilot,
      phaseBootstrap: context.phaseBootstrap,
      queueItems: context.queue.itens,
      states,
      resume: args["--resume"] === true,
    });
    const limit = numberOption(args, "--limit", context.config.pilot.total);
    return items.slice(0, limit || items.length);
  }
  const queueItems = filterQueue(context.queue.itens, args, states);
  const items = phaseWorkflowItems({
    phaseBootstrap: context.phaseBootstrap,
    queueItems,
    states,
    resume: args["--resume"] === true,
  });
  const limit = numberOption(args, "--limit", 25);
  return items.slice(0, limit || items.length);
}

function referenceRecord({
  key,
  asset,
  states,
  requiredState = null,
}) {
  const normalized = normalizeAsset(asset);
  const available = fs.existsSync(fromRoot(normalized));
  const latest = states.get(normalized);
  const stateMatches = !requiredState
    || latest?.status === requiredState
    || (requiredState === "aprovada" && latest?.status === "publicada");
  let error = null;
  if (!available) error = "missing-reference";
  else if (!stateMatches) error = "reference-not-approved";
  return {
    key,
    asset: normalized,
    required: true,
    available: available && stateMatches,
    required_state: requiredState,
    state_matches: stateMatches,
    error,
  };
}

export function planRecord(item, context, { pilot = false } = {}) {
  const states = latestStates(context.events);
  const phase = phaseByKey(context.phaseBootstrap, item.fase_vida);
  const basePhase = phaseBaseForAsset(context.phaseBootstrap, item.asset_futuro);
  const identity = context.phaseBootstrap.identity_derivation.identities.includes(item.estilo)
    ? item.estilo
    : null;
  const prompt = pilot
    ? buildPilotPrompt(item, context.pilot, context.phaseBootstrap)
    : basePhase
      ? buildPhaseBasePrompt(
        basePhase,
        context.phaseBootstrap,
        context.config.provider.technical_background,
      )
      : phase && identity
        ? buildIdentityPrompt(
          identity,
          phase,
          context.phaseBootstrap,
          context.config.provider.technical_background,
        )
        : buildVisualPrompt(item);
  let readiness = null;
  if (pilot) {
    readiness = pilotReferenceReadiness(item, context.pilot, { states });
  } else {
    const references = basePhase
      ? [
        referenceRecord({
          key: "pig_principal",
          asset: context.config.references.pig_principal,
          states,
        }),
      ]
      : phase && identity
        ? [
          referenceRecord({
            key: "phase_base",
            asset: phase.base_asset,
            states,
            requiredState: "aprovada",
          }),
        ]
        : [
          referenceRecord({
            key: "pig_principal",
            asset: context.config.references.pig_principal,
            states,
          }),
          phase
            ? referenceRecord({
              key: "phase_base",
              asset: phase.base_asset,
              states,
              requiredState: "aprovada",
            })
            : null,
        ].filter(Boolean);
    const blocking = references.filter((reference) => !reference.available);
    readiness = {
      ready: blocking.length === 0,
      blocking,
      references,
    };
  }
  const references = readiness.references;
  return {
    kind: item.kind || "character",
    ordem: item.ordem,
    uid: item.uid,
    numero: item.numero,
    nome: item.nome,
    estilo: item.estilo || null,
    arquivo: normalizeAsset(item.asset_futuro),
    prompt,
    prompt_hash: sha256(prompt),
    referencias: references,
    referencias_prontas: readiness?.ready ?? null,
    bloqueios_referencia: readiness?.blocking ?? [],
    validacoes: ["arquivo PNG", "canal alfa real", "margens", "uma figura", "sem texto ou logo", "identidade visual"],
    modelo: context.config.provider.model,
    custo_estimado_usd: estimatedCost(item, context.config),
    politica_revisao: pilot ? "human-mandatory" : reviewPolicy(item),
    armazenamento: storagePlan(item, context.config),
  };
}

export function generationAuthorized(config, args) {
  return config.provider.enabled === true
    && args[config.authorization.execute_flag || "--execute-paid-generation"] === true
    && process.env[config.authorization.environment_variable] === config.authorization.required_value;
}

export function safeError(error) {
  const text = error instanceof Error ? error.message : String(error);
  return text.replace(/(sk-[A-Za-z0-9_-]{8})[A-Za-z0-9_-]+/gu, "$1…");
}
