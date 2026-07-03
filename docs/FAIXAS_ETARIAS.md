# Faixas Etarias

O Cofrinho Real cresce junto com o usuario.

## Fases

- Pig Bebe: 0 a 2 anos.
- Pig Primeirinhos: 3 a 5 anos.
- Pig Crianca: 6 a 9 anos.
- Pig Pre-Adolescente: 10 a 12 anos.
- Pig Adolescente: 13 a 17 anos.
- Pig Jovem: 18 a 24 anos.
- Pig Jovem Adulto: 25 a 34 anos.
- Pig Adulto: 35 a 49 anos.
- Pig Coroa: 50 a 64 anos.
- Pig Senior / Vovo / Vovo: 65+.

## Regra visual

Cada fase pode mudar interface, linguagem, cores, roupas e expressoes do Pig.

Mas tudo deve continuar parecendo Cofrinho Real.

## Regra de produto

Cada idade deve receber liberdade, informacao e controle adequados ao seu momento de vida.

## Relacao com a Familia Pig

A Familia Pig pode representar fases e relacoes diferentes:

- Pig Crianca.
- Pig Adolescente.
- Pig Adulto.
- Pig Vovó.
- Pig Vovô.
- Pig Familia.
- Pig Comerciante.

Essas variacoes devem ser criadas por fases, sem sobrecarregar o MVP.

Documento principal: `docs/FAMILIA_PIG.md`.

Documento especifico de avatares: `docs/AVATARES.md`.

## Opcoes publicas de avatar

As opcoes de avatar sao estilos visuais: Pig Azul, Pig Rosa, Pig Arco-iris e Pig Padrao. Elas nao representam declaracao obrigatoria de identidade pessoal.

Pergunta oficial no onboarding:

> Como voce quer personalizar seu Pig?

Texto de apoio:

> Voce pode mudar isso depois.

Opcoes publicas:

1. **Pig Azul**: estilo azul, calmo, classico e amigavel.
2. **Pig Rosa**: estilo rosa, doce, afetivo e carinhoso.
3. **Pig Arco-iris**: estilo colorido, livre e inclusivo.
4. **Pig Padrao**: visual padrao do Cofrinho Real, para quem prefere nao escolher ou nao informar.

Regras publicas:

- nao usar publicamente "menino";
- nao usar publicamente "menina";
- nao usar publicamente "LGBT";
- nao usar publicamente "neutro";
- nao perguntar "o que voce e";
- nao coletar informacao sensivel;
- nao transformar escolha visual em declaracao de identidade pessoal;
- tratar tudo como personalizacao visual do avatar.

Nomes internos:

- `avatar_style: azul`
- `avatar_style: rosa`
- `avatar_style: arco_iris`
- `avatar_style: padrao`

Esses valores representam apenas estilo visual.

## Variacoes futuras por idade

Cada faixa etaria de avatar podera futuramente receber as variacoes `padrao`, `azul`, `rosa` e `arco_iris`.

Exemplo futuro:

```text
assets/characters/004-pig-crianca-padrao.png
assets/characters/004-pig-crianca-azul.png
assets/characters/004-pig-crianca-rosa.png
assets/characters/004-pig-crianca-arco-iris.png
```

Nao criar essas imagens agora.
