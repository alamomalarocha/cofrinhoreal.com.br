# Checkpoint antes do reset visual e da automação

## Identificação

- Data do checkpoint: 14 de julho de 2026.
- Branch: `main`.
- Commit-base: `ccd5fcd446f2a5e22194b3a625f4315bd2856a3c`.
- Tag de segurança: `checkpoint-pre-reset-visual-automacao-imagens-2026-07`.
- Remote: `https://github.com/alamomalarocha/cofrinhoreal.com.br.git`.
- Estado inicial: árvore de trabalho limpa e sincronizada com `origin/main`.

## Números antes da migração

- Personagens no catálogo agregado: 3.251.
- Registros públicos no catálogo: 2.652.
- Itens na fila de imagens: 3.239.
- PNGs oficiais diretamente em `assets/characters/`: 42.
- Imagens preservadas como rascunho no reset: 41.
- Imagem mantida como oficial: `assets/characters/001-pig-principal.png`.
- Variações antigas dos avatares 002 a 011: 40, incluindo o estilo descontinuado `padrao`.

## Estado dos personagens-chave

- `001 — Pig Principal`: imagem criada e preservada como referência visual obrigatória.
- `201 — Vantajinho`: imagem criada antes do reset; será preservada como rascunho e voltará para `pendente`.
- `202 — Mestre Satochi`: imagem pendente.
- Primeiro item da fila antiga: `202 — Mestre Satochi`.
- Próximo item após a migração: `002 — Pig Bebê — azul`.

## Assets de marca preservados

Todos os arquivos de `assets/brand/` permanecem intactos, incluindo as variantes oficiais transparentes de header e uso interno. Nenhum asset de marca faz parte do arquivamento de personagens.

## Reversibilidade

As imagens anteriores não serão apagadas. Elas serão movidas para `assets/characters/_drafts/reset-visual-tres-identidades-2026-07/`, com um `manifest.json` contendo caminho original, caminho arquivado, SHA-256, personagem, estilo, status anterior, commit de origem, data e motivo.

Para consultar o estado exato do código anterior à migração, use a tag de segurança. Não reescrever histórico e não executar `push --force` fazem parte desta política.
