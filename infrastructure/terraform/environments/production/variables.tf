variable "repository_url" {
  description = "GitHub repository used by Render services."
  type        = string
  default     = "https://github.com/Joseafs/financial-mfe-hub"
}

variable "branch" {
  description = "Git branch deployed by the production/demo environment."
  type        = string
  default     = "main"
}

variable "bff_region" {
  description = "Render region used by the Fastify BFF."
  type        = string
  default     = "virginia"
}

variable "bff_plan" {
  description = "Render Web Service plan used by the BFF. Review Render billing before apply."
  type        = string
  default     = "starter"
}
