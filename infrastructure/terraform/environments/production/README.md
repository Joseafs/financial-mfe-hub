# Production / demo environment

Este diretório é o root module do ambiente público do Financial MFE Hub.

Na FMH-043 ele valida apenas a fundação Terraform e produz um plano vazio. Os recursos Render começam a ser instanciados nas tasks seguintes:

```text
FMH-044 -> Shell + MFEs como Static Sites
FMH-045 -> BFF como Web Service
```

Credenciais do provider permanecem fora do Git:

```text
RENDER_API_KEY
RENDER_OWNER_ID
```

Validação local:

```bash
terraform init -backend=false
terraform fmt -check
terraform validate
terraform plan
```

O state não deve ser versionado. A estratégia de backend remoto será definida antes do primeiro `apply` real.
