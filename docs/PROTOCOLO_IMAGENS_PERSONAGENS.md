# Protocolo Oficial de Imagens dos Personagens

Este documento define o fluxo oficial para criacao, recebimento, arquivamento e versionamento das imagens dos personagens da Vila Pig / Familia Pig.

## Regras obrigatorias

- Nao recriar personagens.
- Nao alterar a sequencia dos personagens.
- Nao mudar nomes, numeros ou slugs ja cadastrados.
- Nao criar imagens automaticamente dentro do Codex.
- Nao inventar arquivos inexistentes.
- Nao criar backend, banco real, login real, PIX real, app real ou movimentacao real.

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

## Padrao oficial de arquivo

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

## Fluxo oficial

1. O ChatGPT cria uma imagem de personagem fora do Codex.
2. Alamo envia essa imagem ao Codex.
3. O Codex salva a imagem exatamente no caminho definido em `asset_futuro`.
4. O Codex atualiza:
   - `data/vila-pig-personagens.json`
   - `data/vila-pig-personagens.csv`
   - documentacao relacionada, se necessario.
5. O campo `status_imagem` muda de `"pendente"` para `"criada"`.
6. O Codex faz commit e push.
7. Ao final, o Codex informa os proximos 5 personagens pendentes na sequencia do JSON, com:
   - `numero`
   - `nome`
   - `slug`
   - `asset_futuro`

## Exemplo do primeiro personagem

Quando uma imagem for enviada como:

```text
001 — Pig Principal
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

## Direcao visual preferencial

As imagens futuras devem preferencialmente ser:

- PNG;
- fundo transparente;
- corpo inteiro;
- personagem em pe;
- centralizadas;
- consistentes entre si;
- prontas para cards colecionaveis, app, site, redes sociais e materiais.

## Estado atual

Em 2026-07-02, o personagem `001 — Pig Principal` ainda esta com:

```json
"status_imagem": "pendente"
```

E aponta para:

```text
assets/characters/001-pig-principal.png
```
