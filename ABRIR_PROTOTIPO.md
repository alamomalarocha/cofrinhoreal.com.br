# Como abrir o prototipo localmente

Este projeto e um prototipo visual estatico.

Nao existe backend, banco de dados, login funcional, PIX real ou publicacao operacional.

## Opcao 1 — Abrir direto pelo arquivo

Esta e a forma mais simples.

1. Abra o Explorador de Arquivos do Windows.
2. Va ate a pasta:

```text
C:\Users\alamo\OneDrive\Documents\cofrinhoreal.com.br 2
```

3. Dê dois cliques no arquivo:

```text
index.html
```

O site deve abrir no navegador padrao.

Se preferir pelo PowerShell:

```powershell
Start-Process "C:\Users\alamo\OneDrive\Documents\cofrinhoreal.com.br 2\index.html"
```

## Opcao 2 — Abrir com servidor local

Use esta opcao se o navegador bloquear algum recurso local ou se quiser simular melhor um site.

No PowerShell, rode:

```powershell
cd "C:\Users\alamo\OneDrive\Documents\cofrinhoreal.com.br 2"
& "C:\Users\alamo\.cache\codex-runtimes\codex-primary-runtime\dependencies\python\python.exe" -m http.server 8000 --bind 127.0.0.1
```

Depois abra no navegador:

```text
http://127.0.0.1:8000/
```

Para parar o servidor, volte ao PowerShell e pressione:

```text
Ctrl + C
```

## Arquivos principais

O prototipo depende principalmente destes arquivos:

- `index.html`
- `styles.css`
- `script.js`
- `assets/favicon.svg`

## Observacao

Se a porta `8000` ja estiver em uso, tente outra porta:

```powershell
& "C:\Users\alamo\.cache\codex-runtimes\codex-primary-runtime\dependencies\python\python.exe" -m http.server 8001 --bind 127.0.0.1
```

E abra:

```text
http://127.0.0.1:8001/
```
