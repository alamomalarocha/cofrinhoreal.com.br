# Checkpoint Refinamento Geral 001

## Data

2026-07-02

## Objetivo

Registrar a rodada de refinamento geral do protótipo visual publicado para analise do Cofrinho Real.

O objetivo foi deixar a apresentacao mais completa, clara e coerente com a identidade do projeto, sem transformar o protótipo em sistema real.

## Estado do produto

Continua sendo protótipo visual estático.

Não existe:

- backend;
- banco de dados;
- login real;
- autenticação real;
- PIX real;
- app real publicado;
- checkout;
- sistema financeiro real;
- coleta de dados reais;
- movimentação real de dinheiro.

## O que foi refinado

- Header com menu mais completo.
- Busca visual sem backend.
- Botao visual "Entrar".
- Botao "Criar conta" apontando para a entrada PF/PJ.
- Modal visual de login sem envio de dados.
- Hero mantendo Pessoa Fisica e Pessoa Jurídica como prioridade.
- Mockup do app com Conta PIG e aviso de protótipo.
- Secao de Educação Financeira.
- Secao de Jogos Educativos.
- FAQ ampliado.
- Rodape com links legais.
- Aviso simples de privacidade/cookies.
- Cache busting atualizado para `v=20`.

## Páginas criadas

- `privacidade.html`
- `termos.html`
- `cookies.html`
- `direitos.html`

## Documentação criada

- `docs/PESQUISA_REFERENCIAS_001.md`
- `docs/COOKIES_PRIVACIDADE_TERMOS.md`
- `docs/JOGOS_EDUCATIVOS.md`
- `docs/CHECKPOINT_REFINAMENTO_GERAL_001.md`

## Decisões importantes

- A logo/arte principal atual continua sendo `assets/brand/cofrinho-real-pig-logo-principal.png`.
- Os botoes de App Store e Google Play continuam provisórios, sem links reais.
- `robots.txt`, `meta robots` e `_headers` devem continuar com `noindex`.
- O aviso de privacidade usa somente `localStorage` para ocultar o banner.
- "Conta PIG" permanece como nomenclatura visual do mockup.
- Pig Coins continuam sendo recompensa interna sem valor financeiro.

## Proximos passos sugeridos

1. Validar visualmente o topo no dominio apos deploy.
2. Revisar textos com comerciantes reais.
3. Revisar textos com famílias reais.
4. Evoluir materiais A4 em arquivos de impressao quando a identidade estiver aprovada.
5. Somente depois criar novas telas simuladas do app.
6. Antes de qualquer operação real, revisar jurídico, segurança, dados de crianças e fluxos financeiros.
