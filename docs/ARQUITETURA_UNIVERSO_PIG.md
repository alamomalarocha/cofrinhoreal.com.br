# Arquitetura do Universo Pig

## Principio central

O Pig e o guia. O avatar representa o usuário. A geração conta quando ele nasceu. A fase da vida mostra o momento atual. A Vila Pig representa o Brasil e suas histórias.

As camadas são relacionadas, mas não intercambiaveis:

1. Mascote da marca: `001 - Pig Principal`.
2. Avatares do usuário: `002` a `011`.
3. Gerações: coortes configuraveis por ano de nascimento.
4. Fases da vida: calculadas pela idade atual.
5. Personagens fixos da Vila Pig.
6. Famílias e comunidades.
7. Regiões, UFs, territórios e biomas.
8. Origens culturais e histórias migratorias.
9. Profissões historicas, atuais, emergentes e futuras.
10. Folclore, cultura e natureza.
11. Especiais educativos, incluindo `201 - Vantajinho`.
12. Coleção Pig e seus cards.

## Identificadores

- `numero`: número legado preservado.
- `numero_legacy`: copia explicita do número histórico.
- `uid`: identificador canônico estavel, como `MAS-001`, `AVA-002` ou `ESP-201`.
- `card_code`: código de exibicao do card.
- `slug`: nome amigavel para URLs e busca.

Variações de avatar usam UIDs proprios, como `AVA-002-PAD`, sem substituir o registro principal.

## Compatibilidade

`data/vila-pig-personagens.json` continua sendo a fonte principal dos cards. Campos antigos foram mantidos e novos campos foram adicionados. O CSV continua espelhando os 201 personagens.

Nenhum número, slug ou caminho de asset existente foi renomeado nesta reorganizacao.

## Protecoes permanentes

- `001 - Pig Principal` permanece mascote e guia oficial.
- `201 - Vantajinho` permanece contraponto educativo, sem ensinar fraude.
- Mestre Satochi permanece conceito fictício futuro, sem vínculo com pessoa real.
- PigCoin permanece fictício, educativo e sem valor financeiro.
- Não há aposta, loot box, raridade financeira ou promessa de lucro.

## Arquivos estruturais

Os catalogos ficam em `data/`, os contratos em `schemas/`, a validação em `scripts/validate-universo-pig.mjs` e a governanca desta arquitetura em `docs/`.

<!-- CATALOGO_BRASILEIRO_INICIO -->
## Catálogo brasileiro compilado

Em 2026-07-12, o catálogo passou a ter 3251 registros fixos, 1430 famílias e cobertura das 27 UFs. As fontes ficam em `data/personagens/`; os arquivos monolíticos são gerados. Perfis culturais sensíveis permanecem não publicáveis até pesquisa e revisão.

Referências: `docs/CATALOGO_BRASILEIRO_PERSONAGENS.md`, `docs/REVISAO_CULTURAL_PERSONAGENS.md` e `data/relatorio-validacao-catalogo.json`.
<!-- CATALOGO_BRASILEIRO_FIM -->
