output "name_servers" {
  description = "Set these as the NS records at your .dev registrar."
  value       = module.dns.name_servers
}

output "site_bucket" {
  value = module.static_site.bucket_name
}

output "distribution_id" {
  value = module.static_site.distribution_id
}

output "distribution_domain" {
  value = module.static_site.distribution_domain
}

output "deploy_role_arn" {
  value = module.github_oidc.deploy_role_arn
}

output "plan_role_arn" {
  value = module.github_oidc.plan_role_arn
}

output "apply_role_arn" {
  value = module.github_oidc.apply_role_arn
}
