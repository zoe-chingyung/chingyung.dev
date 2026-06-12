# chingyung.dev

Personal engineering knowledge platform — Cloud · Platform · Security.

Static-first Next.js site, MDX content in Git, deployed to AWS (S3 + CloudFront)
via Terraform and GitHub Actions with OIDC. Full design rationale in
[docs/ARCHITECTURE.md](docs/ARCHITECTURE.md).

## Stack

- Next.js 15 (App Router, `output: 'export'`) · TypeScript · Tailwind CSS v4
- Content: MDX + frontmatter behind a typed Content Access Layer (Phase 2)
- Infra: Terraform — S3 (private, OAC) + CloudFront + Route 53 + ACM
- CI/CD: GitHub Actions, OIDC role assumption (no static AWS keys)

## Local development

```bash
npm ci
npm run dev        # http://localhost:3000
npm run build      # static export to ./out
```

## Bootstrap runbook (Phase 0 — run once)

Prerequisites: AWS account with admin credentials locally, Terraform >= 1.10,
the GitHub repo created, chingyung.dev registered.

1. **State bucket** (local state, one time):

   ```bash
   cd infra/bootstrap
   terraform init && terraform apply
   ```

2. **Set your repo name** in `infra/envs/prod/variables.tf`
   (`github_repository = "owner/repo"`).

3. **Provision everything** (run locally the first time — the OIDC roles that
   CI later uses are created by this apply):

   ```bash
   cd infra/envs/prod
   terraform init && terraform apply
   ```

   Certificate validation completes only after step 4, so if the first apply
   stalls on `aws_acm_certificate_validation`, do step 4 and re-run apply.

4. **Delegate DNS**: take the `name_servers` output and set them as the
   nameservers for chingyung.dev at your registrar. Allow up to an hour.

5. **GitHub configuration**:
   - Create an environment named `production`; add yourself as a required
     reviewer (this gates `terraform apply` and production deploys).
   - Repository variables (Settings → Secrets and variables → Actions →
     Variables) from the Terraform outputs:

     | Variable | Source |
     |---|---|
     | `AWS_REGION` | e.g. `eu-west-2` |
     | `SITE_BUCKET` | output `site_bucket` |
     | `CLOUDFRONT_DISTRIBUTION_ID` | output `distribution_id` |
     | `AWS_DEPLOY_ROLE_ARN` | output `deploy_role_arn` |
     | `AWS_PLAN_ROLE_ARN` | output `plan_role_arn` |
     | `AWS_TF_APPLY_ROLE_ARN` | output `apply_role_arn` |

6. **First deploy**: push to `main`. The `Deploy site` workflow builds, syncs
   to S3 and invalidates CloudFront. https://chingyung.dev is live.

## Repository layout

```
.github/workflows/   ci.yml · deploy.yml · infra.yml
content/             knowledge base (Phase 2)
docs/                architecture, ADRs, authoring guide
infra/               Terraform (bootstrap · modules · envs/prod)
src/                 Next.js app
```

## Roadmap

See docs/ARCHITECTURE.md §9. Current phase: **1 — walking skeleton**.
