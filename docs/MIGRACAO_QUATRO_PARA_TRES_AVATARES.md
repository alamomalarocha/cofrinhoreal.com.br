# Migração de quatro estilos para três identidades

Atualizado em 2026-07-14.

## Antes

O catálogo usava `padrao`, `azul`, `rosa` e `arco_iris`. Esse desenho acumulou ambiguidades entre uma opção neutra padrão e a opção neutra arco-íris.

## Agora

- `azul` → Azul/Masculino.
- `rosa` → Rosa/Feminino.
- `arco_iris` → Arco-íris/Neutro.
- `padrao` → descontinuado e arquivado.

O sistema de quatro variações foi substituído por três identidades visuais: Azul/Masculino, Rosa/Feminino e Arco-íris/Neutro.

## Transformações aplicadas

- Imagens anteriores movidas para `_drafts/reset-visual-tres-identidades-2026-07/`.
- Status de produção reiniciado, preservando apenas o Pig Principal como criado.
- JSON, CSV e fila recompilados com três identidades ativas.
- Filtro e cards da Coleção Pig atualizados.
- Referências públicas a Pig Padrão removidas do fluxo vigente.
- Histórico de `padrao` mantido para auditoria, sem uso operacional.

## Compatibilidade e retorno

Dados antigos não devem ser apagados nem reinterpretados como novos assets. Em caso de rollback, usar a tag `checkpoint-pre-reset-visual-automacao-imagens-2026-07`, nunca copiar rascunhos diretamente para a produção atual.
