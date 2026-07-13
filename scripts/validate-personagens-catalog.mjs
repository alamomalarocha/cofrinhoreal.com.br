import fs from "node:fs";
import path from "node:path";
import { fromRoot, readJson, writeJson } from "./catalogo-lib.mjs";

const errors = [];
const warnings = [];
const checks = [];

function pass(id, details = "ok") {
  checks.push({ id, status: "ok", details });
}

function fail(id, details) {
  errors.push(`${id}: ${details}`);
  checks.push({ id, status: "erro", details });
}

function warn(id, details) {
  warnings.push(`${id}: ${details}`);
  checks.push({ id, status: "aviso", details });
}

function expect(id, condition, details, success = "ok") {
  if (condition) pass(id, success);
  else fail(id, details);
}

function countBy(items, field) {
  return items.reduce((result, item) => {
    const key = item?.[field] || "sem_valor";
    result[key] = (result[key] || 0) + 1;
    return result;
  }, {});
}

function duplicates(items, field) {
  const seen = new Set();
  const repeated = new Set();
  for (const item of items) {
    const value = item?.[field];
    if (value == null || value === "") continue;
    if (seen.has(value)) repeated.add(value);
    seen.add(value);
  }
  return [...repeated];
}

function requireUnique(items, field, label) {
  const missing = items.filter((item) => item?.[field] == null || item[field] === "");
  const repeated = duplicates(items, field);
  expect(
    `unique_${field}`,
    missing.length === 0 && repeated.length === 0,
    `${label}: ${missing.length} ausentes e ${repeated.length} duplicados`,
    `${items.length} valores unicos`
  );
}

function fileExists(relativePath) {
  return Boolean(relativePath) && fs.existsSync(fromRoot(relativePath));
}

function isPng(relativePath) {
  if (!fileExists(relativePath)) return false;
  const signature = fs.readFileSync(fromRoot(relativePath)).subarray(0, 8).toString("hex");
  return signature === "89504e470d0a1a0a";
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

function collectJsonFiles(directory) {
  if (!fs.existsSync(directory)) return [];
  return fs.readdirSync(directory, { withFileTypes: true }).flatMap((entry) => {
    const target = path.join(directory, entry.name);
    if (entry.isDirectory()) return collectJsonFiles(target);
    return entry.isFile() && entry.name.endsWith(".json") ? [target] : [];
  });
}

const people = readJson("data/vila-pig-personagens.json");
const families = readJson("data/familias-catalogo.json").familias || [];
const professionsFile = readJson("data/profissoes.json");
const professions = professionsFile.profissoes || [];
const folklore = readJson("data/folclore-brasileiro.json").figuras || [];
const communities = readJson("data/comunidades-tradicionais.json").comunidades || [];
const indigenous = readJson("data/povos-indigenas.json").povos || [];
const officialIndigenous = readJson("data/catalogo-fontes/ibge-povos-indigenas.json").povos || [];
const origins = readJson("data/origens-culturais.json").categorias || [];
const sources = readJson("data/fontes-catalogo.json").fontes || [];
const states = readJson("data/ufs-brasil.json").ufs || [];
const regions = readJson("data/regioes-brasil.json").regioes || [];
const sourceManifest = readJson("data/personagens/index.json");
const publicManifest = readJson("data/personagens-publicos/manifest.json");

expect("catalog_minimum", people.length >= 2500, `esperado >= 2500, encontrado ${people.length}`, `${people.length} personagens`);
requireUnique(people, "numero", "personagens");
requireUnique(people, "numero_legacy", "personagens");
requireUnique(people, "uid", "personagens");
requireUnique(people, "card_code", "personagens");
requireUnique(people, "slug", "personagens");
requireUnique(people, "asset_futuro", "personagens");

const numericNumbers = people.map((person) => Number(person.numero));
expect(
  "continuous_numbering",
  numericNumbers.every((number, index) => number === index + 1),
  "a numeracao compilada nao e continua a partir de 001",
  `001 a ${String(people.length).padStart(3, "0")}`
);
expect(
  "legacy_numbering",
  people.every((person) => person.numero === person.numero_legacy),
  "numero_legacy diverge do numero atual"
);

const literalUndefined = people.filter((person) => JSON.stringify(person).includes("undefined"));
expect("no_literal_undefined", literalUndefined.length === 0, `${literalUndefined.length} registros contem o texto undefined`);

const requiredFields = [
  "numero", "numero_legacy", "uid", "card_code", "nome", "slug", "tipo_personagem",
  "categoria", "classificacao_principal", "descricao_curta", "historia", "visual_brief",
  "status_pesquisa", "status_revisao_cultural", "status_imagem", "asset_futuro",
];
const incomplete = people.filter((person) => requiredFields.some((field) => person[field] == null || person[field] === ""));
expect("required_fields", incomplete.length === 0, `${incomplete.length} personagens sem campos minimos`);

const unjustifiedNames = people.filter((person) => {
  if (person.nome_completo) return false;
  if (Number(person.numero) <= 202) return false;
  return !String(person.nome_status || "").startsWith("aguardando_") &&
    person.nome_status !== "nome_da_referencia_confirmado_personagem_pendente";
});
expect("names_or_justification", unjustifiedNames.length === 0, `${unjustifiedNames.length} registros sem nome completo ou justificativa`);

const tooManyMarkers = people.filter((person) => (person.marcadores_visuais || []).length > 2);
expect("visual_markers", tooManyMarkers.length === 0, `${tooManyMarkers.length} registros usam mais de dois marcadores`);

const statuses = new Set(["criada", "pendente"]);
const invalidImageStatuses = people.filter((person) => !statuses.has(person.status_imagem));
expect("image_status", invalidImageStatuses.length === 0, `${invalidImageStatuses.length} status de imagem invalidos`);
const newlyCreated = people.filter((person) => Number(person.numero) > 202 && person.status_imagem === "criada");
expect("no_generated_images", newlyCreated.length === 0, `${newlyCreated.length} novos personagens marcados como imagem criada`);

for (const number of ["001", "201"]) {
  const person = people.find((item) => item.numero === number);
  expect(`protected_${number}`, Boolean(person), `personagem protegido ${number} ausente`);
  if (person) expect(`protected_${number}_png`, isPng(person.asset_futuro), `PNG protegido ausente ou invalido: ${person.asset_futuro}`);
}

const expectedAvatarStatuses = {
  "002": { padrao: "criada", azul: "criada", rosa: "criada", arco_iris: "criada" },
  "003": { padrao: "criada", azul: "criada", rosa: "criada", arco_iris: "criada" },
  "004": { padrao: "criada", azul: "criada", rosa: "criada", arco_iris: "criada" },
  "005": { padrao: "criada", azul: "criada", rosa: "criada", arco_iris: "criada" },
  "006": { padrao: "criada", azul: "criada", rosa: "criada", arco_iris: "criada" },
  "007": { padrao: "criada", azul: "criada", rosa: "criada", arco_iris: "criada" },
  "008": { padrao: "criada", azul: "criada", rosa: "criada", arco_iris: "criada" },
  "009": { padrao: "criada", azul: "criada", rosa: "criada", arco_iris: "criada" },
  "010": { padrao: "criada", azul: "criada", rosa: "criada", arco_iris: "criada" },
  "011": { padrao: "criada", azul: "criada", rosa: "criada", arco_iris: "pendente" },
};
for (const [number, expected] of Object.entries(expectedAvatarStatuses)) {
  const avatar = people.find((person) => person.numero === number);
  if (!avatar) {
    fail(`avatar_${number}`, "avatar ausente");
    continue;
  }
  for (const [style, status] of Object.entries(expected)) {
    const actual = avatar.status_variacoes?.[style];
    expect(`avatar_${number}_${style}`, actual === status, `esperado ${status}, encontrado ${actual}`);
    if (status === "criada") {
      const asset = avatar.assets_variacoes_futuras?.[style];
      expect(`avatar_${number}_${style}_png`, isPng(asset), `PNG ausente ou invalido: ${asset}`);
    }
  }
}

expect("regions_catalog", regions.length === 5, `esperado 5 regioes, encontrado ${regions.length}`);
expect("states_catalog", states.length === 27, `esperado 27 UFs, encontrado ${states.length}`);
const regionalPeople = people.filter((person) => person.tipo_personagem === "personagem_regional");
const regionCounts = countBy(regionalPeople, "regiao");
const stateCounts = countBy(regionalPeople, "uf");
for (const region of regions) {
  expect(`region_${region.slug}`, (regionCounts[region.slug] || 0) >= 250, `${region.slug} tem ${regionCounts[region.slug] || 0}, minimo 250`);
}
for (const state of states) {
  expect(`state_${state.sigla}`, (stateCounts[state.sigla] || 0) >= 25, `${state.sigla} tem ${stateCounts[state.sigla] || 0}, minimo 25`);
}

expect("families_minimum", families.length >= 750, `esperado >= 750, encontrado ${families.length}`, `${families.length} nucleos`);
requireUnique(families, "uid", "familias");
const familyIds = new Set(families.map((family) => family.uid));
const invalidFamilyRefs = people.filter((person) => Number(person.numero) > 201 && !familyIds.has(person.familia_uid));
expect("family_references", invalidFamilyRefs.length === 0, `${invalidFamilyRefs.length} referencias de familia invalidas`);
const peopleIds = new Set(people.map((person) => person.uid));
const invalidFamilyMembers = families.flatMap((family) => (family.membros || [])
  .filter((member) => !peopleIds.has(member))
  .map((member) => `${family.uid}:${member}`));
expect("family_members", invalidFamilyMembers.length === 0, `${invalidFamilyMembers.length} membros de familia inexistentes`);

expect("indigenous_official_count", officialIndigenous.length === 391, `fonte oficial possui ${officialIndigenous.length}, esperado 391`);
expect("indigenous_catalog_count", indigenous.length === 391, `catalogo possui ${indigenous.length}, esperado 391`);
requireUnique(indigenous, "id", "povos indigenas");
requireUnique(indigenous, "codigo_ibge", "povos indigenas");
requireUnique(indigenous, "nome_oficial", "povos indigenas");
const officialByCode = new Map(officialIndigenous.map((item) => [item.codigo_ibge, item.nome_oficial]));
const indigenousMismatches = indigenous.filter((item) => officialByCode.get(item.codigo_ibge) !== item.nome_oficial);
expect("indigenous_official_link", indigenousMismatches.length === 0, `${indigenousMismatches.length} povos divergem da fonte oficial`);
const indigenousPeople = people.filter((person) => person.categoria === "povos_indigenas");
expect("indigenous_profiles", indigenousPeople.length === 391, `${indigenousPeople.length} perfis para 391 povos`);
requireUnique(indigenousPeople, "povo_indigena_id", "perfis indigenas");
const indigenousIds = new Set(indigenous.map((item) => item.id));
const unsafeIndigenous = indigenousPeople.filter((person) =>
  !indigenousIds.has(person.povo_indigena_id) || person.publicavel !== false ||
  person.status_revisao_cultural !== "requer_especialista" || person.status_imagem !== "pendente"
);
expect("indigenous_safety", unsafeIndigenous.length === 0, `${unsafeIndigenous.length} perfis indigenas fora das regras de seguranca`);

expect("traditional_communities", communities.length >= 28, `esperado >= 28, encontrado ${communities.length}`);
requireUnique(communities, "id", "comunidades tradicionais");
const communityIds = new Set(communities.map((community) => community.id));
const communityPeople = people.filter((person) => person.categoria === "comunidades_tradicionais");
expect("traditional_profiles", communityPeople.length >= 28, `esperado >= 28, encontrado ${communityPeople.length}`);
const unsafeCommunityPeople = communityPeople.filter((person) =>
  person.publicavel !== false || person.status_revisao_cultural !== "requer_especialista" ||
  (person.comunidades || []).some((id) => !communityIds.has(id))
);
expect("traditional_safety", unsafeCommunityPeople.length === 0, `${unsafeCommunityPeople.length} perfis tradicionais fora das regras de seguranca`);

const migrationPeople = people.filter((person) => person.categoria === "migracoes");
const mixedPeople = people.filter((person) => person.categoria === "familias_mistas");
expect("migration_slots", migrationPeople.length >= 30, `esperado >= 30, encontrado ${migrationPeople.length}`);
expect("mixed_family_slots", mixedPeople.length >= 30, `esperado >= 30, encontrado ${mixedPeople.length}`);
expect("migration_safety", migrationPeople.every((person) => person.publicavel === false), "ha perfil migratorio pendente marcado como publico");
expect("mixed_safety", mixedPeople.every((person) => person.publicavel === false), "ha familia mista pendente marcada como publica");

requireUnique(professions, "id_estavel", "profissoes");
expect("cbo_import", professionsFile.total_cbo_importado >= 2694, `CBO importada: ${professionsFile.total_cbo_importado}`);
const professionIds = new Set(professions.map((profession) => profession.id_estavel));
const assignedProfessionIds = new Set(people.flatMap((person) => person.profissoes || []));
const invalidProfessionRefs = [...assignedProfessionIds].filter((id) => !professionIds.has(id));
expect("profession_references", invalidProfessionRefs.length === 0, `${invalidProfessionRefs.length} profissoes referenciadas nao existem`);
expect("profession_coverage", assignedProfessionIds.size >= 600, `esperado >= 600, encontrado ${assignedProfessionIds.size}`, `${assignedProfessionIds.size} ocupacoes atribuidas`);

expect("folklore_slots", folklore.length >= 100, `esperado >= 100, encontrado ${folklore.length}`);
requireUnique(folklore, "uid", "folclore");
const folklorePeople = people.filter((person) => person.categoria === "folclore");
expect("folklore_profiles", folklorePeople.length >= 100, `esperado >= 100, encontrado ${folklorePeople.length}`);
const researchedFolklore = folklore.filter((item) => item.status_pesquisa === "confirmado");
if (researchedFolklore.length === 0) warn("folklore_research", "100 slots existem, mas nenhum esta marcado como pesquisa concluida");
expect("folklore_safety", folklorePeople.every((person) => person.publicavel === false && person.status_imagem === "pendente"), "ha folclore pendente publico ou com imagem criada");

const originIds = new Set(origins.map((origin) => origin.id));
const sourceIds = new Set(sources.map((source) => source.id));
const invalidOriginRefs = people.flatMap((person) => (person.origens_culturais || [])
  .filter((id) => !originIds.has(id))
  .map((id) => `${person.uid}:${id}`));
const invalidSourceRefs = people.flatMap((person) => (person.fontes || [])
  .filter((id) => !sourceIds.has(id))
  .map((id) => `${person.uid}:${id}`));
expect("origin_references", invalidOriginRefs.length === 0, `${invalidOriginRefs.length} origens culturais invalidas`);
expect("source_references", invalidSourceRefs.length === 0, `${invalidSourceRefs.length} fontes invalidas`);

const sensitiveCategories = new Set(["povos_indigenas", "comunidades_tradicionais", "folclore"]);
const publicSensitive = people.filter((person) => sensitiveCategories.has(person.categoria) && person.publicavel !== false);
expect("sensitive_not_public", publicSensitive.length === 0, `${publicSensitive.length} registros sensiveis estao publicos`);

const sourceFiles = collectJsonFiles(fromRoot("data/personagens"))
  .filter((file) => path.basename(file) !== "index.json");
let sourceTotal = 0;
let oversizedSources = 0;
for (const file of sourceFiles) {
  const content = JSON.parse(fs.readFileSync(file, "utf8"));
    const records = Array.isArray(content)
      ? content
      : content.registros || content.personagens || [];
  sourceTotal += records.length;
  if (records.length > 100) oversizedSources += 1;
}
expect("source_batch_size", oversizedSources === 0, `${oversizedSources} fontes excedem 100 registros`);
expect("source_manifest_files", sourceManifest.fontes.length === sourceFiles.length, `manifesto lista ${sourceManifest.fontes.length}, disco possui ${sourceFiles.length}`);
expect("source_manifest_total", sourceManifest.total_esperado === people.length && sourceTotal === people.length, `manifesto ${sourceManifest.total_esperado}, fontes ${sourceTotal}, compilado ${people.length}`);

const publicPeople = people.filter((person) => person.publicavel === true);
let publicTotal = 0;
let oversizedPublicBatches = 0;
let invalidPublicRecords = 0;
for (const batch of publicManifest.lotes || []) {
  const content = readJson(batch.arquivo);
    const records = Array.isArray(content)
      ? content
      : content.registros || content.personagens || [];
  publicTotal += records.length;
  if (records.length > 100) oversizedPublicBatches += 1;
  invalidPublicRecords += records.filter((person) => person.publicavel !== true).length;
}
expect("public_batch_size", oversizedPublicBatches === 0, `${oversizedPublicBatches} lotes publicos excedem 100`);
expect("public_manifest_total", publicManifest.total_publicavel === publicPeople.length && publicTotal === publicPeople.length, `manifesto ${publicManifest.total_publicavel}, lotes ${publicTotal}, esperado ${publicPeople.length}`);
expect("public_batch_content", invalidPublicRecords === 0, `${invalidPublicRecords} registros nao publicaveis em lotes publicos`);

const csvRows = parseCsv(fs.readFileSync(fromRoot("data/vila-pig-personagens.csv"), "utf8"));
expect("csv_count", csvRows.length - 1 === people.length, `CSV tem ${csvRows.length - 1} linhas, JSON tem ${people.length}`);

const metrics = {
  total_personagens: people.length,
  total_publicavel: publicPeople.length,
  total_nao_publicavel: people.length - publicPeople.length,
  familias: families.length,
  regioes: regionCounts,
  ufs: stateCounts,
  povos_indigenas: indigenous.length,
  perfis_indigenas: indigenousPeople.length,
  comunidades_tradicionais: communities.length,
  perfis_comunidades_tradicionais: communityPeople.length,
  migracoes: migrationPeople.length,
  familias_mistas: mixedPeople.length,
  profissoes_catalogadas: professions.length,
  profissoes_atribuidas_distintas: assignedProfessionIds.size,
  figuras_folcloricas: folklore.length,
  folclore_pesquisa_concluida: researchedFolklore.length,
  lotes_fonte: sourceFiles.length,
  lotes_publicos: publicManifest.lotes?.length || 0,
  imagens_principais_criadas: people.filter((person) => person.status_imagem === "criada").length,
  variacoes_criadas: people.reduce((total, person) => total + Object.values(person.status_variacoes || {}).filter((status) => status === "criada").length, 0),
};

const report = {
  schema_version: "1.0.0",
  gerado_em: "2026-07-12",
  comando: "node scripts/validate-personagens-catalog.mjs",
  resultado: errors.length ? "erro" : "aprovado",
  metricas: metrics,
  verificacoes: checks,
  avisos: warnings,
  erros: errors,
};
writeJson("data/relatorio-validacao-catalogo.json", report);

console.log(JSON.stringify({ resultado: report.resultado, ...metrics, avisos: warnings.length, erros: errors.length }, null, 2));
for (const message of warnings) console.warn(`AVISO: ${message}`);
if (errors.length) {
  for (const message of errors) console.error(`ERRO: ${message}`);
  process.exitCode = 1;
} else {
  console.log("Catalogo completo validado com sucesso.");
}
