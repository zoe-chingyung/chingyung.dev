terraform {
  required_providers {
    aws = {
      source  = "hashicorp/aws"
      version = "~> 5.0"
    }
  }
}

provider "aws" {
  region = var.region

  default_tags {
    tags = {
      Project   = "chingyung.dev"
      ManagedBy = "terraform"
    }
  }
}

# CloudFront certificates must be issued in us-east-1.
provider "aws" {
  alias  = "us_east_1"
  region = "us-east-1"

  default_tags {
    tags = {
      Project   = "chingyung.dev"
      ManagedBy = "terraform"
    }
  }
}

module "dns" {
  source      = "../../modules/dns"
  domain_name = var.domain_name

  providers = {
    aws           = aws
    aws.us_east_1 = aws.us_east_1
  }
}

module "static_site" {
  source          = "../../modules/static-site"
  domain_name     = var.domain_name
  bucket_name     = var.site_bucket_name
  certificate_arn = module.dns.certificate_arn
  zone_id         = module.dns.zone_id
}

module "github_oidc" {
  source            = "../../modules/github-oidc"
  github_repository = var.github_repository
  site_bucket_arn   = module.static_site.bucket_arn
  distribution_arn  = module.static_site.distribution_arn
}
