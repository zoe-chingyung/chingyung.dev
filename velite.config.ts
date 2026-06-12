import rehypeShiki from "@shikijs/rehype";
import { defineCollection, defineConfig, s } from "velite";
import { TAG_SLUGS } from "./content/data/taxonomy";

/**
 * Content collection schemas — THE contract of the content layer.
 *
 * Pages never import from here or from `.velite` directly; they go through
 * `src/lib/content/api.ts` (the Content Access Layer). Swapping the authoring
 * backend later (Keystatic, Tina, AI publishing) must not change these shapes.
 * See docs/ARCHITECTURE.md §5.
 */

const tags = s
  .array(s.enum(TAG_SLUGS as [string, ...string[]]))
  .min(1)
  .max(4);

const insights = defineCollection({
  name: "Insight",
  pattern: "insights/**/*.mdx",
  schema: s
    .object({
      title: s.string().max(99),
      description: s.string().max(160),
      date: s.isodate(),
      updated: s.isodate().optional(),
      type: s.enum(["article", "journal", "note"]).default("article"),
      tags,
      series: s.string().optional(),
      draft: s.boolean().default(false),
      featured: s.boolean().default(false),
      path: s.path(), // e.g. "insights/2026/my-post"
      body: s.mdx(),
    })
    .transform((data) => ({
      ...data,
      slug: data.path.split("/").slice(1).join("/"), // "2026/my-post"
      permalink: `/${data.path}/`,
    })),
});

const projects = defineCollection({
  name: "Project",
  pattern: "projects/**/*.mdx",
  schema: s
    .object({
      title: s.string().max(99),
      description: s.string().max(160),
      date: s.isodate(),
      tags,
      technologies: s.array(s.string()).default([]),
      repo: s.string().url().optional(),
      draft: s.boolean().default(false),
      featured: s.boolean().default(false),
      path: s.path(),
      body: s.mdx(),
    })
    .transform((data) => ({
      ...data,
      kind: "project" as const,
      slug: data.path.split("/").pop()!,
      permalink: `/work/${data.path.split("/").pop()}/`,
    })),
});

const caseStudies = defineCollection({
  name: "CaseStudy",
  pattern: "case-studies/**/*.mdx",
  schema: s
    .object({
      title: s.string().max(99),
      description: s.string().max(160),
      date: s.isodate(),
      tags,
      draft: s.boolean().default(false),
      featured: s.boolean().default(false),
      path: s.path(),
      body: s.mdx(),
    })
    .transform((data) => ({
      ...data,
      kind: "case-study" as const,
      slug: data.path.split("/").pop()!,
      permalink: `/work/${data.path.split("/").pop()}/`,
    })),
});

// Pure structured data — YAML, no prose body.
const certifications = defineCollection({
  name: "Certification",
  pattern: "certifications/*.yml",
  schema: s.object({
    name: s.string(),
    issuer: s.string(),
    issueDate: s.isodate(),
    credentialUrl: s.string().url().optional(),
    tags: tags.optional(),
    featured: s.boolean().default(false),
  }),
});

export default defineConfig({
  root: "content",
  collections: { insights, projects, caseStudies, certifications },
  mdx: {
    rehypePlugins: [
      [
        rehypeShiki,
        {
          themes: { light: "github-light", dark: "github-dark" },
          defaultColor: "light",
        },
      ],
    ],
  },
});
