# Afericao de idade e responsaveis

Status: conceito de arquitetura; nenhuma afericao real foi implementada.

Separar futuramente: idade declarada, faixa etaria, sinal de elegibilidade, idade verificada, nivel de garantia, necessidade de responsavel e status legal da conta.

Campos conceituais: `country_of_residence`, `jurisdiction_id`, `birth_date`, `age_band`, `age_verified`, `age_assurance_level`, `guardian_required`, `guardian_verified`, `legal_account_status`, `content_level_allowed`.

## Limites

- Nao inferir idade pelo avatar, IP ou estilo visual.
- Nao coletar documento, biometria ou data completa sem necessidade demonstrada e base legal.
- Nao guardar prova bruta quando um sinal menos invasivo for suficiente.
- Aplicar fluxo e explicacao especificos da jurisdicao.

A ANPD publicou orientacoes preliminares sobre afericao de idade em 2026; o tema segue sujeito a atualizacoes e revisao: [fonte oficial](https://www.gov.br/anpd/pt-br/assuntos/noticias/anpd-publica-orientacoes-preliminares-e-cronograma-para-afericao-de-idade-no-ambiente-digital).
