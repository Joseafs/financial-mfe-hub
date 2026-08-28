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
