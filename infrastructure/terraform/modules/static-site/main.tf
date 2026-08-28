resource "render_static_site" "this" {
  name          = var.name
  repo_url      = var.repo_url
  branch        = var.branch
  build_command = var.build_command
  publish_path  = var.publish_path
  auto_deploy   = var.auto_deploy
  env_vars      = length(var.env_vars) == 0 ? null : var.env_vars
  headers       = length(var.headers) == 0 ? null : var.headers

  build_filter = length(var.build_paths) == 0 ? null : {
    paths = var.build_paths
  }

  routes = length(var.routes) == 0 ? null : var.routes
}
