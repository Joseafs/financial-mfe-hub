resource "render_web_service" "this" {
  name              = var.name
  plan              = var.plan
  region            = var.region
  start_command     = var.start_command
  health_check_path = var.health_check_path

  runtime_source = {
    native_runtime = {
      runtime       = "node"
      repo_url      = var.repo_url
      branch        = var.branch
      auto_deploy   = var.auto_deploy
      build_command = var.build_command
      build_filter = length(var.build_paths) == 0 ? null : {
        paths = var.build_paths
      }
    }
  }
}
