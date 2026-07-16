# Guia de operação da fila de imagens

Atualizado em 2026-07-16.

## Preparação local

O projeto requer Node.js 20 ou superior. No Windows, o resolvedor local pode ser consultado sem alterar o ambiente:

```powershell
.\scripts\resolve-node.ps1
```

As dependências declaradas em `package.json` não devem ser consideradas instaladas até a execução local de `npm install`.

## Consultar e testar sem custo

```powershell
npm test
npm run images:status
npm run images:estimate-cost -- --max-attempts 1
npm run images:pilot
```

`images:pilot` é sempre `dry-run`, limitado a três itens, sem publicação e sem push.

## Piloto fixo

O manifesto `data/image-automation/pilot-002-three-identities.json` contém apenas:

1. `002-pig-bebe-azul.png`
2. `002-pig-bebe-rosa.png`
3. `002-pig-bebe-arco-iris.png`

O piloto pago não pode começar enquanto `assets/references/reference-manifest.json` indicar ausência da referência aprovada da fase bebê.

## Remoção de fundo e validação

```powershell
npm run images:remove-background -- --input entrada.png --output saida.png
npm run images:validate -- --file saida.png
```

Os arquivos de trabalho ficam em `data/image-automation/tmp/image-pilot-review/`, que é ignorado pelo Git.

## Revisão humana

```powershell
npm run images:review -- list
npm run images:review -- show --asset assets/characters/ARQUIVO.png
npm run images:review -- approve --asset assets/characters/ARQUIVO.png --reviewer "Alamo" --reason "Aprovado visualmente"
npm run images:review -- reject --asset assets/characters/ARQUIVO.png --reviewer "Alamo" --reason "Motivo da rejeição"
```

Nenhum arquivo avança ao catálogo sem aprovação humana registrada.

## Catálogo e publicação local

```powershell
npm run images:update-catalog -- --asset assets/characters/ARQUIVO.png --apply --authorize-catalog-update
npm run images:publish -- --asset assets/characters/ARQUIVO.png --mode local-review
```

`images:update-catalog` exige um arquivo aprovado. A publicação remota não está disponível.

## Parada de emergência

```powershell
npm run images:stop
npm run images:stop -- --clear
```

## Execução paga futura

O comando real vive em `scripts/images/generate.mjs`, mas não deve ser executado sem autorização explícita. Além da autorização humana, todas as travas documentadas em `CONFIGURACAO_SEGURA_API_IMAGENS.md` precisam estar satisfeitas.

O adaptador usa edição de imagem com referências binárias. Escrever um caminho no prompt não anexa uma referência.
