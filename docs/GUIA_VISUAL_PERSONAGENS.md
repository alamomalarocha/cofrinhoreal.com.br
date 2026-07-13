# Guia Visual de Personagens

## Avatares-base do usuario

Padrao obrigatorio:

- personagem individual;
- corpo inteiro;
- centralizado;
- pose frontal simples;
- estilo 3D/cartoon premium;
- margem segura em cabeca, orelhas e pes;
- PNG com canal alfa real;
- sem cenario, painel ou checkerboard falso.

Roupa-base:

- camisa;
- short ou calca;
- tenis.

Nao usar em avatares-base:

- bone, chapeu, touca, laco, flor ou saia;
- bolsa, brinquedo ou varios objetos;
- moeda, medalha, estrela ou broche;
- letra, numero, logo, patch, etiqueta ou texto;
- outro personagem.

## Estilos

- `padrao`: off-white, bege e neutros.
- `azul`: camisa e parte inferior predominantemente azuis.
- `rosa`: camisa e parte inferior predominantemente rosas.
- `arco_iris`: listras fortes em vermelho, laranja, amarelo, verde, azul e roxo; parte inferior neutra.

Os estilos sao aparencia visual, nao identidade sensivel.

## Personagens fixos

Personagens da Vila podem ter um ou dois elementos identificadores. A historia e o card carregam mais contexto do que a roupa.

Exemplos:

- padeiro: avental e um pao opcional;
- pedreiro: capacete ou uma ferramenta;
- professora: um livro;
- engenheira aeroespacial: tablet sem logo;
- vendedora de comida: uma marmita ou panela, sem caricatura de pobreza.

## Nomenclatura

- principal: `NUMERO-SLUG.png`;
- avatar padrao: `NUMERO-SLUG-padrao.png`;
- avatar azul: `NUMERO-SLUG-azul.png`;
- avatar rosa: `NUMERO-SLUG-rosa.png`;
- avatar arco-iris: `NUMERO-SLUG-arco-iris.png`.

## Checklist de aprovacao

1. O arquivo e PNG RGBA.
2. Os quatro cantos possuem alfa transparente.
3. Nao existe fundo pintado ou xadrez falso.
4. Corpo, cabeca, orelhas e pes estao completos.
5. Nao existe texto, logo ou simbolo indevido.
6. O personagem corresponde a fase e ao estilo solicitados.
7. O arquivo nao e duplicata de outra variacao.
8. O caminho corresponde ao JSON.

<!-- CATALOGO_BRASILEIRO_INICIO -->
## Catalogo brasileiro compilado

Em 2026-07-12, o catalogo passou a ter 3251 registros fixos, 1430 familias e cobertura das 27 UFs. As fontes ficam em `data/personagens/`; os arquivos monoliticos sao gerados. Perfis culturais sensiveis permanecem nao publicaveis ate pesquisa e revisao.

Referencias: `docs/CATALOGO_BRASILEIRO_PERSONAGENS.md`, `docs/REVISAO_CULTURAL_PERSONAGENS.md` e `data/relatorio-validacao-catalogo.json`.
<!-- CATALOGO_BRASILEIRO_FIM -->
