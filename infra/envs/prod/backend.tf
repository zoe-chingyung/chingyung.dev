terraform {
  required_version = ">= 1.10"

  backend "s3" {
    bucket       = "chingyung-dev-terraform-state"
    key          = "prod/terraform.tfstate"
    region       = "eu-west-2"
    use_lockfile = true
    encrypt      = true
  }
}
