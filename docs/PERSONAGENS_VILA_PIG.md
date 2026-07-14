# Personagens da Vila Fazenda Pig

Este documento registra a base oficial de personagens colecionáveis da Vila Fazenda Pig.

## Quantidade atual

A base atual possui **200 personagens**.

O card `001` e sempre o **Pig Principal**.

## Separacao conceitual

O Pig Principal, os avatares do usuário e os personagens da Vila Pig não são a mesma coisa.

- `001 - Pig Principal`: mascote/guia da marca, professor-amigo e rosto do Cofrinho Real.
- `002` a `011`: avatares base por faixa etária do usuário.
- `012` em diante: personagens fixos da Vila Pig / Família Pig, usados no universo narrativo.

O Avatar Pig do usuário deve ser tratado como personalização visual opcional, com a pergunta:

> Como voce quer personalizar seu Pig?

Texto de apoio:

> Voce pode mudar isso depois.

As opções publicas de avatar são estilos visuais: Pig Azul, Pig Rosa, Pig Arco-íris e Pig Padrão. Elas não representam declaracao obrigatória de identidade pessoal.

Nomes internos planejados:

- `avatar_style: azul`
- `avatar_style: rosa`
- `avatar_style: arco_iris`
- `avatar_style: padrao`

Não usar publicamente "menino", "menina", "LGBT", "neutro" ou "o que voce e".

Não criar variações por estilo agora. Os personagens `002` a `011` continuam sendo a sequencia de avatares base/padrao por idade, mas ja possuem variações planejadas para `padrao`, `azul`, `rosa` e `arco_iris`.

## Imagem oficial criada

- `001` Pig Principal: `assets/characters/001-pig-principal.png`

As imagens antigas de `002` a `010` foram movidas para `assets/characters/_drafts/` e não contam como assets oficiais.

A ordem inicial oficial e:

- `001` Pig Principal
- `002` Pig Bebê
- `003` Pig Primeirinhos
- `004` Pig Criança
- `005` Pig Pré-adolescente
- `006` Pig Adolescente
- `007` Pig Jovem
- `008` Pig Jovem Adulto
- `009` Pig Adulto
- `010` Pig Coroa
- `011` Pig Sênior
- `012` Pinguinha
- `013` Mae Helena
- `014` Pai Raimundo
- `015` Bia
- `016` Juninho
- `017` Vovo Zefa
- `018` Vovô João
- `019` Vovo Lourdes
- `020` Vovo Severino
- `021` Tia Maria
- `022` Tio Chico
- `023` Prima Lala
- `024` Primo Toninho
- `025` Seu Damiao da Padaria
- `026` Tia Carmem da Cantina

## Campos oficiais

Cada personagem deve ter:

- `numero`
- `nome`
- `slug`
- `apelido`
- `aliases`
- `tipo`
- `categoria`
- `faixa_etaria`
- `papel`
- `descricao_curta`
- `historia`
- `relacoes`
- `uso_no_projeto`
- `ideia_visual`
- `status_imagem`
- `asset_futuro`
- `tags`

## Categorias

A base contempla:

- mascote e guias;
- avatares por idade;
- família principal;
- família estendida;
- avos dos dois lados;
- escola;
- cantina e eventos escolares;
- comércio local;
- vizinhança;
- parentes e visitantes;
- relações de confiança;
- propósito social futuro;
- comunidade educativa.

## Uso futuro

Os personagens poderao ser usados em:

- app;
- cards colecionáveis;
- jogos educativos futuros;
- videos;
- materiais A4;
- campanhas de família, escola, comércio e comunidade.

No MVP atual, eles existem apenas como estrutura documental e base de dados estática.

## Uso no website

O Pig Principal 001 é também a referência visual oficial da marca no website. Ele representa o mascote oficial, o guia visual do Cofrinho Real e a principal referência do universo Pig no protótipo atual. Essa decisão não altera a sequência de personagens nem as regras de avatar.

## Personagem especial 201 - Vantajinho

O Vantajinho e um quati brasileiro esperto, travesso e educativo da Vila Pig. Ele representa impulso, descuido, custo escondido e escolhas mal planejadas de forma leve, sempre como aprendizado.

Regra principal: **No dinheiro real, o Vantajinho so ensina. No PigCoin, ele entra no jogo.**

Ele e o contraponto educativo do Pig. No dinheiro real, ele apenas orienta. No PigCoin, ele pode gerar consequencias ficticias dentro dos jogos educativos.

Dados oficiais:

- número: 201
- nome: Vantajinho
- slug: vantajinho
- tipo_personagem: personagem_especial
- especie: quati
- universo: vila_pig
- funcao_educativa: contraponto_ao_erro
- status_imagem: criada
- asset_futuro: assets/characters/201-vantajinho.png

## Coleção Pig

A Coleção Pig e a representação visual em cards dos personagens, avatares e especiais do universo Cofrinho Real. Os cards são institucionais, educativos e colecionáveis apenas no sentido visual. Não possuem valor financeiro, não são vendidos e não devem ser tratados como aposta, cassino, loot box ou mecanismo de recompensa financeira.

A página estática `personagens.html` deve ser atualizada sempre que uma imagem oficial de personagem ou avatar for criada.

## Catálogo escalavel

O número 200 deixou de ser limite de expansão. Os números legados permanecem, enquanto `uid`, `numero_legacy` e `card_code` permitem crescimento para milhares de registros. A matriz de cobertura define prioridades por necessidade cultural e educativa, não por contagem.

Ver `ARQUITETURA_UNIVERSO_PIG.md`, `MATRIZ_COBERTURA_PERSONAGENS.md` e `data/backlog-personagens.csv`.

<!-- CATALOGO_BRASILEIRO_INICIO -->
## Catálogo brasileiro compilado

Em 2026-07-12, o catálogo passou a ter 3251 registros fixos, 1430 famílias e cobertura das 27 UFs. As fontes ficam em `data/personagens/`; os arquivos monolíticos são gerados. Perfis culturais sensíveis permanecem não publicáveis até pesquisa e revisão.

Referências: `docs/CATALOGO_BRASILEIRO_PERSONAGENS.md`, `docs/REVISAO_CULTURAL_PERSONAGENS.md` e `data/relatorio-validacao-catalogo.json`.
<!-- CATALOGO_BRASILEIRO_FIM -->
