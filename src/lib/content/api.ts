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

/** Lightweight shapes (no compiled MDX body) safe to pass to client components. */
export interface InsightMeta {
  title: string;
  description: string;
  date: string;
  type: Insight["type"];
  tags: string[];
  series?: string;
  draft: boolean;
  permalink: string;
}

export interface WorkMeta {
  title: string;
  description: string;
  date: string;
  kind: WorkItem["kind"];
  tags: string[];
  draft: boolean;
  permalink: string;
}

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

export function getInsightMetas(): InsightMeta[] {
  return getInsights().map((i) => ({
    title: i.title,
    description: i.description,
    date: i.date,
    type: i.type,
    tags: i.tags,
    series: i.series,
    draft: i.draft,
    permalink: i.permalink,
  }));
}

export function getInsightsByTag(tag: string): Insight[] {
  return getInsights().filter((i) => (i.tags as string[]).includes(tag));
}

// ---------- Series ----------

export function getSeriesSlugs(): string[] {
  return [...new Set(getInsights().flatMap((i) => (i.series ? [i.series] : [])))];
}

/** Entries in reading order (oldest first), for part numbering and prev/next. */
export function getSeriesEntries(series: string): Insight[] {
  return getInsights()
    .filter((i) => i.series === series)
    .sort((a, b) => a.date.localeCompare(b.date));
}

// ---------- Work ----------

export function getWorkItems(): WorkItem[] {
  return published<WorkItem>([...projects, ...caseStudies]).sort(byDateDesc);
}

export function getWorkItem(slug: string): WorkItem | undefined {
  return getWorkItems().find((i) => i.slug === slug);
}

export function getWorkMetas(): WorkMeta[] {
  return getWorkItems().map((i) => ({
    title: i.title,
    description: i.description,
    date: i.date,
    kind: i.kind,
    tags: i.tags,
    draft: i.draft,
    permalink: i.permalink,
  }));
}

export function getWorkByTag(tag: string): WorkItem[] {
  return getWorkItems().filter((i) => (i.tags as string[]).includes(tag));
}

export function getCertifications(): Certification[] {
  return [...certifications].sort((a, b) =>
    b.issueDate.localeCompare(a.issueDate),
  );
}

// ---------- Tags ----------

export function getUsedInsightTags(): string[] {
  return [...new Set(getInsights().flatMap((i) => i.tags as string[]))].sort();
}

export function getUsedWorkTags(): string[] {
  return [...new Set(getWorkItems().flatMap((i) => i.tags as string[]))].sort();
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
