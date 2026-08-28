# Financial MFE Hub

[Português](./README.md) | [English](./README.en.md)

Full-stack architecture case for a **fictional financial hub**. The project demonstrates how **Micro Frontends**, shared contracts, business rules, UI, a BFF, internationalization, testing, observability, CI/CD and infrastructure can evolve together inside a monorepo.

> Educational and portfolio project. All financial data, rules and flows are fictional and do not represent a real financial institution.

## Goal

Build a technical case close to high-criticality corporate scenarios, with explicit responsibilities, independent deployment per application and architectural decisions documented before implementation.

The project explores:

- React + TypeScript across multiple Micro Frontends;
- orchestration with Single-SPA;
- runtime composition with Webpack Module Federation;
- a pnpm + Turborepo monorepo;
- shared Zod contracts across front-end, BFF and tests;
- forms with Formik + Zod;
- Context API for local flow/domain state;
- a Fastify + Node.js BFF;
- internationalization with PT-BR as the default locale and English as an alternative;
- unit, integration, contract and E2E tests;
- Core Web Vitals, accessibility and observability;
- CI/CD with GitHub Actions;
- the primary Render infrastructure declared with Terraform.

## Architecture

The MFE colors in the diagram are also used during the initial architecture-validation phase so it is immediately clear which application was mounted.

```mermaid
flowchart LR
  User["User"] --> Static["Render Static Sites\nShell + MFEs"]
  Static --> Shell["Shell / Root Config\nSingle-SPA"]

  Shell --> Dashboard["Dashboard MFE"]
  Shell --> Accounts["Accounts MFE"]
  Shell --> Payments["Payments MFE"]
  Shell --> Insurance["Insurance MFE"]

  Dashboard -. "Module Federation" .-> Shared["Federated modules"]
  Accounts -. "Module Federation" .-> Shared
  Payments -. "Module Federation" .-> Shared
  Insurance -. "Module Federation" .-> Shared

  Dashboard --> BFF["Render Web Service\nFastify BFF"]
  Accounts --> BFF
  Payments --> BFF
  Insurance --> BFF

  BFF --> Services["Fictional financial services"]

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

  Terraform["Terraform\nrender-oss/render"] -. "provisions" .-> Static
  Terraform -. "provisions" .-> BFF

  classDef user fill:#374151,stroke:#9CA3AF,color:#FFFFFF;
  classDef render fill:#0F766E,stroke:#5EEAD4,color:#FFFFFF;
  classDef shell fill:#0F172A,stroke:#38BDF8,color:#FFFFFF;
  classDef dashboard fill:#1D4ED8,stroke:#93C5FD,color:#FFFFFF;
  classDef accounts fill:#15803D,stroke:#86EFAC,color:#FFFFFF;
  classDef payments fill:#7C3AED,stroke:#C4B5FD,color:#FFFFFF;
  classDef insurance fill:#C2410C,stroke:#FDBA74,color:#FFFFFF;
  classDef shared fill:#334155,stroke:#94A3B8,color:#FFFFFF;
  classDef contracts fill:#854D0E,stroke:#FDE68A,color:#FFFFFF;
  classDef i18n fill:#0E7490,stroke:#67E8F9,color:#FFFFFF;
  classDef bff fill:#4338CA,stroke:#A5B4FC,color:#FFFFFF;
  classDef services fill:#374151,stroke:#D1D5DB,color:#FFFFFF;
  classDef terraform fill:#5B21B6,stroke:#C4B5FD,color:#FFFFFF;

  class User user;
  class Static render;
  class Shell shell;
  class Dashboard dashboard;
  class Accounts accounts;
  class Payments payments;
  class Insurance insurance;
  class Shared shared;
  class Contracts contracts;
  class I18n i18n;
  class BFF bff;
  class Services services;
  class Terraform terraform;
```

<details>
<summary><strong>What would this architecture look like on AWS?</strong></summary>

The primary architecture remains **Terraform + Render**. The diagram below is only an architectural comparison and does not represent the infrastructure used by the main case.

```mermaid
flowchart LR
  User["User"] --> CDN["CloudFront"]
  CDN --> Static["S3\nShell + MFEs"]
  Static --> Shell["Shell / Root Config\nSingle-SPA"]

  Shell --> Dashboard["Dashboard MFE"]
  Shell --> Accounts["Accounts MFE"]
  Shell --> Payments["Payments MFE"]
  Shell --> Insurance["Insurance MFE"]

  Dashboard -. "Module Federation" .-> Shared["Federated modules"]
  Accounts -. "Module Federation" .-> Shared
  Payments -. "Module Federation" .-> Shared
  Insurance -. "Module Federation" .-> Shared

  Dashboard --> API["API Gateway"]
  Accounts --> API
  Payments --> API
  Insurance --> API

  API --> BFF["Lambda\nFastify BFF"]
  BFF --> Services["Fictional financial services"]
  BFF --> Observability["CloudWatch\nlogs + metrics"]

  Terraform["Terraform\nAWS Provider"] -. "provisions" .-> CDN
  Terraform -. "provisions" .-> Static
  Terraform -. "provisions" .-> API
  Terraform -. "provisions" .-> BFF
  Terraform -. "provisions" .-> Observability

  classDef user fill:#374151,stroke:#9CA3AF,color:#FFFFFF;
  classDef aws fill:#B45309,stroke:#FCD34D,color:#FFFFFF;
  classDef shell fill:#0F172A,stroke:#38BDF8,color:#FFFFFF;
  classDef dashboard fill:#1D4ED8,stroke:#93C5FD,color:#FFFFFF;
  classDef accounts fill:#15803D,stroke:#86EFAC,color:#FFFFFF;
  classDef payments fill:#7C3AED,stroke:#C4B5FD,color:#FFFFFF;
  classDef insurance fill:#C2410C,stroke:#FDBA74,color:#FFFFFF;
  classDef shared fill:#334155,stroke:#94A3B8,color:#FFFFFF;
  classDef bff fill:#4338CA,stroke:#A5B4FC,color:#FFFFFF;
  classDef services fill:#374151,stroke:#D1D5DB,color:#FFFFFF;
  classDef terraform fill:#5B21B6,stroke:#C4B5FD,color:#FFFFFF;

  class User user;
  class CDN,Static,API,Observability aws;
  class Shell shell;
  class Dashboard dashboard;
  class Accounts accounts;
  class Payments payments;
  class Insurance insurance;
  class Shared shared;
  class BFF bff;
  class Services services;
  class Terraform terraform;
```

| Main case | AWS alternative |
| --- | --- |
| Render Static Sites | S3 + CloudFront |
| Render Web Service | Lambda + API Gateway |
| Render logs and metrics | CloudWatch |
| Terraform `render-oss/render` | Terraform AWS Provider |

This optional path may later be implemented to compare **PaaS vs cloud primitives**, operational cost, deployment and portability.

</details>

## Architecture Validation First

Before building a large financial application, the project validates the architecture with the smallest possible amount of product code.

The first milestone uses **simple colored visual stubs**:

| Application | Initial color | Goal during this phase |
| --- | --- | --- |
| `dashboard-mfe` | blue | prove mount/unmount and route ownership |
| `accounts-mfe` | green | prove a second independent remote |
| `payments-mfe` | purple | prove parallel domain evolution |
| `insurance-mfe` | orange | prove composition scales |

Each stub only exposes useful diagnostics such as MFE name, version/build and environment. The initial identity does not define the final design system.

```text
workspace
  ↓
shell + colored MFE stubs
  ↓
BFF /health
  ↓
CI/CD
  ↓
Terraform + Render
  ↓
runtime config
  ↓
smoke test + rollback
  ↓
ARCHITECTURE GATE ✅
  ↓
functional domain evolution
```

The initial phase must prove Single-SPA, Module Federation, independent builds/deployments, runtime remotes, fallback, CI/CD, Terraform, Render, smoke tests and rollback **before** significant effort goes into business rules, dashboards or complete forms.

The decision is recorded in [`ADR-001 — Architecture Validation First`](./packages/context/adr/ADR-001-architecture-validation-first.md).

## Main responsibilities

**Single-SPA** controls application lifecycle and decides which MFEs are mounted according to route and context.

**Module Federation** exposes and consumes public modules at runtime while keeping explicit contracts between hosts and remotes.

**Turborepo** coordinates monorepo dependencies, cache and tasks. It does not replace the Micro Frontend architecture.

**Fastify BFF** centralizes data adaptation, authoritative validation, authentication, authorization, response composition and downstream service isolation.

**Zod** defines runtime contracts reused across front-end, BFF and tests. The client validates early for UX; the server validates again and remains authoritative.

**Formik** controls form state and lifecycle. Zod remains the canonical source for portable validation rules, while Context API is used inside clearly owned boundaries.

**Terraform** describes the infrastructure actually used on Render and allows infrastructure changes to be reviewed with `plan` before applying them.

## Planned stack

### Front-end

- React
- TypeScript
- Tailwind CSS
- Single-SPA
- Webpack 5
- Module Federation
- React Router
- TanStack Query
- Context API
- Zustand only for truly global client-side state within a clear owner
- Formik
- Zod
- i18next + react-i18next

### BFF

- Node.js
- Fastify
- TypeScript
- Zod
- Swagger / OpenAPI
- structured logging

### Monorepo and quality

- pnpm workspaces
- Turborepo
- ESLint
- Prettier
- Jest
- React Testing Library
- MSW
- Faker
- Playwright
- Storybook

### Infrastructure and delivery

- Render Static Sites
- Render Web Service
- Terraform with the `render-oss/render` provider
- GitHub Actions

AWS remains an optional architectural comparison path and is not required for the main case to work.

## Target structure

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
├── contracts/
├── ui/
├── auth/
├── i18n/
├── eslint-config/
└── typescript-config/

infrastructure/
└── terraform/
    ├── modules/
    │   ├── static-site/
    │   ├── web-service/
    │   └── shared/
    └── environments/
        └── production/
```

## Shared validation

The same Zod contracts are reused at relevant boundaries. Formik uses an adapter that maps `ZodError` into Formik errors, while the BFF validates every untrusted request again.

Server-dependent rules such as available balance, account existence and authorization remain on the BFF/domain side.

## State and Context API

Context API is used inside a flow or domain with clear ownership, for example inside `payments-mfe`.

It must not become a global context exposing Accounts, Payments and Insurance internals. Cross-MFE communication should prefer URL state, BFF/server state, public events or explicit federated contracts.

## Internationalization

The product uses **PT-BR as the default locale** and **English (`en`) as an alternative**.

The Shell coordinates the active locale while each MFE owns its translation namespaces. Locale changes must use a public contract and must not depend on another MFE's internal store.

## Deployment strategy

Render is the official runtime environment for the case.

```text
GitHub Actions
      │
      ├── shell ───────────────┐
      ├── dashboard-mfe ───────┤
      ├── accounts-mfe ────────┤──> Render Static Sites
      ├── payments-mfe ────────┤
      └── insurance-mfe ───────┘

      └── bff ───────────────────> Render Web Service
```

Each application has an independent service, artifact and evolution path. The Shell resolves remote URLs through environment/runtime configuration.

## Terraform

Render infrastructure is represented under `infrastructure/terraform` using the `render-oss/render` provider.

The expected flow includes:

```text
terraform fmt -check
terraform validate
terraform plan
terraform apply
```

`plan` is part of review. `apply` must be protected and secrets are never committed.

## Documentation

Canonical technical documentation lives in [`packages/context`](./packages/context/README.md):

- [`SDD.md`](./packages/context/SDD.md): architecture, boundaries, decisions, security, performance, i18n, CI/CD and infrastructure;
- [`CI-CD.md`](./packages/context/CI-CD.md): pipelines, quality gates, deployment, smoke tests and rollback;
- [`PROJECT-TASKS.md`](./packages/context/PROJECT-TASKS.md): incremental implementation flow and completion criteria;
- [`ADR-001`](./packages/context/adr/ADR-001-architecture-validation-first.md): architecture validation before functional evolution.

## Status

🟢 **SDD 1.0 and the documentation foundation are consolidated.**

The next step is `FMH-002`, following the **Architecture Validation First** critical path until the Architecture Gate.