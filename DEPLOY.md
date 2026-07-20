# Deploy seguro do Cofrinho Real

> **AVISO DE SEGURANÇA:** nunca publique a raiz deste repositório. Ela contém código, testes, documentação e dados operacionais que não pertencem ao site público. O Cloudflare Pages deve publicar exclusivamente `dist/`.

O Cofrinho Real é um site estático em validação, mantido com `noindex`. O deploy oficial usa uma allowlist determinística: somente as páginas e os assets enumerados em `scripts/build-public.mjs` entram no output.

## Configuração persistente do Cloudflare Pages

```text
Production branch: main
Build command: npm run build
Build output directory: dist
```

O diretório de saída jamais deve ser `/`, `.` ou a raiz do repositório. Não use upload direto da árvore de trabalho.

## Preparação e validação

```powershell
npm ci
npm run build
npm test
npm run test:public-output
npm run test:responsive
git diff --check
```

Confirme no relatório do build que o output é `dist`, que a quantidade de arquivos é a esperada e que a denylist está vazia. Revise o conteúdo com `git status --short` e `git diff`. No Git, faça staging explícito por arquivo, por exemplo:

```powershell
git add DEPLOY.md scripts/build-public.mjs tests/public-output.test.mjs
```

Nunca use staging indiscriminado neste projeto. `dist/` é gerado e não deve ser versionado.

## Fronteira pública

O build inclui somente a allowlist pública. Estes itens nunca pertencem ao deploy:

- `package.json`, lockfiles e README;
- `docs/`, `scripts/`, `tests/` e fonte/configuração do Worker;
- `data/image-automation/`, runtime, tmp e checkpoints;
- `.env`, credenciais, tokens ou caminhos internos;
- qualquer arquivo não enumerado pelo build.

O Worker `cofrinhoreal-www-redirect` é mantido em `cloudflare/www-redirect/` para auditoria e reprodução, mas essa pasta não faz parte de `dist/`.

## Verificação após o deploy

1. Confirme que o deployment foi criado da branch `main` e do merge commit esperado.
2. Confirme novamente `npm run build` e `dist` na configuração persistente do Pages.
3. Teste as rotas reais e uma rota inexistente; a inexistente deve retornar HTTP 404, nunca a homepage com 200.
4. Teste sem query e com cache-bust as rotas negativas, incluindo `/package.json`, `/README.md`, `/docs/`, `/scripts/`, `/tests/`, `/.env`, `/.git/`, `/package-lock.json`, `/wrangler.toml`, `/node_modules/`, `/data/`, `/tmp/` e checkpoints.
5. Se um objeto operacional antigo ainda estiver no cache, faça purga direcionada; use purga integral do domínio apenas se a dirigida não for suficiente. Não crie arquivos substitutos nem redirecione vazamentos para a homepage.
6. Valide desktop e mobile, console, rede, imagens, overflow, menu e filtros.

## Prevenção de regressões

- Sempre incremente uma única versão de cache para CSS e JavaScript quando esses assets mudarem.
- Mantenha os testes de fronteira pública e de documentação ativos.
- Preserve o `noindex` até autorização expressa para indexação; não publique sitemap antes disso.
- Não altere DNS, Worker ou configuração do Pages sem registrar e testar a mudança.

Referências: [Cloudflare Pages Git integration](https://developers.cloudflare.com/pages/configuration/git-integration/) e [Custom domains](https://developers.cloudflare.com/pages/configuration/custom-domains/).
