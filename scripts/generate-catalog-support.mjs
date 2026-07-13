import fs from "node:fs";

import { fromRoot, readJson, writeJson, writeText } from "./catalogo-lib.mjs";

const DATE = "2026-07-12";
const BASE_COMMIT = "dbb9857";
const CHECKPOINT = "checkpoint-pre-catalogo-brasileiro-completo-2026-07";

const people = readJson("data/vila-pig-personagens.json");
const report = readJson("data/relatorio-validacao-catalogo.json");
const families = readJson("data/familias-catalogo.json");
const professions = readJson("data/profissoes.json");
const folklore = readJson("data/folclore-brasileiro.json");
const queue = readJson("data/fila-imagens-personagens.json");
const sources = readJson("data/fontes-catalogo.json");
const metrics = report.metricas;

function markdownTable(entries, firstHeading) {
  return [
    `| ${firstHeading} | Personagens |`,
    "| --- | ---: |",
    ...Object.entries(entries).map(([key, value]) => `| ${key} | ${value} |`),
  ].join("\n");
}

function replaceGeneratedSection(relativePath, body) {
  const start = "<!-- CATALOGO_BRASILEIRO_INICIO -->";
  const end = "<!-- CATALOGO_BRASILEIRO_FIM -->";
  const target = fromRoot(relativePath);
  const current = fs.existsSync(target) ? fs.readFileSync(target, "utf8").trimEnd() : "";
  const section = `${start}\n${body.trim()}\n${end}`;
  const pattern = new RegExp(`${start}[\\s\\S]*?${end}`, "m");
  const updated = pattern.test(current)
    ? current.replace(pattern, section)
    : `${current}${current ? "\n\n" : ""}${section}`;
  writeText(relativePath, updated);
}

const decisions = [
  {
    id: "DEC-001",
    data: DATE,
    titulo: "Pig Principal como identidade universal publica",
    descricao: "O personagem 001 permanece mascote oficial e referencia visual antes de qualquer autenticacao futura.",
    motivo: "Preservar consistencia de marca sem inferir dados do visitante.",
    arquivos_afetados: ["assets/characters/001-pig-principal.png", "docs/IDENTIDADE_VISUAL.md"],
    status: "vigente",
    decisao_substituida: null,
    visibilidade: "publica",
    observacoes: "As logos completas continuam separadas em assets/brand/.",
  },
  {
    id: "DEC-002",
    data: DATE,
    titulo: "Prototipo visual estatico",
    descricao: "O projeto continua sem backend, banco real, login funcional, PIX real, aplicativo real ou movimentacao financeira.",
    motivo: "Manter o escopo de pesquisa e demonstracao visual.",
    arquivos_afetados: ["README.md", "PROMPT_MESTRE.md"],
    status: "vigente",
    decisao_substituida: null,
    visibilidade: "publica",
    observacoes: "Nenhum dado pessoal real deve ser coletado.",
  },
  {
    id: "DEC-003",
    data: DATE,
    titulo: "PigCoin como recurso educativo ficticio",
    descricao: "PigCoin nao e moeda, criptoativo, investimento, compra, saque, PIX ou promessa de valorizacao.",
    motivo: "Evitar confusao financeira e gamificacao predatoria.",
    arquivos_afetados: ["PROMPT_MESTRE.md", "docs/REPOSICIONAMENTO_PUBLICO_PIGCOIN.md"],
    status: "vigente",
    decisao_substituida: null,
    visibilidade: "publica",
    observacoes: "A comunicacao publica permanece educativa.",
  },
  {
    id: "DEC-004",
    data: DATE,
    titulo: "Estrategia interna nao exposta em documentos publicos",
    descricao: "Decisoes estrategicas reservadas devem permanecer fora do repositorio publico.",
    motivo: "Separar documentacao operacional publica de informacao confidencial.",
    arquivos_afetados: ["docs/DECISOES_PRIVADAS_TEMPLATE.md", ".gitignore"],
    status: "vigente",
    decisao_substituida: null,
    visibilidade: "publica",
    observacoes: "O template nao contem segredo nem descreve a estrategia reservada.",
  },
  {
    id: "DEC-005",
    data: DATE,
    titulo: "Avatares nao inferem identidade",
    descricao: "Estilo visual, cor ou variacao de avatar nao define genero, idade, orientacao, identidade ou permissao.",
    motivo: "Manter inclusao e privacidade por padrao.",
    arquivos_afetados: ["docs/AVATARES.md", "docs/PROTOCOLO_IMAGENS_PERSONAGENS.md"],
    status: "vigente",
    decisao_substituida: null,
    visibilidade: "publica",
    observacoes: "As variacoes sao apenas opcoes visuais.",
  },
  {
    id: "DEC-006",
    data: DATE,
    titulo: "Perfis culturais sensiveis bloqueados ate revisao",
    descricao: "Perfis indigenas, tradicionais e folcloricos permanecem nao publicaveis e sem imagem enquanto faltarem pesquisa e revisao adequadas.",
    motivo: "Completude nao autoriza inventar nomes, roupas, historias ou praticas culturais.",
    arquivos_afetados: ["data/povos-indigenas.json", "data/folclore-brasileiro.json", "data/fila-imagens-personagens.json"],
    status: "vigente",
    decisao_substituida: null,
    visibilidade: "publica",
    observacoes: `${metrics.total_nao_publicavel} registros estao bloqueados para pesquisa ou revisao.`,
  },
  {
    id: "DEC-007",
    data: DATE,
    titulo: "Catalogo compilado de fontes segmentadas",
    descricao: "Os registros fixos vivem em lotes de no maximo 100 e geram JSON, CSV e lotes publicos deterministicamente.",
    motivo: "Permitir escala, auditoria e reexecucao sem editar um arquivo monolitico manualmente.",
    arquivos_afetados: ["data/personagens/", "scripts/build-personagens-catalog.mjs"],
    status: "vigente",
    decisao_substituida: null,
    visibilidade: "publica",
    observacoes: `${metrics.lotes_fonte} lotes-fonte e ${metrics.lotes_publicos} lotes publicos.`,
  },
  {
    id: "DEC-008",
    data: DATE,
    titulo: "Imagens produzidas uma por vez",
    descricao: "O ChatGPT cria a imagem; o Codex salva, registra, valida, commita e devolve o proximo prompt.",
    motivo: "Preservar controle de qualidade e sequencia oficial.",
    arquivos_afetados: ["data/fila-imagens-personagens.csv", "docs/FILA_CRIACAO_IMAGENS.md"],
    status: "vigente",
    decisao_substituida: null,
    visibilidade: "publica",
    observacoes: `O proximo item e ${queue.itens[0].numero} - ${queue.itens[0].nome} - ${queue.itens[0].estilo}.`,
  },
  {
    id: "DEC-009",
    data: DATE,
    titulo: "Colecao Pig exibe somente perfis publicaveis",
    descricao: "A galeria publica consome lotes filtrados e nao inclui perfis culturais bloqueados.",
    motivo: "Impedir publicacao acidental de pesquisa incompleta.",
    arquivos_afetados: ["data/personagens-publicos/", "personagens.js"],
    status: "vigente",
    decisao_substituida: null,
    visibilidade: "publica",
    observacoes: `${metrics.total_publicavel} perfis publicaveis no catalogo atual.`,
  },
];

writeJson("data/decisoes-projeto.json", {
  schema_version: "1.0.0",
  atualizado_em: DATE,
  principio: "Fonte cumulativa de decisoes estruturais; substituicoes exigem referencia explicita.",
  decisoes: decisions,
});

const futurePeople = people.filter((person) => person.tipo_personagem === "personagem_futuro_reservado");
writeJson("data/profissoes-futuras.json", {
  schema_version: "1.0.0",
  atualizado_em: DATE,
  status_geral: "pesquisa_pendente",
  aviso: "Slots estaveis para hipoteses futuras. Nenhuma ocupacao, historia ou tendencia e tratada como fato confirmado.",
  fontes_base: ["mte-cbo-2002"],
  total_slots: futurePeople.length,
  slots: futurePeople.map((person) => ({
    id: person.uid,
    numero: person.numero,
    nome_status: person.nome_status,
    titulo_provisorio: null,
    slug: person.slug,
    familia_id: person.familia_id,
    asset_futuro: person.asset_futuro,
    status_pesquisa: person.status_pesquisa,
    status_revisao: person.status_revisao_cultural,
    publicavel: false,
  })),
});

const cultureBases = [
  ["data/cultura/comidas.json", "comidas", "Pratos, ingredientes, doces, frutas e bebidas nao alcoolicas"],
  ["data/cultura/festas.json", "festas", "Festas, celebracoes e brincadeiras"],
  ["data/cultura/musicas-dancas.json", "musicas_dancas", "Musicas, dancas e variacoes territoriais"],
  ["data/cultura/artesanato-oficios.json", "artesanato_oficios", "Artesanato, oficios, feiras e modos de fazer"],
];

for (const [file, kind, scope] of cultureBases) {
  writeJson(file, {
    schema_version: "1.0.0",
    atualizado_em: DATE,
    tipo: kind,
    escopo: scope,
    status: "estrutura_criada_pesquisa_pendente",
    politica: "Nao atribuir exclusividade territorial nem relacionar personagens sem fonte especifica e revisao.",
    fontes_prioritarias: ["iphan-patrimonio-imaterial", "fontes-estaduais", "fontes-comunitarias-confiaveis"],
    itens: [],
  });
}

const regionalTable = markdownTable(metrics.regioes, "Regiao");
const ufTable = markdownTable(metrics.ufs, "UF");
const professionCategoryCounts = Object.fromEntries(
  Object.entries(
    professions.profissoes.reduce((accumulator, profession) => {
      const key = profession.categoria || "sem_categoria";
      accumulator[key] = (accumulator[key] || 0) + 1;
      return accumulator;
    }, {})
  ).sort(([left], [right]) => left.localeCompare(right, "pt-BR"))
);

const docs = {
  "docs/DECISOES_MESTRAS_PROJETO.md": `# Decisoes Mestras do Projeto\n\nAtualizado em ${DATE}. A fonte estruturada correspondente e \`data/decisoes-projeto.json\`.\n\n## Regras de uso\n\n- Ler este documento antes de qualquer alteracao estrutural.\n- Nao apagar decisoes vigentes; registrar substituicoes explicitamente.\n- Nao guardar informacao confidencial no repositorio publico.\n- Preservar o escopo estatico e educativo enquanto nao houver nova decisao formal.\n\n## Decisoes vigentes\n\n${decisions.map((decision) => `### ${decision.id} - ${decision.titulo}\n\n${decision.descricao}\n\nMotivo: ${decision.motivo}\n\nStatus: \`${decision.status}\`. Visibilidade: \`${decision.visibilidade}\`.`).join("\n\n")}\n`,
  "docs/DECISOES_PRIVADAS_TEMPLATE.md": `# Template de Decisao Privada\n\nEste arquivo e apenas um modelo publico e nao contem informacao confidencial. O conteudo real deve ficar fora do repositorio, em local privado aprovado.\n\n- ID:\n- Data:\n- Titulo:\n- Responsavel:\n- Descricao reservada:\n- Motivo:\n- Arquivos ou areas afetadas:\n- Status:\n- Decisao substituida:\n- Data de revisao:\n`,
  "docs/CATALOGO_BRASILEIRO_PERSONAGENS.md": `# Catalogo Brasileiro de Personagens\n\n## Resultado atual\n\n- ${metrics.total_personagens} registros fixos compilados.\n- ${metrics.total_publicavel} perfis publicaveis.\n- ${metrics.total_nao_publicavel} perfis internos aguardando pesquisa ou revisao.\n- ${metrics.familias} nucleos familiares, comunitarios ou editoriais.\n- ${metrics.lotes_fonte} lotes-fonte com no maximo 100 registros.\n- ${metrics.lotes_publicos} lotes para carregamento progressivo.\n\n## Arquitetura\n\nOs arquivos em \`data/personagens/\` sao fontes fixas. \`scripts/build-personagens-catalog.mjs\` gera os arquivos monoliticos de compatibilidade e os lotes publicos. \`scripts/validate-personagens-catalog.mjs\` valida unicidade, cobertura, caminhos, familias e estados de pesquisa.\n\n## Limite editorial\n\nQuantidade nao equivale a pesquisa cultural concluida. Perfis sensiveis permanecem internos ate revisao apropriada.\n`,
  "docs/COBERTURA_ETNICO_CULTURAL.md": `# Cobertura Etnico-Cultural\n\n## Slots catalogados\n\n- ${metrics.povos_indigenas} nomes oficiais de povos, etnias ou grupos indigenas importados da base do IBGE.\n- ${metrics.perfis_indigenas} perfis internos associados, todos bloqueados para consulta e revisao especializada.\n- ${metrics.comunidades_tradicionais} segmentos de povos e comunidades tradicionais.\n- ${metrics.perfis_comunidades_tradicionais} perfis internos associados.\n- ${metrics.migracoes} slots migratorios e ${metrics.familias_mistas} familias mistas planejadas.\n\n## Regra de publicacao\n\nNenhum slot cultural sensivel e uma representacao pronta. Nomes pessoais, roupas, historias, territorios e imagens nao podem ser inventados. \`publicavel: false\` permanece obrigatorio ate pesquisa e revisao.\n`,
  "docs/COBERTURA_REGIONAL_UFS.md": `# Cobertura Regional e por UF\n\n## Regioes\n\n${regionalTable}\n\n## Unidades federativas\n\n${ufTable}\n\nA distribuicao usa capitais e municipios do interior e inclui contextos urbanos e rurais. Os personagens sao ficticios e nao representam sozinhos toda a diversidade de seu estado.\n`,
  "docs/COBERTURA_PROFISSOES.md": `# Cobertura de Profissoes\n\n- ${metrics.profissoes_catalogadas} ocupacoes catalogadas.\n- ${professions.total_cbo_importado} ocupacoes importadas da CBO.\n- ${metrics.profissoes_atribuidas_distintas} ocupacoes distintas atribuidas aos personagens, acima da meta de 600.\n- ${futurePeople.length} slots futuros estaveis e nao publicaveis.\n\n## Categorias catalogadas\n\n${markdownTable(professionCategoryCounts, "Categoria")}\n\nProfissoes futuras sao hipoteses de pesquisa, nao previsoes nem fatos. Consulte \`data/profissoes-futuras.json\`.\n`,
  "docs/COBERTURA_FOLCLORE.md": `# Cobertura de Folclore\n\n- ${metrics.figuras_folcloricas} figuras ou variacoes possuem slots internos.\n- ${metrics.folclore_pesquisa_concluida} estao marcadas como pesquisa concluida.\n- ${folklore.figuras.length} entradas existem na base estruturada.\n\n## Aviso obrigatorio\n\nA meta quantitativa de slots foi atingida, mas a pesquisa cultural nao foi concluida. Nenhum desses slots deve receber nome adicional, historia, visual ou publicacao sem fontes territoriais confiaveis. Nao copiar adaptacoes protegidas.\n`,
  "docs/FAMILIAS_CATALOGO_COMPLETO.md": `# Familias do Catalogo Completo\n\nO catalogo possui ${families.total} nucleos. Eles incluem ${Object.values(metrics.ufs).reduce((sum, value) => sum + value, 0) / 3} nucleos regionais de tres membros, alem de nucleos educativos e slots internos de pesquisa.\n\nCada familia usa UID estavel e lista de membros. Relacoes culturais incompletas permanecem vazias em vez de serem preenchidas por suposicao.\n`,
  "docs/GUIA_NOMES_PERSONAGENS.md": `# Guia de Nomes dos Personagens\n\n- Nomes publicos genericos usam combinacoes fixas e variadas com referencia ao IBGE Nomes no Brasil.\n- Nomes completos e slugs devem permanecer unicos.\n- Repeticao natural de prenomes e permitida.\n- Nao criar trocadilhos com etnia, religiao, deficiencia, pobreza ou origem.\n- Nao inventar nomes tradicionais indigenas ou comunitarios.\n- Quando faltar fonte segura, usar \`nome_status: aguardando_pesquisa_cultural\` e manter o perfil nao publicavel.\n`,
  "docs/REVISAO_CULTURAL_PERSONAGENS.md": `# Revisao Cultural de Personagens\n\n## Estados\n\n- \`confirmado\`: pesquisa documental suficiente para o campo.\n- \`parcial\`: conteudo generico, ainda limitado.\n- \`pendente\`: pesquisa nao iniciada ou incompleta.\n- \`requer_consulta\`: depende de consulta cultural ou territorial.\n- \`requer_especialista\`: nao publicar nem criar imagem antes da revisao.\n\n## Bloqueios atuais\n\n${queue.bloqueadas_revisao} itens da fila estao bloqueados. A fila nunca deve converter bloqueio cultural em prioridade de imagem automaticamente.\n`,
  "docs/FILA_CRIACAO_IMAGENS.md": `# Fila de Criacao de Imagens\n\nA fila e gerada por \`scripts/build-fila-imagens-personagens.mjs\`.\n\n- Total: ${queue.total}.\n- Prontas para criacao: ${queue.prontas_para_criacao}.\n- Bloqueadas para revisao: ${queue.bloqueadas_revisao}.\n- Primeiro item: ${queue.itens[0].numero} - ${queue.itens[0].nome} - ${queue.itens[0].estilo}.\n- Arquivo: \`${queue.itens[0].asset_futuro}\`.\n\nFluxo: Codex informa o prompt visual; ChatGPT cria uma imagem; Alamo envia a imagem; Codex salva, registra, valida, commita e publica. O processo continua uma imagem por vez.\n`,
  "docs/CHECKPOINT_CATALOGO_PERSONAGENS_001.md": `# Checkpoint do Catalogo de Personagens 001\n\n- Data: ${DATE}.\n- Commit base: \`${BASE_COMMIT}\`.\n- Tag: \`${CHECKPOINT}\`.\n- Personagens antes da expansao: 201.\n- Personagens depois da compilacao atual: ${metrics.total_personagens}.\n- Imagens principais preservadas no checkpoint: ${metrics.imagens_principais_criadas}.\n- Variacoes de avatar criadas preservadas: ${metrics.variacoes_criadas}.\n\nNao houve reescrita de historico, renumeracao ou force push.\n`,
  "docs/RELATORIO_EXPANSAO_CATALOGO_001.md": `# Relatorio de Expansao do Catalogo 001\n\n## Entrega\n\nO catalogo passou de 201 para ${metrics.total_personagens} registros fixos. Foram criadas fontes segmentadas, compilador, validador estrito, ${metrics.familias} familias, cobertura das 27 UFs, ${metrics.perfis_indigenas} slots indigenas, ${metrics.perfis_comunidades_tradicionais} slots tradicionais, ${metrics.migracoes} slots migratorios, ${metrics.familias_mistas} familias mistas e ${metrics.figuras_folcloricas} slots folcloricos.\n\n## Pesquisa pendente\n\nA expansao nao declara pesquisa cultural completa. Folclore, perfis indigenas, comunidades tradicionais, migracoes especificas e cultura material exigem revisao posterior. Esses registros permanecem nao publicaveis quando necessario.\n\n## Proxima acao operacional\n\nCriar \`${queue.itens[0].asset_futuro}\` e continuar pela fila deterministica.\n`,
};

for (const [file, content] of Object.entries(docs)) writeText(file, content);

const generatedStatus = `## Catalogo brasileiro compilado\n\nEm ${DATE}, o catalogo passou a ter ${metrics.total_personagens} registros fixos, ${metrics.familias} familias e cobertura das 27 UFs. As fontes ficam em \`data/personagens/\`; os arquivos monoliticos sao gerados. Perfis culturais sensiveis permanecem nao publicaveis ate pesquisa e revisao.\n\nReferencias: \`docs/CATALOGO_BRASILEIRO_PERSONAGENS.md\`, \`docs/REVISAO_CULTURAL_PERSONAGENS.md\` e \`data/relatorio-validacao-catalogo.json\`.`;

for (const file of [
  "docs/ARQUITETURA_UNIVERSO_PIG.md",
  "docs/MATRIZ_COBERTURA_PERSONAGENS.md",
  "docs/PLANO_EXPANSAO_PERSONAGENS.md",
  "docs/GUIA_VISUAL_PERSONAGENS.md",
  "docs/PERSONAGENS_VILA_PIG.md",
  "docs/FAMILIA_PIG.md",
  "docs/AVATARES.md",
  "docs/ASSETS_PERSONAGENS.md",
  "docs/PROTOCOLO_IMAGENS_PERSONAGENS.md",
  "docs/PLANO_IMAGENS_PERSONAGENS_001.md",
]) {
  replaceGeneratedSection(file, generatedStatus);
}

replaceGeneratedSection(
  "docs/README.md",
  `## Catalogo brasileiro completo\n\n- [Catalogo brasileiro](CATALOGO_BRASILEIRO_PERSONAGENS.md)\n- [Cobertura regional](COBERTURA_REGIONAL_UFS.md)\n- [Cobertura etnico-cultural](COBERTURA_ETNICO_CULTURAL.md)\n- [Cobertura de profissoes](COBERTURA_PROFISSOES.md)\n- [Cobertura de folclore](COBERTURA_FOLCLORE.md)\n- [Familias do catalogo](FAMILIAS_CATALOGO_COMPLETO.md)\n- [Revisao cultural](REVISAO_CULTURAL_PERSONAGENS.md)\n- [Fila de imagens](FILA_CRIACAO_IMAGENS.md)\n- [Decisoes mestras](DECISOES_MESTRAS_PROJETO.md)\n- [Relatorio da expansao](RELATORIO_EXPANSAO_CATALOGO_001.md)`
);

replaceGeneratedSection(
  "README.md",
  `## Catalogo brasileiro de personagens\n\nO repositorio compila ${metrics.total_personagens} registros fixos a partir de lotes segmentados em \`data/personagens/\`. A Colecao Pig publica apenas perfis liberados. Consulte \`docs/CATALOGO_BRASILEIRO_PERSONAGENS.md\` e \`data/relatorio-validacao-catalogo.json\`. O projeto continua um prototipo visual estatico.`
);

replaceGeneratedSection(
  "PROMPT_MESTRE.md",
  `## Leitura estrutural obrigatoria\n\nAntes de qualquer tarefa estrutural, ler docs/DECISOES_MESTRAS_PROJETO.md e data/decisoes-projeto.json.\n\nA expansao do catalogo nao autoriza publicar perfis culturais sensiveis, criar imagens bloqueadas ou expor estrategia interna.`
);

console.log(
  JSON.stringify(
    {
      decisoes: decisions.length,
      slots_profissoes_futuras: futurePeople.length,
      bases_culturais: cultureBases.length,
      documentos_criados: Object.keys(docs).length,
      documentos_atualizados: 13,
      fontes_catalogadas: sources.fontes?.length || sources.total || 0,
    },
    null,
    2
  )
);
