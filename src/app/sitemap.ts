import type { MetadataRoute } from "next";
import {
  getInsights,
  getSeriesSlugs,
  getUsedInsightTags,
  getUsedWorkTags,
  getWorkItems,
} from "@/lib/content/api";

export const dynamic = "force-static";

const BASE = "https://chingyung.dev";

export default function sitemap(): MetadataRoute.Sitemap {
  const statics = ["/", "/resume/", "/work/", "/insights/", "/contact/"].map((p) => ({
    url: `${BASE}${p}`,
  }));
  const insights = getInsights().map((i) => ({
    url: `${BASE}${i.permalink}`,
    lastModified: i.updated ?? i.date,
  }));
  const work = getWorkItems().map((w) => ({
    url: `${BASE}${w.permalink}`,
    lastModified: w.date,
  }));
  const tagPages = [
    ...getUsedInsightTags().map((t) => `${BASE}/insights/tags/${t}/`),
    ...getUsedWorkTags().map((t) => `${BASE}/work/tags/${t}/`),
    ...getSeriesSlugs().map((s) => `${BASE}/insights/series/${s}/`),
  ].map((url) => ({ url }));

  return [...statics, ...insights, ...work, ...tagPages];
}
