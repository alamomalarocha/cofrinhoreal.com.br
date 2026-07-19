import assert from "node:assert/strict";
import fs from "node:fs";
import os from "node:os";
import path from "node:path";
import test from "node:test";
import { fileSha256, loadContext, planRecord } from "../../scripts/images/lib.mjs";
import {
  BATCH_PHASES,
  MAX_BATCH_COST_USD,
  MAX_ITEM_COST_USD,
  INCIDENT_PREVIOUS_PROMPT_SHA256,
  INCIDENT_REQUEST_ID,
  phasePromptAudit,
  prepareResumePlan,
  resumeDecision,
  runBatch,
  selectBatchPhases,
  validateBatchArgs,
} from "../../scripts/images/phase-base-batch.mjs";
import { runPreflight } from "../../scripts/images/preflight.mjs";

function args(overrides = {}) {
  return {
    "--from-phase": "003", "--to-phase": "011", "--dry-run": true,
    "--max-cost-usd-per-item": "0.061430", "--max-total-cost-usd": "0.552870",
    "--max-attempts": "1", "--stop-on-error": true, "--no-publish": true,
    "--no-push": true, "--review-policy": "human-mandatory", ...overrides,
  };
}

function paidArgs(overrides = {}) {
  const value = args({
    "--execute-paid-batch": true, "--execute-paid-generation": true,
    "--authorize-external-export": true, "--env-file": "external.env", ...overrides,
  });
  delete value["--dry-run"];
  return value;
}

function resumeArgs(overrides = {}) {
  return args({
    "--resume": true, "--authorize-retry-failed-phase": "006",
    "--max-additional-cost-usd": "0.368580",
    "--max-cautious-total-cost-usd": "0.614300",
    ...overrides,
  });
}

function resumeWorkspace() {
  const root = fs.mkdtempSync(path.join(os.tmpdir(), "phase-006-resume-"));
  const context = loadContext();
  const phases = selectBatchPhases(context);
  const checkpoint = {
    schema_version: "1.0.0", current_phase: "006",
    phases: phases.map((phase) => ({ numero: phase.numero, asset: phase.base_asset, state: Number(phase.numero) < 6 ? "validated" : phase.numero === "006" ? "failed" : "pending" })),
  };
  for (const numero of ["003", "004", "005"]) {
    const phase = phases.find((candidate) => candidate.numero === numero);
    const basename = path.basename(phase.base_asset);
    const entry = checkpoint.phases.find((candidate) => candidate.numero === numero);
    for (const stage of ["raw", "background-removed", "validated"]) {
      const file = path.join(root, "data/image-automation/tmp/image-pilot-review", stage, basename);
      fs.mkdirSync(path.dirname(file), { recursive: true }); fs.writeFileSync(file, `${numero}-${stage}`);
      if (stage === "validated") entry.sha256 = fileSha256(file);
    }
    for (const type of ["validation", "visual"]) {
      const file = path.join(root, "data/image-automation/tmp/image-pilot-review/reports", `${basename}.${type}.json`);
      fs.mkdirSync(path.dirname(file), { recursive: true }); fs.writeFileSync(file, "{}\n");
    }
  }
  Object.assign(checkpoint.phases.find((entry) => entry.numero === "006"), {
    failure: `400 rejected by safety system request ID ${INCIDENT_REQUEST_ID}. safety_violations=[category].`,
    updated_at: "2026-07-19T14:30:27.184Z",
  });
  const checkpointFile = path.join(root, "data/image-automation/runtime/phase-bases-003-011-checkpoint.json");
  fs.mkdirSync(path.dirname(checkpointFile), { recursive: true });
  fs.writeFileSync(checkpointFile, `${JSON.stringify(checkpoint, null, 2)}\n`);
  return { root, context, phases, checkpoint, checkpointFile };
}

const warningPreflight = ({ args: itemArgs }) => ({
  status: "WARNING", selection: { numero: itemArgs["--only-phase-base"] },
  failures: ["api_key_present", "provider_environment", "generation_authorized", "external_budget_present", "explicit_execute_flag"],
});

test("official batch selects exactly nine ordered private phases and excludes 002 and identities", () => {
  const selected = selectBatchPhases(loadContext());
  assert.deepEqual(selected.map((phase) => phase.numero), BATCH_PHASES);
  assert.equal(selected.length, 9);
  assert.equal(selected.some((phase) => phase.numero === "002"), false);
  assert.ok(selected.every((phase) => phase.base_asset.startsWith("data/image-automation/phase-bases/")));
});

test("batch interface rejects incomplete ranges, unsafe flags, attempts and budgets", () => {
  const scenarios = [
    ["--from-phase", "004"], ["--to-phase", "010"], ["--max-attempts", "2"],
    ["--max-cost-usd-per-item", "0.061431"], ["--max-total-cost-usd", "0.552871"],
    ["--max-total-cost-usd", "0.50"], ["--stop-on-error", false],
    ["--no-publish", false], ["--no-push", false], ["--review-policy", "automatic"],
  ];
  for (const [key, value] of scenarios) {
    assert.throws(() => validateBatchArgs(args({ [key]: value }), { execute: false }), { code: "PHASE_BASE_BATCH_BLOCKED" });
  }
  assert.equal(MAX_ITEM_COST_USD, 0.06143);
  assert.equal(MAX_BATCH_COST_USD, 0.55287);
});

test("paid batch requires every independent activation gate", () => {
  for (const key of ["--execute-paid-batch", "--execute-paid-generation", "--authorize-external-export", "--env-file"]) {
    const candidate = paidArgs(); delete candidate[key];
    assert.throws(() => validateBatchArgs(candidate), { code: "PHASE_BASE_BATCH_BLOCKED" });
  }
});

test("dry-run plans nine items without key, provider, PNG or operational write", async () => {
  let calls = 0;
  const root = fs.mkdtempSync(path.join(os.tmpdir(), "phase-batch-dry-"));
  const result = await runBatch({
    args: args(), root, context: loadContext(), env: {}, preflight: warningPreflight,
    generate: async () => { calls += 1; throw new Error("must not generate"); },
  });
  assert.equal(result.mode, "dry-run");
  assert.equal(result.paid_generation_started, false);
  assert.equal(result.api_calls, 0);
  assert.equal(result.items_planned, 9);
  assert.deepEqual(result.phases, BATCH_PHASES);
  assert.equal(result.images_created, 0);
  assert.equal(result.operational_writes, 0);
  assert.equal(calls, 0);
  assert.deepEqual(fs.readdirSync(root), []);
});

test("individual preflight accepts a declared dynamic phase and preserves one-item selection", () => {
  const report = runPreflight({
    args: { "--only-phase-base": "003", "--dry-run": true, "--max-cost-usd": "0.061430", "--max-attempts": "1", "--no-publish": true, "--no-push": true, "--review-policy": "human-mandatory" },
    env: {}, system: { gitClean: true, nodeVersion: "v22.0.0", dependencyReady: true, diskFreeBytes: 1e9, writable: true, baseAbsent: true, rawAbsent: true, backgroundAbsent: true, validatedAbsent: true, referenceReady: true, stopAbsent: true, runtimePathsIgnored: true, phaseBasesIgnored: true },
  });
  assert.equal(report.selection.numero, "003");
  assert.equal(report.status, "WARNING");
  assert.equal(report.api_calls, 0);
});

test("all phase prompts are age-specific and reference only Pig Principal", () => {
  const context = loadContext();
  const prompts = selectBatchPhases(context).map((phase) => {
    const item = { uid: `PHASE-${phase.numero}-BASE`, kind: "phase_base", numero: phase.numero, fase_vida: phase.key, asset_futuro: phase.base_asset, publicavel: false };
    return planRecord(item, context).prompt;
  });
  assert.equal(new Set(prompts).size, 9);
  for (const prompt of prompts) {
    assert.match(prompt, /Pig Principal (?:como a unica referencia visual binaria|image as the only binary visual reference)/u);
    assert.match(prompt, /(?:azul, rosa ou arco-iris|neutral off-white, light beige, and white technical-clothing palette)/u);
    assert.doesNotMatch(prompt, /Use a base tecnica aprovada anexada/u);
  }
});

test("first generation failure stops the batch and persists failed checkpoint", async () => {
  const root = fs.mkdtempSync(path.join(os.tmpdir(), "phase-batch-fail-"));
  let calls = 0;
  await assert.rejects(runBatch({
    args: paidArgs(), root, context: loadContext(), env: {}, preflight: () => ({ status: "READY", selection: {}, failures: [] }),
    generate: async () => { calls += 1; throw new Error("sanitized failure"); }, commit: "test",
  }), /sanitized failure/u);
  assert.equal(calls, 1);
  const checkpoint = JSON.parse(fs.readFileSync(path.join(root, "data/image-automation/runtime/phase-bases-003-011-checkpoint.json"), "utf8"));
  assert.equal(checkpoint.phases[0].state, "failed");
  assert.equal(checkpoint.phases[1].state, "pending");
});

test("resume skips only validated and blocks generated or failed states", () => {
  const phase = { numero: "003" };
  assert.equal(resumeDecision({ phases: [{ numero: "003", state: "validated" }] }, phase), "skip");
  assert.equal(resumeDecision({ phases: [{ numero: "003", state: "generated" }] }, phase), "block");
  assert.equal(resumeDecision({ phases: [{ numero: "003", state: "failed" }] }, phase), "block");
  assert.equal(resumeDecision({ phases: [{ numero: "003", state: "pending" }] }, phase), "run");
});

test("phase 006 safe prompt is positive, fully clothed, educational and deterministic", () => {
  const context = loadContext();
  const phase = context.phaseBootstrap.phases.find((entry) => entry.numero === "006");
  const audit = phasePromptAudit(context, phase);
  assert.equal(audit.prompt_revision, "phase-006-safe-v2");
  assert.equal(audit.prompt_sha256.length, 64);
  assert.notEqual(audit.prompt_sha256, INCIDENT_PREVIOUS_PROMPT_SHA256);
  assert.match(audit.prompt, /^Create one wholesome, fully clothed, non-human cartoon pig mascot/u);
  assert.match(audit.prompt, /educational financial-literacy|educational universe/u);
  assert.match(audit.prompt, /off-white shirt covering the torso/u);
  assert.match(audit.prompt, /light beige trousers/u);
  assert.match(audit.prompt, /white sneakers on both feet/u);
  assert.match(audit.prompt, /Pig Principal image as the only binary visual reference/u);
  assert.doesNotMatch(audit.prompt, /sexual|sexualized|nude|naked|underage|adult content|conte[uú]do adulto|erotiza/iu);
  assert.doesNotMatch(audit.prompt, /002-pig-bebe|preceding life stage.*reference/iu);
});

test("resume plan verifies and skips validated 003-005, then selects only 006-011", () => {
  const workspace = resumeWorkspace();
  const plan = prepareResumePlan(workspace);
  assert.deepEqual(plan.skipped_validated_phases, ["003", "004", "005"]);
  assert.deepEqual(plan.phases_to_execute.map((phase) => phase.numero), ["006", "007", "008", "009", "010", "011"]);
  assert.equal(plan.previous_request_id, INCIDENT_REQUEST_ID);
  assert.equal(plan.previous_output_created, false);
  assert.equal(plan.prompt_changed, true);
});

test("resume authorization is specific to phase 006 and bounded to six new calls", () => {
  for (const candidate of [
    args({ "--authorize-retry-failed-phase": "006" }),
    resumeArgs({ "--authorize-retry-failed-phase": "003" }),
    resumeArgs({ "--authorize-retry-failed-phase": "005" }),
    resumeArgs({ "--authorize-retry-failed-phase": "007" }),
    resumeArgs({ "--max-attempts": "2" }),
    resumeArgs({ "--max-additional-cost-usd": "0.368581" }),
    resumeArgs({ "--max-cautious-total-cost-usd": "0.614301" }),
  ]) assert.throws(() => validateBatchArgs(candidate, { execute: false }), { code: "PHASE_BASE_BATCH_BLOCKED" });
  const budget = validateBatchArgs(resumeArgs(), { execute: false });
  assert.equal(budget.additional, 0.36858);
  assert.equal(budget.cautious, 0.6143);
});

test("resume blocks altered incident evidence, outputs, hashes and consumed retry", () => {
  const mutations = [
    (workspace) => { workspace.checkpoint.current_phase = "005"; },
    (workspace) => { workspace.checkpoint.phases.find((entry) => entry.numero === "006").failure = "400 unrelated"; },
    (workspace) => { workspace.checkpoint.phases.find((entry) => entry.numero === "006").retry_consumed = true; },
    (workspace) => { workspace.checkpoint.phases.find((entry) => entry.numero === "003").sha256 = "wrong"; },
    (workspace) => { const p = path.join(workspace.root, "data/image-automation/tmp/image-pilot-review/raw/006-pig-adolescente-base.png"); fs.mkdirSync(path.dirname(p), { recursive: true }); fs.writeFileSync(p, "unexpected"); },
  ];
  for (const mutate of mutations) {
    const workspace = resumeWorkspace(); mutate(workspace);
    assert.throws(() => prepareResumePlan(workspace), { code: "PHASE_006_RESUME_BLOCKED" });
  }
});

test("resume dry-run preserves the real-style checkpoint and performs no API or PNG write", async () => {
  const workspace = resumeWorkspace();
  const before = fs.readFileSync(workspace.checkpointFile, "utf8");
  let calls = 0;
  const result = await runBatch({
    args: resumeArgs(), root: workspace.root, context: workspace.context,
    preflight: warningPreflight, generate: async () => { calls += 1; },
  });
  assert.equal(result.mode, "dry-run");
  assert.equal(result.api_calls, 0);
  assert.equal(result.images_created, 0);
  assert.equal(result.new_attempts_planned, 6);
  assert.deepEqual(result.skipped_validated_phases, ["003", "004", "005"]);
  assert.equal(calls, 0);
  assert.equal(fs.readFileSync(workspace.checkpointFile, "utf8"), before);
});

test("failed authorized retry records attempt two and never advances to phase 007", async () => {
  const workspace = resumeWorkspace();
  let calls = 0;
  const executeArgs = paidArgs({
    "--resume": true, "--authorize-retry-failed-phase": "006",
    "--max-additional-cost-usd": "0.368580", "--max-cautious-total-cost-usd": "0.614300",
  });
  await assert.rejects(runBatch({
    args: executeArgs, root: workspace.root, context: workspace.context,
    preflight: () => ({ status: "READY", selection: {}, failures: [] }),
    generate: async () => { calls += 1; throw new Error("second attempt failed"); },
  }), /second attempt failed/u);
  assert.equal(calls, 1);
  const checkpoint = JSON.parse(fs.readFileSync(workspace.checkpointFile, "utf8"));
  const phase006 = checkpoint.phases.find((entry) => entry.numero === "006");
  assert.equal(phase006.attempt_history[0].request_id, INCIDENT_REQUEST_ID);
  assert.equal(phase006.attempt_history[0].attempt_number, 1);
  assert.equal(phase006.attempt_history[1].attempt_number, 2);
  assert.equal(phase006.retry_consumed, true);
  assert.equal(phase006.final_failure, true);
  assert.equal(checkpoint.phases.find((entry) => entry.numero === "007").state, "pending");
});

test("operational errors are routed to ignored runtime storage", () => {
  const source = fs.readFileSync(new URL("../../scripts/images/generate.mjs", import.meta.url), "utf8");
  assert.match(source, /data\/image-automation\/runtime\/errors\.jsonl/u);
  assert.doesNotMatch(source, /appendJsonl\("data\/image-automation\/errors\.jsonl"/u);
});
