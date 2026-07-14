# Cofrinho Real

Protótipo visual estático do universo Pig, com personagens, histórias, jogos e PigCoins fictícios para educação financeira, educação digital, segurança e escolhas responsáveis.

## Posicionamento

**Aprender, brincar e crescer com o Pig.**

PigCoin é uma linguagem educativa interna. Não é dinheiro, criptoativo, investimento, prêmio conversível nem promessa de ganho. O projeto não possui backend funcional, banco real, login real, PIX, aplicativo real ou movimentação financeira.

## Estado visual vigente

- Somente `001 — Pig Principal` permanece com imagem oficial criada após o reset.
- O Pig Principal é a referência visual obrigatória da nova produção.
- Os avatares `002` a `011` usam exatamente três identidades ativas: `azul`, `rosa` e `arco_iris`.
- A variação `padrao` foi descontinuada e preservada apenas no arquivo histórico.
- As imagens anteriores foram arquivadas em `assets/characters/_drafts/reset-visual-tres-identidades-2026-07/`.

O sistema de quatro variações foi substituído por três identidades visuais: Azul/Masculino, Rosa/Feminino e Arco-íris/Neutro.

## Páginas e dados

- `index.html`: apresentação pública.
- `personagens.html`: Coleção Pig orientada por dados.
- `personagens.js`: carregamento e filtros da coleção.
- `data/vila-pig-personagens.json`: catálogo compilado.
- `data/fila-imagens-personagens.json`: fila determinística de imagens.
- `data/image-automation/`: estado local e relatórios da automação segura.
- `scripts/images/`: planejamento, validação e execução controlada.

## Validação

```powershell
node scripts/build-personagens-catalog.mjs
node scripts/validate-personagens-catalog.mjs
node scripts/validate-universo-pig.mjs
node scripts/audit-pt-br.mjs
node scripts/next-image-prompt.mjs --dry-run
node scripts/images/status.mjs
node scripts/images/runner.mjs --pilot --limit 12 --dry-run --no-publish --no-push
node --check script.js
node --check personagens.js
git diff --check
```

## Segurança operacional

A automação não poderá iniciar geração paga sem autorização explícita de Alamo. Provedor e armazenamento remoto permanecem desabilitados por padrão; segredos nunca entram no repositório.

No fluxo manual, o próximo prompt deve ser enviado antes da publicação da imagem atual.

## Documentação

Consulte [docs/README.md](docs/README.md), [docs/RESET_VISUAL_TRES_IDENTIDADES.md](docs/RESET_VISUAL_TRES_IDENTIDADES.md) e [docs/AUTOMACAO_IMAGENS_PERSONAGENS.md](docs/AUTOMACAO_IMAGENS_PERSONAGENS.md).

<!-- CATALOGO_BRASILEIRO_INICIO -->
## Catálogo brasileiro de personagens

O repositório compila 3.251 registros fixos a partir de lotes segmentados em `data/personagens/`. A Coleção Pig publica somente perfis liberados. Consulte `docs/CATALOGO_BRASILEIRO_PERSONAGENS.md` e `data/relatorio-validacao-catalogo.json`.
<!-- CATALOGO_BRASILEIRO_FIM -->
