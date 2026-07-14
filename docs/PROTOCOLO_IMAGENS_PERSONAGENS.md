# Protocolo Oficial de Imagens dos Personagens

Este documento define o fluxo oficial para criação, recebimento, arquivamento e versionamento das imagens dos personagens da Vila Pig / Família Pig.

## Regras obrigatorias

- Não recriar personagens.
- Não alterar a sequencia dos personagens.
- Não mudar nomes, números ou slugs ja cadastrados.
- Não trabalhar em lote.
- Não pedir proximos 5 personagens.
- Não criar imagens automaticamente dentro do Codex.
- Não separar painel com vários personagens.
- Não inventar arquivos inexistentes.
- Não criar backend, banco real, login real, PIX real, app real ou movimentação real.

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

## Padrão oficial de arquivo

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

O fluxo oficial de imagens da Vila Pig / Família Pig e guiado uma imagem por vez.

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
6. O Codex responde confirmando que salvou a imagem e que Alamo pode mandar a próxima.
7. O Codex informa apenas o próximo personagem pendente da sequencia.
8. O Codex fornece tres blocos separados:
   - dados técnicos do próximo personagem;
   - prompt visual limpo para Alamo mandar ao ChatGPT Images;
   - prompt técnico para Alamo mandar de volta ao Codex quando a imagem estiver pronta.

## Separacao obrigatória entre imagem e dados técnicos

O ChatGPT Images deve receber apenas um prompt visual limpo.

O prompt visual limpo não deve conter:

- número do personagem;
- slug;
- nome do arquivo;
- caminho `assets/characters`;
- `asset_futuro`;
- instrucoes de commit;
- instrucoes de JSON ou CSV;
- instrucoes de documentação;
- palavras como "prompt";
- blocos técnicos;
- listas longas com dados internos do projeto.

Essas informações tecnicas devem aparecer apenas nos blocos de dados do personagem e no prompt para o Codex salvar a imagem.

O prompt visual limpo deve conter somente a descrição artistica:

- tipo de personagem;
- faixa etária ou papel visual;
- personalidade;
- roupa e acessórios;
- estilo visual;
- pose;
- fundo transparente;
- restrições visuais como sem texto, sem números, sem cenário e sem outros personagens.

## Conceito dos avatares por idade

Antes de criar novas imagens, manter esta separacao:

- `001 - Pig Principal`: mascote/guia da marca.
- `002` a `011`: avatares base/padrao por faixa etária do usuário.
- `012` em diante: personagens fixos da Vila Pig / Família Pig.

O Avatar Pig do usuário e uma personalização visual opcional. A pergunta oficial e:

> Como voce quer personalizar seu Pig?

Texto de apoio:

> Voce pode mudar isso depois.

As opções publicas são:

- Pig Azul;
- Pig Rosa;
- Pig Arco-íris;
- Pig Padrão.

As opções de avatar são estilos visuais: Pig Azul, Pig Rosa, Pig Arco-íris e Pig Padrão. Elas não representam declaracao obrigatória de identidade pessoal.

Internamente, usar apenas `avatar_style: azul`, `avatar_style: rosa`, `avatar_style: arco_iris` e `avatar_style: padrao`.

A solicitacao atual iniciou o fluxo guiado de variações dos avatares, sempre uma imagem por vez: Pig Bebê Padrão, Pig Bebê Azul, Pig Bebê Rosa, Pig Bebê Arco-íris e assim por diante até o Pig Sênior.

## Formato obrigatório da resposta apos salvar uma imagem

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

## Direção visual preferencial

As imagens futuras devem preferencialmente ser:

- PNG;
- fundo transparente;
- corpo inteiro;
- personagem em pe;
- centralizadas;
- consistentes entre si;
- prontas para cards colecionáveis, app, site, redes sociais e materiais.

## Estado atual

Em 2026-07-03:

- `001 - Pig Principal`: `status_imagem: "criada"`
- `002` em diante: `status_imagem: "pendente"`
- imagens antigas de `002` a `010`: movidas para `assets/characters/_drafts/` como rascunhos
- próximo personagem pendente: `002 - Pig Bebe`

O próximo arquivo oficial esperado e:

```text
assets/characters/002-pig-bebe.png
```

## Regra visual para imagens-base de avatares

Avatares do usuário devem ser imagens limpas do personagem, sem texto, letras, números, moedas, medalhas, placas, etiquetas, broches, patches, logotipos, monogramas ou símbolos escritos.

A imagem-base do avatar deve mostrar apenas o personagem. Moedas, PigCoins, símbolos e textos podem aparecer em telas, cards, jogos e pecas de interface, mas não na imagem-base do avatar.

Se a geração vier com texto, letra, número, logotipo, símbolo indevido, moeda com letra, roupa com palavra, fundo não transparente, cenário, painel ou outro personagem, a imagem deve ser descartada. Não tentar corrigir a imagem antiga; gerar nova imagem do zero com prompt simplificado.

Checklist minimo para aceitar uma imagem de avatar:

- personagem único;
- corpo inteiro;
- centralizado;
- fundo transparente;
- sem texto;
- sem letras;
- sem números;
- sem logos;
- sem moedas;
- sem medalhas;
- sem símbolos escritos;
- sem cenário;
- sem painel;
- sem outros personagens.

## Diferença entre Pig Padrão e Pig Arco-íris

Pig Padrão e a opcao neutra/universal para quem prefere não escolher. Ele segue a identidade do Pig Principal, equilibrando azul, rosa, amarelo/dourado, branco/off-white e azul escuro, sem predominancia forte de rosa, azul ou arco-íris.

Pig Arco-íris e a opcao visual colorida/inclusiva. Ele deve ter arco-íris claramente visivel, com roupa ou acessórios principais usando faixas ou linhas inspiradas em arco-íris. As cores vermelho, laranja, amarelo, verde, azul e lilas/roxo devem aparecer de forma organizada, mantendo visual infantil, bonito e limpo.

Não tratar Pig Arco-íris como apenas detalhe pastel discreto. Ele precisa continuar reconhecivel como arco-íris mesmo em miniatura/card.

Nome público principal: Pig Arco-íris. Se for necessário suavizar em algum material especifico, Pig Colorido pode aparecer apenas como apelido visual.

## Referência aprovada do estilo Pig Arco-íris

A imagem `assets/characters/002-pig-bebe-arco-iris.png` e a primeira referência visual aprovada para o estilo Pig Arco-íris.

Nos avatares estilo `arco_iris`, a roupa principal deve ter faixas fortes e reconhecíveis de arco-íris, seguindo a referência visual do arquivo `assets/characters/002-pig-bebe-arco-iris.png`. Não usar apenas detalhes pastel discretos.

Prompts futuros de `arco_iris` devem pedir roupa principal com faixas fortes em vermelho, laranja, amarelo, verde, azul e roxo/lilas, mantendo visual neutro/universal e sem laço, flor, saia, acessorio feminino, boné ou elemento que puxe para masculino.

Frase obrigatória para prompts futuros de avatar `arco_iris`:

> Visual arco-íris claramente visivel, com roupa principal usando faixas fortes de arco-íris em vermelho, laranja, amarelo, verde, azul e roxo/lilas, seguindo o mesmo padrão visual aprovado no avatar Pig Bebê arco-íris.

Não voltar a usar prompts fracos como pequenos detalhes em arco-íris, tons pastel discretos, colorido suave sem faixas ou arco-íris apenas em acessorio pequeno.

## Reset visual dos avatares - camisa, calca/short e tênis

A partir deste reset, os avatares do usuário `002` a `011` devem usar uma base visual simples e consistente: camisa, calca/short e tênis. As variações `padrao`, `azul`, `rosa` e `arco_iris` mudam principalmente as cores dessas pecas.

Não usar bonés, chapéus, toucas, laços, flores, saias, bolsas, brinquedos, moedas, medalhas, estrelas, símbolos, letras, números, logos, patches, etiquetas, broches, objetos circulares com marca, texto na roupa, cenário, painel ou outros personagens.

Roupa permitida:

- camisa lisa, exceto no estilo `arco_iris`, que pode ter faixas fortes de arco-íris;
- calça ou short simples;
- tênis simples.

Variações:

- `padrao`: camisa off-white/creme, calça ou short bege/creme/branco quente/cinza claro e tênis branco/off-white.
- `azul`: camisa azul lisa, calça ou short azul ou claro e tênis branco/off-white com detalhe azul.
- `rosa`: camisa rosa lisa, calça ou short rosa ou claro e tênis branco/off-white com detalhe rosa.
- `arco_iris`: camisa com faixas fortes de arco-íris em vermelho, laranja, amarelo, verde, azul e roxo/lilas; calça ou short neutro; tênis branco/off-white com pequenos detalhes arco-íris.

As variações anteriores de avatar foram movidas para `assets/characters/_drafts/avatars/` como rascunhos e não devem ser tratadas como assets oficiais.

## Atualizacao obrigatória da Coleção Pig

Sempre que uma imagem oficial de personagem ou avatar for criada, atualizar tambem a página `personagens.html` / Coleção Pig, para que o card correspondente apareca no site.

A Coleção Pig deve continuar estática, educativa e institucional: sem backend, sem banco real, sem login real, sem PIX real, sem movimentação real, sem compra de cartas, sem raridade de aposta e sem loot box.

## Prompt visual ultra curto para avatares

Todo prompt visual de avatar enviado ao ChatGPT Images deve ser ultra curto, direto e isolado.

O prompt deve ter no máximo 8 linhas e comecar exatamente com:

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

Não usar textos longos, listas extensas, dados técnicos, nome de arquivo, caminho, JSON, CSV, commit ou explicações do projeto.

Modelos oficiais:

Padrão:

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

Arco-íris:

```text
Crie do zero. Ignore prints, telas, logos, cards e imagens anteriores.
Porquinho [idade/faixa], corpo inteiro, em pe, centralizado, estilo 3D/cartoon premium.
Roupa: camisa com listras horizontais fortes de arco-iris vermelho, laranja, amarelo, verde, azul e roxo; short off-white; tenis branco simples.
Sem acessorios, sem texto, sem letras, sem numeros, sem simbolos, sem moeda, sem logo, sem cenario.
Fundo transparente.
```

Exceção para `002 - Pig Bebe`: por ser bebê de 0 a 2 anos, pode ficar sentado. Usar `Porquinho bebe 0 a 2 anos, corpo inteiro, sentado, centralizado...`.

Regra para `003` a `011`: todos devem estar em pe. Usar sempre `corpo inteiro, em pe, centralizado`.

## Continuidade apos reorganizacao

A reorganizacao não reinicia a fila. Sempre executar `node scripts/validate-universo-pig.mjs`, ler `status_variacoes` e confirmar o asset antes de sugerir o próximo prompt. Os 40 avatares de fase de vida foram concluidos; o próximo item e `202 - Mestre Satochi - principal`.

Personagens regionais, comunitarios, profissionais ou folcloricos exigem pesquisa e aprovação conceitual antes do prompt visual.

## Fluxo antecipado da próxima imagem

Quando uma imagem oficial for recebida, o Codex deve validar o arquivo e enviar o prompt visual puro da próxima imagem antes de iniciar a publicação da imagem atual, permitindo criação e publicação em paralelo.

O fluxo obrigatório é:

1. validar personagem, número, slug, estilo, nome do arquivo, formato PNG e transparência;
2. rejeitar a imagem sem alterar arquivos quando houver fundo falso, texto, logo, elemento proibido ou metadado divergente;
3. consultar a fila e excluir o item recebido da busca;
4. enviar imediatamente, em mensagem de progresso, um único prompt visual curto para o próximo item;
5. salvar e publicar a imagem atual somente após esse aviso;
6. encerrar com relatório curto, sem repetir o prompt já enviado.

O prompt visual para o ChatGPT deve ser curto. Instruções de JSON, Git, documentação e publicação não devem ser misturadas ao pedido de criação de imagem.

Para consultar a fila sem alterar o projeto:

```text
node scripts/next-image-prompt.mjs --exclude "assets/characters/ITEM-ATUAL.png"
```

O script é somente de leitura: não cria imagens, não muda status, não edita arquivos e não executa Git.

Se o ambiente não permitir uma mensagem antes das operações, o prompt visual deve abrir a resposta final e ser seguido por no máximo seis linhas de relatório.

<!-- CATALOGO_BRASILEIRO_INICIO -->
## Catálogo brasileiro compilado

Em 2026-07-12, o catálogo passou a ter 3251 registros fixos, 1430 famílias e cobertura das 27 UFs. As fontes ficam em `data/personagens/`; os arquivos monolíticos são gerados. Perfis culturais sensíveis permanecem não publicáveis até pesquisa e revisão.

Referências: `docs/CATALOGO_BRASILEIRO_PERSONAGENS.md`, `docs/REVISAO_CULTURAL_PERSONAGENS.md` e `data/relatorio-validacao-catalogo.json`.
<!-- CATALOGO_BRASILEIRO_FIM -->
