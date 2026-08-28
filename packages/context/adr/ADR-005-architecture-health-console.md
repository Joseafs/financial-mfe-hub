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
- lê `runtime-services.json` para descobrir serviços backend sem hardcode de domínio;
- exibe release/host selecionado para cada remote;
- testa o contrato federado `./lifecycles` dos quatro MFEs sem montá-los;
- sinaliza cada remote como `checking`, `online` ou `offline`;
- consulta o `/health` público do Fastify BFF e exibe o estado na mesma console;
- tolera o cold start do BFF gratuito com retries apenas no ambiente de produção/demo;
- mantém acesso direto às rotas `/dashboard`, `/accounts`, `/payments` e `/insurance`.

O caminho `/health` continua sendo o health check HTTP do BFF. O nome `/architecture-health` evita ambiguidade entre observabilidade da composição frontend e readiness/liveness do serviço backend.

## Runtime services

Além do `remote-manifest.json`, o Shell possui um segundo artefato de runtime:

```text
/runtime-services.json
```

Formato inicial:

```json
{
  "schemaVersion": 1,
  "environment": "production",
  "services": {
    "bff": {
      "baseUrl": "https://..."
    }
  }
}
```

No ambiente local o arquivo aponta para `http://localhost:4300`. Em produção ele é gerado durante o build do Shell a partir de `FMH_BFF_URL`, cujo valor é fornecido pelo Terraform usando a URL real do Render Web Service.

Assim como o remote manifest, `runtime-services.json` usa `Cache-Control: no-store`, pois funciona como um ponteiro de descoberta e não como artefato imutável.

## BFF health e CORS

`GET /health` é deliberadamente público e não transporta dados de usuário, credenciais ou informações sensíveis. Para permitir o probe da console hospedada em outro serviço Render, essa rota devolve `Access-Control-Allow-Origin: *` e `Cache-Control: no-store`.

Esse wildcard é restrito ao endpoint técnico de health. Endpoints de domínio e sessão continuam sujeitos à estratégia de CORS restrita da FMH-040.

## Consequências

### Positivas

- a POC continua demonstrável mesmo após a evolução visual e funcional do produto;
- falhas de carregamento de remote ficam visíveis sem exigir navegar por todos os domínios;
- a disponibilidade do BFF aparece na mesma visão técnica;
- a arquitetura publicada pode ser explicada por uma URL estável;
- URLs backend continuam configuráveis em runtime/build sem acoplar a console a um hostname fixo.

### Trade-offs

- a console carrega os quatro `remoteEntry.js` ao executar os probes, aumentando tráfego nessa rota técnica;
- o BFF gratuito pode permanecer em `checking` enquanto acorda do cold start;
- o resultado representa disponibilidade no momento do probe e não substitui monitoramento externo;
- a console deve permanecer livre de regras de produto.

## Validação

A task FMH-054 fica em `REVIEW` até validar localmente e no Render que:

```text
/ -> /architecture-health
/architecture-health -> console visível e quatro probes federados executados
BFF -> /health aparece online após eventual cold start
/dashboard -> dashboard-mfe monta
/accounts -> accounts-mfe monta
/payments -> payments-mfe monta
/insurance -> insurance-mfe monta
```
