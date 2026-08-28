# Financial MFE Hub

[Português](./README.md) | [English](./README.en.md)

Case full-stack de arquitetura para um **hub financeiro fictício**. O projeto demonstra como **Micro Frontends**, contratos compartilhados, regras de negócio, interface, BFF, internacionalização, testes, observabilidade, CI/CD e infraestrutura podem evoluir juntos dentro de um monorepo.

> Projeto educacional e de portfólio. Os dados, regras e fluxos financeiros são fictícios e não representam uma instituição financeira real.

## Objetivo

Construir um case técnico próximo de cenários corporativos de alta criticidade, com responsabilidades explícitas, deploy independente por aplicação e decisões arquiteturais documentadas antes da implementação.

O projeto explora:

- React + TypeScript em múltiplos Micro Frontends;
- orquestração com Single-SPA;
- composição runtime com Webpack Module Federation;
- monorepo com pnpm + Turborepo;
- contratos Zod compartilhados entre front-end, BFF e testes;
- formulários com Formik + Zod;
- Context API para estado de fluxo/domínio local;
- BFF em Fastify + Node.js;
- internacionalização com PT-BR como idioma padrão e inglês como alternativa;
- testes unitários, integração, contrato e E2E;
- Core Web Vitals, acessibilidade e observabilidade;
- CI/CD com GitHub Actions;
- infraestrutura principal no Render declarada com Terraform.

## Arquitetura

```mermaid
flowchart LR
  User["Usuário"] --> Static["Render Static Sites\nShell + MFEs"]
  Static --> Shell["Shell / Root Config\nSingle-SPA"]

  Shell --> Dashboard["Dashboard MFE"]
  Shell --> Accounts["Accounts MFE"]
  Shell --> Payments["Payments MFE"]
  Shell --> Insurance["Insurance MFE"]

  Dashboard -. "Module Federation" .-> Shared["Módulos federados"]
  Accounts -. "Module Federation" .-> Shared
  Payments -. "Module Federation" .-> Shared
  Insurance -. "Module Federation" .-> Shared

  Dashboard --> BFF["Render Web Service\nFastify BFF"]
  Accounts --> BFF
  Payments --> BFF
  Insurance --> BFF

  BFF --> Services["Serviços financeiros fictícios"]

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

  Terraform["Terraform\nrender-oss/render"] -. "provisiona" .-> Static
  Terraform -. "provisiona" .-> BFF
```

<details>
<summary><strong>Como seria essa arquitetura na AWS?</strong></summary>

A arquitetura principal do projeto continua sendo **Terraform + Render**. A visão abaixo existe apenas como comparação arquitetural e não representa a infraestrutura utilizada pelo case principal.

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

  API --> BFF["Lambda\nFastify BFF"]
  BFF --> Services["Serviços financeiros fictícios"]
  BFF --> Observability["CloudWatch\nlogs + métricas"]

  Terraform["Terraform\nAWS Provider"] -. "provisiona" .-> CDN
  Terraform -. "provisiona" .-> Static
  Terraform -. "provisiona" .-> API
  Terraform -. "provisiona" .-> BFF
  Terraform -. "provisiona" .-> Observability
```

| Case principal | Alternativa AWS |
| --- | --- |
| Render Static Sites | S3 + CloudFront |
| Render Web Service | Lambda + API Gateway |
| Logs e métricas do Render | CloudWatch |
| Terraform `render-oss/render` | Terraform AWS Provider |

Essa trilha poderá ser implementada futuramente para comparar **PaaS vs cloud primitives**, custo operacional, deploy e portabilidade.

</details>

## Responsabilidades principais

**Single-SPA** controla o ciclo de vida e decide quais aplicações são montadas conforme rota e contexto.

**Module Federation** permite expor e consumir módulos públicos em runtime, mantendo contratos explícitos entre host e remotes.

**Turborepo** coordena dependências, cache e tarefas do monorepo. Ele não substitui a arquitetura de Micro Frontends.

**Fastify BFF** centraliza adaptação de dados, validação autoritativa, autenticação, autorização, composição de respostas e isolamento de serviços downstream.

**Zod** define contratos runtime reutilizados entre front-end, BFF e testes. O front valida cedo por UX; o servidor valida novamente e permanece a autoridade.

**Formik** controla estado e lifecycle dos formulários. O projeto mantém Zod como fonte canônica das regras portáveis e utiliza Context API dentro de owners claros.

**Terraform** descreve a infraestrutura realmente utilizada no Render, permitindo revisar mudanças com `plan` antes de qualquer aplicação.

## Stack planejada

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
- Zustand somente para estado client-side realmente global
- Formik
- Zod
- i18next + react-i18next

### BFF

- Node.js
- Fastify
- TypeScript
- Zod
- Swagger / OpenAPI
- logging estruturado

### Monorepo e qualidade

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

### Infraestrutura e entrega

- Render Static Sites
- Render Web Service
- Terraform com provider `render-oss/render`
- GitHub Actions

AWS permanece como trilha opcional de comparação arquitetural, não como requisito do funcionamento principal.

## Estrutura alvo

```text
apps/
├── shell/                 root config e orquestração Single-SPA
├── dashboard-mfe/         visão consolidada
├── accounts-mfe/          contas, cartões e limites
├── payments-mfe/          PIX, boleto e transferências fictícias
├── insurance-mfe/         seguros e simulações fictícias
└── bff/                   Fastify BFF

packages/
├── context/               SDD, ADRs, decisões e fluxo de tasks
├── contracts/             schemas Zod e tipos inferidos
├── ui/                    componentes e tokens compartilhados
├── auth/                  contratos e primitivas de autenticação
├── i18n/                  configuração e contratos de idioma
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

## Validação compartilhada

```mermaid
flowchart LR
  Contracts["Schema Zod único"] --> Form["Formik"]
  Contracts --> BFF["Fastify BFF"]
  Form -->|"feedback imediato"| User["Usuário"]
  Form -->|"request"| BFF
  BFF -->|"validação autoritativa"| Domain["Regras / serviços"]
```

Exemplos:

- `valor > 0`: contrato Zod compartilhado;
- formato de documento ou e-mail: contrato Zod compartilhado;
- saldo disponível suficiente: regra de domínio/BFF;
- autorização para executar operação: regra do BFF.

## Estado e Context API

Context API é utilizada dentro de um fluxo ou domínio com ownership claro, por exemplo dentro de `payments-mfe`.

Ela não deve virar um contexto global compartilhando internals de Accounts, Payments e Insurance. Comunicação cross-MFE deve preferir URL, BFF/server state, eventos públicos ou contratos federados explícitos.

## Internacionalização

O produto usa **PT-BR como idioma padrão** e **inglês (`en`) como alternativa**.

A preferência de idioma é coordenada pelo Shell, enquanto cada MFE mantém seus próprios namespaces de tradução. Alterações de idioma devem utilizar um contrato público e não depender de stores internas de outro MFE.

## Estratégia de deploy

O ambiente oficial do case é o Render.

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

Cada aplicação possui serviço, artefato e evolução independentes. O Shell resolve as URLs dos remotes por configuração de ambiente.

## Terraform

A infraestrutura Render será representada em `infrastructure/terraform` usando o provider oficial `render-oss/render`.

O fluxo previsto inclui:

```text
terraform fmt -check
terraform validate
terraform plan
terraform apply
```

`plan` faz parte da revisão. `apply` deve ser protegido e secrets nunca são versionados.

## Case opcional AWS

Após a arquitetura principal estar funcional no Render, uma trilha opcional poderá comparar a mesma solução com primitives AWS, como S3, CloudFront, Lambda, API Gateway e CloudWatch.

Essa trilha não é requisito para considerar o projeto concluído.

## Documentação

A documentação canônica fica em [`packages/context`](./packages/context/README.md):

- [`SDD.md`](./packages/context/SDD.md): arquitetura, fronteiras, decisões, segurança, performance, i18n, CI/CD e infraestrutura;
- [`PROJECT-TASKS.md`](./packages/context/PROJECT-TASKS.md): fluxo incremental e critérios de conclusão;
- `adr/`: decisões arquiteturais que precisem de registro histórico próprio.

## Status

🟢 **SDD 1.0 e fundação documental consolidados.**

A próxima etapa de implementação é `FMH-002 — Inicializar pnpm workspace e Turborepo`.