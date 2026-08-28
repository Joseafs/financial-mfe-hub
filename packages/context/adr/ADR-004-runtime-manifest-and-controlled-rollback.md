# ADR-004 — Runtime Manifest e rollback controlado de MFEs

**Status:** Accepted  
**Data:** 2026-08-28

## Contexto

O Financial MFE Hub precisa provar que os Micro Frontends possuem release identity e evolução independentes sem transformar o Shell em um artefato acoplado às URLs de cada remote.

Hardcode de `remoteEntry.js` dentro do bundle do Shell obrigaria uma nova publicação do Shell sempre que uma URL de remote mudasse e reduziria o valor do deploy independente.

Também é necessário distinguir dois comportamentos operacionais diferentes:

1. indisponibilidade momentânea de um remote;
2. rollback deliberado para uma release anterior conhecida.

## Decisão

O Shell resolve os remotes através de um **runtime manifest** carregado antes do bootstrap do Single-SPA.

Estrutura conceitual:

```json
{
  "schemaVersion": 1,
  "environment": "production",
  "remotes": {
    "payments": {
      "scope": "payments",
      "version": "1.4.0",
      "remoteEntry": "https://payments.example/remoteEntry.js"
    }
  }
}
```

O manifest possui, no mínimo:

- nome lógico do remote;
- scope do Module Federation;
- versão/release ativa;
- URL do `remoteEntry.js`;
- ambiente;
- versão do schema do próprio manifest.

O Shell valida o manifest antes de iniciar a orquestração.

## Carregamento de Module Federation

O Shell não usa URLs de remotes hardcoded no `ModuleFederationPlugin`.

O fluxo é:

```text
Shell bootstrap
  ↓
carrega remote-manifest.json
  ↓
valida schema
  ↓
inicia Single-SPA
  ↓
rota ativa solicita MFE
  ↓
loader injeta remoteEntry.js
  ↓
inicializa share scope
  ↓
container.get('./lifecycles')
  ↓
mount
```

React, React DOM e demais dependências compartilhadas continuam sujeitos à estratégia de singleton definida para Module Federation.

## Fallback de indisponibilidade

Se um remote não puder ser carregado:

- o Shell permanece operacional;
- os demais MFEs continuam navegáveis;
- a área do remote exibe fallback explícito;
- versão e URL esperadas ficam disponíveis para diagnóstico;
- o usuário pode tentar novamente;
- o erro técnico é registrado no console/log correspondente.

O fallback não escolhe silenciosamente outra versão.

## Rollback

Rollback é uma operação **controlada**, não uma cascata automática de tentativas.

Exemplo:

```text
payments 1.4.0 ❌
      ↓
manifest/release config
      ↓
payments 1.3.2 ✅
```

O objetivo é permitir que somente Payments retorne para uma release conhecida sem republicar Dashboard, Accounts, Insurance ou, quando a infraestrutura final permitir, o próprio Shell.

A forma operacional de promoção do manifest em Render será definida junto das tasks de CD/runtime config.

## Não decisão

Não implementar neste momento:

```text
v1.4 falha
→ tenta v1.3 automaticamente
→ tenta v1.2 automaticamente
→ ...
```

Esse comportamento pode esconder falhas, tornar o runtime imprevisível e reduzir a clareza de observabilidade.

## Consequências positivas

- remove URLs de remote do código de domínio do Shell;
- torna versão ativa observável;
- prepara deploy e rollback independentes;
- facilita ambientes local/demo/produção;
- facilita smoke tests por release;
- mantém falhas isoladas.

## Trade-offs

- o manifest passa a ser parte crítica do bootstrap;
- configuração inválida pode impedir o início da composição dos MFEs;
- cache do manifest e de `remoteEntry.js` precisa ser tratado explicitamente no deploy;
- promoção/rollback do manifest exige processo operacional rastreável.

Esses trade-offs são aceitos porque o runtime manifest reduz acoplamento entre Shell e releases dos MFEs e cria uma fronteira operacional explícita para deploy independente.
