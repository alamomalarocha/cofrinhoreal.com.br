import assert from "node:assert/strict";
import test from "node:test";
import {
  createExclusiveBudget,
  estimatedAttemptCost,
  PILOT_MAX_COST_USD,
  requiredExclusiveBudget,
} from "../../scripts/images/budget.mjs";
import { generateOne } from "../../scripts/images/generate.mjs";
import {
  loadRuntimeEnvironment,
  RUNTIME_ENV_META,
} from "../../scripts/images/env-file.mjs";
import { loadContext, selectPlan } from "../../scripts/images/lib.mjs";
import { runPreflight } from "../../scripts/images/preflight.mjs";

function exactArgs({ dryRun = true } = {}) {
  return {
    "--only-phase-base": "002",
    "--max-cost-usd": "0.19",
    "--max-attempts": "1",
    "--no-publish": true,
    "--no-push": true,
    "--review-policy": "human-mandatory",
    ...(dryRun ? { "--dry-run": true } : {}),
  };
}

function activationArgs(overrides = {}) {
  return {
    ...exactArgs({ dryRun: false }),
    "--execute-paid-generation": true,
    ...overrides,
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
    IMAGE_MAX_COST_USD: "0.19",
    ...overrides,
  };
}

function externalEnvironment(inherited = {}, overrides = {}) {
  const values = activationEnv(overrides);
  const content = Object.entries(values)
    .filter(([, value]) => value !== undefined)
    .map(([key, value]) => `${key}=${value}`)
    .join("\n");
  return loadRuntimeEnvironment(
    { "--env-file": "synthetic-image-api.env" },
    inherited,
    {
      existsSync: () => true,
      readFileSync: () => content,
    },
  );
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
    args: activationArgs(),
    env: activationEnv({ OPENAI_API_KEY: "" }),
    system: readySystem(),
  });
  assert.equal(missingKey.status, "BLOCKED");
  assert.ok(missingKey.failures.includes("api_key_present"));

  const missingAuthorization = runPreflight({
    args: activationArgs(),
    env: activationEnv({ IMAGE_GENERATION_AUTHORIZED: "false" }),
    system: readySystem(),
  });
  assert.equal(missingAuthorization.status, "BLOCKED");
  assert.ok(missingAuthorization.failures.includes("generation_authorized"));
});

test("persistent configuration stays locked while complete temporary activation is ready", () => {
  const context = loadContext();
  assert.equal(context.config.provider.enabled, false);
  assert.equal(context.config.runtime_defaults.IMAGE_PROVIDER, "disabled");
  assert.equal(context.config.runtime_defaults.IMAGE_GENERATION_AUTHORIZED, false);
  assert.equal(context.config.runtime_defaults.IMAGE_PUBLICATION_AUTHORIZED, false);
  assert.equal(context.config.limits.max_cost_usd, 0);

  const report = runPreflight({
    args: activationArgs(),
    context,
    env: activationEnv(),
    system: readySystem(),
  });
  assert.equal(report.status, "READY");
  assert.equal(report.api_calls, 0);
  assert.equal(report.paid_generation_started, false);
  assert.equal(
    report.checks.find((entry) => entry.name === "secure_provider_default")?.passed,
    true,
  );
  assert.equal(
    report.checks.find((entry) => entry.name === "explicit_execute_flag")?.passed,
    true,
  );
  assert.equal(context.config.provider.enabled, false);
});

test("the first private base pilot requires exactly one explicit attempt", () => {
  const cases = [
    [undefined, "missing"],
    ["0", "zero"],
    ["2", "two"],
    ["3", "three"],
    ["invalid", "invalid"],
    ["1.5", "non-integer"],
  ];
  for (const [value] of cases) {
    const args = activationArgs();
    if (value === undefined) delete args["--max-attempts"];
    else args["--max-attempts"] = value;
    const report = runPreflight({
      args,
      env: activationEnv(),
      system: readySystem(),
    });
    assert.equal(report.status, "BLOCKED");
    assert.ok(report.failures.includes("single_attempt_only"));
    assert.equal(report.budget.max_attempts, 1);
    assert.equal(report.api_calls, 0);
  }

  const valid = runPreflight({
    args: activationArgs(),
    env: activationEnv(),
    system: readySystem(),
  });
  assert.equal(valid.status, "READY");
  assert.equal(valid.budget.max_attempts, 1);
  assert.equal(
    valid.budget.required_for_all_attempts_usd,
    valid.budget.estimated_cost_per_attempt_usd,
  );
});

test("temporary activation without explicit execute flag is blocked", () => {
  const report = runPreflight({
    args: exactArgs({ dryRun: false }),
    env: activationEnv(),
    system: readySystem(),
  });
  assert.equal(report.status, "BLOCKED");
  assert.ok(report.failures.includes("explicit_execute_flag"));
});

test("explicit external environment is authoritative and inherited conflicts are blocked", () => {
  const conflictCases = [
    ["IMAGE_PROVIDER", "other"],
    ["IMAGE_GENERATION_AUTHORIZED", "false"],
    ["IMAGE_MAX_COST_USD", "0.50"],
    ["IMAGE_PUBLICATION_AUTHORIZED", "true"],
    ["IMAGE_STORAGE_MODE", "remote"],
    ["OPENAI_API_KEY", "inherited-secret-that-must-not-appear"],
  ];
  for (const [key, inheritedValue] of conflictCases) {
    const runtimeEnv = externalEnvironment({ [key]: inheritedValue });
    assert.equal(runtimeEnv[key], activationEnv()[key]);
    assert.deepEqual(runtimeEnv[RUNTIME_ENV_META].conflicts, [key]);
    const report = runPreflight({
      args: activationArgs({ "--env-file": "synthetic-image-api.env" }),
      runtimeEnv,
      system: readySystem(),
    });
    assert.equal(report.status, "BLOCKED");
    assert.ok(report.failures.includes("no_inherited_env_conflicts"));
    const serialized = JSON.stringify(report);
    if (key === "OPENAI_API_KEY") {
      assert.equal(serialized.includes(inheritedValue), false);
    }
    assert.equal(serialized.includes("test-key"), false);
  }
});

test("a sensitive inherited value cannot fill a variable missing from the external file", () => {
  const runtimeEnv = externalEnvironment(
    { IMAGE_PROVIDER: "openai" },
    { IMAGE_PROVIDER: undefined },
  );
  assert.equal(runtimeEnv.IMAGE_PROVIDER, undefined);
  assert.deepEqual(runtimeEnv[RUNTIME_ENV_META].conflicts, ["IMAGE_PROVIDER"]);
  const report = runPreflight({
    args: activationArgs({ "--env-file": "synthetic-image-api.env" }),
    runtimeEnv,
    system: readySystem(),
  });
  assert.equal(report.status, "BLOCKED");
  assert.ok(report.failures.includes("no_inherited_env_conflicts"));
  assert.ok(report.failures.includes("provider_environment"));
});

test("persistent provider activation, invalid provider and model divergence are blocked", () => {
  const persistentProvider = structuredClone(loadContext());
  persistentProvider.config.provider.enabled = true;
  const cases = [
    {
      context: persistentProvider,
      args: activationArgs(),
      env: activationEnv(),
      failure: "secure_provider_default",
    },
    {
      context: loadContext(),
      args: activationArgs(),
      env: activationEnv({ IMAGE_PROVIDER: "other" }),
      failure: "provider_environment",
    },
    {
      context: (() => {
        const changed = structuredClone(loadContext());
        changed.config.provider.primary_model = "gpt-image-2";
        changed.config.provider.model = "gpt-image-2";
        return changed;
      })(),
      args: activationArgs(),
      env: activationEnv(),
      failure: "snapshot_is_primary",
    },
  ];
  for (const scenario of cases) {
    const report = runPreflight({ ...scenario, system: readySystem() });
    assert.equal(report.status, "BLOCKED");
    assert.ok(report.failures.includes(scenario.failure));
  }
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
  assert.ok(report.failures.includes("cli_budget_within_pilot_ceiling"));
});

test("preflight blocks missing budget, publication, push and fallback", () => {
  const scenarios = [
    {
      args: activationArgs({ "--max-cost-usd": "0" }),
      env: activationEnv({ IMAGE_MAX_COST_USD: "0" }),
      failure: "positive_exclusive_budget",
    },
    {
      args: activationArgs(),
      env: activationEnv({ IMAGE_PUBLICATION_AUTHORIZED: "true" }),
      failure: "publication_not_authorized",
    },
    {
      args: activationArgs({ "--no-publish": false }),
      env: activationEnv(),
      failure: "no_publish_flag",
    },
    {
      args: activationArgs({ "--no-push": false }),
      env: activationEnv(),
      failure: "no_push_flag",
    },
    {
      args: activationArgs({ "--allow-model-fallback": true }),
      env: activationEnv(),
      failure: "fallback_blocked_by_default",
    },
  ];
  for (const scenario of scenarios) {
    const report = runPreflight({
      args: scenario.args,
      env: scenario.env,
      system: readySystem(),
    });
    assert.equal(report.status, "BLOCKED");
    assert.ok(report.failures.includes(scenario.failure));
    assert.equal(report.api_calls, 0);
    assert.equal(report.paid_generation_started, false);
  }
});

test("paid preflight requires a CLI budget and uses the lower external limit", () => {
  const missingCli = activationArgs();
  delete missingCli["--max-cost-usd"];
  const missingReport = runPreflight({
    args: missingCli,
    env: activationEnv(),
    system: readySystem(),
  });
  assert.equal(missingReport.status, "BLOCKED");
  assert.ok(missingReport.failures.includes("cli_budget_present"));

  const lowerExternal = runPreflight({
    args: activationArgs(),
    env: activationEnv({ IMAGE_MAX_COST_USD: "0.05" }),
    system: readySystem(),
  });
  assert.equal(lowerExternal.budget.max_cost_usd, 0.05);
  assert.equal(lowerExternal.status, "BLOCKED");
  assert.ok(lowerExternal.failures.includes("budget_covers_all_attempts"));
});

test("generate loads the environment once and passes the same object to preflight", async () => {
  let loads = 0;
  let loadedRuntime;
  let preflightRuntime;
  const result = await generateOne({
    args: { ...exactArgs(), "--env-file": "synthetic-image-api.env" },
    loadEnvironment: () => {
      loads += 1;
      loadedRuntime = externalEnvironment();
      return loadedRuntime;
    },
    preflightRunner: (options) => {
      preflightRuntime = options.runtimeEnv;
      return runPreflight(options);
    },
    preflightSystem: readySystem(),
    provider: {
      generateEdit: async () => {
        throw new Error("provider must not be called");
      },
    },
  });
  assert.equal(loads, 1);
  assert.equal(preflightRuntime, loadedRuntime);
  assert.equal(result.mode, "dry-run");
  assert.equal(result.api_calls, 0);
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
