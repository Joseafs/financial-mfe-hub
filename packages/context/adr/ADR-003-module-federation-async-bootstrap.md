# ADR-003 — Module Federation com bootstrap assíncrono

**Status:** Accepted  
**Data:** 2026-08-28

## Contexto

O Shell e os Micro Frontends utilizam Webpack Module Federation para compartilhar dependências de runtime como React e React DOM.

Durante a primeira validação local, o Shell apresentou o erro:

```text
Shared module is not available for eager consumption
```

O problema ocorre quando um módulo compartilhado é consumido de forma síncrona antes de o sharing scope do Module Federation concluir sua inicialização.

Em uma arquitetura com remotes carregados em runtime, o entrypoint inicial não deve assumir que dependências federadas já estão disponíveis no mesmo tick de execução.

## Decisão

Todo entrypoint participante da composição federada deve criar uma **async bootstrap boundary**.

No Shell:

```text
src/index.ts
  ↓ dynamic import
src/root-config.ts
  ↓
Single-SPA + remotes
```

Nos remotes:

```text
src/index.ts
  ↓ dynamic import
src/lifecycles.tsx
```

O Shell não importa React ou React DOM apenas para forçar o compartilhamento. Shared dependencies devem ser resolvidas pelo sharing scope do Module Federation no momento correto do lifecycle.

## Consequências

### Positivas

- elimina consumo eager antes da inicialização do share scope;
- reduz comportamento intermitente durante bootstrap e transições;
- aproxima o case do padrão recomendado para hosts/remotes federados;
- mantém o erro de bootstrap isolado e diagnosticável;
- evita mascarar o problema com `eager: true` apenas para fazer o runtime iniciar.

### Trade-off

O bootstrap ganha um boundary assíncrono adicional e o entrypoint passa a ser propositalmente mínimo.

Esse custo é aceito porque a composição federada já é assíncrona por natureza.

## Regra

Não utilizar `eager: true` como correção automática para problemas de inicialização de shared modules.

Antes disso, verificar:

1. async bootstrap boundary;
2. versões e singleton strategy;
3. ordem de inicialização do container/share scope;
4. duplicação de React/React DOM;
5. imports síncronos no entrypoint.

## Relação com o Architecture Gate

A arquitetura só passa pelo Architecture Gate quando navegação entre Shell e remotes ocorre sem erros de runtime transitórios.

Erros que aparecem por poucos milissegundos durante uma transição continuam sendo considerados falhas arquiteturais e devem bloquear o gate.
