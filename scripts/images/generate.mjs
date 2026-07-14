import fs from "node:fs";
import {
  appendJsonl,
  buildVisualPrompt,
  generationAuthorized,
  loadContext,
  normalizeAsset,
  parseArgs,
  safeError,
  selectPlan,
  sha256,
  stateEvent,
} from "./lib.mjs";

const args = parseArgs();
const context = loadContext();
const item = selectPlan(context, { ...args, "--limit": 1 })[0];
if (!item) throw new Error("Nenhum item elegível encontrado.");
const prompt = buildVisualPrompt(item);
const request = {
  uid: item.uid,
  arquivo: normalizeAsset(item.asset_futuro),
  prompt,
  prompt_hash: sha256(prompt),
  model: context.config.provider.model,
  reference: context.config.references.pig_principal,
  estimated_cost_usd: Number(context.config.provider.estimated_cost_usd_per_image || 0),
};

if (args["--dry-run"] || context.config.mode === "dry-run" || !generationAuthorized(context.config, args)) {
  console.log(JSON.stringify({
    mode: "dry-run",
    paid_generation_started: false,
    reason: "Provedor desativado ou autorização explícita ausente.",
    request,
  }, null, 2));
  process.exit(0);
}

try {
  if (fs.existsSync(new URL("../../data/image-automation/STOP", import.meta.url))) {
    throw new Error("Parada segura solicitada antes da geração.");
  }
  appendJsonl("data/image-automation/state.jsonl", stateEvent(item, "gerando", {
    tentativas: 1,
    prompt,
    prompt_hash: request.prompt_hash,
    modelo: request.model,
    custo_estimado_usd: request.estimated_cost_usd,
  }));
  throw new Error("Nenhum adaptador pago está habilitado. Configure um provedor somente após autorização de Alamo.");
} catch (error) {
  const message = safeError(error);
  appendJsonl("data/image-automation/errors.jsonl", {
    type: "error", timestamp: new Date().toISOString(), uid: item.uid, asset: request.arquivo, error: message,
  });
  appendJsonl("data/image-automation/state.jsonl", stateEvent(item, "falhou", { erro: message }));
  throw error;
}
