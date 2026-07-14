# Fila de criação de imagens

Atualizado em 2026-07-14.

## Fonte

- JSON: `data/fila-imagens-personagens.json`.
- CSV: `data/fila-imagens-personagens.csv`.
- Estado operacional: `data/image-automation/state.jsonl`.

## Estado do reset

- Total: 3.270 itens.
- Prontos para criação: 2.671.
- Bloqueados para pesquisa ou revisão: 599.
- Somente o Pig Principal permanece oficialmente criado no ponto inicial do reset.

## Ordem

A fila segue o catálogo e as identidades `azul`, `rosa` e `arco_iris`. Os primeiros 30 itens são os personagens 002–011 nas três identidades.

Itens bloqueados não recebem imagem até a pendência cultural, editorial ou jurídica ser resolvida.

## Operação

```powershell
node scripts/images/status.mjs
node scripts/images/plan.mjs --limit 12
node scripts/images/runner.mjs --pilot --limit 12 --dry-run --no-publish --no-push
```

O fluxo manual permanece uma imagem por vez. No fluxo manual, o próximo prompt deve ser enviado antes da publicação da imagem atual.

Consulte `GUIA_OPERACAO_FILA_IMAGENS.md` e `CUSTO_E_LIMITES_GERACAO_IMAGENS.md`.
