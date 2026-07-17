# Configuração segura da API de imagens

Atualizado em 2026-07-16.

## Princípio

O repositório não contém chave real, crédito, autorização ou configuração pronta para cobrança. `.env.example` contém somente valores seguros.

## Variáveis

```dotenv
OPENAI_API_KEY=
IMAGE_GENERATION_AUTHORIZED=false
IMAGE_PUBLICATION_AUTHORIZED=false
IMAGE_PROVIDER=disabled
IMAGE_MAX_COST_USD=0
IMAGE_STORAGE_MODE=local
```

Nunca commitar `.env`, chaves, tokens, respostas da API ou logs com segredos.

O arquivo externo previsto é `C:\Users\alamo\.config\cofrinho-real\image-api.env`. Ele não é criado pelo projeto. O exemplo versionado seguro fica em `docs/examples/image-api.env.example` e mantém provedor desabilitado, autorizações falsas, orçamento zero e armazenamento local.

## Travas cumulativas

Uma futura chamada paga só pode ocorrer quando todas as condições forem satisfeitas:

1. Alamo autorizar explicitamente a execução e o valor máximo.
2. `provider.enabled` mudar para `true`.
3. O modo mudar de `dry-run` para execução.
4. `IMAGE_GENERATION_AUTHORIZED=true`.
5. `IMAGE_PROVIDER=openai`.
6. O comando incluir `--execute-paid-generation`.
7. `IMAGE_MAX_COST_USD` for positivo e cobrir a estimativa com margem.
8. `OPENAI_API_KEY` existir no ambiente local.
9. O Pig Principal estiver disponível e, para identidades, a base técnica da fase estiver aprovada.
10. O arquivo `data/image-automation/STOP` não existir.
11. `--only-phase-base 002`, `--no-publish`, `--no-push` e `--review-policy human-mandatory` estiverem presentes.
12. O Git estiver limpo e o pré-voo selecionar exatamente uma base privada inexistente.
13. O orçamento for exclusivo, no máximo US$ 0,19, e suficiente para todas as tentativas solicitadas.

Nenhuma condição isolada é suficiente.

## Estimativa antes da autorização

```powershell
npm run images:estimate-cost -- --max-attempts 1
npm run images:estimate-cost -- --max-attempts 3
```

O resultado deve ser apresentado a Alamo antes da execução. O processo para se a estimativa superar o orçamento autorizado.

## Teste seguro

```powershell
npm test
npm run images:preflight -- --only-phase-base 002 --dry-run --max-cost-usd 0.19 --no-publish --no-push --review-policy human-mandatory
npm run images:generate -- --only-phase-base 002 --resume --dry-run --max-cost-usd 0.19 --max-attempts 3 --no-publish --no-push --review-policy human-mandatory
```

Esses comandos não executam chamadas pagas.

## Billing

A API possui faturamento separado do produto ChatGPT. Assinatura ou créditos do ChatGPT não devem ser considerados saldo disponível para a API.

Referência oficial: `https://help.openai.com/en/articles/8156019`.

## Estado atual

Configuração segura, provedor desabilitado e orçamento zero. A base de fase ainda não foi gerada, mas não existe dependência de referência manual. Não há ação pendente de cobrança.

## Checkpoint anterior à ativação

- tag local: `checkpoint-pre-ativacao-base-002-2026-07`;
- commit-base: `ff3394e373a720d597379c538d0c1399ac6d4eea`;
- provedor: OpenAI implementado, `provider.enabled=false` e `IMAGE_PROVIDER=disabled`;
- modelo principal: `gpt-image-2-2026-04-21`;
- alias de fallback: `gpt-image-2`, bloqueado sem `--allow-model-fallback`;
- orçamento versionado: US$ 0;
- fila da primeira execução: somente a base privada 002;
- base privada existente: não;
- chamadas pagas realizadas: 0;
- imagens geradas pela API: 0.

## Ativação futura, não executada

Pré-requisitos manuais: Node.js 20 ou superior, dependências instaladas localmente, arquivo externo preenchido e autorização humana exata. O resolvedor `scripts/resolve-node.ps1` apenas localiza o Node; ele não instala nem modifica o ambiente.

```powershell
$envFile = "$HOME\.config\cofrinho-real\image-api.env"
npm run images:preflight -- --env-file $envFile --only-phase-base 002 --max-cost-usd 0.19 --max-attempts 3 --no-publish --no-push --review-policy human-mandatory
npm run images:generate -- --env-file $envFile --only-phase-base 002 --resume --execute-paid-generation --max-cost-usd 0.19 --max-attempts 3 --no-publish --no-push --review-policy human-mandatory
```

Esse comando está documentado, mas não foi executado. A autorização futura deve usar exatamente esta frase:

> Autorizo gerar somente a base privada 002 — Pig Bebê, com orçamento máximo de US$ 0,19, sem publicação, sem push e sem fallback automático de modelo.
