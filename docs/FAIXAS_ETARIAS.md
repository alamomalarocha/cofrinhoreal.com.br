# Faixas Etarias

O Cofrinho Real cresce junto com o usuário.

## Fases

- Pig Bebê: 0 a 2 anos.
- Pig Primeirinhos: 3 a 5 anos.
- Pig Criança: 6 a 9 anos.
- Pig Pré-adolescente: 10 a 12 anos.
- Pig Adolescente: 13 a 17 anos.
- Pig Jovem: 18 a 24 anos.
- Pig Jovem Adulto: 25 a 34 anos.
- Pig Adulto: 35 a 49 anos.
- Pig Coroa: 50 a 64 anos.
- Pig Sênior / Vovo / Vovo: 65+.

## Regra visual

Cada fase pode mudar interface, linguagem, cores, roupas e expressoes do Pig.

Mas tudo deve continuar parecendo Cofrinho Real.

## Regra de produto

Cada idade deve receber liberdade, informação e controle adequados ao seu momento de vida.

## Relação com a Família Pig

A Família Pig pode representar fases e relações diferentes:

- Pig Criança.
- Pig Adolescente.
- Pig Adulto.
- Pig Vovó.
- Pig Vovô.
- Pig Família.
- Pig Comerciante.

Essas variações devem ser criadas por fases, sem sobrecarregar o MVP.

Documento principal: `docs/FAMILIA_PIG.md`.

Documento especifico de avatares: `docs/AVATARES.md`.

## Opções publicas de avatar

As opções de avatar são estilos visuais: Pig Azul, Pig Rosa, Pig Arco-íris e Pig Padrão. Elas não representam declaracao obrigatória de identidade pessoal.

Pergunta oficial no onboarding:

> Como voce quer personalizar seu Pig?

Texto de apoio:

> Voce pode mudar isso depois.

Opções publicas:

1. **Pig Azul**: estilo azul, calmo, classico e amigavel.
2. **Pig Rosa**: estilo rosa, doce, afetivo e carinhoso.
3. **Pig Arco-íris**: estilo colorido, livre e inclusivo.
4. **Pig Padrão**: visual padrão do Cofrinho Real, para quem prefere não escolher ou não informar.

Regras publicas:

- não usar publicamente "menino";
- não usar publicamente "menina";
- não usar publicamente "LGBT";
- não usar publicamente "neutro";
- não perguntar "o que voce e";
- não coletar informação sensível;
- não transformar escolha visual em declaracao de identidade pessoal;
- tratar tudo como personalização visual do avatar.

Nomes internos:

- `avatar_style: azul`
- `avatar_style: rosa`
- `avatar_style: arco_iris`
- `avatar_style: padrao`

Esses valores representam apenas estilo visual.

## Variações futuras por idade

Cada faixa etária de avatar poderá futuramente receber as variações `padrao`, `azul`, `rosa` e `arco_iris`.

Exemplo futuro:

```text
assets/characters/004-pig-crianca-padrao.png
assets/characters/004-pig-crianca-azul.png
assets/characters/004-pig-crianca-rosa.png
assets/characters/004-pig-crianca-arco-iris.png
```

Não criar essas imagens agora.

## Documento de compatibilidade

Este documento preserva a nomenclatura historica. A fonte estruturada atual das fases e `data/fases-vida.json`, documentada em `GERACOES_E_FASES_DA_VIDA.md`.

Faixa etária e fase da vida não substituem geração. A fase muda com a idade; a coorte de nascimento permanece.
