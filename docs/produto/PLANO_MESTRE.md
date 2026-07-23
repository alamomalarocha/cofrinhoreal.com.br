# Plano Mestre Vivo do Cofrinho Real

Atualizado em 2026-07-23. Fonte operacional principal; decisões numeradas permanecem em `../DECISOES_MESTRAS_PROJETO.md`.

## Estado e fase

- Público: protótipo estático preservado; qualquer novo deployment exige autorização deliberada.
- Planejamento: Pig Bank educativo, Fase 1 privada.
- Objetivo: fechar documentação, arquitetura, riscos e backlog antes de implementar.
- Concluído: site institucional, proteção de `dist/`, PIG Coin educativa e DEC-018 preservada.
- Concluído: PRs #5 e #6, Worker defensivo e correção da rota ampla `data/*` para `data/image-automation/*`.
- Em andamento: publicação desta documentação aprovada no GitHub, sem deployment do site.
- Bloqueio remanescente: chamado Cloudflare `#02245419` permanece aberto para o cache interno histórico do Pages. O bloqueio não impede push ou PR documental, mas impede declarar o cache eliminado.
- Decisões aprovadas: persistência local descartável por interface substituível; três perfis de teste; administração auditável; duas atividades; Terreno Inicial; piloto interno; remoção integral.
- Direção futura aprovada: desktop como plataforma técnica de construção e gestão; aplicativo como experiência lúdica e narrativa; Vantajinho como guia narrativo; Day Trade Pig educativo sujeito a nova aprovação.
- Nova visão estratégica: `Cofrinho Labs — Área de Desenvolvedores`, nome provisório, para aprendizagem, criação e participação segura na evolução do Universo Cofrinho Real.
- Decisões pendentes: valores das recompensas, duração e quantidade de usuários externos, desenho do backend privado e entrada do Cofrinho Labs na Fase 1.
- Próximo marco: implementar, em branch e worktree próprios, a atualização visual do desktop. Ideias futuras não entram automaticamente nessa entrega.

## Estado técnico de produção

- `main` de referência antes desta consolidação: `3cf609601b40000cea5985c2a63babd2366507c9`.
- PR #5 implantou o Worker `cofrinhoreal-operational-path-guard`; PR #6 corrigiu a rota ampla de dados sem remover a proteção operacional.
- Versão implantada do Worker: `5cc14eb6-f45f-4d5a-b5d2-077e58fdf267`.
- Classificação oficial: `EXPOSIÇÃO HISTÓRICA MITIGADA PELO WORKER`.
- O Worker protege 11 rotas finais: `package.json*`, `package-lock.json*`, `README.md*`, `docs/*`, `scripts/*`, `tests/*`, `data/image-automation/*`, `tmp/*`, `.env*`, `.git/*` e `wrangler.toml*`, todas exclusivamente no domínio raiz.
- A rota `data/*` foi removida porque alcançava o catálogo público; a proteção correta é `data/image-automation/*`.
- O cache interno histórico do Cloudflare Pages não foi declarado eliminado. O chamado `#02245419` continua aberto.
- Produção automática do Pages permanece desativada e previews automáticos permanecem em `none`. A integração GitHub continua conectada, com build `npm run build` e output exclusivo `dist`.
- Pushes e PRs estão permitidos. Registros Pages `is_skipped=true`, com estágios `idle`, sem build, deploy, URL funcional ou alias, não constituem publicação.
- O deployment canônico permanece `3b1d68e7-74fd-4b9c-add3-778029a4b39f`, publicando o commit `4da7be38aef3ea9a2ec3642c1a0f5b5f3089e575`, até nova autorização deliberada.

## Isolamento permanente entre projetos

Toda análise, decisão, arquivo, código, credencial, branch, worktree e operação do Cofrinho Real deve permanecer isolada de CELULARS, GIRTABUSA, PHIXCELL e de qualquer outro projeto. Conteúdo de outro projeto deve ser rejeitado, sem adaptação, registro ou execução. Na dúvida, a atividade deve parar para confirmação.

## Backlog e histórico

Preparação documental agora; Fase 1 conforme [documento próprio](FASE_1_TESTE.md); fases posteriores em [Fases](FASES_DO_PROJETO.md). O projeto já consolidou protótipo público, Pig Principal, 27 avatares e guardrails de deployment.

Último checkpoint: [CHECKPOINT_DIARIO.md](CHECKPOINT_DIARIO.md). Riscos: [RISCOS_E_DEPENDENCIAS.md](RISCOS_E_DEPENDENCIAS.md).

Toda ideia nova deve ser classificada como fase atual, fase futura, decisão pendente, ideia, risco ou dependência. Registro não amplia escopo.

## Direção de experiência futura

No desktop, o usuário deverá sentir que constrói, configura, administra, analisa e acompanha o Universo Cofrinho Real. A linguagem será modular, profissional e acessível, inspirada genericamente em plataformas de infraestrutura, bancos digitais e portais de desenvolvedor, sem copiar marcas, layouts ou componentes de terceiros e sem virar terminal falso.

No aplicativo, o usuário deverá sentir que vive o universo: experiência lúdica, colorida, narrativa, acolhedora e simplificada. Desktop e aplicativo compartilharão conta, dados, regras, personagens, patrimônio e economia educativa, com modos de apresentação diferentes.

A Plataforma Day Trade Pig é visão futura, não pertence à Fase 1 e exigirá nova aprovação formal, revisão pedagógica, proteção infantil e revisão jurídica.

O Cofrinho Labs poderá ocupar uma aba visível do desktop para ensinar programação, receber ideias e acompanhar propostas. Código de usuário será sempre não confiável, limitado a sandbox isolada e sem acesso ao projeto, Git, backend, secrets, banco, Cloudflare ou produção. A alternativa recomendada para análise humana é um módulo experimental opcional da Fase 1, não um requisito obrigatório; a decisão final permanece pendente.

## Aprovação humana

- [x] Visão do produto aprovada
- [x] Nome PIG Coin/PIG Coins aprovado
- [x] Escopo da Fase 1 aprovado
- [x] Proteção infantil aprovada
- [x] Divisão das fases aprovada
- [x] Pig Bank aprovado como núcleo inicial
- [x] Patrimônio simplificado aprovado para a Fase 1
- [x] Economia real mantida em projeto futuro separado
- [x] Fluxo diário de trabalho aprovado
- [x] Documentação pronta para push e PR

## COMEÇAR O DIA — COFRINHO REAL

Ler plano e checkpoint; verificar site, GitHub, `origin/main`, commits, PRs, checks, deployments, Cloudflare conforme acesso e suporte; comparar com o encerramento; declarar limitações; planejar cerca de duas horas; não repetir concluídos.

## ENCERRAR O DIA — COFRINHO REAL

Registrar data, duração, planejado, concluído, pendente, decisões, ideias, arquivos, testes, commits, pushes, PRs, merges, deployments, bloqueios, suporte e próximo passo. O usuário pode definir janela maior.
