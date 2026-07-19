import assert from "node:assert/strict";
import test from "node:test";
import fs from "node:fs";
import { buildAvatarBatch, preflightAvatarBatch, runAvatarBatch } from "../../scripts/images/avatar-batch.mjs";
import { loadContext } from "../../scripts/images/lib.mjs";

const manifest = JSON.parse(fs.readFileSync("data/image-automation/avatar-batch-24.json", "utf8"));

test("avatar batch contains exactly 24 unique items from eight eligible phases", () => {
  const { items } = buildAvatarBatch();
  assert.equal(items.length, 24);
  assert.equal(new Set(items.map((item) => item.uid)).size, 24);
  assert.deepEqual([...new Set(items.map((item) => item.numero))], ["003", "004", "006", "007", "008", "009", "010", "011"]);
});

test("each eligible phase contains exactly azul, rosa and arco_iris", () => {
  const { items } = buildAvatarBatch();
  for (const numero of manifest.allowed_phases) assert.deepEqual(items.filter((item) => item.numero === numero).map((item) => item.identity), ["azul", "rosa", "arco_iris"]);
});

test("phase 005, phase 002, padrao and a fourth identity are blocked", () => {
  for (const mutate of [
    (value) => value.allowed_phases.push("005"),
    (value) => value.allowed_phases.push("002"),
    (value) => value.identities.push({ key: "padrao", code: "PAD" }),
    (value) => value.identities.push({ key: "verde", code: "VRD" }),
  ]) {
    const copy = structuredClone(manifest); mutate(copy);
    assert.throws(() => buildAvatarBatch({ manifest: copy }));
  }
});

test("every avatar uses exactly its installed same-phase private base", () => {
  const { items } = buildAvatarBatch();
  for (const item of items) {
    assert.match(item.base, new RegExp(`/phase-bases/${item.numero}-`, "u"));
    assert.equal(item.base.startsWith("assets/characters/"), false);
    assert.equal(item.base.includes("001-pig-principal"), false);
  }
});

test("prompts are positive, fully clothed and identity-specific", () => {
  const { items } = buildAvatarBatch();
  for (const item of items) {
    assert.match(item.prompt, /Wholesome.*family-friendly.*educational/u);
    assert.match(item.prompt, /Fully clothed/u);
    assert.match(item.prompt, new RegExp(item.identity.replace("_", "-|") || item.identity, "u"));
  }
});

test("manifest fixes one attempt, no retry, no fallback and exact budget", () => {
  assert.equal(manifest.limits.max_attempts_per_item, 1);
  assert.equal(manifest.limits.max_cost_usd_per_item, 0.061430);
  assert.equal(manifest.limits.max_total_cost_usd, 1.474320);
  assert.equal(manifest.limits.retry, false);
  assert.equal(manifest.limits.fallback, false);
  assert.equal(manifest.limits.stop_on_error, true);
});

test("preflight requires every base to be approved, installed and hash-matched", { skip: "requer bases privadas aprovadas e ignoradas no Git" }, () => {
  const report = preflightAvatarBatch();
  assert.equal(report.count, 24);
  assert.equal(report.ready, true);
  assert.equal(report.checks.every((item) => item.approved && item.installed && item.hash_matches), true);
});

test("dry-run performs zero API calls and writes no PNG", { skip: "requer bases privadas aprovadas e ignoradas no Git" }, async () => {
  let calls = 0;
  const provider = { async generateEdit() { calls += 1; throw new Error("must not run"); } };
  const report = await runAvatarBatch({ args: { "--dry-run": true }, context: loadContext(), provider });
  assert.equal(report.api_calls, 0);
  assert.equal(report.paid_generation_started, false);
  assert.equal(calls, 0);
});

test("paid mode rejects missing exact execution gates before provider access", { skip: "requer bases privadas aprovadas e ignoradas no Git" }, async () => {
  let calls = 0;
  await assert.rejects(() => runAvatarBatch({ args: {}, provider: { async generateEdit() { calls += 1; } } }), /execute-paid-generation/u);
  assert.equal(calls, 0);
});

test("all outputs remain in ignored tmp and publication flags stay disabled", () => {
  const { items } = buildAvatarBatch();
  assert.equal(items.every((item) => item.output.startsWith("data/image-automation/tmp/")), true);
  assert.equal(manifest.limits.publish, false);
  assert.equal(manifest.limits.push, false);
  assert.equal(manifest.limits.catalog, false);
});
