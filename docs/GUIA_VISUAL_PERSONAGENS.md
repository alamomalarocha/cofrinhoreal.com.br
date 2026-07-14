# Guia Visual de Personagens

## Avatares-base do usuário

Padrão obrigatório:

- personagem individual;
- corpo inteiro;
- centralizado;
- pose frontal simples;
- estilo 3D/cartoon premium;
- margem segura em cabeça, orelhas e pes;
- PNG com canal alfa real;
- sem cenário, painel ou checkerboard falso.

Roupa-base:

- camisa;
- short ou calça;
- tênis.

Não usar em avatares-base:

- boné, chapéu, touca, laço, flor ou saia;
- bolsa, brinquedo ou vários objetos;
- moeda, medalha, estrela ou broche;
- letra, número, logo, patch, etiqueta ou texto;
- outro personagem.

## Estilos

- `padrao`: off-white, bege e neutros.
- `azul`: camisa e parte inferior predominantemente azuis.
- `rosa`: camisa e parte inferior predominantemente rosas.
- `arco_iris`: listras fortes em vermelho, laranja, amarelo, verde, azul e roxo; parte inferior neutra.

Os estilos são aparência visual, não identidade sensível.

## Personagens fixos

Personagens da Vila podem ter um ou dois elementos identificadores. A história e o card carregam mais contexto do que a roupa.

Exemplos:

- padeiro: avental e um pao opcional;
- pedreiro: capacete ou uma ferramenta;
- professora: um livro;
- engenheira aeroespacial: tablet sem logo;
- vendedora de comida: uma marmita ou panela, sem caricatura de pobreza.

## Nomenclatura

- principal: `NUMERO-SLUG.png`;
- avatar padrão: `NUMERO-SLUG-padrao.png`;
- avatar azul: `NUMERO-SLUG-azul.png`;
- avatar rosa: `NUMERO-SLUG-rosa.png`;
- avatar arco-íris: `NUMERO-SLUG-arco-iris.png`.

## Checklist de aprovação

1. O arquivo e PNG RGBA.
2. Os quatro cantos possuem alfa transparente.
3. Não existe fundo pintado ou xadrez falso.
4. Corpo, cabeça, orelhas e pes estao completos.
5. Não existe texto, logo ou símbolo indevido.
6. O personagem corresponde a fase e ao estilo solicitados.
7. O arquivo não e duplicata de outra variação.
8. O caminho corresponde ao JSON.

## Entrega antecipada do próximo prompt

Ao receber uma imagem oficial, o Codex deve validar o arquivo e consultar a fila com o asset atual excluído. Antes de salvar, compilar, documentar, commitar ou fazer push, deve enviar a Alamo um único prompt visual puro para a próxima imagem.

Esse prompt deve conter apenas a descrição artística necessária ao ChatGPT Images. Caminhos, JSON, CSV, documentação, commit, push e demais instruções operacionais permanecem no fluxo interno do Codex.

Consulta oficial, somente de leitura:

```text
node scripts/next-image-prompt.mjs --exclude "assets/characters/ITEM-ATUAL.png"
```

Se a imagem recebida falhar na validação, ela não deve ser salva nem marcada como criada, e a fila não deve avançar.

<!-- CATALOGO_BRASILEIRO_INICIO -->
## Catálogo brasileiro compilado

Em 2026-07-12, o catálogo passou a ter 3251 registros fixos, 1430 famílias e cobertura das 27 UFs. As fontes ficam em `data/personagens/`; os arquivos monolíticos são gerados. Perfis culturais sensíveis permanecem não publicáveis até pesquisa e revisão.

Referências: `docs/CATALOGO_BRASILEIRO_PERSONAGENS.md`, `docs/REVISAO_CULTURAL_PERSONAGENS.md` e `data/relatorio-validacao-catalogo.json`.
<!-- CATALOGO_BRASILEIRO_FIM -->
