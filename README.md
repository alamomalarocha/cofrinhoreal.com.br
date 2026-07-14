# Cofrinho Real

Protótipo visual estático do universo Pig: personagens, histórias, jogos e PigCoins fictícios para educação financeira, educação digital, energia, segurança e escolhas responsáveis.

## Posicionamento público atual

**Aprender, brincar e crescer com o Pig.**

PigCoin e uma linguagem educativa interna. Não e dinheiro, criptoativo, investimento, prêmio conversivel ou promessa de ganho. O projeto não possui backend funcional, banco real, login real, PIX, compra, saque ou movimentação real.

## Páginas

- `index.html`: apresentacao pública.
- `pig-coins.html`: PigCoin fictício e narrativa educativa.
- `educacao.html`: trilhas por idade e temas.
- `jogos.html`: jogos educativos conceituais.
- `personagens.html`: Coleção Pig orientada por dados.
- `familias.html`: famílias e supervisão responsável.
- `seguranca.html`: segurança digital em linguagem educativa.
- `faq.html`: dúvidas e limites do protótipo.

## Dados e arquitetura

- `data/vila-pig-personagens.json`: catálogo de personagens e variações.
- `data/content/`: níveis e descritores editoriais internos.
- `data/compliance/jurisdictions/`: pesquisa por jurisdição, com contas reais desabilitadas.
- `schemas/`: contratos JSON.
- `locales/`: esqueletos de localização.
- `legal/`: estruturas de pesquisa, não textos aprovados.

## Validação

```powershell
node scripts/validate-universo-pig.mjs
node scripts/audit-pt-br.mjs
node scripts/next-image-prompt.mjs --exclude "assets/characters/ITEM-ATUAL.png"
node --check script.js
node --check personagens.js
git diff --check
```

## Avisos

- Repositório e site de protótipo em validação, mantidos com `noindex`.
- Pesquisa técnica não equivale a parecer jurídico.
- Nenhum pais esta habilitado para conta real.
- A Coleção Pig não envolve compra de cards, raridade paga, aposta ou loot box.

Consulte [docs/README.md](docs/README.md) para o indice técnico.

O fluxo de imagens envia o prompt visual puro do próximo item antes de publicar a imagem atual. Consulte `docs/PROTOCOLO_IMAGENS_PERSONAGENS.md` e `docs/GUIA_PORTUGUES_E_TERMINOLOGIA.md`.

<!-- CATALOGO_BRASILEIRO_INICIO -->
## Catálogo brasileiro de personagens

O repositório compila 3251 registros fixos a partir de lotes segmentados em `data/personagens/`. A Coleção Pig pública apenas perfis liberados. Consulte `docs/CATALOGO_BRASILEIRO_PERSONAGENS.md` e `data/relatorio-validacao-catalogo.json`. O projeto continua um protótipo visual estático.
<!-- CATALOGO_BRASILEIRO_FIM -->
