# Content

This directory becomes the knowledge base in Phase 2:

- `projects/` — engineering projects
- `case-studies/` — decision-focused narratives
- `certifications/` — structured certification records
- `insights/<year>/` — articles, journals, notes
- `data/taxonomy.ts` — the controlled tag vocabulary

All content is consumed through `src/lib/content` (the Content Access Layer).
Pages never read these files directly. See docs/ARCHITECTURE.md §5.
