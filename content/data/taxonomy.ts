/**
 * Controlled tag vocabulary — the single source of truth for content tags.
 *
 * Velite validates every entry's `tags` against this list at build time, so
 * an unknown tag fails CI. Adding a tag here is deliberate friction: do it in
 * the same PR as the content that needs it. Descriptions render on tag
 * landing pages (Phase 3) and double as SEO copy.
 */
export interface TaxonomyEntry {
  slug: string;
  label: string;
  description: string;
}

export const taxonomy: TaxonomyEntry[] = [
  { slug: "aws", label: "AWS", description: "Amazon Web Services — architecture, services and operations." },
  { slug: "terraform", label: "Terraform", description: "Infrastructure as Code with Terraform: modules, state and workflows." },
  { slug: "security", label: "Security", description: "Cloud security engineering, posture management and remediation." },
  { slug: "platform-engineering", label: "Platform Engineering", description: "Internal platforms, golden paths and developer experience." },
  { slug: "devops", label: "DevOps", description: "Delivery practices, automation and operational culture." },
  { slug: "ci-cd", label: "CI/CD", description: "Build, test and deployment pipelines." },
  { slug: "observability", label: "Observability", description: "Metrics, logs, traces and operational insight." },
  { slug: "iac", label: "Infrastructure as Code", description: "Declarative infrastructure across tools and clouds." },
  { slug: "seo", label: "SEO", description: "Search and AI-answer visibility for technical content." },
  { slug: "ai-engineering", label: "AI Engineering", description: "AI-assisted engineering workflows, agents and tooling." },
  { slug: "career", label: "Career", description: "Career development and professional reflections." },
  { slug: "learning-journey", label: "Learning Journey", description: "Ongoing study notes and learning documentation." },
  { slug: "certifications", label: "Certifications", description: "Certification preparation and credential notes." },
];

export const TAG_SLUGS = taxonomy.map((t) => t.slug);

export function tagLabel(slug: string): string {
  return taxonomy.find((t) => t.slug === slug)?.label ?? slug;
}
