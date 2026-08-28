# ADR-005 — Preservar Architecture Health Console

**Status:** Aceito

**Task:** FMH-054

## Contexto

A primeira POC publicada do Financial MFE Hub usa a página principal do Shell como uma visualização explícita da arquitetura: Shell, quatro Micro Frontends, runtime manifest, release identity, fallback e composição Single-SPA/Module Federation.

Com a evolução do case para produto financeiro, essa página deixaria de ser uma landing page adequada. Ainda assim, ela é uma evidência importante da POC e um recurso útil para demonstração técnica, diagnóstico e entrevistas.

A tag `v0.1.0` preserva o snapshot histórico da POC. Precisamos também de uma visualização viva que continue acompanhando a arquitetura nas versões seguintes.

## Decisão

O Shell passa a reservar a rota:

```text
/architecture-health
```

Essa rota é de responsabilidade exclusiva do Shell e não pertence a nenhum domínio financeiro.

Enquanto a landing page de produto ainda não existir, `/` redireciona internamente para `/architecture-health`.

A Architecture Health Console:

- preserva a visualização arquitetural construída na POC;
- lê o runtime manifest já carregado pelo Shell;
- exibe release/host selecionado para cada remote;
- testa o contrato federado `./lifecycles` dos quatro MFEs sem montá-los;
- sinaliza cada remote como `checking`, `online` ou `offline`;
- mantém acesso direto às rotas `/dashboard`, `/accounts`, `/payments` e `/insurance`;
- não substitui o endpoint `/health` do BFF.

O caminho `/health` permanece reservado para health checks HTTP de serviços backend. O nome `/architecture-health` evita ambiguidade entre observabilidade do frontend e readiness/liveness do BFF.

## Consequências

### Positivas

- a POC continua demonstrável mesmo após a evolução visual e funcional do produto;
- falhas de carregamento de remote ficam visíveis sem exigir navegar por todos os domínios;
- a arquitetura publicada pode ser explicada por uma URL estável;
- a mesma página pode incorporar futuramente o health check público do BFF, smoke status e release/rollback metadata.

### Trade-offs

- a console carrega os quatro `remoteEntry.js` ao executar os probes, aumentando tráfego nessa rota técnica;
- o resultado representa disponibilidade do frontend e do contrato federado no momento do probe, não substituindo monitoramento externo;
- a console deve permanecer livre de regras de produto.

## Validação

A task FMH-054 fica em `REVIEW` até validar localmente e no Render que:

```text
/ -> /architecture-health
/architecture-health -> console visível e quatro probes executados
/dashboard -> dashboard-mfe monta
/accounts -> accounts-mfe monta
/payments -> payments-mfe monta
/insurance -> insurance-mfe monta
```
