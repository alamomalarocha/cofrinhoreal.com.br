# Piloto de três identidades do Pig Bebê

Atualizado em 2026-07-16.

## Escopo do piloto

O piloto contém exatamente uma base técnica privada e três identidades derivadas:

1. `data/image-automation/phase-bases/002-pig-bebe-base.png`
2. `assets/characters/002-pig-bebe-azul.png`
3. `assets/characters/002-pig-bebe-rosa.png`
4. `assets/characters/002-pig-bebe-arco-iris.png`

Não inclui `padrao`, outros personagens ou publicação automática.

## Referência inicial

O Pig Principal em `assets/characters/001-pig-principal.png` é a única referência visual inicial fornecida manualmente. O adaptador envia seus bytes na requisição.

Não existe referência manual da fase bebê. O pipeline gera a base técnica, remove o fundo, valida e aguarda aprovação humana.

## Prompts

Os prompts são construídos de forma determinística a partir de `data/image-automation/phase-bootstrap.json`, `data/image-automation/style-system.json` e `data/image-automation/pilot-002-three-identities.json`. Cada registro planejado possui hash SHA-256.

Base:

- bebê de 0 a 2 anos;
- sentado de frente, corpo inteiro e pernas visíveis;
- mãos sobre as pernas e orelhas levemente baixas;
- roupa técnica neutra;
- sem miniatura da referência, painel, comparação, texto, logo, moeda ou cenário.

Identidades derivadas da base aprovada:

- Azul: camisa azul, short azul-claro e tênis branco.
- Rosa: camisa rosa, short rosa-claro e tênis branco.
- Arco-íris: seis faixas horizontais fortes, short off-white e tênis branco.

Todos usam fundo técnico uniforme `#777777`, sem cenário nem sombra externa, para remoção local.

## Processo previsto

1. Validar o Pig Principal binário.
2. Estimar custo máximo e verificar todas as travas.
3. Gerar a base na área privada temporária.
4. Remover o fundo e validar tecnicamente.
5. Aguardar aprovação humana da base.
6. Derivar Azul, Rosa e Arco-íris da mesma base.
7. Validar e revisar o conjunto.
8. Atualizar catálogo local somente após aprovação.
9. Publicar remotamente apenas em fase futura e autorizada.

## Estado atual

- chamadas pagas: 0;
- custo real: US$ 0,00;
- revisão automática: não permitida;
- atualização automática do catálogo: desabilitada;
- publicação remota: indisponível;
- base real gerada: não;
- execução paga: bloqueada pela configuração, autorização e orçamento.

## Primeira execução isolada

A ativação inicial não abrange as três identidades. Ela seleciona somente a base privada `002-pig-bebe-base.png` por meio de `--only-phase-base 002`. Qualquer seleção vazia, múltipla ou diferente deve abortar antes da API.

O primeiro piloto permite exatamente uma tentativa dessa base. A estimativa registrada atualmente para essa chamada é de aproximadamente US$ 0,06143 e pode variar conforme a tabela de preços configurada. O teto rígido e exclusivo de US$ 0,19 é somente um limite financeiro e não autoriza retry. Se a chamada falhar, o processo para sem fallback e aguarda nova decisão humana. Depois de uma geração futura, o fluxo permitido é: arquivo bruto privado, remoção local do fundo, validação RGBA e fila de revisão humana. Nenhum status público, identidade derivada, publicação ou push automático pode avançar.
