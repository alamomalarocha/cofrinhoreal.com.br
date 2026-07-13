# Catalogo Brasileiro de Personagens

## Resultado atual

- 3251 registros fixos compilados.
- 2652 perfis publicaveis.
- 599 perfis internos aguardando pesquisa ou revisao.
- 1430 nucleos familiares, comunitarios ou editoriais.
- 40 lotes-fonte com no maximo 100 registros.
- 27 lotes para carregamento progressivo.

## Arquitetura

Os arquivos em `data/personagens/` sao fontes fixas. `scripts/build-personagens-catalog.mjs` gera os arquivos monoliticos de compatibilidade e os lotes publicos. `scripts/validate-personagens-catalog.mjs` valida unicidade, cobertura, caminhos, familias e estados de pesquisa.

## Limite editorial

Quantidade nao equivale a pesquisa cultural concluida. Perfis sensiveis permanecem internos ate revisao apropriada.
