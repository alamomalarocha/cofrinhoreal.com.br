import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const jsonPath = path.join(root, "data", "vila-pig-personagens.json");
const csvPath = path.join(root, "data", "vila-pig-personagens.csv");
const people = JSON.parse(fs.readFileSync(jsonPath, "utf8"));

const phaseByNumber = {
  "002": "fase_bebe",
  "003": "fase_primeirinhos",
  "004": "fase_crianca",
  "005": "fase_pre_adolescente",
  "006": "fase_adolescente",
  "007": "fase_jovem",
  "008": "fase_jovem_adulto",
  "009": "fase_adulto",
  "010": "fase_maduro",
  "011": "fase_senior",
};

const styleCodes = {
  padrao: "PAD",
  azul: "AZL",
  rosa: "RSA",
  arco_iris: "ARC",
};

function canonicalType(person) {
  if (person.tipo === "mascote_principal") return "mascote_principal";
  if (person.tipo === "avatar_usuario") return "avatar_usuario";
  if (person.tipo === "personagem_especial") return "personagem_especial";
  return "personagem_vila";
}

function classification(person) {
  if (person.tipo === "mascote_principal") return "mascote";
  if (person.tipo === "avatar_usuario") return "fase_vida";
  if (person.tipo === "personagem_especial") return "especial_educativo";
  return "personagem_vila";
}

function prefix(person) {
  if (person.tipo === "mascote_principal") return "MAS";
  if (person.tipo === "avatar_usuario") return "AVA";
  if (person.tipo === "personagem_especial") return "ESP";
  return "VIL";
}

function migrate(person) {
  const codePrefix = prefix(person);
  const uid = person.uid || `${codePrefix}-${person.numero}`;
  const styles = person.variacoes_planejadas || [];
  const uidsVariacoes = Object.fromEntries(
    styles.map((style) => [style, `${uid}-${styleCodes[style] || "VAR"}`])
  );
  const cardCodesVariacoes = Object.fromEntries(
    styles.map((style) => [style, `CR-${person.numero}-${styleCodes[style] || "VAR"}-2026`])
  );

  return {
    ...person,
    schema_version_personagem: "2.0.0",
    uid,
    numero_legacy: person.numero_legacy || person.numero,
    card_code: person.card_code || `CR-${person.numero}-${codePrefix}-2026`,
    uids_variacoes: styles.length ? uidsVariacoes : undefined,
    card_codes_variacoes: styles.length ? cardCodesVariacoes : undefined,
    tipo_personagem: canonicalType(person),
    classificacao_principal: classification(person),
    subcategoria: person.subcategoria ?? person.tipo,
    fase_vida: person.fase_vida ?? phaseByNumber[person.numero] ?? null,
    geracao: person.geracao ?? null,
    geracao_calculada_pelo_usuario:
      person.geracao_calculada_pelo_usuario ?? person.tipo === "avatar_usuario",
    regiao: person.regiao ?? null,
    uf: person.uf ?? null,
    familia_uid: person.familia_uid ?? null,
    origens_culturais: person.origens_culturais ?? [],
    comunidades: person.comunidades ?? [],
    profissoes: person.profissoes ?? [],
    folclore: person.folclore ?? [],
    status_pesquisa:
      person.status_pesquisa ??
      (["mascote_principal", "avatar_usuario", "personagem_especial"].includes(person.tipo)
        ? "nao_aplicavel"
        : "pendente"),
    fontes: person.fontes ?? [],
  };
}

const migrated = people.map(migrate);
fs.writeFileSync(jsonPath, `${JSON.stringify(migrated, null, 2)}\n`, "utf8");

const columns = [
  "numero",
  "nome",
  "slug",
  "apelido",
  "aliases",
  "tipo",
  "categoria",
  "faixa_etaria",
  "papel",
  "descricao_curta",
  "asset_futuro",
  "status_imagem",
  "tags",
  "variacoes_planejadas",
  "assets_variacoes_futuras",
  "padrao_visual_avatar",
  "status_variacoes",
  "uid",
  "numero_legacy",
  "card_code",
  "uids_variacoes",
  "card_codes_variacoes",
  "tipo_personagem",
  "classificacao_principal",
  "subcategoria",
  "fase_vida",
  "geracao",
  "geracao_calculada_pelo_usuario",
  "regiao",
  "uf",
  "familia_uid",
  "origens_culturais",
  "comunidades",
  "profissoes",
  "folclore",
  "status_pesquisa",
];

function compact(value) {
  if (value === null || value === undefined) return "";
  if (Array.isArray(value)) return value.join("|");
  if (typeof value === "object") {
    return Object.entries(value)
      .map(([key, item]) => `${key}=${item}`)
      .join(";");
  }
  return String(value);
}

function csvCell(value) {
  const text = compact(value);
  return /[",\r\n]/.test(text) ? `"${text.replaceAll('"', '""')}"` : text;
}

const csv = [
  columns.join(","),
  ...migrated.map((person) => columns.map((column) => csvCell(person[column])).join(",")),
].join("\n");

fs.writeFileSync(csvPath, `${csv}\n`, "utf8");
console.log(`Migrados ${migrated.length} personagens sem alterar numeros, slugs ou assets.`);
