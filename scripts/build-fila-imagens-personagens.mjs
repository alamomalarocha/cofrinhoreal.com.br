import { readJson, writeCsv, writeJson } from "./catalogo-lib.mjs";

const people = readJson("data/vila-pig-personagens.json");

const sensitiveTypes = new Set([
  "perfil_comunitario_pesquisa",
  "personagem_folclorico_pesquisa",
  "personagem_futuro_reservado",
]);

const rows = [];

function addRow(person, overrides = {}) {
  const blocked = overrides.bloqueada ?? (!person.publicavel || sensitiveTypes.has(person.tipo_personagem));
  rows.push({
    numero: person.numero,
    uid: overrides.uid || person.uid,
    nome: person.nome,
    slug: person.slug,
    categoria: person.categoria || person.tipo_personagem || person.tipo,
    regiao: person.regiao || "",
    uf: person.uf || "",
    familia: person.familia_uid || "",
    profissao: person.profissao_atual?.titulo || "",
    estilo: overrides.estilo || "principal",
    visual_brief: overrides.visual_brief || person.visual_brief || person.ideia_visual || "",
    asset_futuro: overrides.asset_futuro || person.asset_futuro,
    status_imagem: overrides.status_imagem || person.status_imagem || "pendente",
    publicavel: Boolean(person.publicavel),
    status_pesquisa: person.status_pesquisa || "",
    status_revisao_cultural: person.status_revisao_cultural || "",
    prioridade: overrides.prioridade ?? (blocked ? 90 : 30),
    situacao_fila: blocked ? "bloqueada_revisao" : "pronta_para_criacao",
    motivo_prioridade:
      overrides.motivo_prioridade ||
      (blocked
        ? "Aguardar pesquisa, consulta ou revisao cultural antes de definir imagem."
        : "Personagem publico com imagem pendente."),
  });
}

for (const person of people) {
  if (person.tipo_personagem === "avatar_usuario" || person.tipo === "avatar_usuario") {
    for (const style of person.variacoes_planejadas || []) {
      const status = person.status_variacoes?.[style] || "pendente";
      if (status === "criada") continue;
      addRow(person, {
        uid: person.uids_variacoes?.[style] || `${person.uid}-${style}`,
        estilo: style,
        asset_futuro: person.assets_variacoes_futuras?.[style],
        status_imagem: status,
        prioridade: 10,
        bloqueada: false,
        motivo_prioridade: "Concluir primeiro a sequencia oficial dos avatares de fase de vida.",
      });
    }
    continue;
  }

  if (person.status_imagem !== "criada") {
    addRow(person, {
      prioridade: person.numero === "202" ? 20 : person.publicavel ? 30 : 90,
      motivo_prioridade:
        person.numero === "202"
          ? "Primeiro personagem publico apos a conclusao dos avatares."
          : undefined,
    });
  }
}

rows.sort((a, b) => {
  if (a.prioridade !== b.prioridade) return a.prioridade - b.prioridade;
  const numberOrder = Number(a.numero) - Number(b.numero);
  if (numberOrder) return numberOrder;
  return a.estilo.localeCompare(b.estilo, "pt-BR");
});

rows.forEach((row, index) => {
  row.ordem = index + 1;
});

const columns = [
  "ordem",
  "numero",
  "uid",
  "nome",
  "slug",
  "categoria",
  "regiao",
  "uf",
  "familia",
  "profissao",
  "estilo",
  "visual_brief",
  "asset_futuro",
  "status_imagem",
  "publicavel",
  "status_pesquisa",
  "status_revisao_cultural",
  "prioridade",
  "situacao_fila",
  "motivo_prioridade",
];

writeCsv("data/fila-imagens-personagens.csv", rows, columns);
writeJson("data/fila-imagens-personagens.json", {
  schema_version: "1.0.0",
  gerado_em: "2026-07-12",
  politica: {
    ordem: "avatares pendentes, personagens publicos, perfis bloqueados para revisao",
    bloqueio_cultural:
      "Nenhum perfil indigena, tradicional, folclorico ou futuro recebe imagem antes da pesquisa e revisao exigidas.",
  },
  total: rows.length,
  prontas_para_criacao: rows.filter((row) => row.situacao_fila === "pronta_para_criacao").length,
  bloqueadas_revisao: rows.filter((row) => row.situacao_fila === "bloqueada_revisao").length,
  itens: rows,
});

const first = rows[0];
if (!first || first.numero !== "202" || first.estilo !== "principal") {
  throw new Error("A fila deve iniciar por 202 - Mestre Satochi - principal apos concluir os avatares.");
}

for (const row of rows) {
  if (!row.asset_futuro) throw new Error(`Fila sem asset_futuro: ${row.numero}/${row.estilo}`);
}

console.log(
  JSON.stringify(
    {
      total: rows.length,
      prontas_para_criacao: rows.filter((row) => row.situacao_fila === "pronta_para_criacao").length,
      bloqueadas_revisao: rows.filter((row) => row.situacao_fila === "bloqueada_revisao").length,
      primeiro_item: first,
    },
    null,
    2
  )
);
