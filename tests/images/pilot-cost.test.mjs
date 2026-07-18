import assert from "node:assert/strict";
import fs from "node:fs";
import os from "node:os";
import path from "node:path";
import test from "node:test";
import { buildCostReport } from "../../scripts/images/estimate-cost.mjs";
import { generateOne } from "../../scripts/images/generate.mjs";
import {
  loadContext,
  normalizeAsset,
  selectPlan,
  sha256,
} from "../../scripts/images/lib.mjs";
import {
  buildPilotPrompt,
  phaseBaseItem,
  pilotReferenceReadiness,
  pilotWorkflowItems,
} from "../../scripts/images/pilot-lib.mjs";

test("pilot starts with the private Pig Bebe phase base", () => {
  const context = loadContext();
  context.events = [];
  const items = selectPlan(context, { "--pilot": true });
  assert.deepEqual(
    items.map((item) => item.asset_futuro),
    ["data/image-automation/phase-bases/002-pig-bebe-base.png"],
  );
  assert.equal(items[0].kind, "phase_base");
  assert.equal(items[0].publicavel, false);
});

test("all life phases declare one private base with the required pose", () => {
  const { phaseBootstrap } = loadContext();
  assert.equal(phaseBootstrap.phases.length, 10);
  assert.equal(new Set(phaseBootstrap.phases.map((phase) => phase.key)).size, 10);
  assert.equal(
    new Set(phaseBootstrap.phases.map((phase) => phase.base_asset)).size,
    10,
  );

  for (const [index, phase] of phaseBootstrap.phases.entries()) {
    assert.match(
      phase.base_asset,
      /^data\/image-automation\/phase-bases\/\d{3}-[\w-]+-base\.png$/u,
    );
    assert.equal(phase.pose, index === 0 ? "bebe_primeiros_passos" : "em_pe");
  }

  assert.match(phaseBootstrap.global_pose.bebe_primeiros_passos.position, /em pe/u);
  assert.match(phaseBootstrap.global_pose.bebe_primeiros_passos.position, /primeiros passos/u);
  assert.match(phaseBootstrap.global_pose.bebe_primeiros_passos.arms, /maos e pes completamente visiveis/u);
  assert.match(phaseBootstrap.global_pose.em_pe.position, /em pe/u);
  assert.match(phaseBootstrap.global_pose.em_pe.body, /pes paralelos/u);
  assert.match(phaseBootstrap.global_pose.em_pe.arms, /maos abertas/u);
  assert.equal(phaseBootstrap.storage.public, false);
  assert.equal(phaseBootstrap.storage.cataloged, false);
});

test("phase-base prompt is deterministic and protects against reference thumbnails", () => {
  const context = loadContext();
  context.events = [];
  const [item] = selectPlan(context, { "--pilot": true });
  const first = buildPilotPrompt(item, context.pilot, context.phaseBootstrap);
  const second = buildPilotPrompt(item, context.pilot, context.phaseBootstrap);
  assert.equal(sha256(first), sha256(second));
  assert.match(first, /unica referencia visual binaria/u);
  assert.match(first, /fase de primeiros passos/u);
  assert.match(first, /em pe/u);
  assert.match(first, /sem aparencia de recem-nascido ou crianca escolar/u);
  assert.doesNotMatch(first, /0 a 2 anos/u);
  assert.match(first, /camiseta lisa de manga curta, short simples e tenis infantil simples/u);
  assert.match(first, /maos e pes visiveis/u);
  assert.match(first, /parentesco visual claro com o Pig Principal/u);
  assert.match(first, /nao ser miniatura, clone ou copia reduzida/u);
  assert.match(first, /sem musculatura, ombros largos, cintura adulta, pernas longas ou corpo de adulto reduzido/u);
  assert.match(first, /PigCoin, moeda, dinheiro, cofrinho/u);
  assert.match(first, /exatamente dois olhos, duas orelhas, dois bracos, duas maos, duas pernas e dois pes/u);
  assert.doesNotMatch(first, /sentado/u);
  assert.doesNotMatch(first, /maos (repousadas |)sobre as pernas/u);
  assert.equal(context.phaseBootstrap.phases[0].age, "0 a 2 anos");
  assert.match(first, /sem miniatura, inset, moldura, painel, comparacao ou segundo personagem/u);
  assert.match(first, /Sem maos nos bolsos/u);
});

test("pilot manifest explicitly disables fallback", () => {
  const context = loadContext();
  assert.equal(context.config.provider.fallback_model, null);
  assert.equal(context.pilot.fallback_model, null);
});

test("pilot base consumes exactly the registered Pig Principal binary", async () => {
  const context = loadContext();
  context.events = [];
  const base = phaseBaseItem(context.pilot, context.phaseBootstrap);
  const readiness = pilotReferenceReadiness(base, context.pilot);
  assert.equal(readiness.ready, true);
  assert.deepEqual(
    readiness.references.map((reference) => reference.asset),
    ["assets/characters/001-pig-principal.png"],
  );

  const result = await generateOne({
    args: {
      "--pilot": true,
      "--dry-run": true,
    },
    context,
    env: {},
  });
  assert.equal(result.paid_generation_started, false);
  assert.equal(result.request.references.length, 1);
  assert.equal(
    result.request.references[0].asset,
    "assets/characters/001-pig-principal.png",
  );
});

test("approved base unlocks three identities derived only from that base", () => {
  const context = loadContext();
  const base = phaseBaseItem(context.pilot, context.phaseBootstrap);
  const states = new Map([
    [
      normalizeAsset(base.asset_futuro),
      { status: "aprovada", asset: normalizeAsset(base.asset_futuro) },
    ],
  ]);
  const items = pilotWorkflowItems({
    manifest: context.pilot,
    phaseBootstrap: context.phaseBootstrap,
    queueItems: context.queue.itens,
    states,
  });
  assert.deepEqual(
    items.map((item) => item.estilo),
    ["azul", "rosa", "arco_iris"],
  );

  const root = fs.mkdtempSync(path.join(os.tmpdir(), "cofrinho-pilot-"));
  const pigSource = path.join(
    process.cwd(),
    "assets",
    "characters",
    "001-pig-principal.png",
  );
  const pigTarget = path.join(root, "assets", "characters", "001-pig-principal.png");
  const baseTarget = path.join(root, ...base.asset_futuro.split("/"));
  fs.mkdirSync(path.dirname(pigTarget), { recursive: true });
  fs.mkdirSync(path.dirname(baseTarget), { recursive: true });
  fs.copyFileSync(pigSource, pigTarget);
  fs.writeFileSync(baseTarget, Buffer.from("approved-private-phase-base"));

  for (const item of items) {
    const readiness = pilotReferenceReadiness(item, context.pilot, { root, states });
    assert.equal(readiness.ready, true);
    assert.deepEqual(
      readiness.references.map((reference) => reference.asset),
      [base.asset_futuro],
    );
    const prompt = buildPilotPrompt(item, context.pilot, context.phaseBootstrap);
    assert.match(prompt, /Preserve exatamente: mesmo personagem, idade, fase da vida, anatomia essencial/u);
    assert.match(prompt, /Altere somente: apresentacao masculina, feminina ou neutra, roupas, cores/u);
  }
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
