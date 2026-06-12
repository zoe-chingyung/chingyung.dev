# Authoring Guide

How to publish content on chingyung.dev. Total authoring overhead target:
under one minute once the writing is done.

## Publish an insight

1. `git checkout -b post/<slug>`
2. Create `content/insights/<year>/<slug>.mdx`:

   ```yaml
   ---
   title: "Your title"                  # ≤ 99 chars
   description: "One-sentence summary." # ≤ 160 chars; becomes the meta description
   date: 2026-06-12
   type: article                        # article | journal | note
   tags: [aws, security]                # 1–4, must exist in content/data/taxonomy.ts
   series: my-series                    # optional, for journals
   draft: true                          # keep true while writing
   featured: false                      # true = surfaces on the home page
   ---
   ```

3. `npm run dev` — drafts render locally with a DRAFT badge
4. Open a PR — CI validates frontmatter (an unknown tag or missing field fails
   the build), builds the site, and uploads a preview artifact
5. Flip `draft: false`, merge. Deployment is automatic.

## Other collections

- **Projects** → `content/projects/<slug>.mdx` — adds `technologies: []` and
  optional `repo:` URL. Structure prose as Overview / Problem statement /
  Solution / Outcomes.
- **Case studies** → `content/case-studies/<slug>.mdx` — structure prose as
  Context / Problem / Constraints / Design decisions / Implementation /
  Lessons learned.
- **Certifications** → `content/certifications/<slug>.yml` — pure YAML, no
  prose. Fields: `name`, `issuer`, `issueDate`, `credentialUrl`, `tags`,
  `featured`.

## MDX components

Available inside any `.mdx` body:

```mdx
<Callout type="info">Highlight something.</Callout>
<Callout type="warn">Warn about something.</Callout>
<Figure src="/static/diagram.png" alt="Description" caption="Optional caption" />
```

Code blocks are highlighted at build time (Shiki, light/dark themes):

````mdx
```hcl
resource "aws_s3_bucket" "site" {}
```
````

## Adding a tag

Add it to `content/data/taxonomy.ts` in the same PR as the content that needs
it. The build rejects tags that aren't in the taxonomy.

## Rules

- Slugs are permanent — renaming a file breaks its URL
- 1–4 tags per entry; prefer existing tags over new ones
- `description` doubles as SEO copy — write it for the search result snippet
