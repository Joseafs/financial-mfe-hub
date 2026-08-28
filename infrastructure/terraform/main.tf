locals {
  architecture_stage = "bootstrap"

  frontends = {
    shell = {
      package_name = "@financial-mfe/shell"
      publish_path = "apps/shell/dist"
    }
    dashboard = {
      package_name = "@financial-mfe/dashboard"
      publish_path = "apps/dashboard-mfe/dist"
    }
    accounts = {
      package_name = "@financial-mfe/accounts"
      publish_path = "apps/accounts-mfe/dist"
    }
    payments = {
      package_name = "@financial-mfe/payments"
      publish_path = "apps/payments-mfe/dist"
    }
    insurance = {
      package_name = "@financial-mfe/insurance"
      publish_path = "apps/insurance-mfe/dist"
    }
  }
}

# Service resources are deliberately instantiated in FMH-044/FMH-045.
# FMH-043 establishes the provider, reusable modules and environment inputs first.
