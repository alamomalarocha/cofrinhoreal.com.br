# Cofrinho Real

Protótipo navegável do projeto Cofrinho Real.

Antes de qualquer evolução, leia o arquivo [PROMPT_MESTRE.md](PROMPT_MESTRE.md). Ele define a filosofia, limites, identidade e direção do projeto.

Leia também:

- [IDENTIDADE_VISUAL.md](IDENTIDADE_VISUAL.md)
- [docs/README.md](docs/README.md)

## Fase atual

MVP de validação visual e conceitual.

O site pode estar publicado em `https://cofrinhoreal.com.br` apenas para análise, com `noindex` temporário.

Não há backend, banco de dados, login funcional, PIX real, app real ou movimentação real de dinheiro.

## Princípios

- Simples
- Organizado
- Seguro
- Escalável
- Baixo custo
- Fácil manutenção

## Como abrir localmente

Abra o arquivo `index.html` no navegador ou rode um servidor estático simples na pasta do projeto.

## Estrutura do projeto

- `docs/`: missão, roadmap, MVP, regras de negócio, fluxos, segurança e arquitetura.
- `design/`: diretrizes futuras de UX, UI e protótipos.
- `branding/`: marca, tom de voz e mascote Pig.
- `frontend/`: futura aplicação web.
- `backend/`: futuro backend.
- `mobile/`: futuro aplicativo mobile.
- `api/`: futura documentação de contratos e endpoints.
- `database/`: futuro modelo de dados.
- `assets/`: imagens e materiais visuais.
- `public/`: futuros arquivos públicos da aplicação.
- `tests/`: futuros testes.
- `scripts/`: futuros scripts auxiliares.

## Vila Pig

A base estatica do universo de personagens fica em:

- `data/vila-pig-personagens.json`
- `data/vila-pig-personagens.csv`

A previa visual fica em `personagens.html`.

As imagens aprovadas ficam em `assets/characters/`. O status oficial de cada personagem e variacao fica no JSON, e o proximo item nunca deve ser presumido.

O universo escalavel tambem usa:

- catalogos territoriais, culturais, familiares e profissionais em `data/`;
- esquemas em `schemas/`;
- validacao com `node scripts/validate-universo-pig.mjs`;
- arquitetura documentada em `docs/ARQUITETURA_UNIVERSO_PIG.md`.

O projeto continua um prototipo estatico, sem backend, banco real, login real, PIX real ou movimentacao real.
