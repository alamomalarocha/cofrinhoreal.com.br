# Personagens da Vila Fazenda Pig

Este documento registra a base oficial de personagens colecionaveis da Vila Fazenda Pig.

## Quantidade atual

A base atual possui **200 personagens**.

O card `001` e sempre o **Pig Principal**.

## Separacao conceitual

O Pig Principal, os avatares do usuario e os personagens da Vila Pig nao sao a mesma coisa.

- `001 - Pig Principal`: mascote/guia da marca, professor-amigo e rosto do Cofrinho Real.
- `002` a `011`: avatares base por faixa etaria do usuario.
- `012` em diante: personagens fixos da Vila Pig / Familia Pig, usados no universo narrativo.

O Avatar Pig do usuario deve ser tratado como personalizacao visual opcional, com a pergunta:

> Como voce quer personalizar seu Pig?

Texto de apoio:

> Voce pode mudar isso depois.

As opcoes publicas de avatar sao estilos visuais: Pig Azul, Pig Rosa, Pig Arco-iris e Pig Padrao. Elas nao representam declaracao obrigatoria de identidade pessoal.

Nomes internos planejados:

- `avatar_style: azul`
- `avatar_style: rosa`
- `avatar_style: arco_iris`
- `avatar_style: padrao`

Nao usar publicamente "menino", "menina", "LGBT", "neutro" ou "o que voce e".

Nao criar variacoes por estilo agora. Os personagens `002` a `011` continuam sendo a sequencia de avatares base/padrao por idade, mas ja possuem variacoes planejadas para `padrao`, `azul`, `rosa` e `arco_iris`.

## Imagem oficial criada

- `001` Pig Principal: `assets/characters/001-pig-principal.png`

As imagens antigas de `002` a `010` foram movidas para `assets/characters/_drafts/` e nao contam como assets oficiais.

A ordem inicial oficial e:

- `001` Pig Principal
- `002` Pig Bebe
- `003` Pig Primeirinhos
- `004` Pig Crianca
- `005` Pig Pre-Adolescente
- `006` Pig Adolescente
- `007` Pig Jovem
- `008` Pig Jovem Adulto
- `009` Pig Adulto
- `010` Pig Coroa
- `011` Pig Senior
- `012` Pinguinha
- `013` Mae Helena
- `014` Pai Raimundo
- `015` Bia
- `016` Juninho
- `017` Vovo Zefa
- `018` Vovo Joao
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
- familia principal;
- familia estendida;
- avos dos dois lados;
- escola;
- cantina e eventos escolares;
- comercio local;
- vizinhanca;
- parentes e visitantes;
- relacoes de confianca;
- proposito social futuro;
- comunidade educativa.

## Uso futuro

Os personagens poderao ser usados em:

- app;
- cards colecionaveis;
- jogos educativos futuros;
- videos;
- materiais A4;
- campanhas de familia, escola, comercio e comunidade.

No MVP atual, eles existem apenas como estrutura documental e base de dados estatica.

## Uso no website

O Pig Principal 001 é também a referência visual oficial da marca no website. Ele representa o mascote oficial, o guia visual do Cofrinho Real e a principal referência do universo Pig no protótipo atual. Essa decisão não altera a sequência de personagens nem as regras de avatar.

## Personagem especial 201 - Vantajinho

O Vantajinho e um quati brasileiro esperto, travesso e educativo da Vila Pig. Ele representa impulso, descuido, custo escondido e escolhas mal planejadas de forma leve, sempre como aprendizado.

Regra principal: **No dinheiro real, o Vantajinho so ensina. No PigCoin, ele entra no jogo.**

Ele e o contraponto educativo do Pig. No dinheiro real, ele apenas orienta. No PigCoin, ele pode gerar consequencias ficticias dentro dos jogos educativos.

Dados oficiais:

- numero: 201
- nome: Vantajinho
- slug: vantajinho
- tipo_personagem: personagem_especial
- especie: quati
- universo: vila_pig
- funcao_educativa: contraponto_ao_erro
- status_imagem: criada
- asset_futuro: assets/characters/201-vantajinho.png

## Colecao Pig

A Colecao Pig e a representacao visual em cards dos personagens, avatares e especiais do universo Cofrinho Real. Os cards sao institucionais, educativos e colecionaveis apenas no sentido visual. Nao possuem valor financeiro, nao sao vendidos e nao devem ser tratados como aposta, cassino, loot box ou mecanismo de recompensa financeira.

A pagina estatica `personagens.html` deve ser atualizada sempre que uma imagem oficial de personagem ou avatar for criada.
