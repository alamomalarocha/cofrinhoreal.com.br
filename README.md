# Cofrinho Real

Prototipo visual estatico do universo Pig: personagens, historias, jogos e PigCoins ficticios para educacao financeira, educacao digital, energia, seguranca e escolhas responsaveis.

## Posicionamento publico atual

**Aprender, brincar e crescer com o Pig.**

PigCoin e uma linguagem educativa interna. Nao e dinheiro, criptoativo, investimento, premio conversivel ou promessa de ganho. O projeto nao possui backend funcional, banco real, login real, PIX, compra, saque ou movimentacao real.

## Paginas

- `index.html`: apresentacao publica.
- `pig-coins.html`: PigCoin ficticio e narrativa educativa.
- `educacao.html`: trilhas por idade e temas.
- `jogos.html`: jogos educativos conceituais.
- `personagens.html`: Colecao Pig orientada por dados.
- `familias.html`: familias e supervisao responsavel.
- `seguranca.html`: seguranca digital em linguagem educativa.
- `faq.html`: duvidas e limites do prototipo.

## Dados e arquitetura

- `data/vila-pig-personagens.json`: catalogo de personagens e variacoes.
- `data/content/`: niveis e descritores editoriais internos.
- `data/compliance/jurisdictions/`: pesquisa por jurisdicao, com contas reais desabilitadas.
- `schemas/`: contratos JSON.
- `locales/`: esqueletos de localizacao.
- `legal/`: estruturas de pesquisa, nao textos aprovados.

## Validacao

```powershell
node scripts/validate-universo-pig.mjs
node --check script.js
node --check personagens.js
git diff --check
```

## Avisos

- Repositorio e site de prototipo em validacao, mantidos com `noindex`.
- Pesquisa tecnica nao equivale a parecer juridico.
- Nenhum pais esta habilitado para conta real.
- A Colecao Pig nao envolve compra de cards, raridade paga, aposta ou loot box.

Consulte [docs/README.md](docs/README.md) para o indice tecnico.

<!-- CATALOGO_BRASILEIRO_INICIO -->
## Catalogo brasileiro de personagens

O repositorio compila 3251 registros fixos a partir de lotes segmentados em `data/personagens/`. A Colecao Pig publica apenas perfis liberados. Consulte `docs/CATALOGO_BRASILEIRO_PERSONAGENS.md` e `data/relatorio-validacao-catalogo.json`. O projeto continua um prototipo visual estatico.
<!-- CATALOGO_BRASILEIRO_FIM -->
