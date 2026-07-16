import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import {
  appendJsonl,
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
  pilotReferenceReadiness,
} from "./pilot-lib.mjs";
import { createOpenAIImageProvider } from "./providers/openai-image-provider.mjs";
import {
  assertGenerationAuthorized,
  assertStopNotRequested,
  generationGate,
  safeErrorMessage,
  sanitizeForLog,
} from "./safety.mjs";

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "../..");

export async function generateOne({
  args = parseArgs(),
  context = loadContext(),
  env = process.env,
  provider,
} = {}) {
  const item = selectPlan(context, { ...args, "--limit": 1 })[0];
  if (!item) throw new Error("Nenhum item elegivel encontrado.");

  const pilot = args["--pilot"] === true
    || Boolean(pilotItemForAsset(context.pilot, item.asset_futuro));
  const record = planRecord(item, context, { pilot });
  const prompt = record.prompt;
  const readiness = pilot
    ? pilotReferenceReadiness(item, context.pilot)
    : {
      ready: true,
      references: [{
        asset: context.config.references.pig_principal,
        available: true,
        required: true,
      }],
    };
  const request = {
    uid: item.uid,
    arquivo: normalizeAsset(item.asset_futuro),
    prompt,
    prompt_hash: record.prompt_hash,
    model: context.config.provider.model,
    fallback_model: context.config.provider.fallback_model,
    references: readiness.references,
    references_ready: readiness.ready,
    quality: context.config.provider.quality,
    size: context.config.provider.size,
    output_format: context.config.provider.output_format,
    estimated_cost_usd: Number(context.config.provider.estimated_cost_usd_per_image || 0),
  };
  const gate = generationGate(context.config, args, env);

  if (args["--dry-run"] || !gate.authorized) {
    return sanitizeForLog({
      mode: "dry-run",
      paid_generation_started: false,
      gate,
      request,
    });
  }

  assertGenerationAuthorized(context.config, args, env);
  assertStopNotRequested(ROOT);
  if (pilot) assertPilotReferencesReady(item, context.pilot);
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

  appendJsonl("data/image-automation/state.jsonl", stateEvent(item, "gerando", {
    prompt_hash: request.prompt_hash,
    modelo: request.model,
    custo_estimado_usd: request.estimated_cost_usd,
  }));

  try {
    const result = await imageProvider.generateEdit({
      apiKey: env.OPENAI_API_KEY,
      referenceFiles,
      prompt,
      model: request.model,
      fallbackModel: request.fallback_model,
      quality: request.quality,
      size: request.size,
      outputFormat: request.output_format,
      maxAttempts: context.config.limits.max_attempts,
      pauseMs: context.config.limits.pause_ms,
    });
    fs.writeFileSync(rawPath, result.png_bytes);
    appendJsonl("data/image-automation/state.jsonl", stateEvent(item, "gerada", {
      tentativas: result.attempts,
      modelo: result.model,
      request_id: result.request_id,
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
