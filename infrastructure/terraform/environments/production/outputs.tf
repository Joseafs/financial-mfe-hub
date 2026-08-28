output "service_prefix" {
  description = "Prefix used by production Render services."
  value       = module.shared.service_prefix
}

output "frontend_urls" {
  description = "Public URLs returned by Render after provisioning the Shell and MFEs."
  value = {
    for name, service in module.frontend : name => service.url
  }
}

output "frontend_ids" {
  description = "Render service IDs for the independently deployed frontends."
  value = {
    for name, service in module.frontend : name => service.id
  }
}
