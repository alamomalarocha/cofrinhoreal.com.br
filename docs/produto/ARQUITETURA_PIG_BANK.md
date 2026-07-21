# Arquitetura do Pig Bank

Proposta conceitual, sem escolha de fornecedor.

Camadas: experiência; casos de uso e permissões; domínio; persistência isolada e substituível; administração e auditoria.

Entidades iniciais: `Profile`, `Wallet`, `LedgerEvent`, `Activity`, `Asset`, `TitleHistory` e `AdminAction`.

Invariantes: saldo deriva do livro de eventos; evento publicado é imutável; crédito infantil vem do Pig Bank; envio infantil é cenário simulado sem destinatário real; valores são PIG Coins inteiras; patrimônio e Cartório Pig são fictícios e sem validade jurídica.

Segurança futura: autorização no servidor, validação, idempotência, limite de recompensas, auditoria administrativa, minimização de dados, ambientes separados e prevenção de saldo negativo.
