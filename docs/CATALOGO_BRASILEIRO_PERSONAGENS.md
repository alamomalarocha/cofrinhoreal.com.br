# Catálogo Brasileiro de Personagens

## Resultado atual

- 3251 registros fixos compilados.
- 2652 perfis publicáveis.
- 599 perfis internos aguardando pesquisa ou revisão.
- 1430 nucleos familiares, comunitarios ou editoriais.
- 40 lotes-fonte com no máximo 100 registros.
- 27 lotes para carregamento progressivo.

## Arquitetura

Os arquivos em `data/personagens/` são fontes fixas. `scripts/build-personagens-catalog.mjs` gera os arquivos monolíticos de compatibilidade e os lotes publicos. `scripts/validate-personagens-catalog.mjs` valida unicidade, cobertura, caminhos, famílias e estados de pesquisa.

## Limite editorial

Quantidade não equivale a pesquisa cultural concluída. Perfis sensíveis permanecem internos até revisão apropriada.
