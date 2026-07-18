import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import {
  appendJsonl,
  latestStates,
  loadContext,
  normalizeAsset,
  parseArgs,
  planRecord,
  selectPlan,
  stateEvent,
} from "./lib.mjs";
import {
  assertPilotReferencesReady,
  pilotItemForAsset,
} from "./pilot-lib.mjs";
import { createOpenAIImageProvider } from "./providers/openai-image-provider.mjs";
import {
  assertGenerationAuthorized,
  assertStopNotRequested,
  generationGate,
  safeErrorMessage,
  sanitizeForLog,
} from "./safety.mjs";
import {
  createExclusiveBudget,
  estimatedAttemptCost,
  PILOT_MAX_COST_USD,
  requiredExclusiveBudget,
} from "./budget.mjs";
import { loadRuntimeEnvironment } from "./env-file.mjs";
import { runPreflight } from "./preflight.mjs";

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "../..");

export async function generateOne({
  args = parseArgs(),
  context = loadContext(),
  env = process.env,
  provider,
  preflightSystem,
  loadEnvironment = loadRuntimeEnvironment,
  preflightRunner = runPreflight,
} = {}) {
  const runtimeEnv = loadEnvironment(args, env);
  const items = selectPlan(context, args);
  if (items.length !== 1) {
    const error = new Error(`Geracao exige exatamente um item; selecionados: ${items.length}.`);
    error.code = "GENERATION_SELECTION_NOT_EXCLUSIVE";
    throw error;
  }
  const [item] = items;

  const pilot = args["--pilot"] === true
    || Boolean(pilotItemForAsset(context.pilot, item.asset_futuro));
  const record = planRecord(item, context, { pilot });
  const prompt = record.prompt;
  const readiness = {
    ready: record.referencias_prontas !== false,
    references: record.referencias,
    blocking: record.bloqueios_referencia,
  };
  const request = {
    uid: item.uid,
    arquivo: normalizeAsset(item.asset_futuro),
    prompt,
    prompt_hash: record.prompt_hash,
    model: context.config.provider.primary_model || context.config.provider.model,
    references: readiness.references,
    references_ready: readiness.ready,
    quality: context.config.provider.quality,
    size: context.config.provider.size,
    output_format: context.config.provider.output_format,
    estimated_cost_usd: Number(context.config.provider.estimated_cost_usd_per_image || 0),
  };
  const maxAttempts = Number(args["--max-attempts"] || context.config.limits.max_attempts);
  const preflight = args["--only-phase-base"] !== undefined
    ? preflightRunner({
      args,
      context,
      runtimeEnv,
      root: ROOT,
      system: preflightSystem,
    })
    : null;

  if (preflight?.status === "BLOCKED") {
    const error = new Error(`Pre-voo bloqueado: ${preflight.failures.join(", ")}.`);
    error.code = "PREFLIGHT_BLOCKED";
    error.preflight = preflight;
    throw error;
  }

  const conditions = {
    requiredPhase: "002",
    maxAllowedBudgetUsd: PILOT_MAX_COST_USD,
    requiredBudgetUsd: requiredExclusiveBudget(context.config, maxAttempts),
    selectionCount: items.length,
    gitClean: preflight ? preflight.checks.find((entry) => entry.name === "git_clean")?.passed : false,
    referenceReady: readiness.ready,
    stopAbsent: !fs.existsSync(path.join(ROOT, "data", "image-automation", "STOP")),
    baseAbsent: !fs.existsSync(path.join(ROOT, request.arquivo)),
  };
  const gate = generationGate(context.config, args, runtimeEnv, conditions);

  if (args["--dry-run"] === true) {
    return sanitizeForLog({
      mode: "dry-run",
      paid_generation_started: false,
      api_calls: 0,
      preflight,
      gate,
      request,
    });
  }

  assertGenerationAuthorized(context.config, args, runtimeEnv, conditions);
  assertStopNotRequested(ROOT);
  if (pilot) {
    assertPilotReferencesReady(item, context.pilot, {
      states: latestStates(context.events),
    });
  } else if (!readiness.ready) {
    const details = readiness.blocking
      .map((reference) => `${reference.asset}:${reference.error}`)
      .join(", ");
    throw new Error(`Geracao bloqueada por referencia obrigatoria: ${details}`);
  }
  const referenceFiles = request.references
    .filter((reference) => reference.available && reference.asset)
    .map((reference) => {
      const referencePath = path.join(ROOT, reference.asset);
      return {
        bytes: fs.readFileSync(referencePath),
        name: path.basename(referencePath),
      };
    });
  const rawDirectory = path.join(
    ROOT,
    "data",
    "image-automation",
    "tmp",
    "image-pilot-review",
    "raw",
  );
  fs.mkdirSync(rawDirectory, { recursive: true });
  const rawPath = path.join(rawDirectory, path.basename(request.arquivo));
  const imageProvider = provider || createOpenAIImageProvider({
    stopRequested: () => fs.existsSync(path.join(ROOT, "data", "image-automation", "STOP")),
  });
  const budget = createExclusiveBudget({
    asset: request.arquivo,
    maxCostUsd: gate.max_cost_usd,
    estimatedCostPerAttempt: estimatedAttemptCost(context.config),
  });

  appendJsonl("data/image-automation/state.jsonl", stateEvent(item, "gerando", {
    prompt_hash: request.prompt_hash,
    modelo: request.model,
    custo_estimado_usd: request.estimated_cost_usd,
  }));

  try {
    const result = await imageProvider.generateEdit({
      apiKey: runtimeEnv.OPENAI_API_KEY,
      referenceFiles,
      prompt,
      model: request.model,
      quality: request.quality,
      size: request.size,
      outputFormat: request.output_format,
      maxAttempts,
      pauseMs: context.config.limits.pause_ms,
      beforeAttempt: ({ attempt, model }) => budget.beforeAttempt({
        asset: request.arquivo,
        attempt,
        model,
      }),
      onAttempt: ({ attempt, model, result, classification }) => {
        const attemptRecord = budget.recordAttempt({
          asset: request.arquivo,
          attempt,
          model,
          result: result === "success" ? "success" : classification,
        });
        appendJsonl("data/image-automation/runtime/attempts.jsonl", {
          timestamp: new Date().toISOString(),
          ...attemptRecord,
        });
      },
    });
    fs.writeFileSync(rawPath, result.png_bytes);
    appendJsonl("data/image-automation/state.jsonl", stateEvent(item, "gerada", {
      tentativas: result.attempts,
      modelo: result.model,
      request_id: result.request_id,
      budget: budget.snapshot(),
      next_steps: [
        "remove-background",
        "validate-rgba",
        "human-review-queue",
      ],
      arquivo_temporario: path.relative(ROOT, rawPath).replaceAll("\\", "/"),
    }));
    return sanitizeForLog({
      mode: "execute",
      paid_generation_started: true,
      raw_file: path.relative(ROOT, rawPath).replaceAll("\\", "/"),
      model: result.model,
      attempts: result.attempts,
      request_id: result.request_id,
    });
  } catch (error) {
    const message = safeErrorMessage(error);
    appendJsonl("data/image-automation/errors.jsonl", {
      type: "error",
      timestamp: new Date().toISOString(),
      uid: item.uid,
      asset: request.arquivo,
      classification: error?.classification || error?.code || "unknown",
      attempts: error?.attempts || 0,
      error: message,
    });
    appendJsonl("data/image-automation/state.jsonl", stateEvent(item, "falhou", {
      erro: message,
      tentativas: error?.attempts || 0,
    }));
    throw error;
  }
}

if (process.argv[1] && path.resolve(process.argv[1]) === fileURLToPath(import.meta.url)) {
  generateOne()
    .then((result) => console.log(JSON.stringify(result, null, 2)))
    .catch((error) => {
      console.error(safeErrorMessage(error));
      process.exitCode = 1;
    });
}
