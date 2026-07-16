# Automação segura de imagens dos personagens

Atualizado em 2026-07-16.

## Escopo

A automação local já possui adaptador real para a OpenAI, remoção de fundo, validação PNG, revisão humana, aprovação local do catálogo e estimativa de custos. Todos os componentes permanecem bloqueados por padrão e nenhuma chamada paga foi executada.

A automação não poderá iniciar geração paga sem autorização explícita de Alamo.

## Componentes

- Configuração: `data/image-automation/config.json`.
- Sistema visual: `data/image-automation/style-system.json`.
- Eventos: `data/image-automation/state.jsonl`.
- Revisão: `data/image-automation/review-queue.jsonl`.
- Erros: `data/image-automation/errors.jsonl`.
- Manifesto do piloto: `data/image-automation/pilot-002-three-identities.json`.
- Bootstrap das fases: `data/image-automation/phase-bootstrap.json`.
- Bases técnicas privadas: `data/image-automation/phase-bases/`.
- Checkpoint retomável: `data/image-automation/runtime/runner-checkpoint.json`.
- Referências curadas: `assets/references/reference-manifest.json`.
- Área temporária ignorada pelo Git: `data/image-automation/tmp/image-pilot-review/`.
- Scripts: `scripts/images/`.

## Barreiras de segurança

- `provider.enabled` permanece `false` e o modo padrão é `dry-run`.
- `IMAGE_GENERATION_AUTHORIZED` precisa ser exatamente `true`.
- `IMAGE_PROVIDER` precisa ser exatamente `openai`.
- A execução precisa incluir `--execute-paid-generation`.
- `IMAGE_MAX_COST_USD` precisa ser positivo e suficiente.
- `OPENAI_API_KEY` precisa existir apenas no ambiente local.
- O Pig Principal precisa estar disponível e com hash válido para gerar a base técnica da fase.
- As identidades só podem ser geradas depois da aprovação humana da base técnica correspondente.
- Revisão humana é obrigatória; aprovação automática do catálogo não existe.
- Publicação remota e upload para R2 permanecem indisponíveis.
- Um arquivo `data/image-automation/STOP` interrompe a preparação de novos itens.

## Estados

`pendente` → `gerando` → `gerada` → `fundo_removido` → `validada` → `aguardando_revisao` → `aprovada` → `catalogada_localmente`.

Falhas usam `falhou` e não avançam automaticamente.

## Piloto atual

O piloto automático contém uma base técnica privada e três identidades públicas planejadas:

- `data/image-automation/phase-bases/002-pig-bebe-base.png`

- `assets/characters/002-pig-bebe-azul.png`
- `assets/characters/002-pig-bebe-rosa.png`
- `assets/characters/002-pig-bebe-arco-iris.png`

Ele usa `gpt-image-2-2026-04-21`, qualidade média, formato PNG e fundo técnico uniforme para remoção local posterior. O primeiro passo é gerar a base do Pig Bebê com o Pig Principal enviado como arquivo binário. Após aprovação humana da base, as três identidades são derivadas exclusivamente dela.

Não existe dependência de referência manual da fase bebê. A execução paga continua bloqueada por configuração, autorização e orçamento.

Consulte `BOOTSTRAP_AUTOMATICO_FASES.md`, `IMPLEMENTACAO_ADAPTADOR_OPENAI_IMAGENS.md`, `PILOTO_TRES_IDENTIDADES_BEBE.md` e `CONFIGURACAO_SEGURA_API_IMAGENS.md`.
