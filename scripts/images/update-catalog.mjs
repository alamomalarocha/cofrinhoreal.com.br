import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { csvEscape } from "../catalogo-lib.mjs";
import {
  fromRoot,
  loadContext,
  normalizeAsset,
  parseArgs,
} from "./lib.mjs";
import {
  copyPreservingSource,
  ensureReviewWorkspace,
  readJsonIfExists,
  reportPath,
  stagePath,
  writeJsonFile,
} from "./workspace.mjs";

const CATALOG_FILES = [
  "data/vila-pig-personagens.json",
  "data/vila-pig-personagens.csv",
  "docs/AVATARES.md",
  "docs/ASSETS_PERSONAGENS.md",
  "docs/PLANO_IMAGENS_PERSONAGENS_001.md",
];

function resolveCatalogRoot(value) {
  return value ? path.resolve(value) : fromRoot();
}

function findQueueItem(context, asset) {
  const item = context.queue.itens.find(
    (candidate) => normalizeAsset(candidate.asset_futuro) === asset,
  );
  if (!item) throw new Error(`Asset nao encontrado na fila: ${asset}`);
  return item;
}

function backupFiles(catalogRoot, reviewRoot, now) {
  const stamp = now.toISOString().replaceAll(":", "-").replaceAll(".", "-");
  const backupRoot = path.join(reviewRoot, "reports", "backups", stamp);
  const copied = [];
  for (const relative of CATALOG_FILES) {
    const source = path.join(catalogRoot, relative);
    if (!fs.existsSync(source)) continue;
    const destination = path.join(backupRoot, relative);
    copyPreservingSource(source, destination);
    copied.push(destination);
  }
  return { backupRoot, copied };
}

function writeCsvAbsolute(filePath, records) {
  const header = fs.readFileSync(filePath, "utf8").split(/\r?\n/u, 1)[0].split(",");
  const lines = [header.map(csvEscape).join(",")];
  for (const record of records) {
    lines.push(header.map((column) => csvEscape(record[column])).join(","));
  }
  fs.writeFileSync(filePath, `${lines.join("\n")}\n`, "utf8");
}

function updatePerson(person, item) {
  const style = item.estilo || null;
  if (!style) {
    person.status_imagem = "criada";
    return;
  }
  if (!person.variacoes_planejadas?.includes(style)) {
    throw new Error(`Variacao ${style} nao esta planejada para ${person.numero}.`);
  }
  person.status_variacoes = {
    ...(person.status_variacoes || {}),
    [style]: "criada",
  };
  person.variacoes_criadas = [
    ...new Set([...(person.variacoes_criadas || []), style]),
  ];
  const allCreated = person.variacoes_planejadas.every(
    (identity) => person.status_variacoes?.[identity] === "criada",
  );
  person.status_imagem = allCreated ? "variacoes_criadas" : "pendente";
}

function updateDocumentation(catalogRoot, item, asset, now) {
  const marker = `<!-- image-automation:${asset} -->`;
  const entry = [
    "",
    marker,
    `- ${item.numero} - ${item.nome} - ${item.estilo || "principal"}:`,
    `  \`${asset}\` aprovado e incorporado ao catalogo local em ${now.toISOString()}.`,
    "",
  ].join("\n");
  const changed = [];
  for (const relative of CATALOG_FILES.filter((file) => file.endsWith(".md"))) {
    const filePath = path.join(catalogRoot, relative);
    if (!fs.existsSync(filePath)) continue;
    const current = fs.readFileSync(filePath, "utf8");
    if (current.includes(marker)) continue;
    fs.writeFileSync(filePath, `${current.trimEnd()}\n${entry}`, "utf8");
    changed.push(filePath);
  }
  return changed;
}

export function updateCatalog({
  asset,
  apply = false,
  authorized = false,
  context = loadContext(),
  reviewRoot,
  catalogRoot,
  now = new Date(),
}) {
  const normalized = normalizeAsset(asset);
  const root = ensureReviewWorkspace(reviewRoot);
  const targetRoot = resolveCatalogRoot(catalogRoot);
  const item = findQueueItem(context, normalized);
  const approvedFile = stagePath(root, "approved", normalized);
  const reviewFile = reportPath(root, normalized, "review");
  const review = readJsonIfExists(reviewFile);
  if (!fs.existsSync(approvedFile) || review?.decision !== "approved") {
    throw new Error("Atualizacao bloqueada: o arquivo precisa de aprovacao humana local.");
  }

  const jsonFile = path.join(targetRoot, "data", "vila-pig-personagens.json");
  const csvFile = path.join(targetRoot, "data", "vila-pig-personagens.csv");
  const finalFile = path.join(targetRoot, ...normalized.split("/"));
  const planned = {
    dry_run: !apply,
    asset: normalized,
    source: approvedFile,
    destination: finalFile,
    catalog_json: jsonFile,
    catalog_csv: csvFile,
    docs: CATALOG_FILES.filter((file) => file.endsWith(".md")),
    approval: {
      reviewer: review.reviewer,
      reviewed_at: review.reviewed_at,
      reason: review.reason,
    },
  };
  if (!apply) return planned;
  if (!authorized) {
    throw new Error("Use --authorize-catalog-update junto com --apply.");
  }

  const backup = backupFiles(targetRoot, root, now);
  const catalog = JSON.parse(fs.readFileSync(jsonFile, "utf8"));
  const person = catalog.find(
    (record) => record.numero === item.numero && record.slug === item.slug,
  );
  if (!person) throw new Error(`Personagem nao encontrado: ${item.numero}/${item.slug}`);
  updatePerson(person, item);
  writeJsonFile(jsonFile, catalog);
  writeCsvAbsolute(csvFile, catalog);
  const docs = updateDocumentation(targetRoot, item, normalized, now);
  copyPreservingSource(approvedFile, finalFile);

  const completedReview = {
    ...review,
    catalog_updated: true,
    catalog_updated_at: now.toISOString(),
    catalog_destination: finalFile,
    catalog_backup: backup.backupRoot,
  };
  writeJsonFile(reviewFile, completedReview);
  const report = {
    ...planned,
    dry_run: false,
    applied: true,
    backup,
    documentation_updated: docs,
    review_report: reviewFile,
  };
  writeJsonFile(reportPath(root, normalized, "catalog"), report);
  return report;
}

function runCli() {
  const args = parseArgs();
  if (!args["--asset"]) throw new Error("Use --asset CAMINHO.");
  const result = updateCatalog({
    asset: String(args["--asset"]),
    apply: args["--apply"] === true,
    authorized: args["--authorize-catalog-update"] === true,
    reviewRoot: args["--review-root"],
    catalogRoot: args["--catalog-root"],
  });
  console.log(JSON.stringify(result, null, 2));
}

if (process.argv[1] && path.resolve(process.argv[1]) === fileURLToPath(import.meta.url)) {
  runCli();
}
