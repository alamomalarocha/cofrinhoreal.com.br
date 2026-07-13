# Documentacao do Cofrinho Real

## Posicionamento e protecao - 2026-07

- [Reposicionamento publico PigCoin](REPOSICIONAMENTO_PUBLICO_PIGCOIN.md)
- [Internacionalizacao e conformidade](INTERNACIONALIZACAO_E_CONFORMIDADE.md)
- [Protecao infantojuvenil](PROTECAO_INFANTOJUVENIL.md)
- [Afericao de idade e responsaveis](AFERICAO_DE_IDADE_E_RESPONSAVEIS.md)
- [Conteudo por idade](CONTEUDO_POR_IDADE.md)
- [Classificacao indicativa](CLASSIFICACAO_INDICATIVA.md)
- [Plano de revelacao futura](PLANO_REVELACAO_FUTURA.md)
- [Auditoria de exposicao](AUDITORIA_EXPOSICAO_CONCEITO_TROCO_001.md)
- [Checkpoint do reposicionamento](CHECKPOINT_REPOSICIONAMENTO_PUBLICO_001.md)

Os documentos historicos abaixo podem descrever etapas anteriores. O posicionamento vigente e definido pelos arquivos acima e pelo `PROMPT_MESTRE.md` da raiz.

Esta pasta concentra a memoria de produto, negocio, arquitetura, seguranca e evolucao do Cofrinho Real.

Antes de desenvolver qualquer funcionalidade, leia:

1. `PROMPT_MESTRE.md`
2. `README.md`
3. `IDENTIDADE_VISUAL.md`
4. Os documentos desta pasta relacionados ao tema da mudanca.

## Documentos de produto e marca

- `ARQUITETURA_UNIVERSO_PIG.md`: camadas, identificadores canonicos e compatibilidade do universo escalavel.
- `GERACOES_E_FASES_DA_VIDA.md`: separacao entre coorte de nascimento e fase atual da vida.
- `BRASIL_REGIOES_CULTURAS.md`: regioes, UFs, territorios, biomas e regras de pesquisa cultural.
- `FAMILIAS_ORIGENS_CULTURAIS.md`: familias, origens, comunidades e cuidados de representacao.
- `PROFISSOES_E_FUTURO_DO_TRABALHO.md`: trabalhos historicos, atuais, populares, emergentes e futuros.
- `FOLCLORE_E_CULTURA_BRASILEIRA.md`: pesquisa de figuras e versoes regionais com imagens originais.
- `GUIA_VISUAL_PERSONAGENS.md`: padrao visual, nomenclatura e checklist de aprovacao.
- `MATRIZ_COBERTURA_PERSONAGENS.md`: processo para identificar lacunas reais.
- `PLANO_EXPANSAO_PERSONAGENS.md`: crescimento para centenas ou milhares de personagens.
- `PESQUISA_E_FONTES.md`: hierarquia de fontes e status de pesquisa.
- `CHECKPOINT_REORGANIZACAO_PERSONAGENS_001.md`: ponto seguro e inventario anterior a migracao.
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
- `ORGANIZACAO_DIGITAL_ALAMO_2026_07_04.md`: nova base de contas, Drive, GitHub, Cloudflare, GoDaddy e regras operacionais para projetos do Alamo.
- `CHECKPOINT_REFINAMENTO_GERAL_001.md`: checkpoint da rodada geral de refinamento visual e documental.
- `CHECKPOINT_REESTRUTURA_MULTIPAGINAS_001.md`: checkpoint da mudanca de landing unica para prototipo estatico multipaginas.
- Arte principal atual do Pig/Cofrinho Real: `assets/brand/cofrinho-real-pig-logo-principal.png`.
- Base estatica atual de personagens: `data/vila-pig-personagens.json` e `data/vila-pig-personagens.csv`.
- Estado das imagens: consultar `status_variacoes` no JSON e validar com `node scripts/validate-universo-pig.mjs`; a reorganizacao preservou 39 variacoes criadas e o proximo item `011 - Pig Senior - arco_iris`.
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

## Regra de prompts para avatares

Os avatares do usuario devem ser imagens limpas do personagem, sem texto, letras, moedas, medalhas, logotipos ou simbolos. Se a geracao vier com esses elementos, a imagem deve ser descartada e uma nova deve ser gerada do zero com prompt simplificado.

A etapa atual cria as variacoes dos avatares `002` a `011`, uma imagem por vez, nos estilos `padrao`, `azul`, `rosa` e `arco_iris`.

## Diferenca entre Pig Padrao e Pig Arco-iris

Pig Padrao e a opcao neutra/universal para quem prefere nao escolher. Pig Arco-iris e a opcao visual colorida/inclusiva e deve ter faixas de arco-iris claramente visiveis na roupa ou acessorios principais.

O nome publico principal continua sendo Pig Arco-iris. Pig Colorido pode ser usado apenas como apelido visual se algum material precisar suavizar a linguagem.

## Reset visual dos avatares

Os avatares do usuario `002` a `011` foram reabertos para recriacao com uma base visual simples e consistente: camisa, calca/short e tenis.

As variacoes `padrao`, `azul`, `rosa` e `arco_iris` passam a mudar principalmente as cores dessas pecas. Nao usar bones, acessorios, simbolos, moedas, medalhas, textos ou elementos extras nos avatares-base.

As imagens antigas de variacoes de avatar foram movidas para `assets/characters/_drafts/avatars/`.

## Colecao Pig

A pagina `personagens.html` apresenta a Colecao Pig: uma galeria estatica de cards colecionaveis dos personagens, avatares e especiais do Cofrinho Real. Ela usa `data/vila-pig-personagens.json` e assets de `assets/characters/`, sem backend, banco real, login real, PIX real ou movimentacao real.

Sempre que uma imagem oficial de personagem ou avatar for criada, atualizar tambem a pagina/personagens e os dados que alimentam a Colecao Pig para que o card correspondente apareca no site.

## Regra atual dos prompts visuais

Os prompts visuais para ChatGPT Images devem ser ultra curtos, isolados e com no maximo 8 linhas. Sempre comecar com: `Crie do zero. Ignore prints, telas, logos, cards e imagens anteriores.`

Para avatares, o prompt deve trazer apenas idade/faixa, pose, roupa, cor, proibicoes essenciais e fundo transparente. Nao misturar dados tecnicos, caminhos, JSON, CSV, commit ou explicacoes longas no prompt visual.

<!-- CATALOGO_BRASILEIRO_INICIO -->
## Catalogo brasileiro completo

- [Catalogo brasileiro](CATALOGO_BRASILEIRO_PERSONAGENS.md)
- [Cobertura regional](COBERTURA_REGIONAL_UFS.md)
- [Cobertura etnico-cultural](COBERTURA_ETNICO_CULTURAL.md)
- [Cobertura de profissoes](COBERTURA_PROFISSOES.md)
- [Cobertura de folclore](COBERTURA_FOLCLORE.md)
- [Familias do catalogo](FAMILIAS_CATALOGO_COMPLETO.md)
- [Revisao cultural](REVISAO_CULTURAL_PERSONAGENS.md)
- [Fila de imagens](FILA_CRIACAO_IMAGENS.md)
- [Decisoes mestras](DECISOES_MESTRAS_PROJETO.md)
- [Relatorio da expansao](RELATORIO_EXPANSAO_CATALOGO_001.md)
<!-- CATALOGO_BRASILEIRO_FIM -->
