# Protocolo de imagens dos personagens

Atualizado em 2026-07-14.

## Fluxo automatizado principal

O pipeline orquestra geração, remoção de fundo, validação, revisão, salvamento, atualização e retomada. Ele não depende de uma nova referência manual para iniciar cada fase.

O Pig Principal é a única referência visual inicial fornecida manualmente. Cada fase recebe uma base técnica privada gerada pelo pipeline. Azul, Rosa e Arco-íris são derivados dessa mesma base após aprovação humana.

A aprovação humana valida o molde; não transforma o processo em criação manual.

## Ordem automática

1. Gerar a base técnica privada da fase.
2. Remover o fundo e validar.
3. Solicitar aprovação humana da base.
4. Derivar as três identidades da base aprovada.
5. Validar e revisar o conjunto.
6. Liberar os personagens elegíveis.
7. Salvar estado após cada passo.
8. Atualizar catálogo e publicar somente quando autorizado.

O fluxo manual ChatGPT → Alamo → Codex permanece apenas como contingência, sem ser requisito do bootstrap das fases.

## Segurança

- Não inventar arquivos.
- Não marcar como criado antes de o asset aprovado existir.
- Não sobrescrever o Pig Principal nem logos.
- Não publicar perfil cultural bloqueado.
- Não usar imagens em painel ou com múltiplos personagens.
- Não iniciar geração paga automaticamente.
- Não publicar nem catalogar bases técnicas.
- Não gerar identidades independentemente quando existe uma base aprovada.

Consulte `BOOTSTRAP_AUTOMATICO_FASES.md`, `AUTOMACAO_IMAGENS_PERSONAGENS.md` e `GUIA_OPERACAO_FILA_IMAGENS.md`.
