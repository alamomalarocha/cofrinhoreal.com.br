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
