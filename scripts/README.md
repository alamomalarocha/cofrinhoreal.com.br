# Scripts

Esta pasta será usada futuramente para scripts auxiliares do projeto.

## Exemplos futuros

- geração de assets
- validação de documentos
- tarefas de build
- migrações
- automacoes internas

## Regra

Scripts devem ser simples, documentados e seguros.

Não criar automacoes destrutivas sem necessidade.

## Universo Pig

Ferramentas atuais:

- `build-personagens-catalog.mjs`: recompila as fontes segmentadas e os arquivos públicos do catálogo.
- `build-fila-imagens-personagens.mjs`: recompila a fila de criação de imagens.
- `audit-pt-br.mjs`: audita textos editoriais em português brasileiro sem alterar arquivos.
- `next-image-prompt.mjs`: identifica o próximo item pendente e gera um prompt visual curto, sem alterar arquivos ou status.

- `migrate-universo-pig.mjs`: migração idempotente dos 201 personagens, preservando números, slugs e assets.
- `validate-universo-pig.mjs`: valida IDs, CSV, gerações, fases, regiões, referências e assets criados.

Executar:

```text
node scripts/validate-universo-pig.mjs
node scripts/audit-pt-br.mjs
node scripts/next-image-prompt.mjs --exclude "assets/characters/ITEM-ATUAL.png"
```

O argumento `--exclude` impede que o item recebido seja devolvido novamente como próximo item. Os scripts de auditoria e de próximo prompt são somente de leitura.
