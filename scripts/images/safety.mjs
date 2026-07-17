import fs from "node:fs";
import path from "node:path";

const SECRET_KEYS = /(?:api[_-]?key|authorization|secret|token|b64|base64)/iu;
const BASE64_LIKE = /^[A-Za-z0-9+/]{160,}={0,2}$/u;

export class SafetyLockError extends Error {
  constructor(message, code = "SAFETY_LOCKED") {
    super(message);
    this.name = "SafetyLockError";
    this.code = code;
  }
}

export function isTrue(value) {
  return String(value || "").trim().toLowerCase() === "true";
}

export function finitePositive(value) {
  const number = Number(value);
  return Number.isFinite(number) && number > 0 ? number : 0;
}

export function effectiveMaxCost(config, args = {}, env = process.env) {
  const authorization = config.authorization || {};
  const cliBudget = finitePositive(args["--max-cost-usd"]);
  const envBudget = finitePositive(env[authorization.budget_environment_variable || "IMAGE_MAX_COST_USD"]);
  const configBudget = finitePositive(config.limits?.max_cost_usd);
  return cliBudget || envBudget || configBudget;
}

export function generationGate(config, args = {}, env = process.env, conditions = {}) {
  const authorization = config.authorization || {};
  const provider = config.provider || {};
  const limits = config.limits || {};
  const executeFlag = authorization.execute_flag || "--execute-paid-generation";
  const estimatedCost = finitePositive(conditions.requiredBudgetUsd)
    || finitePositive(provider.estimated_cost_usd_per_image);
  const maxCostUsd = effectiveMaxCost(config, args, env);
  const requiredPhase = String(conditions.requiredPhase || "002").padStart(3, "0");
  const selectedPhase = String(args["--only-phase-base"] || "").padStart(3, "0");
  const storageMode = env.IMAGE_STORAGE_MODE || config.runtime_defaults?.IMAGE_STORAGE_MODE;
  const checks = {
    provider_is_openai: provider.name === "openai",
    provider_environment: env[authorization.provider_environment_variable || "IMAGE_PROVIDER"]
      === (authorization.required_provider || "openai"),
    explicit_authorization: isTrue(env[authorization.environment_variable || "IMAGE_GENERATION_AUTHORIZED"]),
    explicit_execute_flag: args[executeFlag] === true,
    positive_budget: maxCostUsd > 0,
    budget_within_pilot_ceiling: maxCostUsd <= Number(conditions.maxAllowedBudgetUsd || 0.19),
    budget_covers_request: maxCostUsd >= estimatedCost && estimatedCost > 0,
    api_key_present: Boolean(String(env.OPENAI_API_KEY || "").trim()),
    exact_phase_base: selectedPhase === requiredPhase,
    single_selection: conditions.selectionCount === 1,
    no_publish: args["--no-publish"] === true,
    no_push: args["--no-push"] === true,
    human_review: args["--review-policy"] === "human-mandatory",
    publication_disabled: !isTrue(env.IMAGE_PUBLICATION_AUTHORIZED),
    local_storage: storageMode === "local",
    git_clean: conditions.gitClean === true,
    reference_ready: conditions.referenceReady === true,
    stop_absent: conditions.stopAbsent === true,
    private_base_absent: conditions.baseAbsent === true,
  };
  return {
    authorized: Object.values(checks).every(Boolean),
    checks,
    execute_flag: executeFlag,
    estimated_cost_usd: estimatedCost,
    max_cost_usd: maxCostUsd,
  };
}

export function assertGenerationAuthorized(config, args = {}, env = process.env, conditions = {}) {
  const gate = generationGate(config, args, env, conditions);
  if (!gate.authorized) {
    const missing = Object.entries(gate.checks)
      .filter(([, passed]) => !passed)
      .map(([name]) => name);
    throw new SafetyLockError(
      `Geracao paga bloqueada. Travas ausentes: ${missing.join(", ")}.`,
      "GENERATION_NOT_AUTHORIZED",
    );
  }
  return gate;
}

export function assertStopNotRequested(root) {
  const stopFile = path.join(root, "data", "image-automation", "STOP");
  if (fs.existsSync(stopFile)) {
    throw new SafetyLockError("Parada segura solicitada pelo arquivo STOP.", "STOP_REQUESTED");
  }
}

export function sanitizeForLog(value, key = "") {
  if (SECRET_KEYS.test(key)) return "[REDACTED]";
  if (typeof value === "string") {
    if (value.startsWith("sk-")) return "[REDACTED]";
    if (BASE64_LIKE.test(value)) return "[BASE64_REDACTED]";
    return value;
  }
  if (Array.isArray(value)) return value.map((entry) => sanitizeForLog(entry));
  if (value && typeof value === "object") {
    return Object.fromEntries(
      Object.entries(value).map(([entryKey, entryValue]) => [
        entryKey,
        sanitizeForLog(entryValue, entryKey),
      ]),
    );
  }
  return value;
}

export function safeErrorMessage(error) {
  const message = error instanceof Error ? error.message : String(error);
  return message
    .replace(/sk-[A-Za-z0-9_-]{8,}/gu, "[REDACTED]")
    .replace(/[A-Za-z0-9+/]{160,}={0,2}/gu, "[BASE64_REDACTED]");
}
