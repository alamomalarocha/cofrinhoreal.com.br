# Armazenamento de imagens em escala

Atualizado em 2026-07-16.

## Estado atual

Assets aprovados continuam locais no repositório. Cloudflare R2 está apenas planejado: `enabled=false` e `upload_implemented=false`.

Nenhum bucket, credencial, upload ou URL pública foi criado.

## Caminhos

- Assets oficiais: `assets/characters/NUMERO-SLUG-IDENTIDADE.png`.
- Pig Principal: `assets/characters/001-pig-principal.png`.
- Referências curadas: `assets/references/`.
- Área temporária do piloto: `data/image-automation/tmp/image-pilot-review/`.
- Histórico do reset: `assets/characters/_drafts/reset-visual-tres-identidades-2026-07/`.
- Logos: `assets/brand/`.

Arquivos `raw`, recortados, relatórios e rejeitados permanecem na área temporária ignorada pelo Git. Somente arquivos aprovados podem avançar ao caminho canônico.

## Publicação disponível

O publicador atual aceita apenas os modos locais `local-review` e `catalog-local`. Publicação remota retorna bloqueio explícito.

## Estratégia futura possível

Uma migração futura para armazenamento de objetos deverá preservar nome canônico, SHA-256, MIME type, dimensões, aprovação humana e vínculo com o catálogo. O site estático poderá consumir URLs versionadas com fallback local.

## Condições para habilitar armazenamento remoto

- autorização explícita de Alamo;
- orçamento e limites definidos;
- credenciais fora do repositório;
- ambiente de teste separado;
- plano de rollback;
- validação de CORS, cache e integridade;
- aprovação humana antes de publicar;
- implementação e testes próprios do uploader.
