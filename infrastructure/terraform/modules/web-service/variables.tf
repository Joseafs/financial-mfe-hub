variable "name" { type = string }
variable "repo_url" { type = string }
variable "branch" { type = string }
variable "region" { type = string }
variable "plan" { type = string }
variable "build_command" { type = string }
variable "start_command" { type = string }
variable "health_check_path" {
  type    = string
  default = "/health"
}
variable "auto_deploy" {
  type    = bool
  default = false
}
variable "build_paths" {
  type    = list(string)
  default = []
}
variable "env_vars" {
  type = map(object({
    value = string
  }))
  default = {}
}
