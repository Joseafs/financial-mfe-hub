# Desenvolvimento local — Financial MFE Hub

Este documento fixa a convenção mínima do ambiente local durante o **Architecture Validation First**.

## Portas

| Serviço | Porta | URL |
| --- | ---: | --- |
| Shell | 4200 | `http://localhost:4200` |
| Dashboard MFE | 4201 | `http://localhost:4201` |
| Accounts MFE | 4202 | `http://localhost:4202` |
| Payments MFE | 4203 | `http://localhost:4203` |
| Insurance MFE | 4204 | `http://localhost:4204` |
| Fastify BFF | 4300 | `http://localhost:4300` |

## Regras

- `pnpm dev` na raiz deve subir os processos de desenvolvimento registrados no workspace via Turborepo;
- cada aplicação possui porta própria e deve ser executável isoladamente;
- URLs dos remotes ficam centralizadas no Shell e serão substituídas por runtime config na `FMH-013`;
- MFEs não importam `src` interno de outros MFEs;
- packages compartilhados só são consumidos por entrypoints públicos;
- `.env.example` documenta valores públicos esperados e nunca contém segredo;
- o BFF é a única camada apta a receber secrets de backend quando eles surgirem.

## Identidade visual dos stubs

Durante o Architecture Smoke Test:

```text
Dashboard -> azul
Accounts  -> verde
Payments  -> roxo
Insurance -> laranja
```

Cada stub deve mostrar ao menos nome da aplicação, versão/build e ambiente. Essa identidade serve para diagnóstico visual e não define o design system final.

## Objetivo

O ambiente local existe para provar lifecycle, composição, build e integração antes de qualquer produto financeiro completo. A configuração deve permanecer simples o suficiente para que uma falha de arquitetura seja visível e reproduzível.
