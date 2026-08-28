# PROJECT TASKS — Financial MFE Hub

## 1. Objetivo

Este documento é o backlog técnico canônico do **Financial MFE Hub**.

As tasks devem manter o repositório compreensível, validável e coerente com o [`SDD.md`](./SDD.md), o [`CI-CD.md`](./CI-CD.md) e as decisões registradas em `adr/`.

Prefixo oficial:

```text
FMH
```

Padrão de commit:

```text
<tipo>: <TASK-ID> - <descrição em pt-BR>
```

Exemplos:

```text
feat: FMH-002 - inicializa workspace pnpm e turborepo
fix: FMH-029 - corrige reenvio da transferência
refactor: FMH-018 - separa bootstrap do fastify
```

---

## 2. Estados

| Estado | Significado |
| --- | --- |
| `BACKLOG` | identificada, ainda não pronta para execução |
| `READY` | escopo, dependências e aceite definidos |
| `DOING` | implementação ativa |
| `REVIEW` | implementação concluída aguardando validação |
| `BLOCKED` | impedimento explícito documentado |
| `DONE` | aceite e Definition of Done atendidos |

Fluxo:

```text
BACKLOG -> READY -> DOING -> REVIEW -> DONE
                     |
                     └-> BLOCKED -> READY
```

---

## 3. Definition of Ready

Uma task está `READY` quando:

- objetivo está claro;
- escopo está delimitado;
- dependências estão conhecidas;
- decisões arquiteturais relevantes estão registradas;
- critérios de aceite são verificáveis;
- riscos ou questões abertas estão explícitos.

---

## 4. Definition of Done

Uma task está `DONE` quando, quando aplicável:

- implementação está completa;
- lint passa;
- typecheck passa;
- testes relacionados passam;
- build passa;
- não há segredo versionado;
- documentação afetada foi atualizada;
- critérios de aceite possuem evidência;
- mudanças arquiteturais foram refletidas no SDD/ADR;
- o commit referencia a task correspondente.

---

## 5. Evidências

Exemplos:

```text
pnpm lint
pnpm typecheck
pnpm test
pnpm build
pnpm e2e
terraform validate
terraform plan
URL publicada
health check
smoke test
screenshot quando aplicável
arquivo/teste que demonstra o comportamento
```

### Snapshot de sincronização — POC local (2026-08-28)

A POC arquitetural local já possui implementação observável suficiente para mover as tasks centrais da fundação para `REVIEW`, sem antecipar `DONE` antes dos gates de qualidade.

Evidências já observadas durante a POC:

- `pnpm install` concluído no workspace;
- Shell, Dashboard, Accounts, Payments, Insurance e BFF executando localmente;
- navegação Single-SPA entre os quatro MFEs;
- lifecycle federado carregado em runtime por Module Federation;
- React/React DOM compartilhados com estratégia singleton e bootstrap assíncrono documentado;
- runtime manifest carregado pelo Shell antes da orquestração;
- falha isolada de remote sem derrubar o Shell ou os demais MFEs;
- seleção de `active`/`stable` e auto-rollback demonstrativo exercitados localmente;
- release identity visível nos stubs para diagnóstico.

Status sincronizado da POC:

| Task | Estado | Evidência / pendência principal |
| --- | --- | --- |
| FMH-002 | `REVIEW` | workspace e scripts existem; aguarda gates completos |
| FMH-003 | `REVIEW` | configs compartilhadas existem e TypeScript está em `strict` |
| FMH-004 | `REVIEW` | portas, runtime config e execução local estão definidos; aguarda gates |
| FMH-005 | `REVIEW` | Shell funcional localmente |
| FMH-006 | `REVIEW` | registro manual Single-SPA documentado em ADR |
| FMH-007 | `REVIEW` | Dashboard stub monta e participa da composição |
| FMH-008 | `REVIEW` | Accounts stub monta e participa da composição |
| FMH-025 | `REVIEW` | Payments stub monta, expõe versão e participa do rollback POC |
| FMH-030 | `REVIEW` | Insurance stub monta e participa da composição |
| FMH-009 | `REVIEW` | fallback/isolamento de remote demonstrado manualmente |
| FMH-010 | `REVIEW` | Module Federation funciona localmente |
| FMH-011 | `REVIEW` | shared dependencies e singleton documentados |
| FMH-012 | `REVIEW` | `./lifecycles` é consumido como módulo federado real |
| FMH-013 | `REVIEW` | manifest/runtime loader e active/stable funcionam localmente; produção será fechada em FMH-047 |
| FMH-018 | `DOING` | `/health`, logging e separação app/server existem; configuração tipada ainda precisa ser fechada |
| FMH-041 | `READY` | próxima implementação da trilha crítica |

Antes de promover as tasks em `REVIEW` para `DONE`, registrar evidência atualizada de:

```text
pnpm format:check
pnpm lint
pnpm typecheck
pnpm test
pnpm build
```

O rollback local é evidência da mecânica arquitetural, mas **não conclui FMH-048**. A task de rollback só fecha após deploy real, smoke pós-deploy e retorno para artefato publicado conhecido.

---

## 6. Estratégia de execução — Architecture Validation First

A ordem numérica das tasks é mantida para rastreabilidade, mas **não representa obrigatoriamente a ordem cronológica de implementação**.

A primeira milestone segue o [`ADR-001 — Architecture Validation First`](./adr/ADR-001-architecture-validation-first.md) e prioriza provar a plataforma antes do domínio financeiro.

### Trilha crítica inicial

```text
FMH-002 workspace
  ↓
FMH-003 configs compartilhadas
  ↓
FMH-004 ambiente local
  ↓
FMH-005 shell
  ↓
FMH-006 estratégia Single-SPA
  ↓
FMH-007 dashboard stub azul
  ↓
FMH-008 accounts stub verde
  ↓
FMH-025 payments stub roxo
  ↓
FMH-030 insurance stub laranja
  ↓
FMH-009 fallback
  ↓
FMH-010 Module Federation
  ↓
FMH-011 shared dependencies
  ↓
FMH-012 módulo federado mínimo real
  ↓
FMH-013 runtime remote config
  ↓
FMH-018 BFF /health
  ↓
FMH-041 CI
  ↓
FMH-042 builds independentes
  ↓
FMH-043 Terraform + Render
  ↓
FMH-044 Static Sites
  ↓
FMH-045 BFF Web Service
  ↓
FMH-046 CD
  ↓
FMH-047 runtime manifest/cache
  ↓
FMH-049 smoke pós-deploy
  ↓
FMH-048 rollback
  ↓
ARCHITECTURE GATE ✅
```

Antes do Architecture Gate, os MFEs devem permanecer **stubs visuais mínimos**. Não é objetivo gastar tempo com telas completas, design system final, formulários sofisticados ou regras financeiras extensas.

Identidade visual inicial:

```text
Dashboard -> azul
Accounts  -> verde
Payments  -> roxo
Insurance -> laranja
```

Depois do gate, os stubs evoluem incrementalmente para os domínios reais.

---

# Fase 0 — Fundação documental

## FMH-001 — Consolidar SDD 1.0 e documentação base

**Status:** `DONE`

### Entregas

- `README.md` em PT-BR;
- `README.en.md` em inglês;
- `packages/context/README.md`;
- `packages/context/SDD.md`;
- `packages/context/CI-CD.md`;
- `packages/context/PROJECT-TASKS.md`;
- `ADR-001 — Architecture Validation First`;
- arquitetura principal fiel a **Terraform + Render**;
- AWS somente como trilha opcional comparativa;
- Formik + Zod + Context API definidos;
- i18n PT-BR/EN definido;
- estratégia CI/CD e fluxo de tasks definidos.

### Aceite

- SDD diferencia Single-SPA, Module Federation e Turborepo;
- Render é a infraestrutura principal;
- Terraform usa `render-oss/render` como provider principal;
- AWS não bloqueia a conclusão do case;
- README PT-BR e inglês refletem a mesma arquitetura;
- Architecture Validation First está registrada;
- backlog está sincronizado com as decisões.

---

# Fase 1 — Fundação do workspace

## FMH-002 — Inicializar pnpm workspace e Turborepo

**Status:** `REVIEW`

**Depende de:** FMH-001

### Escopo

- `package.json` raiz;
- `pnpm-workspace.yaml`;
- `turbo.json`;
- `.gitignore`;
- versão mínima de Node e pnpm;
- scripts raiz;
- diretórios `apps/*` e `packages/*` preparados para evolução incremental.

### Aceite

- `pnpm install` executa sem erro;
- workspace reconhece apps/packages;
- pipelines iniciais de `lint`, `typecheck`, `test` e `build` existem.

---

## FMH-003 — Criar configurações compartilhadas

**Status:** `REVIEW`

**Depende de:** FMH-002

### Entregas

```text
packages/eslint-config
packages/typescript-config
```

### Aceite

- TypeScript strict;
- apps/packages estendem configs comuns;
- regras não são duplicadas sem necessidade.

---

## FMH-004 — Padronizar arquitetura, imports e desenvolvimento local

**Status:** `REVIEW`

**Depende de:** FMH-003

### Escopo

- aliases e entrypoints públicos;
- restrição de imports entre internals de apps;
- convenção de portas locais;
- comando raiz para subir Shell, MFEs e BFF;
- configuração local de URLs dos remotes.

### Aceite

- nenhum MFE importa `src` interno de outro;
- `pnpm dev` ou equivalente inicia o ambiente local de forma reproduzível;
- Shell resolve remotes locais por configuração.

---

# Fase 2 — Shell e Single-SPA

## FMH-005 — Criar Shell / root config

**Status:** `REVIEW`

**Depende de:** FMH-003

### Aceite

- Shell inicia localmente;
- Single-SPA possui bootstrap funcional;
- layout global não contém regra de domínio;
- Shell pode hospedar stubs sem exigir UI final.

---

## FMH-006 — Definir estratégia de layout Single-SPA

**Status:** `REVIEW`

**Depende de:** FMH-005

### Decisão

Comparar registro manual vs `single-spa-layout` e registrar a escolha em SDD/ADR.

---

## FMH-007 — Criar Dashboard MFE como architecture stub

**Status:** `REVIEW`

**Depende de:** FMH-005

### Identidade

```text
cor: azul
```

### Aceite

- `bootstrap`, `mount` e `unmount` funcionam;
- `/dashboard` possui owner explícito;
- bloco identifica `dashboard-mfe`, versão/build e ambiente;
- nenhuma regra financeira relevante é necessária nesta etapa.

---

## FMH-008 — Criar Accounts MFE como architecture stub

**Status:** `REVIEW`

**Depende de:** FMH-007

### Identidade

```text
cor: verde
```

### Aceite

- `/accounts` possui owner explícito;
- navegação Dashboard -> Accounts monta/desmonta corretamente;
- bloco identifica `accounts-mfe`, versão/build e ambiente.

---

## FMH-009 — Implementar fallback de remote/MFE

**Status:** `REVIEW`

**Depende de:** FMH-008

### Aceite

- falha de um MFE não derruba o Shell;
- existe fallback e retry quando aplicável;
- erro registra MFE, rota e ambiente.

---

# Fase 3 — Module Federation

## FMH-010 — Configurar Webpack 5 e Module Federation

**Status:** `REVIEW`

**Depende de:** FMH-008

### Aceite

- host e remote funcionam localmente;
- `remoteEntry` é carregado em runtime.

---

## FMH-011 — Definir shared dependencies

**Status:** `REVIEW`

**Depende de:** FMH-010

### Aceite

- React/React DOM possuem estratégia explícita de singleton;
- compartilhamento excessivo é evitado;
- trade-offs ficam documentados.

---

## FMH-012 — Criar primeiro módulo federado mínimo real

**Status:** `REVIEW`

**Depende de:** FMH-010, FMH-011

### Objetivo

Provar federation com um caso pequeno e observável antes de qualquer composição de produto complexa.

### Aceite

- existe módulo público realmente consumido em runtime;
- contrato público é explícito;
- consumidor não acessa internals do remote.

---

## FMH-013 — Implementar runtime remote configuration

**Status:** `REVIEW`

**Depende de:** FMH-010

### Aceite

- URLs dos remotes não ficam hardcoded em código de domínio;
- configuração varia entre `local` e `production/demo`;
- configuração inválida possui fallback.

---

# Fase 4 — Packages compartilhados

> Esta fase funcional pode ser aprofundada após o Architecture Gate, exceto packages estritamente necessários para a validação técnica.

## FMH-014 — Criar `packages/contracts`

**Status:** `BACKLOG`

**Depende de:** FMH-003

### Aceite

- schemas Zod e tipos inferidos possuem exports públicos;
- package não depende de React, Fastify ou persistência.

---

## FMH-015 — Criar `packages/ui`

**Status:** `BACKLOG`

**Depende de:** FMH-003

### Aceite

- primitives visuais reutilizáveis;
- Tailwind/tokens possuem estratégia comum;
- componentes não carregam regra de domínio.

---

## FMH-016 — Criar Storybook da UI

**Status:** `BACKLOG`

**Depende de:** FMH-015

### Aceite

- Storybook inicia isoladamente;
- componentes principais possuem stories e estados relevantes.

---

## FMH-017 — Criar `packages/i18n`

**Status:** `BACKLOG`

**Depende de:** FMH-003

### Escopo

- i18next + react-i18next;
- `pt-BR` padrão;
- `en` alternativo;
- contrato público de mudança de idioma;
- namespaces por MFE.

### Aceite

- Shell coordena locale atual;
- MFEs mantêm namespaces próprios;
- fallback explícito para `pt-BR`;
- `<html lang>` acompanha o locale.

---

# Fase 5 — BFF

## FMH-018 — Bootstrap do Fastify BFF

**Status:** `DOING`

**Depende de:** FMH-002

### Architecture Validation

Nesta primeira passagem, o BFF pode ser mínimo. O requisito é provar execução, health check, logs e deploy.

### Aceite

- `/health` responde;
- configuração é tipada;
- logging estruturado está habilitado;
- `app.ts` e `server.ts` possuem responsabilidades separadas.

---

## FMH-019 — Integrar Zod ao BFF

**Status:** `BACKLOG`

**Depende de:** FMH-014, FMH-018

### Aceite

- requests não confiáveis são revalidados;
- erros de contrato possuem formato consistente;
- OpenAPI pode derivar das definições da API quando viável.

---

## FMH-020 — Criar modelo de erros do BFF

**Status:** `BACKLOG`

**Depende de:** FMH-018

### Códigos mínimos

```text
VALIDATION_ERROR
UNAUTHENTICATED
FORBIDDEN
NOT_FOUND
CONFLICT
DOWNSTREAM_UNAVAILABLE
INTERNAL_ERROR
```

---

## FMH-021 — Implementar request correlation

**Status:** `BACKLOG`

**Depende de:** FMH-018

### Aceite

- requests possuem correlation/request id;
- logs permitem correlacionar MFE, endpoint e falha.

---

# Fase 6 — Accounts

## FMH-022 — Implementar contratos de Accounts

**Status:** `BACKLOG`

**Depende de:** FMH-014

### Escopo

- account summary;
- card summary;
- limits;
- statement fictício.

---

## FMH-023 — Implementar endpoints Accounts no BFF

**Status:** `BACKLOG`

**Depende de:** FMH-019, FMH-022

---

## FMH-024 — Integrar Accounts MFE ao BFF

**Status:** `BACKLOG`

**Depende de:** FMH-008, FMH-023

### Aceite

- TanStack Query gerencia server state;
- loading, empty e error states existem.

---

# Fase 7 — Payments

## FMH-025 — Criar Payments MFE como architecture stub

**Status:** `REVIEW`

**Depende de:** FMH-008

### Identidade

```text
cor: roxo
```

### Aceite inicial

- `/payments` monta/desmonta independentemente;
- bloco identifica `payments-mfe`, versão/build e ambiente;
- formulário de negócio não é requisito desta task.

---

## FMH-026 — Definir contratos Zod de transferência

**Status:** `BACKLOG`

**Depende de:** FMH-014

### Regra

Somente regras portáveis entram no schema compartilhado. Saldo, existência da conta e autorização permanecem no servidor.

---

## FMH-027 — Implementar formulário Formik + Zod

**Status:** `BACKLOG`

**Depende de:** FMH-025, FMH-026

### Escopo

- Formik como biblioteca padrão;
- adapter `ZodError -> FormikErrors`;
- `FormikProvider` / `useFormikContext` quando útil;
- Context API restrita ao owner do fluxo.

### Aceite

- não existe duplicação manual das regras do schema;
- erros de campos e submit são acessíveis;
- nenhum MegaContext cross-MFE é criado.

---

## FMH-028 — Implementar endpoint de transferência fictícia

**Status:** `BACKLOG`

**Depende de:** FMH-019, FMH-026

### Aceite

- BFF revalida payload;
- saldo e autorização são regras exclusivamente server-side;
- erros usam códigos estáveis.

---

## FMH-029 — Integrar formulário ao fluxo BFF

**Status:** `BACKLOG`

**Depende de:** FMH-027, FMH-028

### Aceite

- sucesso e falha possuem feedback;
- double submit é impedido;
- loading state é explícito.

---

# Fase 8 — Insurance e Dashboard agregado

## FMH-030 — Criar Insurance MFE como architecture stub

**Status:** `REVIEW`

**Depende de:** FMH-008

### Identidade

```text
cor: laranja
```

### Aceite inicial

- `/insurance` monta/desmonta independentemente;
- bloco identifica `insurance-mfe`, versão/build e ambiente;
- simulações/fluxos de negócio não são requisito desta task.

---

## FMH-031 — Evoluir Dashboard agregado

**Status:** `BACKLOG`

**Depende de:** FMH-024, FMH-029, FMH-030

### Aceite

- dados agregados vêm do BFF/contratos públicos;
- Dashboard não importa stores/internals de outros MFEs.

---

# Fase 9 — Testes

## FMH-032 — Padronizar Jest + React Testing Library

**Status:** `BACKLOG`

### Padrão

- usar `test`;
- nomes iniciam com `should`;
- queries via `screen`;
- helper de render reutilizável;
- Faker quando agregar robustez.

---

## FMH-033 — Adicionar MSW

**Status:** `BACKLOG`

**Depende de:** FMH-032

### Cenários mínimos

- sucesso;
- validação;
- 401/403;
- 500/503;
- timeout/resposta lenta.

---

## FMH-034 — Testar BFF com `Fastify.inject()`

**Status:** `BACKLOG`

**Depende de:** FMH-019

---

## FMH-035 — Configurar Playwright

**Status:** `BACKLOG`

**Depende de:** FMH-029

### Aceite

- ao menos uma jornada atravessa múltiplos MFEs;
- cobre navegação, formulário, sucesso e falha de remote.

---

# Fase 10 — Performance, resiliência e observabilidade

## FMH-036 — Medir bundles e dependências duplicadas

**Status:** `BACKLOG`

**Depende de:** FMH-012

---

## FMH-037 — Instrumentar Core Web Vitals

**Status:** `BACKLOG`

### Métricas

- LCP;
- INP;
- CLS.

---

## FMH-038 — Padronizar logging e falhas de MFE/BFF

**Status:** `BACKLOG`

**Depende de:** FMH-009, FMH-021

### Aceite

- logs identificam MFE, rota, ambiente e request id;
- health check e logs do Render são documentados.

---

# Fase 11 — Autenticação e segurança

## FMH-039 — Criar `packages/auth` e estratégia de sessão

**Status:** `BACKLOG`

**Depende de:** FMH-014, FMH-018

### Decisão

Definir sessão/autenticação considerando Shell/MFEs/BFF em serviços Render distintos.

### Aceite

- tokens sensíveis não ficam em `localStorage`;
- cookie/CORS/credentials/SameSite possuem estratégia explícita;
- autorização real permanece no BFF.

---

## FMH-040 — Aplicar baseline de segurança

**Status:** `BACKLOG`

**Depende de:** FMH-018, FMH-039

### Escopo

- CORS restrito;
- security headers;
- redaction de logs;
- env validation;
- rate limit quando aplicável;
- CSP e allowlist das origens de remotes;
- secrets fora do Git.

---

# Fase 12 — CI/CD, Render e Terraform

> Apesar do número da fase, estas tasks são executadas **cedo** pela trilha Architecture Validation First.

## FMH-041 — Criar pipeline CI

**Status:** `READY`

**Depende de:** FMH-002

### Gates

```text
pnpm install --frozen-lockfile
pnpm format:check
pnpm lint
pnpm typecheck
pnpm test
pnpm build
```

### Aceite

- PR executa gates obrigatórios;
- falha bloqueia merge quando branch protection estiver ativa;
- workflows usam permissões mínimas necessárias.

---

## FMH-042 — Validar builds independentes

**Status:** `BACKLOG`

**Depende de:** FMH-041

### Aceite

- cada app pode ser buildada isoladamente via Turborepo;
- mudança em um MFE não exige build/deploy indiscriminado de todos os demais;
- dependências compartilhadas propagam impacto corretamente.

---

## FMH-043 — Inicializar Terraform para Render

**Status:** `BACKLOG`

**Depende de:** FMH-042

### Escopo

- provider `render-oss/render`;
- `infrastructure/terraform`;
- módulos `static-site`, `web-service` e `shared`;
- environment `production`;
- `.tfstate` fora do Git.

### Aceite

```text
terraform fmt -check
terraform validate
terraform plan
```

---

## FMH-044 — Provisionar Shell e MFEs como Render Static Sites

**Status:** `BACKLOG`

**Depende de:** FMH-043

### Aceite

- Shell e cada MFE possuem serviço independente;
- URLs podem alimentar runtime config;
- deploy de um MFE não exige deploy dos demais;
- os quatro stubs coloridos ficam acessíveis no ambiente demo.

---

## FMH-045 — Provisionar Fastify BFF como Render Web Service

**Status:** `BACKLOG`

**Depende de:** FMH-043, FMH-018

### Aceite

- Web Service inicia corretamente;
- `/health` funciona;
- secrets/config permanecem fora do bundle e do Git.

---

## FMH-046 — Definir e implementar estratégia de CD no Render

**Status:** `BACKLOG`

**Depende de:** FMH-044, FMH-045

### Decisão

Comparar auto-deploy nativo do Render vs deploy controlado pelo GitHub Actions e registrar a escolha.

### Aceite

- deploy só ocorre após checks definidos;
- serviço afetado pode ser publicado sem acoplar todos os demais;
- origem de cada release é rastreável ao commit.

---

## FMH-047 — Configurar runtime manifest, cache e URLs de produção

**Status:** `BACKLOG`

**Depende de:** FMH-013, FMH-044, FMH-046

### Escopo

- manifest/configuração central de remotes;
- versão/URL de cada remote;
- política de cache de `remoteEntry`;
- chunks versionados/hash quando aplicável.

---

## FMH-048 — Implementar estratégia de rollback de MFE

**Status:** `BACKLOG`

**Depende de:** FMH-047, FMH-049

### Aceite

- um remote pode voltar para versão conhecida sem republicar todos os MFEs;
- procedimento fica documentado;
- rollback pode ser demonstrado usando os stubs sem depender de fluxo financeiro complexo.

---

## FMH-049 — Criar smoke test pós-deploy

**Status:** `BACKLOG`

**Depende de:** FMH-045, FMH-047

### Verificações mínimas

```text
Shell responde
Dashboard monta
Accounts monta
Payments monta
Insurance monta
remoteEntry responde
BFF /health responde
```

### Aceite

- falha produz diagnóstico claro;
- smoke pode ser repetido após deploy/rollback;
- resultado pode ser usado como evidência do Architecture Gate.

---

# Architecture Gate

O gate é considerado atendido quando FMH-002/003/004/005/006/007/008/025/030/009/010/011/012/013/018/041/042/043/044/045/046/047/049/048 estiverem concluídas e houver evidência de:

- múltiplos MFEs independentes publicados;
- lifecycle Single-SPA funcional;
- Module Federation real mínimo;
- runtime config de remotes;
- fallback de remote;
- BFF saudável;
- CI/CD funcional;
- Terraform provisionando Render;
- deploy independente;
- smoke test pós-deploy;
- rollback demonstrável.

Somente então a implementação de produto passa a ser a prioridade principal.

---

# Fase 13 — Fechamento do case

## FMH-050 — Validar i18n end-to-end

**Status:** `BACKLOG`

**Depende de:** FMH-017, FMH-031

### Aceite

- PT-BR e inglês funcionam em todos os MFEs previstos;
- fallback e persistência de preferência funcionam.

---

## FMH-051 — Documentar trade-offs e roteiro de demonstração

**Status:** `BACKLOG`

**Depende de:** FMH-049, FMH-050

### Cobrir

- por que MFE;
- quando MFE seria exagero;
- Single-SPA e Module Federation;
- monorepo vs multirepo;
- BFF;
- Zod compartilhado;
- Formik/Context API;
- Render + Terraform;
- Architecture Validation First;
- performance, segurança e operação.

---

## FMH-052 — Revisar paridade README PT-BR / inglês

**Status:** `BACKLOG`

**Depende de:** FMH-051

### Aceite

- os dois READMEs refletem o estado realmente implementado;
- links, arquitetura, cores e URLs públicas estão corretos.

---

# Fase 14 — Case opcional AWS

## FMH-053 — Avaliar/implementar arquitetura comparativa Terraform + AWS

**Status:** `BACKLOG`

**Opcional:** sim

**Depende de:** case principal concluído

### Possibilidades

```text
Render Static Sites -> S3 + CloudFront
Render Web Service  -> Lambda + API Gateway
Render logs         -> CloudWatch
Terraform Render    -> Terraform AWS Provider
```

### Regra

Esta task não bloqueia a conclusão do Financial MFE Hub. Só deve ser executada após o case principal estar funcional e se houver valor real na comparação.

---

# Próxima task

```text
FMH-041 — Criar pipeline CI
```

A POC local já provou a composição arquitetural mínima. O próximo passo é transformar os gates locais em CI reproduzível e usar essa automação para promover as tasks em `REVIEW` para `DONE` com evidência rastreável, antes de avançar para builds/deploys independentes e infraestrutura Render.
