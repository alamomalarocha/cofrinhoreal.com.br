# Arquitetura do Universo Pig

## Principio central

O Pig e o guia. O avatar representa o usuario. A geracao conta quando ele nasceu. A fase da vida mostra o momento atual. A Vila Pig representa o Brasil e suas historias.

As camadas sao relacionadas, mas nao intercambiaveis:

1. Mascote da marca: `001 - Pig Principal`.
2. Avatares do usuario: `002` a `011`.
3. Geracoes: coortes configuraveis por ano de nascimento.
4. Fases da vida: calculadas pela idade atual.
5. Personagens fixos da Vila Pig.
6. Familias e comunidades.
7. Regioes, UFs, territorios e biomas.
8. Origens culturais e historias migratorias.
9. Profissoes historicas, atuais, emergentes e futuras.
10. Folclore, cultura e natureza.
11. Especiais educativos, incluindo `201 - Vantajinho`.
12. Colecao Pig e seus cards.

## Identificadores

- `numero`: numero legado preservado.
- `numero_legacy`: copia explicita do numero historico.
- `uid`: identificador canonico estavel, como `MAS-001`, `AVA-002` ou `ESP-201`.
- `card_code`: codigo de exibicao do card.
- `slug`: nome amigavel para URLs e busca.

Variacoes de avatar usam UIDs proprios, como `AVA-002-PAD`, sem substituir o registro principal.

## Compatibilidade

`data/vila-pig-personagens.json` continua sendo a fonte principal dos cards. Campos antigos foram mantidos e novos campos foram adicionados. O CSV continua espelhando os 201 personagens.

Nenhum numero, slug ou caminho de asset existente foi renomeado nesta reorganizacao.

## Protecoes permanentes

- `001 - Pig Principal` permanece mascote e guia oficial.
- `201 - Vantajinho` permanece contraponto educativo, sem ensinar fraude.
- Mestre Satochi permanece conceito ficticio futuro, sem vinculo com pessoa real.
- PigCoin permanece ficticio, educativo e sem valor financeiro.
- Nao ha aposta, loot box, raridade financeira ou promessa de lucro.

## Arquivos estruturais

Os catalogos ficam em `data/`, os contratos em `schemas/`, a validacao em `scripts/validate-universo-pig.mjs` e a governanca desta arquitetura em `docs/`.

<!-- CATALOGO_BRASILEIRO_INICIO -->
## Catalogo brasileiro compilado

Em 2026-07-12, o catalogo passou a ter 3251 registros fixos, 1430 familias e cobertura das 27 UFs. As fontes ficam em `data/personagens/`; os arquivos monoliticos sao gerados. Perfis culturais sensiveis permanecem nao publicaveis ate pesquisa e revisao.

Referencias: `docs/CATALOGO_BRASILEIRO_PERSONAGENS.md`, `docs/REVISAO_CULTURAL_PERSONAGENS.md` e `data/relatorio-validacao-catalogo.json`.
<!-- CATALOGO_BRASILEIRO_FIM -->
