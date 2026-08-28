terraform {
  required_version = ">= 1.9.0"

  required_providers {
    render = {
      source  = "render-oss/render"
      version = "~> 1.9.1"
    }
  }
}
