# ADR-001 — Architecture Validation First

**Status:** Accepted  
**Data:** 2026-08-28

## Contexto

O Financial MFE Hub possui uma arquitetura deliberadamente rica: Single-SPA, Module Federation, múltiplos Micro Frontends, BFF, CI/CD, Terraform e Render.

Construir primeiro uma aplicação financeira completa adicionaria muito código de produto antes de provar os pontos de maior risco arquitetural: composição entre MFEs, lifecycle, runtime remotes, deploy independente, CI/CD, provisionamento, fallback, rollback e operação.

A prioridade do case é demonstrar engenharia e decisões arquiteturais verificáveis, não maximizar quantidade de telas ou regras de negócio.

## Decisão

Adotar **Architecture Validation First** como estratégia oficial de implementação.

Antes da evolução funcional dos domínios, o projeto deve publicar uma versão mínima da plataforma composta por stubs visuais extremamente simples.

```text
workspace
  ↓
shell
  ↓
MFEs visuais mínimos
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
evolução funcional dos domínios
```

A primeira milestone prova a plataforma; não tenta provar o produto.

## Stubs visuais

Cada MFE inicia como um bloco simples com nome, versão/build e identidade visual própria.

| Aplicação | Identidade inicial |
| --- | --- |
| `dashboard-mfe` | azul |
| `accounts-mfe` | verde |
| `payments-mfe` | roxo |
| `insurance-mfe` | laranja |
| `shell` | azul escuro / neutro |
| `bff` | índigo / neutro |
| Terraform / infraestrutura | roxo Terraform / tons neutros |

A mesma semântica de cores deve ser usada nos diagramas Mermaid quando isso melhorar a leitura.

As cores são uma ferramenta de diagnóstico visual durante a fase arquitetural e não definem o design system final do produto.

## Conteúdo mínimo de cada stub

Exemplo conceitual:

```text
┌────────────────────────────────┐
│ PAYMENTS MFE                   │
│ architecture stub              │
│ version: 0.0.1                 │
│ environment: local / demo      │
└────────────────────────────────┘
```

Não é necessário implementar nessa fase:

- regras financeiras completas;
- formulários finais;
- dashboards sofisticados;
- design system completo;
- persistência sem necessidade arquitetural;
- dados de domínio além do mínimo necessário para validar contratos e comunicação.

## Architecture Gate

A evolução funcional relevante só começa depois que a plataforma mínima provar, em ambiente publicado:

1. Shell operacional;
2. quatro MFEs montando e desmontando de forma independente;
3. Single-SPA funcionando entre rotas;
4. Module Federation funcionando em pelo menos um caso real mínimo;
5. React/React DOM sem duplicação problemática;
6. BFF publicado com `/health`;
7. builds independentes;
8. CI com quality gates;
9. Render provisionado via Terraform;
10. URLs de remotes resolvidas por runtime configuration;
11. deploy independente por aplicação;
12. fallback quando um remote falhar;
13. smoke test pós-deploy;
14. procedimento de rollback validado ou demonstrável;
15. logs/health suficientes para diagnosticar uma falha básica.

## Trilha crítica inicial

A ordem numérica das tasks continua preservada para rastreabilidade, mas a execução inicial prioriza este caminho:

```text
FMH-002 workspace
FMH-003 configs compartilhadas
FMH-004 ambiente local
FMH-005 shell
FMH-006 estratégia Single-SPA
FMH-007 dashboard stub azul
FMH-008 accounts stub verde
FMH-025 payments stub roxo
FMH-030 insurance stub laranja
FMH-009 fallback
FMH-010 Module Federation
FMH-011 shared dependencies
FMH-012 módulo federado mínimo real
FMH-013 runtime remote config
FMH-018 BFF /health
FMH-041 CI
FMH-042 builds independentes
FMH-043 Terraform + Render
FMH-044 Static Sites
FMH-045 BFF Web Service
FMH-046 CD
FMH-047 runtime manifest/cache
FMH-049 smoke pós-deploy
FMH-048 rollback
```

Depois do **Architecture Gate**, o projeto aprofunda contratos, domínio financeiro, formulários, autenticação, i18n, testes de negócio, performance e observabilidade avançada.

## Consequências positivas

- reduz código descartável antes da validação arquitetural;
- reduz tempo e tokens gastos em produto antes de a plataforma estar comprovada;
- antecipa riscos de MFE, deploy e infraestrutura;
- produz evidência técnica cedo;
- torna falhas visuais e de roteamento fáceis de identificar;
- permite evoluir o domínio sobre uma fundação já publicada e observável.

## Trade-offs

- a primeira versão publicada parecerá propositalmente simples;
- task IDs de fases posteriores podem ser executadas cedo por fazerem parte da trilha arquitetural;
- a UI inicial não representa a qualidade visual final do produto.

Esses trade-offs são aceitos porque o objetivo inicial é reduzir risco técnico e provar a arquitetura com o menor volume de implementação possível.

## Regra de evolução

Nenhuma abstração adicional deve entrar apenas para sofisticar o Architecture Smoke Test.

A fase termina quando a arquitetura está demonstravelmente funcional. A partir daí, cada stub pode evoluir incrementalmente para seu domínio real sem alterar desnecessariamente a plataforma já validada.
