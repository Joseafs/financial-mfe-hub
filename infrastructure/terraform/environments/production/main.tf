module "shared" {
  source = "../../modules/shared"

  project_name   = "financial-mfe-hub"
  environment    = "production"
  repository_url = var.repository_url
  branch         = var.branch
}

# FMH-044 and FMH-045 instantiate static sites and the BFF web service here.
# FMH-043 intentionally stops at a validated, no-op production plan.
