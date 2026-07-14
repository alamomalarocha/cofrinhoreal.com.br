import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const errors = [];
const warnings = [];

function readJson(relativePath) {
  const absolutePath = path.join(root, relativePath);
  try {
    return JSON.parse(fs.readFileSync(absolutePath, "utf8"));
  } catch (error) {
    errors.push(`${relativePath}: JSON invalido (${error.message})`);
    return null;
  }
}

function unique(items, field, label) {
  const seen = new Set();
  for (const item of items) {
    const value = item[field];
    if (!value) {
      errors.push(`${label}: campo ${field} ausente`);
    } else if (seen.has(value)) {
      errors.push(`${label}: ${field} duplicado (${value})`);
    }
    seen.add(value);
  }
}

function exists(relativePath, label) {
  if (!relativePath || !fs.existsSync(path.join(root, relativePath))) {
    errors.push(`${label}: arquivo ausente (${relativePath || "sem caminho"})`);
    return false;
  }
  return true;
}

function isPng(relativePath, label) {
  if (!exists(relativePath, label)) return;
  const signature = fs.readFileSync(path.join(root, relativePath)).subarray(0, 8).toString("hex");
  if (signature !== "89504e470d0a1a0a") errors.push(`${label}: arquivo nao e PNG valido`);
}

function parseCsv(text) {
  const rows = [];
  let row = [];
  let cell = "";
  let quoted = false;

  for (let index = 0; index < text.length; index += 1) {
    const char = text[index];
    const next = text[index + 1];
    if (char === '"' && quoted && next === '"') {
      cell += '"';
      index += 1;
    } else if (char === '"') {
      quoted = !quoted;
    } else if (char === "," && !quoted) {
      row.push(cell);
      cell = "";
    } else if ((char === "\n" || char === "\r") && !quoted) {
      if (char === "\r" && next === "\n") index += 1;
      row.push(cell);
      if (row.some((value) => value !== "")) rows.push(row);
      row = [];
      cell = "";
    } else {
      cell += char;
    }
  }
  if (cell || row.length) {
    row.push(cell);
    rows.push(row);
  }
  return rows;
}

const people = readJson("data/vila-pig-personagens.json") || [];
const generationsFile = readJson("data/geracoes.json");
const phasesFile = readJson("data/fases-vida.json");
const regionsFile = readJson("data/regioes-brasil.json");
const statesFile = readJson("data/ufs-brasil.json");
const biomesFile = readJson("data/biomas-brasil.json");
const familiesFile = readJson("data/familias-vila-pig.json");
const originsFile = readJson("data/origens-culturais.json");
const communitiesFile = readJson("data/comunidades-tradicionais.json");
const professionsFile = readJson("data/profissoes.json");
const folkloreFile = readJson("data/folclore-brasileiro.json");

unique(people, "numero", "personagens");
unique(people, "numero_legacy", "personagens");
unique(people, "uid", "personagens");
unique(people, "slug", "personagens");
unique(people, "card_code", "personagens");

const allowedStyles = new Set(["azul", "rosa", "arco_iris"]);
const variationUids = [];
const variationCodes = [];
for (const person of people) {
  if (person.numero !== person.numero_legacy) {
    errors.push(`${person.numero}: numero_legacy diverge do numero atual`);
  }
  if (!/^[a-z0-9]+(?:-[a-z0-9]+)*$/.test(person.slug || "")) {
    errors.push(`${person.numero}: slug invalido (${person.slug})`);
  }
  if (person.status_imagem === "criada") isPng(person.asset_futuro, person.uid);

  if (person.numero !== "001" && person.status_imagem !== "pendente") {
    errors.push(`${person.numero}: apenas o Pig Principal pode permanecer com imagem criada apos o reset`);
  }

  const isAvatar = person.tipo_personagem === "avatar_usuario" || person.tipo === "avatar_usuario";
  if (isAvatar) {
    const activeStyles = person.variacoes_planejadas || [];
    if (JSON.stringify(activeStyles) !== JSON.stringify(["azul", "rosa", "arco_iris"])) {
      errors.push(`${person.numero}: estilos ativos devem ser azul, rosa e arco_iris nessa ordem`);
    }
    if (person.status_variacoes?.padrao || person.assets_variacoes_futuras?.padrao) {
      errors.push(`${person.numero}: estilo padrao continua ativo`);
    }
    const discontinued = (person.variacoes_descontinuadas || []).find((item) => item.estilo === "padrao");
    if (discontinued?.status !== "descontinuado" || discontinued?.publicavel !== false) {
      errors.push(`${person.numero}: historico descontinuado do estilo padrao ausente`);
    }
  }

  for (const style of person.variacoes_planejadas || []) {
    if (!allowedStyles.has(style)) errors.push(`${person.numero}: estilo invalido (${style})`);
    const status = person.status_variacoes?.[style];
    const asset = person.assets_variacoes_futuras?.[style];
    if (!["criada", "pendente"].includes(status)) errors.push(`${person.numero}/${style}: status invalido`);
    if (status === "criada") isPng(asset, `${person.uid}/${style}`);
    if (person.uids_variacoes?.[style]) variationUids.push(person.uids_variacoes[style]);
    if (person.card_codes_variacoes?.[style]) variationCodes.push(person.card_codes_variacoes[style]);
  }
}
unique(variationUids.map((uid) => ({ uid })), "uid", "variacoes de avatar");
unique(variationCodes.map((card_code) => ({ card_code })), "card_code", "cards de avatar");

const principal = people.find((item) => item.numero === "001");
if (!principal) errors.push("Pig Principal 001 ausente");
else {
  isPng(principal.asset_futuro, "Pig Principal 001");
  if (principal.status_imagem !== "criada") errors.push("Pig Principal 001 deve permanecer criado");
}

const vantajinho = people.find((item) => item.numero === "201");
if (!vantajinho) errors.push("Vantajinho 201 ausente");
else if (vantajinho.status_imagem !== "pendente") errors.push("Vantajinho 201 deve voltar para a fila pendente");

const generations = generationsFile?.geracoes || [];
unique(generations, "id_estavel", "geracoes");
unique(generations, "slug", "geracoes");
const sortedGenerations = [...generations].sort((a, b) => a.ano_inicio - b.ano_inicio);
for (let index = 0; index < sortedGenerations.length; index += 1) {
  const generation = sortedGenerations[index];
  if (generation.ano_inicio > generation.ano_fim) errors.push(`${generation.id_estavel}: periodo invertido`);
  const previous = sortedGenerations[index - 1];
  if (previous && generation.ano_inicio <= previous.ano_fim) {
    errors.push(`${generation.id_estavel}: periodo sobrepoe ${previous.id_estavel}`);
  }
}

const phases = phasesFile?.fases || [];
unique(phases, "id", "fases da vida");
unique(phases, "avatar_numero", "fases da vida");
for (const phase of phases) {
  const avatar = people.find((item) => item.numero === phase.avatar_numero);
  if (!avatar || avatar.fase_vida !== phase.id) errors.push(`${phase.id}: avatar associado ausente ou divergente`);
}

const regions = regionsFile?.regioes || [];
const states = statesFile?.ufs || [];
if (regions.length !== 5) errors.push(`regioes-brasil.json: esperado 5, encontrado ${regions.length}`);
if (states.length !== 27) errors.push(`ufs-brasil.json: esperado 27, encontrado ${states.length}`);
unique(regions, "slug", "regioes");
unique(states, "sigla", "UFs");
unique(states, "codigo_ibge", "UFs");
const regionSlugs = new Set(regions.map((item) => item.slug));
const stateCodes = new Set(states.map((item) => item.sigla));
for (const state of states) if (!regionSlugs.has(state.regiao)) errors.push(`${state.sigla}: regiao desconhecida`);
for (const region of regions) {
  for (const state of region.ufs) if (!stateCodes.has(state)) errors.push(`${region.slug}: UF desconhecida (${state})`);
}
if ((biomesFile?.biomas || []).length !== 6) errors.push("biomas-brasil.json: esperado 6 biomas continentais");

const familyIds = new Set((familiesFile?.familias || []).map((item) => item.uid));
const originIds = new Set((originsFile?.categorias || []).map((item) => item.id));
const communityIds = new Set((communitiesFile?.comunidades || []).map((item) => item.id));
const professionIds = new Set((professionsFile?.profissoes || []).map((item) => item.id_estavel));
const folkloreIds = new Set((folkloreFile?.figuras || []).map((item) => item.uid));
unique(familiesFile?.familias || [], "uid", "familias");
unique(originsFile?.categorias || [], "id", "origens culturais");
unique(communitiesFile?.comunidades || [], "id", "comunidades");
unique(professionsFile?.profissoes || [], "id_estavel", "profissoes");
unique(folkloreFile?.figuras || [], "uid", "folclore");

for (const person of people) {
  if (person.regiao && !regionSlugs.has(person.regiao)) errors.push(`${person.uid}: regiao desconhecida`);
  if (person.uf && !stateCodes.has(person.uf)) errors.push(`${person.uid}: UF desconhecida`);
  if (person.familia_uid && !familyIds.has(person.familia_uid)) errors.push(`${person.uid}: familia desconhecida`);
  for (const id of person.origens_culturais || []) if (!originIds.has(id)) errors.push(`${person.uid}: origem desconhecida (${id})`);
  for (const id of person.comunidades || []) if (!communityIds.has(id)) errors.push(`${person.uid}: comunidade desconhecida (${id})`);
  for (const id of person.profissoes || []) if (!professionIds.has(id)) errors.push(`${person.uid}: profissao desconhecida (${id})`);
  for (const id of person.folclore || []) if (!folkloreIds.has(id)) errors.push(`${person.uid}: folclore desconhecido (${id})`);
}

const csvRows = parseCsv(fs.readFileSync(path.join(root, "data", "vila-pig-personagens.csv"), "utf8"));
const headers = csvRows[0] || [];
const csvData = csvRows.slice(1);
if (csvData.length !== people.length) errors.push(`CSV: ${csvData.length} linhas para ${people.length} personagens`);
for (const field of ["uid", "numero_legacy", "card_code", "classificacao_principal", "fase_vida", "status_pesquisa"]) {
  if (!headers.includes(field)) errors.push(`CSV: coluna ${field} ausente`);
}

const summary = {
  personagens: people.length,
  variacoes_criadas: people.reduce(
    (total, person) => total + Object.values(person.status_variacoes || {}).filter((status) => status === "criada").length,
    0
  ),
  geracoes: generations.length,
  fases_vida: phases.length,
  regioes: regions.length,
  ufs: states.length,
  familias_planejadas: familiesFile?.familias?.length || 0,
  profissoes_catalogadas: professionsFile?.profissoes?.length || 0,
  figuras_folclore: folkloreFile?.figuras?.length || 0,
  avisos: warnings.length,
  erros: errors.length,
};

console.log(JSON.stringify(summary, null, 2));
for (const warning of warnings) console.warn(`AVISO: ${warning}`);
if (errors.length) {
  for (const error of errors) console.error(`ERRO: ${error}`);
  process.exitCode = 1;
} else {
  console.log("Universo Pig validado com sucesso.");
}
