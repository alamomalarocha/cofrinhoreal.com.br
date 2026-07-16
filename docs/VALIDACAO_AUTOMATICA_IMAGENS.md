# Validação automática de imagens

Atualizado em 2026-07-16.

## Pipeline técnico

```powershell
npm run images:remove-background -- --input entrada.png --output recortada.png
npm run images:validate -- --file recortada.png
```

O removedor trabalha localmente sobre um fundo técnico uniforme. Nenhum serviço externo é chamado.

## O que o validador verifica

- assinatura e estrutura PNG;
- dimensões e tamanho do arquivo;
- canal alfa real;
- proporção mínima de transparência;
- bordas opacas que indiquem fundo incorporado;
- resíduos do fundo técnico;
- sombra externa excessiva;
- possível checkerboard falso;
- figura vazia ou próxima demais das bordas;
- hash perceptual para apoiar detecção de duplicatas.

## O que continua humano

A validação automática não decide sozinha:

- se existe exatamente um personagem;
- se corpo, mãos, orelhas e pés estão íntegros;
- se a fase da vida está correta;
- se a identidade Azul, Rosa ou Arco-íris está semanticamente coerente;
- se há texto, símbolo ou elemento cultural inadequado;
- se o recorte preservou o acabamento visual.

Esses pontos exigem revisão humana obrigatória.

## Estados e aprovação

Um arquivo tecnicamente válido avança para `aguardando_revisao`. A aprovação ou rejeição é registrada por `scripts/images/review.mjs`. Somente um arquivo com estado humano `aprovada` pode ser enviado à atualização local do catálogo.

Checkerboard desenhado, fundo escuro, halo forte, corte, sombra de cenário ou elemento proibido causam rejeição.
