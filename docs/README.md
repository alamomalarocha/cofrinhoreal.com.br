# Documentacao do Cofrinho Real

Esta pasta concentra a memoria de produto, negocio, arquitetura, seguranca e evolucao do Cofrinho Real.

Antes de desenvolver qualquer funcionalidade, leia:

1. `PROMPT_MESTRE.md`
2. `README.md`
3. `IDENTIDADE_VISUAL.md`
4. Os documentos desta pasta relacionados ao tema da mudanca.

## Documentos de produto e marca

- `FAMILIA_PIG.md`: universo futuro de personagens da Familia Pig, categorias, fases e regras para nao criar tudo no MVP.
- `VILA_PIG.md`: conceito oficial da Vila Fazenda Pig, comunidade de personagens do Cofrinho Real.
- `PERSONAGENS_VILA_PIG.md`: base de 200 personagens colecionaveis, com numero, slug e uso futuro.
- `ASSETS_PERSONAGENS.md`: regra para vincular imagens futuras por numero e slug.
- `AVATARES.md`: diferenca entre Pig Principal, Avatar Pig do usuario, opcoes publicas de estilo visual e personagens fixos.
- `EXPERIENCIA_LOGADA.md`: regra de identidade visual publica antes do login e experiencia personalizada futura depois do login.
- `IDENTIDADE_VISUAL.md`: complemento documental da identidade visual dentro de `docs/`.
- `PLANO_IMAGENS_PERSONAGENS_001.md`: plano da proxima fase para criacao e recebimento das imagens dos personagens.
- `PROTOCOLO_IMAGENS_PERSONAGENS.md`: fluxo oficial guiado ChatGPT -> Alamo -> Codex para salvar uma imagem por vez, atualizar status, devolver apenas o proximo pendente, separar prompt visual limpo dos dados tecnicos e entregar o prompt tecnico para salvamento.
- `EDUCACAO_FINANCEIRA.md`: principios de educacao financeira sem culpa, medo ou julgamento.
- `JOGOS_EDUCATIVOS.md`: direcao futura para jogos e albuns educativos sem aposta, loot box ou vicio.
- `COOKIES_PRIVACIDADE_TERMOS.md`: memoria das paginas legais estaticas do prototipo.
- `PESQUISA_REFERENCIAS_001.md`: pesquisa inicial sobre LGPD, cookies, badges de app, Cloudflare e referencias visuais.
- `RELATORIO_GERAL_PROJETO_001.md`: relatorio consolidado da fase atual do projeto.
- `CHECKPOINT_ORGANIZACAO_GERAL_001.md`: checkpoint da organizacao geral antes da fase de imagens.
- `CHECKPOINT_REFINAMENTO_GERAL_001.md`: checkpoint da rodada geral de refinamento visual e documental.
- `CHECKPOINT_REESTRUTURA_MULTIPAGINAS_001.md`: checkpoint da mudanca de landing unica para prototipo estatico multipaginas.
- Arte principal atual do Pig/Cofrinho Real: `assets/brand/cofrinho-real-pig-logo-principal.png`.
- Base estatica atual de personagens: `data/vila-pig-personagens.json` e `data/vila-pig-personagens.csv`.
- Estado atual de imagens: apenas `001 - Pig Principal` esta oficial; `002` em diante estao pendentes e rascunhos antigos ficam em `assets/characters/_drafts/`.
- Opcoes publicas de avatar: Pig Azul, Pig Rosa, Pig Arco-iris e Pig Padrao; internamente `avatar_style` usa `azul`, `rosa`, `arco_iris` ou `padrao`.

Regra central:

> O projeto deve crescer sem bagunca, sem recomecar do zero e sem adicionar complexidade desnecessaria.

## Uso no website

O Pig Principal 001 é também a referência visual oficial da marca no website. Ele representa o mascote oficial, o guia visual do Cofrinho Real e a principal referência do universo Pig no protótipo atual. Essa decisão não altera a sequência de personagens nem as regras de avatar.

## Identidade visual pública

O visual público do Cofrinho Real segue a identidade neutra do Pig Principal, equilibrando azul, rosa, amarelo/dourado e branco/off-white para não parecer voltado apenas a menino ou menina. As moedas do menu usam CR e animação sutil de giro/brilho com respeito a prefers-reduced-motion.

## Logos Pig oficiais do site

O projeto possui duas versões principais da logo Pig: uma versão com Pig em pé para header e uma versão alternativa com Pig integrado à composição da marca para uso interno.

- Header/site: `assets/brand/cofrinho-real-logo-pig-standing-full-transparent.png` e alias `assets/brand/cofrinho-real-logo-header-full-transparent.png`.
- Alternativa interna: `assets/brand/cofrinho-real-logo-pig-face-full-transparent.png` e alias `assets/brand/cofrinho-real-logo-site-full-transparent.png`.

O personagem 001 continua separado em `assets/characters/001-pig-principal.png`. As logos completas ficam em `assets/brand/` e não substituem o personagem individual.

## Identidade pública e experiência logada

Regra registrada:

> Antes do login, o Cofrinho Real usa a identidade padrão do Pig Principal, neutra e universal. Depois do login, a experiência pode se adaptar ao tipo de conta, faixa etária e estilo visual escolhido pelo usuário.

> O público geral vê o Pig Principal neutro. O usuário logado vê o seu próprio universo Pig personalizado.

Essa regra está detalhada em EXPERIENCIA_LOGADA.md, IDENTIDADE_VISUAL.md e AVATARES.md. Não existe implementação real de login ou personalização dinâmica nesta fase.

## Personagem especial Vantajinho

O personagem especial 201 - Vantajinho foi registrado como contraponto educativo do Pig.

No dinheiro real, ele apenas orienta. No PigCoin, ele pode gerar consequencias ficticias dentro dos jogos educativos. O asset oficial fica em assets/characters/201-vantajinho.png.
