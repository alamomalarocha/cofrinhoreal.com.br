# Plano de Imagens dos Personagens 001

Data: 2026-07-02

## Objetivo

Preparar a próxima fase do Cofrinho Real: criação gradual das imagens dos personagens da Vila Fazenda Pig.

Esta fase não cria imagens automaticamente. Ela define o processo para receber e organizar imagens oficiais enviadas por Alamo, uma por uma.

## Estado atual

- A base de personagens existe em `data/vila-pig-personagens.json`.
- A versao CSV existe em `data/vila-pig-personagens.csv`.
- Existem 200 personagens cadastrados.
- Apenas o personagem `001 - Pig Principal` possui imagem oficial criada em `assets/characters/`.
- Os personagens `002` em diante seguem com `status_imagem: "pendente"`.

## Conceito de avatar do usuário

Os assets `002` a `011` são avatares base/padrao por faixa etária.

Eles não substituem o Pig Principal e tambem não são os personagens fixos da Vila Pig.

A personalização futura do Avatar Pig do usuário deve usar a pergunta:

> Como voce quer personalizar seu Pig?

Texto de apoio:

> Voce pode mudar isso depois.

As opções publicas de avatar são estilos visuais: Pig Azul, Pig Rosa, Pig Arco-íris e Pig Padrão. Elas não representam declaracao obrigatória de identidade pessoal.

Nomes internos planejados:

- `avatar_style: azul`
- `avatar_style: rosa`
- `avatar_style: arco_iris`
- `avatar_style: padrao`

Não usar publicamente "menino", "menina", "LGBT", "neutro" ou "o que voce e".

A solicitacao atual iniciou a criação das variações por estilo dos avatares. O fluxo de imagem deve continuar guiado uma imagem por vez.

## Como as imagens serao criadas

As imagens serao criadas fora do Codex e arquivadas uma por uma.

Não trabalhar em lote.
Não pedir proximos 5 personagens.
Não separar painel com vários personagens.
Não alterar a sequencia oficial dos personagens.

Fluxo operacional oficial:

1. ChatGPT cria a imagem fora do Codex.
2. Alamo envia uma imagem oficial de personagem ao Codex.
3. Codex salva a imagem no caminho `asset_futuro` correspondente.
4. Codex atualiza JSON/CSV e documentação obrigatória.
5. Codex muda `status_imagem` de `"pendente"` para `"criada"`.
6. Codex faz commit e push.
7. Codex informa apenas o próximo personagem pendente da sequencia.
8. Codex devolve os blocos prontos:
   - dados técnicos do próximo personagem;
   - prompt visual limpo para criar a próxima imagem no ChatGPT Images;
   - prompt técnico para salvar a próxima imagem no Codex.

## Prompt visual limpo

O prompt visual enviado ao ChatGPT Images deve conter apenas a descrição artistica do personagem.

Não incluir no prompt visual:

- número do personagem;
- slug;
- nome do arquivo;
- caminho `assets/characters`;
- `asset_futuro`;
- instrucoes de commit;
- instrucoes de JSON ou CSV;
- instrucoes de documentação;
- blocos técnicos.

Os dados técnicos ficam separados para uso do Codex.

Documento de protocolo: `docs/PROTOCOLO_IMAGENS_PERSONAGENS.md`.

Cada imagem devera ser enviada com nome correspondente ao personagem:

```text
NUMERO-SLUG.png
```

Exemplos:

- `001-pig-principal.png`
- `002-pig-bebe.png`
- `003-pig-primeirinhos.png`
- `012-pinguinha.png`
- `017-vovo-zefa.png`
- `018-vovo-joao.png`
- `025-seu-damiao-padaria.png`
- `026-tia-carmem-cantina.png`

Quando uma imagem com esse nome for recebida, ela deve ser salva em:

```text
assets/characters/
```

## Atualizacao de status

Depois de salvar a imagem, atualizar o personagem correspondente em JSON/CSV:

```json
"status_imagem": "criada"
```

O campo `asset_futuro` deve continuar apontando para:

```text
assets/characters/NUMERO-SLUG.png
```

## Próximo personagem pendente

Depois de manter apenas `001 - Pig Principal` como imagem oficial, o próximo personagem pendente da sequencia e:

- `002` Pig Bebê
- slug: `pig-bebe`
- asset futuro: `assets/characters/002-pig-bebe.png`

As imagens antigas de `002` a `010` foram preservadas em `assets/characters/_drafts/` e não devem ser consideradas assets oficiais.

## Cuidados visuais

- Não criar caricaturas ofensivas.
- Não sexualizar personagens.
- Não usar linguagem de aposta, cassino, bet, loot box ou prêmio financeiro.
- Representar diversidade de forma natural, respeitosa e sem rotulos forcados.
- Manter o Pig principal como guia da marca.
- Manter avatares do usuário separados dos personagens fixos da Vila Pig.

## Regra final

Imagem so vira asset oficial quando:

- nome do arquivo bate com número e slug;
- arquivo esta salvo em `assets/characters/`;
- status foi atualizado em JSON/CSV;
- imagem foi revisada contra a identidade visual e os princípios do projeto.

## Uso no website

O Pig Principal 001 é também a referência visual oficial da marca no website. Ele representa o mascote oficial, o guia visual do Cofrinho Real e a principal referência do universo Pig no protótipo atual. Essa decisão não altera a sequência de personagens nem as regras de avatar.

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

## Progresso - 002 Pig Bebê padrão

A variação `padrao` do avatar `002 - Pig Bebe` foi criada e registrada.

- arquivo criado: `assets/characters/002-pig-bebe-padrao.png`
- status da variação: `criada`
- próxima variação pendente: `002 - Pig Bebe - azul`
- próximo arquivo esperado: `assets/characters/002-pig-bebe-azul.png`

## Progresso - 002 Pig Bebê azul

A variação `azul` do avatar `002 - Pig Bebe` foi criada e registrada.

- arquivo criado: `assets/characters/002-pig-bebe-azul.png`
- status da variação: `criada`
- variações ja criadas: `padrao`, `azul`
- próxima variação pendente: `002 - Pig Bebe - rosa`
- próximo arquivo esperado: `assets/characters/002-pig-bebe-rosa.png`

## Progresso - 002 Pig Bebê rosa

A variação `rosa` do avatar `002 - Pig Bebe` foi criada e registrada.

- arquivo criado: `assets/characters/002-pig-bebe-rosa.png`
- status da variação: `criada`
- variações ja criadas: `padrao`, `azul`, `rosa`
- próxima variação pendente: `002 - Pig Bebe - arco_iris`
- próximo arquivo esperado: `assets/characters/002-pig-bebe-arco-iris.png`

## Diferença entre Pig Padrão e Pig Arco-íris

Pig Padrão e a opcao neutra/universal para quem prefere não escolher. Ele segue a identidade do Pig Principal, equilibrando azul, rosa, amarelo/dourado, branco/off-white e azul escuro, sem predominancia forte de rosa, azul ou arco-íris.

Pig Arco-íris e a opcao visual colorida/inclusiva. Ele deve ter arco-íris claramente visivel, com roupa ou acessórios principais usando faixas ou linhas inspiradas em arco-íris. As cores vermelho, laranja, amarelo, verde, azul e lilas/roxo devem aparecer de forma organizada, mantendo visual infantil, bonito e limpo.

Não tratar Pig Arco-íris como apenas detalhe pastel discreto. Ele precisa continuar reconhecivel como arco-íris mesmo em miniatura/card.

Nome público principal: Pig Arco-íris. Se for necessário suavizar em algum material especifico, Pig Colorido pode aparecer apenas como apelido visual.

## Progresso - 002 Pig Bebê arco_iris

A variação `arco_iris` do avatar `002 - Pig Bebe` foi criada e registrada.

- arquivo criado: `assets/characters/002-pig-bebe-arco-iris.png`
- status da variação: `criada`
- variações ja criadas: `padrao`, `azul`, `rosa`, `arco_iris`
- próximo item pendente: `003 - Pig Primeirinhos - padrao`
- próximo arquivo esperado: `assets/characters/003-pig-primeirinhos-padrao.png`

A imagem `assets/characters/002-pig-bebe-arco-iris.png` e a primeira referência visual aprovada para o estilo Pig Arco-íris.

Nos avatares estilo `arco_iris`, a roupa principal deve ter faixas fortes e reconhecíveis de arco-íris, seguindo a referência visual do arquivo `assets/characters/002-pig-bebe-arco-iris.png`. Não usar apenas detalhes pastel discretos.

Prompts futuros de `arco_iris` devem pedir roupa principal com faixas fortes em vermelho, laranja, amarelo, verde, azul e roxo/lilas, mantendo visual neutro/universal e sem laço, flor, saia, acessorio feminino, boné ou elemento que puxe para masculino.

## Progresso - 003 Pig Primeirinhos padrão

A variação `padrao` do avatar `003 - Pig Primeirinhos` foi criada e registrada.

- arquivo criado: `assets/characters/003-pig-primeirinhos-padrao.png`
- status da variação: `criada`
- próxima variação pendente: `003 - Pig Primeirinhos - azul`
- próximo arquivo esperado: `assets/characters/003-pig-primeirinhos-azul.png`

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

Próximo item pendente apos o reset: `002 - Pig Bebe - padrao`.

Arquivo esperado: `assets/characters/002-pig-bebe-padrao.png`.
## Avatar 002 - Pig Bebê - padrão recriado

A variação `padrao` do avatar `002 - Pig Bebe` foi recriada no sistema visual simples `camisa_calca_tenis`.

- arquivo oficial: `assets/characters/002-pig-bebe-padrao.png`
- asset principal preservado: `assets/characters/002-pig-bebe.png`
- status da variação `padrao`: `criada`
- próxima variação pendente: `002 - Pig Bebe - azul`

## Coleção Pig durante o plano de imagens

A cada novo avatar ou personagem oficial salvo em `assets/characters/`, o controle de dados deve permitir que `personagens.html` exiba o card correspondente na Coleção Pig. Cards pendentes podem aparecer com placeholder visual simples.
## Avatar 002 - Pig Bebê - azul recriado

A variação `azul` do avatar `002 - Pig Bebe` foi recriada no sistema visual simples `camisa_calca_tenis`.

- arquivo oficial: `assets/characters/002-pig-bebe-azul.png`
- asset principal preservado: `assets/characters/002-pig-bebe.png`
- status da variação `azul`: `criada`
- próxima variação pendente: `002 - Pig Bebe - rosa`

## Prompt visual ultra curto - regra vigente

Antes de gerar qualquer nova imagem de avatar, o prompt visual deve ser ultra curto, isolado e com no máximo 8 linhas.

Sempre comecar assim:

```text
Crie do zero. Ignore prints, telas, logos, cards e imagens anteriores.
```

O prompt visual deve descrever apenas idade/faixa, pose, roupa, cor, proibicoes essenciais e fundo transparente. Não incluir dados técnicos, arquivo, caminho, JSON, CSV, commit, listas longas ou explicação do projeto.

Modelos de avatar:

```text
Crie do zero. Ignore prints, telas, logos, cards e imagens anteriores.
Porquinho [idade/faixa], corpo inteiro, em pe, centralizado, estilo 3D/cartoon premium.
Roupa: camisa lisa off-white, short bege claro, tenis branco simples.
Sem acessorios, sem texto, sem letras, sem numeros, sem simbolos, sem moeda, sem logo, sem cenario.
Fundo transparente.
```

```text
Crie do zero. Ignore prints, telas, logos, cards e imagens anteriores.
Porquinho [idade/faixa], corpo inteiro, em pe, centralizado, estilo 3D/cartoon premium.
Roupa: camisa azul lisa, short azul claro, tenis branco simples.
Sem acessorios, sem texto, sem letras, sem numeros, sem simbolos, sem moeda, sem logo, sem cenario.
Fundo transparente.
```

```text
Crie do zero. Ignore prints, telas, logos, cards e imagens anteriores.
Porquinho [idade/faixa], corpo inteiro, em pe, centralizado, estilo 3D/cartoon premium.
Roupa: camisa rosa lisa, short rosa claro, tenis branco simples.
Sem acessorios, sem texto, sem letras, sem numeros, sem simbolos, sem moeda, sem logo, sem cenario.
Fundo transparente.
```

```text
Crie do zero. Ignore prints, telas, logos, cards e imagens anteriores.
Porquinho [idade/faixa], corpo inteiro, em pe, centralizado, estilo 3D/cartoon premium.
Roupa: camisa com listras horizontais fortes de arco-iris vermelho, laranja, amarelo, verde, azul e roxo; short off-white; tenis branco simples.
Sem acessorios, sem texto, sem letras, sem numeros, sem simbolos, sem moeda, sem logo, sem cenario.
Fundo transparente.
```

Exceção: `002 - Pig Bebe` pode ficar sentado. Do `003` ao `011`, sempre usar `corpo inteiro, em pe, centralizado`.
## Avatar 002 - Pig Bebê - rosa recriado

A variação `rosa` do avatar `002 - Pig Bebe` foi recriada no sistema visual simples `camisa_calca_tenis`.

- arquivo oficial: `assets/characters/002-pig-bebe-rosa.png`
- asset principal preservado: `assets/characters/002-pig-bebe.png`
- status da variação `rosa`: `criada`
- próxima variação pendente: `002 - Pig Bebe - arco_iris`
## Avatar 002 - Pig Bebê - arco_iris recriado

A variação `arco_iris` do avatar `002 - Pig Bebe` foi recriada no sistema visual simples `camisa_calca_tenis`.

- arquivo oficial: `assets/characters/002-pig-bebe-arco-iris.png`
- asset principal preservado: `assets/characters/002-pig-bebe.png`
- status da variação `arco_iris`: `criada`
- próximo item pendente: `003 - Pig Primeirinhos - padrao`
## Avatar 003 - Pig Primeirinhos - padrão recriado

A variação `padrao` do avatar `003 - Pig Primeirinhos` foi recriada no sistema visual simples `camisa_calca_tenis`.

- arquivo oficial: `assets/characters/003-pig-primeirinhos-padrao.png`
- asset principal preservado: `assets/characters/003-pig-primeirinhos.png`
- status da variação `padrao`: `criada`
- próxima variação pendente: `003 - Pig Primeirinhos - azul`

## Avatar 003 - Pig Primeirinhos - azul recriado

A variação `azul` do avatar `003 - Pig Primeirinhos` foi recriada no sistema visual simples `camisa_calca_tenis`.

- arquivo oficial: `assets/characters/003-pig-primeirinhos-azul.png`
- asset principal preservado: `assets/characters/003-pig-primeirinhos.png`
- status da variação `azul`: `criada`
- próxima variação pendente: `003 - Pig Primeirinhos - rosa`

## Avatar 003 - Pig Primeirinhos - rosa recriado

A variação `rosa` do avatar `003 - Pig Primeirinhos` foi recriada no sistema visual simples `camisa_calca_tenis`.

- arquivo oficial: `assets/characters/003-pig-primeirinhos-rosa.png`
- asset principal preservado: `assets/characters/003-pig-primeirinhos.png`
- status da variação `rosa`: `criada`
- próxima variação pendente: `003 - Pig Primeirinhos - arco_iris`

## Avatar 003 - Pig Primeirinhos - arco_iris recriado

A variação `arco_iris` do avatar `003 - Pig Primeirinhos` foi recriada no sistema visual simples `camisa_calca_tenis`.

- arquivo oficial: `assets/characters/003-pig-primeirinhos-arco-iris.png`
- asset principal preservado: `assets/characters/003-pig-primeirinhos.png`
- status da variação `arco_iris`: `criada`
- variações do `003 - Pig Primeirinhos` criadas: `padrao`, `azul`, `rosa`, `arco_iris`
- próximo item pendente: `004 - Pig Crianca - padrao`

## Avatar 004 - Pig Criança - padrão recriado

A variação `padrao` do avatar `004 - Pig Crianca` foi recriada no sistema visual simples `camisa_calca_tenis`.

- arquivo oficial: `assets/characters/004-pig-crianca-padrao.png`
- asset principal preservado: `assets/characters/004-pig-crianca.png`
- status da variação `padrao`: `criada`
- próxima variação pendente: `004 - Pig Crianca - azul`

## Avatar 004 - Pig Criança - azul recriado

A variação `azul` do avatar `004 - Pig Crianca` foi recriada no sistema visual simples `camisa_calca_tenis`.

- arquivo oficial: `assets/characters/004-pig-crianca-azul.png`
- asset principal preservado: `assets/characters/004-pig-crianca.png`
- status da variação `azul`: `criada`
- próxima variação pendente: `004 - Pig Crianca - rosa`

## Avatar 004 - Pig Criança - rosa recriado

A variação `rosa` do avatar `004 - Pig Crianca` foi recriada no sistema visual simples `camisa_calca_tenis`.

- arquivo oficial: `assets/characters/004-pig-crianca-rosa.png`
- asset principal preservado: `assets/characters/004-pig-crianca.png`
- status da variação `rosa`: `criada`
- próxima variação pendente: `004 - Pig Crianca - arco_iris`

## Avatar 004 - Pig Criança - arco_iris recriado

A variação `arco_iris` do avatar `004 - Pig Crianca` foi recriada no sistema visual simples `camisa_calca_tenis`.

- arquivo oficial: `assets/characters/004-pig-crianca-arco-iris.png`
- asset principal preservado: `assets/characters/004-pig-crianca.png`
- status da variação `arco_iris`: `criada`
- variações do `004 - Pig Crianca` criadas: `padrao`, `azul`, `rosa`, `arco_iris`
- próximo item pendente: `005 - Pig Pre-Adolescente - padrao`

## Avatar 005 - Pig Pré-adolescente - padrão recriado

A variação `padrao` do avatar `005 - Pig Pre-Adolescente` foi recriada no sistema visual simples `camisa_calca_tenis`.

- arquivo oficial: `assets/characters/005-pig-pre-adolescente-padrao.png`
- asset principal preservado: `assets/characters/005-pig-pre-adolescente.png`
- status da variação `padrao`: `criada`
- próxima variação pendente: `005 - Pig Pre-Adolescente - azul`

## Avatar 005 - Pig Pré-adolescente - azul recriado

A variação `azul` do avatar `005 - Pig Pre-Adolescente` foi recriada no sistema visual simples `camisa_calca_tenis`.

- arquivo oficial: `assets/characters/005-pig-pre-adolescente-azul.png`
- asset principal preservado: `assets/characters/005-pig-pre-adolescente.png`
- status da variação `azul`: `criada`
- próxima variação pendente: `005 - Pig Pre-Adolescente - rosa`

## Avatar 005 - Pig Pré-adolescente - rosa recriado

A variação `rosa` do avatar `005 - Pig Pre-Adolescente` foi recriada no sistema visual simples `camisa_calca_tenis`.

- arquivo oficial: `assets/characters/005-pig-pre-adolescente-rosa.png`
- asset principal preservado: `assets/characters/005-pig-pre-adolescente.png`
- status da variação `rosa`: `criada`
- próxima variação pendente: `005 - Pig Pre-Adolescente - arco_iris`

## Avatar 005 - Pig Pré-adolescente - arco_iris recriado

A variação `arco_iris` do avatar `005 - Pig Pre-Adolescente` foi recriada no sistema visual simples `camisa_calca_tenis`.

- arquivo oficial: `assets/characters/005-pig-pre-adolescente-arco-iris.png`
- asset principal preservado: `assets/characters/005-pig-pre-adolescente.png`
- status da variação `arco_iris`: `criada`
- variações do `005 - Pig Pre-Adolescente` criadas: `padrao`, `azul`, `rosa`, `arco_iris`
- próximo item pendente: `006 - Pig Adolescente - padrao`

## Avatar 006 - Pig Adolescente - padrão recriado

A variação `padrao` do avatar `006 - Pig Adolescente` foi recriada no sistema visual simples `camisa_calca_tenis`.

- arquivo oficial: `assets/characters/006-pig-adolescente-padrao.png`
- asset principal preservado: `assets/characters/006-pig-adolescente.png`
- status da variação `padrao`: `criada`
- próxima variação pendente: `006 - Pig Adolescente - azul`

## Avatar 006 - Pig Adolescente - azul recriado

A variação `azul` do avatar `006 - Pig Adolescente` foi recriada no sistema visual simples `camisa_calca_tenis`.

- arquivo oficial: `assets/characters/006-pig-adolescente-azul.png`
- asset principal preservado: `assets/characters/006-pig-adolescente.png`
- status da variação `azul`: `criada`
- próxima variação pendente: `006 - Pig Adolescente - rosa`

## Avatar 006 - Pig Adolescente - rosa recriado

A variação `rosa` do avatar `006 - Pig Adolescente` foi recriada no sistema visual simples `camisa_calca_tenis`.

- arquivo oficial: `assets/characters/006-pig-adolescente-rosa.png`
- asset principal preservado: `assets/characters/006-pig-adolescente.png`
- status da variação `rosa`: `criada`
- próxima variação pendente: `006 - Pig Adolescente - arco_iris`

## Avatar 006 - Pig Adolescente - arco_iris recriado

A variação `arco_iris` do avatar `006 - Pig Adolescente` foi recriada no sistema visual simples `camisa_calca_tenis`.

- arquivo oficial: `assets/characters/006-pig-adolescente-arco-iris.png`
- asset principal preservado: `assets/characters/006-pig-adolescente.png`
- status da variação `arco_iris`: `criada`
- variações do `006 - Pig Adolescente` criadas: `padrao`, `azul`, `rosa`, `arco_iris`
- próximo item pendente: `007 - Pig Jovem - padrao`

## Avatar 007 - Pig Jovem - padrão recriado

A variação `padrao` do avatar `007 - Pig Jovem` foi recriada no sistema visual simples `camisa_calca_tenis`.

- arquivo oficial: `assets/characters/007-pig-jovem-padrao.png`
- asset principal preservado: `assets/characters/007-pig-jovem.png`
- status da variação `padrao`: `criada`
- próxima variação pendente: `007 - Pig Jovem - azul`

## Avatar 007 - Pig Jovem - azul recriado

A variação `azul` do avatar `007 - Pig Jovem` foi recriada no sistema visual simples `camisa_calca_tenis`.

- arquivo oficial: `assets/characters/007-pig-jovem-azul.png`
- asset principal preservado: `assets/characters/007-pig-jovem.png`
- status da variação `azul`: `criada`
- próxima variação pendente: `007 - Pig Jovem - rosa`

## Avatar 007 - Pig Jovem - rosa recriado

A variação `rosa` do avatar `007 - Pig Jovem` foi recriada no sistema visual simples `camisa_calca_tenis`.

- arquivo oficial: `assets/characters/007-pig-jovem-rosa.png`
- asset principal preservado: `assets/characters/007-pig-jovem.png`
- status da variação `rosa`: `criada`
- próxima variação pendente: `007 - Pig Jovem - arco_iris`

## Avatar 007 - Pig Jovem - arco_iris recriado

A variação `arco_iris` do avatar `007 - Pig Jovem` foi recriada no sistema visual simples `camisa_calca_tenis`.

- arquivo oficial: `assets/characters/007-pig-jovem-arco-iris.png`
- asset principal preservado: `assets/characters/007-pig-jovem.png`
- status da variação `arco_iris`: `criada`
- variações do `007 - Pig Jovem` criadas: `padrao`, `azul`, `rosa`, `arco_iris`
- próximo item pendente: `008 - Pig Jovem Adulto - padrao`

## Avatar 008 - Pig Jovem Adulto - padrão recriado

A variação `padrao` do avatar `008 - Pig Jovem Adulto` foi recriada no sistema visual simples `camisa_calca_tenis`.

- arquivo oficial: `assets/characters/008-pig-jovem-adulto-padrao.png`
- asset principal preservado: `assets/characters/008-pig-jovem-adulto.png`
- status da variação `padrao`: `criada`
- próxima variação pendente: `008 - Pig Jovem Adulto - azul`

## Avatar 008 - Pig Jovem Adulto - azul recriado

A variação `azul` do avatar `008 - Pig Jovem Adulto` foi recriada no sistema visual simples `camisa_calca_tenis`.

- arquivo oficial: `assets/characters/008-pig-jovem-adulto-azul.png`
- asset principal preservado: `assets/characters/008-pig-jovem-adulto.png`
- status da variação `azul`: `criada`
- próxima variação pendente: `008 - Pig Jovem Adulto - rosa`

## Avatar 008 - Pig Jovem Adulto - rosa recriado

A variação `rosa` do avatar `008 - Pig Jovem Adulto` foi recriada no sistema visual simples `camisa_calca_tenis`.

- arquivo oficial: `assets/characters/008-pig-jovem-adulto-rosa.png`
- asset principal preservado: `assets/characters/008-pig-jovem-adulto.png`
- status da variação `rosa`: `criada`
- próxima variação pendente: `008 - Pig Jovem Adulto - arco_iris`

## Avatar 008 - Pig Jovem Adulto - arco_iris recriado

A variação `arco_iris` do avatar `008 - Pig Jovem Adulto` foi recriada no sistema visual simples `camisa_calca_tenis`.

- arquivo oficial: `assets/characters/008-pig-jovem-adulto-arco-iris.png`
- asset principal preservado: `assets/characters/008-pig-jovem-adulto.png`
- status da variação `arco_iris`: `criada`
- variações do `008 - Pig Jovem Adulto` criadas: `padrao`, `azul`, `rosa`, `arco_iris`
- próximo item pendente: `009 - Pig Adulto - padrao`

## Avatar 009 - Pig Adulto - padrão recriado

A variação `padrao` do avatar `009 - Pig Adulto` foi recriada no sistema visual simples `camisa_calca_tenis`.

- arquivo oficial: `assets/characters/009-pig-adulto-padrao.png`
- asset principal preservado: `assets/characters/009-pig-adulto.png`
- status da variação `padrao`: `criada`
- próxima variação pendente: `009 - Pig Adulto - azul`

## Avatar 009 - Pig Adulto - azul recriado

A variação `azul` do avatar `009 - Pig Adulto` foi recriada no sistema visual simples `camisa_calca_tenis`.

- arquivo oficial: `assets/characters/009-pig-adulto-azul.png`
- asset principal preservado: `assets/characters/009-pig-adulto.png`
- status da variação `azul`: `criada`
- próxima variação pendente: `009 - Pig Adulto - rosa`

## Avatar 009 - Pig Adulto - rosa recriado

A variação `rosa` do avatar `009 - Pig Adulto` foi recriada no sistema visual simples `camisa_calca_tenis`.

- arquivo oficial: `assets/characters/009-pig-adulto-rosa.png`
- asset principal preservado: `assets/characters/009-pig-adulto.png`
- status da variação `rosa`: `criada`
- próxima variação pendente: `009 - Pig Adulto - arco_iris`

## Avatar 009 - Pig Adulto - arco_iris recriado

A variação `arco_iris` do avatar `009 - Pig Adulto` foi recriada no sistema visual simples `camisa_calca_tenis`.

- arquivo oficial: `assets/characters/009-pig-adulto-arco-iris.png`
- asset principal preservado: `assets/characters/009-pig-adulto.png`
- status da variação `arco_iris`: `criada`
- variações do `009 - Pig Adulto` criadas: `padrao`, `azul`, `rosa`, `arco_iris`
- próximo item pendente: `010 - Pig Coroa - padrao`

## Avatar 010 - Pig Coroa - padrão recriado

A variação `padrao` do avatar `010 - Pig Coroa` foi recriada no sistema visual simples `camisa_calca_tenis`.

- arquivo oficial: `assets/characters/010-pig-coroa-padrao.png`
- asset principal preservado: `assets/characters/010-pig-coroa.png`
- status da variação `padrao`: `criada`
- próxima variação pendente: `010 - Pig Coroa - azul`

## Avatar 010 - Pig Coroa - azul recriado

A variação `azul` do avatar `010 - Pig Coroa` foi recriada no sistema visual simples `camisa_calca_tenis`.

- arquivo oficial: `assets/characters/010-pig-coroa-azul.png`
- asset principal preservado: `assets/characters/010-pig-coroa.png`
- status da variação `azul`: `criada`
- próxima variação pendente: `010 - Pig Coroa - rosa`

## Avatar 010 - Pig Coroa - rosa recriado

A variação `rosa` do avatar `010 - Pig Coroa` foi recriada no sistema visual simples `camisa_calca_tenis`.

- arquivo oficial: `assets/characters/010-pig-coroa-rosa.png`
- asset principal preservado: `assets/characters/010-pig-coroa.png`
- status da variação `rosa`: `criada`
- próxima variação pendente: `010 - Pig Coroa - arco_iris`

## Avatar 010 - Pig Coroa - arco_iris recriado

A variação `arco_iris` do avatar `010 - Pig Coroa` foi recriada no sistema visual simples `camisa_calca_tenis`.

- arquivo oficial: `assets/characters/010-pig-coroa-arco-iris.png`
- asset principal preservado: `assets/characters/010-pig-coroa.png`
- status da variação `arco_iris`: `criada`
- variações do `010 - Pig Coroa` criadas: `padrao`, `azul`, `rosa`, `arco_iris`
- próximo item pendente: `011 - Pig Senior - padrao`

## Avatar 011 - Pig Sênior - padrão recriado

A variação `padrao` do avatar `011 - Pig Senior` foi recriada no sistema visual simples `camisa_calca_tenis`.

- arquivo oficial: `assets/characters/011-pig-senior-padrao.png`
- asset principal preservado: `assets/characters/011-pig-senior.png`
- status da variação `padrao`: `criada`
- próxima variação pendente: `011 - Pig Senior - azul`

## Avatar 011 - Pig Sênior - azul recriado

A variação `azul` do avatar `011 - Pig Senior` foi recriada no sistema visual simples `camisa_calca_tenis`.

- arquivo oficial: `assets/characters/011-pig-senior-azul.png`
- asset principal preservado: `assets/characters/011-pig-senior.png`
- status da variação `azul`: `criada`
- próxima variação pendente: `011 - Pig Senior - rosa`

## Avatar 011 - Pig Sênior - rosa recriado

A variação `rosa` do avatar `011 - Pig Senior` foi recriada no sistema visual simples `camisa_calca_tenis`.

- arquivo oficial: `assets/characters/011-pig-senior-rosa.png`
- asset principal preservado: `assets/characters/011-pig-senior.png`
- status da variação `rosa`: `criada`
- próxima variação pendente: `011 - Pig Senior - arco_iris`

## Avatar 011 - Pig Sênior - arco_iris recriado

A variação `arco_iris` do avatar `011 - Pig Senior` foi recriada no sistema visual simples `camisa_calca_tenis`.

- arquivo oficial: `assets/characters/011-pig-senior-arco-iris.png`
- asset principal preservado: `assets/characters/011-pig-senior.png`
- status da variação `arco_iris`: `criada`
- variações do `011 - Pig Senior` criadas: `padrao`, `azul`, `rosa`, `arco_iris`
- próximo item pendente: `202 - Mestre Satochi - principal`

## Ponto preservado pela reorganizacao

- ultima variação criada: `011 - Pig Senior - arco_iris`;
- próximo item: `202 - Mestre Satochi - principal`;
- variações de avatar criadas: 40;
- nenhuma imagem deve ser recriada por causa da nova arquitetura.

## Operação paralela a partir do próximo item

Quando Alamo enviar uma imagem oficial, o Codex deve primeiro validar o arquivo e consultar a fila com o item atual excluído. Antes de salvar, compilar, documentar, commitar ou enviar a imagem atual, deve publicar em mensagem de progresso o prompt visual puro do próximo item.

Esse prompt deve ser curto e conter somente a descrição artística. Dados de JSON, CSV, documentação, commit e push pertencem ao trabalho do Codex e não devem aparecer no pedido enviado ao ChatGPT Images.

Consulta oficial, somente de leitura:

```text
node scripts/next-image-prompt.mjs --exclude "assets/characters/ITEM-ATUAL.png"
```

O próximo item confirmado após as 40 variações de avatar é `202 - Mestre Satochi - principal`.

<!-- CATALOGO_BRASILEIRO_INICIO -->
## Catálogo brasileiro compilado

Em 2026-07-12, o catálogo passou a ter 3251 registros fixos, 1430 famílias e cobertura das 27 UFs. As fontes ficam em `data/personagens/`; os arquivos monolíticos são gerados. Perfis culturais sensíveis permanecem não publicáveis até pesquisa e revisão.

Referências: `docs/CATALOGO_BRASILEIRO_PERSONAGENS.md`, `docs/REVISAO_CULTURAL_PERSONAGENS.md` e `data/relatorio-validacao-catalogo.json`.
<!-- CATALOGO_BRASILEIRO_FIM -->
