# Automação segura de imagens dos personagens

Atualizado em 2026-07-14.

## Escopo

A automação local planeja prompts, valida arquivos, registra estados e prepara revisão. Ela não gera imagens pagas nem publica em armazenamento remoto no estado atual.

A automação não poderá iniciar geração paga sem autorização explícita de Alamo.

## Componentes

- Configuração: `data/image-automation/config.json`.
- Sistema visual: `data/image-automation/style-system.json`.
- Eventos: `data/image-automation/state.jsonl`.
- Revisão: `data/image-automation/review-queue.jsonl`.
- Erros: `data/image-automation/errors.jsonl`.
- Scripts: `scripts/images/`.

## Barreiras de segurança

- `provider.enabled` permanece `false`.
- `storage.enabled` permanece `false`.
- O modo padrão é `dry-run`.
- Geração real exige configuração, adaptador e autorização explícita; o adaptador atual bloqueia a execução.
- Publicação remota exige aprovação humana e permanece bloqueada.
- Um arquivo `data/image-automation/STOP` interrompe a preparação de novos itens.

## Estados

`pendente` → `gerando` → `gerada` → `fundo_removido` → `validada` → `aguardando_revisao` → `aprovada` → `publicada`.

Falhas usam `falhou` e não avançam automaticamente.

## Piloto atual

O piloto de 12 itens foi executado somente em `dry-run`: 12 prompts planejados, custo real zero, nenhuma chamada paga e nenhuma publicação.
