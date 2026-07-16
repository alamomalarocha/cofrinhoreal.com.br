import assert from "node:assert/strict";
import test from "node:test";
import {
  buildPilotPrompt,
  loadPilotManifest,
  pilotReferenceReadiness,
} from "../../scripts/images/pilot-lib.mjs";
import { buildCostReport } from "../../scripts/images/estimate-cost.mjs";
import { loadContext, selectPlan, sha256 } from "../../scripts/images/lib.mjs";

test("pilot is fixed to the three Pig Bebe identities and excludes padrao", () => {
  const context = loadContext();
  const items = selectPlan(context, { "--pilot": true });
  assert.deepEqual(
    items.map((item) => item.asset_futuro),
    [
      "assets/characters/002-pig-bebe-azul.png",
      "assets/characters/002-pig-bebe-rosa.png",
      "assets/characters/002-pig-bebe-arco-iris.png",
    ],
  );
  assert.equal(items.some((item) => item.estilo === "padrao"), false);
});

test("pilot prompts are deterministic and match registered hashes", () => {
  const context = loadContext();
  const manifest = loadPilotManifest();
  for (const item of selectPlan(context, { "--pilot": true })) {
    const prompt = buildPilotPrompt(item, manifest);
    const registered = manifest.items.find((candidate) => candidate.asset === item.asset_futuro);
    assert.equal(sha256(prompt), registered.prompt_hash);
    assert.match(prompt, /#777777/u);
    assert.match(prompt, /mandatory binary character reference/u);
  }
});

test("missing approved life-stage reference blocks the paid pilot", () => {
  const context = loadContext();
  const [item] = selectPlan(context, { "--pilot": true });
  const readiness = pilotReferenceReadiness(item, context.pilot);
  assert.equal(readiness.ready, false);
  assert.equal(readiness.blocking[0].key, "fase_bebe");
});

test("cost estimator reports scenarios and enforces a positive ceiling", () => {
  const { config } = loadContext();
  const report = buildCostReport({
    pricing: config.pricing,
    attempts: 1,
    maxCostUsd: 0.25,
  });
  assert.deepEqual(report.scenarios.map((scenario) => scenario.images), [1, 3, 10, 100]);
  assert.equal(report.paid_generation_started, false);
  assert.equal(report.pilot_within_max_cost, true);
  assert.ok(report.scenarios[1].maximum_estimated_usd > 0.123);
});
