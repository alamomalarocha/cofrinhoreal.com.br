import { readJson, writeCsv, writeJson } from "./catalogo-lib.mjs";

const people = readJson("data/vila-pig-personagens.json");

const sensitiveTypes = new Set([
  "perfil_comunitario_pesquisa",
  "personagem_folclorico_pesquisa",
  "personagem_futuro_reservado",
]);

const avatarStyleOrder = new Map([
  ["azul", 0],
  ["rosa", 1],
  ["arco_iris", 2],
]);

const rows = [];

const avatarAgeCopy = {
  "002": "Porquinho bebê de 0 a 2 anos",
  "003": "Porquinho infantil de 3 a 5 anos",
  "004": "Porquinho criança de 6 a 9 anos",
  "005": "Porquinho pré-adolescente de 10 a 12 anos",
  "006": "Porquinho adolescente de 13 a 17 anos",
  "007": "Porquinho jovem de 18 a 24 anos",
  "008": "Porquinho jovem adulto de 25 a 34 anos",
  "009": "Porquinho adulto de 35 a 49 anos",
  "010": "Porquinho maduro de 50 a 64 anos",
  "011": "Porquinho sênior de 65 anos ou mais",
};

function avatarClothing(number, style) {
  const bottom = Number(number) <= 6 ? "short" : "calça";
  if (style === "azul") {
    return `camisa azul lisa, ${bottom} azul-claro e tênis branco simples`;
  }
  if (style === "rosa") {
    return `camisa rosa lisa, ${bottom} rosa-claro e tênis branco simples`;
  }
  return `camisa com listras fortes de arco-íris em vermelho, laranja, amarelo, verde, azul e roxo, ${bottom} off-white e tênis branco simples`;
}

function avatarVisualBrief(person) {
  const pose = person.numero === "002" ? "sentado" : "em pé";
  return `${avatarAgeCopy[person.numero] || "Porquinho do universo Cofrinho Real"}, corpo inteiro, ${pose}, centralizado, estilo 3D/cartoon premium, coerente com o Pig Principal do Cofrinho Real`;
}

function addRow(person, overrides = {}) {
  const blocked = overrides.bloqueada ?? (!person.publicavel || sensitiveTypes.has(person.tipo_personagem));
  rows.push({
    numero: person.numero,
    uid: overrides.uid || person.uid,
    nome: person.nome_exibicao || person.nome,
    slug: person.slug,
    categoria: person.categoria || person.tipo_personagem || person.tipo,
    regiao: person.regiao || "",
    uf: person.uf || "",
    familia: person.familia_uid || "",
    profissao:
      person.profissao_atual?.nome_exibicao ||
      person.profissao_atual?.titulo ||
      "",
    estilo: overrides.estilo || "principal",
    faixa_etaria: person.faixa_etaria || "",
    fase_vida: person.fase_vida || "",
    identidade_avatar: overrides.identidade_avatar || person.identidade_avatar || "",
    apresentacao_visual: overrides.apresentacao_visual || person.apresentacao_visual || "",
    nome_publico_identidade: overrides.nome_publico_identidade || person.nome_publico_identidade || "",
    roupa: overrides.roupa || "",
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
        ? "Aguardar pesquisa, consulta ou revisão cultural antes de definir imagem."
        : "Personagem público com imagem pendente."),
  });
}

function queuePriority(person) {
  if (person.numero === "201") return 20;
  if (person.numero === "202") return 21;
  if (person.tipo_personagem?.includes("especial")) return 30;
  if (person.tipo_personagem === "personagem_vila") return 40;
  if (person.tipo_personagem === "profissao" || person.classificacao_principal === "profissao") return 50;
  if (person.tipo_personagem === "personagem_regional") return 60;
  if (person.familia_uid || person.familia_id) return 70;
  if ((person.origens_culturais || []).length && person.status_revisao_cultural === "aprovado") return 80;
  if (person.publicavel) return 85;
  return 90;
}

for (const person of people) {
  if (person.tipo_personagem === "avatar_usuario" || person.tipo === "avatar_usuario") {
    for (const style of person.variacoes_planejadas || []) {
      if (!avatarStyleOrder.has(style)) continue;
      const status = person.status_variacoes?.[style] || "pendente";
      if (status === "criada") continue;
      addRow(person, {
        uid: person.uids_variacoes?.[style] || `${person.uid}-${style}`,
        estilo: style,
        identidade_avatar: person.identidade_avatar?.[style] || "",
        apresentacao_visual: person.apresentacao_visual?.[style] || "",
        nome_publico_identidade: person.nomes_publicos_identidades?.[style] || "",
        roupa: avatarClothing(person.numero, style),
        visual_brief: avatarVisualBrief(person),
        asset_futuro: person.assets_variacoes_futuras?.[style],
        status_imagem: status,
        prioridade: 10,
        bloqueada: false,
        motivo_prioridade: "Concluir primeiro a sequência oficial dos avatares de fase de vida.",
      });
    }
    continue;
  }

  if (person.status_imagem !== "criada") {
    addRow(person, {
      prioridade: queuePriority(person),
      motivo_prioridade:
        person.numero === "201"
          ? "Primeiro personagem especial após a conclusão dos avatares."
          : person.numero === "202"
            ? "Segundo personagem especial após a conclusão dos avatares."
          : undefined,
    });
  }
}

rows.sort((a, b) => {
  if (a.prioridade !== b.prioridade) return a.prioridade - b.prioridade;
  const numberOrder = Number(a.numero) - Number(b.numero);
  if (numberOrder) return numberOrder;
  const styleOrder = (avatarStyleOrder.get(a.estilo) ?? 99) - (avatarStyleOrder.get(b.estilo) ?? 99);
  return styleOrder || a.estilo.localeCompare(b.estilo, "pt-BR");
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
  "faixa_etaria",
  "fase_vida",
  "identidade_avatar",
  "apresentacao_visual",
  "nome_publico_identidade",
  "roupa",
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
  gerado_em: "2026-07-14",
  politica: {
    ordem: "avatares em azul, rosa e arco-iris; Vantajinho; Mestre Satochi; especiais; publicos; profissoes; regioes; familias; cultura aprovada; demais; sensiveis bloqueados",
    bloqueio_cultural:
      "Nenhum perfil indigena, tradicional, folclorico ou futuro recebe imagem antes da pesquisa e revisao exigidas.",
  },
  total: rows.length,
  prontas_para_criacao: rows.filter((row) => row.situacao_fila === "pronta_para_criacao").length,
  bloqueadas_revisao: rows.filter((row) => row.situacao_fila === "bloqueada_revisao").length,
  itens: rows,
});

const first = rows[0];
if (!first || first.numero !== "002" || first.estilo !== "azul") {
  throw new Error("A fila deve iniciar por 002 - Pig Bebe - azul.");
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
