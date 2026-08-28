output "service_prefix" {
  description = "Prefix used by Render services in this environment."
  value       = local.service_prefix
}

output "repository_url" {
  description = "Repository consumed by Render services."
  value       = var.repository_url
}

output "branch" {
  description = "Branch consumed by Render services."
  value       = var.branch
}

output "shared_build_paths" {
  description = "Paths that affect multiple deployables in the monorepo."
  value       = local.shared_build_paths
}
