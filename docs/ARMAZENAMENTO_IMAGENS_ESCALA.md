# Armazenamento de imagens em escala

Atualizado em 2026-07-14.

## Estado atual

O armazenamento oficial continua local no repositório para assets aprovados. A integração com Cloudflare R2 é apenas uma possibilidade futura e está desativada.

Nenhum bucket, credencial, upload ou URL pública foi criado por esta tarefa.

## Caminhos

- Assets oficiais: `assets/characters/NUMERO-SLUG-IDENTIDADE.png`.
- Pig Principal: `assets/characters/001-pig-principal.png`.
- Histórico do reset: `assets/characters/_drafts/reset-visual-tres-identidades-2026-07/`.
- Logos: `assets/brand/`.

## Estratégia futura possível

Uma migração futura para armazenamento de objetos deverá preservar nomes canônicos, hash, tipo MIME, dimensões, status de aprovação e vínculo com o catálogo. O site estático poderá consumir URLs versionadas, mantendo fallback local durante a transição.

## Condições para habilitar

- autorização explícita de Alamo;
- orçamento e limites definidos;
- credenciais fora do repositório;
- ambiente de teste separado;
- plano de rollback;
- validação de CORS, cache e integridade;
- aprovação humana antes de publicar.
