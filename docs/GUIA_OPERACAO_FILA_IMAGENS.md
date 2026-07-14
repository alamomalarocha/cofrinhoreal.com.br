# Guia de operação da fila de imagens

Atualizado em 2026-07-14.

## Consultar sem alterar

Use o Node local disponível no ambiente e execute:

```powershell
node scripts/images/status.mjs
node scripts/images/plan.mjs --limit 12
node scripts/images/runner.mjs --pilot --limit 12 --dry-run --no-publish --no-push
```

Esses comandos não autorizam geração paga.

## Fluxo manual vigente

1. Consultar o próximo item elegível.
2. Entregar apenas o prompt visual puro ao ChatGPT Images.
3. Alamo recebe e revisa a imagem.
4. O Codex valida arquivo, transparência, enquadramento e coerência.
5. A imagem aprovada é salva no caminho canônico.
6. JSON, CSV, fila, documentação e Coleção Pig são atualizados.
7. O Codex faz commit e push autorizado.

No fluxo manual, o próximo prompt deve ser enviado antes da publicação da imagem atual.

## Revisão e parada

```powershell
node scripts/images/review.mjs
node scripts/images/review.mjs --approve assets/characters/ARQUIVO.png
node scripts/images/review.mjs --reject assets/characters/ARQUIVO.png --reason "motivo"
node scripts/images/stop.mjs
node scripts/images/stop.mjs --clear
```

Nunca usar aprovação automática para perfis culturais bloqueados ou arquivos que falharam na validação.
