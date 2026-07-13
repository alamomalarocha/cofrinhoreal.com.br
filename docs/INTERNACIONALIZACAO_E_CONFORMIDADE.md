# Internacionalizacao e conformidade

Status: pesquisa interna, sujeita a revisao juridica. Ultima consulta: 2026-07-12.

O Cofrinho Real continua um prototipo estatico. A arquitetura separa idioma, pais, jurisdicao, classificacao local, nivel editorial e permissoes. Nenhum pais esta habilitado para contas reais.

## Principios

- Nao existe idade universal para consentimento, conta independente ou supervisao.
- Uma regra so pode sair de `research_only` com fonte oficial vigente e revisao profissional.
- Campos incertos permanecem `null`; recursos reais permanecem desabilitados.
- Pais, idioma, fuso, formato de data, acessibilidade e documentos legais sao configuracoes separadas.

## Estrutura

- `data/compliance/jurisdictions/`: perfis de pesquisa por jurisdicao.
- `locales/`: esqueletos de traducao, nao traducoes aprovadas.
- `legal/`: rascunhos versionados, sem vigencia.
- `schemas/`: contratos de dados para validacao futura.

## Fontes iniciais

- Brasil: [LGPD](https://www.planalto.gov.br/ccivil_03/_ato2015-2018/2018/lei/l13709compilado.htm), [ECA Digital](https://www.planalto.gov.br/ccivil_03/_ato2023-2026/2025/lei/l15211.htm), [ANPD](https://www.gov.br/anpd/pt-br/assuntos/eca-digital).
- Estados Unidos: [COPPA](https://www.ftc.gov/legal-library/browse/rules/childrens-online-privacy-protection-rule-coppa).
- Uniao Europeia: [GDPR](https://eur-lex.europa.eu/eli/reg/2016/679/oj), [Digital Services Act](https://eur-lex.europa.eu/legal-content/EN/TXT/?uri=CELEX%3A32022R2065).

Pesquisa tecnica nao equivale a parecer juridico.
