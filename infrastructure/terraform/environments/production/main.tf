module "shared" {
  source = "../../modules/shared"

  project_name   = "financial-mfe-hub"
  environment    = "production"
  repository_url = var.repository_url
  branch         = var.branch
}

locals {
  frontends = {
    shell = {
      package_name = "@financial-mfe/shell"
      app_path     = "apps/shell"
      publish_path = "apps/shell/dist"
      routes = [
        {
          source      = "/*"
          destination = "/index.html"
          type        = "rewrite"
        }
      ]
    }
    dashboard = {
      package_name = "@financial-mfe/dashboard"
      app_path     = "apps/dashboard-mfe"
      publish_path = "apps/dashboard-mfe/dist"
      routes       = []
    }
    accounts = {
      package_name = "@financial-mfe/accounts"
      app_path     = "apps/accounts-mfe"
      publish_path = "apps/accounts-mfe/dist"
      routes       = []
    }
    payments = {
      package_name = "@financial-mfe/payments"
      app_path     = "apps/payments-mfe"
      publish_path = "apps/payments-mfe/dist"
      routes       = []
    }
    insurance = {
      package_name = "@financial-mfe/insurance"
      app_path     = "apps/insurance-mfe"
      publish_path = "apps/insurance-mfe/dist"
      routes       = []
    }
  }

  production_frontend_urls = {
    dashboard = "https://${module.shared.service_prefix}-dashboard.onrender.com"
    accounts  = "https://${module.shared.service_prefix}-accounts.onrender.com"
    payments  = "https://${module.shared.service_prefix}-payments.onrender.com"
    insurance = "https://${module.shared.service_prefix}-insurance.onrender.com"
  }
}

module "frontend" {
  source   = "../../modules/static-site"
  for_each = local.frontends

  name          = "${module.shared.service_prefix}-${each.key}"
  repo_url      = module.shared.repository_url
  branch        = module.shared.branch
  build_command = "corepack enable && corepack prepare pnpm@10.15.0 --activate && pnpm install --no-frozen-lockfile && pnpm --filter '${each.value.package_name}' build"
  publish_path  = each.value.publish_path
  auto_deploy   = false
  build_paths   = concat(["${each.value.app_path}/**"], module.shared.shared_build_paths)
  routes        = each.value.routes

  env_vars = merge(
    {
      FMH_ENV = {
        value = "production"
      }
    },
    each.key == "shell" ? {
      FMH_DASHBOARD_URL = {
        value = local.production_frontend_urls.dashboard
      }
      FMH_ACCOUNTS_URL = {
        value = local.production_frontend_urls.accounts
      }
      FMH_PAYMENTS_URL = {
        value = local.production_frontend_urls.payments
      }
      FMH_INSURANCE_URL = {
        value = local.production_frontend_urls.insurance
      }
    } : {}
  )
}
