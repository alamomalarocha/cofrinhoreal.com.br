# Aferição de idade e responsáveis

Status: conceito de arquitetura; nenhuma aferição real foi implementada.

Separar futuramente: idade declarada, faixa etária, sinal de elegibilidade, idade verificada, nivel de garantia, necessidade de responsável e status legal da conta.

Campos conceituais: `country_of_residence`, `jurisdiction_id`, `birth_date`, `age_band`, `age_verified`, `age_assurance_level`, `guardian_required`, `guardian_verified`, `legal_account_status`, `content_level_allowed`.

## Limites

- Não inferir idade pelo avatar, IP ou estilo visual.
- Não coletar documento, biometria ou data completa sem necessidade demonstrada e base legal.
- Não guardar prova bruta quando um sinal menos invasivo for suficiente.
- Aplicar fluxo e explicação especificos da jurisdição.

A ANPD publicou orientacoes preliminares sobre aferição de idade em 2026; o tema segue sujeito a atualizacoes e revisão: [fonte oficial](https://www.gov.br/anpd/pt-br/assuntos/noticias/anpd-publica-orientacoes-preliminares-e-cronograma-para-afericao-de-idade-no-ambiente-digital).
