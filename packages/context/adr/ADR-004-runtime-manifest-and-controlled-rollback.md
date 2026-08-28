# ADR-004 — Runtime Manifest e rollback controlado de MFEs

**Status:** Accepted  
**Data:** 2026-08-28

## Contexto

O Financial MFE Hub precisa provar que os Micro Frontends possuem release identity e evolução independentes sem transformar o Shell em um artefato acoplado às URLs de cada remote.

Hardcode de `remoteEntry.js` dentro do bundle do Shell obrigaria uma nova publicação do Shell sempre que uma URL de remote mudasse e reduziria o valor do deploy independente.

Também é necessário distinguir três estados operacionais:

1. release ativa configurada;
2. release estável conhecida para rollback;
3. indisponibilidade de uma release.

## Decisão

O Shell resolve os remotes através de um **runtime manifest** carregado antes do bootstrap do Single-SPA.

O schema v2 separa a release `active` da última `stable` conhecida:

```json
{
  "schemaVersion": 2,
  "environment": "production",
  "remotes": {
    "payments": {
      "scope": "payments",
      "active": {
        "version": "1.4.0",
        "remoteEntry": "https://payments.example/releases/1.4.0/remoteEntry.js"
      },
      "stable": {
        "version": "1.3.2",
        "remoteEntry": "https://payments.example/releases/1.3.2/remoteEntry.js"
      }
    }
  }
}
```

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
seleciona active por padrão
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

## Auto rollback demonstrativo no Shell

Durante a POC local, se a release `active` não puder ser carregada e existir uma única `stable` conhecida, o Shell troca automaticamente para essa stable usando um override de sessão e recarrega a mesma rota.

```text
/payments
   ↓
active v0.0.1 ❌
   ↓
Shell detecta falha de carregamento
   ↓
seleciona last stable v0.0.0
   ↓
recarrega /payments
   ↓
stable v0.0.0 ✅
```

A rota pública não muda. Apenas o artefato remoto selecionado muda.

Esse comportamento é deliberadamente **demonstrativo**. Ele existe para tornar a mecânica de fallback/rollback observável no Architecture Gate sem exigir a infraestrutura completa de health e release-control.

Se a stable também falhar, ou se o MFE não possuir stable configurada, o Shell exibe o fallback explícito e mantém os demais MFEs operacionais.

O Shell também exibe quando uma rota está operando em `stable` e permite testar novamente a `active`.

## Limite da POC e health em produção

Em produção, o browser não será a autoridade para decidir a saúde de uma release nem executar a promoção operacional definitiva.

A arquitetura alvo prevê uma camada operacional publicada no Render, separada da SPA, responsável por consolidar sinais como:

- disponibilidade de `remoteEntry.js`;
- smoke tests pós-deploy;
- falhas de bootstrap/mount reportadas;
- logs e telemetria de runtime;
- status da release ativa e da última stable conhecida.

Essa camada de health/release-control poderá decidir promoção, marcar uma release como `failed` e executar rollback para a última `stable`, atualizando o manifest de forma rastreável.

Fluxo alvo:

```text
MFE deploy
  ↓
health + smoke + logs
  ↓
release-control no Render
  ↓
healthy? ── sim ──> mantém/promove active
   │
   não
   ↓
marca failed
   ↓
restaura last stable
   ↓
publica manifest atualizado
```

A implementação dessa API/serviço de health fica fora do escopo imediato da POC do Shell e será tratada junto da infraestrutura, observabilidade e CD no Render.

## Demonstração local

Cada MFE possui uma release estável simulada:

```text
dashboard active v0.0.1 → localhost:4201 | stable v0.0.0 → localhost:4211
accounts  active v0.0.1 → localhost:4202 | stable v0.0.0 → localhost:4212
payments  active v0.0.1 → localhost:4203 | stable v0.0.0 → localhost:4213
insurance active v0.0.1 → localhost:4204 | stable v0.0.0 → localhost:4214
```

As releases stable podem ser iniciadas em conjunto com:

```bash
pnpm dev:stable
```

Essas releases usam o mesmo código-base com identidade de versão e porta diferentes para validar a mecânica de seleção, isolamento e rollback. No deploy real, `active` e `stable` serão artefatos imutáveis de releases distintas.

## Não decisão

Não implementar no browser uma cascata arbitrária de versões:

```text
v1.4 falha
→ tenta v1.3
→ tenta v1.2
→ tenta v1.1
→ ...
```

A POC conhece somente `active` e uma única **last stable**. Isso mantém o comportamento determinístico e evita esconder falhas em uma sequência imprevisível de artefatos antigos.

## Consequências positivas

- remove URLs de remote do código de domínio do Shell;
- torna release ativa e stable observáveis;
- demonstra auto rollback sem alterar a rota pública;
- prepara deploy e rollback independentes;
- facilita ambientes local/demo/produção;
- facilita smoke tests por release;
- mantém falhas isoladas;
- separa claramente responsabilidade da SPA e responsabilidade operacional de produção.

## Trade-offs

- o manifest passa a ser parte crítica do bootstrap;
- configuração inválida pode impedir o início da composição dos MFEs;
- cache do manifest e de `remoteEntry.js` precisa ser tratado explicitamente no deploy;
- promoção/rollback do manifest exige processo operacional rastreável;
- o demo local não substitui a validação futura com artefatos imutáveis realmente publicados;
- health/release-control adiciona uma peça operacional extra na infraestrutura final.

Esses trade-offs são aceitos porque o runtime manifest reduz acoplamento entre Shell e releases dos MFEs e cria uma fronteira operacional explícita para deploy independente.
