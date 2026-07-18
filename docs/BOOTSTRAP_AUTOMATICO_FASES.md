# Bootstrap automático das fases de vida

Atualizado em 2026-07-16.

## Decisão vigente

O pipeline não depende de uma nova imagem criada manualmente para iniciar cada fase da vida. O Pig Principal é a única referência visual inicial fornecida manualmente:

`assets/characters/001-pig-principal.png`

O arquivo é enviado ao provedor como entrada binária. Apenas citar seu caminho no prompt não conta como referência visual.

## Sequência por fase

1. Gerar uma base técnica privada da fase usando o Pig Principal.
2. Remover o fundo técnico.
3. Validar PNG, transparência, margens e sinais objetivos.
4. Aguardar aprovação humana da base.
5. Derivar Azul, Rosa e Arco-íris por edição da mesma base aprovada.
6. Revisar o conjunto derivado.
7. Liberar os personagens simples da fase conforme a política de revisão.

As bases ficam em `data/image-automation/phase-bases/`. Elas não recebem número de personagem, não entram na Coleção Pig e não são publicadas.

## Pose global

### Bebê

- em pé, na fase de primeiros passos;
- corpo inteiro e pernas visíveis;
- braços relaxados, com mãos e pés completamente visíveis;
- orelhas levemente baixas;
- câmera frontal e expressão acolhedora.

### Primeirinhos até Sênior

- em pé, frontal e de corpo inteiro;
- pés paralelos;
- braços relaxados ao lado do corpo;
- mãos abertas ou naturalmente relaxadas;
- orelhas levemente baixas;
- câmera, enquadramento, iluminação e tamanho relativo consistentes.

Mãos nos bolsos não fazem parte da pose oficial. Quando um personagem precisar de um objeto, uma mão pode segurar no máximo um objeto e a outra permanece relaxada. Cada personagem pode ter no máximo dois marcadores visuais.

## Derivação das identidades

Azul, Rosa e Arco-íris são edições da mesma base técnica aprovada. Devem preservar anatomia, rosto, focinho, olhos, orelhas, corpo, pose, câmera, enquadramento, iluminação, tamanho e posição de mãos e pés.

Podem variar somente roupa, cores, traços discretos de apresentação e cabelo ou topete quando necessário.

## Proteções visuais

O prompt proíbe miniatura da referência, comparação, painel, imagem dentro da imagem, personagem adicional, texto, logo, moeda e cenário. A referência binária serve para orientar a geração e nunca deve aparecer dentro do resultado.

## Retomada

O runner usa `data/image-automation/runtime/runner-checkpoint.json`, ignorado pelo Git. O checkpoint é persistido de forma atômica após cada passo e mantém o asset atual, passo atual, passos concluídos, tentativas e hash do prompt.

Com `--resume`, o pipeline retoma o passo incompleto sem reiniciar nem duplicar assets.

## Segurança atual

- provedor desabilitado;
- modo `dry-run`;
- orçamento padrão zero;
- nenhuma geração paga autorizada;
- nenhuma base real gerada;
- nenhuma imagem publicada;
- nenhum status de personagem alterado.

## Piloto isolado da fase bebê

Antes de automatizar outras fases, somente a base privada 002 pode ser selecionada com `--only-phase-base 002`. O pré-voo aborta seleção múltipla, base já existente, referência ausente, Git sujo, arquivo `STOP`, revisão diferente de `human-mandatory`, publicação ou push habilitados e orçamento inválido.

Uma geração futura não libera automaticamente as identidades. A base deve passar por remoção local do fundo, validação RGBA e revisão humana antes de qualquer próxima decisão.
