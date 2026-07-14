# Validação automática de imagens

Atualizado em 2026-07-14.

## Validação de arquivo

```powershell
node scripts/images/validate-file.mjs --file assets/characters/ARQUIVO.png
```

O validador verifica:

- assinatura e estrutura PNG;
- dimensões e tamanho do arquivo;
- canal alfa real;
- proporção de transparência;
- bordas opacas que indiquem fundo embutido;
- possível checkerboard falso;
- figura vazia ou próxima demais das bordas.

## Validação do item da fila

```powershell
node scripts/images/validate-visual.mjs --asset assets/characters/ARQUIVO.png
```

A validação automática não afirma sozinha que há um único personagem, corpo inteiro, identidade correta ou ausência de texto. Esses pontos exigem revisão humana ou um provedor visual autorizado.

## Remoção local de fundo

```powershell
node scripts/images/remove-background.mjs --input entrada.png --output saida.png --dry-run
```

O resultado só pode substituir o original após inspeção visual. Se o recorte remover orelhas, pés, roupa ou contornos, o arquivo deve ser rejeitado.

## Regra de aprovação

Arquivo válido avança apenas para `aguardando_revisao`. A publicação exige aprovação humana registrada. Checkerboard desenhado, fundo escuro, halo forte, cortes ou elementos proibidos causam rejeição.
