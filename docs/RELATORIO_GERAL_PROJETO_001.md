# Relatorio Geral do Projeto 001

Data: 2026-07-02

## 1. Resumo executivo

O Cofrinho Real e um prototipo visual estatico de uma plataforma de troco digital e educacao financeira.

A missao do projeto e transformar pequenos valores em grandes conquistas, com linguagem familiar, educativa e carinhosa.

Fase atual: MVP visual e conceitual, publicado ou publicavel apenas para validacao, com `noindex`.

Nao existe backend, banco real, login real, autenticacao, PIX real, app real, checkout ou movimentacao real de dinheiro.

## 2. Estrutura atual do projeto

Principais paginas:

- `index.html`
- `o-que-e.html`
- `como-funciona.html`
- `comerciantes.html`
- `familias.html`
- `educacao.html`
- `jogos.html`
- `pig-coins.html`
- `faq.html`
- `personagens.html`
- `privacidade.html`
- `termos.html`
- `cookies.html`
- `direitos.html`

Principais pastas:

- `assets/`
- `assets/brand/`
- `assets/store/`
- `assets/social/`
- `assets/a4/`
- `assets/ui/`
- `assets/characters/`
- `data/`
- `docs/`
- `design/`
- `branding/`
- `frontend/`
- `backend/`
- `mobile/`
- `api/`
- `database/`
- `public/`
- `tests/`
- `scripts/`

Assets principais:

- `assets/brand/cofrinho-real-pig-logo-principal.png`
- `assets/brand/cofrinho-real-logo-header.png`
- `assets/favicon.svg`
- `site.webmanifest`

## 3. Site atual

A Home apresenta a entrada principal do produto, com foco em Pessoa Fisica, Pessoa Juridica, app visual e proposta de troco digital.

As paginas internas explicam:

- o que e o Cofrinho Real;
- como funciona;
- comerciantes;
- familias;
- educacao financeira;
- jogos educativos futuros;
- PigCoins;
- FAQ;
- personagens da Vila Pig;
- documentos legais iniciais.

O header/menu e compartilhado visualmente entre as paginas. O login e apenas modal visual. A busca e apenas visual. O botao Criar conta aponta para area visual da Home. O projeto mantem `noindex`.

## 4. Identidade visual

A logo/arte principal atual e:

```text
assets/brand/cofrinho-real-pig-logo-principal.png
```

A logo compacta de header e:

```text
assets/brand/cofrinho-real-logo-header.png
```

O Pig e o mascote principal, professor-amigo e coracao emocional do Cofrinho Real.

Cores principais:

- Rosa Pig: `#ff4f83`
- Pink forte: `#f72565`
- Azul confianca: `#10264f`
- Blush: `#fff1f5`
- Dourado Pig Coin: `#f6b33b`

## 5. Vila Pig / Personagens

A base de personagens foi criada.

Arquivos:

- `data/vila-pig-personagens.json`
- `data/vila-pig-personagens.csv`

Quantidade atual: 200 personagens.

Cada personagem possui:

- numero;
- nome;
- slug;
- status de imagem;
- caminho futuro do asset.

Padrao:

```text
assets/characters/NUMERO-SLUG.png
```

Status atual das imagens: pendente.

Primeira leva sugerida para imagens:

- Pig Principal;
- Pinguinha;
- Mae Helena;
- Pai Raimundo;
- Vovo Zefa;
- Vovo Joao;
- Seu Damiao da Padaria;
- Tia Carmem da Cantina;
- Professora Lucia;
- Pedrinho;
- Aninha;
- Tia Maria.

## 6. Funcionalidades que existem hoje

Existem apenas visualmente:

- site multipaginas estatico;
- Home;
- paginas internas;
- paginas legais;
- modal de login visual;
- busca visual;
- banner/aviso de privacidade visual;
- pagina de previa de personagens;
- base estatica de personagens em JSON/CSV.

## 7. Funcionalidades que nao existem

Nao existem:

- backend;
- banco real;
- login real;
- autenticacao;
- conta real;
- PIX real;
- app real;
- checkout;
- movimentacao real de dinheiro;
- jogos funcionais;
- PigCoins funcionais;
- coleta real de dados de usuario.

## 8. Riscos e cuidados

Pontos que exigem cuidado antes de qualquer operacao real:

- regulacao financeira;
- LGPD;
- dados de criancas e adolescentes;
- publicidade infantil;
- escolas e cantinas;
- brindes e recompensas;
- uso de marcas de terceiros;
- evitar aparencia de bet, cassino, loot box ou jogo de aposta;
- evitar promessa de ganho, credito ou emprestimo;
- revisar juridicamente termos e privacidade.

## 9. Proximos passos recomendados

1. Revisar visualmente o site multipaginas no navegador.
2. Corrigir detalhes de header/menu se aparecerem em telas reais.
3. Criar a primeira leva de imagens dos personagens.
4. Salvar imagens em `assets/characters/` usando numero e slug.
5. Atualizar JSON/CSV com `status_imagem: "criada"`.
6. Depois pensar em prototipo de telas do app.
7. Jogos educativos devem vir depois, sem mecanicas viciantes.
8. Backend, banco real e dinheiro real ficam para fase muito posterior.

## 10. Checklist final

- Estatico: sim.
- Sem backend: sim.
- Sem banco real: sim.
- Sem login real: sim.
- Sem PIX real: sim.
- Sem app real: sim.
- Sem movimentacao real: sim.
- Noindex: sim.
- Docs organizados: sim.
- Assets organizados: sim.
- Personagens prontos para receber imagens: sim.
