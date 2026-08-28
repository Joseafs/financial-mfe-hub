output "architecture_stage" {
  description = "Current Terraform architecture milestone."
  value       = local.architecture_stage
}

output "frontend_targets" {
  description = "Frontend deployables prepared for Render Static Sites."
  value       = local.frontends
}
