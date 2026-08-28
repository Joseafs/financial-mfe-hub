# Contexto do projeto

Este diretório concentra a documentação canônica do **Financial MFE Hub**.

A intenção é manter decisões, arquitetura e execução próximas do código, evitando documentação distribuída em múltiplos lugares sem uma fonte clara de verdade.

## Documentos

### [`SDD.md`](./SDD.md)

Software Design Document do projeto.

Contém:

- contexto e objetivos;
- princípios arquiteturais;
- fronteiras entre Shell, MFEs, BFF e packages;
- Single-SPA e Module Federation;
- contratos Zod compartilhados;
- estratégia de formulários;
- autenticação e autorização;
- estado e comunicação entre MFEs;
- internacionalização;
- segurança, performance e observabilidade;
- testes;
- CI/CD, Terraform e estratégia de deploy;
- critérios arquiteturais de aceite.

### [`PROJECT-TASKS.md`](./PROJECT-TASKS.md)

Backlog técnico incremental e rastreável.

Cada task deve representar uma entrega pequena, validável e com evidência objetiva de conclusão.

## Fluxo de execução

```mermaid
flowchart LR
  Backlog --> Ready
  Ready --> Doing
  Doing --> Review
  Review --> Done
  Review -->|ajustes| Doing
  Doing -->|bloqueio| Blocked
  Blocked --> Ready
```

### Estados

- **BACKLOG**: identificada, mas ainda não refinada para execução;
- **READY**: escopo, dependências e aceite definidos;
- **DOING**: implementação em andamento;
- **REVIEW**: código e evidências prontos para revisão;
- **BLOCKED**: impedimento explícito documentado;
- **DONE**: critérios de aceite e Definition of Done cumpridos.

## Regra de rastreabilidade

As tasks usam o prefixo `FMH`:

```text
FMH-001
FMH-002
FMH-003
...
```

Toda alteração versionada deve estar vinculada a uma task. O identificador entra no próprio commit para manter rastreabilidade entre planejamento, implementação e histórico Git.

Formato padrão:

```text
<tipo>: <TASK-ID> - <descrição em pt-BR>
```

Exemplos:

```text
feat: FMH-001 - consolida SDD e arquitetura inicial
feat: FMH-005 - cria shell com orquestração single-spa
fix: FMH-029 - corrige reenvio da transferência
refactor: FMH-018 - separa bootstrap do fastify
```

O tipo segue Conventional Commits (`feat`, `fix`, `refactor`, `test`, `chore` etc.), enquanto a descrição permanece em PT-BR.

A documentação e o próprio SDD também fazem parte do fluxo de tasks. Portanto, alterações arquiteturais não ficam fora da rastreabilidade apenas por não modificarem código de produção.

Uma task só pode ser considerada concluída quando houver evidência suficiente para reproduzir sua validação.
