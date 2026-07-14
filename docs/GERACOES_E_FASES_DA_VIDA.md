# Gerações e Fases da Vida

## Conceitos separados

Geração e uma coorte de nascimento. Fase da vida e o momento atual da pessoa.

Exemplo:

- nascimento: coorte `cohort_2010_2024`;
- fase atual: `fase_crianca`;
- estilo visual: `arco_iris`.

Anos depois, a coorte permanece e a fase muda.

## Gerações

`data/geracoes.json` usa `id_estavel` baseado em anos. Nomes são editaveis porque limites e nomes geracionais não são uma ciencia exata.

- nomes consolidados ou configuraveis cobrem 1928 a 2009;
- Alpha e Beta estao como provisorios;
- nomes posteriores estao reservados;
- a estrutura chega até `cohort_2130_2144`.

O sistema nunca usa geração para inferir personalidade, inteligencia, comportamento ou capacidade financeira.

## Fases da vida

`data/fases-vida.json` preserva os avatares:

- 002: Bebê, 0 a 2;
- 003: Primeirinhos, 3 a 5;
- 004: Criança, 6 a 9;
- 005: Pré-adolescente, 10 a 12;
- 006: Adolescente, 13 a 17;
- 007: Jovem, 18 a 24;
- 008: Jovem Adulto, 25 a 34;
- 009: Adulto, 35 a 49;
- 010: Coroa / Maduro, 50 a 64;
- 011: Sênior, 65 ou mais.

Cada fase inclui linguagem, acessibilidade e orientação de supervisão. Isso não cria login nem coleta de data de nascimento no protótipo atual.

## Fontes de referência

- Pew Research Center, limites geracionais: https://www.pewresearch.org/demographic-definitions/
- Pew Research Center, Millennials e Gen Z: https://www.pewresearch.org/short-reads/2019/01/17/where-millennials-end-and-generation-z-begins/

Os limites adotados são configuração editorial do projeto, não uma afirmacao universal.
