# Relatório da Revisão pt-BR 001

## Identificação

- Data: 2026-07-14.
- Workspace: `C:\Users\alamo\OneDrive\Documents\cofrinhoreal.com.br 2`.
- Branch: `main`.
- Commit-base: `dff56ef`.
- Checkpoint: `checkpoint-pre-reset-visual-automacao-imagens-2026-07`.
- Idioma editorial: português brasileiro (`pt-BR`).

## Escopo auditado

A revisão cobriu 234 arquivos textuais, incluindo páginas HTML, textos públicos gerados por JavaScript, fontes segmentadas do catálogo, JSON e CSV compilados, documentação, metadados, textos alternativos e rótulos de acessibilidade.

Na primeira execução consolidada após a migração visual, o auditor registrou 647 ocorrências editoriais. Após as correções nas fontes e a regeneração dos derivados, a execução final ficou limpa. A medida verificável adotada é:

- arquivos analisados na execução final: 234;
- ocorrências registradas no início da revisão: 647;
- erros residuais: 0;
- avisos residuais: 0;
- ocorrências residuais: 0;
- fontes normalizadas automaticamente: 45 arquivos analisados e 999 registros revisados na primeira passagem;
- arquivos derivados regenerados somente pelos compiladores oficiais do projeto.

## Correções realizadas

- Correção de ortografia, acentuação, pontuação, capitalização e espaçamento em textos editoriais.
- Padronização de formas públicas como **Pig Bebê**, **Pig Criança**, **Pig Pré-Adolescente**, **Pig Sênior** e **Arco-íris**.
- Separação explícita entre cópia editorial acentuada e identificadores técnicos estáveis.
- Inclusão de `nome_exibicao` no catálogo público para separar a grafia editorial dos identificadores técnicos.
- Preservação de slugs, caminhos, URLs, UIDs, códigos de card, chaves JSON e valores internos como `padrao` e `arco_iris`.
- Normalização da busca da Coleção Pig para encontrar nomes com ou sem acento, sem alterar o texto exibido.
- Confirmação de `lang="pt-BR"`, UTF-8 e textos públicos de acessibilidade.
- Correção nas fontes do catálogo e regeneração dos arquivos compilados e da fila de imagens.
- Preservação do posicionamento público atual: nenhuma ocorrência de `troco` permanece nas páginas HTML públicas.

O sistema de quatro variações foi substituído por três identidades visuais: Azul/Masculino, Rosa/Feminino e Arco-íris/Neutro.

## Fluxo antecipado de imagens

Foi criado `scripts/next-image-prompt.mjs`, que consulta a fila sem escrever arquivos e aceita o item atual por `--exclude`. O fluxo documentado agora determina que o Codex:

1. valide a imagem recebida;
2. identifique o próximo item sem repetir o atual;
3. envie o prompt visual puro antes de publicar a imagem recebida;
4. prossiga com catálogo, documentação, validação, commit e push;
5. encerre com um relatório curto.

O teste com exclusão do item atual retornou corretamente:

- próximo item: `202 - Mestre Satochi - principal`;
- slug: `mestre-satochi`;
- asset: `assets/characters/202-mestre-satochi.png`.

## Validações executadas

- Catálogo reconstruído: 3.251 registros totais, 2.652 publicáveis e 27 lotes públicos.
- Fila reconstruída: 3.270 itens, 2.671 prontos e 599 bloqueados.
- `validate-personagens-catalog.mjs`: aprovado, sem erros.
- `validate-universo-pig.mjs`: aprovado, sem erros ou avisos.
- `audit-pt-br.mjs`: 234 arquivos analisados, sem ocorrências.
- Verificação sintática de `script.js`, `personagens.js`, `audit-pt-br.mjs` e `next-image-prompt.mjs`: aprovada.
- `git diff --check`: sem erros de conteúdo; apenas avisos locais de conversão de fim de linha.

## Pendências e ressalvas

- O validador mantém um aviso informativo de cobertura: existem 100 posições de pesquisa de folclore ainda sem pesquisa marcada como concluída.
- Nomes próprios, autodenominações indígenas, termos religiosos, culturais, estrangeiros e expressões regionais não devem receber correção automática sem fonte ou revisão especializada.
- As páginas legais receberam somente revisão linguística. O conteúdo não constitui parecer jurídico nem confirmação de conformidade e deve passar por revisão profissional antes de uso definitivo.

## Revisão visual concluída

- Desktop validado em largura útil de 1.280 px na página inicial e na Coleção Pig, sem overflow horizontal, imagens visíveis quebradas ou mensagens no console.
- Mobile validado em 390 x 844 px na página inicial e na Coleção Pig, com logo, menu, tipografia e cartões responsivos, sem overflow horizontal.
- A busca da Coleção Pig retornou os mesmos resultados com `pre-adolescente` e `Pré-Adolescente`.
- O filtro `Arco-íris`, a paginação e o menu mobile funcionaram como esperado.
- Uma verificação visual específica de tablet continua recomendada quando houver nova mudança estrutural de layout; nesta revisão, os mesmos breakpoints responsivos permaneceram estáveis entre desktop e mobile.

## Limites preservados

O projeto continua sendo um protótipo visual estático. Esta revisão não criou backend, banco real, login real, integração PIX, aplicativo real, criptomoeda ou movimentação financeira.
