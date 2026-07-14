import fs from "node:fs";
import path from "node:path";
import {
  fromRoot,
  numericPersonSort,
  readJson,
  splitIntoBatches,
  writeCsv,
  writeJson,
} from "./catalogo-lib.mjs";

const BUILD_DATE = "2026-07-14";
const MAX_SOURCE_BATCH = 100;
const PUBLIC_BATCH = 100;

const CSV_COLUMNS = [
  "numero",
  "numero_legacy",
  "uid",
  "card_code",
  "nome",
  "nome_exibicao",
  "nome_completo",
  "nome_status",
  "apelido",
  "aliases",
  "slug",
  "tipo",
  "tipo_personagem",
  "categoria",
  "classificacao_principal",
  "subcategoria",
  "familia_id",
  "familia_uid",
  "household_id",
  "relacoes",
  "regiao",
  "uf",
  "municipio_ou_territorio",
  "ambiente",
  "bioma",
  "origens_culturais",
  "paises_relacionados",
  "povo_indigena_id",
  "comunidades_tradicionais",
  "comunidades",
  "idiomas",
  "geracao_id",
  "geracao",
  "geracao_calculada_pelo_usuario",
  "fase_vida",
  "faixa_etaria",
  "idade_aproximada",
  "profissao_atual",
  "profissoes",
  "profissoes_anteriores",
  "profissao_futura_desejada",
  "situacao_profissional",
  "papel_na_vila",
  "papel",
  "descricao_curta",
  "historia",
  "personalidade",
  "objetivo",
  "meta_financeira_educativa",
  "papel_educativo",
  "comidas_relacionadas",
  "festas_relacionadas",
  "musicas_dancas_relacionadas",
  "folclore_relacionado",
  "folclore",
  "visual_brief",
  "marcadores_visuais",
  "apresentacao_editorial",
  "status_pesquisa",
  "status_revisao_cultural",
  "publicavel",
  "status_imagem",
  "asset_futuro",
  "tags",
  "variacoes_planejadas",
  "assets_variacoes_futuras",
  "padrao_visual_avatar",
  "status_variacoes",
  "uids_variacoes",
  "card_codes_variacoes",
  "estilos_visuais_ativos",
  "identidades_avatar",
  "identidade_avatar",
  "apresentacao_visual",
  "nomes_publicos_identidades",
  "variacoes_descontinuadas",
  "historico_status_imagem",
  "fontes",
];

function compactPublicRecord(record) {
  const profession = record.profissao_atual?.titulo
    ?? record.profissao_atual?.nome_exibicao
    ?? record.profissao_atual
    ?? null;
  return {
    numero: record.numero,
    uid: record.uid,
    card_code: record.card_code,
    nome: record.nome,
    nome_exibicao: record.nome_exibicao || record.nome,
    nome_completo: record.nome_completo || record.nome,
    apelido: record.apelido || "",
    slug: record.slug,
    tipo: record.tipo,
    tipo_personagem: record.tipo_personagem,
    categoria: record.categoria,
    classificacao_principal: record.classificacao_principal,
    subcategoria: record.subcategoria,
    familia_uid: record.familia_uid || record.familia_id || "",
    regiao: record.regiao || "",
    uf: record.uf || "",
    municipio_ou_territorio: record.municipio_ou_territorio || "",
    origens_culturais: record.origens_culturais || [],
    comunidades: record.comunidades || record.comunidades_tradicionais || [],
    geracao: record.geracao || record.geracao_id || "",
    fase_vida: record.fase_vida || "",
    faixa_etaria: record.faixa_etaria || "",
    profissao: profession,
    profissoes: record.profissoes || [],
    folclore: record.folclore || record.folclore_relacionado || [],
    descricao_curta: record.descricao_curta || "",
    papel: record.papel || record.papel_na_vila || "",
    visual_brief: record.visual_brief || "",
    publicavel: true,
    status_imagem: record.status_imagem || "pendente",
    asset_futuro: record.asset_futuro,
    tags: record.tags || [],
    variacoes_planejadas: record.variacoes_planejadas || [],
    assets_variacoes_futuras: record.assets_variacoes_futuras || {},
    status_variacoes: record.status_variacoes || {},
    uids_variacoes: record.uids_variacoes || {},
    card_codes_variacoes: record.card_codes_variacoes || {},
    estilos_visuais_ativos: record.estilos_visuais_ativos || [],
    identidades_avatar: record.identidades_avatar || [],
    identidade_avatar: record.identidade_avatar || {},
    apresentacao_visual: record.apresentacao_visual || {},
    nomes_publicos_identidades: record.nomes_publicos_identidades || {},
  };
}

function loadSources() {
  const manifest = readJson("data/personagens/index.json");
  const records = [];
  for (const source of manifest.fontes) {
    const absolute = fromRoot(source.arquivo);
    if (!fs.existsSync(absolute)) throw new Error(`Fonte ausente: ${source.arquivo}`);
    const payload = JSON.parse(fs.readFileSync(absolute, "utf8"));
    const batch = Array.isArray(payload.registros) ? payload.registros : [];
    if (batch.length > MAX_SOURCE_BATCH) {
      throw new Error(`${source.arquivo}: ${batch.length} registros; maximo ${MAX_SOURCE_BATCH}`);
    }
    if (batch.length !== source.quantidade) {
      throw new Error(`${source.arquivo}: manifesto=${source.quantidade}, arquivo=${batch.length}`);
    }
    records.push(...batch);
  }
  if (records.length !== manifest.total_esperado) {
    throw new Error(`Total divergente: manifesto=${manifest.total_esperado}, compilado=${records.length}`);
  }
  return records.sort(numericPersonSort);
}

function writePublicCatalog(records) {
  const publicRecords = records.filter((record) => record.publicavel !== false).map(compactPublicRecord);
  const chunks = splitIntoBatches(publicRecords, PUBLIC_BATCH);
  const chunkManifest = [];
  chunks.forEach((chunk, index) => {
    const filename = `publicos-${String(index + 1).padStart(3, "0")}.json`;
    writeJson(path.posix.join("data", "personagens-publicos", filename), {
      schema_version: "1.0.0",
      lote: index + 1,
      quantidade: chunk.length,
      registros: chunk,
    });
    chunkManifest.push({
      ordem: index + 1,
      arquivo: `data/personagens-publicos/${filename}`,
      quantidade: chunk.length,
      numero_inicial: chunk[0]?.numero ?? null,
      numero_final: chunk.at(-1)?.numero ?? null,
    });
  });

  const facets = {
    regioes: [...new Set(publicRecords.map((record) => record.regiao).filter(Boolean))].sort(),
    ufs: [...new Set(publicRecords.map((record) => record.uf).filter(Boolean))].sort(),
    familias: [...new Set(publicRecords.map((record) => record.familia_uid).filter(Boolean))].sort(),
    profissoes: [...new Set(publicRecords.flatMap((record) => record.profissoes || []).filter(Boolean))].sort(),
    geracoes: [...new Set(publicRecords.map((record) => record.geracao).filter(Boolean))].sort(),
    fases_vida: [...new Set(publicRecords.map((record) => record.fase_vida).filter(Boolean))].sort(),
    origens_culturais: [...new Set(publicRecords.flatMap((record) => record.origens_culturais || []).filter(Boolean))].sort(),
    comunidades: [...new Set(publicRecords.flatMap((record) => record.comunidades || []).filter(Boolean))].sort(),
    folclore: [...new Set(publicRecords.flatMap((record) => record.folclore || []).filter(Boolean))].sort(),
    tipos: [...new Set(publicRecords.map((record) => record.tipo_personagem).filter(Boolean))].sort(),
    status_imagem: [...new Set(publicRecords.map((record) => record.status_imagem).filter(Boolean))].sort(),
    publicavel: ["true"],
  };

  writeJson("data/personagens-publicos/manifest.json", {
    schema_version: "1.0.0",
    gerado_em: BUILD_DATE,
    total_publicavel: publicRecords.length,
    tamanho_lote: PUBLIC_BATCH,
    lotes: chunkManifest,
    facetas: facets,
  });
  return { publicRecords, chunks: chunkManifest };
}

const records = loadSources();
writeJson("data/vila-pig-personagens.json", records);
writeCsv("data/vila-pig-personagens.csv", records, CSV_COLUMNS);
const publicResult = writePublicCatalog(records);

console.log(JSON.stringify({
  total_compilado: records.length,
  total_publicavel: publicResult.publicRecords.length,
  lotes_publicos: publicResult.chunks.length,
  primeiro_numero: records[0]?.numero,
  ultimo_numero: records.at(-1)?.numero,
}, null, 2));
