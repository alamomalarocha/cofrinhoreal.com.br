# Avatares do Usuario

Os avatares do usuario nao sao personagens fixos da historia.

Eles representam a conta da pessoa dentro do app e poderao ser personalizados visualmente no futuro.

## Separacao essencial

O Cofrinho Real separa oficialmente tres conceitos:

- **Pig Principal**: mascote oficial, guia, comunicador, professor-amigo, personagem da logo e referencia visual da marca.
- **Avatar Pig do usuario**: representacao visual escolhida pela pessoa dentro do app.
- **Vila Pig / Familia Pig**: universo de personagens fixos, historias, familia, escola, comercio e comunidade.

Frase de referencia:

> O Pig Principal e o mascote/guia da marca. O Avatar Pig do usuario e a representacao visual da pessoa dentro do app. A Vila Pig e o universo de personagens e historias.

## Pig Principal

O Pig Principal e o mascote oficial da marca Cofrinho Real.

Ele e:

- guia;
- comunicador;
- professor-amigo;
- rosto da marca;
- personagem da logo;
- personagem que orienta o projeto.

Ele nao representa uma pessoa especifica e nao e avatar de usuario.

O Pig Principal continua sendo:

```text
001 - Pig Principal
assets/characters/001-pig-principal.png
```

## Avatar Pig do usuario

O Avatar Pig do usuario e a representacao visual da pessoa dentro do app.

## Opcoes publicas de avatar

As opcoes de avatar sao estilos visuais: Pig Azul, Pig Rosa, Pig Arco-iris e Pig Padrao. Elas nao representam declaracao obrigatoria de identidade pessoal.

Pergunta oficial no onboarding:

> Como voce quer personalizar seu Pig?

Texto de apoio:

> Voce pode mudar isso depois.

Opcoes publicas:

1. **Pig Azul**: estilo azul, calmo, classico e amigavel.
2. **Pig Rosa**: estilo rosa, doce, afetivo e carinhoso.
3. **Pig Arco-iris**: estilo colorido e inclusivo, com faixas de arco-iris claramente visiveis na roupa ou nos acessorios principais.
4. **Pig Padrao**: visual neutro/universal do Cofrinho Real, para quem prefere nao escolher ou nao informar.

Regras publicas:

- nao usar publicamente "menino";
- nao usar publicamente "menina";
- nao usar publicamente "LGBT";
- nao usar publicamente "neutro";
- nao perguntar "o que voce e";
- nao coletar informacao sensivel;
- nao transformar escolha visual em declaracao de identidade pessoal;
- tratar tudo como personalizacao visual do avatar.

Nomes internos:

- `avatar_style: azul`
- `avatar_style: rosa`
- `avatar_style: arco_iris`
- `avatar_style: padrao`

Esses valores representam apenas estilo visual.

## Avatares por faixa etaria

Os personagens `002` a `011` representam as faixas etarias base do avatar do usuario.

Esses assets sao versoes base/padrao por idade:

1. **Pig Bebe**: 0 a 2 anos. Conta administrada por responsaveis.
2. **Pig Primeirinhos**: 3 a 5 anos. Primeiras cores, numeros e vinculo com o cofrinho.
3. **Pig Crianca**: 6 a 9 anos. Moedas, pequenos valores, metas simples e jogos educativos.
4. **Pig Pre-Adolescente**: 10 a 12 anos. Primeiras escolhas, autonomia e responsabilidade.
5. **Pig Adolescente**: 13 a 17 anos. Consumo consciente, metas maiores, PigCoins e juros ficticios.
6. **Pig Jovem**: 18 a 24 anos. Faculdade, trabalho e metas pessoais.
7. **Pig Jovem Adulto**: 25 a 34 anos. Vida independente e controle pessoal.
8. **Pig Adulto**: 35 a 49 anos. Familia, filhos, trabalho e envio de Pig.
9. **Pig Coroa**: 50 a 64 anos. Experiencia e apoio a familia.
10. **Pig Senior**: 65+. Netos, carinho, legado e participacao familiar.

No futuro, cada faixa etaria podera ter variacoes visuais:

- padrao;
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

Criar essas variacoes apenas pelo fluxo guiado, uma imagem por vez, com aceite visual antes de salvar.

## Vila Pig e personagens fixos

Os personagens da Vila Pig / Familia Pig sao diferentes do Avatar Pig do usuario.

Eles sao personagens fixos do universo narrativo, como:

- Pinguinha;
- Vovo Zefa;
- Vovo Joao;
- Mae Helena;
- Seu Damiao;
- Tia Carmem;
- amigos, vizinhos, comerciantes, escola e comunidade.

## Estado atual da fase de imagens

Neste momento, apenas `001 - Pig Principal` esta oficializado como imagem criada.

Os avatares `002` a `011` continuam como sequencia base/padrao por faixa etaria, mas suas imagens serao recriadas uma por uma com o conceito correto.

As imagens antigas de `002` a `010` foram preservadas como rascunhos em `assets/characters/_drafts/` e nao devem ser tratadas como assets oficiais.

## Regra visual

Avatares devem ser afetuosos, modernos e respeitosos. Nunca devem virar caricatura, ranking social, mecanismo de vicio ou incentivo a consumo compulsivo.

## Avatar style na experiência logada

A escolha de avatar style pertence à experiência logada futura. Antes do login, o site/app usa a identidade padrão do Pig Principal, neutra e universal.

Depois do login, o usuário poderá ver seu próprio universo Pig personalizado conforme tipo de conta, faixa etária e estilo visual escolhido.

Regra de referência:

> O público geral vê o Pig Principal neutro. O usuário logado vê o seu próprio universo Pig personalizado.

A pergunta pública continua sendo:

> Como você quer personalizar seu Pig?

Essa pergunta deve tratar a escolha como estilo visual, sem coletar informação sensível e sem usar publicamente termos como "menino", "menina", "LGBT" ou "neutro".

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

## Variacao criada - 002 Pig Bebe padrao

A variacao `padrao` do avatar `002 - Pig Bebe` foi criada e salva como asset oficial de avatar.

- numero principal: `002`
- nome principal: `Pig Bebe`
- slug principal: `pig-bebe`
- estilo visual: `padrao`
- arquivo da variacao: `assets/characters/002-pig-bebe-padrao.png`

O asset principal `assets/characters/002-pig-bebe.png` permanece como referencia principal planejada do personagem. As proximas variacoes seguem pendentes: azul, rosa e arco_iris.

## Variacao criada - 002 Pig Bebe azul

A variacao `azul` do avatar `002 - Pig Bebe` foi criada e salva como asset oficial de avatar.

- numero principal: `002`
- nome principal: `Pig Bebe`
- slug principal: `pig-bebe`
- estilo visual: `azul`
- arquivo da variacao: `assets/characters/002-pig-bebe-azul.png`

O asset principal `assets/characters/002-pig-bebe.png` permanece como referencia principal planejada do personagem. As proximas variacoes seguem pendentes: rosa e arco_iris.

## Variacao criada - 002 Pig Bebe rosa

A variacao `rosa` do avatar `002 - Pig Bebe` foi criada e salva como asset oficial de avatar.

- numero principal: `002`
- nome principal: `Pig Bebe`
- slug principal: `pig-bebe`
- estilo visual: `rosa`
- arquivo da variacao: `assets/characters/002-pig-bebe-rosa.png`

O asset principal `assets/characters/002-pig-bebe.png` permanece como referencia principal planejada do personagem. A proxima variacao pendente e: arco_iris.

## Diferenca entre Pig Padrao e Pig Arco-iris

Pig Padrao e a opcao neutra/universal para quem prefere nao escolher. Ele segue a identidade do Pig Principal, equilibrando azul, rosa, amarelo/dourado, branco/off-white e azul escuro, sem predominancia forte de rosa, azul ou arco-iris.

Pig Arco-iris e a opcao visual colorida/inclusiva. Ele deve ter arco-iris claramente visivel, com roupa ou acessorios principais usando faixas ou linhas inspiradas em arco-iris. As cores vermelho, laranja, amarelo, verde, azul e lilas/roxo devem aparecer de forma organizada, mantendo visual infantil, bonito e limpo.

Nao tratar Pig Arco-iris como apenas detalhe pastel discreto. Ele precisa continuar reconhecivel como arco-iris mesmo em miniatura/card.

Nome publico principal: Pig Arco-iris. Se for necessario suavizar em algum material especifico, Pig Colorido pode aparecer apenas como apelido visual.

## Variacao criada - 002 Pig Bebe arco_iris

A variacao `arco_iris` do avatar `002 - Pig Bebe` foi criada e salva como asset oficial de avatar.

- numero principal: `002`
- nome principal: `Pig Bebe`
- slug principal: `pig-bebe`
- estilo visual: `arco_iris`
- arquivo da variacao: `assets/characters/002-pig-bebe-arco-iris.png`

O asset principal `assets/characters/002-pig-bebe.png` permanece como referencia principal planejada do personagem. As quatro variacoes do Pig Bebe estao criadas: padrao, azul, rosa e arco_iris.

A imagem `assets/characters/002-pig-bebe-arco-iris.png` e a primeira referencia visual aprovada para o estilo Pig Arco-iris.

Nos avatares estilo `arco_iris`, a roupa principal deve ter faixas fortes e reconheciveis de arco-iris, seguindo a referencia visual do arquivo `assets/characters/002-pig-bebe-arco-iris.png`. Nao usar apenas detalhes pastel discretos.

Prompts futuros de `arco_iris` devem pedir roupa principal com faixas fortes em vermelho, laranja, amarelo, verde, azul e roxo/lilas, mantendo visual neutro/universal e sem laco, flor, saia, acessorio feminino, bone ou elemento que puxe para masculino.

## Variacao criada - 003 Pig Primeirinhos padrao

A variacao `padrao` do avatar `003 - Pig Primeirinhos` foi criada e salva como asset oficial de avatar.

- numero principal: `003`
- nome principal: `Pig Primeirinhos`
- slug principal: `pig-primeirinhos`
- estilo visual: `padrao`
- arquivo da variacao: `assets/characters/003-pig-primeirinhos-padrao.png`

O asset principal `assets/characters/003-pig-primeirinhos.png` permanece como referencia principal planejada do personagem. As proximas variacoes seguem pendentes: azul, rosa e arco_iris.

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
## Avatar 002 - Pig Bebe - padrao recriado

A variacao `padrao` do avatar `002 - Pig Bebe` foi recriada no sistema visual simples `camisa_calca_tenis`.

- arquivo oficial: `assets/characters/002-pig-bebe-padrao.png`
- asset principal preservado: `assets/characters/002-pig-bebe.png`
- status da variacao `padrao`: `criada`
- proxima variacao pendente: `002 - Pig Bebe - azul`
## Avatar 002 - Pig Bebe - azul recriado

A variacao `azul` do avatar `002 - Pig Bebe` foi recriada no sistema visual simples `camisa_calca_tenis`.

- arquivo oficial: `assets/characters/002-pig-bebe-azul.png`
- asset principal preservado: `assets/characters/002-pig-bebe.png`
- status da variacao `azul`: `criada`
- proxima variacao pendente: `002 - Pig Bebe - rosa`

## Regra de prompt ultra curto para avatares

Todo prompt visual de avatar deve ser isolado, ultra curto e ter no maximo 8 linhas.

Sempre comecar com:

```text
Crie do zero. Ignore prints, telas, logos, cards e imagens anteriores.
```

O prompt deve dizer apenas faixa etaria, pose, roupa, cor, proibicoes essenciais e fundo transparente. Nao incluir dados tecnicos, caminhos, JSON, CSV, commit, explicacoes longas ou listas extensas.

Para `002 - Pig Bebe`, usar bebe de 0 a 2 anos sentado. Do `003` ao `011`, usar sempre corpo inteiro, em pe e centralizado.
## Avatar 002 - Pig Bebe - rosa recriado

A variacao `rosa` do avatar `002 - Pig Bebe` foi recriada no sistema visual simples `camisa_calca_tenis`.

- arquivo oficial: `assets/characters/002-pig-bebe-rosa.png`
- asset principal preservado: `assets/characters/002-pig-bebe.png`
- status da variacao `rosa`: `criada`
- proxima variacao pendente: `002 - Pig Bebe - arco_iris`
## Avatar 002 - Pig Bebe - arco_iris recriado

A variacao `arco_iris` do avatar `002 - Pig Bebe` foi recriada no sistema visual simples `camisa_calca_tenis`.

- arquivo oficial: `assets/characters/002-pig-bebe-arco-iris.png`
- asset principal preservado: `assets/characters/002-pig-bebe.png`
- status da variacao `arco_iris`: `criada`
- proximo item pendente: `003 - Pig Primeirinhos - padrao`
## Avatar 003 - Pig Primeirinhos - padrao recriado

A variacao `padrao` do avatar `003 - Pig Primeirinhos` foi recriada no sistema visual simples `camisa_calca_tenis`.

- arquivo oficial: `assets/characters/003-pig-primeirinhos-padrao.png`
- asset principal preservado: `assets/characters/003-pig-primeirinhos.png`
- status da variacao `padrao`: `criada`
- proxima variacao pendente: `003 - Pig Primeirinhos - azul`

## Avatar 003 - Pig Primeirinhos - azul recriado

A variacao `azul` do avatar `003 - Pig Primeirinhos` foi recriada no sistema visual simples `camisa_calca_tenis`.

- arquivo oficial: `assets/characters/003-pig-primeirinhos-azul.png`
- asset principal preservado: `assets/characters/003-pig-primeirinhos.png`
- status da variacao `azul`: `criada`
- proxima variacao pendente: `003 - Pig Primeirinhos - rosa`

## Avatar 003 - Pig Primeirinhos - rosa recriado

A variacao `rosa` do avatar `003 - Pig Primeirinhos` foi recriada no sistema visual simples `camisa_calca_tenis`.

- arquivo oficial: `assets/characters/003-pig-primeirinhos-rosa.png`
- asset principal preservado: `assets/characters/003-pig-primeirinhos.png`
- status da variacao `rosa`: `criada`
- proxima variacao pendente: `003 - Pig Primeirinhos - arco_iris`

## Avatar 003 - Pig Primeirinhos - arco_iris recriado

A variacao `arco_iris` do avatar `003 - Pig Primeirinhos` foi recriada no sistema visual simples `camisa_calca_tenis`.

- arquivo oficial: `assets/characters/003-pig-primeirinhos-arco-iris.png`
- asset principal preservado: `assets/characters/003-pig-primeirinhos.png`
- status da variacao `arco_iris`: `criada`
- variacoes do `003 - Pig Primeirinhos` criadas: `padrao`, `azul`, `rosa`, `arco_iris`
- proximo item pendente: `004 - Pig Crianca - padrao`

## Avatar 004 - Pig Crianca - padrao recriado

A variacao `padrao` do avatar `004 - Pig Crianca` foi recriada no sistema visual simples `camisa_calca_tenis`.

- arquivo oficial: `assets/characters/004-pig-crianca-padrao.png`
- asset principal preservado: `assets/characters/004-pig-crianca.png`
- status da variacao `padrao`: `criada`
- proxima variacao pendente: `004 - Pig Crianca - azul`

## Avatar 004 - Pig Crianca - azul recriado

A variacao `azul` do avatar `004 - Pig Crianca` foi recriada no sistema visual simples `camisa_calca_tenis`.

- arquivo oficial: `assets/characters/004-pig-crianca-azul.png`
- asset principal preservado: `assets/characters/004-pig-crianca.png`
- status da variacao `azul`: `criada`
- proxima variacao pendente: `004 - Pig Crianca - rosa`

## Avatar 004 - Pig Crianca - rosa recriado

A variacao `rosa` do avatar `004 - Pig Crianca` foi recriada no sistema visual simples `camisa_calca_tenis`.

- arquivo oficial: `assets/characters/004-pig-crianca-rosa.png`
- asset principal preservado: `assets/characters/004-pig-crianca.png`
- status da variacao `rosa`: `criada`
- proxima variacao pendente: `004 - Pig Crianca - arco_iris`

## Avatar 004 - Pig Crianca - arco_iris recriado

A variacao `arco_iris` do avatar `004 - Pig Crianca` foi recriada no sistema visual simples `camisa_calca_tenis`.

- arquivo oficial: `assets/characters/004-pig-crianca-arco-iris.png`
- asset principal preservado: `assets/characters/004-pig-crianca.png`
- status da variacao `arco_iris`: `criada`
- variacoes do `004 - Pig Crianca` criadas: `padrao`, `azul`, `rosa`, `arco_iris`
- proximo item pendente: `005 - Pig Pre-Adolescente - padrao`

## Avatar 005 - Pig Pre-Adolescente - padrao recriado

A variacao `padrao` do avatar `005 - Pig Pre-Adolescente` foi recriada no sistema visual simples `camisa_calca_tenis`.

- arquivo oficial: `assets/characters/005-pig-pre-adolescente-padrao.png`
- asset principal preservado: `assets/characters/005-pig-pre-adolescente.png`
- status da variacao `padrao`: `criada`
- proxima variacao pendente: `005 - Pig Pre-Adolescente - azul`

## Avatar 005 - Pig Pre-Adolescente - azul recriado

A variacao `azul` do avatar `005 - Pig Pre-Adolescente` foi recriada no sistema visual simples `camisa_calca_tenis`.

- arquivo oficial: `assets/characters/005-pig-pre-adolescente-azul.png`
- asset principal preservado: `assets/characters/005-pig-pre-adolescente.png`
- status da variacao `azul`: `criada`
- proxima variacao pendente: `005 - Pig Pre-Adolescente - rosa`

## Avatar 005 - Pig Pre-Adolescente - rosa recriado

A variacao `rosa` do avatar `005 - Pig Pre-Adolescente` foi recriada no sistema visual simples `camisa_calca_tenis`.

- arquivo oficial: `assets/characters/005-pig-pre-adolescente-rosa.png`
- asset principal preservado: `assets/characters/005-pig-pre-adolescente.png`
- status da variacao `rosa`: `criada`
- proxima variacao pendente: `005 - Pig Pre-Adolescente - arco_iris`

## Avatar 005 - Pig Pre-Adolescente - arco_iris recriado

A variacao `arco_iris` do avatar `005 - Pig Pre-Adolescente` foi recriada no sistema visual simples `camisa_calca_tenis`.

- arquivo oficial: `assets/characters/005-pig-pre-adolescente-arco-iris.png`
- asset principal preservado: `assets/characters/005-pig-pre-adolescente.png`
- status da variacao `arco_iris`: `criada`
- variacoes do `005 - Pig Pre-Adolescente` criadas: `padrao`, `azul`, `rosa`, `arco_iris`
- proximo item pendente: `006 - Pig Adolescente - padrao`

## Avatar 006 - Pig Adolescente - padrao recriado

A variacao `padrao` do avatar `006 - Pig Adolescente` foi recriada no sistema visual simples `camisa_calca_tenis`.

- arquivo oficial: `assets/characters/006-pig-adolescente-padrao.png`
- asset principal preservado: `assets/characters/006-pig-adolescente.png`
- status da variacao `padrao`: `criada`
- proxima variacao pendente: `006 - Pig Adolescente - azul`

## Avatar 006 - Pig Adolescente - azul recriado

A variacao `azul` do avatar `006 - Pig Adolescente` foi recriada no sistema visual simples `camisa_calca_tenis`.

- arquivo oficial: `assets/characters/006-pig-adolescente-azul.png`
- asset principal preservado: `assets/characters/006-pig-adolescente.png`
- status da variacao `azul`: `criada`
- proxima variacao pendente: `006 - Pig Adolescente - rosa`

## Avatar 006 - Pig Adolescente - rosa recriado

A variacao `rosa` do avatar `006 - Pig Adolescente` foi recriada no sistema visual simples `camisa_calca_tenis`.

- arquivo oficial: `assets/characters/006-pig-adolescente-rosa.png`
- asset principal preservado: `assets/characters/006-pig-adolescente.png`
- status da variacao `rosa`: `criada`
- proxima variacao pendente: `006 - Pig Adolescente - arco_iris`

## Avatar 006 - Pig Adolescente - arco_iris recriado

A variacao `arco_iris` do avatar `006 - Pig Adolescente` foi recriada no sistema visual simples `camisa_calca_tenis`.

- arquivo oficial: `assets/characters/006-pig-adolescente-arco-iris.png`
- asset principal preservado: `assets/characters/006-pig-adolescente.png`
- status da variacao `arco_iris`: `criada`
- variacoes do `006 - Pig Adolescente` criadas: `padrao`, `azul`, `rosa`, `arco_iris`
- proximo item pendente: `007 - Pig Jovem - padrao`

## Avatar 007 - Pig Jovem - padrao recriado

A variacao `padrao` do avatar `007 - Pig Jovem` foi recriada no sistema visual simples `camisa_calca_tenis`.

- arquivo oficial: `assets/characters/007-pig-jovem-padrao.png`
- asset principal preservado: `assets/characters/007-pig-jovem.png`
- status da variacao `padrao`: `criada`
- proxima variacao pendente: `007 - Pig Jovem - azul`

## Avatar 007 - Pig Jovem - azul recriado

A variacao `azul` do avatar `007 - Pig Jovem` foi recriada no sistema visual simples `camisa_calca_tenis`.

- arquivo oficial: `assets/characters/007-pig-jovem-azul.png`
- asset principal preservado: `assets/characters/007-pig-jovem.png`
- status da variacao `azul`: `criada`
- proxima variacao pendente: `007 - Pig Jovem - rosa`

## Avatar 007 - Pig Jovem - rosa recriado

A variacao `rosa` do avatar `007 - Pig Jovem` foi recriada no sistema visual simples `camisa_calca_tenis`.

- arquivo oficial: `assets/characters/007-pig-jovem-rosa.png`
- asset principal preservado: `assets/characters/007-pig-jovem.png`
- status da variacao `rosa`: `criada`
- proxima variacao pendente: `007 - Pig Jovem - arco_iris`

## Avatar 007 - Pig Jovem - arco_iris recriado

A variacao `arco_iris` do avatar `007 - Pig Jovem` foi recriada no sistema visual simples `camisa_calca_tenis`.

- arquivo oficial: `assets/characters/007-pig-jovem-arco-iris.png`
- asset principal preservado: `assets/characters/007-pig-jovem.png`
- status da variacao `arco_iris`: `criada`
- variacoes do `007 - Pig Jovem` criadas: `padrao`, `azul`, `rosa`, `arco_iris`
- proximo item pendente: `008 - Pig Jovem Adulto - padrao`

## Avatar 008 - Pig Jovem Adulto - padrao recriado

A variacao `padrao` do avatar `008 - Pig Jovem Adulto` foi recriada no sistema visual simples `camisa_calca_tenis`.

- arquivo oficial: `assets/characters/008-pig-jovem-adulto-padrao.png`
- asset principal preservado: `assets/characters/008-pig-jovem-adulto.png`
- status da variacao `padrao`: `criada`
- proxima variacao pendente: `008 - Pig Jovem Adulto - azul`
