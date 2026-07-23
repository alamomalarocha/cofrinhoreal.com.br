# Fase 1 de Teste

Experiência privada para poucos usuários, isolada e descartável.

## Inclui

Apresentação e regras; perfis de administrador técnico, adulto testador e personagem infantil fictício; carteira, saldo e extrato auditável; créditos concedidos pelo Pig Bank; envio como exercício sem destinatário real; duas atividades educativas; `Terreno Inicial`; administração privada; avisos educativos.

Dados são locais, descartáveis e acessados por repositório substituível, sem acoplamento direto da carteira ao `localStorage`. Não há criança real nem dado sensível. Backend privado é obrigatório antes de usuários externos.

As recompensas usam PIG Coins inteiras, fixas, configuráveis e limitadas. Cada crédito gera evento. Os valores exatos serão decididos com as telas.

O `Terreno Inicial` é concedido pelo Pig Bank a proprietário fictício, tem valor somente em PIG Coins e não é negociável ou transferível. Não possui reforma, imposto, valorização automática ou mercado.

## Não inclui

Blockchain pública, banco, dinheiro real, compra, venda, conversão, P2P infantil, criança real, casa, reforma, título negociável, Cartório Pig completo, mercado, trade, inflação, empresas, mapa amplo ou rede social aberta.

## Pronto para teste quando

Saldo deriva de eventos autorizados e imutáveis; administração registra ator, ação, perfil afetado, motivo, data e hora, correlação e evento de extrato; não há equivalência ou promessa de lucro; dados são removíveis integralmente; regras têm testes e revisão; documentos internos ficam fora de `dist/`.

## Cofrinho Labs — módulo candidato, não aprovado

Versão mínima candidata: aba e página explicativa; dois desafios; lógica por blocos ou HTML/CSS restritos; preview isolado; questões de múltipla escolha; explicações; formulário de ideia; status básico; fila privada e moderação manual. Somente administrador técnico, adulto testador e personagem infantil fictício.

Não inclui colaboração, chat, publicação pública, backend executável, shell, linguagens irrestritas, Git, pull requests, deploy, marketplace, equipes, menores reais, votação pública ampla ou integração automática ao backlog.

Impactos estimados:

- técnico: novo domínio, editor restrito, preview, propostas e moderação;
- prazo: aumento relevante, devendo ficar fora do caminho crítico;
- testes: sandbox, XSS, limites, conteúdo, acessibilidade e estados;
- segurança: execução não confiável e abuso de recursos;
- proteção infantil: moderação, dados mínimos e categorias explícitas;
- dependências: modelo de sandbox, política de conteúdo e capacidade operacional.

Recomendação: opção B, módulo experimental opcional. Se os controles não estiverem prontos, a recomendação passa a ser a opção C. Em ambos os casos, a decisão final é humana e permanece pendente.
