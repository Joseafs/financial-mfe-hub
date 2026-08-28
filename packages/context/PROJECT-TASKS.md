# PROJECT TASKS — Financial MFE Hub

## 1. Objetivo

Este documento é o backlog técnico canônico do projeto.

As tasks devem ser executadas de forma incremental, mantendo o repositório sempre em um estado compreensível e validável.

Prefixo oficial:

```text
FMH
```

Exemplo:

```text
FMH-012
```

---

## 2. Estados

| Estado | Significado |
| --- | --- |
| `BACKLOG` | identificada, ainda não pronta para implementação |
| `READY` | escopo, dependências e aceite definidos |
| `DOING` | implementação ativa |
| `REVIEW` | implementação concluída aguardando revisão/validação |
| `BLOCKED` | impedimento explícito |
| `DONE` | aceite e Definition of Done atendidos |

---

## 3. Definition of Ready

Uma task está `READY` quando:

- objetivo está claro;
- escopo está delimitado;
- dependências estão conhecidas;
- decisões arquiteturais relevantes estão registradas;
- critérios de aceite são verificáveis;
- não depende de uma decisão ainda indefinida sem estar explicitamente bloqueada.

---

## 4. Definition of Done

Uma task está `DONE` quando, quando aplicável:

- implementação está completa;
- lint passa;
- typecheck passa;
- testes relacionados passam;
- build passa;
- não há segredo versionado;
- documentação afetada foi atualizada;
- critérios de aceite possuem evidência;
- nenhuma regra temporária ficou sem registro;
- mudanças arquiteturais foram refletidas no SDD.

---

## 5. Formato de evidência

Cada task concluída deve poder registrar algo semelhante a:

```text
Evidências:
- pnpm lint
- pnpm typecheck
- pnpm test
- pnpm build
- screenshot/URL quando aplicável
- arquivo ou teste que demonstra o comportamento
```

---

# Fase 0 — Fundação documental

## FMH-001 — Definir visão arquitetural inicial

**Status:** `DONE`

### Objetivo

Registrar propósito, stack inicial, fronteiras, estratégia de MFE, BFF, contratos, testes e evolução.

### Entregas

- `README.md` em PT-BR;
- `packages/context/README.md`;
- `packages/context/SDD.md`;
- `packages/context/PROJECT-TASKS.md`.

### Aceite

- documentação descreve Single-SPA e Module Federation separadamente;
- deixa claro que Turborepo organiza o workspace, mas não substitui MFE;
- define Zod compartilhado com validação autoritativa no BFF;
- define fluxo incremental de tasks.

---

# Fase 1 — Bootstrap do workspace

## FMH-002 — Inicializar pnpm workspace

**Status:** `READY`

**Depende de:** FMH-001

### Objetivo

Criar a base mínima do monorepo.

### Escopo

- `package.json` raiz;
- `pnpm-workspace.yaml`;
- `turbo.json`;
- `.gitignore`;
- versão mínima de Node e pnpm;
- scripts raiz.

### Aceite

- `pnpm install` executa sem erro;
- workspace reconhece `apps/*` e `packages/*`;
- scripts raiz possuem estrutura inicial para `lint`, `typecheck`, `test` e `build`.

---

## FMH-003 — Criar configurações compartilhadas

**Status:** `BACKLOG`

**Depende de:** FMH-002

### Objetivo

Padronizar TypeScript e lint sem duplicação entre aplicações.

### Entregas

```text
packages/eslint-config
packages/typescript-config
```

### Aceite

- apps conseguem estender configuração comum;
- TypeScript usa modo estrito;
- regras não dependem de configuração local duplicada.

---

## FMH-004 — Definir convenções de arquitetura e imports

**Status:** `BACKLOG`

**Depende de:** FMH-003

### Objetivo

Evitar dependências circulares e imports entre internals de domínios.

### Aceite

- aliases definidos;
- regra de imports entre apps documentada;
- packages públicos possuem entrypoints explícitos;
- nenhum MFE pode importar `src` interno de outro MFE.

---

# Fase 2 — Shell e Single-SPA

## FMH-005 — Criar Shell / root config

**Status:** `BACKLOG`

**Depende de:** FMH-003

### Objetivo

Criar o bootstrap principal com Single-SPA.

### Aceite

- root config inicia localmente;
- lifecycle do Single-SPA está configurado;
- existe rota raiz funcional;
- Shell não contém regra de domínio.

---

## FMH-006 — Decidir estratégia de layout Single-SPA

**Status:** `BACKLOG`

**Depende de:** FMH-005

### Decisão

Comparar:

- registro manual;
- `single-spa-layout`.

### Aceite

- decisão registrada no SDD;
- justificativa considera clareza, aprendizado e complexidade.

---

## FMH-007 — Criar Dashboard MFE mínimo

**Status:** `BACKLOG`

**Depende de:** FMH-005

### Objetivo

Registrar e montar o primeiro MFE real.

### Aceite

- `bootstrap`, `mount` e `unmount` funcionam;
- Shell ativa o MFE em `/dashboard`;
- navegação para fora desmonta corretamente o MFE.

---

## FMH-008 — Criar Accounts MFE mínimo

**Status:** `BACKLOG`

**Depende de:** FMH-007

### Objetivo

Validar que a arquitetura suporta mais de um MFE independente.

### Aceite

- `/accounts` possui owner claro;
- navegação Dashboard -> Accounts funciona;
- lifecycles são independentes.

---

## FMH-009 — Implementar fallback de remote/MFE

**Status:** `BACKLOG`

**Depende de:** FMH-008

### Objetivo

Evitar queda global quando um MFE falhar.

### Aceite

- falha do Accounts não derruba o Shell;
- fallback é exibido;
- retry é possível quando aplicável;
- erro possui contexto suficiente para log.

---

# Fase 3 — Module Federation

## FMH-010 — Configurar Webpack 5 e Module Federation

**Status:** `BACKLOG`

**Depende de:** FMH-008

### Objetivo

Habilitar exposição e consumo de módulos em runtime.

### Aceite

- host e remote funcionam localmente;
- remoteEntry é carregado em runtime;
- configuração fica documentada.

---

## FMH-011 — Definir shared dependencies

**Status:** `BACKLOG`

**Depende de:** FMH-010

### Objetivo

Evitar duplicação problemática de dependências de runtime.

### Aceite

- React e React DOM possuem estratégia explícita;
- configuração não contém compartilhamento excessivo;
- trade-offs registrados no SDD.

---

## FMH-012 — Criar primeiro módulo federado real

**Status:** `BACKLOG`

**Depende de:** FMH-010, FMH-011

### Objetivo

Demonstrar um caso de uso real de Module Federation, não apenas configuração vazia.

### Aceite

- um remote expõe módulo público;
- outro consumidor carrega o módulo em runtime;
- contrato público é documentado;
- consumidor não acessa internals do remote.

---

## FMH-013 — Implementar runtime remote configuration

**Status:** `BACKLOG`

**Depende de:** FMH-010

### Objetivo

Remover URLs de remotes hardcoded do código de domínio.

### Aceite

- remotes podem variar por ambiente;
- Shell resolve configuração centralmente;
- configuração inválida possui fallback compreensível.

---

# Fase 4 — Packages compartilhados

## FMH-014 — Criar `packages/contracts`

**Status:** `BACKLOG`

**Depende de:** FMH-003

### Objetivo

Criar a fonte canônica de contratos Zod.

### Aceite

- package possui exports explícitos;
- tipos são inferidos a partir dos schemas;
- não existe dependência de React, Fastify ou persistência.

---

## FMH-015 — Criar `packages/ui`

**Status:** `BACKLOG`

**Depende de:** FMH-003

### Objetivo

Criar biblioteca visual compartilhada e sem regras de domínio.

### Aceite

- primeiro conjunto de primitives existe;
- Tailwind possui estratégia compartilhada;
- componentes são acessíveis por entrypoint público.

---

## FMH-016 — Criar Storybook para UI

**Status:** `BACKLOG`

**Depende de:** FMH-015

### Aceite

- Storybook inicia isoladamente;
- componentes principais possuem stories;
- estados relevantes são demonstrados.

---

## FMH-017 — Criar `packages/auth`

**Status:** `BACKLOG`

**Depende de:** FMH-014

### Objetivo

Definir interfaces e primitivas compartilhadas de autenticação sem acoplar os MFEs à implementação do BFF.

---

# Fase 5 — BFF

## FMH-018 — Bootstrap do Fastify BFF

**Status:** `BACKLOG`

**Depende de:** FMH-002

### Objetivo

Criar API mínima e saudável.

### Aceite

- `/health` responde;
- configuração é tipada;
- erros de bootstrap falham rápido;
- logging estruturado está habilitado.

---

## FMH-019 — Integrar Zod ao BFF

**Status:** `BACKLOG`

**Depende de:** FMH-014, FMH-018

### Objetivo

Validar requests com os mesmos contratos consumidos pelo front.

### Aceite

- request inválido é rejeitado no BFF;
- frontend não é considerado fonte confiável;
- resposta de erro possui formato consistente.

---

## FMH-020 — Criar modelo de erros do BFF

**Status:** `BACKLOG`

**Depende de:** FMH-018

### Aceite

Implementar códigos estáveis para, no mínimo:

- validação;
- não autenticado;
- proibido;
- não encontrado;
- conflito;
- indisponibilidade downstream;
- erro interno.

---

## FMH-021 — Implementar request correlation

**Status:** `BACKLOG`

**Depende de:** FMH-018

### Aceite

- todo request recebe/propaga identificador;
- logs incluem correlation id;
- erro devolvido pode incluir `requestId` seguro.

---

# Fase 6 — Domínio Accounts

## FMH-022 — Implementar contratos de Accounts

**Status:** `BACKLOG`

**Depende de:** FMH-014

### Escopo

- account summary;
- card summary;
- limits.

---

## FMH-023 — Implementar endpoints Accounts no BFF

**Status:** `BACKLOG`

**Depende de:** FMH-019, FMH-022

### Aceite

- endpoints validam respostas e requests relevantes;
- serviço fictício fica isolado da camada HTTP.

---

## FMH-024 — Integrar Accounts MFE ao BFF

**Status:** `BACKLOG`

**Depende de:** FMH-008, FMH-023

### Aceite

- TanStack Query gerencia server state;
- loading, empty e error states existem;
- MFE não conhece detalhes do serviço downstream.

---

# Fase 7 — Domínio Payments

## FMH-025 — Criar Payments MFE

**Status:** `BACKLOG`

**Depende de:** FMH-008

### Aceite

- `/payments` registrado no Shell;
- lifecycle independente;
- fallback compatível com padrão global.

---

## FMH-026 — Definir contratos Zod de transferência

**Status:** `BACKLOG`

**Depende de:** FMH-014

### Escopo

Schema deve cobrir apenas regras portáveis, como:

- conta destino obrigatória;
- valor positivo;
- descrição limitada;
- campos opcionais explícitos.

Saldo e autorização não pertencem ao schema compartilhado.

---

## FMH-027 — Implementar formulário de transferência

**Status:** `BACKLOG`

**Depende de:** FMH-025, FMH-026

### Decisão necessária

Escolher React Hook Form ou Formik e registrar justificativa no SDD.

### Aceite

- formulário reutiliza schema Zod;
- mensagens são ligadas aos campos;
- não existe duplicação manual das mesmas regras.

---

## FMH-028 — Implementar endpoint de transferência fictícia

**Status:** `BACKLOG`

**Depende de:** FMH-019, FMH-026

### Aceite

- BFF revalida o payload;
- saldo é validado exclusivamente no servidor;
- autorização é validada exclusivamente no servidor;
- erros usam códigos estáveis.

---

## FMH-029 — Integrar formulário ao fluxo BFF

**Status:** `BACKLOG`

**Depende de:** FMH-027, FMH-028

### Aceite

- sucesso possui feedback;
- erros de campo são distintos de erros de domínio;
- double submit é impedido;
- loading state é explícito.

---

# Fase 8 — Insurance e Dashboard

## FMH-030 — Criar Insurance MFE

**Status:** `BACKLOG`

**Depende de:** FMH-008

### Objetivo

Adicionar terceiro domínio independente e validar escalabilidade da composição.

---

## FMH-031 — Evoluir Dashboard agregado

**Status:** `BACKLOG`

**Depende de:** FMH-024, FMH-029, FMH-030

### Objetivo

Exibir visão consolidada sem importar internals de outros MFEs.

### Aceite

- dados agregados vêm de contrato/BFF;
- Dashboard não acessa stores internas de outros MFEs.

---

# Fase 9 — Testes

## FMH-032 — Padronizar Jest + React Testing Library

**Status:** `BACKLOG`

### Aceite

- `test` como padrão dos testes;
- testes usam `screen` para queries;
- helpers de render evitam repetição;
- factories podem utilizar Faker quando dados aleatórios melhorarem robustez.

---

## FMH-033 — Adicionar MSW

**Status:** `BACKLOG`

**Depende de:** FMH-032

### Aceite

Cenários mínimos:

- sucesso;
- validação;
- 403;
- 500/503;
- timeout/resposta lenta.

---

## FMH-034 — Testar BFF com Fastify.inject

**Status:** `BACKLOG`

**Depende de:** FMH-019

### Aceite

- endpoints críticos possuem testes sem servidor externo;
- validação, status e erro são cobertos.

---

## FMH-035 — Configurar Playwright

**Status:** `BACKLOG`

**Depende de:** FMH-029

### Aceite

- jornada atravessa pelo menos dois MFEs;
- navegação e transferência fictícia são verificadas;
- teste de fallback de MFE é incluído.

---

# Fase 10 — Performance e observabilidade

## FMH-036 — Medir bundles e dependências duplicadas

**Status:** `BACKLOG`

**Depende de:** FMH-012

### Aceite

- bundles analisados;
- duplicação de React verificada;
- resultado documentado.

---

## FMH-037 — Instrumentar Web Vitals

**Status:** `BACKLOG`

### Aceite

Registrar pelo menos:

- LCP;
- INP;
- CLS.

---

## FMH-038 — Padronizar logging de falha de MFE

**Status:** `BACKLOG`

**Depende de:** FMH-009

### Aceite

Log deve identificar:

- MFE;
- rota;
- erro;
- momento;
- ambiente.

---

# Fase 11 — Segurança

## FMH-039 — Implementar estratégia de autenticação da POC

**Status:** `BACKLOG`

**Depende de:** FMH-017, FMH-018

### Aceite

- decisão documentada;
- tokens sensíveis não ficam em localStorage;
- BFF é autoridade de autenticação/autorização.

---

## FMH-040 — Aplicar baseline de segurança no BFF

**Status:** `BACKLOG`

**Depende de:** FMH-018

### Escopo

- CORS;
- headers;
- cookies quando utilizados;
- rate limit quando aplicável;
- redaction de logs;
- validação de envs.

---

# Fase 12 — CI/CD

## FMH-041 — Criar pipeline CI

**Status:** `BACKLOG`

### Aceite

GitHub Actions executa:

```text
pnpm install --frozen-lockfile
pnpm lint
pnpm typecheck
pnpm test
pnpm build
```

---

## FMH-042 — Validar builds independentes

**Status:** `BACKLOG`

**Depende de:** FMH-041

### Aceite

Cada app pode ser buildada isoladamente pelo Turborepo.

---

## FMH-043 — Definir primeira estratégia de deploy

**Status:** `BACKLOG`

**Depende de:** FMH-013, FMH-042

### Objetivo

Publicar Shell, MFEs e BFF de forma independente.

### Aceite

- cada unidade possui URL/deployment próprio;
- remotes são resolvidos por ambiente;
- README registra demonstração pública.

---

# Fase 13 — AWS opcional

## FMH-044 — Publicar assets MFE em S3 + CloudFront

**Status:** `BACKLOG`

**Depende de:** FMH-043

### Objetivo

Demonstrar distribuição real de bundles/remotes via CDN.

---

## FMH-045 — Explorar CloudWatch

**Status:** `BACKLOG`

**Depende de:** FMH-043

### Objetivo

Registrar logs/métricas da camada de backend em cenário AWS.

---

## FMH-046 — Avaliar caso de uso Lambda

**Status:** `BACKLOG`

### Regra

Não implementar Lambda apenas para citar AWS. Primeiro documentar caso de uso que justifique a função.

---

# Fase 14 — Fechamento de portfólio

## FMH-047 — Criar README em inglês

**Status:** `BACKLOG`

**Depende de:** arquitetura estabilizada

### Aceite

- `README.en.md`;
- link de idioma no topo dos dois READMEs;
- PT-BR permanece padrão.

---

## FMH-048 — Documentar trade-offs finais

**Status:** `BACKLOG`

### Objetivo

Explicar claramente:

- por que MFE;
- quando MFE seria exagero;
- Single-SPA vs alternativas;
- Module Federation e riscos de acoplamento;
- monorepo vs multirepo;
- BFF;
- Zod compartilhado;
- custos de performance e operação.

---

## FMH-049 — Criar roteiro de demonstração técnica

**Status:** `BACKLOG`

### Objetivo

Permitir apresentar o projeto em entrevista em poucos minutos.

### Roteiro esperado

1. arquitetura;
2. Shell;
3. lifecycles Single-SPA;
4. Module Federation;
5. contratos Zod;
6. formulário validado no front e no BFF;
7. BFF;
8. fallback de MFE;
9. testes;
10. pipeline/deploy.

---

# Próxima task

A próxima task recomendada é:

```text
FMH-002 — Inicializar pnpm workspace
```

Após sua conclusão, seguir para configurações compartilhadas antes de iniciar os MFEs.