/**
 * Content Access Layer — the ONLY module pages and components may import
 * content from. The implementation detail (Velite reading MDX from /content)
 * is contained here; the exported function signatures are the stable API.
 * See docs/ARCHITECTURE.md §5.5.
 */
import {
  caseStudies,
  certifications,
  insights,
  projects,
} from "#velite";

export type Insight = (typeof insights)[number];
export type Project = (typeof projects)[number];
export type CaseStudy = (typeof caseStudies)[number];
export type Certification = (typeof certifications)[number];
export type WorkItem = Project | CaseStudy;

/** Drafts are visible in dev (with a badge) and excluded from production builds. */
const showDrafts = process.env.NODE_ENV !== "production";

function published<T extends { draft: boolean }>(items: T[]): T[] {
  return showDrafts ? items : items.filter((i) => !i.draft);
}

function byDateDesc<T extends { date: string }>(a: T, b: T): number {
  return b.date.localeCompare(a.date);
}

// ---------- Insights ----------

export function getInsights(): Insight[] {
  return published(insights).sort(byDateDesc);
}

export function getInsight(year: string, slug: string): Insight | undefined {
  return getInsights().find((i) => i.slug === `${year}/${slug}`);
}

// ---------- Work ----------

export function getWorkItems(): WorkItem[] {
  return published<WorkItem>([...projects, ...caseStudies]).sort(byDateDesc);
}

export function getWorkItem(slug: string): WorkItem | undefined {
  return getWorkItems().find((i) => i.slug === slug);
}

export function getCertifications(): Certification[] {
  return [...certifications].sort((a, b) =>
    b.issueDate.localeCompare(a.issueDate),
  );
}

// ---------- Cross-collection ----------

export function getFeatured() {
  return {
    insight: getInsights().find((i) => i.featured),
    work: getWorkItems().find((i) => i.featured),
    certification: getCertifications().find((c) => c.featured),
  };
}

export { taxonomy, tagLabel } from "../../../content/data/taxonomy";
