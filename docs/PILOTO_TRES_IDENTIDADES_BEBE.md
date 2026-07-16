# Piloto de três identidades do Pig Bebê

Atualizado em 2026-07-16.

## Escopo imutável do piloto

O piloto contém exatamente:

1. `assets/characters/002-pig-bebe-azul.png`
2. `assets/characters/002-pig-bebe-rosa.png`
3. `assets/characters/002-pig-bebe-arco-iris.png`

Não inclui `padrao`, outros personagens ou expansão automática da fila.

## Referências obrigatórias

- Pig Principal: disponível em `assets/characters/001-pig-principal.png`.
- Fase bebê: esperada em `assets/references/fases-vida/bebe/`.

O manifesto `assets/references/reference-manifest.json` marca a fase bebê como `missing-required-png`. Essa ausência bloqueia uma execução paga.

## Prompts

Os três prompts estão fixados em `data/image-automation/pilot-002-three-identities.json`. Cada item possui hash SHA-256 para detectar alteração acidental.

Identidades:

- Azul: camisa azul, short azul-claro e tênis branco.
- Rosa: camisa rosa, short rosa-claro e tênis branco.
- Arco-íris: seis faixas horizontais fortes, short off-white e tênis branco.

Todos usam fundo técnico uniforme `#777777`, sem cenário nem sombra externa, para remoção local.

## Processo previsto

1. Resolver e validar referências.
2. Estimar custo máximo.
3. Verificar todas as travas.
4. Gerar na área temporária.
5. Remover fundo localmente.
6. Validar PNG e transparência.
7. Aguardar revisão humana.
8. Aprovar ou rejeitar individualmente.
9. Atualizar catálogo local somente após aprovação.
10. Publicar remotamente apenas em uma fase futura e autorizada.

## Estado atual

- chamadas pagas: 0;
- custo real: US$ 0,00;
- revisão automática: não permitida;
- atualização automática do catálogo: desabilitada;
- publicação remota: indisponível;
- execução paga: bloqueada pela configuração e pela referência de fase ausente.
