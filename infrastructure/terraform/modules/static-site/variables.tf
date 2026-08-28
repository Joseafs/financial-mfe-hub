variable "name" { type = string }
variable "repo_url" { type = string }
variable "branch" { type = string }
variable "build_command" { type = string }
variable "publish_path" { type = string }
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
variable "headers" {
  type = list(object({
    name  = string
    value = string
    path  = string
  }))
  default = []
}
variable "routes" {
  type = list(object({
    source      = string
    destination = string
    type        = string
  }))
  default = []
}
