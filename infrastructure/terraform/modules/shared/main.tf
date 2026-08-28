variable "project_name" {
  description = "Canonical project name used to derive Render service names."
  type        = string
}

variable "environment" {
  description = "Logical environment name."
  type        = string
}

variable "repository_url" {
  description = "Git repository consumed by Render services."
  type        = string
}

variable "branch" {
  description = "Git branch consumed by Render services."
  type        = string
}

locals {
  service_prefix = "${var.project_name}-${var.environment}"

  shared_build_paths = [
    "package.json",
    "pnpm-workspace.yaml",
    "turbo.json",
    "pnpm-lock.yaml",
    "packages/**",
  ]
}
