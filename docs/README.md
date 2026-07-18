# Documentação do Cofrinho Real

Índice técnico e editorial do protótipo estático Cofrinho Real.

Antes de uma alteração estrutural, leia:

1. `PROMPT_MESTRE.md`
2. `docs/DECISOES_MESTRAS_PROJETO.md`
3. `data/decisoes-projeto.json`
4. Os documentos relacionados ao tema da mudança.

## Estado vigente

- Catálogo compilado: 3.251 personagens.
- Imagem oficial criada após o reset: somente `001 — Pig Principal`.
- Identidades ativas dos avatares `002` a `011`: `azul`, `rosa` e `arco_iris`.
- Variação `padrao`: descontinuada e arquivada.
- Projeto: estático, sem backend, banco real, login real, PIX real, aplicativo real ou movimentação real.

O sistema de quatro variações foi substituído por três identidades visuais: Azul/Masculino, Rosa/Feminino e Arco-íris/Neutro.

Somente o Pig Principal permanece como imagem oficial após o reset.

O Pig Principal é a referência visual obrigatória de toda a nova produção.

## Reset e identidades

- `RESET_VISUAL_TRES_IDENTIDADES.md`: decisão, escopo e resultado do reset.
- `GUIA_IDENTIDADES_AVATARES.md`: regras Azul/Masculino, Rosa/Feminino e Arco-íris/Neutro.
- `REFERENCIA_PIG_PRINCIPAL.md`: uso obrigatório do personagem 001 como referência visual.
- `MIGRACAO_QUATRO_PARA_TRES_AVATARES.md`: migração e compatibilidade histórica.
- `AVATARES.md`: contrato atual dos avatares do usuário.
- `GUIA_VISUAL_PERSONAGENS.md`: linguagem visual dos avatares e personagens fixos.

## Produção e automação de imagens

- `BOOTSTRAP_AUTOMATICO_FASES.md`: geração privada das bases de fase e derivação das identidades.
- `PROTOCOLO_IMAGENS_PERSONAGENS.md`: fluxo automatizado principal e contingência manual.
- `PLANO_IMAGENS_PERSONAGENS_001.md`: planejamento da produção após o reset.
- `FILA_CRIACAO_IMAGENS.md`: origem, ordem e bloqueios da fila.
- `AUTOMACAO_IMAGENS_PERSONAGENS.md`: arquitetura local, segura e retomável.
- `IMPLEMENTACAO_ADAPTADOR_OPENAI_IMAGENS.md`: adaptador real, referências binárias e barreiras.
- `PILOTO_TRES_IDENTIDADES_BEBE.md`: base técnica do bebê e três identidades derivadas.
- `CONFIGURACAO_SEGURA_API_IMAGENS.md`: variáveis, orçamento e ativação futura.
- `examples/image-api.env.example`: exemplo seguro, sem chave e sem autorização.
- `CHECKPOINT_IMPLEMENTACAO_PILOTO_001.md`: estado mensurável e ponto de retorno.
- `GUIA_OPERACAO_FILA_IMAGENS.md`: comandos operacionais e estados.
- `VALIDACAO_AUTOMATICA_IMAGENS.md`: critérios técnicos e visuais.
- `ARMAZENAMENTO_IMAGENS_ESCALA.md`: estratégia para milhares de assets.
- `CUSTO_E_LIMITES_GERACAO_IMAGENS.md`: limites, piloto e controle de custos.

A automação não poderá iniciar geração paga sem autorização explícita de Alamo.

O pipeline automático é o fluxo principal. A criação manual permanece apenas como contingência.

## Português e conteúdo

- `GUIA_PORTUGUES_E_TERMINOLOGIA.md`: padrões editoriais pt-BR.
- `RELATORIO_REVISAO_PTBR_001.md`: resultado da auditoria editorial.
- `REPOSICIONAMENTO_PUBLICO_PIGCOIN.md`: posicionamento público atual.
- `PROTECAO_INFANTOJUVENIL.md`: proteção, segurança e adequação.
- `CONTEUDO_POR_IDADE.md`: faixas e níveis editoriais.
- `JOGOS_EDUCATIVOS.md`: jogos sem aposta, loot box ou pressão de consumo.

## Catálogo e pesquisa cultural

- `CATALOGO_BRASILEIRO_PERSONAGENS.md`: arquitetura e métricas.
- `ARQUITETURA_UNIVERSO_PIG.md`: camadas e identificadores canônicos.
- `FAMILIAS_CATALOGO_COMPLETO.md`: núcleos do catálogo.
- `COBERTURA_REGIONAL_UFS.md`: regiões e UFs.
- `COBERTURA_ETNICO_CULTURAL.md`: slots e bloqueios culturais.
- `COBERTURA_PROFISSOES.md`: profissões atuais e futuras.
- `COBERTURA_FOLCLORE.md`: pesquisa e bloqueios folclóricos.
- `REVISAO_CULTURAL_PERSONAGENS.md`: estados e critérios de publicação.

## Marca e produto

- `IDENTIDADE_VISUAL.md`: identidade da marca e logos oficiais.
- `FAMILIA_PIG.md`: universo futuro da Família Pig.
- `VILA_PIG.md`: conceito da Vila Pig.
- `ASSETS_PERSONAGENS.md`: convenções de assets.
- `EXPERIENCIA_LOGADA.md`: hipótese futura, sem implementação real.
- `DECISOES_MESTRAS_PROJETO.md`: decisões estruturais vigentes.

## Validação recomendada

```powershell
npm test
npm run images:preflight -- --only-phase-base 002 --dry-run --max-cost-usd 0.19 --max-attempts 1 --no-publish --no-push --review-policy human-mandatory
npm run images:generate -- --only-phase-base 002 --resume --dry-run --max-cost-usd 0.19 --max-attempts 1 --no-publish --no-push --review-policy human-mandatory
npm run images:status
```

O primeiro piloto é exclusivamente a base privada 002. O ambiente real, quando autorizado, deve ficar fora do repositório em `C:\Users\alamo\.config\cofrinho-real\image-api.env`.

<!-- CATALOGO_BRASILEIRO_INICIO -->
## Catálogo brasileiro completo

- [Catálogo brasileiro](CATALOGO_BRASILEIRO_PERSONAGENS.md)
- [Cobertura regional](COBERTURA_REGIONAL_UFS.md)
- [Cobertura étnico-cultural](COBERTURA_ETNICO_CULTURAL.md)
- [Cobertura de profissões](COBERTURA_PROFISSOES.md)
- [Cobertura de folclore](COBERTURA_FOLCLORE.md)
- [Famílias do catálogo](FAMILIAS_CATALOGO_COMPLETO.md)
- [Revisão cultural](REVISAO_CULTURAL_PERSONAGENS.md)
- [Fila de imagens](FILA_CRIACAO_IMAGENS.md)
- [Decisões mestras](DECISOES_MESTRAS_PROJETO.md)
<!-- CATALOGO_BRASILEIRO_FIM -->
