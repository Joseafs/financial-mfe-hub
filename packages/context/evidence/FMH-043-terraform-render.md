# FMH-043 — Evidência Terraform + Render

Status de implementação: `REVIEW`

## Fundação criada

```text
infrastructure/terraform
├── modules
│   ├── shared
│   ├── static-site
│   └── web-service
└── environments
    └── production
```

O provider oficial é `render-oss/render` e a autenticação fica fora do Git via `RENDER_API_KEY` e `RENDER_OWNER_ID`.

O ambiente `production` é propositalmente um plano sem recursos nesta task. FMH-044 e FMH-045 serão responsáveis por instanciar respectivamente Static Sites e o Web Service do BFF.

## Pipeline

O workflow `Terraform` executa:

```text
terraform fmt -check -recursive
terraform init -backend=false
terraform validate
terraform plan
```

Também valida isoladamente os módulos reutilizáveis para detectar incompatibilidade de schema antes do primeiro provisionamento real.

## Gate para DONE

Promover para `DONE` quando o workflow `Terraform` concluir `fmt`, `validate` e `plan` em verde na `main`.
