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
