variable "region" {
  type    = string
  default = "eu-west-2"
}

variable "domain_name" {
  type    = string
  default = "chingyung.dev"
}

variable "site_bucket_name" {
  type    = string
  default = "chingyung-dev-site"
}

variable "github_repository" {
  type    = string
  default = "chingyung/chingyung.dev" # CHANGE to your actual owner/repo
}
