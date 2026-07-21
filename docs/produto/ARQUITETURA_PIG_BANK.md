# Arquitetura do Pig Bank

Proposta conceitual, sem escolha de fornecedor.

Camadas: experiência; casos de uso e permissões; domínio; interface de repositório; persistência local descartável; administração e auditoria. A carteira não se acopla ao `localStorage` nem a fornecedor específico. Backend privado será obrigatório antes de usuários externos.

Entidades iniciais: `Profile`, `Wallet`, `LedgerEvent`, `Activity`, `Asset`, `TitleHistory` e `AdminAction`.

Invariantes: saldo deriva do livro de eventos; evento publicado é imutável; crédito infantil vem do Pig Bank; envio infantil é cenário simulado sem destinatário real; valores são PIG Coins inteiras; o `Terreno Inicial` é concedido, não negociável e não transferível; patrimônio e Cartório Pig são fictícios e sem validade jurídica.

Perfis iniciais: administrador técnico, adulto testador e personagem infantil fictício. Idade e permissão nunca são inferidas pelo avatar. Não há dados de menores reais.

Toda ação administrativa registra ator, ação, perfil afetado, motivo, data e hora, identificador de correlação e evento no extrato. Alteração direta de saldo sem evento é proibida.

Ao encerrar o piloto, apagar perfis, carteiras, eventos individualizados, patrimônios e sessões. Somente métricas anônimas previamente autorizadas podem permanecer.
