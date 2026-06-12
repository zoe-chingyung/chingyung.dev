# chingyung.dev — Architecture & Design Document

**Status:** Accepted
**Version:** 1.0
**Date:** 2026-06-12
**Owner:** Ching Yung
**Scope:** Personal Brand Website Expansion — evolution of chingyung.uk into a long-term professional knowledge platform at chingyung.dev

---

## 1. Executive Summary

This document defines the target architecture for migrating the existing resume landing page (chingyung.uk — S3 + CloudFront + CloudFormation + GitHub Actions) to a long-lived **engineering knowledge platform** at **chingyung.dev**.

The platform is designed around three principles:

1. **Static-first.** Every page is known at build time. The site builds to pure static assets served from S3 via CloudFront. No runtime servers, near-zero cost, trivially high Lighthouse scores.
2. **Content as code, behind an abstraction.** Content is MDX + frontmatter in Git, published via GitHub Actions. Critically, all content is consumed through a typed **Content Access Layer**, so the authoring backend (raw MDX today; Keystatic, TinaCMS, or AI-assisted publishing later) can change without touching pages or components.
3. **The infrastructure is part of the portfolio.** Terraform-managed AWS, OIDC-federated CI/CD, and security headers are not just plumbing — they are demonstrable evidence of Cloud / Platform / Security engineering capability, and each becomes case-study material.

The website itself is the first case study published on it.

---

## 2. Goals and Non-Goals

### Goals

- Represent professional identity for recruiters, hiring managers, and the engineering community
- Five-section IA: Home, Resume, Work, Insights, Contact
- Publishing a new article = writing one MDX file and pushing to Git
- Filtering, tagging, and full-text search across Work and Insights
- Lighthouse > 90 on all categories, mobile-first, accessible (WCAG 2.1 AA intent)
- AWS-hosted, 100% Infrastructure as Code, GitHub Actions CI/CD
- **Content Management Extensibility:** future CMS or AI-assisted authoring can be added without refactoring the content layer

### Non-Goals (initial delivery)

- Headless CMS (Contentful, Sanity) — explicitly rejected for MVP; see ADR-002
- Resume Access Portal (auth, temporary links, passkeys) — future subsystem
- Newsletter, RSS, recommendations, comments — future enhancements
- Server-side rendering / dynamic per-request content

---

## 3. High-Level Architecture

```
 ┌─────────────────────┐      ┌─────────────────────┐
 │  Git repository      │      │  GitHub Actions      │
 │  Next.js app         │─────▶│  PR: lint/type/build │
 │  MDX content         │ push │  main: deploy (OIDC) │
 │  Terraform           │      └──────────┬───────────┘
 └─────────────────────┘                 │ sync + invalidate
                                          ▼
 ┌──────────────────────── AWS (Terraform-managed) ───────────────────────┐
 │                                                                         │
 │  Route 53 ──▶ CloudFront (OAC, security headers, HTTP/3) ──▶ S3 (private)│
 │                   │                                                     │
 │                   └──(future)──▶ API Gateway ──▶ Lambda (contact form)  │
 │  ACM (us-east-1)                                                        │
 └─────────────────────────────────────────────────────────────────────────┘
                                          ▲
                                  Visitors (recruiters,
                                  hiring managers, engineers)
```

Request path: `Visitor → Route 53 → CloudFront → S3 (static assets)`.
Publish path: `MDX file → git push → GitHub Actions → next build (static export) → aws s3 sync → CloudFront invalidation`.

---

## 4. Key Decisions (ADR Summaries)

### ADR-001: Next.js static export, not SSR

**Status:** Accepted

**Context.** All content is known at build time. Requirements demand Lighthouse > 90, low operational overhead, and AWS hosting.

**Decision.** Next.js 15 (App Router) + TypeScript + Tailwind CSS with `output: 'export'`, producing pure static assets deployed to S3/CloudFront.

| Option | Complexity | Cost | Ops overhead | Fit |
|---|---|---|---|---|
| Static export → S3/CloudFront | Low | ~$1/mo | Near zero | ✅ Chosen |
| SSR via OpenNext/SST on Lambda | Medium | Low | Lambda mgmt, cold starts | Rejected — no SSR need exists |
| Vercel hosting | Low | Free tier | Vendor dependency | Rejected — conflicts with "AWS + IaC as portfolio" goal |

**Consequences.**
- (+) Maximum performance, minimum cost, simplest threat surface
- (+) The deploy pipeline is a clean, teachable artifact
- (−) Any future dynamic feature (Resume Access Portal, contact form) is built as a **separate API subsystem** (API Gateway + Lambda), not inside Next.js. This is accepted and consistent with the existing portal architecture.
- (−) No Next.js ISR/middleware; redirects and headers are handled at CloudFront.

### ADR-002: Git-based MDX content; CMS deferred but designed for

**Status:** Accepted

**Context.** The site is a long-term knowledge platform, not a one-off portfolio. The owner is an engineer; Git is the natural workflow. Headless CMS adds vendor dependency, API complexity, and ongoing maintenance with no current payoff. However, **Content Authoring Experience is a formal Future Consideration** — the architecture must allow Keystatic, TinaCMS, or AI-assisted publishing to be introduced without refactoring the content layer.

**Decision.**
1. Content lives as MDX + YAML frontmatter in `/content`, versioned in Git.
2. Frontmatter schemas are defined once in Zod and validated at build time (build fails on invalid content).
3. **All pages and components consume content exclusively through a Content Access Layer (`/src/lib/content`)** — never by reading files directly. The frontmatter schema is the stable contract.

**Why this preserves extensibility.** Keystatic and TinaCMS are Git-based: they edit the same MDX files and commit to the same repo. Adopting either is purely additive (add config + an `/admin` route or local editor) — zero changes to schemas, pages, or pipeline. AI-assisted publishing is "anything that opens a PR containing a valid MDX file," which the schema validation gate already supports. Even a future move to a headless CMS would only replace the loader implementation inside the Content Access Layer.

**Consequences.**
- (+) Zero vendors, full version control, drafts and review via branches/PRs
- (+) Authoring backend is swappable; content model is not coupled to any tool
- (−) Non-technical contributors cannot publish (acceptable: single-owner platform)
- (−) Schema discipline required — mitigated by build-time Zod validation

### ADR-003: Terraform replaces CloudFormation

**Status:** Accepted

**Context.** Existing portal uses CloudFormation. Owner's skills matrix and target roles centre on Terraform; the site should demonstrate it.

**Decision.** All AWS resources for the new platform are managed in Terraform (`/infra`), with remote state in S3 + native state locking. The legacy CloudFormation stack remains untouched until decommission (see §10).

**Consequences.**
- (+) Portfolio-relevant IaC; reusable modules (`static-site`, `dns`, later `contact-form`)
- (−) Two IaC tools coexist during migration — time-boxed to the cutover period

### ADR-004: GitHub Actions assumes AWS roles via OIDC

**Status:** Accepted

**Decision.** No long-lived AWS access keys in GitHub. GitHub's OIDC provider federates into two IAM roles: a read-only **plan role** (PRs) and a least-privilege **deploy role** (main only, restricted by repo + branch claim) limited to `s3:PutObject/DeleteObject/ListBucket` on the site bucket and `cloudfront:CreateInvalidation` on the distribution.

**Consequences.** (+) Strong security posture story; (+) credential rotation eliminated; (−) one-time IAM trust-policy setup complexity.

### ADR-005: Domain migration to chingyung.dev

**Status:** Accepted

**Context.** chingyung.uk has no meaningful SEO equity. `.dev` is HTTPS-preloaded (HSTS) and strongly associated with the engineering community.

**Decision.** chingyung.dev becomes the canonical domain. chingyung.uk is retained for ≥12 months serving 301 redirects (CloudFront Function) to preserve any inbound links, then reviewed for decommission.

### ADR-006: Client-side search and filtering (Pagefind)

**Status:** Accepted

**Decision.** Tag/category filtering is implemented client-side over build-time-generated JSON indexes, with filter state in URL query params (shareable, SEO-safe). Full-text search uses **Pagefind**, which indexes the static build output at CI time and ships a tiny lazy-loaded WASM index — zero backend.

**Consequences.** (+) No search infrastructure; (−) index freshness tied to deploys (correct by definition for a static site).

---

## 5. Content Architecture

This is the core of the platform. It is designed for ten years of accumulation, not a launch snapshot.

### 5.1 Collections

Four typed collections, each with its own Zod schema:

| Collection | Path | Purpose |
|---|---|---|
| `projects` | `content/projects/` | Engineering projects: overview, problem, solution, architecture, outcomes |
| `caseStudies` | `content/case-studies/` | Decision-focused narratives: context, problem, constraints, design decisions, implementation, lessons learned |
| `certifications` | `content/certifications/` | Structured records: name, issuer, issue date, credential URL |
| `insights` | `content/insights/` | Articles, learning journals, engineering notes, career reflections |

The **Work** page aggregates `projects + caseStudies + certifications` (+ open-source entries, see 5.4). The **Insights** page renders the `insights` collection. The **Home** page consumes `featured: true` entries across collections.

### 5.2 Directory Layout

```
content/
├── projects/
│   └── resume-access-portal/
│       ├── index.mdx
│       └── architecture.png        # co-located assets
├── case-studies/
│   └── security-hub-remediation.mdx
├── certifications/
│   └── aws-security-specialty.mdx
├── insights/
│   └── 2026/
│       └── designing-remediation-workflows.mdx
├── data/
│   ├── taxonomy.ts                 # controlled tag vocabulary (single source of truth)
│   ├── open-source.ts              # OSS contributions (structured data, no prose)
│   └── resume.ts                   # structured resume data
└── README.md                       # authoring guide
```

Insights are sharded by year to keep directories navigable at scale. Slugs derive from file paths and are permanent (changing a slug requires an explicit redirect entry).

### 5.3 Frontmatter Contract (example: `insights`)

```yaml
---
title: "Designing Security Remediation Workflows on AWS"
description: "How I built event-driven remediation for Security Hub findings."  # ≤160 chars, doubles as meta description
date: 2026-06-15
updated: 2026-07-01          # optional
type: article                # article | journal | note
tags: [aws, security, automation]      # must exist in taxonomy.ts
series: security-engineering-journey   # optional, groups journal entries
draft: true                  # excluded from production builds
featured: false
cover: ./cover.png           # optional, used for OG image
canonical:                   # optional, for cross-posted content
---
```

Validation runs at build time: unknown tags, missing descriptions, or malformed dates **fail the build** — broken content can never ship.

### 5.4 Tagging Strategy

Uncontrolled tags rot (aws vs AWS vs amazon-web-services). The taxonomy is a **controlled vocabulary** with two orthogonal axes plus one grouping mechanism:

1. **Type axis** — what kind of content this is. Encoded by collection + `type` field, *not* by tags. (project / case study / certification / article / journal / note)
2. **Topic axis** — what it is about. Free assignment from the controlled list in `content/data/taxonomy.ts`:
   `aws, terraform, security, platform-engineering, devops, ci-cd, observability, iac, kubernetes, ai-engineering, career, learning-journey, certifications`
   Each taxonomy entry carries `slug`, `label`, and `description` (rendered on tag landing pages — good for SEO).
3. **Series** — ordered narrative grouping for journals (e.g. *Security Engineering Journey, part 3*). A series page lists entries chronologically with prev/next navigation.

Rules: 1–4 topic tags per entry; adding a new tag means adding it to `taxonomy.ts` in the same PR (deliberate friction); tag pages are statically generated at `/insights/tags/[slug]` and `/work/tags/[slug]`.

### 5.5 Content Access Layer (the extensibility mechanism)

```
src/lib/content/
├── schemas.ts        # Zod schemas — THE contract
├── loader.ts         # implementation detail: reads MDX from /content
├── api.ts            # the ONLY import surface for pages/components
└── search-index.ts   # emits JSON indexes for client-side filtering
```

`api.ts` exposes typed functions and nothing else:

```ts
getCollection('insights', { draft: false })
getEntry('insights', slug)
getFeatured()
getByTag(tag)
getSeries(seriesSlug)
getAllTags()
```

**Rule: pages and components never import `loader.ts` or touch the filesystem.** Swapping the authoring backend later (Keystatic, Tina, headless CMS, AI pipeline) means reimplementing `loader.ts` against the same `schemas.ts` — every page keeps working unmodified.

Implementation choice: **Velite** (or equivalent content-collection library) wired to the Zod schemas, giving type-safe collections, hot reload in dev, and build-time validation. If Velite is ever abandoned, it is replaceable inside `loader.ts` — the same isolation that protects against CMS churn protects against library churn.

### 5.6 Authoring Workflow

```
1. branch          git checkout -b post/remediation-workflows
2. write           content/insights/2026/remediation-workflows.mdx  (draft: true)
3. preview         npm run dev  → drafts visible locally with a DRAFT badge
4. PR              CI validates schema, lints prose (optional), builds site,
                   publishes a preview build artifact
5. publish         flip draft: false, merge → auto-deploy to production
```

Engineering notes (short-form) follow the same path; the only difference is `type: note` and typically no cover image. Target friction: **under one minute from "finished writing" to "published"** excluding CI runtime.

### 5.7 Search & Filtering Experience

- **Filtering (Work, Insights):** client-side over a build-generated `index.json` per collection (slug, title, description, type, tags, date — no body). Filter state lives in URL query params: `/work?type=case-study&tag=security` is shareable and crawlable via equivalent static tag pages.
- **Full-text search:** Pagefind indexes the rendered HTML in CI (`postbuild` step). Search UI is lazy-loaded; zero cost on first paint.
- **Future headroom:** if search needs grow (semantic search, recommendations), the static JSON indexes are already the export format an external index would consume.

### 5.8 MDX Component Vocabulary

A small, stable set of custom components keeps authoring expressive without coupling content to design internals: `<Callout>`, `<ArchitectureDiagram>`, `<Figure>`, `<CodeTabs>`, `<CertBadge>`, `<SeriesNav>`. Syntax highlighting via **Shiki** at build time (zero runtime JS, dual light/dark themes).

### 5.9 Extensibility Paths (Future Considerations, designed-for)

| Future capability | What changes | What does NOT change |
|---|---|---|
| **Keystatic** | Add `keystatic.config.ts` mirroring Zod schemas; optional local/`/admin` UI committing to Git | Schemas, pages, pipeline, hosting |
| **TinaCMS** | Add Tina config + (optionally) Tina Cloud for editing UI | Same as above |
| **AI-assisted publishing** | An agent (e.g. Claude via MCP/GitHub API) drafts MDX, proposes tags from `taxonomy.ts`, generates metadata, opens a PR | Schema validation gate already enforces correctness; human merge = human approval |
| **Headless CMS (if ever justified)** | Reimplement `loader.ts` to fetch from CMS API at build time | `schemas.ts`, `api.ts`, all pages |

---

## 6. System Architecture

### 6.1 Frontend Stack

| Concern | Choice | Notes |
|---|---|---|
| Framework | Next.js 15, App Router, `output: 'export'` | Static export only |
| Language | TypeScript (strict) | |
| Styling | Tailwind CSS v4 | Design tokens in CSS variables; dark mode via `prefers-color-scheme` + toggle |
| Content | MDX + Velite + Zod | See §5 |
| Animation | Framer Motion | Scroll-reveal and page transitions; respect `prefers-reduced-motion` |
| Code highlighting | Shiki (build time) | |
| Search | Pagefind (build time) | |
| Fonts | Self-hosted via `next/font` | No third-party font requests |

Design direction (refs: brittanychiang.com, adityacprtm.dev): minimalist, generous whitespace, one accent colour, typography-led, story-driven scroll on Home. Technical credibility over visual complexity.

### 6.2 Pages & Routing

```
/                       Home: hero, current focus, featured project/article/cert
/resume                 Online resume + PDF download + career timeline + skills matrix
/work                   Aggregated portfolio with type/tag filters
/work/[slug]            Project & case study detail pages
/work/tags/[tag]        Static tag landing pages
/insights               Article index with filters + search
/insights/[year]/[slug] Article pages
/insights/tags/[tag]    Static tag landing pages
/insights/series/[slug] Series pages
/contact                Links (LinkedIn, GitHub, email); form deferred
/404                    Custom not-found
```

### 6.3 AWS Infrastructure (Terraform)

| Resource | Configuration |
|---|---|
| S3 bucket (site) | Private, versioned, SSE-S3; access only via CloudFront OAC |
| CloudFront | OAC to S3, HTTP/3, compression, `us-east-1` ACM cert, custom error pages, response headers policy |
| Response headers policy | HSTS (preload), CSP, X-Content-Type-Options, Referrer-Policy, Permissions-Policy |
| CloudFront Function | chingyung.uk → chingyung.dev 301; trailing-slash normalisation for S3 index documents |
| Route 53 | Hosted zones for .dev (canonical) and .uk (redirect period); ALIAS records; CAA records |
| ACM | Certs for both domains (us-east-1) |
| S3 bucket (TF state) | Remote state, versioned, native lockfile locking |
| IAM | OIDC provider + `plan` role (read-only) + `deploy` role (least privilege, main-branch claim) |
| CloudWatch / budgets | AWS Budget alert; CloudFront standard logs to S3 (optional, lifecycle-expired) |

Module layout:

```
infra/
├── modules/
│   ├── static-site/        # S3 + CloudFront + headers + OAC
│   ├── dns/                # Route 53 + ACM
│   └── github-oidc/        # provider + roles
├── envs/
│   └── prod/
│       ├── main.tf
│       ├── backend.tf
│       └── variables.tf
└── README.md
```

Estimated running cost: **≈ US$1–2/month** (Route 53 hosted zones dominate; S3/CloudFront within or near free tier at personal-site traffic).

### 6.4 CI/CD (GitHub Actions)

**Workflow 1 — `ci.yml` (pull requests)**
```
lint (eslint, tsc --noEmit)
  → content validation (Velite/Zod)
  → build (next build, static export)
  → Lighthouse CI against built output (budget: ≥90 all categories — fail under)
  → upload preview artifact
```

**Workflow 2 — `deploy.yml` (push to main)**
```
build (as above)
  → pagefind --site out/
  → configure-aws-credentials (OIDC → deploy role)
  → aws s3 sync out/ s3://<bucket> --delete
      (immutable assets: cache-control max-age=31536000; HTML: no-cache)
  → cloudfront create-invalidation (/index.html, /sitemap.xml, changed paths)
```

**Workflow 3 — `infra.yml` (changes under /infra)**
```
PR:   terraform fmt -check → validate → plan (plan role) → plan posted as PR comment
main: terraform apply (manual environment approval gate)
```

### 6.5 Contact Form (deferred subsystem)

Phase 1 ships direct links only (mailto with obfuscation, LinkedIn, GitHub). When/if a form is justified: API Gateway (HTTP API) + Lambda + SES, Cloudflare Turnstile for CAPTCHA, API Gateway throttling for rate limiting, honeypot field. Built as its own Terraform module; the static site is untouched.

### 6.6 Analytics & Observability

- **Umami Cloud** (or self-hosted later): privacy-friendly, cookieless visitor analytics — no consent banner required
- CloudFront standard metrics + AWS Budget alarm
- Lighthouse CI trend tracked in repo

---

## 7. Repository Structure (monorepo)

```
chingyung.dev/
├── .github/workflows/        # ci.yml, deploy.yml, infra.yml
├── content/                  # §5.2 — the knowledge base
├── docs/
│   ├── ARCHITECTURE.md       # this document
│   ├── adr/                  # full ADRs (001–006, future decisions)
│   └── AUTHORING.md          # how to publish content
├── infra/                    # §6.3 — Terraform
├── public/                   # favicons, robots.txt, static assets
├── src/
│   ├── app/                  # Next.js App Router routes
│   ├── components/           # UI components (+ mdx/ component vocabulary)
│   ├── lib/content/          # §5.5 — Content Access Layer
│   └── styles/
├── next.config.ts            # output: 'export'
└── package.json
```

One repo, three concerns, three pipelines. The existing private resume-PDF repo remains separate (it contains personal data); its generated PDF is published to the site bucket by its own existing pipeline or fetched at build time.

---

## 8. SEO & Performance Plan

- Next.js Metadata API per route; frontmatter `description` drives meta description
- `sitemap.xml` + `robots.txt` generated at build
- JSON-LD structured data: `Person` (Home), `Article` (Insights), `EducationalOccupationalCredential` (certifications)
- Canonical URLs on every page; `canonical` frontmatter override for cross-posts
- Static OG image generation per article at build time (satori/@vercel/og)
- Performance budget enforced by Lighthouse CI: LCP < 2.0s, CLS < 0.1, JS shipped on content pages minimal (search/filter chunks lazy-loaded)
- Accessibility: semantic landmarks, skip links, focus-visible styles, contrast-checked palette, `prefers-reduced-motion` honoured; axe checks in CI (advisory initially)

---

## 9. Delivery Roadmap

| Phase | Scope | Exit criteria |
|---|---|---|
| **0 — Foundations** (weekend) | Register chingyung.dev; create repo skeleton; Terraform backend bootstrap; OIDC roles | `terraform plan` runs from a PR with no static credentials |
| **1 — Walking skeleton** (wk 1–2) | Next.js + Tailwind + layout shell + nav + dark mode; deploy pipeline live; "hello world" served at chingyung.dev | One-command publish path proven end-to-end |
| **2 — Content engine** (wk 2–3) | Schemas, Content Access Layer, Velite wiring, taxonomy, MDX components, Shiki, draft mode | Invalid frontmatter fails CI; sample entry of each collection renders |
| **3 — Pages** (wk 3–5) | Home → Work (+filters) → Insights (+filters, Pagefind, tag/series pages) → Resume → Contact | All routes live with real content; Lighthouse ≥ 90 enforced |
| **4 — Migration & launch** (wk 5–6) | SEO finishing (sitemap, JSON-LD, OG images); .uk 301 redirects; analytics; first 3 articles (incl. "How I rebuilt this site") | chingyung.dev canonical; .uk redirecting; legacy stack scheduled for decommission |
| **5 — Steady state** | Publish cadence; backfill case studies & certifications | New article publishable in < 1 min of authoring overhead |

## 10. Legacy Migration Plan (chingyung.uk)

1. Build and launch chingyung.dev in parallel — legacy stack untouched throughout
2. Cut over: point .uk CloudFront (or a minimal new distribution) at a CloudFront Function returning 301s to equivalent .dev paths
3. Keep redirects ≥ 12 months; monitor traffic on .uk
4. Decommission legacy CloudFormation stack (resume PDF pipeline reviewed separately and retained)

## 11. Risks & Mitigations

| Risk | Mitigation |
|---|---|
| Content library churn (Velite et al.) | Isolation inside `loader.ts`; schemas are the contract |
| Tag sprawl over years | Controlled taxonomy, PR friction for new tags |
| Scope creep into dynamic features | ADR-001 non-goal; dynamic features = separate subsystems |
| Design polish consuming the schedule | Walking skeleton first; design iterates behind a working pipeline |
| Slug/URL breakage as content grows | Permanent slugs; explicit redirect map in CloudFront Function config |

## 12. Success Criteria Mapping

| Requirement | Architectural answer |
|---|---|
| Recruiters assess quickly | Home hero + featured items; Resume online + PDF |
| Achievements showcased | Work aggregation with filters; case-study schema enforces decision-narrative structure |
| Minimal-effort publishing | One MDX file + push; <1 min authoring overhead |
| Long-term maintainability | Static-first, near-zero infra, schema-validated content, controlled taxonomy |
| Evolves with career | Content Access Layer + extensibility table (§5.9); future subsystems are additive |
| Primary professional destination | Canonical .dev domain, SEO plan, series/journals for ongoing narrative |
