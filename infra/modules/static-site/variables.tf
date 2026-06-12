variable "domain_name" {
  description = "Apex domain served by this distribution, e.g. chingyung.dev"
  type        = string
}

variable "bucket_name" {
  description = "Name of the private S3 bucket holding the static build output"
  type        = string
}

variable "certificate_arn" {
  description = "ACM certificate ARN in us-east-1"
  type        = string
}

variable "zone_id" {
  description = "Route 53 hosted zone ID for the domain"
  type        = string
}
