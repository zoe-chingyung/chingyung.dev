# Authoring Guide

> Placeholder — completed in Phase 2 when the content engine lands.

Planned workflow (see ARCHITECTURE.md §5.6):

1. `git checkout -b post/<slug>`
2. Write `content/insights/<year>/<slug>.mdx` with `draft: true`
3. `npm run dev` to preview (drafts show a DRAFT badge)
4. Open a PR — CI validates frontmatter against the Zod schemas
5. Flip `draft: false`, merge — the deploy workflow publishes automatically
