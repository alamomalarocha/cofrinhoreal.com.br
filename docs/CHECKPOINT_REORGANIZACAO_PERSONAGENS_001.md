# Checkpoint da Reorganizacao de Personagens 001

## Ponto seguro anterior

- projeto: Cofrinho Real / cofrinhoreal.com.br;
- pasta: `C:\Users\alamo\OneDrive\Documents\cofrinhoreal.com.br 2`;
- branch: `main`;
- remote: `https://github.com/alamomalarocha/cofrinhoreal.com.br.git`;
- commit base: `85c62b69d3f584dd632e32f11269621d180ca8d4`;
- mensagem: `Add avatar 011 Pig Senior rosa image`;
- tag: `checkpoint-personagens-pre-reorganizacao-2026-07`;
- sincronizacao inicial: `main` igual a `origin/main`;
- estado inicial: Git limpo.

## Inventario preservado

- 201 personagens;
- 39 variacoes de avatar criadas;
- nenhum arquivo marcado como criado estava ausente;
- 001 Pig Principal preservado;
- 201 Vantajinho preservado;
- logos oficiais preservadas;
- proximo item de imagem preservado: `011 - Pig Senior - arco_iris`.

## Estrategia

A migracao adiciona campos e catalogos sem apagar campos legados. O script `scripts/migrate-universo-pig.mjs` e idempotente, e `scripts/validate-universo-pig.mjs` verifica os contratos.

Nenhuma imagem e criada nesta reorganizacao.
