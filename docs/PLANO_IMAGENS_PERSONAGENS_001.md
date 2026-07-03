# Plano de Imagens dos Personagens 001

Data: 2026-07-02

## Objetivo

Preparar a proxima fase do Cofrinho Real: criacao gradual das imagens dos personagens da Vila Fazenda Pig.

Esta fase ainda nao cria imagens. Ela apenas define o processo para receber e organizar imagens futuramente.

## Estado atual

- A base de personagens existe em `data/vila-pig-personagens.json`.
- A versao CSV existe em `data/vila-pig-personagens.csv`.
- Existem 200 personagens cadastrados.
- Todos estao com `status_imagem: "pendente"`.
- Nenhuma imagem oficial de personagem foi criada.

## Como as imagens serao criadas

As imagens serao criadas fora do Codex, uma por uma ou em pequenos lotes.

Fluxo operacional oficial:

1. ChatGPT cria a imagem.
2. Alamo envia a imagem ao Codex.
3. Codex salva a imagem no caminho `asset_futuro`.
4. Codex atualiza JSON/CSV e documentacao se necessario.
5. Codex faz commit e push.
6. Codex informa os proximos 5 personagens pendentes.

Documento de protocolo: `docs/PROTOCOLO_IMAGENS_PERSONAGENS.md`.

Cada imagem devera ser enviada com nome correspondente ao personagem:

```text
NUMERO-SLUG.png
```

Exemplos:

- `001-pig-principal.png`
- `012-pinguinha.png`
- `013-mae-helena.png`
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

## Primeira leva sugerida

1. `001` Pig Principal
2. `012` Pinguinha
3. `013` Mae Helena
4. `014` Pai Raimundo
5. `017` Vovo Zefa
6. `018` Vovo Joao
7. `025` Seu Damiao da Padaria
8. `026` Tia Carmem da Cantina
9. Professora Lucia
10. Pedrinho
11. Aninha
12. Tia Maria

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
