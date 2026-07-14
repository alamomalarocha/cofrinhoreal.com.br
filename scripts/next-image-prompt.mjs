import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");

function readJson(relativePath) {
  return JSON.parse(fs.readFileSync(path.join(ROOT, relativePath), "utf8"));
}

function normalizeAsset(value = "") {
  return value.trim().replaceAll("\\", "/").replace(/^\.\//, "");
}

function option(name) {
  const inline = process.argv.find((argument) => argument.startsWith(`${name}=`));
  if (inline) return inline.slice(name.length + 1);
  const index = process.argv.indexOf(name);
  return index >= 0 ? process.argv[index + 1] || "" : "";
}

function correctEditorialAccents(value) {
  return value
    .replace(/\btecnico\b/giu, "técnico")
    .replace(/\btecnica\b/giu, "técnica")
    .replace(/\bcrianca\b/giu, "criança")
    .replace(/\beducacao\b/giu, "educação")
    .replace(/\bprofissao\b/giu, "profissão")
    .replace(/\bregiao\b/giu, "região")
    .replace(/\bpublico\b/giu, "público")
    .replace(/\bpublica\b/giu, "pública");
}

function sentence(value) {
  const clean = correctEditorialAccents(value.trim());
  if (!clean) return "Um único personagem do universo Cofrinho Real";
  return /[.!?]$/u.test(clean) ? clean : `${clean}.`;
}

function visualPrompt(item) {
  return [
    "Crie uma imagem nova do zero.",
    "",
    `${sentence(item.visual_brief)} Corpo inteiro, em pé, centralizado, estilo 3D/cartoon premium, coerente com o universo Cofrinho Real.`,
    "",
    "Sem texto, letras, números, símbolos, moedas, medalhas, logos, cenário, painel ou outros personagens.",
    "",
    "Fundo transparente.",
  ].join("\n");
}

const excludedAsset = normalizeAsset(option("--exclude"));
const queue = readJson("data/fila-imagens-personagens.json");
const catalog = readJson("data/vila-pig-personagens.json");
const catalogByUid = new Map(catalog.map((person) => [person.uid, person]));

const candidates = queue.itens
  .filter((item) => item.status_imagem === "pendente")
  .filter((item) => item.situacao_fila === "pronta_para_criacao")
  .filter((item) => item.publicavel !== false)
  .filter((item) => normalizeAsset(item.asset_futuro) !== excludedAsset)
  .sort((left, right) => Number(left.ordem) - Number(right.ordem));

const next = candidates[0];
if (!next) {
  console.log("Fila concluída: não há próximo item pendente e publicável.");
  process.exit(0);
}

const person = catalogByUid.get(next.uid);
if (!person) throw new Error(`Item da fila sem registro no catálogo: ${next.uid}`);
if (person.numero !== next.numero || person.slug !== next.slug) {
  throw new Error(`Metadados divergentes entre fila e catálogo: ${next.uid}`);
}
if (!normalizeAsset(next.asset_futuro)) {
  throw new Error(`Item sem asset_futuro: ${next.uid}/${next.estilo}`);
}

const displayName = person.nome_exibicao || person.nome || next.nome;

console.log("PRÓXIMO ITEM PENDENTE");
console.log(`- número: ${next.numero}`);
console.log(`- nome: ${displayName}`);
console.log(`- estilo visual: ${next.estilo}`);
console.log(`- slug: ${next.slug}`);
console.log(`- arquivo correto: ${normalizeAsset(next.asset_futuro)}`);
console.log("\nPROMPT VISUAL PURO PARA CHATGPT IMAGES\n");
console.log(visualPrompt(next));
