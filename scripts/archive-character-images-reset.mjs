import { createHash } from "node:crypto";
import { execFileSync } from "node:child_process";
import { existsSync, mkdirSync, readFileSync, readdirSync, renameSync, writeFileSync } from "node:fs";
import { basename, join, relative } from "node:path";
import { fileURLToPath } from "node:url";

const projectRoot = fileURLToPath(new URL("../", import.meta.url));
const charactersDir = join(projectRoot, "assets", "characters");
const archiveRoot = join(
  charactersDir,
  "_drafts",
  "reset-visual-tres-identidades-2026-07",
);
const manifestPath = join(archiveRoot, "manifest.json");
const catalogPath = join(projectRoot, "data", "vila-pig-personagens.json");
const preservedAsset = "001-pig-principal.png";
const archivedAt = "2026-07-14";
const reason =
  "Imagem preservada como rascunho após adoção do novo sistema de três identidades e uso exclusivo do Pig Principal como referência visual oficial.";

const toPosix = (value) => value.replaceAll("\\", "/");
const projectPath = (value) => toPosix(relative(projectRoot, value));
const sha256 = (filePath) =>
  createHash("sha256").update(readFileSync(filePath)).digest("hex");

function gitOriginCommit(filePath) {
  try {
    const output = execFileSync(
      "git",
      ["log", "--diff-filter=A", "--follow", "--format=%H", "--", projectPath(filePath)],
      { cwd: projectRoot, encoding: "utf8" },
    ).trim();
    return output.split(/\r?\n/).filter(Boolean).at(-1) ?? null;
  } catch {
    return null;
  }
}

function classify(number) {
  const numeric = Number(number);
  if (numeric >= 2 && numeric <= 11) return "avatares";
  if (numeric === 201 || numeric === 202) return "especiais";
  return "personagens";
}

function inferStyle(fileName, record) {
  const stem = fileName.replace(/\.png$/i, "");
  const baseStem = basename(record?.asset_futuro ?? "", ".png");
  if (baseStem && stem === baseStem) return "principal";
  const suffix = baseStem && stem.startsWith(`${baseStem}-`)
    ? stem.slice(baseStem.length + 1)
    : stem.split("-").slice(3).join("-");
  return suffix.replaceAll("-", "_") || "principal";
}

function priorStatus(record, style) {
  if (style === "principal") return record?.status_imagem ?? "desconhecido";
  return record?.status_variacoes?.[style] ?? record?.status_imagem ?? "desconhecido";
}

if (existsSync(manifestPath)) {
  const existing = JSON.parse(readFileSync(manifestPath, "utf8"));
  console.log(`Arquivamento já concluído: ${existing.itens.length} itens em ${projectPath(manifestPath)}.`);
  process.exit(0);
}

const catalog = JSON.parse(readFileSync(catalogPath, "utf8"));
const byNumber = new Map(catalog.map((record) => [String(record.numero).padStart(3, "0"), record]));
const sourceFiles = readdirSync(charactersDir, { withFileTypes: true })
  .filter((entry) => entry.isFile() && entry.name.endsWith(".png") && entry.name !== preservedAsset)
  .map((entry) => entry.name)
  .sort();

if (sourceFiles.length === 0) {
  throw new Error("Nenhuma imagem oficial elegível foi encontrada e o manifesto ainda não existe.");
}

for (const folder of ["avatares", "especiais", "personagens", "rejeitadas"]) {
  mkdirSync(join(archiveRoot, folder), { recursive: true });
}

const items = sourceFiles.map((fileName) => {
  const number = fileName.slice(0, 3);
  const record = byNumber.get(number);
  const style = inferStyle(fileName, record);
  const sourcePath = join(charactersDir, fileName);
  const destinationPath = join(archiveRoot, classify(number), fileName);

  if (existsSync(destinationPath)) {
    throw new Error(`Destino já existe: ${projectPath(destinationPath)}`);
  }

  const item = {
    caminho_original: projectPath(sourcePath),
    caminho_novo: projectPath(destinationPath),
    sha256: sha256(sourcePath),
    personagem: record?.nome ?? "Personagem não localizado no catálogo",
    numero: number,
    estilo: style,
    status_anterior: priorStatus(record, style),
    commit_origem: gitOriginCommit(sourcePath),
    arquivado_em: archivedAt,
    motivo: reason,
  };

  renameSync(sourcePath, destinationPath);
  return item;
});

const manifest = {
  schema_version: "1.0.0",
  criado_em: archivedAt,
  checkpoint_git: execFileSync("git", ["rev-parse", "HEAD"], {
    cwd: projectRoot,
    encoding: "utf8",
  }).trim(),
  asset_preservado: "assets/characters/001-pig-principal.png",
  pasta_arquivo: projectPath(archiveRoot),
  motivo: reason,
  total: items.length,
  itens: items,
};

writeFileSync(manifestPath, `${JSON.stringify(manifest, null, 2)}\n`, "utf8");
console.log(`Arquivadas ${items.length} imagens em ${projectPath(archiveRoot)}.`);

