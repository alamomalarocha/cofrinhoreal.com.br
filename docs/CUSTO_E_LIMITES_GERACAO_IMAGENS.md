# Custos e limites da geração de imagens

Atualizado em 2026-07-14.

## Regra obrigatória

A automação não poderá iniciar geração paga sem autorização explícita de Alamo.

## Estado atual

- Provedor de imagem: desativado.
- Armazenamento remoto: desativado.
- Modo: `dry-run`.
- Custo real do piloto: US$ 0,00.
- Imagens geradas pelo pipeline: 0.

## Limites antes de qualquer piloto pago futuro

Devem ser definidos explicitamente:

- quantidade máxima de imagens;
- custo máximo em dólares;
- custo estimado por imagem;
- número máximo de tentativas;
- intervalo entre requisições;
- política de parada por erro;
- política de revisão humana;
- lote máximo por commit.

## Autorização

Alterar uma variável, arquivo de configuração ou flag não equivale a autorização. A execução paga futura exige pedido claro de Alamo, confirmação do valor máximo e relatório prévio em `dry-run`.

Em caso de divergência entre custo projetado e limite autorizado, o processo deve parar antes da primeira chamada.
