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
npm run images:pilot
```

Esses comandos não executam chamadas pagas.

## Billing

A API possui faturamento separado do produto ChatGPT. Assinatura ou créditos do ChatGPT não devem ser considerados saldo disponível para a API.

Referência oficial: `https://help.openai.com/en/articles/8156019`.

## Estado atual

Configuração segura, provedor desabilitado e orçamento zero. A base de fase ainda não foi gerada, mas não existe dependência de referência manual. Não há ação pendente de cobrança.
