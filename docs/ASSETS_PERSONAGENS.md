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

## Imagens oficiais criadas

Atualmente existem 7 imagens oficiais criadas:

```text
assets/characters/001-pig-principal.png
assets/characters/002-pig-bebe.png
assets/characters/003-pig-primeirinhos.png
assets/characters/004-pig-crianca.png
assets/characters/005-pig-pre-adolescente.png
assets/characters/006-pig-adolescente.png
assets/characters/007-pig-jovem.png
```

## Status atual

Os personagens `001 - Pig Principal`, `002 - Pig Bebe`, `003 - Pig Primeirinhos`, `004 - Pig Crianca`, `005 - Pig Pre-Adolescente`, `006 - Pig Adolescente` e `007 - Pig Jovem` estao com:

```json
"status_imagem": "criada"
```

O proximo personagem pendente da sequencia e:

```text
008 - Pig Jovem Adulto
assets/characters/008-pig-jovem-adulto.png
```

Os demais personagens continuam com:

```json
"status_imagem": "pendente"
```

Nao criar imagens sozinho. Nao usar IA dentro do Codex para gerar imagens nesta etapa. Nao adicionar arquivos falsos ou placeholders como se fossem artes finais.
