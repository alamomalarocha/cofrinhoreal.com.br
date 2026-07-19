import fs from "node:fs";
import path from "node:path";
import { execFileSync } from "node:child_process";
import { createRequire } from "node:module";
import { fileURLToPath } from "node:url";
import {
  fileSha256, latestStates, loadContext, normalizeAsset, parseArgs, planRecord, selectPlan,
} from "./lib.mjs";
import { estimatedAttemptCost } from "./budget.mjs";
import { loadRuntimeEnvironment, RUNTIME_ENV_META } from "./env-file.mjs";
import { providerModelSelection } from "./model-config.mjs";
import { finitePositive, isTrue, safeErrorMessage } from "./safety.mjs";

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "../..");
const require = createRequire(import.meta.url);
export const IDENTITY_UIDS = Object.freeze(["AVA-002-AZL", "AVA-002-RSA", "AVA-002-ARC"]);
export const APPROVED_BASE = "data/image-automation/phase-bases/002-pig-bebe-base.png";
export const APPROVED_BASE_SHA256 = "bbe5450cd56bcec3df5ab1d51796f85640db6c6d0c95204e9a7ee8063e68508f";
export const IDENTITY_MAX_COST_USD = 0.061430;

function check(name, passed, detail, category = "structural") {
  return { name, passed: Boolean(passed), category, detail };
}

function defaultSystem(root) {
  let gitClean = false;
  try {
    gitClean = execFileSync("git", ["status", "--porcelain", "--untracked-files=all"], {
      cwd: root, encoding: "utf8", windowsHide: true,
    }).trim() === "";
  } catch { gitClean = false; }
  let dependencyReady = false;
  try { require.resolve("openai"); dependencyReady = true; } catch { dependencyReady = false; }
  return { gitClean, dependencyReady };
}

export function runIdentityPreflight({
  args = parseArgs(), context = loadContext(), env = process.env,
  runtimeEnv: providedRuntimeEnv, root = ROOT, system = {},
} = {}) {
  let runtimeEnv;
  let envFileError = null;
  try { runtimeEnv = providedRuntimeEnv || loadRuntimeEnvironment(args, env); }
  catch (error) { runtimeEnv = { ...env }; envFileError = safeErrorMessage(error); }
  const runtime = { ...defaultSystem(root), ...system };
  const dryRun = args["--dry-run"] === true;
  let items = [];
  let selectionError = null;
  try { items = selectPlan(context, args); } catch (error) { selectionError = safeErrorMessage(error); }
  const item = items.length === 1 ? items[0] : null;
  let record = null;
  let recordError = null;
  try { if (item) record = planRecord(item, context, { pilot: true }); }
  catch (error) { recordError = safeErrorMessage(error); }
  const uid = String(args["--only-uid"] || "");
  const references = record?.referencias || [];
  const referenceAssets = references.map((reference) => normalizeAsset(reference.asset));
  const basePath = path.join(root, APPROVED_BASE);
  const baseExists = runtime.baseExists ?? fs.existsSync(basePath);
  const baseSha256 = runtime.baseSha256 ?? (baseExists ? fileSha256(basePath) : null);
  const states = latestStates(context.events);
  const baseStatus = runtime.baseStatus ?? states.get(APPROVED_BASE)?.status;
  const baseApproved = baseStatus === "aprovada" || baseStatus === "publicada";
  const targetPath = item ? path.join(root, normalizeAsset(item.asset_futuro)) : null;
  const targetAbsent = runtime.targetAbsent ?? Boolean(targetPath && !fs.existsSync(targetPath));
  const cliBudget = finitePositive(args["--max-cost-usd"]);
  const singleAttempt = String(args["--max-attempts"] || "") === "1";
  let modelSelection = null;
  try { modelSelection = providerModelSelection(context.config.provider); } catch { modelSelection = null; }
  const pilotItem = context.pilot.items.find((candidate) => candidate.uid === uid);
  const exactReferences = referenceAssets.length === 1 && referenceAssets[0] === APPROVED_BASE;
  const structural = [
    check("env_file_available", !envFileError, envFileError || "not-requested"),
    check("single_uid_selected", Boolean(item) && items.length === 1 && !selectionError, selectionError || uid),
    check("official_identity_uid", IDENTITY_UIDS.includes(uid), uid),
    check("identity_kind", pilotItem?.kind === "identity" && (!item?.kind || item.kind === "character"), pilotItem?.kind),
    check("standard_identity_blocked", pilotItem?.identity !== "padrao", pilotItem?.identity),
    check("private_base_exists", baseExists, APPROVED_BASE),
    check("private_base_hash", baseSha256 === APPROVED_BASE_SHA256, { expected: APPROVED_BASE_SHA256, actual: baseSha256 }),
    check("private_base_approved", baseApproved, baseStatus || "missing"),
    check("single_private_base_reference", exactReferences, referenceAssets),
    check("no_public_identity_reference", referenceAssets.every((asset) => !asset.startsWith("assets/characters/")), referenceAssets),
    check("no_draft_reference", referenceAssets.every((asset) => !asset.includes("/_drafts/")), referenceAssets),
    check("pig_principal_not_reference", !referenceAssets.includes("assets/characters/001-pig-principal.png"), referenceAssets),
    check("references_ready", record?.referencias_prontas === true && !recordError, recordError || record?.bloqueios_referencia),
    check("public_target_absent", targetAbsent, targetPath),
    check("git_clean", runtime.gitClean === true, "git status --porcelain"),
    check("single_attempt_only", singleAttempt, args["--max-attempts"]),
    check("fallback_absent", context.config.provider.fallback_model === null && args["--allow-model-fallback"] !== true, context.config.provider.fallback_model),
    check("exact_model", modelSelection?.primary.requested_model === "gpt-image-2-2026-04-21", modelSelection?.primary.requested_model),
    check("medium_quality", context.config.provider.quality === "medium", context.config.provider.quality),
    check("exact_size", context.config.provider.size === "1024x1536", context.config.provider.size),
    check("png_format", context.config.provider.output_format === "png", context.config.provider.output_format),
    check("technical_background", context.config.provider.technical_background === "#777777", context.config.provider.technical_background),
    check("human_review_policy", args["--review-policy"] === "human-mandatory", args["--review-policy"]),
    check("no_publish_flag", args["--no-publish"] === true, "--no-publish"),
    check("no_push_flag", args["--no-push"] === true, "--no-push"),
    check("exclusive_budget_present", cliBudget > 0, cliBudget),
    check("exclusive_budget_ceiling", cliBudget > 0 && cliBudget <= IDENTITY_MAX_COST_USD, { budget: cliBudget, ceiling: IDENTITY_MAX_COST_USD }),
  ];
  const runtimeMeta = runtimeEnv?.[RUNTIME_ENV_META] || { conflicts: [] };
  structural.push(check("no_inherited_env_conflicts", runtimeMeta.conflicts.length === 0, runtimeMeta.conflicts));
  const activation = [
    check("dependency_ready", runtime.dependencyReady, "openai", "activation"),
    check("api_key_present", Boolean(String(runtimeEnv.OPENAI_API_KEY || "").trim()), "OPENAI_API_KEY", "activation"),
    check("provider_enabled_temporarily", runtimeEnv.IMAGE_PROVIDER === "openai", runtimeEnv.IMAGE_PROVIDER, "activation"),
    check("generation_authorized", isTrue(runtimeEnv.IMAGE_GENERATION_AUTHORIZED), "IMAGE_GENERATION_AUTHORIZED", "activation"),
    check("explicit_execute_flag", args[context.config.authorization.execute_flag] === true, context.config.authorization.execute_flag, "activation"),
    check("publication_disabled", !isTrue(runtimeEnv.IMAGE_PUBLICATION_AUTHORIZED), "publication=false", "activation"),
  ];
  const structuralFailures = structural.filter((entry) => !entry.passed);
  const activationFailures = activation.filter((entry) => !entry.passed);
  const status = structuralFailures.length ? "BLOCKED" : activationFailures.length ? (dryRun ? "WARNING" : "BLOCKED") : "READY";
  return {
    status, mode: dryRun ? "dry-run" : "activation-check", paid_generation_started: false, api_calls: 0,
    selection: item ? { count: 1, uid: item.uid, asset: normalizeAsset(item.asset_futuro) } : { count: items.length, error: selectionError },
    base: { asset: APPROVED_BASE, sha256: baseSha256, approved: baseApproved },
    references: referenceAssets,
    quarantine: item ? `data/image-automation/tmp/image-pilot-review/raw/${path.basename(item.asset_futuro)}` : null,
    public_target: item ? normalizeAsset(item.asset_futuro) : null,
    budget: { max_cost_usd: cliBudget, ceiling_usd: IDENTITY_MAX_COST_USD, max_attempts: 1, estimated_cost_usd: estimatedAttemptCost(context.config) },
    model: modelSelection ? { primary: modelSelection.primary.requested_model, fallback: null } : null,
    checks: [...structural, ...activation],
    failures: [...structuralFailures, ...activationFailures].map((entry) => entry.name),
  };
}

if (process.argv[1] && path.resolve(process.argv[1]) === fileURLToPath(import.meta.url)) {
  try {
    const report = runIdentityPreflight();
    console.log(JSON.stringify(report, null, 2));
    if (report.status === "BLOCKED") process.exitCode = 2;
  } catch (error) { console.error(safeErrorMessage(error)); process.exitCode = 1; }
}
