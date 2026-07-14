# Protocolo de imagens dos personagens

Atualizado em 2026-07-14.

## Responsabilidades

- O ChatGPT Images cria a imagem quando Alamo solicitar.
- Alamo revisa e envia a imagem aprovada ao Codex.
- O Codex não cria a imagem no fluxo manual: valida, salva, atualiza dados e documentação, faz commit e push quando autorizado.

## Ordem obrigatória

1. Consultar o próximo item elegível na fila.
2. Entregar a Alamo somente o prompt visual puro, curto e sem instruções técnicas.
3. Receber a imagem e o prompt técnico separadamente.
4. Validar número, nome, slug, identidade, caminho, PNG e transparência.
5. Inspecionar um personagem, corpo inteiro, enquadramento e elementos proibidos.
6. Rejeitar qualquer arquivo fora do padrão antes de alterar o catálogo.
7. Salvar no caminho canônico.
8. Atualizar JSON, CSV, fila, documentação e Coleção Pig.
9. Executar validações do projeto.
10. Fazer commit e push autorizados.

No fluxo manual, o próximo prompt deve ser enviado antes da publicação da imagem atual.

## Prompt visual

O prompt visual contém apenas personagem, fase da vida, identidade, roupa, pose, estilo e fundo transparente. Não contém caminho, JSON, CSV, documentação, commit, push, backend ou instruções operacionais.

## Prompt técnico

O prompt técnico identifica número, nome, slug, identidade, arquivo, dados a atualizar e mensagem do commit. Ele é usado somente depois que a imagem existir.

## Segurança

- Não inventar arquivos.
- Não marcar como criado antes de o asset aprovado existir.
- Não sobrescrever o Pig Principal nem logos.
- Não publicar perfil cultural bloqueado.
- Não usar imagens em painel ou com múltiplos personagens.
- Não iniciar geração paga automaticamente.

Consulte `AUTOMACAO_IMAGENS_PERSONAGENS.md` e `GUIA_OPERACAO_FILA_IMAGENS.md`.
