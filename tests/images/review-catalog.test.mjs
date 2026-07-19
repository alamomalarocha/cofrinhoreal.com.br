import assert from "node:assert/strict";
import fs from "node:fs";
import os from "node:os";
import path from "node:path";
import test from "node:test";
import { fileSha256 } from "../../scripts/images/lib.mjs";
import {
  encodeRgbaPng,
  perceptualHash,
  removeTechnicalBackground,
} from "../../scripts/images/png-lib.mjs";
import { publicationGate, publicationPlan } from "../../scripts/images/publish.mjs";
import { reviewAsset } from "../../scripts/images/review.mjs";
import { updateCatalog } from "../../scripts/images/update-catalog.mjs";
import {
  ensureReviewWorkspace,
  readJsonIfExists,
  reportPath,
  stagePath,
  writeJsonFile,
} from "../../scripts/images/workspace.mjs";
import { solidCharacterFixture } from "../fixtures/image-fixtures.mjs";

const blueAsset = "assets/characters/002-pig-bebe-azul.png";
const pinkAsset = "assets/characters/002-pig-bebe-rosa.png";
const rainbowAsset = "assets/characters/002-pig-bebe-arco-iris.png";
const baseAsset = "data/image-automation/phase-bases/002-pig-bebe-base.png";

function contextFixture() {
  return {
    config: {
      validation: { duplicate_phash_distance_max: 4 },
      storage: { enabled: false, upload_implemented: false },
    },
    queue: {
      itens: [
        {
          uid: "AVA-002-AZL",
          numero: "002",
          nome: "Pig Bebe",
          slug: "pig-bebe",
          estilo: "azul",
          asset_futuro: blueAsset,
        },
        {
          uid: "AVA-002-RSA",
          numero: "002",
          nome: "Pig Bebe",
          slug: "pig-bebe",
          estilo: "rosa",
          asset_futuro: pinkAsset,
        },
        {
          uid: "AVA-002-ARC",
          numero: "002",
          nome: "Pig Bebe",
          slug: "pig-bebe",
          estilo: "arco_iris",
          asset_futuro: rainbowAsset,
        },
      ],
    },
    phaseBootstrap: {
      phases: [{ numero: "002", name: "Pig Bebe", slug: "pig-bebe", base_asset: baseAsset }],
    },
    pilot: {
      references: {
        phase_base: {
          role: "approved-phase-base", required: true, required_state: "aprovada", asset: baseAsset,
        },
      },
      items: [
        { uid: "AVA-002-AZL", kind: "identity", identity: "azul", asset: blueAsset, reference_keys: ["phase_base"] },
        { uid: "AVA-002-RSA", kind: "identity", identity: "rosa", asset: pinkAsset, reference_keys: ["phase_base"] },
        { uid: "AVA-002-ARC", kind: "identity", identity: "arco_iris", asset: rainbowAsset, reference_keys: ["phase_base"] },
      ],
    },
    styles: {
      identity_policy: { public_identities: ["azul", "rosa", "arco_iris"] },
    },
  };
}

function approvePhaseBase(workspace, context, overrides = {}) {
  const asset = overrides.asset || baseAsset;
  if (!context.phaseBootstrap.phases.some((phase) => phase.base_asset === asset)) {
    context.phaseBootstrap.phases.push({ numero: "002", name: "Other", slug: "other", base_asset: asset });
  }
  writeCandidate(workspace.reviewRoot, asset, [100, 100, 100]);
  const report = reviewAsset({
    action: "approve", asset, reviewer: "Alamo", reason: "Base aprovada.", context,
    reviewRoot: workspace.reviewRoot, stateFile: workspace.stateFile,
    projectRoot: workspace.catalogRoot,
  });
  if (overrides.report) {
    Object.assign(report, overrides.report);
    writeJsonFile(reportPath(workspace.reviewRoot, asset, "review"), report);
  }
  return report;
}

function writeCandidate(reviewRoot, asset, color = [40, 120, 230]) {
  const fixture = solidCharacterFixture({ character: [...color, 255] });
  const processed = removeTechnicalBackground(fixture, {
    background: [119, 119, 119],
    tolerance: 20,
    feather: 12,
    shadowTolerance: 10,
  });
  const target = stagePath(reviewRoot, "validated", asset);
  fs.mkdirSync(path.dirname(target), { recursive: true });
  encodeRgbaPng(processed, target);
  writeJsonFile(reportPath(reviewRoot, asset, "validation"), {
    valid: true,
    asset,
    sha256: fileSha256(target),
    perceptual_hash: perceptualHash(processed),
  });
  writeJsonFile(reportPath(reviewRoot, asset, "visual"), {
    asset,
    automatic_decision: "aguardando_revisao",
    human_review_required: true,
  });
  return target;
}

function writeCatalogFixture(catalogRoot) {
  const person = {
    numero: "002",
    slug: "pig-bebe",
    status_imagem: "pendente",
    asset_futuro: "assets/characters/002-pig-bebe.png",
    variacoes_planejadas: ["azul", "rosa", "arco_iris"],
    status_variacoes: {
      azul: "pendente",
      rosa: "pendente",
      arco_iris: "pendente",
    },
    variacoes_criadas: [],
  };
  const json = path.join(catalogRoot, "data", "vila-pig-personagens.json");
  const csv = path.join(catalogRoot, "data", "vila-pig-personagens.csv");
  fs.mkdirSync(path.dirname(json), { recursive: true });
  fs.writeFileSync(json, `${JSON.stringify([person], null, 2)}\n`, "utf8");
  fs.writeFileSync(
    csv,
    [
      "numero,slug,status_imagem,asset_futuro,variacoes_planejadas,status_variacoes,variacoes_criadas",
      '002,pig-bebe,pendente,assets/characters/002-pig-bebe.png,azul|rosa|arco_iris,"{""azul"":""pendente"",""rosa"":""pendente"",""arco_iris"":""pendente""}",',
      "",
    ].join("\n"),
    "utf8",
  );
  for (const name of [
    "AVATARES.md",
    "ASSETS_PERSONAGENS.md",
    "PLANO_IMAGENS_PERSONAGENS_001.md",
  ]) {
    const target = path.join(catalogRoot, "docs", name);
    fs.mkdirSync(path.dirname(target), { recursive: true });
    fs.writeFileSync(target, `# ${name}\n`, "utf8");
  }
  return { json, csv };
}

function temporaryWorkspace() {
  const base = fs.mkdtempSync(path.join(os.tmpdir(), "cofrinho-review-"));
  const reviewRoot = ensureReviewWorkspace(path.join(base, "review"));
  const catalogRoot = path.join(base, "catalog");
  const stateFile = path.join(base, "state.jsonl");
  return { base, reviewRoot, catalogRoot, stateFile };
}

test("human approval preserves the validated file and records reviewer metadata", () => {
  const workspace = temporaryWorkspace();
  const candidate = writeCandidate(workspace.reviewRoot, blueAsset);
  const report = reviewAsset({
    action: "approve",
    asset: blueAsset,
    reviewer: "Alamo",
    reason: "Aprovado para o piloto local.",
    context: contextFixture(),
    reviewRoot: workspace.reviewRoot,
    stateFile: workspace.stateFile,
    now: new Date("2026-07-16T12:00:00.000Z"),
  });
  assert.equal(report.decision, "approved");
  assert.equal(report.reviewer, "Alamo");
  assert.equal(fs.existsSync(candidate), true);
  assert.equal(fs.existsSync(stagePath(workspace.reviewRoot, "approved", blueAsset)), true);
});

test("approved phase base is installed privately without catalog publication", () => {
  const workspace = temporaryWorkspace();
  const asset = "data/image-automation/phase-bases/002-pig-bebe-base.png";
  const context = {
    config: {
      validation: { duplicate_phash_distance_max: 4 },
      storage: { enabled: false, upload_implemented: false },
    },
    queue: { itens: [] },
    phaseBootstrap: {
      phases: [{
        key: "fase_bebe",
        numero: "002",
        name: "Pig Bebe",
        slug: "pig-bebe",
        age: "0 a 2 anos",
        pose: "bebe",
        base_asset: asset,
        technical_clothing: "roupa tecnica neutra",
      }],
    },
  };
  writeCandidate(workspace.reviewRoot, asset);
  const report = reviewAsset({
    action: "approve",
    asset,
    reviewer: "Alamo",
    reason: "Base tecnica aprovada para derivacoes.",
    context,
    reviewRoot: workspace.reviewRoot,
    stateFile: workspace.stateFile,
    projectRoot: workspace.catalogRoot,
  });
  assert.equal(report.kind, "phase_base");
  assert.equal(report.internal_phase_base_installed, true);
  assert.equal(report.catalog_updated, false);
  assert.equal(
    fs.existsSync(path.join(workspace.catalogRoot, ...asset.split("/"))),
    true,
  );
});

test("exact duplicate approval is blocked but rejection preserves its evidence", () => {
  const workspace = temporaryWorkspace();
  writeCandidate(workspace.reviewRoot, blueAsset);
  reviewAsset({
    action: "approve",
    asset: blueAsset,
    reviewer: "Alamo",
    reason: "Primeira imagem.",
    context: contextFixture(),
    reviewRoot: workspace.reviewRoot,
    stateFile: workspace.stateFile,
  });
  writeCandidate(workspace.reviewRoot, pinkAsset);
  assert.throws(
    () => reviewAsset({
      action: "approve",
      asset: pinkAsset,
      reviewer: "Alamo",
      reason: "Tentativa duplicada.",
      context: contextFixture(),
      reviewRoot: workspace.reviewRoot,
      stateFile: workspace.stateFile,
    }),
    /Duplicata exata|Possivel duplicata visual/u,
  );
  const rejected = reviewAsset({
    action: "reject",
    asset: pinkAsset,
    reviewer: "Alamo",
    reason: "Duplicata visual.",
    context: contextFixture(),
    reviewRoot: workspace.reviewRoot,
    stateFile: workspace.stateFile,
  });
  assert.equal(rejected.decision, "rejected");
  assert.equal(fs.existsSync(stagePath(workspace.reviewRoot, "rejected", pinkAsset)), true);
});

test("official sibling identities allow close pHash with an auditable reason", () => {
  const workspace = temporaryWorkspace();
  const context = contextFixture();
  for (const asset of [blueAsset, pinkAsset, rainbowAsset]) {
    writeCandidate(workspace.reviewRoot, asset, asset === blueAsset ? [40, 120, 230] : asset === pinkAsset ? [230, 120, 160] : [80, 180, 120]);
    const validationFile = reportPath(workspace.reviewRoot, asset, "validation");
    const validation = readJsonIfExists(validationFile);
    validation.perceptual_hash = "0020483060302800";
    writeJsonFile(validationFile, validation);
    const report = reviewAsset({
      action: "approve", asset, reviewer: "Alamo", reason: "Identidade irma oficial.",
      context, reviewRoot: workspace.reviewRoot, stateFile: workspace.stateFile,
    });
    if (asset === blueAsset) {
      assert.equal(report.perceptual_similarity_allowed, undefined);
    } else {
      assert.equal(report.perceptual_similarity_allowed, true);
      assert.equal(report.perceptual_similarity_reason, "official_sibling_identities_same_character");
      assert.equal(report.perceptual_similarity_exceptions[0].sha256_equal, false);
    }
  }
});

test("all official identities allow close pHash to their directly declared approved phase base", () => {
  for (const asset of [blueAsset, pinkAsset, rainbowAsset]) {
    const workspace = temporaryWorkspace();
    const context = contextFixture();
    const base = approvePhaseBase(workspace, context);
    writeCandidate(workspace.reviewRoot, asset, [40, 120, 230]);
    const validationFile = reportPath(workspace.reviewRoot, asset, "validation");
    const validation = readJsonIfExists(validationFile);
    validation.perceptual_hash = base.perceptual_hash;
    writeJsonFile(validationFile, validation);
    const report = reviewAsset({
      action: "approve", asset, reviewer: "Alamo", reason: "Identidade derivada.", context,
      reviewRoot: workspace.reviewRoot, stateFile: workspace.stateFile,
    });
    assert.equal(report.perceptual_similarity_reason, "official_identity_derived_from_approved_phase_base");
    assert.equal(report.perceptual_similarity_related_asset, baseAsset);
    assert.equal(report.perceptual_similarity_related_kind, "phase_base");
    assert.equal(report.perceptual_similarity_sha256_equal, false);
    assert.deepEqual(report.perceptual_similarity_exceptions[0], {
      reason: "official_identity_derived_from_approved_phase_base",
      related_asset: baseAsset,
      related_kind: "phase_base",
      sha256_equal: false,
      phash_distance: 0,
    });
  }
});

test("phase-base exception requires the complete authoritative relationship", () => {
  const scenarios = [
    { label: "unapproved base", report: { decision: "rejected" } },
    { label: "wrong kind", report: { kind: "character" } },
    { label: "undeclared base", mutate: (context) => { context.pilot.items[0].reference_keys = ["missing"]; } },
    { label: "other number", report: { numero: "003" } },
    { label: "standard identity", mutate: (context) => { context.queue.itens[0].estilo = "padrao"; } },
    { label: "fourth identity", mutate: (context) => { context.queue.itens[0].estilo = "dourado"; } },
    { label: "name similarity only", mutate: (context) => { context.pilot.items[0].reference_keys = []; } },
    { label: "different character", mutate: (context) => { context.queue.itens[0].uid = "AVA-999-AZL"; } },
  ];
  for (const scenario of scenarios) {
    const workspace = temporaryWorkspace();
    const context = contextFixture();
    const base = approvePhaseBase(workspace, context, { report: scenario.report });
    scenario.mutate?.(context);
    writeCandidate(workspace.reviewRoot, blueAsset, [40, 120, 230]);
    const validationFile = reportPath(workspace.reviewRoot, blueAsset, "validation");
    const validation = readJsonIfExists(validationFile);
    validation.perceptual_hash = base.perceptual_hash;
    writeJsonFile(validationFile, validation);
    assert.throws(
      () => reviewAsset({ action: "approve", asset: blueAsset, reviewer: "Alamo", reason: scenario.label, context, reviewRoot: workspace.reviewRoot, stateFile: workspace.stateFile }),
      /Possivel duplicata visual/u,
      scenario.label,
    );
  }
});

test("phase-base exception never allows identical SHA or a phase base as candidate", () => {
  const workspace = temporaryWorkspace();
  const context = contextFixture();
  const base = approvePhaseBase(workspace, context);
  writeCandidate(workspace.reviewRoot, blueAsset, [40, 120, 230]);
  const validationFile = reportPath(workspace.reviewRoot, blueAsset, "validation");
  const validation = readJsonIfExists(validationFile);
  validation.sha256 = base.sha256;
  validation.perceptual_hash = base.perceptual_hash;
  writeJsonFile(validationFile, validation);
  assert.throws(
    () => reviewAsset({ action: "approve", asset: blueAsset, reviewer: "Alamo", reason: "same SHA", context, reviewRoot: workspace.reviewRoot, stateFile: workspace.stateFile }),
    /Duplicata exata/u,
  );

  const secondBase = "data/image-automation/phase-bases/003-pig-base.png";
  context.phaseBootstrap.phases.push({ numero: "003", name: "Pig", slug: "pig", base_asset: secondBase });
  writeCandidate(workspace.reviewRoot, secondBase, [80, 80, 80]);
  const secondValidationFile = reportPath(workspace.reviewRoot, secondBase, "validation");
  const secondValidation = readJsonIfExists(secondValidationFile);
  secondValidation.perceptual_hash = base.perceptual_hash;
  writeJsonFile(secondValidationFile, secondValidation);
  assert.throws(
    () => reviewAsset({ action: "approve", asset: secondBase, reviewer: "Alamo", reason: "base candidate", context, reviewRoot: workspace.reviewRoot, stateFile: workspace.stateFile, projectRoot: workspace.catalogRoot }),
    /Possivel duplicata visual/u,
  );
});

test("close pHash remains blocked outside the exact official sibling policy", () => {
  const scenarios = [
    { label: "different number", mutate: (item) => { item.numero = "003"; item.slug = "other"; } },
    { label: "standard identity", mutate: (item) => { item.estilo = "padrao"; } },
    { label: "fourth identity", mutate: (item) => { item.estilo = "dourado"; } },
    { label: "phase base", mutate: (item) => { item.kind = "phase_base"; } },
    { label: "same style", mutate: (item) => { item.estilo = "azul"; } },
  ];
  for (const scenario of scenarios) {
    const workspace = temporaryWorkspace();
    const context = contextFixture();
    writeCandidate(workspace.reviewRoot, blueAsset, [40, 120, 230]);
    reviewAsset({ action: "approve", asset: blueAsset, reviewer: "Alamo", reason: "Primeiro.", context, reviewRoot: workspace.reviewRoot, stateFile: workspace.stateFile });
    writeCandidate(workspace.reviewRoot, pinkAsset, [230, 120, 160]);
    const firstValidation = readJsonIfExists(reportPath(workspace.reviewRoot, blueAsset, "validation"));
    const secondValidationFile = reportPath(workspace.reviewRoot, pinkAsset, "validation");
    const secondValidation = readJsonIfExists(secondValidationFile);
    secondValidation.perceptual_hash = firstValidation.perceptual_hash;
    writeJsonFile(secondValidationFile, secondValidation);
    scenario.mutate(context.queue.itens.find((item) => item.asset_futuro === pinkAsset));
    assert.throws(
      () => reviewAsset({ action: "approve", asset: pinkAsset, reviewer: "Alamo", reason: scenario.label, context, reviewRoot: workspace.reviewRoot, stateFile: workspace.stateFile }),
      /Possivel duplicata visual/u,
    );
  }
});

test("catalog dry-run is inert and authorized apply creates backups and updates records", () => {
  const workspace = temporaryWorkspace();
  const files = writeCatalogFixture(workspace.catalogRoot);
  writeCandidate(workspace.reviewRoot, blueAsset);
  reviewAsset({
    action: "approve",
    asset: blueAsset,
    reviewer: "Alamo",
    reason: "Aprovado.",
    context: contextFixture(),
    reviewRoot: workspace.reviewRoot,
    stateFile: workspace.stateFile,
  });
  const before = fs.readFileSync(files.json, "utf8");
  const dryRun = updateCatalog({
    asset: blueAsset,
    context: contextFixture(),
    reviewRoot: workspace.reviewRoot,
    catalogRoot: workspace.catalogRoot,
  });
  assert.equal(dryRun.dry_run, true);
  assert.equal(fs.readFileSync(files.json, "utf8"), before);

  const applied = updateCatalog({
    asset: blueAsset,
    apply: true,
    authorized: true,
    context: contextFixture(),
    reviewRoot: workspace.reviewRoot,
    catalogRoot: workspace.catalogRoot,
    now: new Date("2026-07-16T12:30:00.000Z"),
  });
  const catalog = JSON.parse(fs.readFileSync(files.json, "utf8"));
  assert.equal(applied.applied, true);
  assert.equal(catalog[0].status_variacoes.azul, "criada");
  assert.deepEqual(catalog[0].variacoes_criadas, ["azul"]);
  assert.equal(
    fs.existsSync(path.join(workspace.catalogRoot, ...blueAsset.split("/"))),
    true,
  );
  assert.equal(fs.existsSync(applied.backup.backupRoot), true);
  assert.equal(
    readJsonIfExists(reportPath(workspace.reviewRoot, blueAsset, "review")).catalog_updated,
    true,
  );
});

test("catalog and publication remain blocked without human approval or remote authorization", () => {
  const workspace = temporaryWorkspace();
  writeCatalogFixture(workspace.catalogRoot);
  writeCandidate(workspace.reviewRoot, blueAsset);
  assert.throws(
    () => updateCatalog({
      asset: blueAsset,
      context: contextFixture(),
      reviewRoot: workspace.reviewRoot,
      catalogRoot: workspace.catalogRoot,
    }),
    /aprovacao humana/u,
  );
  reviewAsset({
    action: "approve",
    asset: blueAsset,
    reviewer: "Alamo",
    reason: "Aprovado.",
    context: contextFixture(),
    reviewRoot: workspace.reviewRoot,
    stateFile: workspace.stateFile,
  });
  const local = publicationPlan({
    asset: blueAsset,
    mode: "local-review",
    context: contextFixture(),
    reviewRoot: workspace.reviewRoot,
  });
  assert.equal(local.local_only, true);
  const gate = publicationGate({
    mode: "git",
    config: contextFixture().config,
    env: {},
  });
  assert.equal(gate.authorized, false);
  assert.throws(
    () => publicationPlan({
      asset: blueAsset,
      mode: "git",
      context: contextFixture(),
      reviewRoot: workspace.reviewRoot,
      env: {},
    }),
    /Publicacao bloqueada/u,
  );
});
