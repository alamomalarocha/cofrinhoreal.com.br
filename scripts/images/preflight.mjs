import fs from "node:fs";
import path from "node:path";
import { execFileSync } from "node:child_process";
import { createRequire } from "node:module";
import { fileURLToPath } from "node:url";
import {
  loadContext,
  normalizeAsset,
  parseArgs,
  planRecord,
  selectPlan,
} from "./lib.mjs";
import {
  estimatedAttemptCost,
  PILOT_MAX_COST_USD,
  requiredExclusiveBudget,
} from "./budget.mjs";
import { loadRuntimeEnvironment, RUNTIME_ENV_META } from "./env-file.mjs";
import { providerModelSelection } from "./model-config.mjs";
import { effectiveMaxCost, finitePositive, isTrue, safeErrorMessage } from "./safety.mjs";

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "../..");
const require = createRequire(import.meta.url);

function nodeMajor(version) {
  return Number(String(version || "0").replace(/^v/u, "").split(".")[0]);
}

function defaultSystem(root) {
  let gitClean = false;
  let gitError = null;
  try {
    const status = execFileSync("git", ["status", "--porcelain", "--untracked-files=all"], {
      cwd: root,
      encoding: "utf8",
      windowsHide: true,
    });
    gitClean = status.trim() === "";
  } catch (error) {
    gitError = safeErrorMessage(error);
  }

  let dependencyReady = false;
  try {
    require.resolve("openai");
    dependencyReady = true;
  } catch {
    dependencyReady = false;
  }

  let diskFreeBytes = 0;
  try {
    const stats = fs.statfsSync(root);
    diskFreeBytes = Number(stats.bavail) * Number(stats.bsize);
  } catch {
    diskFreeBytes = 0;
  }

  const writableDirectories = [
    path.join(root, "data", "image-automation", "phase-bases"),
    path.join(root, "data", "image-automation", "tmp"),
    path.join(root, "data", "image-automation", "runtime"),
  ];
  let writable = true;
  try {
    for (const directory of writableDirectories) {
      const existing = fs.existsSync(directory) ? directory : path.dirname(directory);
      fs.accessSync(existing, fs.constants.W_OK);
    }
  } catch {
    writable = false;
  }

  return {
    gitClean,
    gitError,
    nodeVersion: process.versions.node,
    dependencyReady,
    diskFreeBytes,
    writable,
  };
}

function check(name, passed, detail, category = "structural") {
  return { name, passed: Boolean(passed), category, detail };
}

export function runPreflight({
  args = parseArgs(),
  context = loadContext(),
  env = process.env,
  runtimeEnv: providedRuntimeEnv,
  root = ROOT,
  system,
} = {}) {
  let runtimeEnv;
  let envFileError = null;
  try {
    runtimeEnv = providedRuntimeEnv || loadRuntimeEnvironment(args, env);
  } catch (error) {
    runtimeEnv = { ...env };
    envFileError = safeErrorMessage(error);
  }

  const runtime = { ...defaultSystem(root), ...(system || {}) };
  const dryRun = args["--dry-run"] === true;
  const rawMaxAttempts = args["--max-attempts"];
  const parsedMaxAttempts = Number(rawMaxAttempts);
  const singleAttemptRequested = rawMaxAttempts !== undefined
    && Number.isInteger(parsedMaxAttempts)
    && parsedMaxAttempts === 1;
  const maxAttempts = 1;
  const maxCostUsd = effectiveMaxCost(context.config, args, runtimeEnv);
  const perAttemptUsd = estimatedAttemptCost(context.config);
  const requiredBudgetUsd = requiredExclusiveBudget(context.config, maxAttempts);
  const runtimeMeta = runtimeEnv?.[RUNTIME_ENV_META] || { conflicts: [], source: "explicit-runtime" };
  const cliBudgetUsd = finitePositive(args["--max-cost-usd"]);
  const externalBudgetUsd = finitePositive(runtimeEnv.IMAGE_MAX_COST_USD);

  let items = [];
  let selectionError = null;
  try {
    items = selectPlan(context, args);
  } catch (error) {
    selectionError = safeErrorMessage(error);
  }
  const item = items.length === 1 ? items[0] : null;
  let record = null;
  let recordError = null;
  if (item) {
    try {
      record = planRecord(item, context, { pilot: true });
    } catch (error) {
      recordError = safeErrorMessage(error);
    }
  }
  const basePath = item ? path.join(root, normalizeAsset(item.asset_futuro)) : null;
  const stopPath = path.join(root, "data", "image-automation", "STOP");
  const gitignorePath = path.join(root, ".gitignore");
  const gitignore = fs.existsSync(gitignorePath) ? fs.readFileSync(gitignorePath, "utf8") : "";

  let modelSelection = null;
  let modelError = null;
  try {
    modelSelection = providerModelSelection(context.config.provider);
  } catch (error) {
    modelError = safeErrorMessage(error);
  }

  const structural = [
    check("env_file_available", !envFileError, envFileError || args["--env-file"] || "not-requested"),
    check("no_inherited_env_conflicts", runtimeMeta.conflicts.length === 0, runtimeMeta.conflicts),
    check("secure_provider_default", context.config.provider.enabled === false, "provider.enabled=false"),
    check("secure_mode_default", context.config.mode !== "execute", `mode=${context.config.mode}`),
    check("secure_budget_default", Number(context.config.limits.max_cost_usd) === 0, "limits.max_cost_usd=0"),
    check("secure_publication_default", context.config.runtime_defaults?.IMAGE_PUBLICATION_AUTHORIZED === false, "publication=false"),
    check("model_recognized", Boolean(modelSelection), modelError || modelSelection?.primary.requested_model),
    check("snapshot_is_primary", modelSelection?.primary.requested_model === "gpt-image-2-2026-04-21", modelSelection?.primary.requested_model),
    check("model_override_absent", args["--model"] === undefined && runtimeEnv.IMAGE_MODEL === undefined, "model is fixed by config"),
    check("fallback_blocked_by_default", args["--allow-model-fallback"] !== true, "requires --allow-model-fallback"),
    check("exact_phase_requested", String(args["--only-phase-base"] || "").padStart(3, "0") === "002", args["--only-phase-base"]),
    check("single_phase_selected", items.length === 1 && !selectionError, selectionError || `${items.length} selected`),
    check("selected_phase_is_002", item?.numero === "002", item?.numero || "none"),
    check("pilot_record_valid", Boolean(record) && !recordError, recordError || item?.uid || "none"),
    check("single_attempt_only", singleAttemptRequested, "--max-attempts must be exactly 1"),
    check(
      "private_base_absent",
      runtime.baseAbsent ?? (Boolean(basePath) && !fs.existsSync(basePath)),
      basePath || "none",
    ),
    check(
      "reference_ready",
      runtime.referenceReady ?? (record?.referencias_prontas === true),
      record?.bloqueios_referencia || [],
    ),
    check("stop_absent", runtime.stopAbsent ?? !fs.existsSync(stopPath), stopPath),
    check("git_clean", runtime.gitClean === true, runtime.gitError || "git status --porcelain"),
    check("node_20_or_newer", nodeMajor(runtime.nodeVersion) >= 20, runtime.nodeVersion),
    check("workspace_writable", runtime.writable === true, root),
    check("disk_space_available", runtime.diskFreeBytes >= 100 * 1024 * 1024, `${runtime.diskFreeBytes} bytes free`),
    check(
      "runtime_paths_ignored",
      runtime.runtimePathsIgnored
        ?? (/data\/image-automation\/runtime\//u.test(gitignore) && /data\/image-automation\/tmp\//u.test(gitignore)),
      ".gitignore",
    ),
    check(
      "phase_bases_ignored",
      runtime.phaseBasesIgnored
        ?? /data\/image-automation\/phase-bases\/\*\.png/u.test(gitignore),
      ".gitignore",
    ),
    check("no_publish_flag", args["--no-publish"] === true, "--no-publish"),
    check("no_push_flag", args["--no-push"] === true, "--no-push"),
    check("human_review_policy", args["--review-policy"] === "human-mandatory", args["--review-policy"]),
    check("publication_not_authorized", !isTrue(runtimeEnv.IMAGE_PUBLICATION_AUTHORIZED), "IMAGE_PUBLICATION_AUTHORIZED must not be true"),
    check("local_storage", (runtimeEnv.IMAGE_STORAGE_MODE || context.config.runtime_defaults?.IMAGE_STORAGE_MODE) === "local", runtimeEnv.IMAGE_STORAGE_MODE || context.config.runtime_defaults?.IMAGE_STORAGE_MODE),
    check("cli_budget_present", cliBudgetUsd > 0, "--max-cost-usd is required"),
    check("cli_budget_within_pilot_ceiling", cliBudgetUsd <= PILOT_MAX_COST_USD, { cliBudgetUsd, ceiling: PILOT_MAX_COST_USD }),
    check("positive_exclusive_budget", maxCostUsd > 0, maxCostUsd),
    check("budget_within_pilot_ceiling", maxCostUsd <= PILOT_MAX_COST_USD, { maxCostUsd, ceiling: PILOT_MAX_COST_USD }),
    check("budget_covers_all_attempts", maxCostUsd >= requiredBudgetUsd, { maxCostUsd, requiredBudgetUsd }),
  ];

  const activation = [
    check("openai_dependency_ready", runtime.dependencyReady === true, "openai package resolvable", "activation"),
    check("api_key_present", Boolean(String(runtimeEnv.OPENAI_API_KEY || "").trim()), "OPENAI_API_KEY", "activation"),
    check("provider_environment", runtimeEnv.IMAGE_PROVIDER === "openai", runtimeEnv.IMAGE_PROVIDER || "unset", "activation"),
    check("generation_authorized", isTrue(runtimeEnv.IMAGE_GENERATION_AUTHORIZED), "IMAGE_GENERATION_AUTHORIZED=true", "activation"),
    check("external_budget_present", externalBudgetUsd > 0, "IMAGE_MAX_COST_USD is required", "activation"),
    check(
      "explicit_execute_flag",
      args[context.config.authorization?.execute_flag || "--execute-paid-generation"] === true,
      context.config.authorization?.execute_flag || "--execute-paid-generation",
      "activation",
    ),
  ];
  const structuralFailures = structural.filter((entry) => !entry.passed);
  const activationFailures = activation.filter((entry) => !entry.passed);
  const status = structuralFailures.length > 0
    ? "BLOCKED"
    : activationFailures.length > 0
      ? (dryRun ? "WARNING" : "BLOCKED")
      : "READY";

  return {
    status,
    mode: dryRun ? "dry-run" : "activation-check",
    paid_generation_started: false,
    api_calls: 0,
    root,
    selection: item ? {
      count: items.length,
      numero: item.numero,
      uid: item.uid,
      asset: normalizeAsset(item.asset_futuro),
    } : { count: items.length, error: selectionError },
    model: modelSelection ? {
      primary: modelSelection.primary.requested_model,
      pricing_base: modelSelection.primary.pricing_base_model,
      fallback: modelSelection.fallback?.requested_model || null,
      fallback_authorized: args["--allow-model-fallback"] === true,
    } : { error: modelError },
    budget: {
      exclusive_asset: item ? normalizeAsset(item.asset_futuro) : null,
      max_cost_usd: maxCostUsd,
      max_attempts: maxAttempts,
      estimated_cost_per_attempt_usd: perAttemptUsd,
      required_for_all_attempts_usd: requiredBudgetUsd,
      remaining_after_max_attempts_usd: Number((maxCostUsd - requiredBudgetUsd).toFixed(6)),
    },
    checks: [...structural, ...activation],
    failures: [...structuralFailures, ...activationFailures].map((entry) => entry.name),
  };
}

if (process.argv[1] && path.resolve(process.argv[1]) === fileURLToPath(import.meta.url)) {
  try {
    const report = runPreflight();
    console.log(JSON.stringify(report, null, 2));
    if (report.status === "BLOCKED") process.exitCode = 2;
  } catch (error) {
    console.error(safeErrorMessage(error));
    process.exitCode = 1;
  }
}
