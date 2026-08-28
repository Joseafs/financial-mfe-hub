variable "repository_url" {
  description = "GitHub repository used by Render services."
  type        = string
  default     = "https://github.com/Joseafs/financial-mfe-hub"
}

variable "branch" {
  description = "Git branch deployed by the demo environment."
  type        = string
  default     = "main"
}

variable "region" {
  description = "Render region for runtime services."
  type        = string
  default     = "oregon"
}
