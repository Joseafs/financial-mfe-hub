# ADR-006 — CD controlado pelo GitHub Actions no Render

## Status

Aceita para implementação na FMH-046.

## Contexto

O Financial MFE Hub possui seis deployables independentes no Render:

- Shell;
- Dashboard MFE;
- Accounts MFE;
- Payments MFE;
- Insurance MFE;
- Fastify BFF.

O Render permite auto-deploy por push, mas essa opção reduziria a visibilidade dos gates e poderia publicar um serviço antes da validação explícita do case. Como o objetivo do projeto é demonstrar arquitetura, rastreabilidade e deploy independente, a estratégia precisa deixar claro qual commit foi validado e qual serviço foi solicitado para publicação.

## Decisão

Usar **GitHub Actions como controlador do deploy** e manter `auto_deploy = false` nos recursos Terraform.

O workflow de deploy será manual durante o Architecture Gate e exigirá:

1. execução a partir de `main`;
2. instalação reproduzível via `pnpm-lock.yaml`;
3. `format:check`;
4. `lint`;
5. `typecheck`;
6. testes do workspace;
7. build do deployable selecionado;
8. acionamento exclusivo do deploy hook do serviço escolhido;
9. registro de serviço, ref e commit no summary do GitHub Actions.

Os hooks do Render permanecem como secrets do environment `production` e não entram no repositório.

## Por que não auto-deploy nativo agora

Auto-deploy é válido para produtos simples, mas nesta fase dificultaria demonstrar de forma explícita a separação entre validação e publicação. Também queremos evitar que qualquer alteração em `main` dispare automaticamente todos os recursos enquanto os filtros, smoke pós-deploy e rollback ainda estão sendo fechados.

## Independência

Cada execução recebe exatamente um serviço:

```text
shell
dashboard
accounts
payments
insurance
bff
```

Somente o package selecionado precisa ser buildado como artefato de deploy após os gates globais. O hook acionado é exclusivo daquele recurso Render.

## Evolução

A FMH-049 adicionará smoke pós-deploy. Depois dessa evidência, a estratégia pode evoluir para publicação automática baseada em mudanças afetadas sem alterar a decisão principal: GitHub Actions continua sendo o controlador e o Render continua com auto-deploy desabilitado.

## Consequências

### Positivas

- release rastreável ao SHA;
- deploy independente por serviço;
- gates explícitos antes da publicação;
- secrets isolados no GitHub Environment;
- comportamento coerente entre Static Sites e BFF.

### Trade-offs

- gates globais repetem parte do CI antes de um deploy manual;
- publicação fica um pouco mais lenta;
- smoke ainda é uma etapa posterior até FMH-049.

A repetição é deliberada nesta fase: um workflow de produção não assume que uma execução anterior de CI ainda representa exatamente a ref escolhida para o deploy.
