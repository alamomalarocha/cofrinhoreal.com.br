# Guia de Português e Terminologia

Este guia define a escrita pública e editorial do Cofrinho Real em português brasileiro (`pt-BR`). Identificadores técnicos continuam sem acentos quando isso for necessário para compatibilidade.

## Princípios

- Escrever de forma clara, acolhedora, objetiva e inclusiva.
- Usar arquivos textuais em UTF-8.
- Preservar nomes próprios, autodenominações, palavras indígenas, expressões regionais e grafias oficiais até haver fonte segura para qualquer alteração.
- Corrigir primeiro as fontes do catálogo e, depois, regenerar os arquivos compilados.
- Nunca alterar slugs, caminhos, URLs, chaves JSON, UIDs, IDs, classes CSS, nomes de funções ou valores internos como `padrao` e `arco_iris` apenas para adicionar acentos.

## Termos oficiais

| Contexto público | Identificador técnico, quando aplicável |
| --- | --- |
| Cofrinho Real | `cofrinho-real` |
| Vila Pig | `vila-pig` |
| Coleção Pig | `colecao-pig` |
| PigCoin | `pigcoin` |
| Pig Principal | `pig-principal` |
| Vantajinho | `vantajinho` |
| Mestre Satochi | `mestre-satochi` |
| Avatar do usuário | `avatar_usuario` |
| Pig Padrão | `padrao` |
| Pig Azul | `azul` |
| Pig Rosa | `rosa` |
| Pig Arco-íris | `arco_iris` |
| Geração | `geracao` |
| Fase da vida | `fase_vida` |
| Região | `regiao` |
| Unidade da Federação | `uf` |
| Profissão | `profissao` |
| Família | `familia` |
| Personagem | `personagem` |
| Imagem pendente | `pendente` |
| Imagem criada | `criada` |
| Fundo transparente | canal alfa real no PNG |

Na interface, usar sempre a forma pública acentuada apresentada na tabela. Os valores técnicos permanecem entre crases e não devem ser exibidos ao usuário quando houver um rótulo editorial correspondente.

## Nomes públicos dos avatares

- `Pig Bebe` deve ser exibido como **Pig Bebê**.
- `Pig Crianca` deve ser exibido como **Pig Criança**.
- `Pig Pre-Adolescente` deve ser exibido como **Pig Pré-Adolescente**.
- `Pig Senior` deve ser exibido como **Pig Sênior**.
- Slugs como `pig-bebe`, `pig-crianca`, `pig-pre-adolescente` e `pig-senior` permanecem inalterados.

## Títulos, labels e ações

- Usar maiúscula apenas no início de frases e em nomes próprios, salvo convenção visual explícita.
- Títulos e labels curtos não recebem ponto final.
- Descrições completas recebem pontuação final.
- Botões devem usar verbos claros, como “Ver personagens” e “Limpar filtros”.
- Perguntas devem terminar com ponto de interrogação.
- Não usar espaço antes de vírgula, ponto, dois-pontos, ponto e vírgula, interrogação ou exclamação.
- Usar um único espaço depois da pontuação.
- Usar **pré-adolescente** e **arco-íris** com hífen.

## Catálogo e busca

- O campo `nome` pode continuar técnico para compatibilidade.
- O campo `nome_exibicao` deve conter a forma pública em pt-BR quando ela diferir do nome técnico.
- A busca pode normalizar acentos internamente, mas deve manter o texto exibido corretamente acentuado.
- Ordenação, filtros e links devem continuar baseados nos identificadores estáveis.

## Conteúdo jurídico e cultural

- Em páginas jurídicas, corrigir apenas linguagem, sem criar promessas, obrigações ou afirmações de conformidade.
- Em nomes culturais, religiosos, indígenas, estrangeiros ou regionais, não adivinhar grafias.
- Dúvidas devem ser registradas como pendência de pesquisa ou revisão jurídica.

## Posicionamento público

O conteúdo público atual permanece centrado em PigCoin educativo, educação, entretenimento, segurança digital, conteúdo por idade e conformidade. Não reintroduzir publicamente conceitos estratégicos reservados.
