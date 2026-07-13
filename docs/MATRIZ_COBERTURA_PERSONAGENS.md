# Matriz de Cobertura de Personagens

## Objetivo

`data/matriz-cobertura-brasil.csv` registra o que ja foi pesquisado, representado e ilustrado. A matriz serve para descobrir lacunas reais, nao para atingir um numero arbitrario.

Campos principais:

- regiao, UF, territorio e bioma;
- familia, origem cultural e comunidade;
- profissao;
- geracao e fase da vida;
- folclore;
- UID do personagem;
- status de pesquisa, personagem e imagem;
- fontes.

## Fluxo

1. inserir uma necessidade de cobertura;
2. pesquisar fontes oficiais e regionais;
3. consultar comunidades quando aplicavel;
4. aprovar conceito e cuidados de representacao;
5. criar personagem e UID;
6. criar imagem;
7. atualizar matriz e Colecao Pig.

`data/backlog-personagens.csv` guarda temas ainda sem personagem. Uma linha pendente nao deve aparecer como fato confirmado no site.

<!-- CATALOGO_BRASILEIRO_INICIO -->
## Catalogo brasileiro compilado

Em 2026-07-12, o catalogo passou a ter 3251 registros fixos, 1430 familias e cobertura das 27 UFs. As fontes ficam em `data/personagens/`; os arquivos monoliticos sao gerados. Perfis culturais sensiveis permanecem nao publicaveis ate pesquisa e revisao.

Referencias: `docs/CATALOGO_BRASILEIRO_PERSONAGENS.md`, `docs/REVISAO_CULTURAL_PERSONAGENS.md` e `data/relatorio-validacao-catalogo.json`.
<!-- CATALOGO_BRASILEIRO_FIM -->
