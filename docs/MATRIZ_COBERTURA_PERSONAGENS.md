# Matriz de Cobertura de Personagens

## Objetivo

`data/matriz-cobertura-brasil.csv` registra o que ja foi pesquisado, representado e ilustrado. A matriz serve para descobrir lacunas reais, não para atingir um número arbitrario.

Campos principais:

- região, UF, território e bioma;
- família, origem cultural e comunidade;
- profissão;
- geração e fase da vida;
- folclore;
- UID do personagem;
- status de pesquisa, personagem e imagem;
- fontes.

## Fluxo

1. inserir uma necessidade de cobertura;
2. pesquisar fontes oficiais e regionais;
3. consultar comunidades quando aplicável;
4. aprovar conceito e cuidados de representação;
5. criar personagem e UID;
6. criar imagem;
7. atualizar matriz e Coleção Pig.

`data/backlog-personagens.csv` guarda temas ainda sem personagem. Uma linha pendente não deve aparecer como fato confirmado no site.

<!-- CATALOGO_BRASILEIRO_INICIO -->
## Catálogo brasileiro compilado

Em 2026-07-12, o catálogo passou a ter 3251 registros fixos, 1430 famílias e cobertura das 27 UFs. As fontes ficam em `data/personagens/`; os arquivos monolíticos são gerados. Perfis culturais sensíveis permanecem não publicáveis até pesquisa e revisão.

Referências: `docs/CATALOGO_BRASILEIRO_PERSONAGENS.md`, `docs/REVISAO_CULTURAL_PERSONAGENS.md` e `data/relatorio-validacao-catalogo.json`.
<!-- CATALOGO_BRASILEIRO_FIM -->
