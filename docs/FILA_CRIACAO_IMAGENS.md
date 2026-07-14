# Fila de Criação de Imagens

A fila e gerada por `scripts/build-fila-imagens-personagens.mjs`.

- Total: 3239.
- Prontas para criação: 2640.
- Bloqueadas para revisão: 599.
- Primeiro item: 202 - Mestre Satochi - principal.
- Arquivo: `assets/characters/202-mestre-satochi.png`.

Fluxo: Codex informa o prompt visual; ChatGPT cria uma imagem; Alamo envia a imagem; Codex valida e anuncia antecipadamente o prompt do próximo item; depois salva, registra, valida o catálogo, commita e pública a imagem atual. O processo continua uma imagem por vez, com criação e publicação em paralelo.

O prompt visual deve ser curto e não pode conter instruções de JSON, CSV, documentação, commit ou push. O próximo item pode ser consultado, sem alterações, com `node scripts/next-image-prompt.mjs --exclude "CAMINHO-DO-ITEM-ATUAL"`.
