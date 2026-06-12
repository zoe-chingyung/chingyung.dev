variable "github_repository" {
  description = "GitHub repo in owner/name form, e.g. chingyung/chingyung.dev"
  type        = string
}

variable "site_bucket_arn" {
  description = "ARN of the static site bucket the deploy role may write to"
  type        = string
}

variable "distribution_arn" {
  description = "ARN of the CloudFront distribution the deploy role may invalidate"
  type        = string
}
