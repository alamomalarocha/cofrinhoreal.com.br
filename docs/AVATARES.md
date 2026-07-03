# Avatares do Usuario

Os avatares do usuario nao sao personagens fixos da historia.

Eles representam a conta da pessoa dentro do app e poderao ser personalizados visualmente no futuro.

## Separacao essencial

O Cofrinho Real separa oficialmente tres conceitos:

- **Pig Principal**: mascote oficial, guia, comunicador, professor-amigo, personagem da logo e referencia visual da marca.
- **Avatar Pig do usuario**: representacao visual escolhida pela pessoa dentro do app.
- **Vila Pig / Familia Pig**: universo de personagens fixos, historias, familia, escola, comercio e comunidade.

Frase de referencia:

> O Pig Principal e o mascote/guia da marca. O Avatar Pig do usuario e a representacao visual da pessoa dentro do app. A Vila Pig e o universo de personagens e historias.

## Pig Principal

O Pig Principal e o mascote oficial da marca Cofrinho Real.

Ele e:

- guia;
- comunicador;
- professor-amigo;
- rosto da marca;
- personagem da logo;
- personagem que orienta o projeto.

Ele nao representa uma pessoa especifica e nao e avatar de usuario.

O Pig Principal continua sendo:

```text
001 - Pig Principal
assets/characters/001-pig-principal.png
```

## Avatar Pig do usuario

O Avatar Pig do usuario e a representacao visual da pessoa dentro do app.

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

## Avatares por faixa etaria

Os personagens `002` a `011` representam as faixas etarias base do avatar do usuario.

Esses assets sao versoes base/padrao por idade:

1. **Pig Bebe**: 0 a 2 anos. Conta administrada por responsaveis.
2. **Pig Primeirinhos**: 3 a 5 anos. Primeiras cores, numeros e vinculo com o cofrinho.
3. **Pig Crianca**: 6 a 9 anos. Moedas, pequenos valores, metas simples e jogos educativos.
4. **Pig Pre-Adolescente**: 10 a 12 anos. Primeiras escolhas, autonomia e responsabilidade.
5. **Pig Adolescente**: 13 a 17 anos. Consumo consciente, metas maiores, PigCoins e juros ficticios.
6. **Pig Jovem**: 18 a 24 anos. Faculdade, trabalho e metas pessoais.
7. **Pig Jovem Adulto**: 25 a 34 anos. Vida independente e controle pessoal.
8. **Pig Adulto**: 35 a 49 anos. Familia, filhos, trabalho e envio de Pig.
9. **Pig Coroa**: 50 a 64 anos. Experiencia e apoio a familia.
10. **Pig Senior**: 65+. Netos, carinho, legado e participacao familiar.

No futuro, cada faixa etaria podera ter variacoes visuais:

- padrao;
- azul;
- rosa;
- arco_iris.

Exemplo futuro:

```text
assets/characters/004-pig-crianca-padrao.png
assets/characters/004-pig-crianca-azul.png
assets/characters/004-pig-crianca-rosa.png
assets/characters/004-pig-crianca-arco-iris.png
```

Criar essas variacoes apenas pelo fluxo guiado, uma imagem por vez, com aceite visual antes de salvar.

## Vila Pig e personagens fixos

Os personagens da Vila Pig / Familia Pig sao diferentes do Avatar Pig do usuario.

Eles sao personagens fixos do universo narrativo, como:

- Pinguinha;
- Vovo Zefa;
- Vovo Joao;
- Mae Helena;
- Seu Damiao;
- Tia Carmem;
- amigos, vizinhos, comerciantes, escola e comunidade.

## Estado atual da fase de imagens

Neste momento, apenas `001 - Pig Principal` esta oficializado como imagem criada.

Os avatares `002` a `011` continuam como sequencia base/padrao por faixa etaria, mas suas imagens serao recriadas uma por uma com o conceito correto.

As imagens antigas de `002` a `010` foram preservadas como rascunhos em `assets/characters/_drafts/` e nao devem ser tratadas como assets oficiais.

## Regra visual

Avatares devem ser afetuosos, modernos e respeitosos. Nunca devem virar caricatura, ranking social, mecanismo de vicio ou incentivo a consumo compulsivo.

## Avatar style na experiência logada

A escolha de avatar style pertence à experiência logada futura. Antes do login, o site/app usa a identidade padrão do Pig Principal, neutra e universal.

Depois do login, o usuário poderá ver seu próprio universo Pig personalizado conforme tipo de conta, faixa etária e estilo visual escolhido.

Regra de referência:

> O público geral vê o Pig Principal neutro. O usuário logado vê o seu próprio universo Pig personalizado.

A pergunta pública continua sendo:

> Como você quer personalizar seu Pig?

Essa pergunta deve tratar a escolha como estilo visual, sem coletar informação sensível e sem usar publicamente termos como "menino", "menina", "LGBT" ou "neutro".

## Regra visual para imagens-base de avatares

Avatares do usuario devem ser imagens limpas do personagem, sem texto, letras, numeros, moedas, medalhas, placas, etiquetas, broches, patches, logotipos, monogramas ou simbolos escritos.

A imagem-base do avatar deve mostrar apenas o personagem. Moedas, PigCoins, simbolos e textos podem aparecer em telas, cards, jogos e pecas de interface, mas nao na imagem-base do avatar.

Se a geracao vier com texto, letra, numero, logotipo, simbolo indevido, moeda com letra, roupa com palavra, fundo nao transparente, cenario, painel ou outro personagem, a imagem deve ser descartada. Nao tentar corrigir a imagem antiga; gerar nova imagem do zero com prompt simplificado.

Checklist minimo para aceitar uma imagem de avatar:

- personagem unico;
- corpo inteiro;
- centralizado;
- fundo transparente;
- sem texto;
- sem letras;
- sem numeros;
- sem logos;
- sem moedas;
- sem medalhas;
- sem simbolos escritos;
- sem cenario;
- sem painel;
- sem outros personagens.
