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
