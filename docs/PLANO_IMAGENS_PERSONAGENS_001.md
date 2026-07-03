# Plano de Imagens dos Personagens 001

Data: 2026-07-02

## Objetivo

Preparar a proxima fase do Cofrinho Real: criacao gradual das imagens dos personagens da Vila Fazenda Pig.

Esta fase nao cria imagens automaticamente. Ela define o processo para receber e organizar imagens oficiais enviadas por Alamo, uma por uma.

## Estado atual

- A base de personagens existe em `data/vila-pig-personagens.json`.
- A versao CSV existe em `data/vila-pig-personagens.csv`.
- Existem 200 personagens cadastrados.
- Os personagens `001 - Pig Principal`, `002 - Pig Bebe` e `003 - Pig Primeirinhos` ja possuem imagens oficiais criadas em `assets/characters/`.
- Os demais personagens seguem com `status_imagem: "pendente"`.

## Como as imagens serao criadas

As imagens serao criadas fora do Codex e arquivadas uma por uma.

Nao trabalhar em lote.
Nao pedir proximos 5 personagens.
Nao separar painel com varios personagens.
Nao alterar a sequencia oficial dos personagens.

Fluxo operacional oficial:

1. ChatGPT cria a imagem fora do Codex.
2. Alamo envia uma imagem oficial de personagem ao Codex.
3. Codex salva a imagem no caminho `asset_futuro` correspondente.
4. Codex atualiza JSON/CSV e documentacao obrigatoria.
5. Codex muda `status_imagem` de `"pendente"` para `"criada"`.
6. Codex faz commit e push.
7. Codex informa apenas o proximo personagem pendente da sequencia.
8. Codex devolve dois prompts prontos:
   - prompt para criar a proxima imagem no ChatGPT;
   - prompt para salvar a proxima imagem no Codex.

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

## Proximo personagem pendente

Depois da criacao dos personagens `001 - Pig Principal`, `002 - Pig Bebe` e `003 - Pig Primeirinhos`, o proximo personagem pendente da sequencia e:

- `004` Pig Crianca
- slug: `pig-crianca`
- asset futuro: `assets/characters/004-pig-crianca.png`

## Cuidados visuais

- Nao criar caricaturas ofensivas.
- Nao sexualizar personagens.
- Nao usar linguagem de aposta, cassino, bet, loot box ou premio financeiro.
- Representar diversidade de forma natural, respeitosa e sem rotulos forcados.
- Manter o Pig principal como guia da marca.
- Manter avatares do usuario separados dos personagens fixos da Vila Pig.

## Regra final

Imagem so vira asset oficial quando:

- nome do arquivo bate com numero e slug;
- arquivo esta salvo em `assets/characters/`;
- status foi atualizado em JSON/CSV;
- imagem foi revisada contra a identidade visual e os principios do projeto.
