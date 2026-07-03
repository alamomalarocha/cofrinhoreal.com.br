# Assets Futuros dos Personagens

As imagens da Vila Pig serao criadas e arquivadas gradualmente, uma por vez, sempre respeitando numero, slug e caminho oficial.

## Regra de nome

Cada imagem futura devera seguir exatamente o numero e o slug do personagem:

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

## Vinculo entre dados e imagem

O campo `asset_futuro` em `data/vila-pig-personagens.json` e em `data/vila-pig-personagens.csv` define o caminho esperado da imagem.

Quando uma imagem futura for enviada com o mesmo numero e slug, o projeto podera vincular automaticamente:

- JSON;
- CSV;
- documentacao;
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

Esses arquivos sao rascunhos historicos e nao devem ser usados como assets oficiais.

## Proximo personagem pendente

O proximo personagem pendente da sequencia e:

```text
002 - Pig Bebe
assets/characters/002-pig-bebe.png
```

Os demais personagens continuam com:

```json
"status_imagem": "pendente"
```

Nao criar imagens sozinho. Nao usar IA dentro do Codex para gerar imagens nesta etapa. Nao adicionar arquivos falsos ou placeholders como se fossem artes finais.

## Uso no website

O Pig Principal 001 é também a referência visual oficial da marca no website. Ele representa o mascote oficial, o guia visual do Cofrinho Real e a principal referência do universo Pig no protótipo atual. Essa decisão não altera a sequência de personagens nem as regras de avatar.


## Variacoes futuras de avatar

Os avatares `002` a `011` possuem variacoes planejadas para os estilos internos `padrao`, `azul`, `rosa` e `arco_iris`.

Exemplo futuro:

```text
assets/characters/004-pig-crianca-padrao.png
assets/characters/004-pig-crianca-azul.png
assets/characters/004-pig-crianca-rosa.png
assets/characters/004-pig-crianca-arco-iris.png
```

Nao criar essas imagens agora.

## Logos Pig oficiais de marca

O projeto possui duas versões principais da logo Pig: uma versão com Pig em pé para header e uma versão alternativa com Pig integrado à composição da marca para uso interno.

- Header/site: `assets/brand/cofrinho-real-logo-pig-standing-full-transparent.png` e alias `assets/brand/cofrinho-real-logo-header-full-transparent.png`.
- Alternativa interna: `assets/brand/cofrinho-real-logo-pig-face-full-transparent.png` e alias `assets/brand/cofrinho-real-logo-site-full-transparent.png`.

O personagem 001 continua separado em `assets/characters/001-pig-principal.png`. As logos completas ficam em `assets/brand/` e não substituem o personagem individual.

## Asset oficial 201 - Vantajinho

O personagem especial Vantajinho possui imagem oficial em:

assets/characters/201-vantajinho.png

Esse asset pertence aos personagens da Vila Pig e nao substitui o Pig Principal 001 nem as logos de marca em assets/brand/.

## Regra de aceite para assets de avatar

Assets de avatar dos usuarios devem ser limpos e mostrar apenas o personagem. Nao aceitar arquivos com texto, letras, numeros, logos, moedas, medalhas, patches, etiquetas, placas, monogramas, simbolos escritos, cenario, painel ou outros personagens.

Se isso acontecer, descartar a imagem e gerar uma nova do zero com prompt visual mais simples.

## Asset criado - 002 Pig Bebe padrao

A primeira variacao oficial do avatar `002 - Pig Bebe` foi salva em:

```text
assets/characters/002-pig-bebe-padrao.png
```

Esse arquivo representa o estilo visual `padrao` do avatar de 0 a 2 anos. Ele nao substitui o Pig Principal 001, o Vantajinho 201 ou qualquer logo oficial.

## Asset criado - 002 Pig Bebe azul

A variacao azul oficial do avatar `002 - Pig Bebe` foi salva em:

```text
assets/characters/002-pig-bebe-azul.png
```

Esse arquivo representa o estilo visual `azul` do avatar de 0 a 2 anos. Ele nao substitui o Pig Principal 001, o Vantajinho 201 ou qualquer logo oficial.

## Asset criado - 002 Pig Bebe rosa

A variacao rosa oficial do avatar `002 - Pig Bebe` foi salva em:

```text
assets/characters/002-pig-bebe-rosa.png
```

Esse arquivo representa o estilo visual `rosa` do avatar de 0 a 2 anos. Ele nao substitui o Pig Principal 001, o Vantajinho 201 ou qualquer logo oficial.

## Direcao visual do asset Pig Arco-iris

Assets no estilo `arco_iris` devem mostrar faixas ou linhas de arco-iris claramente visiveis na roupa ou nos acessorios principais. Nao basta usar pequenos detalhes pastel.

O estilo `padrao` continua sendo a opcao neutra/universal para quem prefere nao escolher.

## Asset criado - 002 Pig Bebe arco_iris

A variacao arco_iris oficial do avatar `002 - Pig Bebe` foi salva em:

```text
assets/characters/002-pig-bebe-arco-iris.png
```

Esse arquivo representa o estilo visual `arco_iris` do avatar de 0 a 2 anos. Ele nao substitui o Pig Principal 001, o Vantajinho 201 ou qualquer logo oficial.

A imagem `assets/characters/002-pig-bebe-arco-iris.png` e a primeira referencia visual aprovada para o estilo Pig Arco-iris.

Nos avatares estilo `arco_iris`, a roupa principal deve ter faixas fortes e reconheciveis de arco-iris, seguindo a referencia visual do arquivo `assets/characters/002-pig-bebe-arco-iris.png`. Nao usar apenas detalhes pastel discretos.

Prompts futuros de `arco_iris` devem pedir roupa principal com faixas fortes em vermelho, laranja, amarelo, verde, azul e roxo/lilas, mantendo visual neutro/universal e sem laco, flor, saia, acessorio feminino, bone ou elemento que puxe para masculino.
