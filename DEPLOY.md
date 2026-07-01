# Deploy estatico do Cofrinho Real

Este projeto esta preparado para publicacao estatica inicial em GitHub e Cloudflare Pages.

Importante: esta versao ainda e apenas um prototipo visual em validacao.

Nao existe:

- backend
- banco de dados
- login funcional
- integracao PIX
- movimentacao real de dinheiro
- conta real de usuario ou comerciante

## Arquivos principais

- `index.html`
- `styles.css`
- `script.js`
- `assets/`
- `assets/favicon.svg`
- `site.webmanifest`
- `robots.txt`
- `_headers`

## Antes de publicar

1. Abra o prototipo localmente.
2. Revise os textos.
3. Confirme que o aviso de prototipo visual aparece no hero.
4. Confirme que `robots.txt`, `_headers` e a meta tag `robots` devem continuar com `noindex`.

Enquanto o site estiver em teste, manter `noindex`.

Quando decidir tornar o site publico para buscas, remover ou alterar:

- `<meta name="robots" content="noindex, nofollow, noarchive" />` em `index.html`
- o bloqueio em `robots.txt`
- o cabeçalho `X-Robots-Tag` em `_headers`

## Publicar no GitHub

1. Crie um repositorio no GitHub, por exemplo:

```text
cofrinhoreal.com.br
```

2. No PowerShell, entre na pasta do projeto:

```powershell
cd "C:\Users\alamo\OneDrive\Documents\cofrinhoreal.com.br 2"
```

3. Verifique o status:

```powershell
git status
```

4. Adicione os arquivos:

```powershell
git add .
```

5. Crie o commit inicial:

```powershell
git commit -m "Preparar prototipo visual estatico"
```

6. Conecte o repositorio remoto do GitHub:

```powershell
git remote add origin https://github.com/SEU_USUARIO/cofrinhoreal.com.br.git
```

7. Envie para o GitHub:

```powershell
git branch -M main
git push -u origin main
```

Alternativa: o GitHub tambem permite adicionar um projeto local usando GitHub CLI ou upload pela interface web.

## Publicar no Cloudflare Pages

1. Acesse o painel da Cloudflare.
2. Va em `Workers & Pages`.
3. Crie um novo projeto do Pages.
4. Conecte a conta do GitHub.
5. Selecione o repositorio do Cofrinho Real.
6. Configure como site estatico simples:

```text
Framework preset: None
Build command: deixar em branco
Build output directory: /
```

Se a interface pedir outro formato para a pasta de saida, use a raiz do repositorio.

7. Clique para fazer o primeiro deploy.
8. A Cloudflare criara uma URL temporaria parecida com:

```text
https://nome-do-projeto.pages.dev
```

Use essa URL para testar antes de ligar o dominio principal.

## Conectar o dominio cofrinhoreal.com.br

1. No projeto do Cloudflare Pages, abra `Custom domains`.
2. Clique em `Set up a domain`.
3. Informe:

```text
cofrinhoreal.com.br
```

4. Siga as instrucoes da Cloudflare para DNS.
5. Se o dominio estiver em outro registrador, como GoDaddy, pode ser necessario apontar os nameservers para a Cloudflare.
6. Aguarde a propagacao de DNS e emissao do certificado SSL.

Opcionalmente, tambem configure:

```text
www.cofrinhoreal.com.br
```

E redirecione uma versao para a outra quando o site estiver pronto.

## Configuracao atual de indexacao

Esta publicacao inicial esta preparada para evitar indexacao por buscadores:

- `robots.txt` bloqueia todos os crawlers.
- `index.html` possui meta robots `noindex`.
- `_headers` envia `X-Robots-Tag: noindex`.

Isso e intencional enquanto o site for apenas um prototipo visual.

## Referencias oficiais

- Cloudflare Pages Git integration: https://developers.cloudflare.com/pages/configuration/git-integration/
- Cloudflare Pages custom domains: https://developers.cloudflare.com/pages/configuration/custom-domains/
- GitHub: adicionar codigo local ao GitHub: https://docs.github.com/en/migrations/importing-source-code/using-the-command-line-to-import-source-code/adding-locally-hosted-code-to-github
