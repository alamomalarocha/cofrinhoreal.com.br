# Implementação do adaptador OpenAI Images

Atualizado em 2026-07-16.

## Objetivo

O projeto possui um adaptador real, testável e desabilitado por padrão para futura geração controlada de imagens. A implementação não executou nenhuma chamada externa paga.

## Arquivos principais

- `scripts/images/providers/openai-image-provider.mjs`
- `scripts/images/generate.mjs`
- `scripts/images/cost-estimator.mjs`
- `scripts/images/reference-resolver.mjs`
- `data/image-automation/config.json`
- `data/image-automation/pilot-002-three-identities.json`

## SDK e operação

O adaptador usa o SDK oficial `openai`, declarado na versão `6.39.0`. A operação é `images.edit`, pois o processo exige referências binárias do Pig Principal e da fase da vida.

Modelo principal:

`gpt-image-2-2026-04-21`

Fallback:

`gpt-image-2`

O fallback é bloqueado por padrão. Ele só pode ser considerado quando o modelo fixado estiver indisponível **e** o operador informar `--allow-model-fallback`. Falhas de autenticação, orçamento ou validação nunca acionam fallback.

## Entradas

- prompt determinístico do manifesto;
- PNG do Pig Principal;
- PNG aprovado da fase da vida;
- qualidade `medium`;
- tamanho `1024x1536`;
- saída PNG;
- fundo técnico uniforme `#777777`.

Os arquivos de referência são enviados como dados binários. Caminhos escritos no prompt não são tratados como anexos.

## Retentativas

O adaptador limita tentativas e aceita pausa configurável. Apenas erros transitórios de limite ou servidor podem ser repetidos. Cada tentativa entra no cálculo preventivo de custo.

## Segurança

Antes de criar o cliente da OpenAI, o código valida:

- configuração habilitada;
- modo de execução real;
- autorização por variável de ambiente;
- provedor selecionado;
- flag explícita;
- orçamento positivo;
- chave presente;
- referências obrigatórias;
- arquivo de parada ausente.
- seleção exata de uma única base com `--only-phase-base 002`;
- `--no-publish`, `--no-push` e `--review-policy human-mandatory`;
- Git limpo e pré-voo aprovado;
- orçamento exclusivo suficiente antes de cada tentativa.

Qualquer falha encerra o fluxo antes da chamada.

## Fontes oficiais

- `https://developers.openai.com/api/docs/models/gpt-image-2`
- `https://developers.openai.com/api/docs/guides/image-generation`
- `https://developers.openai.com/api/docs/pricing`

## Estado

Implementado e coberto por testes locais sem rede. Não ativado. Não executado contra a API.

O estimador reconhece tanto o snapshot `gpt-image-2-2026-04-21` quanto o alias de preço `gpt-image-2`, usando a fonte oficial consultada em 2026-07-16. O snapshot continua sendo o modelo de execução; o alias não substitui o snapshot sem autorização explícita.
