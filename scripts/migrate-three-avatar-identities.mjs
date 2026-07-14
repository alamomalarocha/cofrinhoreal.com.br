import fs from "node:fs";
import path from "node:path";
import { fromRoot, readJson, writeJson } from "./catalogo-lib.mjs";

const MIGRATION_DATE = "2026-07-14";
const MIGRATION_EVENT = "reset_visual_tres_identidades_2026_07";
const RESET_REASON =
  "Imagem preservada como rascunho após adoção do novo sistema de três identidades e uso exclusivo do Pig Principal como referência visual oficial.";
const DISCONTINUED_REASON = "Substituído pelo sistema visual de três identidades";
const ACTIVE_STYLES = ["azul", "rosa", "arco_iris"];
const ARCHIVE_ROOT = "assets/characters/_drafts/reset-visual-tres-identidades-2026-07";

function archivedAsset(asset, group = "personagens") {
  if (!asset) return null;
  return path.posix.join(ARCHIVE_ROOT, group, path.posix.basename(asset));
}

function appendHistory(record, entry) {
  const history = Array.isArray(record.historico_status_imagem)
    ? record.historico_status_imagem
    : [];
  if (!history.some((item) => item.evento === entry.evento)) history.push(entry);
  record.historico_status_imagem = history;
}

function identityDefinitions(number) {
  const child = Number(number) <= 4;
  return [
    {
      estilo_visual: "azul",
      identidade_avatar: child ? "menino" : "masculino",
      apresentacao_visual: "masculina",
      nome_publico: child ? "Menino Azul" : "Masculino Azul",
    },
    {
      estilo_visual: "rosa",
      identidade_avatar: child ? "menina" : "feminino",
      apresentacao_visual: "feminina",
      nome_publico: child ? "Menina Rosa" : "Feminino Rosa",
    },
    {
      estilo_visual: "arco_iris",
      identidade_avatar: "neutro",
      apresentacao_visual: "neutra",
      nome_publico: "Neutro Arco-íris",
    },
  ];
}

function migrateAvatar(record) {
  const oldPadraoAsset = record.assets_variacoes_futuras?.padrao
    || `assets/characters/${record.numero}-${record.slug}-padrao.png`;
  const priorPadraoStatus = record.status_variacoes?.padrao || "pendente";
  const priorPadraoUid = record.uids_variacoes?.padrao || null;
  const priorPadraoCardCode = record.card_codes_variacoes?.padrao || null;
  const discontinued = Array.isArray(record.variacoes_descontinuadas)
    ? record.variacoes_descontinuadas.filter((item) => item.estilo !== "padrao")
    : [];

  discontinued.push({
    estilo: "padrao",
    status: "descontinuado",
    motivo: DISCONTINUED_REASON,
    publicavel: false,
    asset_anterior: oldPadraoAsset,
    arquivado_em: archivedAsset(oldPadraoAsset, "avatares"),
    status_anterior: priorPadraoStatus,
    uid_anterior: priorPadraoUid,
    card_code_anterior: priorPadraoCardCode,
  });

  const assets = {};
  const statuses = {};
  const uids = {};
  const cardCodes = {};
  for (const style of ACTIVE_STYLES) {
    assets[style] = record.assets_variacoes_futuras?.[style]
      || `assets/characters/${record.numero}-${record.slug}-${style.replaceAll("_", "-")}.png`;
    statuses[style] = "pendente";
    uids[style] = record.uids_variacoes?.[style] || `${record.uid}-${style.toUpperCase()}`;
    cardCodes[style] = record.card_codes_variacoes?.[style]
      || `${record.card_code}-${style.toUpperCase()}`;
  }

  const identities = identityDefinitions(record.numero);
  record.variacoes_planejadas = [...ACTIVE_STYLES];
  record.estilos_visuais_ativos = [...ACTIVE_STYLES];
  record.assets_variacoes_futuras = assets;
  record.status_variacoes = statuses;
  record.variacoes_criadas = [];
  record.uids_variacoes = uids;
  record.card_codes_variacoes = cardCodes;
  record.variacoes_descontinuadas = discontinued;
  record.identidades_avatar = identities;
  record.identidade_avatar = Object.fromEntries(
    identities.map((item) => [item.estilo_visual, item.identidade_avatar]),
  );
  record.apresentacao_visual = Object.fromEntries(
    identities.map((item) => [item.estilo_visual, item.apresentacao_visual]),
  );
  record.nomes_publicos_identidades = Object.fromEntries(
    identities.map((item) => [item.estilo_visual, item.nome_publico]),
  );
  record.status_imagem = "pendente";

  appendHistory(record, {
    evento: MIGRATION_EVENT,
    registrado_em: MIGRATION_DATE,
    status_anterior: "variacoes_criadas",
    status_novo: "pendente",
    motivo: RESET_REASON,
    assets_arquivados: [
      oldPadraoAsset,
      ...ACTIVE_STYLES.map((style) => assets[style]),
    ].map((asset) => archivedAsset(asset, "avatares")),
  });
}

function migrateRecord(record) {
  if (record.numero === "001") return;

  const oldStatus = record.status_imagem || "pendente";
  const oldAsset = record.asset_futuro || null;
  if (record.tipo_personagem === "avatar_usuario" || record.tipo === "avatar_usuario") {
    migrateAvatar(record);
  } else {
    record.status_imagem = "pendente";
    appendHistory(record, {
      evento: MIGRATION_EVENT,
      registrado_em: MIGRATION_DATE,
      status_anterior: oldStatus,
      status_novo: "pendente",
      motivo: RESET_REASON,
      asset_anterior: oldAsset,
      asset_arquivado: oldStatus === "criada"
        ? archivedAsset(oldAsset, record.numero === "201" ? "especiais" : "personagens")
        : null,
    });
  }

  if (record.apresentacao_editorial === "inclusiva") {
    record.apresentacao_editorial = "neutra";
  }
}

const manifest = readJson("data/personagens/index.json");
let total = 0;
let avatars = 0;
let reset = 0;

for (const source of manifest.fontes) {
  const absolute = fromRoot(source.arquivo);
  const payload = JSON.parse(fs.readFileSync(absolute, "utf8"));
  const records = Array.isArray(payload.registros) ? payload.registros : [];
  for (const record of records) {
    total += 1;
    if (record.numero !== "001") reset += 1;
    if (record.tipo_personagem === "avatar_usuario" || record.tipo === "avatar_usuario") avatars += 1;
    migrateRecord(record);
  }
  writeJson(source.arquivo, payload);
}

if (total !== manifest.total_esperado) {
  throw new Error(`Total migrado divergente: ${total}/${manifest.total_esperado}`);
}

console.log(JSON.stringify({
  total_preservado: total,
  registros_resetados: reset,
  avatares_migrados: avatars,
  estilos_ativos: ACTIVE_STYLES,
  estilo_descontinuado: "padrao",
}, null, 2));
