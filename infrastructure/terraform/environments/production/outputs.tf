output "service_prefix" {
  description = "Prefix reserved for production Render services."
  value       = module.shared.service_prefix
}

output "repository_url" {
  description = "Repository used by the production environment."
  value       = module.shared.repository_url
}

output "branch" {
  description = "Branch used by the production environment."
  value       = module.shared.branch
}
