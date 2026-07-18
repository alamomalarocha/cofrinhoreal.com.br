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

`images:pilot` é sempre `dry-run`, começa pela base privada do Pig Bebê, sem publicação e sem push.

## Piloto automático

O manifesto `data/image-automation/pilot-002-three-identities.json` contém:

1. base técnica privada do Pig Bebê;
2. identidade Azul;
3. identidade Rosa;
4. identidade Arco-íris.

A base é gerada usando o Pig Principal como referência binária. As identidades permanecem bloqueadas até a base atingir o estado `aprovada`.

O checkpoint fica em `data/image-automation/runtime/runner-checkpoint.json` e é persistido depois de cada item planejado.

```powershell
npm run images:pilot
npm run images:auto -- --resume --until-complete --max-cost-usd 0 --max-attempts 3 --pause-ms 1500 --commit-batch-size 25 --review-policy human-mandatory --stop-on-error
```

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

O pré-voo e a simulação exata do primeiro piloto são:

```powershell
npm run images:preflight -- --only-phase-base 002 --dry-run --max-cost-usd 0.19 --max-attempts 1 --no-publish --no-push --review-policy human-mandatory
npm run images:generate -- --only-phase-base 002 --resume --dry-run --max-cost-usd 0.19 --max-attempts 1 --no-publish --no-push --review-policy human-mandatory
```

O ambiente real previsto fica fora do repositório em `C:\Users\alamo\.config\cofrinho-real\image-api.env`. Consulte `CONFIGURACAO_SEGURA_API_IMAGENS.md` para o comando futuro completo. `provider.enabled` permanece `false` na configuração persistente. A ativação é exclusivamente temporária e efêmera, depende do arquivo externo autorizado e de todas as flags obrigatórias, sem habilitar permanentemente nenhuma configuração versionada.

Se `npm` não estiver disponível no terminal, use `scripts/resolve-node.ps1` para localizar Node.js 20 ou superior. O script não instala dependências. Os dry-runs desta implementação foram validados com o executável Node resolvido diretamente porque `npm` não estava disponível no ambiente de validação.
