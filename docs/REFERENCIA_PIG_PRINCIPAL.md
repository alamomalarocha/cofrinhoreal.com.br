# Referência obrigatória: Pig Principal

Atualizado em 2026-07-16.

## Asset canônico

`assets/characters/001-pig-principal.png`

O Pig Principal é a referência visual obrigatória de toda a nova produção.

## O que deve ser preservado

- Linguagem 3D/cartoon premium.
- Anatomia de porquinho amigável e expressiva.
- Acabamento limpo, iluminação suave e boa leitura em tamanhos reduzidos.
- Personalidade acolhedora, segura e educativa.
- Coerência geral de proporção, olhos, focinho, pele e acabamento.

## O que não deve ser copiado literalmente

Os novos personagens não são duplicatas do 001. Fase da vida, corpo, cabelo, expressão, roupa e papel narrativo devem diferenciá-los. A referência define a família visual, não uma clonagem.

## Separação de marca

O personagem individual permanece em `assets/characters/`. Logos completas permanecem em `assets/brand/`. Um tipo de asset não substitui o outro.

O 001 e as logos não podem ser sobrescritos por rotinas de lote, migração ou publicação automática.

## Uso pelo adaptador

O adaptador da OpenAI envia o PNG do Pig Principal como referência binária na operação de edição de imagem. Apenas mencionar o caminho do arquivo no texto não constitui referência visual.

SHA-256 registrado:

`56fef39d6300dd6836ca384e7845ca3e3dca15d2fec56cd23f0e10c5d017b3c8`

## Referências por fase

Além do Pig Principal, o piloto exige uma referência aprovada da fase da vida. Para o personagem 002, o diretório esperado é:

`assets/references/fases-vida/bebe/`

Enquanto o manifesto indicar `missing-required-png`, a execução paga deve ser bloqueada antes da chamada externa.
