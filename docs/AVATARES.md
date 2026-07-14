# Avatares do Usuário

> Regra atual: estilos `padrao`, `azul`, `rosa` e `arco_iris` são escolhas visuais. Não definem gênero, idade, orientação, identidade, jurisdição, conta ou nivel de conteúdo. A permissão futura depende de regras locais e da idade atual, nunca da aparência escolhida.

Os avatares do usuário não são personagens fixos da história.

Eles representam a conta da pessoa dentro do app e poderao ser personalizados visualmente no futuro.

## Separacao essencial

O Cofrinho Real separa oficialmente tres conceitos:

- **Pig Principal**: mascote oficial, guia, comunicador, professor-amigo, personagem da logo e referência visual da marca.
- **Avatar Pig do usuário**: representação visual escolhida pela pessoa dentro do app.
- **Vila Pig / Família Pig**: universo de personagens fixos, histórias, família, escola, comércio e comunidade.

Frase de referência:

> O Pig Principal e o mascote/guia da marca. O Avatar Pig do usuário e a representação visual da pessoa dentro do app. A Vila Pig e o universo de personagens e histórias.

## Pig Principal

O Pig Principal e o mascote oficial da marca Cofrinho Real.

Ele e:

- guia;
- comunicador;
- professor-amigo;
- rosto da marca;
- personagem da logo;
- personagem que orienta o projeto.

Ele não representa uma pessoa específica e não é avatar de usuário.

O Pig Principal continua sendo:

```text
001 - Pig Principal
assets/characters/001-pig-principal.png
```

## Avatar Pig do usuário

O Avatar Pig do usuário e a representação visual da pessoa dentro do app.

## Opções publicas de avatar

As opções de avatar são estilos visuais: Pig Azul, Pig Rosa, Pig Arco-íris e Pig Padrão. Elas não representam declaracao obrigatória de identidade pessoal.

Pergunta oficial no onboarding:

> Como voce quer personalizar seu Pig?

Texto de apoio:

> Voce pode mudar isso depois.

Opções publicas:

1. **Pig Azul**: estilo azul, calmo, classico e amigavel.
2. **Pig Rosa**: estilo rosa, doce, afetivo e carinhoso.
3. **Pig Arco-íris**: estilo colorido e inclusivo, com faixas de arco-íris claramente visiveis na roupa ou nos acessórios principais.
4. **Pig Padrão**: visual neutro/universal do Cofrinho Real, para quem prefere não escolher ou não informar.

Regras publicas:

- não usar publicamente "menino";
- não usar publicamente "menina";
- não usar publicamente "LGBT";
- não usar publicamente "neutro";
- não perguntar "o que voce e";
- não coletar informação sensível;
- não transformar escolha visual em declaracao de identidade pessoal;
- tratar tudo como personalização visual do avatar.

Nomes internos:

- `avatar_style: azul`
- `avatar_style: rosa`
- `avatar_style: arco_iris`
- `avatar_style: padrao`

Esses valores representam apenas estilo visual.

## Avatares por faixa etária

Os personagens `002` a `011` representam as faixas etarias base do avatar do usuário.

Esses assets são versoes base/padrao por idade:

1. **Pig Bebê**: 0 a 2 anos. Conta administrada por responsáveis.
2. **Pig Primeirinhos**: 3 a 5 anos. Primeiras cores, números e vínculo com o cofrinho.
3. **Pig Criança**: 6 a 9 anos. Moedas, pequenos valores, metas simples e jogos educativos.
4. **Pig Pré-adolescente**: 10 a 12 anos. Primeiras escolhas, autonomia e responsabilidade.
5. **Pig Adolescente**: 13 a 17 anos. Consumo consciente, metas maiores, PigCoins e juros fictícios.
6. **Pig Jovem**: 18 a 24 anos. Faculdade, trabalho e metas pessoais.
7. **Pig Jovem Adulto**: 25 a 34 anos. Vida independente e controle pessoal.
8. **Pig Adulto**: 35 a 49 anos. Família, filhos, trabalho e envio de Pig.
9. **Pig Coroa**: 50 a 64 anos. Experiência e apoio a família.
10. **Pig Sênior**: 65+. Netos, carinho, legado e participação familiar.

No futuro, cada faixa etária poderá ter variações visuais:

- padrão;
- azul;
- rosa;
- arco_iris.

Exemplo futuro:

```text
assets/characters/004-pig-crianca-padrao.png
assets/characters/004-pig-crianca-azul.png
assets/characters/004-pig-crianca-rosa.png
assets/characters/004-pig-crianca-arco-iris.png
```

Criar essas variações apenas pelo fluxo guiado, uma imagem por vez, com aceite visual antes de salvar.

## Vila Pig e personagens fixos

Os personagens da Vila Pig / Família Pig são diferentes do Avatar Pig do usuário.

Eles são personagens fixos do universo narrativo, como:

- Pinguinha;
- Vovo Zefa;
- Vovô João;
- Mae Helena;
- Seu Damiao;
- Tia Carmem;
- amigos, vizinhos, comerciantes, escola e comunidade.

## Estado atual da fase de imagens

Neste momento, apenas `001 - Pig Principal` esta oficializado como imagem criada.

Os avatares `002` a `011` continuam como sequencia base/padrao por faixa etária, mas suas imagens serao recriadas uma por uma com o conceito correto.

As imagens antigas de `002` a `010` foram preservadas como rascunhos em `assets/characters/_drafts/` e não devem ser tratadas como assets oficiais.

## Regra visual

Avatares devem ser afetuosos, modernos e respeitosos. Nunca devem virar caricatura, ranking social, mecanismo de vício ou incentivo a consumo compulsivo.

## Avatar style na experiência logada

A escolha de avatar style pertence à experiência logada futura. Antes do login, o site/app usa a identidade padrão do Pig Principal, neutra e universal.

Depois do login, o usuário poderá ver seu próprio universo Pig personalizado conforme tipo de conta, faixa etária e estilo visual escolhido.

Regra de referência:

> O público geral vê o Pig Principal neutro. O usuário logado vê o seu próprio universo Pig personalizado.

A pergunta pública continua sendo:

> Como você quer personalizar seu Pig?

Essa pergunta deve tratar a escolha como estilo visual, sem coletar informação sensível e sem usar publicamente termos como "menino", "menina", "LGBT" ou "neutro".

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

## Variação criada - 002 Pig Bebê padrão

A variação `padrao` do avatar `002 - Pig Bebe` foi criada e salva como asset oficial de avatar.

- número principal: `002`
- nome principal: `Pig Bebe`
- slug principal: `pig-bebe`
- estilo visual: `padrao`
- arquivo da variação: `assets/characters/002-pig-bebe-padrao.png`

O asset principal `assets/characters/002-pig-bebe.png` permanece como referência principal planejada do personagem. As próximas variações seguem pendentes: azul, rosa e arco_iris.

## Variação criada - 002 Pig Bebê azul

A variação `azul` do avatar `002 - Pig Bebe` foi criada e salva como asset oficial de avatar.

- número principal: `002`
- nome principal: `Pig Bebe`
- slug principal: `pig-bebe`
- estilo visual: `azul`
- arquivo da variação: `assets/characters/002-pig-bebe-azul.png`

O asset principal `assets/characters/002-pig-bebe.png` permanece como referência principal planejada do personagem. As próximas variações seguem pendentes: rosa e arco_iris.

## Variação criada - 002 Pig Bebê rosa

A variação `rosa` do avatar `002 - Pig Bebe` foi criada e salva como asset oficial de avatar.

- número principal: `002`
- nome principal: `Pig Bebe`
- slug principal: `pig-bebe`
- estilo visual: `rosa`
- arquivo da variação: `assets/characters/002-pig-bebe-rosa.png`

O asset principal `assets/characters/002-pig-bebe.png` permanece como referência principal planejada do personagem. A próxima variação pendente e: arco_iris.

## Diferença entre Pig Padrão e Pig Arco-íris

Pig Padrão e a opcao neutra/universal para quem prefere não escolher. Ele segue a identidade do Pig Principal, equilibrando azul, rosa, amarelo/dourado, branco/off-white e azul escuro, sem predominancia forte de rosa, azul ou arco-íris.

Pig Arco-íris e a opcao visual colorida/inclusiva. Ele deve ter arco-íris claramente visivel, com roupa ou acessórios principais usando faixas ou linhas inspiradas em arco-íris. As cores vermelho, laranja, amarelo, verde, azul e lilas/roxo devem aparecer de forma organizada, mantendo visual infantil, bonito e limpo.

Não tratar Pig Arco-íris como apenas detalhe pastel discreto. Ele precisa continuar reconhecivel como arco-íris mesmo em miniatura/card.

Nome público principal: Pig Arco-íris. Se for necessário suavizar em algum material especifico, Pig Colorido pode aparecer apenas como apelido visual.

## Variação criada - 002 Pig Bebê arco_iris

A variação `arco_iris` do avatar `002 - Pig Bebe` foi criada e salva como asset oficial de avatar.

- número principal: `002`
- nome principal: `Pig Bebe`
- slug principal: `pig-bebe`
- estilo visual: `arco_iris`
- arquivo da variação: `assets/characters/002-pig-bebe-arco-iris.png`

O asset principal `assets/characters/002-pig-bebe.png` permanece como referência principal planejada do personagem. As quatro variações do Pig Bebê estao criadas: padrão, azul, rosa e arco_iris.

A imagem `assets/characters/002-pig-bebe-arco-iris.png` e a primeira referência visual aprovada para o estilo Pig Arco-íris.

Nos avatares estilo `arco_iris`, a roupa principal deve ter faixas fortes e reconhecíveis de arco-íris, seguindo a referência visual do arquivo `assets/characters/002-pig-bebe-arco-iris.png`. Não usar apenas detalhes pastel discretos.

Prompts futuros de `arco_iris` devem pedir roupa principal com faixas fortes em vermelho, laranja, amarelo, verde, azul e roxo/lilas, mantendo visual neutro/universal e sem laço, flor, saia, acessorio feminino, boné ou elemento que puxe para masculino.

## Variação criada - 003 Pig Primeirinhos padrão

A variação `padrao` do avatar `003 - Pig Primeirinhos` foi criada e salva como asset oficial de avatar.

- número principal: `003`
- nome principal: `Pig Primeirinhos`
- slug principal: `pig-primeirinhos`
- estilo visual: `padrao`
- arquivo da variação: `assets/characters/003-pig-primeirinhos-padrao.png`

O asset principal `assets/characters/003-pig-primeirinhos.png` permanece como referência principal planejada do personagem. As próximas variações seguem pendentes: azul, rosa e arco_iris.

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
## Avatar 002 - Pig Bebê - padrão recriado

A variação `padrao` do avatar `002 - Pig Bebe` foi recriada no sistema visual simples `camisa_calca_tenis`.

- arquivo oficial: `assets/characters/002-pig-bebe-padrao.png`
- asset principal preservado: `assets/characters/002-pig-bebe.png`
- status da variação `padrao`: `criada`
- próxima variação pendente: `002 - Pig Bebe - azul`
## Avatar 002 - Pig Bebê - azul recriado

A variação `azul` do avatar `002 - Pig Bebe` foi recriada no sistema visual simples `camisa_calca_tenis`.

- arquivo oficial: `assets/characters/002-pig-bebe-azul.png`
- asset principal preservado: `assets/characters/002-pig-bebe.png`
- status da variação `azul`: `criada`
- próxima variação pendente: `002 - Pig Bebe - rosa`

## Regra de prompt ultra curto para avatares

Todo prompt visual de avatar deve ser isolado, ultra curto e ter no máximo 8 linhas.

Sempre comecar com:

```text
Crie do zero. Ignore prints, telas, logos, cards e imagens anteriores.
```

O prompt deve dizer apenas faixa etária, pose, roupa, cor, proibicoes essenciais e fundo transparente. Não incluir dados técnicos, caminhos, JSON, CSV, commit, explicações longas ou listas extensas.

Para `002 - Pig Bebe`, usar bebê de 0 a 2 anos sentado. Do `003` ao `011`, usar sempre corpo inteiro, em pe e centralizado.
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

## Arquitetura de gerações e fases

Os avatares `002` a `011` continuam representando fases da vida. Geração e um dado separado, calculado futuramente pelo ano de nascimento e sem inferencia de personalidade. Ver `GERACOES_E_FASES_DA_VIDA.md` e `data/fases-vida.json`.

Os estilos `padrao`, `azul`, `rosa` e `arco_iris` continuam sendo apenas personalização visual.

<!-- CATALOGO_BRASILEIRO_INICIO -->
## Catálogo brasileiro compilado

Em 2026-07-12, o catálogo passou a ter 3251 registros fixos, 1430 famílias e cobertura das 27 UFs. As fontes ficam em `data/personagens/`; os arquivos monolíticos são gerados. Perfis culturais sensíveis permanecem não publicáveis até pesquisa e revisão.

Referências: `docs/CATALOGO_BRASILEIRO_PERSONAGENS.md`, `docs/REVISAO_CULTURAL_PERSONAGENS.md` e `data/relatorio-validacao-catalogo.json`.
<!-- CATALOGO_BRASILEIRO_FIM -->
