import assert from "node:assert/strict";
import fs from "node:fs";
import test from "node:test";
import { buildRosaCorrection, preflightRosaCorrection, runRosaCorrection, PRIOR_CHECKPOINT } from "../../scripts/images/rosa-correction-batch.mjs";

const manifest = JSON.parse(fs.readFileSync("data/image-automation/avatar-rosa-correction-8.json", "utf8"));

test("Rosa correction has exactly eight authorized Rosa UIDs", () => {
  const { items } = buildRosaCorrection();
  assert.equal(items.length, 8);
  assert.equal(new Set(items.map((item) => item.uid)).size, 8);
  assert.deepEqual(items.map((item) => item.numero), ["003", "004", "006", "007", "008", "009", "010", "011"]);
  assert.equal(items.every((item) => item.identity === "rosa" && item.uid.endsWith("-RSA")), true);
});

test("002, 005, Azul, Arco-íris, padrão and fourth identity are rejected", () => {
  for (const mutate of [
    (value) => value.items[0].phase = "002",
    (value) => value.items[0].phase = "005",
    (value) => value.items[0].uid = "AVA-003-AZL",
    (value) => value.items[0].uid = "AVA-003-ARC",
    (value) => value.items[0].uid = "AVA-003-PAD",
    (value) => value.identity = "verde"
  ]) { const copy = structuredClone(manifest); mutate(copy); assert.throws(() => buildRosaCorrection({ manifest: copy })); }
});

test("each item uses one installed same-phase private base and never a public avatar", () => {
  const preflight = preflightRosaCorrection();
  assert.equal(preflight.ready, true);
  for (const item of preflight.items) {
    assert.match(item.base, new RegExp(`phase-bases/${item.numero}-`, "u"));
    assert.equal(item.base.includes("001-pig-principal"), false);
    assert.equal(item.base.includes("avatar-batch-24"), false);
  }
  assert.equal(preflight.checks.every((item) => item.references === 1 && item.approved && item.installed && item.hash_matches), true);
});

test("prompts positively require age-appropriate feminine design and preservation", () => {
  for (const item of buildRosaCorrection().items) {
    assert.match(item.prompt, /feminine Rosa identity/u);
    assert.match(item.prompt, /female character appropriate to this exact age group/u);
    assert.match(item.prompt, /not as a masculine character recolored pink/u);
    assert.match(item.prompt, /rather than color alone/u);
    assert.match(item.prompt, /face identity, snout, eyes, ears, body proportions, height, pose, expression, framing, hands, feet and anatomy/u);
    assert.doesNotMatch(item.prompt, /Pig Principal|adult body|adult makeup|sexual/u);
  }
  for (const item of buildRosaCorrection().items.filter((entry) => ["003", "004", "006"].includes(entry.numero))) assert.match(item.prompt, /child-friendly.*age-appropriate.*wholesome.*fully clothed.*innocent.*educational mascot/u);
});

test("limits block retry, fallback, ninth call, publication and phase 005", () => {
  assert.deepEqual(manifest.limits, { items: 8, max_attempts_per_item: 1, max_cost_usd_per_item: 0.061430, max_total_cost_usd: 0.491440, retry: false, fallback: false, stop_on_error: true, human_review_required: true, feminine_presentation_human_review_required: true, publish: false, deploy: false, push_images: false, catalog: false });
  assert.deepEqual(manifest.blocked_phases, ["002", "005"]);
});

test("dry-run calls no provider, creates no PNG and reports independent controls", async () => {
  let calls = 0; const before = fs.readFileSync(PRIOR_CHECKPOINT);
  const result = await runRosaCorrection({ args: { "--dry-run": true }, provider: { async generateEdit() { calls += 1; } } });
  assert.equal(calls, 0); assert.equal(result.api_calls, 0); assert.equal(result.png_created, 0); assert.equal(result.count, 8); assert.equal(result.identities, "rosa_only"); assert.equal(result.ready, true);
  assert.deepEqual(fs.readFileSync(PRIOR_CHECKPOINT), before);
});

test("paid execution requires exact gates before provider access", async () => {
  let calls = 0;
  await assert.rejects(() => runRosaCorrection({ args: {}, provider: { async generateEdit() { calls += 1; } } }), /execute-paid-generation/u);
  assert.equal(calls, 0);
});

test("all correction outputs remain local under ignored tmp", () => {
  for (const item of buildRosaCorrection().items) for (const key of ["raw", "transparent", "validated"]) assert.equal(item[key].startsWith("data/image-automation/tmp/"), true);
});
