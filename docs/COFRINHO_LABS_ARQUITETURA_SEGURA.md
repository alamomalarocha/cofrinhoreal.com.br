# Cofrinho Labs — arquitetura segura do protótipo

## Classificação

`Cofrinho Labs — protótipo público educativo sem backend`

Esta entrega demonstra aprendizagem, edição local de HTML e CSS, progresso de sessão e estruturação de propostas. Não cria conta, perfil, carteira, banco de dados, publicação, votação, chat ou comunicação com serviços externos.

## Divisão oficial de capacidades

> O aplicativo permite viver e acompanhar o Universo Cofrinho Real. O desktop permite construir, desenvolver e administrar esse universo.

O desktop/web concentra Cofrinho Labs, editor, preview, projetos, documentação técnica, propostas, painéis de desenvolvimento, análises e administração avançada. O aplicativo móvel prioriza carteira educativa do Pig Bank, saldo fictício, extrato, notificações, missões, patrimônio, personagens e acompanhamento do universo.

Conta, dados, saldo, patrimônio, regras e histórico poderão ser compartilhados no futuro, mas as duas superfícies não precisam oferecer as mesmas ferramentas.

## Sandbox do editor

- Aceita somente texto de HTML e CSS, limitado a 6.000 caracteres.
- Remove `script`, formulários, frames, embeds, mídia, metadados e estilos inseridos no HTML.
- Remove atributos de eventos, navegação, fontes de mídia e URLs externas.
- Remove construções de CSS capazes de solicitar recursos externos.
- Monta o preview em `iframe` sem permissões no atributo `sandbox`.
- Aplica CSP interna com `default-src 'none'`, sem imagens, formulários, base ou navegação.
- Não executa código no servidor, filesystem, repositório, backend ou API.
- Não persiste o código e não habilita JavaScript de usuário.

O isolamento do navegador é a barreira final mesmo diante de uma variação de entrada que a sanitização não reconheça.

## Aprendizagem e recompensa

Quatro desafios cobrem HTML, CSS, classes e acessibilidade básica. O nível é escolhido explicitamente; nenhum avatar é usado para inferir idade. Toda resposta recebe explicação e uma resposta incorreta não bloqueia permanentemente o editor.

Pontos, progresso, badge e PIG Coins são simulações da sessão. Não alteram carteira, não têm valor monetário, não prometem pagamento e desaparecem ao fechar a página.

## Propostas locais

O rascunho contém título, problema, solução, beneficiários, valor educativo, esboço e cuidados de segurança/acessibilidade. Ele pode ser resumido, copiado ou baixado em JSON pelo próprio navegador. Não existe envio, banco, publicação, compartilhamento ou voto.

## Fluxo futuro de contribuições

1. aprender;
2. criar;
3. enviar ideia ou protótipo;
4. triagem técnica e de segurança;
5. seleção de propostas elegíveis;
6. participação da comunidade;
7. revisão final da equipe;
8. entrada no backlog;
9. desenvolvimento em branch controlada;
10. testes;
11. aprovação;
12. publicação.

Votação não significa aprovação. Código não entra automaticamente em produção. A equipe poderá rejeitar uma proposta por segurança ou inviabilidade e deverá explicar a decisão.

Uma seleção comunitária mensal futura precisará de prevenção a contas múltiplas e fraude, moderação prévia, transparência, decisão técnica final e proibição de comprar votos com PIG Coins ou vantagem financeira.

## Integração futura com Codex

O Codex poderá futuramente atuar como tutor, explicador, revisor, orientador de boas práticas e classificador inicial. Essa integração não existe neste protótipo.

Uma implementação futura exige backend privado, autenticação, rate limiting, moderação, filtros, logs auditáveis, limites de custo e isolamento por sessão. O serviço não receberá permissão de produção, merge, deploy ou acesso direto ao repositório real. Código do usuário nunca poderá ser aplicado automaticamente.

## Proteção infantil

A DEC-018 continua vigente. O protótipo não solicita menor real, nome, perfil ou dados pessoais; não oferece chat, mensagem privada, link livre, upload, competição, ranking, recompensa aleatória ou pressão para continuar.

## Personagens

- Pig Principal: guia das atividades educativas.
- Brasileirinho: explica regras, segurança, direitos autorais, deveres e triagem.
- Vantajinho: poderá aparecer futuramente em alertas sobre cópia sem compreensão, burla ou código malicioso; permanece sem arte oficial.

Nenhuma arte foi gerada ou alterada nesta entrega.
