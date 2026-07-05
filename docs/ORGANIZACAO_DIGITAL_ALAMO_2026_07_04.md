# Organizacao Digital Alamo - 2026-07-04

Este documento registra a nova base de trabalho digital para projetos, codigo, GitHub, Cloudflare, Google Drive, iPhone, notebook e Codex.

Regra central: nao comecar do zero, nao apagar nada sem confirmacao, nao usar caminhos antigos sem confirmar, nao usar a conta GitHub antiga para novos repositorios e nao mexer em Cloudflare/DNS sem plano e backup.

## Contas principais

- Google principal novo: `alamomalarocha@gmail.com`
- iCloud / Apple: `alamoarocha@icloud.com`
- GitHub novo: `alamomalarocha`
- GitHub antigo: `alamoarocha`
- Cloudflare novo: `alamomalarocha@gmail.com`
- Cloudflare antigo: provavelmente ligado a conta/e-mail antigo, sem acesso no momento
- GoDaddy: Alamo tem acesso; dominios comprados no GoDaddy

Daqui para frente:

- Usar `alamomalarocha@gmail.com` como conta Google principal.
- Usar GitHub novo: `alamomalarocha`.
- Usar iCloud apenas para Apple ID, App Store, Buscar iPhone, iCloud necessario e backup do WhatsApp.
- Nao criar nada novo em contas antigas.
- Se recuperar acesso a contas antigas, migrar/salvar tudo antes de remover ou apagar.

## Google Drive e notebook

Drive novo principal no notebook:

```text
alamomalarocha@gmail.com - Google Drive (H:)
```

Pasta principal de projetos:

```text
H:\Meu Drive\01 - Projetos
```

Pasta oficial de entrada:

```text
H:\Meu Drive\99 - Entrada
```

Estrutura principal no Google Drive novo:

- `01 - Projetos`
- `02 - Empresa`
- `03 - Financeiro`
- `04 - Documentos`
- `05 - Imagens`
- `06 - Backup`
- `07 - Pessoal`
- `99 - Entrada`
- `99 - Temporario`

Regras:

- Todo arquivo novo/importante deve ir primeiro para `H:\Meu Drive\99 - Entrada`.
- Todo projeto deve ficar preferencialmente em `H:\Meu Drive\01 - Projetos`.
- Evitar usar `C:\ALAMO-PROJETOS` como local principal.
- Se um projeto ainda estiver em `C:\` ou OneDrive, confirmar antes de mover.
- Antes de mover qualquer projeto, verificar se e repositorio Git e se tem `.git`.

Conta Google Drive antiga/profissional:

```text
contato@cofrinhoreal.com.br
```

Observacao: essa conta ainda pode estar conectada temporariamente no notebook por seguranca. Nao desconectar/remover sem confirmar que tudo importante ja foi copiado para o Drive novo.

## iPhone

Configuracao atual:

- Gmail e o app padrao de e-mail.
- Chrome e o navegador padrao.
- Google Calendar esta instalado e logado em `alamomalarocha@gmail.com`.
- Google Fotos esta logado em `alamomalarocha@gmail.com`.
- Google Drive aparece no app Arquivos.
- Contatos foram migrados do iCloud para o Google novo.
- Contatos do iCloud foram desligados no iPhone.
- Conta padrao dos contatos: Gmail.

Contatos:

- iCloud tinha 306 contatos.
- Google novo ficou com 293 contatos.
- Google Contatos nao encontrou duplicados para mesclar.

Calendario:

- Calendario do iCloud esta desligado.
- Google Calendar usa `alamomalarocha@gmail.com`.

Fotos:

- Google Fotos esta na conta nova.
- Backup do Google Fotos estava concluido.
- iCloud ainda tem fotos antigas, aproximadamente 2.745 itens.
- Transferencia via `privacy.apple.com` foi bloqueada porque a Protecao Avancada de Dados do iCloud esta ativa.
- Nao apagar fotos do iCloud.
- Resolver depois com calma se sera necessario desligar temporariamente Protecao Avancada de Dados ou baixar/subir pelo notebook.

Caminho oficial no app Arquivos do iPhone:

```text
Arquivos -> Drive -> 99 - Entrada
```

## GitHub

Conta GitHub antiga:

```text
alamoarocha
```

Conta GitHub nova:

```text
alamomalarocha
```

E-mail da conta GitHub nova:

```text
alamomalarocha@gmail.com
```

Motivo da mudanca:

- A conta antiga `alamoarocha` ficou inacessivel no navegador por senha/2FA antigos.
- GitHub Support informou que nao pode desativar, burlar ou remover 2FA.
- Ticket aberto no GitHub Support: `#4534977`.

Regras:

- Todo novo trabalho GitHub deve usar `github.com/alamomalarocha`.
- A conta antiga `alamoarocha` fica apenas como referencia historica.
- Nao tentar publicar/push para `github.com/alamoarocha`.
- Antes de qualquer push, verificar o remote.

Autor dos commits no GitHub Desktop:

```text
Alamo Rocha <alamomalarocha@gmail.com>
```

Sempre verificar:

```text
Repository -> Repository settings -> Remote
```

Se o remote apontar para:

```text
https://github.com/alamoarocha/...
```

trocar para:

```text
https://github.com/alamomalarocha/...
```

## Repositorios migrados

### GIRTAB

Repositorio novo:

```text
https://github.com/alamomalarocha/girtabusa
```

Status:

- Migrado com sucesso.
- Arquivos aparecem no GitHub novo.
- GitHub Desktop limpo: no local changes.
- Remote antigo: `https://github.com/alamoarocha/girtabusa.git`
- Remote novo: `https://github.com/alamomalarocha/girtabusa.git`

### CELULARS

Repositorio novo:

```text
https://github.com/alamomalarocha/celulars-site
```

Status:

- Migrado com sucesso.
- Arquivos aparecem no GitHub novo.
- GitHub Desktop limpo: no local changes.
- Remote antigo: `https://github.com/alamoarocha/celulars-site.git`
- Remote novo: `https://github.com/alamomalarocha/celulars-site.git`

Arquivos importantes confirmados:

- `index.html`
- `iphones.html`
- `script.js`
- `styles.css`
- `style.css`
- `assets`
- `brand-assets`
- `data`
- `design-system`
- `atacado.html`
- `apple-inspired-header.css`
- `apple-inspired-header.js`
- `ptax-reference.css`
- `ptax-reference.js`
- `visual-direction.css`
- `visual-direction.js`
- `visual-review.css`
- `impact-calculator.js`
- `impact-counter.css`

### Cofrinho Real

Repositorio novo:

```text
https://github.com/alamomalarocha/cofrinhoreal.com.br
```

Status informado:

- Migrado com sucesso.
- Arquivos aparecem no GitHub novo.
- GitHub Desktop limpo: no local changes.
- Remote antigo: `https://github.com/alamoarocha/cofrinhoreal.com.br.git`
- Remote novo: `https://github.com/alamomalarocha/cofrinhoreal.com.br.git`

Pasta principal real identificada:

```text
C:\Users\alamo\OneDrive\Documents\cofrinhoreal.com.br 2
```

Confirmacoes:

- E repositorio Git: sim.
- Existe `.git`: sim.
- Ultimo commit local registrado no momento da migracao: `ef9c881 Add avatar 004 Pig Crianca padrao image`.

Arquivos/pastas importantes confirmados:

- `index.html`
- `styles.css`
- `script.js`
- `personagens.html`
- `personagens.js`
- `pig-coins.html`
- `PROMPT_MESTRE.md`
- `IDENTIDADE_VISUAL.md`
- `README.md`
- `ABRIR_PROTOTIPO.md`
- `DEPLOY.md`
- `docs`
- `assets`
- `data`
- `frontend`
- `backend`
- `mobile`
- `api`
- `database`
- `design`
- `branding`
- `public`
- `scripts`
- `tests`

Pastas que nao sao o projeto principal:

```text
H:\Meu Drive\01 - Projetos\Alamo Projetos\COFRINHO REAL\Pig-Cofrinho-Real
```

Parece pasta de imagens/assets. Tem `Avatares`, `Logos-CR-Pig`, `Logo-Vantajinho`. Nao e o repositorio principal.

```text
H:\Meu Drive\06 - Backup\Notebook\BACKUP DESKTOP\Pig-Cofrinho-Real
```

Parece backup. Nao usar como principal sem confirmar.

## Cloudflare

Cloudflare novo:

- Entrou com GitHub novo / `alamomalarocha`.
- Conta Cloudflare nova esta vazia, sem dominios.

Cloudflare antigo:

- Provavelmente ainda controla DNS/dominios atuais.
- Sem acesso no momento porque esta ligado a e-mail antigo.

Regras:

- Nao adicionar dominio no Cloudflare novo sem plano.
- Nao trocar nameservers no GoDaddy sem copiar DNS antes.
- Nao mexer em DNS se os sites estao funcionando.
- Primeiro terminar GitHub novo e repositorios.
- Depois planejar migracao Cloudflare com backup completo.

## GoDaddy e dominios

Alamo tem acesso ao GoDaddy. Os dominios foram comprados la.

Dominios principais:

- `cofrinhoreal.com.br`
- `celulars.com.br`
- `girtabusa.com`

Regras:

- GoDaddy e o registrador.
- Se for necessario migrar para Cloudflare novo, sera possivel trocar nameservers pelo GoDaddy.
- Nao trocar nameservers ainda.
- Antes de qualquer troca, copiar todos os DNS atuais: A, CNAME, MX, TXT, SPF, DKIM, DMARC, registros do Google Workspace, registros do GitHub/Cloudflare Pages, redirects e subdominios.

## Regras para Codex e desenvolvimento

Sempre fazer antes de alterar:

1. Identificar projeto correto.
2. Confirmar caminho completo.
3. Confirmar se e repositorio Git.
4. Confirmar remote.
5. Confirmar branch.
6. Confirmar se ha mudancas locais.
7. Nao apagar nada.
8. Nao mover arquivos sem confirmacao.
9. Nao dar commit/push sem autorizacao.
10. Nao publicar sem revisar.

Sempre usar:

- GitHub novo: `alamomalarocha`
- Google/Drive novo: `alamomalarocha@gmail.com`
- Pasta base: `H:\Meu Drive\01 - Projetos`
- Entrada oficial: `H:\Meu Drive\99 - Entrada`

Nao usar como destino principal:

- `C:\ALAMO-PROJETOS`
- `C:\Users\alamo\OneDrive\Documents`
- GitHub antigo `alamoarocha`

Excecao atual:

- Cofrinho Real ainda esta em `C:\Users\alamo\OneDrive\Documents\cofrinhoreal.com.br 2`.
- Antes de mover, confirmar com Alamo.
- Nao mover automaticamente.

## Projeto CELULARS

Marca:

```text
CELULARS
```

Site:

- Vitrine/catalogo sem checkout.
- Fechamento pelo WhatsApp institucional: `+1 786-546-6540`.

CTA padrao:

```text
Consultar pelo WhatsApp
```

Mensagem padrao:

```text
Ola, tenho interesse em comprar iPhone pela CELULARS. Gostaria de receber atendimento para consultar modelos, disponibilidade e condicoes de compra.
```

Menu fixo:

```text
Home | iPhones | Sobre | Contato
```

Pode existir Atacado como area protegida/B2B.

Estilo:

- Premium.
- Simples.
- Comercial.
- Minimalista.
- Apple-like.
- Limpo.

Produtos:

- Foco em iPhones novos e eCPO/Eco Certified Pre-Owned.

Frete Brasil:

- eCPO/CPO: US$125 por aparelho.
- Novo: US$200 por aparelho.

Atacado:

- Area protegida para cliente B2B validado.
- Nao publicar tabela real aberta.
- Cloudflare Access podera proteger a area futuramente.

Importante:

- Nao alterar preco, PTAX, filtros, WhatsApp ou logica principal sem confirmacao.

CDVS / iPhone 15:

- Existe material de integracao CDVS para iPhone 15.
- A primeira integracao deve ser limitada ao iPhone 15.
- Cores: Black, Blue, Green, Yellow, Pink.
- Arquivos esperados: `iphone-15-black.png` ou `.svg`, `iphone-15-blue.png` ou `.svg`, `iphone-15-green.png` ou `.svg`, `iphone-15-yellow.png` ou `.svg`, `iphone-15-pink.png` ou `.svg`.

Regras:

- Nao substituir imagens em massa.
- Nao aplicar CDVS a outros modelos antes de validar iPhone 15.
- Nao alterar catalogo oficial antes de aprovacao final.

## Projeto GIRTAB

Nome oficial:

```text
GIRTAB Trading and Logistics, LLC
```

Site:

```text
girtabusa.com
```

Atuacao:

- Trading, logistica e procurement para America Latina.
- Foco em iPhones e produtos Apple novos e recondicionados.

Publico:

- B2B LATAM, especialmente Brasil.

Contato correto no site:

```text
contact@celulars.com.br
```

Nao usar no site:

```text
gtandlllc@gmail.com
```

Linguagem:

- Nao alegar parceria/autorizacao Apple ou operadoras.
- Usar termos como `U.S. supplier network`, `verified sourcing channels`, `trade-in and refurbished device market`.

## Projeto Cofrinho Real

Projeto:

```text
cofrinhoreal.com.br / Cofrinho Real
```

Universo:

- PigCoin.
- Vila Pig.
- Personagens educativos.

Objetivo:

- Educacao financeira ludica para criancas e familias.

Repositorio novo:

```text
https://github.com/alamomalarocha/cofrinhoreal.com.br
```

Antes de evoluir:

1. Ler `PROMPT_MESTRE.md`.
2. Ler `IDENTIDADE_VISUAL.md`.
3. Ler `docs/README.md`.
4. Ler este documento quando a tarefa envolver organizacao, GitHub, Drive, Cloudflare ou migracao.

Status:

- MVP visual e conceitual.
- Sem backend real.
- Sem banco real.
- Sem login funcional.
- Sem PIX real.
- Sem movimentacao real de dinheiro.

Tom:

- Seguro.
- Infantil.
- Educativo.
- Divertido.
- Responsavel.

Vantajinho:

- Pode ser apresentado como "esperto demais".
- Catchphrase: "O Vantajinho olha tao longe para ganhar vantagem que tropeca no proprio rabo."

PigCoin:

- Usar analogia educativa inspirada na historia do Bitcoin: moeda alternativa, descentralizada, sem autoridade central, mineracao, energia, criptografia, escassez e seguranca.
- Sempre em formato ficticio, ludico e educativo para criancas.
- Nao parecer investimento real.

## Proximos passos recomendados

1. Nao mexer no Cloudflare ainda.
2. Confirmar que os tres repositorios novos estao no GitHub:
   - `alamomalarocha/girtabusa`
   - `alamomalarocha/celulars-site`
   - `alamomalarocha/cofrinhoreal.com.br`
3. Atualizar cada projeto Codex com este contexto novo.
4. Depois revisar GitHub Pages/Cloudflare Pages de cada site.
5. Depois planejar migracao Cloudflare com GoDaddy:
   - mapear DNS atual;
   - adicionar dominio no Cloudflare novo;
   - conferir registros;
   - trocar nameservers no GoDaddy somente quando estiver tudo pronto.
6. Depois resolver iCloud Fotos antigas.
7. Depois remover/desconectar contas antigas com seguranca.

## Regra final

A nova base de trabalho do Alamo e:

- Google: `alamomalarocha@gmail.com`
- GitHub: `alamomalarocha`
- Drive: `H:\Meu Drive`
- Projetos: `H:\Meu Drive\01 - Projetos`
- Entrada: `H:\Meu Drive\99 - Entrada`
- Apple/iCloud: `alamoarocha@icloud.com`

Nao usar conta/caminho antigo sem perguntar antes.
