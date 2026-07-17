# Custos e limites da geração de imagens

Atualizado em 2026-07-16.

## Regra obrigatória

A automação não poderá iniciar geração paga sem autorização explícita de Alamo e orçamento positivo.

## Estado atual

- Provedor configurado: OpenAI, desabilitado.
- Modelo fixado: `gpt-image-2-2026-04-21`.
- Fallback: `gpt-image-2`.
- Qualidade: média.
- Tamanho: `1024x1536`.
- Modo: `dry-run`.
- Custo real: US$ 0,00.
- Imagens geradas pelo pipeline: 0.

## Fonte de preço

A configuração usa a página oficial de preços da OpenAI, consultada em 2026-07-16:

- texto de entrada: US$ 5,00 por milhão de tokens;
- imagem de referência: US$ 8,00 por milhão de tokens;
- saída estimada por imagem média: US$ 0,041;
- margem de segurança: 20%.

Referência: `https://developers.openai.com/api/docs/pricing`.

## Estimativa do piloto

Com os valores conservadores atuais:

- três imagens e uma tentativa por item: máximo estimado de aproximadamente US$ 0,1843;
- três imagens e até três tentativas por item: máximo estimado de aproximadamente US$ 0,5529.

O primeiro piloto autorizado tecnicamente é menor: somente a base privada 002. Com até três tentativas, a reserva preventiva atual é US$ 0,18429 e o teto rígido exclusivo é US$ 0,19, deixando US$ 0,00571 de margem. O orçamento não pode ser compartilhado com identidades ou outros itens.

O valor é uma estimativa preventiva, não uma cobrança garantida. Consulte sempre antes de qualquer autorização:

```powershell
npm run images:estimate-cost -- --max-attempts 1
npm run images:estimate-cost -- --max-attempts 3
```

## Cobrança separada

Créditos ou assinatura do ChatGPT não substituem faturamento da API. Uma futura execução pela API exige conta de API configurada e poderá gerar cobrança separada.

## Travas

Alterar uma única variável não autoriza geração. A chamada exige:

1. autorização explícita de Alamo;
2. `provider.enabled=true`;
3. modo de execução real;
4. `IMAGE_GENERATION_AUTHORIZED=true`;
5. `IMAGE_PROVIDER=openai`;
6. flag `--execute-paid-generation`;
7. `IMAGE_MAX_COST_USD` positivo e suficiente;
8. `OPENAI_API_KEY` no ambiente;
9. referências obrigatórias disponíveis;
10. ausência do arquivo de parada.
11. seleção exclusiva da base 002;
12. saldo suficiente antes de cada tentativa;
13. ausência de publicação e push automáticos;
14. revisão humana obrigatória.

Em qualquer divergência, o processo deve parar antes da primeira chamada.

Cada tentativa futura deve registrar, sem segredos: modelo, estimativa reservada, tentativa, resultado e saldo restante. O snapshot oficial é `gpt-image-2-2026-04-21`; o preço é associado ao alias/base `gpt-image-2`, conforme a fonte consultada em 2026-07-16.
