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

## Fallback de indisponibilidade

Se a release selecionada não puder ser carregada:

- o Shell permanece operacional;
- os demais MFEs continuam navegáveis;
- a área do remote exibe fallback explícito;
- versão, canal e URL esperados ficam disponíveis para diagnóstico;
- o usuário pode tentar novamente;
- quando existe `stable`, o fallback oferece uma ação explícita de rollback;
- o erro técnico é registrado no console/log correspondente.

O fallback **não troca silenciosamente** de versão.

## Rollback controlado

Rollback é uma decisão explícita:

```text
payments active v1.4.0 ❌
        ↓
fallback informa a falha
        ↓
operador escolhe rollback
        ↓
payments stable v1.3.2 ✅
```

A rota pública continua a mesma (`/payments`). Somente o artefato remoto selecionado muda.

No ambiente local, o Shell usa um override de sessão após o clique de rollback para demonstrar a troca sem alterar o arquivo de configuração em disco. Em produção, a promoção ou rollback deve atualizar a configuração/release publicada de forma rastreável pelo pipeline.

O override local é deliberadamente temporário e existe apenas para tornar o comportamento observável durante o Architecture Gate.

## Demonstração local inicial

Payments possui uma release estável simulada para exercitar o fluxo:

```text
active  v0.0.1 → localhost:4203
stable  v0.0.0 → localhost:4213
```

A release stable é iniciada separadamente com:

```bash
pnpm --filter @financial-mfe/payments dev:stable
```

Essa release usa o mesmo código-base para validar a mecânica de seleção, isolamento e rollback. No deploy real, `active` e `stable` serão artefatos imutáveis de releases distintas.

## Não decisão

Não implementar:

```text
v1.4 falha
→ tenta v1.3 automaticamente
→ tenta v1.2 automaticamente
→ ...
```

Esse comportamento pode esconder falhas, tornar o runtime imprevisível e reduzir a clareza de observabilidade.

## Consequências positivas

- remove URLs de remote do código de domínio do Shell;
- torna release ativa e stable observáveis;
- prepara deploy e rollback independentes;
- facilita ambientes local/demo/produção;
- facilita smoke tests por release;
- mantém falhas isoladas;
- permite demonstrar rollback sem alterar a rota pública.

## Trade-offs

- o manifest passa a ser parte crítica do bootstrap;
- configuração inválida pode impedir o início da composição dos MFEs;
- cache do manifest e de `remoteEntry.js` precisa ser tratado explicitamente no deploy;
- promoção/rollback do manifest exige processo operacional rastreável;
- o demo local não substitui a validação futura com artefatos imutáveis realmente publicados.

Esses trade-offs são aceitos porque o runtime manifest reduz acoplamento entre Shell e releases dos MFEs e cria uma fronteira operacional explícita para deploy independente.
