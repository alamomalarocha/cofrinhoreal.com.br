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

Atualmente existem 3 imagens oficiais criadas:

```text
assets/characters/001-pig-principal.png
assets/characters/002-pig-bebe.png
assets/characters/003-pig-primeirinhos.png
```

## Status atual

Os personagens `001 - Pig Principal`, `002 - Pig Bebe` e `003 - Pig Primeirinhos` estao com:

```json
"status_imagem": "criada"
```

O proximo personagem pendente da sequencia e:

```text
004 - Pig Crianca
assets/characters/004-pig-crianca.png
```

Os demais personagens continuam com:

```json
"status_imagem": "pendente"
```

Nao criar imagens sozinho. Nao usar IA dentro do Codex para gerar imagens nesta etapa. Nao adicionar arquivos falsos ou placeholders como se fossem artes finais.
