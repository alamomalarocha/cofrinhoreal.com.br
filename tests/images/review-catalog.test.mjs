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
      ],
    },
  };
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

test("duplicate approval is blocked but rejection preserves its evidence", () => {
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
