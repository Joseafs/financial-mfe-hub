# Ambiente production/demo no Render

Este ambiente provisiona o **Shell** e os quatro **Micro Frontends** como Render Static Sites independentes.

A criacao dos servicos e feita pelo Terraform. Nenhuma credencial do Render deve ser versionada.

## 1. Preparar as credenciais locais

A partir da raiz do repositorio:

```powershell
Copy-Item .env.example .env
notepad .env
```

Preencha no `.env` da raiz:

```text
RENDER_API_KEY=...
RENDER_OWNER_ID=...
```

O script `render.ps1` carrega esse `.env` da raiz e expõe as variaveis ao processo do Terraform. O `.env` real e ignorado pelo Git.

## 2. Provisionar

Com Terraform instalado, execute sempre pela raiz do repositorio:

```powershell
pnpm render:init
pnpm render:validate
pnpm render:plan
```

Revise o plan. O esperado na primeira execucao e a criacao de cinco Static Sites:

```text
financial-mfe-hub-production-shell
financial-mfe-hub-production-dashboard
financial-mfe-hub-production-accounts
financial-mfe-hub-production-payments
financial-mfe-hub-production-insurance
```

Se o plan estiver correto:

```powershell
pnpm render:apply
```

O `apply` usa exatamente o arquivo `production.tfplan` criado pelo comando anterior.

## 3. Obter as URLs

Depois do apply:

```powershell
pnpm render:output
```

O Terraform retorna as cinco URLs publicas em `frontend_urls`.

## 4. Decisoes desta etapa

- cada frontend e um recurso Render independente;
- `auto_deploy = false` enquanto a estrategia de CD nao for fechada na FMH-046;
- cada servico executa somente o build do proprio package;
- build filters incluem o app e os packages/configs compartilhados do monorepo;
- o Shell possui rewrite `/* -> /index.html` para suportar navegacao Single-SPA por URL direta;
- o build usa `--no-frozen-lockfile` temporariamente enquanto `pnpm-lock.yaml` ainda nao estiver versionado;
- estado Terraform, `.env` real e plans permanecem fora do Git;
- os comandos operacionais de Render ficam expostos como scripts do `package.json`, mantendo a interface de execucao consistente com o restante do monorepo;
- existe um unico `.env.example` na raiz para evitar configuracao duplicada entre aplicacao e infraestrutura local.

## 5. Destruir o ambiente de demo

Somente quando a remocao for intencional:

```powershell
pnpm render:destroy
```

Nunca execute `destroy` como parte de CI/CD automatico.
