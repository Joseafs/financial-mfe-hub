# FMH-042 — Evidência de builds independentes

Status de implementação: `REVIEW`

## Estratégia

O pipeline de build usa o grafo do Turborepo como fonte de verdade para identificar os pacotes afetados por uma mudança.

Em Pull Requests e pushes na `main`:

```text
git range
  ↓
turbo ls --affected
  ↓
turbo run build --affected
```

O checkout usa histórico completo (`fetch-depth: 0`) para evitar que um clone raso faça o Turborepo considerar todo o workspace como alterado.

Em execução manual (`workflow_dispatch`), o pipeline executa o build completo para permitir uma verificação deliberada de todo o monorepo.

## Critérios cobertos

- cada app continua possuindo script de build isolado;
- o Turborepo calcula pacotes afetados e dependentes pelo próprio grafo;
- mudança em um MFE não exige build indiscriminado dos demais quando não há dependência entre eles;
- mudanças em packages compartilhados propagam impacto aos consumidores;
- os artefatos gerados pelos pacotes afetados são preservados pelo GitHub Actions.

## Comandos de diagnóstico

```bash
pnpm exec turbo ls --affected
pnpm exec turbo run build --affected
pnpm exec turbo run build --filter=@financial-mfe/payments
```

A task pode ser promovida para `DONE` após um run verde do workflow `Build` com esta estratégia.
