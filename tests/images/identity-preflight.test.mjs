import assert from "node:assert/strict";
import test from "node:test";
import { generateOne } from "../../scripts/images/generate.mjs";
import { loadContext, parseArgs, selectPlan } from "../../scripts/images/lib.mjs";
import {
  APPROVED_BASE, APPROVED_BASE_SHA256, IDENTITY_MAX_COST_USD, IDENTITY_UIDS,
  runIdentityPreflight,
} from "../../scripts/images/identity-preflight.mjs";
import { identityStructuralReviewTemplate } from "../../scripts/images/pilot-lib.mjs";

function args(overrides = {}) {
  return {
    "--only-uid": "AVA-002-AZL", "--dry-run": true, "--max-cost-usd": "0.061430",
    "--max-attempts": "1", "--no-publish": true, "--no-push": true,
    "--review-policy": "human-mandatory", ...overrides,
  };
}

function system(overrides = {}) {
  return {
    gitClean: true, dependencyReady: true, baseExists: true,
    baseSha256: APPROVED_BASE_SHA256, baseStatus: "aprovada", targetAbsent: true,
    ...overrides,
  };
}

test("--only-uid selects exactly each of the three official identities", () => {
  const context = loadContext();
  for (const uid of IDENTITY_UIDS) {
    const selected = selectPlan(context, args({ "--only-uid": uid }));
    assert.deepEqual(selected.map((item) => item.uid), [uid]);
  }
});

test("exclusive identity selector rejects duplicates, phase base, unknown, private base, standard and fourth identity", () => {
  const context = loadContext();
  assert.throws(() => parseArgs(["--only-uid", "AVA-002-AZL", "--only-uid", "AVA-002-RSA"]), /exatamente um UID/u);
  assert.throws(() => selectPlan(context, args({ "--only-phase-base": "002" })), /nao pode ser combinado/u);
  for (const uid of ["UNKNOWN", "PHASE-002-BASE", "AVA-002-PAD", "AVA-002-FOURTH"]) {
    assert.throws(() => selectPlan(context, args({ "--only-uid": uid })), /nao autorizado/u);
  }
  assert.throws(() => selectPlan(context, args({ "--only-uid": ["AVA-002-AZL", "AVA-002-RSA"] })), /exatamente um UID/u);
});

test("identity preflight accepts structural dry-run without a key and uses only the approved base", () => {
  const report = runIdentityPreflight({ args: args(), env: {}, system: system() });
  assert.equal(report.status, "WARNING");
  assert.equal(report.api_calls, 0);
  assert.equal(report.paid_generation_started, false);
  assert.deepEqual(report.references, [APPROVED_BASE]);
  assert.equal(report.base.sha256, APPROVED_BASE_SHA256);
  assert.equal(report.quarantine, "data/image-automation/tmp/image-pilot-review/raw/002-pig-bebe-azul.png");
  assert.equal(report.public_target, "assets/characters/002-pig-bebe-azul.png");
});

test("all identities derive directly from the base, never another identity, draft or Pig Principal", () => {
  for (const uid of IDENTITY_UIDS) {
    const report = runIdentityPreflight({ args: args({ "--only-uid": uid }), env: {}, system: system() });
    assert.deepEqual(report.references, [APPROVED_BASE]);
    assert.equal(report.references.some((asset) => asset.startsWith("assets/characters/")), false);
    assert.equal(report.references.some((asset) => asset.includes("_drafts")), false);
    assert.equal(report.references.includes("assets/characters/001-pig-principal.png"), false);
  }
});

test("identity preflight blocks bad base hash, missing approval and existing public target", () => {
  const cases = [
    [system({ baseSha256: "bad" }), "private_base_hash"],
    [system({ baseStatus: "pendente" }), "private_base_approved"],
    [system({ targetAbsent: false }), "public_target_absent"],
  ];
  for (const [state, failure] of cases) {
    const report = runIdentityPreflight({ args: args(), env: {}, system: state });
    assert.equal(report.status, "BLOCKED");
    assert.ok(report.failures.includes(failure));
  }
});

test("identity preflight enforces one attempt, cost ceiling, no publish, no push, review and no fallback", () => {
  const contextWithFallback = structuredClone(loadContext());
  contextWithFallback.config.provider.fallback_model = "gpt-image-2";
  const cases = [
    [args({ "--max-attempts": "2" }), loadContext(), "single_attempt_only"],
    [args({ "--max-cost-usd": String(IDENTITY_MAX_COST_USD + 0.000001) }), loadContext(), "exclusive_budget_ceiling"],
    [args({ "--no-publish": false }), loadContext(), "no_publish_flag"],
    [args({ "--no-push": false }), loadContext(), "no_push_flag"],
    [args({ "--review-policy": "automatic" }), loadContext(), "human_review_policy"],
    [args(), contextWithFallback, "fallback_absent"],
  ];
  for (const [input, context, failure] of cases) {
    const report = runIdentityPreflight({ args: input, context, env: {}, system: system() });
    assert.equal(report.status, "BLOCKED");
    assert.ok(report.failures.includes(failure));
  }
});

test("mocked identity generation dry-run never calls provider or writes a PNG", async () => {
  let calls = 0;
  const result = await generateOne({
    args: args(), env: {}, preflightSystem: system(),
    provider: { generateEdit: async () => { calls += 1; throw new Error("must not call"); } },
  });
  assert.equal(result.mode, "dry-run");
  assert.equal(result.api_calls, 0);
  assert.equal(calls, 0);
});

test("structural identity report always waits for human review", () => {
  const report = identityStructuralReviewTemplate({
    uid: "AVA-002-AZL", asset: "validated/blue.png", baseAsset: APPROVED_BASE,
  });
  assert.equal(report.automatic_decision, "aguardando_revisao");
  assert.equal(report.human_review_required, true);
  assert.equal(report.automatic_metrics_informative_only, true);
  assert.ok(Object.keys(report.checklist).length >= 16);
  assert.ok(Object.values(report.checklist).every((value) => value === null));
});
