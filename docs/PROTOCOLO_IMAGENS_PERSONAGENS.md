# Protocolo Oficial de Imagens dos Personagens

Este documento define o fluxo oficial para criacao, recebimento, arquivamento e versionamento das imagens dos personagens da Vila Pig / Familia Pig.

## Regras obrigatorias

- Nao recriar personagens.
- Nao alterar a sequencia dos personagens.
- Nao mudar nomes, numeros ou slugs ja cadastrados.
- Nao trabalhar em lote.
- Nao pedir proximos 5 personagens.
- Nao criar imagens automaticamente dentro do Codex.
- Nao separar painel com varios personagens.
- Nao inventar arquivos inexistentes.
- Nao criar backend, banco real, login real, PIX real, app real ou movimentacao real.

## Base oficial

A base oficial de personagens esta em:

- `data/vila-pig-personagens.json`
- `data/vila-pig-personagens.csv`

Cada personagem possui:

- `numero`
- `nome`
- `slug`
- `asset_futuro`
- `status_imagem`

## Padrao oficial de arquivo

Cada imagem oficial deve ser salva em:

```text
assets/characters/NUMERO-SLUG.png
```

Exemplos:

```text
assets/characters/001-pig-principal.png
assets/characters/002-pig-bebe.png
assets/characters/003-pig-primeirinhos.png
assets/characters/012-pinguinha.png
assets/characters/017-vovo-zefa.png
```

## Fluxo oficial guiado

O fluxo oficial de imagens da Vila Pig / Familia Pig e guiado uma imagem por vez.

1. Alamo envia uma imagem de personagem para o Codex.
2. O Codex salva essa imagem exatamente no caminho definido em `asset_futuro`.
3. O Codex atualiza:
   - `data/vila-pig-personagens.json`
   - `data/vila-pig-personagens.csv`
   - `docs/PERSONAGENS_VILA_PIG.md`
   - `docs/ASSETS_PERSONAGENS.md`
   - `docs/PLANO_IMAGENS_PERSONAGENS_001.md`
4. O campo `status_imagem` muda de `"pendente"` para `"criada"`.
5. O Codex faz commit e push.
6. O Codex responde confirmando que salvou a imagem e que Alamo pode mandar a proxima.
7. O Codex informa apenas o proximo personagem pendente da sequencia.
8. O Codex fornece tres blocos separados:
   - dados tecnicos do proximo personagem;
   - prompt visual limpo para Alamo mandar ao ChatGPT Images;
   - prompt tecnico para Alamo mandar de volta ao Codex quando a imagem estiver pronta.

## Separacao obrigatoria entre imagem e dados tecnicos

O ChatGPT Images deve receber apenas um prompt visual limpo.

O prompt visual limpo nao deve conter:

- numero do personagem;
- slug;
- nome do arquivo;
- caminho `assets/characters`;
- `asset_futuro`;
- instrucoes de commit;
- instrucoes de JSON ou CSV;
- instrucoes de documentacao;
- palavras como "prompt";
- blocos tecnicos;
- listas longas com dados internos do projeto.

Essas informacoes tecnicas devem aparecer apenas nos blocos de dados do personagem e no prompt para o Codex salvar a imagem.

O prompt visual limpo deve conter somente a descricao artistica:

- tipo de personagem;
- faixa etaria ou papel visual;
- personalidade;
- roupa e acessorios;
- estilo visual;
- pose;
- fundo transparente;
- restricoes visuais como sem texto, sem numeros, sem cenario e sem outros personagens.

## Conceito dos avatares por idade

Antes de criar novas imagens, manter esta separacao:

- `001 - Pig Principal`: mascote/guia da marca.
- `002` a `011`: avatares base/padrao por faixa etaria do usuario.
- `012` em diante: personagens fixos da Vila Pig / Familia Pig.

O Avatar Pig do usuario e uma personalizacao visual opcional. A pergunta oficial e:

> Como voce quer personalizar seu Pig?

Texto de apoio:

> Voce pode mudar isso depois.

As opcoes publicas sao:

- Pig Azul;
- Pig Rosa;
- Pig Arco-iris;
- Pig Padrao.

As opcoes de avatar sao estilos visuais: Pig Azul, Pig Rosa, Pig Arco-iris e Pig Padrao. Elas nao representam declaracao obrigatoria de identidade pessoal.

Internamente, usar apenas `avatar_style: azul`, `avatar_style: rosa`, `avatar_style: arco_iris` e `avatar_style: padrao`.

A solicitacao atual iniciou o fluxo guiado de variacoes dos avatares, sempre uma imagem por vez: Pig Bebe Padrao, Pig Bebe Azul, Pig Bebe Rosa, Pig Bebe Arco-iris e assim por diante ate o Pig Senior.

## Formato obrigatorio da resposta apos salvar uma imagem

Depois de cada imagem salva, a resposta do Codex deve seguir este formato:

```text
==================================================
IMAGEM SALVA
==================================================

Imagem salva com sucesso.

Personagem atualizado:
- numero:
- nome:
- slug:
- arquivo:
- status_imagem: criada

Commit:
- [hash e mensagem]

Pode mandar a proxima imagem.

==================================================
PROXIMO PERSONAGEM PENDENTE
==================================================

- numero:
- nome:
- slug:
- asset_futuro:

==================================================
PROMPT VISUAL LIMPO PARA CHATGPT IMAGES
==================================================

[Colocar aqui apenas a descricao artistica, sem numero, sem slug, sem nome de arquivo, sem caminho tecnico, sem instrucoes de commit, sem JSON, sem CSV e sem documentacao.]

==================================================
PROMPT PARA MANDAR AO CODEX QUANDO A IMAGEM ESTIVER PRONTA
==================================================

Estou enviando a imagem oficial do personagem:

[NUMERO] - [NOME]
slug: [SLUG]
arquivo correto:
[ASSET_FUTURO]

Tarefas:
1. Salvar a imagem enviada em:
[ASSET_FUTURO]

2. Atualizar:
- data/vila-pig-personagens.json
- data/vila-pig-personagens.csv
- docs/PERSONAGENS_VILA_PIG.md
- docs/ASSETS_PERSONAGENS.md
- docs/PLANO_IMAGENS_PERSONAGENS_001.md

3. No personagem [NUMERO] - [NOME]:
- status_imagem deve mudar de "pendente" para "criada"
- asset_futuro deve continuar apontando para:
[ASSET_FUTURO]

4. Fazer commit e push com a mensagem:
Add character [NUMERO] [NOME] image

5. Depois me informe:
- arquivo salvo;
- personagem atualizado;
- status_imagem atualizado;
- commit criado;
- push realizado;
- proximo personagem pendente da sequencia, com numero, nome, slug e asset_futuro;
- prompt visual limpo para ChatGPT Images criar a proxima imagem;
- prompt tecnico para Codex salvar a proxima imagem.

Importante:
Nao criar backend.
Nao criar banco real.
Nao criar login real.
Nao integrar PIX real.
Nao criar app real.
Nao criar movimentacao real.
```

## Exemplo de atualizacao de personagem

Quando uma imagem for enviada como:

```text
001 - Pig Principal
slug: pig-principal
```

Ela deve ser salva em:

```text
assets/characters/001-pig-principal.png
```

O personagem `001` deve ser atualizado para:

```json
"status_imagem": "criada"
```

O campo `asset_futuro` deve continuar igual:

```text
assets/characters/001-pig-principal.png
```

## Direcao visual preferencial

As imagens futuras devem preferencialmente ser:

- PNG;
- fundo transparente;
- corpo inteiro;
- personagem em pe;
- centralizadas;
- consistentes entre si;
- prontas para cards colecionaveis, app, site, redes sociais e materiais.

## Estado atual

Em 2026-07-03:

- `001 - Pig Principal`: `status_imagem: "criada"`
- `002` em diante: `status_imagem: "pendente"`
- imagens antigas de `002` a `010`: movidas para `assets/characters/_drafts/` como rascunhos
- proximo personagem pendente: `002 - Pig Bebe`

O proximo arquivo oficial esperado e:

```text
assets/characters/002-pig-bebe.png
```

## Regra visual para imagens-base de avatares

Avatares do usuario devem ser imagens limpas do personagem, sem texto, letras, numeros, moedas, medalhas, placas, etiquetas, broches, patches, logotipos, monogramas ou simbolos escritos.

A imagem-base do avatar deve mostrar apenas o personagem. Moedas, PigCoins, simbolos e textos podem aparecer em telas, cards, jogos e pecas de interface, mas nao na imagem-base do avatar.

Se a geracao vier com texto, letra, numero, logotipo, simbolo indevido, moeda com letra, roupa com palavra, fundo nao transparente, cenario, painel ou outro personagem, a imagem deve ser descartada. Nao tentar corrigir a imagem antiga; gerar nova imagem do zero com prompt simplificado.

Checklist minimo para aceitar uma imagem de avatar:

- personagem unico;
- corpo inteiro;
- centralizado;
- fundo transparente;
- sem texto;
- sem letras;
- sem numeros;
- sem logos;
- sem moedas;
- sem medalhas;
- sem simbolos escritos;
- sem cenario;
- sem painel;
- sem outros personagens.

## Diferenca entre Pig Padrao e Pig Arco-iris

Pig Padrao e a opcao neutra/universal para quem prefere nao escolher. Ele segue a identidade do Pig Principal, equilibrando azul, rosa, amarelo/dourado, branco/off-white e azul escuro, sem predominancia forte de rosa, azul ou arco-iris.

Pig Arco-iris e a opcao visual colorida/inclusiva. Ele deve ter arco-iris claramente visivel, com roupa ou acessorios principais usando faixas ou linhas inspiradas em arco-iris. As cores vermelho, laranja, amarelo, verde, azul e lilas/roxo devem aparecer de forma organizada, mantendo visual infantil, bonito e limpo.

Nao tratar Pig Arco-iris como apenas detalhe pastel discreto. Ele precisa continuar reconhecivel como arco-iris mesmo em miniatura/card.

Nome publico principal: Pig Arco-iris. Se for necessario suavizar em algum material especifico, Pig Colorido pode aparecer apenas como apelido visual.

## Referencia aprovada do estilo Pig Arco-iris

A imagem `assets/characters/002-pig-bebe-arco-iris.png` e a primeira referencia visual aprovada para o estilo Pig Arco-iris.

Nos avatares estilo `arco_iris`, a roupa principal deve ter faixas fortes e reconheciveis de arco-iris, seguindo a referencia visual do arquivo `assets/characters/002-pig-bebe-arco-iris.png`. Nao usar apenas detalhes pastel discretos.

Prompts futuros de `arco_iris` devem pedir roupa principal com faixas fortes em vermelho, laranja, amarelo, verde, azul e roxo/lilas, mantendo visual neutro/universal e sem laco, flor, saia, acessorio feminino, bone ou elemento que puxe para masculino.

Frase obrigatoria para prompts futuros de avatar `arco_iris`:

> Visual arco-iris claramente visivel, com roupa principal usando faixas fortes de arco-iris em vermelho, laranja, amarelo, verde, azul e roxo/lilas, seguindo o mesmo padrao visual aprovado no avatar Pig Bebe arco-iris.

Nao voltar a usar prompts fracos como pequenos detalhes em arco-iris, tons pastel discretos, colorido suave sem faixas ou arco-iris apenas em acessorio pequeno.

## Reset visual dos avatares - camisa, calca/short e tenis

A partir deste reset, os avatares do usuario `002` a `011` devem usar uma base visual simples e consistente: camisa, calca/short e tenis. As variacoes `padrao`, `azul`, `rosa` e `arco_iris` mudam principalmente as cores dessas pecas.

Nao usar bones, chapeus, toucas, lacos, flores, saias, bolsas, brinquedos, moedas, medalhas, estrelas, simbolos, letras, numeros, logos, patches, etiquetas, broches, objetos circulares com marca, texto na roupa, cenario, painel ou outros personagens.

Roupa permitida:

- camisa lisa, exceto no estilo `arco_iris`, que pode ter faixas fortes de arco-iris;
- calca ou short simples;
- tenis simples.

Variações:

- `padrao`: camisa off-white/creme, calca ou short bege/creme/branco quente/cinza claro e tenis branco/off-white.
- `azul`: camisa azul lisa, calca ou short azul ou claro e tenis branco/off-white com detalhe azul.
- `rosa`: camisa rosa lisa, calca ou short rosa ou claro e tenis branco/off-white com detalhe rosa.
- `arco_iris`: camisa com faixas fortes de arco-iris em vermelho, laranja, amarelo, verde, azul e roxo/lilas; calca ou short neutro; tenis branco/off-white com pequenos detalhes arco-iris.

As variacoes anteriores de avatar foram movidas para `assets/characters/_drafts/avatars/` como rascunhos e nao devem ser tratadas como assets oficiais.

## Atualizacao obrigatoria da Colecao Pig

Sempre que uma imagem oficial de personagem ou avatar for criada, atualizar tambem a pagina `personagens.html` / Colecao Pig, para que o card correspondente apareca no site.

A Colecao Pig deve continuar estatica, educativa e institucional: sem backend, sem banco real, sem login real, sem PIX real, sem movimentacao real, sem compra de cartas, sem raridade de aposta e sem loot box.

## Prompt visual ultra curto para avatares

Todo prompt visual de avatar enviado ao ChatGPT Images deve ser ultra curto, direto e isolado.

O prompt deve ter no maximo 8 linhas e comecar exatamente com:

```text
Crie do zero. Ignore prints, telas, logos, cards e imagens anteriores.
```

O prompt visual deve conter apenas:

- idade ou faixa;
- pose;
- roupa;
- cor;
- proibicoes essenciais;
- fundo transparente.

Nao usar textos longos, listas extensas, dados tecnicos, nome de arquivo, caminho, JSON, CSV, commit ou explicacoes do projeto.

Modelos oficiais:

Padrao:

```text
Crie do zero. Ignore prints, telas, logos, cards e imagens anteriores.
Porquinho [idade/faixa], corpo inteiro, em pe, centralizado, estilo 3D/cartoon premium.
Roupa: camisa lisa off-white, short bege claro, tenis branco simples.
Sem acessorios, sem texto, sem letras, sem numeros, sem simbolos, sem moeda, sem logo, sem cenario.
Fundo transparente.
```

Azul:

```text
Crie do zero. Ignore prints, telas, logos, cards e imagens anteriores.
Porquinho [idade/faixa], corpo inteiro, em pe, centralizado, estilo 3D/cartoon premium.
Roupa: camisa azul lisa, short azul claro, tenis branco simples.
Sem acessorios, sem texto, sem letras, sem numeros, sem simbolos, sem moeda, sem logo, sem cenario.
Fundo transparente.
```

Rosa:

```text
Crie do zero. Ignore prints, telas, logos, cards e imagens anteriores.
Porquinho [idade/faixa], corpo inteiro, em pe, centralizado, estilo 3D/cartoon premium.
Roupa: camisa rosa lisa, short rosa claro, tenis branco simples.
Sem acessorios, sem texto, sem letras, sem numeros, sem simbolos, sem moeda, sem logo, sem cenario.
Fundo transparente.
```

Arco-iris:

```text
Crie do zero. Ignore prints, telas, logos, cards e imagens anteriores.
Porquinho [idade/faixa], corpo inteiro, em pe, centralizado, estilo 3D/cartoon premium.
Roupa: camisa com listras horizontais fortes de arco-iris vermelho, laranja, amarelo, verde, azul e roxo; short off-white; tenis branco simples.
Sem acessorios, sem texto, sem letras, sem numeros, sem simbolos, sem moeda, sem logo, sem cenario.
Fundo transparente.
```

Excecao para `002 - Pig Bebe`: por ser bebe de 0 a 2 anos, pode ficar sentado. Usar `Porquinho bebe 0 a 2 anos, corpo inteiro, sentado, centralizado...`.

Regra para `003` a `011`: todos devem estar em pe. Usar sempre `corpo inteiro, em pe, centralizado`.

## Continuidade apos reorganizacao

A reorganizacao nao reinicia a fila. Sempre executar `node scripts/validate-universo-pig.mjs`, ler `status_variacoes` e confirmar o asset antes de sugerir o proximo prompt. O ponto preservado e `011 - Pig Senior - arco_iris`.

Personagens regionais, comunitarios, profissionais ou folcloricos exigem pesquisa e aprovacao conceitual antes do prompt visual.
