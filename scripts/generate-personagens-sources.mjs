import path from "node:path";
import {
  formatPersonNumber,
  fromRoot,
  readJson,
  slugify,
  sourceRecord,
  splitIntoBatches,
  writeJson,
} from "./catalogo-lib.mjs";

const CATALOG_DATE = "2026-07-12";
const CATALOG_YEAR = 2026;

const PUBLIC_TEXT_REPLACEMENTS = new Map([
  ["acentuacao", "acentuação"],
  ["aplicavel", "aplicável"],
  ["apos", "após"],
  ["arco-iris", "arco-íris"],
  ["autodenominacao", "autodenominação"],
  ["bebe", "bebê"],
  ["bebes", "bebês"],
  ["catalogo", "catálogo"],
  ["classificacao", "classificação"],
  ["codigo", "código"],
  ["colecao", "coleção"],
  ["comercio", "comércio"],
  ["comunitaria", "comunitária"],
  ["comunitarias", "comunitárias"],
  ["comunitario", "comunitário"],
  ["comunitarios", "comunitários"],
  ["concluida", "concluída"],
  ["construcao", "construção"],
  ["conteudo", "conteúdo"],
  ["cooperacao", "cooperação"],
  ["crianca", "criança"],
  ["criancas", "crianças"],
  ["demografico", "demográfico"],
  ["educacao", "educação"],
  ["especifica", "específica"],
  ["especificas", "específicas"],
  ["expressao", "expressão"],
  ["familia", "família"],
  ["familias", "famílias"],
  ["ficticia", "fictícia"],
  ["ficticio", "fictício"],
  ["ficticias", "fictícias"],
  ["ficticios", "fictícios"],
  ["folclorica", "folclórica"],
  ["folcloricas", "folclóricas"],
  ["gamificacao", "gamificação"],
  ["generico", "genérico"],
  ["generica", "genérica"],
  ["geracao", "geração"],
  ["historias", "histórias"],
  ["inferencias", "inferências"],
  ["indigenas", "indígenas"],
  ["indio", "índio"],
  ["linguas", "línguas"],
  ["logistica", "logística"],
  ["mantem", "mantém"],
  ["migracao", "migração"],
  ["migracoes", "migrações"],
  ["migratoria", "migratória"],
  ["migratorias", "migratórias"],
  ["migratorio", "migratório"],
  ["ministerio", "ministério"],
  ["municipio", "município"],
  ["municipios", "municípios"],
  ["nao", "não"],
  ["nucleo", "núcleo"],
  ["nucleos", "núcleos"],
  ["ocupacao", "ocupação"],
  ["ocupacoes", "ocupações"],
  ["orientacao", "orientação"],
  ["pagina", "página"],
  ["padrao", "padrão"],
  ["patrimonio", "patrimônio"],
  ["pre-adolescente", "pré-adolescente"],
  ["pressao", "pressão"],
  ["pratica", "prática"],
  ["praticas", "práticas"],
  ["profissao", "profissão"],
  ["profissoes", "profissões"],
  ["prototipo", "protótipo"],
  ["publica", "pública"],
  ["publicas", "públicas"],
  ["publico", "público"],
  ["publicos", "públicos"],
  ["referencia", "referência"],
  ["referencias", "referências"],
  ["regiao", "região"],
  ["regioes", "regiões"],
  ["relacao", "relação"],
  ["relacoes", "relações"],
  ["revisao", "revisão"],
  ["robotica", "robótica"],
  ["sao", "são"],
  ["seguranca", "segurança"],
  ["senior", "sênior"],
  ["simbolo", "símbolo"],
  ["sensiveis", "sensíveis"],
  ["sensivel", "sensível"],
  ["suposicao", "suposição"],
  ["tecnica", "técnica"],
  ["tecnicas", "técnicas"],
  ["tecnico", "técnico"],
  ["tecnicos", "técnicos"],
  ["territorio", "território"],
  ["territorios", "territórios"],
  ["usuario", "usuário"],
  ["usuarios", "usuários"],
  ["variacao", "variação"],
  ["variacoes", "variações"],
  ["vinculo", "vínculo"],
  ["vinculos", "vínculos"],
  ["vizinhanca", "vizinhança"],
]);

function preserveReplacementCase(source, replacement) {
  if (source === source.toUpperCase()) return replacement.toUpperCase();
  if (source[0] === source[0].toUpperCase()) {
    return replacement[0].toUpperCase() + replacement.slice(1);
  }
  return replacement;
}

function normalizePublicText(value) {
  if (typeof value !== "string" || !value) return value;
  let normalized = value;
  const entries = [...PUBLIC_TEXT_REPLACEMENTS.entries()].sort((a, b) => b[0].length - a[0].length);
  for (const [source, replacement] of entries) {
    const escaped = source.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
    const regex = new RegExp(`(?<![\\p{L}\\p{N}_])${escaped}(?![\\p{L}\\p{N}_])`, "giu");
    normalized = normalized.replace(regex, (match) => preserveReplacementCase(match, replacement));
  }
  return normalized;
}

function normalizePublicRecord(record) {
  const normalized = { ...record };
  const fields = [
    "nome_exibicao",
    "papel_na_vila",
    "papel",
    "descricao_curta",
    "historia",
    "objetivo",
    "meta_financeira_educativa",
    "papel_educativo",
    "visual_brief",
    "ideia_visual",
  ];
  for (const field of fields) {
    if (typeof normalized[field] === "string") normalized[field] = normalizePublicText(normalized[field]);
  }
  normalized.nome_exibicao = normalizePublicText(normalized.nome_exibicao || normalized.nome || "");
  if (Array.isArray(normalized.marcadores_visuais)) {
    normalized.marcadores_visuais = normalized.marcadores_visuais.map(normalizePublicText);
  }
  if (normalized.profissao_atual?.nome_exibicao) {
    normalized.profissao_atual = {
      ...normalized.profissao_atual,
      nome_exibicao: normalizePublicText(normalized.profissao_atual.nome_exibicao),
    };
  }
  return normalized;
}

function normalizePublicMetadata(record, fields) {
  const normalized = { ...record };
  for (const field of fields) {
    if (typeof normalized[field] === "string") normalized[field] = normalizePublicText(normalized[field]);
  }
  return normalized;
}

const SOURCE_IDS = {
  ibgeNames: "ibge-nomes-brasil",
  ibgeLocalities: "ibge-localidades",
  ibgeIndigenous: "ibge-censo-2022-povos-indigenas",
  mteCbo: "mte-cbo-2002",
  mdaCommunities: "mda-povos-comunidades-tradicionais",
  iphan: "iphan-patrimonio-imaterial",
  immigrationMuseum: "museu-imigracao-acervo",
};

const SOURCES = [
  {
    id: SOURCE_IDS.ibgeNames,
    ...sourceRecord({
      title: "Nomes no Brasil",
      institution: "IBGE",
      url: "https://censo2022.ibge.gov.br/nomes/",
      subject: "Referência editorial para nomes brasileiros",
    }),
  },
  {
    id: SOURCE_IDS.ibgeLocalities,
    ...sourceRecord({
      title: "API de Localidades",
      institution: "IBGE",
      url: "https://servicodados.ibge.gov.br/api/docs/localidades",
      subject: "Regiões, UFs e municípios",
    }),
  },
  {
    id: SOURCE_IDS.ibgeIndigenous,
    ...sourceRecord({
      title: "Censo Demográfico 2022 - Etnias e línguas indígenas",
      institution: "IBGE",
      url: "https://ftp.ibge.gov.br/Censos/Censo_Demografico_2022/Etnias_e_Linguas_Indigenas_principais_caracteristicas_sociodemograficas_Resultados_do_universo/Apendices/xlsx/",
      subject: "Lista oficial de povos, etnias ou grupos indígenas",
    }),
  },
  {
    id: SOURCE_IDS.mteCbo,
    ...sourceRecord({
      title: "Classificação Brasileira de Ocupações - CBO 2002",
      institution: "Ministério do Trabalho e Emprego",
      url: "https://www.gov.br/trabalho-e-emprego/pt-br/assuntos/cbo/servicos/downloads/cbo2002-ocupacao.csv",
      subject: "Ocupações oficiais",
    }),
  },
  {
    id: SOURCE_IDS.mdaCommunities,
    ...sourceRecord({
      title: "Povos e Comunidades Tradicionais",
      institution: "Ministério do Desenvolvimento Agrário e Agricultura Familiar",
      url: "https://www.gov.br/mda/pt-br/assuntos/povos-e-comunidades-tradicionais",
      subject: "Segmentos de povos e comunidades tradicionais",
    }),
  },
  {
    id: SOURCE_IDS.iphan,
    ...sourceRecord({
      title: "Patrimônio Cultural Imaterial",
      institution: "IPHAN",
      url: "https://www.gov.br/iphan/pt-br/patrimonio-cultural/patrimonio-imaterial",
      subject: "Referência para pesquisa cultural e folclore",
    }),
  },
  {
    id: SOURCE_IDS.immigrationMuseum,
    ...sourceRecord({
      title: "Acervo e pesquisa",
      institution: "Museu da Imigração do Estado de São Paulo",
      url: "https://museudaimigracao.org.br/acervo-e-pesquisa/pesquisa",
      subject: "Trilhas de pesquisa sobre migrações",
    }),
  },
];

const REGION_CODES = {
  norte: "NO",
  nordeste: "NE",
  "centro-oeste": "CO",
  sudeste: "SE",
  sul: "SU",
};

const REGION_NAMES = {
  norte: "Norte",
  nordeste: "Nordeste",
  "centro-oeste": "Centro-Oeste",
  sudeste: "Sudeste",
  sul: "Sul",
};

const CAPITALS = {
  AC: "Rio Branco", AL: "Maceió", AP: "Macapá", AM: "Manaus", BA: "Salvador",
  CE: "Fortaleza", DF: "Brasília", ES: "Vitória", GO: "Goiânia", MA: "São Luís",
  MT: "Cuiabá", MS: "Campo Grande", MG: "Belo Horizonte", PA: "Belém", PB: "João Pessoa",
  PR: "Curitiba", PE: "Recife", PI: "Teresina", RJ: "Rio de Janeiro", RN: "Natal",
  RS: "Porto Alegre", RO: "Porto Velho", RR: "Boa Vista", SC: "Florianópolis",
  SP: "São Paulo", SE: "Aracaju", TO: "Palmas",
};

const HOUSEHOLD_COUNTS = {
  RO: 16, AC: 14, AM: 24, RR: 12, PA: 32, AP: 12, TO: 20,
  MA: 22, PI: 18, CE: 26, RN: 17, PB: 18, PE: 24, AL: 17, SE: 16, BA: 32,
  MS: 20, MT: 22, GO: 28, DF: 20,
  MG: 60, ES: 25, RJ: 60, SP: 105,
  PR: 55, SC: 42, RS: 53,
};

const FEMININE_NAMES = [
  "Ana", "Maria", "Helena", "Clara", "Beatriz", "Livia", "Sofia", "Laura", "Camila", "Juliana",
  "Renata", "Patricia", "Daniela", "Fernanda", "Mariana", "Luciana", "Aline", "Bianca", "Carolina", "Isabela",
  "Joana", "Cecilia", "Teresa", "Rita", "Marta", "Elisa", "Lorena", "Nadia", "Iara", "Noemi",
  "Fatima", "Tainara", "Samara", "Talita", "Monica", "Simone", "Adriana", "Gabriela", "Vitoria", "Alice",
  "Luiza", "Raquel", "Rosa", "Eva", "Mirela", "Debora", "Vanessa", "Eliane", "Cristina", "Celina",
];

const MASCULINE_NAMES = [
  "Joao", "Jose", "Antonio", "Francisco", "Carlos", "Paulo", "Pedro", "Lucas", "Mateus", "Rafael",
  "Gabriel", "Daniel", "Bruno", "Andre", "Marcos", "Felipe", "Gustavo", "Diego", "Caio", "Rodrigo",
  "Eduardo", "Renato", "Leandro", "Thiago", "Henrique", "Samuel", "Miguel", "Davi", "Vitor", "Vinicius",
  "Raimundo", "Severino", "Bento", "Otavio", "Murilo", "Jorge", "Fabio", "Ricardo", "Alexandre", "Roberto",
  "Marcelo", "Tiago", "Nicolas", "Heitor", "Cesar", "Nelson", "Wilson", "Elias", "Gilberto", "Mauricio",
];

const UNIVERSAL_NAMES = [
  "Ariel", "Cris", "Dani", "Alex", "Niki", "Luca", "Noa", "Sol", "Celi", "Ravi",
  "Kim", "Bia", "Jaci", "Toni", "Nilo", "Mika", "Cau", "Lumi", "Ari", "Eli",
];

const MIDDLE_NAMES = [
  "Aparecida", "Cristina", "Regina", "Conceicao", "de Fatima", "das Gracas", "Eduarda", "Vitoria",
  "Augusto", "Henrique", "Roberto", "Carlos", "Miguel", "Gabriel", "Luiz", "Rafael",
  "Celia", "Marina", "Teresa", "Lucia", "Benedita", "Valentina", "Catarina", "Isabel",
];

const SURNAMES = [
  "Silva", "Santos", "Oliveira", "Souza", "Rodrigues", "Ferreira", "Alves", "Pereira", "Lima", "Gomes",
  "Costa", "Ribeiro", "Martins", "Carvalho", "Almeida", "Lopes", "Soares", "Fernandes", "Vieira", "Barbosa",
  "Rocha", "Dias", "Nascimento", "Andrade", "Moreira", "Nunes", "Marques", "Machado", "Mendes", "Freitas",
  "Cardoso", "Ramos", "Goncalves", "Santana", "Teixeira", "Moura", "Correia", "Castro", "Melo", "Araujo",
  "Campos", "Cavalcante", "Batista", "Borges", "Duarte", "Reis", "Miranda", "Pinto", "Monteiro", "Medeiros",
  "Farias", "Tavares", "Coelho", "Cunha", "Moraes", "Sales", "Queiroz", "Xavier", "Aguiar", "Bezerra",
  "Amaral", "Macedo", "Paiva", "Siqueira", "Vasconcelos", "Dantas", "Viana", "Leite", "Cordeiro", "Maia",
];

const HOUSEHOLD_PATTERNS = [
  { label: "duas pessoas cuidadoras e uma crianca", ages: [42, 39, 11], roles: ["responsavel", "responsavel", "filha_ou_filho"] },
  { label: "uma pessoa cuidadora e duas criancas", ages: [37, 8, 14], roles: ["responsavel", "filha_ou_filho", "filha_ou_filho"] },
  { label: "nucleo intergeracional", ages: [68, 34, 5], roles: ["avo_ou_avo", "filha_ou_filho_adulto", "neta_ou_neto"] },
  { label: "pessoa madura e jovens adultos", ages: [54, 26, 22], roles: ["responsavel", "filha_ou_filho_adulto", "filha_ou_filho_adulto"] },
  { label: "amigos que compartilham moradia", ages: [24, 23, 21], roles: ["amiga_ou_amigo", "amiga_ou_amigo", "amiga_ou_amigo"] },
  { label: "casal maduro e jovem", ages: [62, 58, 18], roles: ["companheira_ou_companheiro", "companheira_ou_companheiro", "filha_ou_filho"] },
  { label: "duas pessoas cuidadoras e bebe", ages: [31, 29, 2], roles: ["responsavel", "responsavel", "filha_ou_filho"] },
  { label: "duas pessoas cuidadoras e adolescente", ages: [47, 44, 16], roles: ["responsavel", "responsavel", "filha_ou_filho"] },
];

const currentCatalog = readJson("data/vila-pig-personagens.json");
const ufs = readJson("data/ufs-brasil.json").ufs;
const municipalities = readJson("data/catalogo-fontes/ibge-municipios.json").municipios;
const occupations = readJson("data/catalogo-fontes/mte-cbo-ocupacoes.json").ocupacoes;
const indigenousPeoples = readJson("data/catalogo-fontes/ibge-povos-indigenas.json").povos;
const communitiesCatalog = readJson("data/comunidades-tradicionais.json").comunidades;
const originsCatalog = readJson("data/origens-culturais.json").categorias;
const phases = readJson("data/fases-vida.json").fases;
const generations = readJson("data/geracoes.json").geracoes;
const existingFolklore = readJson("data/folclore-brasileiro.json");
const starterProfessions = readJson("data/profissoes.json");

const municipalityByUf = new Map();
for (const municipality of municipalities) {
  const list = municipalityByUf.get(municipality.uf) ?? [];
  list.push(municipality);
  municipalityByUf.set(municipality.uf, list);
}

const sourceManifest = [];
const allNewCharacters = [];
const families = [];
const usedNames = new Set();
const preservedMaxNumber = Math.max(
  ...currentCatalog
    .filter((item) => Number(item.numero) <= 201)
    .map((item) => Number(item.numero) || 0),
  202,
);
let nextNumber = preservedMaxNumber + 1;
let occupationCursor = 0;

function phaseForAge(age) {
  return phases.find((phase) => age >= phase.idade_minima && (phase.idade_maxima == null || age <= phase.idade_maxima)) ?? phases.at(-1);
}

function generationForAge(age) {
  const birthYear = CATALOG_YEAR - age;
  return generations.find((generation) => birthYear >= generation.ano_inicio && birthYear <= generation.ano_fim) ?? null;
}

function nextFormattedNumber() {
  const value = formatPersonNumber(nextNumber);
  nextNumber += 1;
  return value;
}

function presentationFor(index) {
  const position = index % 100;
  if (position < 49) return "feminina";
  if (position < 97) return "masculina";
  return "inclusiva";
}

function uniqueFullName(index, familyIndex, memberIndex, surnameA, surnameB, presentation) {
  const pool = presentation === "feminina"
    ? FEMININE_NAMES
    : presentation === "masculina"
      ? MASCULINE_NAMES
      : UNIVERSAL_NAMES;
  const first = pool[(index * 7 + memberIndex * 11) % pool.length];
  const middle = MIDDLE_NAMES[(familyIndex * 5 + memberIndex * 3) % MIDDLE_NAMES.length];
  let fullName = `${first} ${middle} ${surnameA} ${surnameB}`;
  let offset = 1;
  while (usedNames.has(fullName)) {
    const extra = SURNAMES[(familyIndex + memberIndex + offset * 13) % SURNAMES.length];
    fullName = `${first} ${middle} ${surnameA} ${surnameB} ${extra}`;
    offset += 1;
  }
  usedNames.add(fullName);
  return { first, fullName };
}

function nextOccupation() {
  const occupation = occupations[occupationCursor % 700];
  occupationCursor += 1;
  return {
    id: `CBO-${occupation.codigo}`,
    codigo_cbo: occupation.codigo,
    titulo: occupationDisplayName(occupation.titulo),
  };
}

function occupationDisplayName(title) {
  return normalizePublicText(title);
}

function normalizeExisting(record) {
  record = normalizePublicRecord(record);
  const number = formatPersonNumber(Number(record.numero));
  return {
    ...record,
    numero: number,
    numero_legacy: record.numero_legacy ?? number,
    uid: record.uid || `LEG-${number}`,
    card_code: record.card_code || `CR-${number}-LEG-2026`,
    tipo_personagem: record.tipo_personagem || record.tipo || "personagem_existente",
    classificacao_principal: record.classificacao_principal || record.categoria || "universo_pig",
    familia_id: record.familia_id || record.familia_uid || null,
    household_id: record.household_id || record.familia_uid || null,
    relacoes: Array.isArray(record.relacoes) ? record.relacoes : [],
    publicavel: record.publicavel !== false,
    status_pesquisa: record.status_pesquisa || "confirmado_projeto",
    status_revisao_cultural: record.status_revisao_cultural || "nao_aplicavel",
    visual_brief: normalizePublicText(record.visual_brief || record.padrao_visual_avatar || record.descricao_curta || "Personagem existente da Vila Pig."),
    marcadores_visuais: Array.isArray(record.marcadores_visuais) ? record.marcadores_visuais.slice(0, 2) : [],
    fontes: Array.isArray(record.fontes) ? record.fontes : [],
  };
}

function createCharacter({
  number,
  uid,
  cardCode,
  name,
  fullName = name,
  slug,
  type,
  category,
  subcategory,
  familyId,
  region = "",
  uf = "",
  municipality = "",
  environment = "",
  age = null,
  role,
  description,
  story,
  visualBrief,
  visualMarkers = [],
  profession = null,
  professionIds = [],
  culturalOrigins = [],
  communities = [],
  indigenousPeopleId = null,
  folklore = [],
  researchStatus = "confirmado",
  culturalReview = "aprovado",
  publishable = true,
  sources = [],
  nameStatus = "confirmado",
  editorialPresentation = "nao_aplicavel",
}) {
  const phase = age == null ? null : phaseForAge(age);
  const generation = age == null ? null : generationForAge(age);
  return {
    schema_version_personagem: "2.0.0",
    numero: number,
    numero_legacy: number,
    uid,
    card_code: cardCode,
    nome: name,
    nome_exibicao: normalizePublicText(name),
    nome_completo: fullName,
    nome_status: nameStatus,
    apelido: "",
    aliases: [],
    slug,
    tipo: type,
    tipo_personagem: type,
    categoria: category,
    classificacao_principal: category,
    subcategoria: subcategory,
    familia_id: familyId,
    familia_uid: familyId,
    household_id: familyId,
    relacoes: [],
    regiao: region,
    uf,
    municipio_ou_territorio: municipality,
    ambiente: environment,
    bioma: "",
    origens_culturais: culturalOrigins,
    paises_relacionados: [],
    povo_indigena_id: indigenousPeopleId,
    comunidades_tradicionais: communities,
    comunidades: communities,
    idiomas: ["pt-BR"],
    geracao_id: generation?.id_estavel ?? "",
    geracao: generation?.id_estavel ?? "",
    geracao_calculada_pelo_usuario: false,
    fase_vida: phase?.id ?? "",
    faixa_etaria: phase?.nome_exibicao ?? "",
    idade_aproximada: age,
    profissao_atual: profession,
    profissoes: professionIds,
    profissoes_anteriores: [],
    profissao_futura_desejada: null,
    situacao_profissional: profession ? "ocupacao_atual_ficcional" : age != null && age < 18 ? "estudante_ou_infancia" : "a_pesquisar",
    papel_na_vila: normalizePublicText(role),
    papel: normalizePublicText(role),
    descricao_curta: normalizePublicText(description),
    historia: normalizePublicText(story),
    personalidade: ["acolhedor", "curioso"],
    objetivo: "Participar da vida comunitária com respeito e planejamento.",
    meta_financeira_educativa: "Organizar pequenas metas de forma consciente e sem pressão de consumo.",
    papel_educativo: "Mostrar escolhas cotidianas e cooperação.",
    comidas_relacionadas: [],
    festas_relacionadas: [],
    musicas_dancas_relacionadas: [],
    folclore_relacionado: folklore,
    folclore: folklore,
    visual_brief: normalizePublicText(visualBrief),
    marcadores_visuais: visualMarkers.slice(0, 2).map(normalizePublicText),
    apresentacao_editorial: editorialPresentation,
    status_pesquisa: researchStatus,
    status_revisao_cultural: culturalReview,
    publicavel: publishable,
    status_imagem: "pendente",
    asset_futuro: `assets/characters/${number}-${slug}.png`,
    tags: [category, region, uf].filter(Boolean),
    variacoes_planejadas: [],
    assets_variacoes_futuras: {},
    status_variacoes: {},
    fontes: sources,
  };
}

function addFamily(family) {
  families.push({
    schema_version: "2.0.0",
    ...family,
    nome_exibicao: normalizePublicText(family.nome_exibicao),
    composicao: Array.isArray(family.composicao)
      ? family.composicao.map(normalizePublicText)
      : normalizePublicText(family.composicao),
  });
}

function writeSegments(basePath, prefix, category, records) {
  const batches = splitIntoBatches(records, 100);
  batches.forEach((batch, index) => {
    const filename = `${prefix}-${String(index + 1).padStart(3, "0")}.json`;
    const relativePath = path.posix.join("data/personagens", basePath, filename);
    writeJson(relativePath, {
      schema_version: "2.0.0",
      categoria: category,
      lote: index + 1,
      registros: batch,
    });
    sourceManifest.push({
      ordem: sourceManifest.length + 1,
      categoria: category,
      arquivo: relativePath,
      quantidade: batch.length,
    });
  });
}

const existing = currentCatalog
  .filter((record) => Number(record.numero) <= 201)
  .map(normalizeExisting);

const existingAvatars = existing.filter((record) => Number(record.numero) >= 2 && Number(record.numero) <= 11);
const existingSpecials = existing.filter((record) => Number(record.numero) === 201);
const existingCore = existing.filter((record) => !existingAvatars.includes(record) && !existingSpecials.includes(record));

const mestreSatochi = createCharacter({
  number: "202",
  uid: "ESP-MESTRE-SATOCHI",
  cardCode: "CR-202-ESP-2026",
  name: "Mestre Satochi",
  slug: "mestre-satochi",
  type: "personagem_especial_educativo",
  category: "educacao_pigcoin",
  subcategory: "guia_ficcional",
  familyId: "FAM-ESP-202",
  role: "Guia ficticio de conceitos digitais e planejamento.",
  description: "Inventor misterioso e inteiramente ficticio do PigCoin educativo.",
  story: "Explica conceitos ficticios de energia, criptografia, seguranca, planejamento e sustentabilidade sem representar pessoa real.",
  visualBrief: "Porquinho adulto, roupa simples de inventor e um pequeno caderno tecnico.",
  visualMarkers: ["caderno tecnico", "roupa de inventor sem marca"],
  researchStatus: "confirmado_projeto",
  culturalReview: "nao_aplicavel",
  publishable: true,
  sources: [],
});
allNewCharacters.push(mestreSatochi);
addFamily({
  uid: "FAM-ESP-202",
  nome_exibicao: "Nucleo educativo Mestre Satochi",
  slug: "nucleo-educativo-mestre-satochi",
  tipo: "nucleo_educativo",
  membros: [mestreSatochi.uid],
  relacoes_externas: [],
  regiao: null,
  uf: null,
  municipio_ou_territorio: null,
  origens_culturais: [],
  comunidades: [],
  idiomas: ["pt-BR"],
  status_pesquisa: "confirmado_projeto",
  status_revisao_cultural: "nao_aplicavel",
  publicavel: true,
  fontes: [],
});

let globalMemberIndex = 0;
let globalFamilyIndex = 0;
const regionalByRegion = new Map();

for (const ufRecord of ufs) {
  const familyCount = HOUSEHOLD_COUNTS[ufRecord.sigla];
  const region = ufRecord.regiao;
  const regionCode = REGION_CODES[region];
  const regionCharacters = regionalByRegion.get(region) ?? [];
  const municipalityList = municipalityByUf.get(ufRecord.sigla) ?? [];
  const capital = CAPITALS[ufRecord.sigla];
  const interior = municipalityList.filter((item) => item.nome !== capital);

  for (let familySequence = 1; familySequence <= familyCount; familySequence += 1) {
    globalFamilyIndex += 1;
    const familyId = `FAM-${ufRecord.sigla}-${String(familySequence).padStart(4, "0")}`;
    const surnameA = SURNAMES[(globalFamilyIndex * 7) % SURNAMES.length];
    const surnameB = SURNAMES[(globalFamilyIndex * 17 + 11) % SURNAMES.length];
    const pattern = HOUSEHOLD_PATTERNS[(globalFamilyIndex - 1) % HOUSEHOLD_PATTERNS.length];
    const municipalityMode = (familySequence - 1) % 3;
    const municipality = municipalityMode === 0
      ? capital
      : interior[(familySequence * 13 + globalFamilyIndex) % Math.max(interior.length, 1)]?.nome ?? capital;
    const environment = municipalityMode === 0 ? "urbano_capital" : municipalityMode === 1 ? "urbano_interior" : "rural_ou_periurbano";
    const memberUids = [];
    const familyCharacters = [];

    pattern.ages.forEach((age, memberIndex) => {
      globalMemberIndex += 1;
      const presentation = presentationFor(globalMemberIndex);
      const { first, fullName } = uniqueFullName(globalMemberIndex, globalFamilyIndex, memberIndex, surnameA, surnameB, presentation);
      const number = nextFormattedNumber();
      const uid = `VIL-${regionCode}-${ufRecord.sigla}-${String(globalMemberIndex).padStart(6, "0")}`;
      const slug = `${slugify(fullName)}-${ufRecord.sigla.toLowerCase()}-${String(familySequence).padStart(4, "0")}`;
      const profession = age >= 18 ? nextOccupation() : null;
      const professionIds = profession ? [profession.id] : [];
      const member = createCharacter({
        number,
        uid,
        cardCode: `CR-VIL-${regionCode}-${ufRecord.sigla}-${String(globalMemberIndex).padStart(6, "0")}`,
        name: first,
        fullName,
        slug,
        type: "personagem_regional",
        category: "familia_e_comunidade",
        subcategory: "nucleo_domestico_regional",
        familyId,
        region,
        uf: ufRecord.sigla,
        municipality,
        environment,
        age,
        role: pattern.roles[memberIndex],
        description: `${first} integra um nucleo ficticio de ${municipality}, ${ufRecord.sigla}.`,
        story: `${first} participa da rotina de ${environment.replaceAll("_", " ")} e mantem vinculos com escola, trabalho, vizinhanca e comercio local, sem representar sozinho toda a diversidade de ${ufRecord.nome}.`,
        visualBrief: age < 18
          ? "Porquinho jovem, roupa cotidiana simples e uma mochila sem marca."
          : "Porquinho adulto, roupa cotidiana simples e um objeto profissional discreto.",
        visualMarkers: age < 18 ? ["roupa cotidiana", "mochila sem marca"] : ["roupa cotidiana", "objeto profissional discreto"],
        profession,
        professionIds,
        researchStatus: "parcial",
        culturalReview: "aprovado_editorial_generico",
        publishable: true,
        sources: [SOURCE_IDS.ibgeNames, SOURCE_IDS.ibgeLocalities, ...(profession ? [SOURCE_IDS.mteCbo] : [])],
        editorialPresentation: presentation,
      });
      memberUids.push(uid);
      familyCharacters.push(member);
      regionCharacters.push(member);
      allNewCharacters.push(member);
    });

    familyCharacters.forEach((member) => {
      member.relacoes = memberUids
        .filter((uid) => uid !== member.uid)
        .map((uid) => ({ uid, tipo: pattern.label }));
    });

    addFamily({
      uid: familyId,
      nome_exibicao: `Família ${surnameA} ${surnameB}`,
      sobrenome: `${surnameA} ${surnameB}`,
      slug: `${slugify(surnameA)}-${slugify(surnameB)}-${ufRecord.sigla.toLowerCase()}-${String(familySequence).padStart(4, "0")}`,
      tipo: pattern.label,
      composicao: pattern.roles,
      regiao: region,
      uf: ufRecord.sigla,
      municipio_ou_territorio: municipality,
      ambiente: environment,
      origens_culturais: [],
      paises_relacionados: [],
      idiomas: ["pt-BR"],
      membros: memberUids,
      relacoes_externas: [],
      status_pesquisa: "parcial",
      status_revisao_cultural: "aprovado_editorial_generico",
      publicavel: true,
      fontes: [SOURCE_IDS.ibgeNames, SOURCE_IDS.ibgeLocalities],
    });
  }

  regionalByRegion.set(region, regionCharacters);
}

const indigenousCharacters = [];
indigenousPeoples.forEach((people, index) => {
  const number = nextFormattedNumber();
  const peopleName = people.nome_oficial;
  const peopleSlug = slugify(peopleName);
  const familyId = `FAM-IND-${String(index + 1).padStart(4, "0")}`;
  const character = createCharacter({
    number,
    uid: `IND-${String(index + 1).padStart(4, "0")}`,
    cardCode: `CR-IND-${String(index + 1).padStart(4, "0")}`,
    name: `Perfil comunitario em pesquisa - ${peopleName}`,
    fullName: "",
    slug: `perfil-${peopleSlug}-${String(index + 1).padStart(4, "0")}`,
    type: "perfil_comunitario_pesquisa",
    category: "povos_indigenas",
    subcategory: "slot_de_pesquisa_cultural",
    familyId,
    role: "Slot para futuro nucleo comunitario e familiar, condicionado a pesquisa e consulta.",
    description: `Perfil interno ligado ao nome oficial ${peopleName}; nao e personagem publicavel nem representacao visual pronta.`,
    story: "A historia pessoal, o territorio, as relacoes e o nome permanecem em aberto para evitar invencao cultural.",
    visualBrief: "Definir somente apos pesquisa e revisao cultural com o povo relacionado.",
    culturalOrigins: ["origem_povo_indigena_especifico"],
    communities: ["com_povos_indigenas"],
    indigenousPeopleId: `povo-${peopleSlug}`,
    researchStatus: "requer_consulta",
    culturalReview: "requer_especialista",
    publishable: false,
    sources: [SOURCE_IDS.ibgeIndigenous],
    nameStatus: "aguardando_pesquisa_cultural",
  });
  indigenousCharacters.push(character);
  allNewCharacters.push(character);
  addFamily({
    uid: familyId,
    nome_exibicao: `Cluster comunitario em pesquisa - ${peopleName}`,
    slug: `cluster-${peopleSlug}-${String(index + 1).padStart(4, "0")}`,
    tipo: "cluster_comunitario_planejado",
    composicao: [],
    regiao: null,
    uf: null,
    municipio_ou_territorio: null,
    origens_culturais: ["origem_povo_indigena_especifico"],
    comunidades: ["com_povos_indigenas"],
    idiomas: [],
    membros: [character.uid],
    relacoes_externas: [],
    status_pesquisa: "requer_consulta",
    status_revisao_cultural: "requer_especialista",
    publicavel: false,
    fontes: [SOURCE_IDS.ibgeIndigenous],
  });
});

const traditionalCharacters = [];
communitiesCatalog.forEach((community, index) => {
  const number = nextFormattedNumber();
  const familyId = `FAM-PCT-${String(index + 1).padStart(4, "0")}`;
  const communitySlug = slugify(community.nome);
  const character = createCharacter({
    number,
    uid: `PCT-${String(index + 1).padStart(4, "0")}`,
    cardCode: `CR-PCT-${String(index + 1).padStart(4, "0")}`,
    name: `Perfil tradicional em pesquisa - ${community.nome}`,
    fullName: "",
    slug: `perfil-${communitySlug}-${String(index + 1).padStart(4, "0")}`,
    type: "perfil_comunitario_pesquisa",
    category: "comunidades_tradicionais",
    subcategory: "slot_de_pesquisa_cultural",
    familyId,
    role: "Slot de pesquisa para futura representacao comunitaria responsavel.",
    description: `Perfil interno associado ao segmento oficial ${community.nome}.`,
    story: "Nome pessoal, territorio, familia, historia e elementos visuais aguardam fontes especificas e consulta quando aplicavel.",
    visualBrief: "Definir somente depois de pesquisa territorial e revisao cultural.",
    communities: [community.id],
    researchStatus: "requer_consulta",
    culturalReview: "requer_especialista",
    publishable: false,
    sources: [SOURCE_IDS.mdaCommunities],
    nameStatus: "aguardando_pesquisa_cultural",
  });
  traditionalCharacters.push(character);
  allNewCharacters.push(character);
  addFamily({
    uid: familyId,
    nome_exibicao: `Nucleo em pesquisa - ${community.nome}`,
    slug: `nucleo-${communitySlug}-${String(index + 1).padStart(4, "0")}`,
    tipo: "nucleo_comunitario_planejado",
    composicao: [],
    regiao: null,
    uf: null,
    municipio_ou_territorio: null,
    origens_culturais: [],
    comunidades: [community.id],
    idiomas: ["pt-BR"],
    membros: [character.uid],
    relacoes_externas: [],
    status_pesquisa: "requer_consulta",
    status_revisao_cultural: "requer_especialista",
    publicavel: false,
    fontes: [SOURCE_IDS.mdaCommunities],
  });
});

const folkloreFigures = [...existingFolklore.figuras];
while (folkloreFigures.length < 100) {
  const sequence = folkloreFigures.length + 1;
  folkloreFigures.push({
    uid: `FOL-PESQ-${String(sequence).padStart(4, "0")}`,
    nome: `Variacao folclorica em pesquisa ${String(sequence).padStart(3, "0")}`,
    slug: `variacao-folclorica-em-pesquisa-${String(sequence).padStart(3, "0")}`,
    origem_conhecida: null,
    regioes_circulacao: [],
    versoes_regionais: [],
    status_pesquisa: "pendente",
    publicavel: false,
    fontes: [],
  });
}

const folkloreCharacters = folkloreFigures.map((figure, index) => {
  const number = nextFormattedNumber();
  const familyId = `FAM-FOL-${String(index + 1).padStart(4, "0")}`;
  const character = createCharacter({
    number,
    uid: `FOL-PER-${String(index + 1).padStart(4, "0")}`,
    cardCode: `CR-FOL-${String(index + 1).padStart(4, "0")}`,
    name: `Pesquisa visual - ${figure.nome}`,
    fullName: figure.nome,
    slug: `pesquisa-${figure.slug}`,
    type: "perfil_folclorico_pesquisa",
    category: "folclore",
    subcategory: "interpretacao_original_pendente",
    familyId,
    role: "Registro de pesquisa para futura interpretacao original.",
    description: `${figure.nome} permanece fora da Colecao publica ate haver fontes e revisao suficientes.`,
    story: "Origem, versoes regionais e elementos visuais ainda precisam ser documentados; nenhuma versao protegida sera copiada.",
    visualBrief: "Definir interpretacao original somente depois da pesquisa de fontes regionais.",
    folklore: [figure.uid],
    researchStatus: "pendente",
    culturalReview: "pendente",
    publishable: false,
    sources: [SOURCE_IDS.iphan],
    nameStatus: "nome_da_referencia_confirmado_personagem_pendente",
  });
  addFamily({
    uid: familyId,
    nome_exibicao: `Pesquisa folclorica ${String(index + 1).padStart(3, "0")}`,
    slug: `pesquisa-folclorica-${String(index + 1).padStart(3, "0")}`,
    tipo: "grupo_de_pesquisa",
    composicao: [],
    regiao: null,
    uf: null,
    municipio_ou_territorio: null,
    origens_culturais: [],
    comunidades: [],
    idiomas: ["pt-BR"],
    membros: [character.uid],
    relacoes_externas: [],
    status_pesquisa: "pendente",
    status_revisao_cultural: "pendente",
    publicavel: false,
    fontes: [SOURCE_IDS.iphan],
  });
  return character;
});
allNewCharacters.push(...folkloreCharacters);

function createResearchSeries({ count, prefix, familyPrefix, category, subcategory, type, sourceId, originIds = [] }) {
  const records = [];
  for (let index = 0; index < count; index += 1) {
    const number = nextFormattedNumber();
    const familyId = `${familyPrefix}-${String(index + 1).padStart(4, "0")}`;
    const originId = originIds.length ? originIds[index % originIds.length] : null;
    const name = `${category.replaceAll("_", " ")} em pesquisa ${String(index + 1).padStart(3, "0")}`;
    const character = createCharacter({
      number,
      uid: `${prefix}-${String(index + 1).padStart(4, "0")}`,
      cardCode: `CR-${prefix}-${String(index + 1).padStart(4, "0")}`,
      name,
      fullName: "",
      slug: slugify(`${name}-${index + 1}`),
      type,
      category,
      subcategory,
      familyId,
      role: "Slot interno para pesquisa documental e futura construcao editorial.",
      description: "Registro nao publicavel enquanto nomes, relacoes e contexto nao forem confirmados.",
      story: "O perfil foi reservado para cobrir uma lacuna sem preencher dados culturais, migratorios ou profissionais por suposicao.",
      visualBrief: "Definir somente apos pesquisa, fontes e revisao editorial.",
      culturalOrigins: originId ? [originId] : [],
      researchStatus: "pendente",
      culturalReview: "pendente",
      publishable: false,
      sources: [sourceId],
      nameStatus: "aguardando_pesquisa",
    });
    records.push(character);
    allNewCharacters.push(character);
    addFamily({
      uid: familyId,
      nome_exibicao: `Nucleo ${name}`,
      slug: slugify(`nucleo-${name}-${index + 1}`),
      tipo: "nucleo_de_pesquisa",
      composicao: [],
      regiao: null,
      uf: null,
      municipio_ou_territorio: null,
      origens_culturais: originId ? [originId] : [],
      comunidades: [],
      idiomas: ["pt-BR"],
      membros: [character.uid],
      relacoes_externas: [],
      status_pesquisa: "pendente",
      status_revisao_cultural: "pendente",
      publicavel: false,
      fontes: [sourceId],
    });
  }
  return records;
}

const migrationCharacters = createResearchSeries({
  count: 30,
  prefix: "MIG",
  familyPrefix: "FAM-MIG",
  category: "migracoes",
  subcategory: "historia_migratoria_pendente",
  type: "perfil_migratorio_pesquisa",
  sourceId: SOURCE_IDS.immigrationMuseum,
  originIds: originsCatalog.filter((origin) => origin.tipo.includes("migratoria")).map((origin) => origin.id),
});

const mixedFamilyCharacters = createResearchSeries({
  count: 30,
  prefix: "MIX",
  familyPrefix: "FAM-MIX",
  category: "familias_mistas",
  subcategory: "origens_e_trajetorias_diversas",
  type: "perfil_familiar_pesquisa",
  sourceId: SOURCE_IDS.ibgeNames,
});

const futureCharacters = createResearchSeries({
  count: 20,
  prefix: "FUT",
  familyPrefix: "FAM-FUT",
  category: "futuro",
  subcategory: "profissao_futura_reservada",
  type: "personagem_futuro_reservado",
  sourceId: SOURCE_IDS.mteCbo,
});

const educationCharacters = [];
for (let index = 0; index < 20; index += 1) {
  const number = nextFormattedNumber();
  const familyId = `FAM-EDU-${String(index + 1).padStart(4, "0")}`;
  const age = 28 + (index % 28);
  const presentation = presentationFor(globalMemberIndex + index + 1);
  const surnameA = SURNAMES[(index * 9 + 3) % SURNAMES.length];
  const surnameB = SURNAMES[(index * 13 + 7) % SURNAMES.length];
  const { first, fullName } = uniqueFullName(globalMemberIndex + index + 1, globalFamilyIndex + index + 1, 0, surnameA, surnameB, presentation);
  const profession = nextOccupation();
  const character = createCharacter({
    number,
    uid: `EDU-${String(index + 1).padStart(4, "0")}`,
    cardCode: `CR-EDU-${String(index + 1).padStart(4, "0")}`,
    name: first,
    fullName,
    slug: `${slugify(fullName)}-educacao-${String(index + 1).padStart(3, "0")}`,
    type: "personagem_educativo",
    category: "educacao",
    subcategory: "rede_de_aprendizagem",
    familyId,
    age,
    role: "Pessoa da rede educativa e comunitaria.",
    description: `${first} participa de atividades educativas da Vila Pig.`,
    story: "Ajuda a apresentar planejamento, cooperacao, seguranca e escolhas conscientes sem gamificacao predatoria.",
    visualBrief: "Porquinho adulto, roupa simples e um livro sem texto na capa.",
    visualMarkers: ["livro sem texto", "roupa cotidiana"],
    profession,
    professionIds: [profession.id],
    researchStatus: "confirmado_projeto",
    culturalReview: "nao_aplicavel",
    publishable: true,
    sources: [SOURCE_IDS.ibgeNames, SOURCE_IDS.mteCbo],
    editorialPresentation: presentation,
  });
  educationCharacters.push(character);
  allNewCharacters.push(character);
  addFamily({
    uid: familyId,
    nome_exibicao: `Rede educativa ${String(index + 1).padStart(3, "0")}`,
    slug: `rede-educativa-${String(index + 1).padStart(3, "0")}`,
    tipo: "rede_educativa",
    composicao: ["educadora_ou_educador"],
    regiao: null,
    uf: null,
    municipio_ou_territorio: null,
    origens_culturais: [],
    comunidades: [],
    idiomas: ["pt-BR"],
    membros: [character.uid],
    relacoes_externas: [],
    status_pesquisa: "confirmado_projeto",
    status_revisao_cultural: "nao_aplicavel",
    publicavel: true,
    fontes: [SOURCE_IDS.ibgeNames, SOURCE_IDS.mteCbo],
  });
}

const cboProfessions = occupations.map((occupation) => ({
  id_estavel: `CBO-${occupation.codigo}`,
  nome_exibicao: occupationDisplayName(occupation.titulo),
  categoria: "atual_cbo",
  status: "oficial_cbo",
  cbo: occupation.codigo,
  status_pesquisa: "confirmado",
  fontes: [SOURCE_IDS.mteCbo],
}));

const preservedProfessionIds = new Set(cboProfessions.map((profession) => profession.id_estavel));
const preservedStarterProfessions = starterProfessions.profissoes.filter((profession) => !preservedProfessionIds.has(profession.id_estavel));
const normalizedProfessionSource = normalizePublicMetadata(starterProfessions.fonte_base ?? {}, ["titulo", "instituicao"]);
writeJson("data/profissoes.json", {
  ...starterProfessions,
  schema_version: "2.0.0",
  atualizado_em: CATALOG_DATE,
  total_cbo_importado: cboProfessions.length,
  fonte_base: normalizedProfessionSource,
  profissoes: [...preservedStarterProfessions, ...cboProfessions].map(normalizePublicRecord),
});

const normalizedFolkloreSources = (existingFolklore.fontes_base ?? []).map((source) =>
  normalizePublicMetadata(source, ["titulo", "instituicao"]),
);
writeJson("data/folclore-brasileiro.json", {
  ...existingFolklore,
  schema_version: "2.0.0",
  atualizado_em: CATALOG_DATE,
  politica_visual: normalizePublicText(existingFolklore.politica_visual),
  fontes_base: normalizedFolkloreSources,
  observacao_cobertura: "Os oito registros nomeados são referências iniciais. Os demais são slots não publicáveis e não contam como pesquisa cultural concluída.",
  figuras: folkloreFigures.map(normalizePublicRecord),
});

writeJson("data/fontes-catalogo.json", {
  schema_version: "1.0.0",
  atualizado_em: CATALOG_DATE,
  fontes: SOURCES,
});

writeJson("data/familias-catalogo.json", {
  schema_version: "2.0.0",
  atualizado_em: CATALOG_DATE,
  politicas: [
    "Nenhuma família representa sozinha uma região, povo, origem ou comunidade.",
    "Clusters culturais sensíveis permanecem internos até pesquisa e revisão adequadas.",
    "Relações e nomes pessoais não são inventados para preencher lacunas culturais.",
  ],
  total: families.length,
  familias: families,
});

writeJson("data/familias-vila-pig.json", {
  schema_version: "2.0.0",
  atualizado_em: CATALOG_DATE,
  politicas: [
    "Arquivo de compatibilidade gerado a partir de data/familias-catalogo.json.",
    "Nenhuma família sozinha representa todo um povo, país, região ou comunidade.",
  ],
  familias: families,
});

writeJson("data/povos-indigenas.json", {
  schema_version: "1.0.0",
  atualizado_em: CATALOG_DATE,
  fonte: SOURCE_IDS.ibgeIndigenous,
  regra_publicacao: "Perfis pessoais e visuais dependem de pesquisa suficiente e consulta; a lista oficial não autoriza inferências culturais.",
  total: indigenousPeoples.length,
  povos: indigenousPeoples.map((people, index) => ({
    id: `povo-${slugify(people.nome_oficial)}`,
    codigo_ibge: people.codigo_ibge,
    nome_oficial: people.nome_oficial,
    autodenominacao: null,
    grafias: [],
    territorios: [],
    ufs: [],
    linguas: [],
    populacao: null,
    fontes: [SOURCE_IDS.ibgeIndigenous],
    status_pesquisa: "lista_oficial_confirmada_detalhes_pendentes",
    orientacao_representacao: "Não criar nome pessoal, roupa, pintura, símbolo ou prática sem fonte e revisão cultural.",
    restricoes_culturais: ["não inventar", "não usar índio genérico", "não publicar sem revisão"],
    familia_planejada: `FAM-IND-${String(index + 1).padStart(4, "0")}`,
    slots_personagens: [`IND-${String(index + 1).padStart(4, "0")}`],
  })),
});

writeSegments("core", "core", "core_existente", existingCore);
writeSegments("avatares", "avatares", "avatares_existentes", existingAvatars);
writeSegments("especiais", "especiais", "personagens_especiais", [...existingSpecials, mestreSatochi]);
for (const [region, records] of regionalByRegion.entries()) {
  writeSegments(path.posix.join("regioes", region), region, `regiao_${region}`, records);
}
writeSegments("povos-indigenas", "povos-indigenas", "povos_indigenas", indigenousCharacters);
writeSegments("comunidades-tradicionais", "comunidades-tradicionais", "comunidades_tradicionais", traditionalCharacters);
writeSegments("migracoes", "migracoes", "migracoes", migrationCharacters);
writeSegments("familias-mistas", "familias-mistas", "familias_mistas", mixedFamilyCharacters);
writeSegments("folclore", "folclore", "folclore", folkloreCharacters);
writeSegments("educacao", "educacao", "educacao", educationCharacters);
writeSegments("futuro", "futuro", "futuro", futureCharacters);

const allCharacters = [...existing, ...allNewCharacters];
writeJson("data/personagens/index.json", {
  schema_version: "2.0.0",
  gerado_em: CATALOG_DATE,
  gerador: "scripts/generate-personagens-sources.mjs",
  compilador: "scripts/build-personagens-catalog.mjs",
  total_esperado: allCharacters.length,
  fontes: sourceManifest,
});

writeJson("data/catalogo-continuation-state.json", {
  schema_version: "1.0.0",
  atualizado_em: CATALOG_DATE,
  ultimo_numero_usado: formatPersonNumber(nextNumber - 1),
  ultimo_lote: sourceManifest.at(-1)?.arquivo ?? null,
  regiao_atual: null,
  categoria_atual: "validacao_e_revisao",
  quantidade_criada: allCharacters.length,
  lacunas: [
    "Revisar culturalmente os 391 slots ligados aos nomes oficiais de povos indígenas.",
    "Pesquisar individualmente os segmentos de comunidades tradicionais.",
    "Pesquisar 92 variações folclóricas antes de nomear ou publicar.",
    "Confirmar fontes específicas para histórias migratórias e famílias mistas.",
  ],
  proximo_comando_exato: "node scripts/build-personagens-catalog.mjs && node scripts/validate-personagens-catalog.mjs",
});

console.log(JSON.stringify({
  total: allCharacters.length,
  existentes_preservados: existing.length,
  novos: allNewCharacters.length,
  familias: families.length,
  fontes_segmentadas: sourceManifest.length,
  ultimo_numero: formatPersonNumber(nextNumber - 1),
}, null, 2));
