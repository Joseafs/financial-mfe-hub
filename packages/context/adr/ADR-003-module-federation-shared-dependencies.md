# ADR-003 — Shared dependencies do Module Federation

**Status:** Accepted  
**Data:** 2026-08-28

## Contexto

O Shell e os MFEs usam Webpack Module Federation para carregar lifecycles em runtime. Compartilhar dependências demais reduz independência e aproxima a solução de um monólito distribuído; compartilhar dependências de runtime críticas de menos pode duplicar React e quebrar hooks/contextos.

## Decisão

A configuração inicial compartilha apenas dependências de runtime que precisam de identidade coerente:

```text
react
react-dom
single-spa
single-spa-react
```

Todas são configuradas como `singleton` durante o Architecture Smoke Test.

Packages de workspace como `packages/contracts`, `packages/ui` e `packages/i18n` **não são automaticamente federados**. O padrão para eles continua sendo dependência de build do workspace. Um package só vira módulo federado quando existir um caso runtime explícito e contrato público justificável.

## Consequências

- reduz risco de múltiplas instâncias de React;
- mantém a superfície pública do federation pequena;
- evita usar Module Federation como substituto genérico do monorepo;
- preserva deploy independente sem compartilhar internals por conveniência.

## Regra

Adicionar nova dependência ao bloco `shared` exige responder:

1. precisa realmente ter identidade única em runtime?
2. qual problema concreto a duplicação causa?
3. qual impacto isso cria na compatibilidade entre versões?

Se não houver resposta objetiva, a dependência não entra no compartilhamento runtime.
