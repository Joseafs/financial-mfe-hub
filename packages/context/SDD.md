# SDD — Financial MFE Hub

## 1. Visão geral

O **Financial MFE Hub** é um case full-stack de arquitetura para um **hub financeiro fictício**. O projeto demonstra como Micro Frontends, contratos compartilhados, regras de negócio, interface, BFF, internacionalização, testes, observabilidade, CI/CD e infraestrutura podem evoluir juntos dentro de um monorepo.

O objetivo não é reproduzir uma instituição financeira real, mas construir um case técnico próximo de cenários corporativos de alta criticidade, com fronteiras claras, deploy independente, contratos explícitos e decisões arquiteturais rastreáveis.

> Todos os dados, usuários, saldos, contas, transações, seguros e regras de negócio são fictícios.

---

## 2. Objetivos arquiteturais

O case deve demonstrar, de forma prática e verificável:

1. composição de Micro Frontends com **Single-SPA**;
2. compartilhamento controlado de módulos em runtime com **Webpack Module Federation**;
3. monorepo com **pnpm + Turborepo**;
4. contratos runtime com **Zod** reutilizados entre front-end, BFF e testes;
5. formulários com **React Hook Form + Zod** sem duplicação manual de regras portáveis;
6. BFF em **Node.js + Fastify**;
7. internacionalização com **PT-BR como idioma padrão** e **inglês** como alternativa;
8. separação entre estado de servidor, estado local e comunicação cross-MFE;
9. autenticação e autorização centralizadas no BFF;
10. testes unitários, integração, contrato e E2E;
11. medição de performance e Core Web Vitals;
12. observabilidade com logs estruturados e correlation id;
13. CI/CD reproduzível com **GitHub Actions**;
14. infraestrutura AWS declarada com **Terraform**;
15. deploy independente por aplicação;
16. controle básico de custo da infraestrutura;
17. documentação de decisões, trade-offs e evolução por tasks.

---

## 3. Não objetivos

Não fazem parte do case:

- integração com instituições financeiras reais;
- movimentação financeira real;
- uso de dados bancários reais;
- Open Finance completo;
- compliance regulatório completo;
- arquitetura multi-região;
- alta disponibilidade de produção real;
- event streaming distribuído sem necessidade concreta;
- adoção de tecnologia apenas para aumentar a lista de stack.

Toda complexidade precisa ter justificativa arquitetural explícita.

---

## 4. Princípios

### 4.1 Fronteiras explícitas

Cada domínio possui ownership claro. Um MFE não pode importar internals de outro MFE.

### 4.2 Contratos antes da implementação

Entradas, saídas e eventos relevantes devem possuir contratos explícitos antes da implementação correspondente.

### 4.3 Backend como autoridade

Validação client-side existe por UX. O BFF sempre revalida requests e continua responsável por autenticação, autorização e regras dependentes de estado externo.

### 4.4 Compartilhar apenas o necessário

Module Federation não deve transformar os MFEs em um monólito distribuído. Módulos federados são APIs públicas e devem possuir ownership e contrato claros.

### 4.5 Independência de deploy

Estar no mesmo monorepo não implica deploy conjunto. Cada aplicação deve possuir artefato e promoção independentes.

### 4.6 Falhas isoladas

A falha de um remote não deve derrubar o Shell nem outros domínios quando tecnicamente evitável.

### 4.7 Observabilidade e segurança por padrão

Logs, correlation id, validação runtime, secrets fora do Git e tratamento de erro fazem parte do desenho, não de uma etapa final.

---

## 5. Visão de alto nível

```mermaid
flowchart LR
  User["Usuário"] --> CDN["CloudFront"]
  CDN --> Static["S3\nShell + MFEs"]
  Static --> Shell["Shell / Root Config\nSingle-SPA"]

  Shell --> Dashboard["Dashboard MFE"]
  Shell --> Accounts["Accounts MFE"]
  Shell --> Payments["Payments MFE"]
  Shell --> Insurance["Insurance MFE"]

  Dashboard -. "Module Federation" .-> Shared["Módulos federados"]
  Accounts -. "Module Federation" .-> Shared
  Payments -. "Module Federation" .-> Shared
  Insurance -. "Module Federation" .-> Shared

  Dashboard --> API["API Gateway"]
  Accounts --> API
  Payments --> API
  Insurance --> API

  API --> BFF["Fastify BFF\nAWS Lambda"]
  BFF --> Services["Serviços financeiros fictícios"]
  BFF --> Logs["CloudWatch"]

  Contracts["packages/contracts\nZod"] --> Dashboard
  Contracts --> Accounts
  Contracts --> Payments
  Contracts --> Insurance
  Contracts --> BFF

  I18n["packages/i18n\nPT-BR / EN"] --> Shell
  I18n --> Dashboard
  I18n --> Accounts
  I18n --> Payments
  I18n --> Insurance

  Terraform["Terraform"] -. "provisiona" .-> CDN
  Terraform -. "provisiona" .-> Static
  Terraform -. "provisiona" .-> API
  Terraform -. "provisiona" .-> BFF
  Terraform -. "provisiona" .-> Logs
```

---

## 6. Stack definida

### Front-end

- React;
- TypeScript strict;
- Tailwind CSS;
- React Router;
- Single-SPA;
- Webpack 5;
- Module Federation;
- TanStack Query;
- Zustand somente quando existir estado client-side realmente global;
- React Hook Form;
- Zod;
- i18next + react-i18next.

### BFF

- Node.js;
- Fastify;
- TypeScript;
- Zod;
- `fastify-type-provider-zod` ou integração equivalente;
- Swagger / OpenAPI;
- logging estruturado.

### Qualidade

- Jest;
- React Testing Library;
- MSW;
- Faker;
- Playwright;
- Storybook;
- ESLint;
- Prettier.

### Plataforma

- pnpm workspaces;
- Turborepo;
- GitHub Actions;
- AWS S3;
- AWS CloudFront;
- AWS Lambda;
- Amazon API Gateway;
- Amazon CloudWatch;
- AWS Budgets;
- Terraform.

---

## 7. Estrutura alvo

```text
apps/
├── shell/
├── dashboard-mfe/
├── accounts-mfe/
├── payments-mfe/
├── insurance-mfe/
└── bff/

packages/
├── context/
│   ├── README.md
│   ├── SDD.md
│   ├── PROJECT-TASKS.md
│   └── adr/
├── contracts/
├── ui/
├── auth/
├── i18n/
├── eslint-config/
└── typescript-config/

infrastructure/
└── terraform/
    ├── modules/
    │   ├── frontend/
    │   ├── bff/
    │   ├── observability/
    │   └── budget/
    └── environments/
        └── production/
```

O diretório `packages/context` é a fonte canônica de arquitetura, decisões e execução do projeto.

---

## 8. Responsabilidades por aplicação

### `apps/shell`

Responsável por:

- bootstrap Single-SPA;
- registro e descoberta dos MFEs;
- navegação global;
- layout estrutural;
- fallback de remote;
- runtime config;
- coordenação de idioma;
- carregamento de dependências compartilhadas quando necessário.

Não contém regras de Accounts, Payments ou Insurance.

### `dashboard-mfe`

- visão consolidada;
- atalhos;
- indicadores fictícios;
- composição apenas por contratos públicos/BFF.

### `accounts-mfe`

- contas;
- cartões;
- limites;
- extrato fictício.

### `payments-mfe`

- PIX fictício;
- boleto fictício;
- transferências fictícias;
- formulários e confirmações.

### `insurance-mfe`

- produtos de seguro fictícios;
- simulações;
- seguros contratados fictícios.

### `apps/bff`

- autenticação;
- autorização;
- validação runtime;
- composição de respostas;
- adaptação de downstreams;
- regras que dependem de estado externo;
- logging e correlation id;
- normalização de erros.

---

## 9. Single-SPA

Single-SPA é o orquestrador de lifecycle e rota.

Rotas iniciais:

```text
/dashboard   -> dashboard-mfe
/accounts    -> accounts-mfe
/payments    -> payments-mfe
/insurance   -> insurance-mfe
```

Cada MFE deve suportar:

```text
bootstrap
mount
unmount
```

O Shell controla a ativação global; o roteamento interno de cada domínio pertence ao respectivo MFE.

### Falha de carregamento

Se um MFE falhar:

- Shell permanece operacional;
- fallback é exibido;
- retry pode ser oferecido;
- erro é registrado com nome do MFE, rota, ambiente e contexto.

---

## 10. Module Federation

Webpack Module Federation será usado para compartilhamento runtime controlado.

### Regras

- React e React DOM devem possuir estratégia explícita de singleton;
- nenhum MFE importa `src` interno de outro;
- todo módulo exposto é tratado como API pública;
- mudanças incompatíveis precisam de migração coordenada;
- não federar componentes apenas porque são reutilizáveis; componentes comuns preferencialmente vivem em `packages/ui`;
- federation deve demonstrar pelo menos um caso real de composição cross-domain ou shell integration.

### Cache de remotes

`remoteEntry.js` deve possuir cache curto ou revalidação apropriada. Chunks com hash podem usar cache longo e `immutable`.

Isso reduz risco de Shell apontar para metadata antiga com chunks já substituídos.

---

## 11. Monorepo e Turborepo

Turborepo coordena tarefas, cache e dependências do workspace.

Pipelines previstos:

```text
lint
format:check
typecheck
test
build
e2e
```

Turborepo não substitui MFE. O monorepo melhora DX; a independência existe no runtime e no deploy.

---

## 12. Contratos Zod

`packages/contracts` é a fonte canônica para contratos portáveis.

Princípio:

```text
Definir uma vez -> inferir tipos -> validar nas fronteiras
```

Exemplo:

```ts
export const transferSchema = z.object({
  destinationAccount: z.string().min(1),
  amount: z.number().positive(),
  description: z.string().max(140).optional(),
});
```

### Compartilhado

- required;
- formatos;
- limites;
- enumerações;
- DTOs;
- query params;
- schemas de resposta quando útil.

### Exclusivo do servidor

```text
amount > 0                         -> Zod compartilhado
saldo disponível >= amount        -> domínio/BFF
conta de destino existe           -> domínio/BFF
usuário pode operar aquela conta  -> autorização/BFF
```

Modelos de persistência não devem ser expostos diretamente como contratos HTTP.

---

## 13. Formulários

React Hook Form será a biblioteca padrão de formulário.

Integração:

```text
React Hook Form
      │
 zodResolver
      │
packages/contracts
      │
      ├── validação imediata no front
      └── revalidação autoritativa no BFF
```

O front não deve duplicar manualmente regras já existentes no schema.

Erros de domínio devem usar códigos estáveis, sem parsing de mensagens humanas.

---

## 14. BFF com Fastify

Estrutura conceitual:

```text
src/
├── modules/
│   ├── accounts/
│   ├── payments/
│   └── insurance/
├── plugins/
├── shared/
├── app.ts
└── server.ts
```

Cada módulo deve separar HTTP, aplicação e integração quando necessário.

O BFF não deve virar um monólito sem fronteiras internas.

### API documentation

OpenAPI/Swagger deve ser gerado a partir das definições da API sempre que possível, evitando documentação manual divergente.

---

## 15. Internacionalização

Idiomas suportados inicialmente:

```text
pt-BR -> padrão
en    -> alternativo
```

`packages/i18n` concentra configuração comum, tipos e primitivas de idioma.

### Ownership

- Shell é a fonte de verdade da preferência atual;
- cada MFE mantém seus próprios namespaces de tradução;
- mudança de idioma ocorre por contrato público;
- nenhum MFE acessa store interna de outro;
- preferência pode ser persistida no browser por ser configuração não sensível;
- `<html lang>` deve acompanhar o locale atual;
- textos retornados por erro de domínio devem preferir códigos estáveis, permitindo tradução no cliente quando adequado.

O sistema deve ter fallback explícito para `pt-BR`.

---

## 16. Estado e comunicação entre MFEs

### Server state

TanStack Query para fetching, cache, invalidação e retry controlado.

### Estado client-side

Zustand apenas quando necessário e preferencialmente limitado ao owner do domínio.

### Cross-MFE

Ordem de preferência:

1. URL;
2. server state/BFF;
3. custom props/contratos públicos do Shell;
4. eventos tipados;
5. módulo federado somente quando houver justificativa.

Evitar store global compartilhada entre todos os MFEs.

---

## 17. Autenticação e autorização

Preferência arquitetural:

- autenticação controlada pelo BFF;
- cookie `HttpOnly`, `Secure` e `SameSite` apropriado quando sessão for implementada;
- tokens sensíveis não ficam em `localStorage`;
- front pode esconder ações por UX, mas BFF valida permissão real;
- logs não registram tokens, cookies ou dados sensíveis.

---

## 18. Modelo de erros

Formato base:

```json
{
  "error": {
    "code": "INSUFFICIENT_BALANCE",
    "message": "Saldo insuficiente.",
    "requestId": "..."
  }
}
```

Categorias mínimas:

- `VALIDATION_ERROR`;
- `UNAUTHENTICATED`;
- `FORBIDDEN`;
- `NOT_FOUND`;
- `CONFLICT`;
- `DOWNSTREAM_UNAVAILABLE`;
- `INTERNAL_ERROR`.

Detalhes de infraestrutura nunca devem vazar ao navegador.

---

## 19. Segurança

Baseline mínimo:

- CORS restrito;
- headers de segurança;
- cookies seguros;
- validação runtime de request e configuração;
- rate limit em endpoints sensíveis quando aplicável;
- secrets fora do Git;
- least privilege em IAM;
- redaction de logs;
- nenhuma informação financeira real;
- dependabot ou mecanismo equivalente para dependências;
- proteção contra publicação acidental de `.env` e artefatos sensíveis.

---

## 20. Performance e acessibilidade

### Métricas

- LCP;
- INP;
- CLS;
- tamanho de bundle;
- duplicação de dependências;
- tempo de carregamento de remotes;
- waterfall de requests.

### Estratégias

- lazy loading por domínio;
- assets com hash;
- cache adequado no CloudFront;
- evitar duplicação de React;
- federation compartilhada de forma mínima;
- bundle analysis;
- preload somente com evidência.

### Acessibilidade

Baseline WCAG 2.2 AA quando aplicável:

- navegação por teclado;
- foco visível;
- labels semânticos;
- contraste;
- feedback de erro acessível;
- landmarks e headings coerentes.

---

## 21. Resiliência e observabilidade

### Front-end

- Error Boundary por MFE;
- fallback do Shell;
- loading/empty/error states;
- timeout e retry controlados;
- identificação do remote que falhou.

### BFF

- logs estruturados;
- request/correlation id;
- timeout de downstream;
- retry apenas quando idempotente e seguro;
- métricas de erro e latência;
- logs no CloudWatch.

Objetivo operacional: conseguir responder qual MFE iniciou a ação, qual request falhou, qual endpoint/downstream foi envolvido e quanto tempo levou.

---

## 22. Testes

### Unitários e componentes

- Jest;
- React Testing Library;
- `test` como padrão de declaração;
- descrições iniciando com `should`;
- queries via `screen`;
- helpers de render reutilizáveis;
- Faker quando randomização agregar robustez.

### Integração

MSW para cenários de:

- sucesso;
- validação;
- 401/403;
- 500/503;
- timeout e resposta lenta.

### BFF

`Fastify.inject()` para testar endpoints sem servidor externo.

### E2E

Playwright deve cobrir ao menos uma jornada cross-MFE, incluindo navegação, formulário, sucesso e falha de remote.

### Contratos

Mudanças incompatíveis em contratos públicos devem falhar no CI ou possuir migração explícita.

---

## 23. Storybook e UI

`packages/ui` deve possuir Storybook isolado.

A biblioteca contém primitives e componentes sem regra de domínio. Componentes específicos continuam no MFE owner mesmo quando visualmente parecidos.

Tailwind deve possuir estratégia compartilhada de tokens/configuração sem criar dependência de domínio.

---

## 24. Infraestrutura AWS

AWS faz parte do escopo do case, não é apenas uma evolução opcional.

### Front-end

```text
Shell/MFEs -> build estático -> S3 -> CloudFront
```

Os apps podem compartilhar infraestrutura física por prefixos/versionamento para reduzir custo, mantendo artefatos e pipelines independentes.

### BFF

```text
Browser -> API Gateway -> Lambda -> Fastify BFF
```

O adapter serverless deve ficar isolado do core da aplicação para permitir execução local e testes sem Lambda.

### Observabilidade

CloudWatch recebe logs e métricas relevantes do backend.

### Custos

AWS Budgets deve definir alerta de custo baixo para evitar surpresa em uma aplicação de portfólio.

---

## 25. Terraform

Toda infraestrutura AWS do case deve possuir definição em `infrastructure/terraform`.

### Módulos previstos

```text
frontend/
bff/
observability/
budget/
```

Responsabilidades previstas:

- buckets/prefixos S3;
- CloudFront;
- Lambda;
- API Gateway;
- CloudWatch;
- IAM com menor privilégio possível;
- AWS Budget/alerta;
- outputs necessários ao pipeline.

### Segurança do Terraform

- state nunca deve conter segredo versionado;
- `.tfstate` deve ficar fora do Git;
- quando houver backend remoto, utilizar proteção adequada;
- CI usa credenciais temporárias via OIDC sempre que possível;
- secrets AWS de longa duração não devem ser necessários no GitHub.

### Workflow

Pull Request:

```text
terraform fmt -check
terraform validate
terraform plan
```

Deploy:

```text
terraform apply
```

`apply` deve ser protegido/manual ou associado a environment protegido. A automação não deve aplicar mudanças destrutivas sem revisão explícita.

---

## 26. CI/CD

### CI

GitHub Actions executa:

```text
pnpm install --frozen-lockfile
pnpm lint
pnpm typecheck
pnpm test
pnpm build
```

E2E e Terraform podem rodar em jobs separados.

### CD

Mudanças devem permitir identificar quais apps/packages foram afetados. Turborepo pode ser usado para reduzir trabalho desnecessário.

Cada app possui artefato independente:

```text
shell
dashboard-mfe
accounts-mfe
payments-mfe
insurance-mfe
bff
```

O Shell resolve URLs dos remotes por configuração de ambiente, nunca por hardcode espalhado em código de domínio.

---

## 27. Configuração e ambientes

Ambientes iniciais:

```text
local
production/demo
```

A escolha reduz custo e mantém o case reproduzível. Um ambiente intermediário só deve ser criado se houver necessidade concreta.

Variáveis públicas e privadas devem ser separadas. Secrets do BFF nunca entram no bundle do navegador.

---

## 28. Versionamento e compatibilidade

Contratos e módulos federados são APIs públicas.

Mudanças incompatíveis devem:

- ser detectadas;
- possuir migração coordenada;
- evitar deploy que quebre consumidor ainda ativo;
- manter compatibilidade durante a janela de rollout quando necessário.

A independência de deploy só é real se produtor e consumidor não precisarem ser publicados atomicamente em toda alteração.

---

## 29. Documentação e ADRs

`packages/context` é a fonte canônica.

Arquivos:

```text
README.md
SDD.md
PROJECT-TASKS.md
adr/
```

ADRs serão utilizados quando uma decisão relevante tiver alternativas reais, por exemplo:

- Single-SPA layout vs registro manual;
- estratégia de runtime config;
- estratégia de remote resolution;
- modelo de autenticação;
- estrutura física de S3/CloudFront;
- decisões com trade-offs relevantes de custo ou acoplamento.

O SDD descreve o estado arquitetural atual. ADR registra o histórico da decisão.

---

## 30. Fluxo de tasks e commits

Nenhuma implementação funcional começa antes do fechamento da fundação documental.

Fluxo:

```text
BACKLOG -> READY -> DOING -> REVIEW -> DONE
```

Toda mudança relevante deve estar associada a uma task `FMH-XXX`.

Padrão de commit:

```text
<tipo>: <TASK-ID> - <descrição em pt-BR>
```

Exemplos:

```text
feat: FMH-001 - consolida SDD e arquitetura do case
feat: FMH-005 - cria shell com orquestração single-spa
fix: FMH-029 - corrige reenvio da transferência
refactor: FMH-018 - separa bootstrap do fastify
```

Mudança arquitetural implementada sem atualização de SDD/ADR correspondente não deve ser considerada concluída.

---

## 31. Critérios arquiteturais de aceite

O case será considerado arquiteturalmente completo quando:

1. Shell montar múltiplos MFEs independentes;
2. lifecycles Single-SPA funcionarem corretamente;
3. pelo menos um módulo real for consumido via Module Federation;
4. React não for duplicado de forma problemática;
5. MFEs possuírem ownership de domínio e rota claros;
6. contratos Zod forem reutilizados no front e BFF;
7. formulário reutilizar contrato sem duplicação manual de regras;
8. BFF revalidar toda entrada não confiável;
9. regra dependente de servidor existir apenas no BFF/domínio;
10. PT-BR e inglês funcionarem em todos os MFEs previstos;
11. falha de um remote não derrubar o Shell;
12. ao menos uma jornada Playwright atravessar MFEs;
13. Core Web Vitals e bundles possuírem medição documentada;
14. CI executar gates obrigatórios;
15. apps possuírem builds e deploys independentes;
16. Shell resolver remotes em runtime por ambiente;
17. infraestrutura AWS estiver descrita por Terraform;
18. Terraform `plan` fizer parte do fluxo de revisão;
19. S3 + CloudFront publicarem Shell/MFEs;
20. BFF estiver integrado a Lambda + API Gateway;
21. logs backend estiverem disponíveis no CloudWatch;
22. existir budget/alerta básico de custo;
23. trade-offs relevantes estiverem registrados;
24. README PT-BR e README em inglês refletirem o estado final.

---

## 32. Decisões consolidadas

| Tema | Decisão |
| --- | --- |
| Idioma padrão | PT-BR |
| Idioma alternativo | inglês (`en`) |
| Front | React + TypeScript |
| Estilo | Tailwind CSS |
| Orquestração | Single-SPA |
| Runtime sharing | Webpack 5 Module Federation |
| Workspace | pnpm + Turborepo |
| Contratos | Zod |
| Formulários | React Hook Form + Zod |
| BFF | Fastify + Node.js |
| Server state | TanStack Query |
| Estado client-side | Zustand apenas quando necessário |
| i18n | i18next + react-i18next |
| Unit/component tests | Jest + RTL |
| API mocks | MSW |
| E2E | Playwright |
| Catálogo UI | Storybook |
| Front hosting | S3 + CloudFront |
| BFF hosting | Lambda + API Gateway |
| Logs | CloudWatch |
| IaC | Terraform |
| CI/CD | GitHub Actions |
| Controle de custo | AWS Budgets |
| Documentação | `packages/context` + ADRs |

---

## 33. Questões que permanecem deliberadamente abertas

Estas decisões exigem evidência durante a implementação e devem gerar task/ADR antes do código correspondente:

1. `single-spa-layout` vs registro manual;
2. implementação exata da integração Single-SPA + Module Federation;
3. formato final da runtime config dos remotes;
4. primeiro módulo federado com caso de uso real;
5. estratégia final de sessão/autenticação;
6. estrutura física de S3: buckets separados ou compartilhados por prefixo;
7. necessidade de persistência permanente além de fixtures/serviços fictícios;
8. necessidade de backend remoto para Terraform state no escopo individual.

Questão aberta não autoriza implementação improvisada: deve ser resolvida na task responsável antes ou junto da alteração.

---

## 34. Regra final

Este case deve demonstrar arquitetura, não quantidade de ferramentas.

Toda tecnologia ou abstração precisa responder pelo menos uma destas perguntas:

- qual problema resolve?
- qual fronteira melhora?
- qual risco reduz?
- qual capacidade arquitetural demonstra?
- qual evidência conseguiremos apresentar?

Se a resposta não for clara, a tecnologia não entra.