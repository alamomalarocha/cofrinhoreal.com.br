# Protocolo Oficial de Imagens dos Personagens

Este documento define o fluxo oficial para criacao, recebimento, arquivamento e versionamento das imagens dos personagens da Vila Pig / Familia Pig.

## Regras obrigatorias

- Nao recriar personagens.
- Nao alterar a sequencia dos personagens.
- Nao mudar nomes, numeros ou slugs ja cadastrados.
- Nao trabalhar em lote.
- Nao pedir proximos 5 personagens.
- Nao criar imagens automaticamente dentro do Codex.
- Nao separar painel com varios personagens.
- Nao inventar arquivos inexistentes.
- Nao criar backend, banco real, login real, PIX real, app real ou movimentacao real.

## Base oficial

A base oficial de personagens esta em:

- `data/vila-pig-personagens.json`
- `data/vila-pig-personagens.csv`

Cada personagem possui:

- `numero`
- `nome`
- `slug`
- `asset_futuro`
- `status_imagem`

## Padrao oficial de arquivo

Cada imagem oficial deve ser salva em:

```text
assets/characters/NUMERO-SLUG.png
```

Exemplos:

```text
assets/characters/001-pig-principal.png
assets/characters/002-pig-bebe.png
assets/characters/003-pig-primeirinhos.png
assets/characters/012-pinguinha.png
assets/characters/017-vovo-zefa.png
```

## Fluxo oficial guiado

O fluxo oficial de imagens da Vila Pig / Familia Pig e guiado uma imagem por vez.

1. Alamo envia uma imagem de personagem para o Codex.
2. O Codex salva essa imagem exatamente no caminho definido em `asset_futuro`.
3. O Codex atualiza:
   - `data/vila-pig-personagens.json`
   - `data/vila-pig-personagens.csv`
   - `docs/PERSONAGENS_VILA_PIG.md`
   - `docs/ASSETS_PERSONAGENS.md`
   - `docs/PLANO_IMAGENS_PERSONAGENS_001.md`
4. O campo `status_imagem` muda de `"pendente"` para `"criada"`.
5. O Codex faz commit e push.
6. O Codex responde confirmando que salvou a imagem e que Alamo pode mandar a proxima.
7. O Codex informa apenas o proximo personagem pendente da sequencia.
8. O Codex fornece dois blocos prontos:
   - prompt para Alamo mandar ao ChatGPT criar a proxima imagem;
   - prompt para Alamo mandar de volta ao Codex quando a imagem estiver pronta.

## Formato obrigatorio da resposta apos salvar uma imagem

Depois de cada imagem salva, a resposta do Codex deve seguir este formato:

```text
==================================================
IMAGEM SALVA
==================================================

Imagem salva com sucesso.

Personagem atualizado:
- numero:
- nome:
- slug:
- arquivo:
- status_imagem: criada

Commit:
- [hash e mensagem]

Pode mandar a proxima imagem.

==================================================
PROXIMO PERSONAGEM PENDENTE
==================================================

- numero:
- nome:
- slug:
- asset_futuro:

==================================================
PROMPT PARA MANDAR AO CHATGPT CRIAR A PROXIMA IMAGEM
==================================================

Crie a imagem oficial do personagem:

[NUMERO] - [NOME]
slug: [SLUG]
arquivo final esperado: [ASSET_FUTURO]

Esse personagem faz parte da Vila Pig / Familia Pig do projeto Cofrinho Real.

Padrao visual:
- PNG com fundo transparente;
- personagem individual;
- corpo inteiro;
- em pe;
- centralizado;
- pose limpa para card colecionavel;
- estilo 3D/cartoon premium;
- fofo, profissional, amigavel e consistente com a identidade do Cofrinho Real;
- sem cenario;
- sem texto escrito na imagem;
- sem fundo colorido;
- pronto para usar em cards, app, site, posts e materiais.

Descricao do personagem:
[usar a descricao/historia/papel do personagem conforme data/vila-pig-personagens.json]

Crie do zero apenas esse personagem, sem gerar outros personagens juntos.

==================================================
PROMPT PARA MANDAR AO CODEX QUANDO A IMAGEM ESTIVER PRONTA
==================================================

Estou enviando a imagem oficial do personagem:

[NUMERO] - [NOME]
slug: [SLUG]
arquivo correto:
[ASSET_FUTURO]

Tarefas:
1. Salvar a imagem enviada em:
[ASSET_FUTURO]

2. Atualizar:
- data/vila-pig-personagens.json
- data/vila-pig-personagens.csv
- docs/PERSONAGENS_VILA_PIG.md
- docs/ASSETS_PERSONAGENS.md
- docs/PLANO_IMAGENS_PERSONAGENS_001.md

3. No personagem [NUMERO] - [NOME]:
- status_imagem deve mudar de "pendente" para "criada"
- asset_futuro deve continuar apontando para:
[ASSET_FUTURO]

4. Fazer commit e push com a mensagem:
Add character [NUMERO] [NOME] image

5. Depois me informe:
- arquivo salvo;
- personagem atualizado;
- status_imagem atualizado;
- commit criado;
- push realizado;
- proximo personagem pendente da sequencia, com numero, nome, slug e asset_futuro;
- prompt para ChatGPT criar a proxima imagem;
- prompt para Codex salvar a proxima imagem.

Importante:
Nao criar backend.
Nao criar banco real.
Nao criar login real.
Nao integrar PIX real.
Nao criar app real.
Nao criar movimentacao real.
```

## Exemplo de atualizacao de personagem

Quando uma imagem for enviada como:

```text
001 - Pig Principal
slug: pig-principal
```

Ela deve ser salva em:

```text
assets/characters/001-pig-principal.png
```

O personagem `001` deve ser atualizado para:

```json
"status_imagem": "criada"
```

O campo `asset_futuro` deve continuar igual:

```text
assets/characters/001-pig-principal.png
```

## Direcao visual preferencial

As imagens futuras devem preferencialmente ser:

- PNG;
- fundo transparente;
- corpo inteiro;
- personagem em pe;
- centralizadas;
- consistentes entre si;
- prontas para cards colecionaveis, app, site, redes sociais e materiais.

## Estado atual

Em 2026-07-02:

- `001 - Pig Principal`: `status_imagem: "criada"`
- `002 - Pig Bebe`: `status_imagem: "criada"`
- `003 - Pig Primeirinhos`: `status_imagem: "criada"`
- proximo personagem pendente: `004 - Pig Crianca`

O proximo arquivo esperado e:

```text
assets/characters/004-pig-crianca.png
```
