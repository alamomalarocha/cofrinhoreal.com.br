import assert from "node:assert/strict";
import test from "node:test";
import {
  createExclusiveBudget,
  estimatedAttemptCost,
  PILOT_MAX_COST_USD,
  requiredExclusiveBudget,
} from "../../scripts/images/budget.mjs";
import { generateOne } from "../../scripts/images/generate.mjs";
import { loadContext, selectPlan } from "../../scripts/images/lib.mjs";
import { runPreflight } from "../../scripts/images/preflight.mjs";

function exactArgs({ dryRun = true } = {}) {
  return {
    "--only-phase-base": "002",
    "--max-cost-usd": "0.19",
    "--max-attempts": "3",
    "--no-publish": true,
    "--no-push": true,
    "--review-policy": "human-mandatory",
    ...(dryRun ? { "--dry-run": true } : {}),
  };
}

function readySystem(overrides = {}) {
  return {
    gitClean: true,
    gitError: null,
    nodeVersion: "v22.0.0",
    dependencyReady: true,
    diskFreeBytes: 1024 * 1024 * 1024,
    writable: true,
    baseAbsent: true,
    referenceReady: true,
    stopAbsent: true,
    runtimePathsIgnored: true,
    phaseBasesIgnored: true,
    ...overrides,
  };
}

function activationEnv(overrides = {}) {
  return {
    OPENAI_API_KEY: "test-key",
    IMAGE_PROVIDER: "openai",
    IMAGE_GENERATION_AUTHORIZED: "true",
    IMAGE_PUBLICATION_AUTHORIZED: "false",
    IMAGE_STORAGE_MODE: "local",
    ...overrides,
  };
}

test("exclusive phase-base selection returns only private base 002", () => {
  const context = loadContext();
  const selected = selectPlan(context, exactArgs());
  assert.equal(selected.length, 1);
  assert.equal(selected[0].numero, "002");
  assert.equal(
    selected[0].asset_futuro,
    "data/image-automation/phase-bases/002-pig-bebe-base.png",
  );
});

test("exclusive phase-base selection aborts when the catalog has duplicates", () => {
  const context = structuredClone(loadContext());
  context.phaseBootstrap.phases.push(structuredClone(context.phaseBootstrap.phases[0]));
  assert.throws(
    () => selectPlan(context, exactArgs()),
    (error) => error.code === "EXCLUSIVE_PHASE_BASE_SELECTION_INVALID",
  );
});

test("exclusive budget covers exactly one asset and checks before every attempt", () => {
  const context = loadContext();
  const asset = "data/image-automation/phase-bases/002-pig-bebe-base.png";
  const attemptCost = estimatedAttemptCost(context.config);
  const required = requiredExclusiveBudget(context.config, 3);
  assert.ok(required <= PILOT_MAX_COST_USD);
  const budget = createExclusiveBudget({
    asset,
    maxCostUsd: PILOT_MAX_COST_USD,
    estimatedCostPerAttempt: attemptCost,
  });
  for (let attempt = 1; attempt <= 3; attempt += 1) {
    budget.beforeAttempt({ asset, attempt, model: "gpt-image-2-2026-04-21" });
    budget.recordAttempt({
      asset,
      attempt,
      model: "gpt-image-2-2026-04-21",
      result: "test",
    });
  }
  assert.throws(
    () => budget.beforeAttempt({ asset, attempt: 4 }),
    (error) => error.code === "BUDGET_EXCEEDED",
  );
  assert.throws(
    () => budget.beforeAttempt({ asset: "other.png", attempt: 1 }),
    (error) => error.code === "BUDGET_NOT_EXCLUSIVE",
  );
});

test("dry-run preflight warns about missing activation but never starts paid work", () => {
  const report = runPreflight({
    args: exactArgs(),
    env: {},
    system: readySystem(),
  });
  assert.equal(report.status, "WARNING");
  assert.equal(report.api_calls, 0);
  assert.equal(report.paid_generation_started, false);
  assert.deepEqual(report.selection, {
    count: 1,
    numero: "002",
    uid: "PHASE-002-BASE",
    asset: "data/image-automation/phase-bases/002-pig-bebe-base.png",
  });
});

test("activation preflight blocks missing key and missing authorization", () => {
  const missingKey = runPreflight({
    args: exactArgs({ dryRun: false }),
    env: activationEnv({ OPENAI_API_KEY: "" }),
    system: readySystem(),
  });
  assert.equal(missingKey.status, "BLOCKED");
  assert.ok(missingKey.failures.includes("api_key_present"));

  const missingAuthorization = runPreflight({
    args: exactArgs({ dryRun: false }),
    env: activationEnv({ IMAGE_GENERATION_AUTHORIZED: "false" }),
    system: readySystem(),
  });
  assert.equal(missingAuthorization.status, "BLOCKED");
  assert.ok(missingAuthorization.failures.includes("generation_authorized"));
});

test("preflight blocks publication, STOP, missing reference and dirty git", () => {
  const cases = [
    {
      env: activationEnv({ IMAGE_PUBLICATION_AUTHORIZED: "true" }),
      system: readySystem(),
      failure: "publication_not_authorized",
    },
    {
      env: activationEnv(),
      system: readySystem({ stopAbsent: false }),
      failure: "stop_absent",
    },
    {
      env: activationEnv(),
      system: readySystem({ referenceReady: false }),
      failure: "reference_ready",
    },
    {
      env: activationEnv(),
      system: readySystem({ gitClean: false }),
      failure: "git_clean",
    },
  ];
  for (const scenario of cases) {
    const report = runPreflight({
      args: exactArgs(),
      env: scenario.env,
      system: scenario.system,
    });
    assert.equal(report.status, "BLOCKED");
    assert.ok(report.failures.includes(scenario.failure));
  }
});

test("preflight blocks any pilot budget above USD 0.19", () => {
  const report = runPreflight({
    args: { ...exactArgs(), "--max-cost-usd": "0.20" },
    env: activationEnv(),
    system: readySystem(),
  });
  assert.equal(report.status, "BLOCKED");
  assert.ok(report.failures.includes("budget_within_pilot_ceiling"));
});

test("exact generation dry-run never calls the provider", async () => {
  let calls = 0;
  const result = await generateOne({
    args: exactArgs(),
    env: {},
    preflightSystem: readySystem(),
    provider: {
      generateEdit: async () => {
        calls += 1;
        throw new Error("provider must not be called");
      },
    },
  });
  assert.equal(result.mode, "dry-run");
  assert.equal(result.api_calls, 0);
  assert.equal(calls, 0);
});

test("real execution remains blocked before provider access", async () => {
  let calls = 0;
  await assert.rejects(
    generateOne({
      args: {
        ...exactArgs({ dryRun: false }),
        "--execute-paid-generation": true,
      },
      env: activationEnv({ OPENAI_API_KEY: "" }),
      preflightSystem: readySystem(),
      provider: {
        generateEdit: async () => {
          calls += 1;
          throw new Error("provider must not be called");
        },
      },
    }),
    (error) => error.code === "PREFLIGHT_BLOCKED",
  );
  assert.equal(calls, 0);
});
