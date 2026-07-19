import assert from "node:assert/strict";
import fs from "node:fs";
import os from "node:os";
import path from "node:path";
import test from "node:test";
import { loadContext, planRecord } from "../../scripts/images/lib.mjs";
import {
  BATCH_PHASES,
  MAX_BATCH_COST_USD,
  MAX_ITEM_COST_USD,
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
    assert.match(prompt, /Pig Principal como a unica referencia visual binaria/u);
    assert.match(prompt, /azul, rosa ou arco-iris/u);
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
