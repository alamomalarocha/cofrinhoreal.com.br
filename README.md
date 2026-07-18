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

## Validação e piloto seguro

```powershell
npm test
npm run images:preflight -- --only-phase-base 002 --dry-run --max-cost-usd 0.19 --max-attempts 1 --no-publish --no-push --review-policy human-mandatory
npm run images:generate -- --only-phase-base 002 --resume --dry-run --max-cost-usd 0.19 --max-attempts 1 --no-publish --no-push --review-policy human-mandatory
npm run images:status
```

## Segurança operacional

O adaptador real da OpenAI está implementado, mas permanece desabilitado por padrão. Nenhuma chamada paga foi feita. O piloto seleciona exclusivamente a base privada `002`, usa `gpt-image-2-2026-04-21` e bloqueia o alias `gpt-image-2` salvo quando `--allow-model-fallback` for informado de modo explícito.

Uma execução paga exige simultaneamente autorização explícita, provedor habilitado, flag de execução, chave fora do repositório, pré-voo aprovado e orçamento exclusivo suficiente. O teto rígido do primeiro piloto é US$ 0,19, sem publicação, push automático ou avanço de catálogo.

No fluxo manual, o próximo prompt deve ser enviado antes da publicação da imagem atual.

## Documentação

Consulte [docs/README.md](docs/README.md), [docs/AUTOMACAO_IMAGENS_PERSONAGENS.md](docs/AUTOMACAO_IMAGENS_PERSONAGENS.md), [docs/PILOTO_TRES_IDENTIDADES_BEBE.md](docs/PILOTO_TRES_IDENTIDADES_BEBE.md) e [docs/CONFIGURACAO_SEGURA_API_IMAGENS.md](docs/CONFIGURACAO_SEGURA_API_IMAGENS.md).

<!-- CATALOGO_BRASILEIRO_INICIO -->
## Catálogo brasileiro de personagens

O repositório compila 3.251 registros fixos a partir de lotes segmentados em `data/personagens/`. A Coleção Pig publica somente perfis liberados. Consulte `docs/CATALOGO_BRASILEIRO_PERSONAGENS.md` e `data/relatorio-validacao-catalogo.json`.
<!-- CATALOGO_BRASILEIRO_FIM -->
