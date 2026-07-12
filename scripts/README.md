# Scripts

Esta pasta sera usada futuramente para scripts auxiliares do projeto.

## Exemplos futuros

- geracao de assets
- validacao de documentos
- tarefas de build
- migracoes
- automacoes internas

## Regra

Scripts devem ser simples, documentados e seguros.

Nao criar automacoes destrutivas sem necessidade.

## Universo Pig

- `migrate-universo-pig.mjs`: migracao idempotente dos 201 personagens, preservando numeros, slugs e assets.
- `validate-universo-pig.mjs`: valida IDs, CSV, geracoes, fases, regioes, referencias e assets criados.

Executar:

```text
node scripts/validate-universo-pig.mjs
```
