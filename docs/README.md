# Documentação do Cofrinho Real

## Posicionamento e proteção - 2026-07

- [Reposicionamento público PigCoin](REPOSICIONAMENTO_PUBLICO_PIGCOIN.md)
- [Internacionalização e conformidade](INTERNACIONALIZACAO_E_CONFORMIDADE.md)
- [Proteção infantojuvenil](PROTECAO_INFANTOJUVENIL.md)
- [Aferição de idade e responsáveis](AFERICAO_DE_IDADE_E_RESPONSAVEIS.md)
- [Conteúdo por idade](CONTEUDO_POR_IDADE.md)
- [Classificação indicativa](CLASSIFICACAO_INDICATIVA.md)
- [Plano de revelacao futura](PLANO_REVELACAO_FUTURA.md)
- [Auditoria de exposicao](AUDITORIA_EXPOSICAO_CONCEITO_TROCO_001.md)
- [Checkpoint do reposicionamento](CHECKPOINT_REPOSICIONAMENTO_PUBLICO_001.md)

Os documentos históricos abaixo podem descrever etapas anteriores. O posicionamento vigente e definido pelos arquivos acima e pelo `PROMPT_MESTRE.md` da raiz.

Esta pasta concentra a memória de produto, negocio, arquitetura, segurança e evolução do Cofrinho Real.

Antes de desenvolver qualquer funcionalidade, leia:

1. `PROMPT_MESTRE.md`
2. `README.md`
3. `IDENTIDADE_VISUAL.md`
4. Os documentos desta pasta relacionados ao tema da mudança.

## Documentos de produto e marca

- `ARQUITETURA_UNIVERSO_PIG.md`: camadas, identificadores canônicos e compatibilidade do universo escalavel.
- `GERACOES_E_FASES_DA_VIDA.md`: separacao entre coorte de nascimento e fase atual da vida.
- `BRASIL_REGIOES_CULTURAS.md`: regiões, UFs, territórios, biomas e regras de pesquisa cultural.
- `FAMILIAS_ORIGENS_CULTURAIS.md`: famílias, origens, comunidades e cuidados de representação.
- `PROFISSOES_E_FUTURO_DO_TRABALHO.md`: trabalhos históricos, atuais, populares, emergentes e futuros.
- `FOLCLORE_E_CULTURA_BRASILEIRA.md`: pesquisa de figuras e versoes regionais com imagens originais.
- `GUIA_VISUAL_PERSONAGENS.md`: padrão visual, nomenclatura e checklist de aprovação.
- `GUIA_PORTUGUES_E_TERMINOLOGIA.md`: padrões editoriais em pt-BR e separação entre texto público e identificadores técnicos.
- `MATRIZ_COBERTURA_PERSONAGENS.md`: processo para identificar lacunas reais.
- `PLANO_EXPANSAO_PERSONAGENS.md`: crescimento para centenas ou milhares de personagens.
- `PESQUISA_E_FONTES.md`: hierarquia de fontes e status de pesquisa.
- `CHECKPOINT_REORGANIZACAO_PERSONAGENS_001.md`: ponto seguro e inventário anterior à migração.
- `FAMILIA_PIG.md`: universo futuro de personagens da Família Pig, categorias, fases e regras para não criar tudo no MVP.
- `VILA_PIG.md`: conceito oficial da Vila Fazenda Pig, comunidade de personagens do Cofrinho Real.
- `PERSONAGENS_VILA_PIG.md`: base de 200 personagens colecionáveis, com número, slug e uso futuro.
- `ASSETS_PERSONAGENS.md`: regra para vincular imagens futuras por número e slug.
- `AVATARES.md`: diferença entre Pig Principal, Avatar Pig do usuário, opções publicas de estilo visual e personagens fixos.
- `EXPERIENCIA_LOGADA.md`: regra de identidade visual pública antes do login e experiência personalizada futura depois do login.
- `IDENTIDADE_VISUAL.md`: complemento documental da identidade visual dentro de `docs/`.
- `PLANO_IMAGENS_PERSONAGENS_001.md`: plano da próxima fase para criação e recebimento das imagens dos personagens.
- `PROTOCOLO_IMAGENS_PERSONAGENS.md`: fluxo oficial guiado ChatGPT -> Alamo -> Codex, com validação da imagem recebida e envio antecipado do prompt visual puro da próxima imagem antes da publicação da atual.
- `CHECKPOINT_REVISAO_PTBR_FLUXO_IMAGENS_001.md`: ponto de segurança anterior à revisão editorial e ao novo fluxo paralelo de imagens.
- `RELATORIO_REVISAO_PTBR_001.md`: resultado da auditoria editorial, correções, validações e pendências da revisão pt-BR.
- `EDUCACAO_FINANCEIRA.md`: princípios de educação financeira sem culpa, medo ou julgamento.
- `JOGOS_EDUCATIVOS.md`: direção futura para jogos e álbuns educativos sem aposta, loot box ou vício.
- `COOKIES_PRIVACIDADE_TERMOS.md`: memória das páginas legais estáticas do protótipo.
- `PESQUISA_REFERENCIAS_001.md`: pesquisa inicial sobre LGPD, cookies, badges de app, Cloudflare e referências visuais.
- `RELATORIO_GERAL_PROJETO_001.md`: relatório consolidado da fase atual do projeto.
- `CHECKPOINT_ORGANIZACAO_GERAL_001.md`: checkpoint da organização geral antes da fase de imagens.
- `ORGANIZACAO_DIGITAL_ALAMO_2026_07_04.md`: nova base de contas, Drive, GitHub, Cloudflare, GoDaddy e regras operacionais para projetos do Alamo.
- `CHECKPOINT_REFINAMENTO_GERAL_001.md`: checkpoint da rodada geral de refinamento visual e documental.
- `CHECKPOINT_REESTRUTURA_MULTIPAGINAS_001.md`: checkpoint da mudança de landing única para protótipo estático multipaginas.
- Arte principal atual do Pig/Cofrinho Real: `assets/brand/cofrinho-real-pig-logo-principal.png`.
- Base estática atual de personagens: `data/vila-pig-personagens.json` e `data/vila-pig-personagens.csv`.
- Estado das imagens: consultar `status_variacoes` no JSON e validar com `node scripts/validate-universo-pig.mjs`; os 40 avatares de fase da vida estão criados e o próximo item é `202 - Mestre Satochi - principal`.
- Opções publicas de avatar: Pig Azul, Pig Rosa, Pig Arco-íris e Pig Padrão; internamente `avatar_style` usa `azul`, `rosa`, `arco_iris` ou `padrao`.

Regra central:

> O projeto deve crescer sem bagunça, sem recomecar do zero e sem adicionar complexidade desnecessaria.

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

## Regra de prompts para avatares

Os avatares do usuário devem ser imagens limpas do personagem, sem texto, letras, moedas, medalhas, logotipos ou símbolos. Se a geração vier com esses elementos, a imagem deve ser descartada e uma nova deve ser gerada do zero com prompt simplificado.

A etapa atual cria as variações dos avatares `002` a `011`, uma imagem por vez, nos estilos `padrao`, `azul`, `rosa` e `arco_iris`.

## Diferença entre Pig Padrão e Pig Arco-íris

Pig Padrão e a opcao neutra/universal para quem prefere não escolher. Pig Arco-íris e a opcao visual colorida/inclusiva e deve ter faixas de arco-íris claramente visiveis na roupa ou acessórios principais.

O nome público principal continua sendo Pig Arco-íris. Pig Colorido pode ser usado apenas como apelido visual se algum material precisar suavizar a linguagem.

## Reset visual dos avatares

Os avatares do usuário `002` a `011` foram reabertos para recriação com uma base visual simples e consistente: camisa, calca/short e tênis.

As variações `padrao`, `azul`, `rosa` e `arco_iris` passam a mudar principalmente as cores dessas pecas. Não usar bonés, acessórios, símbolos, moedas, medalhas, textos ou elementos extras nos avatares-base.

As imagens antigas de variações de avatar foram movidas para `assets/characters/_drafts/avatars/`.

## Coleção Pig

A página `personagens.html` apresenta a Coleção Pig: uma galeria estática de cards colecionáveis dos personagens, avatares e especiais do Cofrinho Real. Ela usa `data/vila-pig-personagens.json` e assets de `assets/characters/`, sem backend, banco real, login real, PIX real ou movimentação real.

Sempre que uma imagem oficial de personagem ou avatar for criada, atualizar tambem a pagina/personagens e os dados que alimentam a Coleção Pig para que o card correspondente apareca no site.

## Regra atual dos prompts visuais

Os prompts visuais para ChatGPT Images devem ser ultra curtos, isolados e com no máximo 8 linhas. Sempre comecar com: `Crie do zero. Ignore prints, telas, logos, cards e imagens anteriores.`

Para avatares, o prompt deve trazer apenas idade/faixa, pose, roupa, cor, proibicoes essenciais e fundo transparente. Não misturar dados técnicos, caminhos, JSON, CSV, commit ou explicações longas no prompt visual.

Ao receber uma imagem, o Codex consulta a fila com `node scripts/next-image-prompt.mjs --exclude "assets/characters/ITEM-ATUAL.png"` e envia o próximo prompt visual antes de iniciar a publicação. O script é somente de leitura e não altera status, arquivos ou Git.

<!-- CATALOGO_BRASILEIRO_INICIO -->
## Catálogo brasileiro completo

- [Catálogo brasileiro](CATALOGO_BRASILEIRO_PERSONAGENS.md)
- [Cobertura regional](COBERTURA_REGIONAL_UFS.md)
- [Cobertura etnico-cultural](COBERTURA_ETNICO_CULTURAL.md)
- [Cobertura de profissões](COBERTURA_PROFISSOES.md)
- [Cobertura de folclore](COBERTURA_FOLCLORE.md)
- [Famílias do catálogo](FAMILIAS_CATALOGO_COMPLETO.md)
- [Revisão cultural](REVISAO_CULTURAL_PERSONAGENS.md)
- [Fila de imagens](FILA_CRIACAO_IMAGENS.md)
- [Decisões mestras](DECISOES_MESTRAS_PROJETO.md)
- [Relatório da expansão](RELATORIO_EXPANSAO_CATALOGO_001.md)
<!-- CATALOGO_BRASILEIRO_FIM -->
