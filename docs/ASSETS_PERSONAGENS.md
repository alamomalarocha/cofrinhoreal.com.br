# Assets Futuros dos Personagens

As imagens da Vila Pig ainda nao foram criadas.

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

Atualmente existem 2 imagens oficiais criadas:

```text
assets/characters/001-pig-principal.png
assets/characters/002-pig-bebe.png
```

## Status atual

Os personagens `001 — Pig Principal` e `002 — Pig Bebe` estao com:

```json
"status_imagem": "criada"
```

Os demais personagens continuam com:

```json
"status_imagem": "pendente"
```

Nao criar imagens agora. Nao usar IA para gerar imagens nesta etapa. Nao adicionar arquivos falsos ou placeholders como se fossem artes finais.
