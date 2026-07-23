# Operational path guard

Worker defensivo temporário do chamado Cloudflare `#02245419`.

Ele bloqueia somente caminhos operacionais específicos no domínio raiz. O
Worker responde diretamente com `404`, não consulta o Pages e não usa
bindings, secrets, Cache API, KV, D1, R2, Durable Objects ou logs.

O prefixo de dados é limitado a `data/image-automation/*`. O catálogo público
em `data/personagens/avatares/avatares-aprovados.json` precisa continuar
acessível para renderizar a coleção de avatares.

Os padrões de arquivo terminam em `*` porque o mecanismo de Workers Routes
considera a query string ao escolher uma rota. Assim, a mesma proteção cobre
a URL sem query e com cache-bust.

## Limites obrigatórios

- Não adicionar `cofrinhoreal.com.br/*`.
- Não adicionar `www.cofrinhoreal.com.br/*`.
- Não criar Custom Domain.
- Não alterar `cofrinhoreal-www-redirect`.
- Não alterar o projeto Pages nem seu output `dist`.

## Implantação

Executar somente após revisão e merge:

```powershell
npx.cmd wrangler deploy --config cloudflare/operational-path-guard/wrangler.jsonc
```

Esse comando publica o Worker e aplica exclusivamente as rotas declaradas no
arquivo versionado.

## Rollback

1. Registrar a lista e os IDs das rotas ligadas a
   `cofrinhoreal-operational-path-guard`.
2. Remover somente essas rotas específicas pela API Workers Routes.
3. Confirmar que as 15 rotas públicas, os assets e o redirecionamento `www`
   continuam íntegros e que os caminhos operacionais voltaram a ir diretamente
   ao Pages.
4. Excluir o Worker somente depois dessa confirmação.

O rollback não altera DNS, Pages, domínio personalizado, `dist` ou o Worker
`cofrinhoreal-www-redirect`. Remover o guard não elimina o cache interno do
Pages; apenas retira a mitigação da exposição.
