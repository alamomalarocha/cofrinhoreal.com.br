# Assets Futuros dos Personagens

## Brasileirinho oficial

- Arquivo: `assets/characters/002-brasileirinho.png`
- SHA-256: `8772ba3de734f30f52bfdf5095b31172250dad14c413565e7c270c56344c616e`
- Dimensões: `1024 × 1536`
- Papel: representante narrativo do governo, das regras, das leis, dos impostos, do Tesouro, das políticas públicas e do bem comum.

O Brasileirinho é personagem principal separado. Não é avatar, não participa dos filtros Azul, Rosa ou Arco-íris, não substitui o Pig Principal e não altera os 27 avatares aprovados. O inventário público passa a ter 29 imagens oficiais: Pig Principal, Brasileirinho e 27 avatares.

As imagens da Vila Pig serao criadas e arquivadas gradualmente, uma por vez, sempre respeitando número, slug e caminho oficial.

## Regra de nome

Cada imagem futura devera seguir exatamente o número e o slug do personagem:

```text
assets/characters/NUMERO-SLUG.png
```

Exemplos:

```text
assets/characters/001-pig-principal.png
assets/characters/017-vovo-zefa.png
assets/characters/018-vovo-joao.png
assets/characters/025-seu-damiao-padaria.png
```

## Vínculo entre dados e imagem

O campo `asset_futuro` em `data/vila-pig-personagens.json` e em `data/vila-pig-personagens.csv` define o caminho esperado da imagem.

Quando uma imagem futura for enviada com o mesmo número e slug, o projeto poderá vincular automaticamente:

- JSON;
- CSV;
- documentação;
- arquivos de imagem;
- cards visuais.

## Imagem oficial criada

Neste momento existe apenas 1 imagem oficial criada:

```text
assets/characters/001-pig-principal.png
```

O personagem `001 - Pig Principal` esta com:

```json
"status_imagem": "criada"
```

O Pig Principal e o mascote/guia da marca e permanece aprovado.

## Rascunhos preservados

As imagens antigas dos personagens `002` a `010` foram movidas para:

```text
assets/characters/_drafts/
```

Esses arquivos são rascunhos históricos e não devem ser usados como assets oficiais.

## Próximo personagem pendente

O próximo personagem pendente da sequencia e:

```text
002 - Pig Bebe
assets/characters/002-pig-bebe.png
```

Os demais personagens continuam com:

```json
"status_imagem": "pendente"
```

Não criar imagens sozinho. Não usar IA dentro do Codex para gerar imagens nesta etapa. Não adicionar arquivos falsos ou placeholders como se fossem artes finais.

## Uso no website

O Pig Principal 001 é também a referência visual oficial da marca no website. Ele representa o mascote oficial, o guia visual do Cofrinho Real e a principal referência do universo Pig no protótipo atual. Essa decisão não altera a sequência de personagens nem as regras de avatar.


## Variações futuras de avatar

Os avatares `002` a `011` possuem variações planejadas para os estilos internos `padrao`, `azul`, `rosa` e `arco_iris`.

Exemplo futuro:

```text
assets/characters/004-pig-crianca-padrao.png
assets/characters/004-pig-crianca-azul.png
assets/characters/004-pig-crianca-rosa.png
assets/characters/004-pig-crianca-arco-iris.png
```

Não criar essas imagens agora.

## Logos Pig oficiais de marca

O projeto possui duas versões principais da logo Pig: uma versão com Pig em pé para header e uma versão alternativa com Pig integrado à composição da marca para uso interno.

- Header/site: `assets/brand/cofrinho-real-logo-pig-standing-full-transparent.png` e alias `assets/brand/cofrinho-real-logo-header-full-transparent.png`.
- Alternativa interna: `assets/brand/cofrinho-real-logo-pig-face-full-transparent.png` e alias `assets/brand/cofrinho-real-logo-site-full-transparent.png`.

O personagem 001 continua separado em `assets/characters/001-pig-principal.png`. As logos completas ficam em `assets/brand/` e não substituem o personagem individual.

## Asset oficial 201 - Vantajinho

O personagem especial Vantajinho possui imagem oficial em:

assets/characters/201-vantajinho.png

Esse asset pertence aos personagens da Vila Pig e não substitui o Pig Principal 001 nem as logos de marca em assets/brand/.

## Regra de aceite para assets de avatar

Assets de avatar dos usuários devem ser limpos e mostrar apenas o personagem. Não aceitar arquivos com texto, letras, números, logos, moedas, medalhas, patches, etiquetas, placas, monogramas, símbolos escritos, cenário, painel ou outros personagens.

Se isso acontecer, descartar a imagem e gerar uma nova do zero com prompt visual mais simples.

## Asset criado - 002 Pig Bebê padrão

A primeira variação oficial do avatar `002 - Pig Bebe` foi salva em:

```text
assets/characters/002-pig-bebe-padrao.png
```

Esse arquivo representa o estilo visual `padrao` do avatar de 0 a 2 anos. Ele não substitui o Pig Principal 001, o Vantajinho 201 ou qualquer logo oficial.

## Asset criado - 002 Pig Bebê azul

A variação azul oficial do avatar `002 - Pig Bebe` foi salva em:

```text
assets/characters/002-pig-bebe-azul.png
```

Esse arquivo representa o estilo visual `azul` do avatar de 0 a 2 anos. Ele não substitui o Pig Principal 001, o Vantajinho 201 ou qualquer logo oficial.

## Asset criado - 002 Pig Bebê rosa

A variação rosa oficial do avatar `002 - Pig Bebe` foi salva em:

```text
assets/characters/002-pig-bebe-rosa.png
```

Esse arquivo representa o estilo visual `rosa` do avatar de 0 a 2 anos. Ele não substitui o Pig Principal 001, o Vantajinho 201 ou qualquer logo oficial.

## Direção visual do asset Pig Arco-íris

Assets no estilo `arco_iris` devem mostrar faixas ou linhas de arco-íris claramente visiveis na roupa ou nos acessórios principais. Não basta usar pequenos detalhes pastel.

O estilo `padrao` continua sendo a opcao neutra/universal para quem prefere não escolher.

## Asset criado - 002 Pig Bebê arco_iris

A variação arco_iris oficial do avatar `002 - Pig Bebe` foi salva em:

```text
assets/characters/002-pig-bebe-arco-iris.png
```

Esse arquivo representa o estilo visual `arco_iris` do avatar de 0 a 2 anos. Ele não substitui o Pig Principal 001, o Vantajinho 201 ou qualquer logo oficial.

A imagem `assets/characters/002-pig-bebe-arco-iris.png` e a primeira referência visual aprovada para o estilo Pig Arco-íris.

Nos avatares estilo `arco_iris`, a roupa principal deve ter faixas fortes e reconhecíveis de arco-íris, seguindo a referência visual do arquivo `assets/characters/002-pig-bebe-arco-iris.png`. Não usar apenas detalhes pastel discretos.

Prompts futuros de `arco_iris` devem pedir roupa principal com faixas fortes em vermelho, laranja, amarelo, verde, azul e roxo/lilas, mantendo visual neutro/universal e sem laço, flor, saia, acessorio feminino, boné ou elemento que puxe para masculino.

## Asset criado - 003 Pig Primeirinhos padrão

A variação padrão oficial do avatar `003 - Pig Primeirinhos` foi salva em:

```text
assets/characters/003-pig-primeirinhos-padrao.png
```

Esse arquivo representa o estilo visual `padrao` do avatar de 3 a 5 anos. Ele não substitui o Pig Principal 001, o Vantajinho 201 ou qualquer logo oficial.

## Reset visual dos assets de avatar

Os assets oficiais dos avatares `002` a `011` serao recriados com o sistema simples de camisa, calca/short e tênis.

Arquivos antigos movidos para rascunho:

- assets/characters/002-pig-bebe-padrao.png -> assets/characters/_drafts/avatars/002-pig-bebe-padrao-rascunho-pre-sistema-simples.png
- assets/characters/002-pig-bebe-azul.png -> assets/characters/_drafts/avatars/002-pig-bebe-azul-rascunho-pre-sistema-simples.png
- assets/characters/002-pig-bebe-rosa.png -> assets/characters/_drafts/avatars/002-pig-bebe-rosa-rascunho-pre-sistema-simples.png
- assets/characters/002-pig-bebe-arco-iris.png -> assets/characters/_drafts/avatars/002-pig-bebe-arco-iris-rascunho-pre-sistema-simples.png
- assets/characters/003-pig-primeirinhos-padrao.png -> assets/characters/_drafts/avatars/003-pig-primeirinhos-padrao-rascunho-pre-sistema-simples.png

Esses rascunhos não substituem os novos assets oficiais.
## Avatar 002 - Pig Bebê - padrão recriado

A variação `padrao` do avatar `002 - Pig Bebe` foi recriada no sistema visual simples `camisa_calca_tenis`.

- arquivo oficial: `assets/characters/002-pig-bebe-padrao.png`
- asset principal preservado: `assets/characters/002-pig-bebe.png`
- status da variação `padrao`: `criada`
- próxima variação pendente: `002 - Pig Bebe - azul`

## Coleção Pig no site

Os assets oficiais de personagens em `assets/characters/` alimentam a página `personagens.html`, chamada Coleção Pig. Cada imagem criada deve aparecer como card visual educativo, sem valor financeiro e sem linguagem de aposta.

Quando uma nova imagem oficial for salva, atualizar os dados em `data/vila-pig-personagens.json` e confirmar que o card correspondente aparece na Coleção Pig.
## Avatar 002 - Pig Bebê - azul recriado

A variação `azul` do avatar `002 - Pig Bebe` foi recriada no sistema visual simples `camisa_calca_tenis`.

- arquivo oficial: `assets/characters/002-pig-bebe-azul.png`
- asset principal preservado: `assets/characters/002-pig-bebe.png`
- status da variação `azul`: `criada`
- próxima variação pendente: `002 - Pig Bebe - rosa`
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

## Validação de assets

Antes de marcar uma imagem como criada, conferir PNG, canal alfa, margem segura, ausencia de texto e caminho oficial. `scripts/validate-universo-pig.mjs` confirma a existencia e assinatura PNG dos assets registrados.

As regras completas estao em `GUIA_VISUAL_PERSONAGENS.md`.

<!-- CATALOGO_BRASILEIRO_INICIO -->
## Catálogo brasileiro compilado

Em 2026-07-12, o catálogo passou a ter 3251 registros fixos, 1430 famílias e cobertura das 27 UFs. As fontes ficam em `data/personagens/`; os arquivos monolíticos são gerados. Perfis culturais sensíveis permanecem não publicáveis até pesquisa e revisão.

Referências: `docs/CATALOGO_BRASILEIRO_PERSONAGENS.md`, `docs/REVISAO_CULTURAL_PERSONAGENS.md` e `data/relatorio-validacao-catalogo.json`.
<!-- CATALOGO_BRASILEIRO_FIM -->

<!-- image-automation:assets/characters/002-pig-bebe-azul.png -->
- 002 - Pig Bebê - azul:
  `assets/characters/002-pig-bebe-azul.png` aprovado e incorporado ao catalogo local em 2026-07-19T12:05:09.620Z.

<!-- image-automation:assets/characters/002-pig-bebe-rosa.png -->
- 002 - Pig Bebê - rosa:
  `assets/characters/002-pig-bebe-rosa.png` aprovado e incorporado ao catalogo local em 2026-07-19T12:05:10.691Z.

<!-- image-automation:assets/characters/002-pig-bebe-arco-iris.png -->
- 002 - Pig Bebê - arco_iris:
  `assets/characters/002-pig-bebe-arco-iris.png` aprovado e incorporado ao catalogo local em 2026-07-19T12:05:11.821Z.
