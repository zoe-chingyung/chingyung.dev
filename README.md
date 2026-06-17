<div align="center">

# chingyung.dev

**Personal engineering knowledge platform — Cloud · Platform · Security**

[![Deploy](https://github.com/zoe-chingyung/chingyung.dev/actions/workflows/deploy.yml/badge.svg)](https://github.com/zoe-chingyung/chingyung.dev/actions/workflows/deploy.yml)
[![CI](https://github.com/zoe-chingyung/chingyung.dev/actions/workflows/ci.yml/badge.svg)](https://github.com/zoe-chingyung/chingyung.dev/actions/workflows/ci.yml)

**Live: [chingyung.dev](https://chingyung.dev)**

</div>

A static-first knowledge platform that doubles as a working demonstration of
cloud, platform and security engineering practice. Publishing a post is one
MDX file and a `git push`; everything in between is automated, schema-validated
and credential-free.

## Highlights

- **Content as code, behind a contract** — MDX + frontmatter validated against
  Zod schemas at build time; malformed content fails CI before it can ship.
  All pages consume content through a typed Content Access Layer, so the
  authoring backend (raw MDX today; Keystatic/Tina/AI-assisted later) can
  change without refactoring a single page.
- **Zero static credentials** — GitHub Actions assumes least-privilege AWS IAM
  roles via OIDC federation. The deploy role can do exactly two things: sync
  one bucket, invalidate one distribution.
- **Static everything** — Next.js `output: 'export'` to a private S3 bucket
  behind CloudFront (OAC, HTTP/3, strict security headers incl. CSP + HSTS
  preload). Pagefind ships a build-time search index; OG cards are generated
  per-article at build. Running cost ≈ $1–2/month.
- **100% Infrastructure as Code** — Terraform modules for the static site,
  DNS/ACM and GitHub OIDC. CI plans on PRs, applies behind an environment
  approval gate.
- **Quality gates** — lint, typecheck, schema validation and a Lighthouse CI
  budget (≥90 across all categories) on every PR.

## Architecture

```
MDX content ──▶ Velite (Zod contract) ──▶ Content Access Layer ──▶ Next.js static export
                                                                        │
GitHub Actions (OIDC, least-privilege) ──▶ S3 (private, OAC) ──▶ CloudFront ──▶ visitors
```

Full design rationale, ADRs and roadmap: [docs/ARCHITECTURE.md](docs/ARCHITECTURE.md) ·
Publishing guide: [docs/AUTHORING.md](docs/AUTHORING.md)

## Stack

Next.js 15 (App Router, static export) · TypeScript · Tailwind CSS v4 ·
Velite + Zod · Shiki · Pagefind · Terraform · AWS (S3, CloudFront, Route 53,
ACM, IAM) · GitHub Actions · Umami analytics

## Local development

```bash
npm ci
npm run dev        # http://localhost:3000 (drafts visible with a DRAFT badge)
npm run build      # static export to ./out + Pagefind index
npm run typecheck  # velite && tsc --noEmit
```

To test search locally (the index only exists in production builds):
`npm run build && npx serve out`.

## Publishing content

```bash
git checkout -b post/my-post
# write content/insights/2026/my-post.mdx with draft: true
# preview, open a PR (CI validates frontmatter), flip draft: false, merge
```

Tags must exist in `content/data/taxonomy.ts` — add new ones in the same PR
as the content that needs them. Details in [docs/AUTHORING.md](docs/AUTHORING.md).

## Repository layout

```
.github/workflows/   ci.yml · deploy.yml · infra.yml
content/             the knowledge base (insights, projects, case studies, certifications)
docs/                architecture, ADRs, authoring guide
infra/               Terraform (bootstrap · modules · envs/prod)
src/                 Next.js app (lib/content = Content Access Layer)
```

## Status

Phases 0–4 of the [roadmap](docs/ARCHITECTURE.md#9-delivery-roadmap) are
complete (foundations → walking skeleton → content engine → pages/search/SEO →
launch). Current phase: **steady state** — publish, iterate, grow.
