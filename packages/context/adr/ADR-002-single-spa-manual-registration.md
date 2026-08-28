# ADR-002 — Registro manual no Single-SPA

**Status:** Accepted  
**Data:** 2026-08-28

## Contexto

O Architecture Smoke Test precisa tornar explícito quais MFEs são registrados, quais rotas os ativam e qual remote Module Federation fornece seus lifecycles.

As alternativas iniciais eram:

- registro manual com `registerApplication`;
- `single-spa-layout` para declarar layout e aplicações.

## Decisão

Usar **registro manual** na primeira arquitetura.

O Shell registra explicitamente:

```text
/dashboard -> dashboard-mfe
/accounts  -> accounts-mfe
/payments  -> payments-mfe
/insurance -> insurance-mfe
```

Cada `app()` resolve um módulo público de lifecycles exposto pelo respectivo remote.

## Motivos

- deixa lifecycle e ownership visíveis no código;
- reduz abstrações durante o Architecture Validation First;
- facilita diagnosticar mount/unmount e falhas de remote;
- evita adicionar uma camada de layout antes de existir necessidade real;
- mantém a possibilidade de migrar para `single-spa-layout` se o Shell ganhar composição estrutural complexa.

## Consequências

O Shell assume a responsabilidade explícita de registrar aplicações e rotas. Isso é aceitável enquanto o número de MFEs e regiões de layout permanecer pequeno.

Se o registro manual crescer a ponto de produzir configuração repetitiva ou múltiplas regiões simultâneas difíceis de manter, a decisão deve ser reavaliada em novo ADR.
