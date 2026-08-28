# Ambiente production/demo no Render

Este ambiente provisiona o **Shell** e os quatro **Micro Frontends** como Render Static Sites independentes e o **Fastify BFF** como Render Web Service.

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

O ambiente possui os seguintes recursos:

```text
financial-mfe-hub-production-shell
financial-mfe-hub-production-dashboard
financial-mfe-hub-production-accounts
financial-mfe-hub-production-payments
financial-mfe-hub-production-insurance
financial-mfe-hub-production-bff
```

Os cinco frontends sao Static Sites. O BFF e um Web Service Node com health check em `/health`.

O case usa o plano `free` para o BFF e a regiao inicial `virginia`. O objetivo deste ambiente e demonstracao arquitetural sem custo de compute dedicado. Como consequencia, o Web Service pode sofrer cold start apos inatividade; isso e comportamento esperado do ambiente demo e deve ser considerado nos smoke tests.

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

O Terraform retorna `frontend_urls`, `frontend_ids`, `bff_url`, `bff_id` e o `service_prefix`.

Valide o BFF em:

```text
<BFF_URL>/health
```

O esperado e um JSON com `status: "ok"`, identificacao do servico, ambiente `production` e timestamp.

## 4. Cache de runtime

A configuracao do Render diferencia arquivos de descoberta em runtime dos demais artefatos:

```text
Shell /remote-manifest.json -> Cache-Control: no-store
Shell /index.html           -> Cache-Control: no-cache, must-revalidate
MFE /remoteEntry.js         -> Cache-Control: no-cache, must-revalidate
```

O objetivo e impedir que o Shell ou um remote mantenham por tempo excessivo um ponteiro de release antigo. O `remoteEntry.js` continua com nome estavel porque e o ponto de entrada conhecido pelo runtime manifest. A etapa seguinte da FMH-047 e fingerprintar os chunks internos para permitir cache imutavel sem tornar o `remoteEntry.js` imutavel.

## 5. Smoke HTTP

Depois que o ambiente estiver publicado, execute:

```powershell
pnpm smoke:production
```

O smoke valida:

```text
/architecture-health
/remote-manifest.json
/dashboard
/accounts
/payments
/insurance
remoteEntry.js dos quatro MFEs
BFF /health
```

O BFF gratuito recebe uma janela maior de retry para tolerar cold start do Render. Se alguma URL publicada for diferente do nome padrao esperado, ela pode ser sobrescrita pela linha de comando:

```powershell
pnpm smoke:production -- --bff https://<url-real-do-bff>
```

Este smoke e propositalmente HTTP. A montagem real dos MFEs em navegador continua como a segunda camada da FMH-049 e sera automatizada com Playwright antes do Architecture Gate.

## 6. Decisoes desta etapa

- cada frontend e um recurso Render independente;
- o BFF e um Render Web Service independente no plano `free`;
- `auto_deploy = false`; o GitHub Actions controla publicacoes na FMH-046;
- cada servico executa somente o build do proprio package;
- build filters incluem o app e os packages/configs compartilhados do monorepo;
- o Shell possui rewrite `/* -> /index.html` para suportar navegacao Single-SPA por URL direta;
- o Shell e os MFEs usam headers explicitos para revalidar manifest, HTML de entrada e `remoteEntry.js`;
- o BFF usa `HOST=0.0.0.0`, recebe `PORT` do Render e valida configuracao no bootstrap;
- cold start do BFF gratuito deve ser tolerado pelas validacoes operacionais;
- `pnpm-lock.yaml` e `.terraform.lock.hcl` sao versionados para reproducibilidade;
- estado Terraform, `.env` real e plans permanecem fora do Git;
- os comandos operacionais de Render ficam expostos como scripts do `package.json`, mantendo a interface de execucao consistente com o restante do monorepo;
- existe um unico `.env.example` na raiz para evitar configuracao duplicada entre aplicacao e infraestrutura local.

## 7. Destruir o ambiente de demo

Somente quando a remocao for intencional:

```powershell
pnpm render:destroy
```

Nunca execute `destroy` como parte de CI/CD automatico.
