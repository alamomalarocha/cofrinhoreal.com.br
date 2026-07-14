# Decisões Mestras do Projeto

Atualizado em 2026-07-14. A fonte estruturada correspondente é `data/decisoes-projeto.json`.

## Regras de uso

- Ler este documento antes de qualquer alteracao estrutural.
- Não apagar decisões vigentes; registrar substituicoes explicitamente.
- Não guardar informação confidencial no repositório público.
- Preservar o escopo estático e educativo enquanto não houver nova decisão formal.

## Decisões vigentes

### DEC-001 - Pig Principal como identidade universal pública

O personagem 001 permanece mascote oficial e referência visual antes de qualquer autenticação futura.

Motivo: Preservar consistência de marca sem inferir dados do visitante.

Status: `vigente`. Visibilidade: `publica`.

### DEC-002 - Protótipo visual estático

O projeto continua sem backend, banco real, login funcional, PIX real, aplicativo real ou movimentação financeira.

Motivo: Manter o escopo de pesquisa e demonstração visual.

Status: `vigente`. Visibilidade: `publica`.

### DEC-003 - PigCoin como recurso educativo fictício

PigCoin não e moeda, criptoativo, investimento, compra, saque, PIX ou promessa de valorizacao.

Motivo: Evitar confusão financeira e gamificação predatória.

Status: `vigente`. Visibilidade: `publica`.

### DEC-004 - Estratégia interna não exposta em documentos publicos

Decisões estrategicas reservadas devem permanecer fora do repositório público.

Motivo: Separar documentação operacional pública de informação confidencial.

Status: `vigente`. Visibilidade: `publica`.

### DEC-005 - Avatares não inferem identidade

Estilo visual, cor ou variação de avatar não define gênero, idade, orientação, identidade ou permissão.

Motivo: Manter inclusao e privacidade por padrão.

Status: `vigente`. Visibilidade: `publica`.

### DEC-006 - Perfis culturais sensíveis bloqueados até revisão

Perfis indígenas, tradicionais e folcloricos permanecem não publicáveis e sem imagem enquanto faltarem pesquisa e revisão adequadas.

Motivo: Completude não autoriza inventar nomes, roupas, histórias ou praticas culturais.

Status: `vigente`. Visibilidade: `publica`.

### DEC-007 - Catálogo compilado de fontes segmentadas

Os registros fixos vivem em lotes de no máximo 100 e geram JSON, CSV e lotes publicos deterministicamente.

Motivo: Permitir escala, auditoria e reexecucao sem editar um arquivo monolítico manualmente.

Status: `vigente`. Visibilidade: `publica`.

### DEC-008 - Imagens produzidas uma por vez

O ChatGPT cria a imagem; o Codex valida, anuncia antecipadamente o próximo prompt, salva, registra, commita e pública a imagem recebida.

Motivo: Preservar controle de qualidade e sequencia oficial.

Status: `vigente`. Visibilidade: `publica`.

### DEC-010 - Próximo prompt enviado antes da publicação

Quando uma imagem oficial for recebida, o Codex deve validar o arquivo e enviar o prompt visual puro da próxima imagem antes de iniciar a publicação da imagem atual, permitindo criação e publicação em paralelo.

O prompt visual para o ChatGPT deve ser curto. Instruções de JSON, Git, documentação e publicação não devem ser misturadas ao pedido de criação de imagem.

Motivo: reduzir o tempo ocioso entre uma geração e outra sem comprometer a validação nem a ordem oficial da fila.

Status: `vigente`. Visibilidade: `publica`.

### DEC-009 - Coleção Pig exibe somente perfis publicáveis

A galeria pública consome lotes filtrados e não inclui perfis culturais bloqueados.

Motivo: Impedir publicação acidental de pesquisa incompleta.

Status: `vigente`. Visibilidade: `publica`.

### DEC-011 - Reset visual preserva somente o Pig Principal

Somente o Pig Principal permanece como imagem oficial após o reset.

As 41 imagens anteriores foram arquivadas em `assets/characters/_drafts/reset-visual-tres-identidades-2026-07/`. O ponto de retorno é a tag `checkpoint-pre-reset-visual-automacao-imagens-2026-07`.

Motivo: reconstruir o acervo com consistência sem apagar o histórico.

Status: `vigente`. Visibilidade: `publica`.

### DEC-012 - Três identidades visuais

O sistema de quatro variações foi substituído por três identidades visuais: Azul/Masculino, Rosa/Feminino e Arco-íris/Neutro.

O identificador `padrao` está descontinuado e pode aparecer apenas em registros históricos.

Motivo: eliminar a ambiguidade do antigo estilo padrão e tornar as opções públicas mais claras.

Status: `vigente`. Visibilidade: `publica`.

### DEC-013 - Referência visual obrigatória

O Pig Principal é a referência visual obrigatória de toda a nova produção.

Motivo: garantir unidade de linguagem 3D/cartoon premium sem clonar o personagem 001.

Status: `vigente`. Visibilidade: `publica`.

### DEC-014 - Autorização para geração paga

A automação não poderá iniciar geração paga sem autorização explícita de Alamo.

Provedor e armazenamento permanecem desativados. O piloto atual foi somente `dry-run`, com custo real zero.

Motivo: impedir custos, chamadas externas e publicação remota não autorizados.

Status: `vigente`. Visibilidade: `publica`.

### DEC-015 - Ordem do fluxo manual

No fluxo manual, o próximo prompt deve ser enviado antes da publicação da imagem atual.

Motivo: manter a sequência produtiva sem misturar o pedido visual com a operação técnica.

Status: `vigente`. Visibilidade: `publica`. Substitui a redação operacional da `DEC-010`, preservada como histórico.
