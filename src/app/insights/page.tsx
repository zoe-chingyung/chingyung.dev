import type { Metadata } from "next";
import { getInsightMetas, getUsedInsightTags } from "@/lib/content/api";
import { InsightsExplorer } from "@/components/insights-explorer";
import { Search } from "@/components/search";
import { StatusLine } from "@/components/status-line";

export const metadata: Metadata = {
  title: "Insights",
  description:
    "Articles, learning journals and engineering notes on AWS, Terraform, security and platform engineering.",
  alternates: { canonical: "/insights/" },
};

export default function InsightsPage() {
  const posts = getInsightMetas();
  const tags = getUsedInsightTags();

  return (
    <section className="py-16">
      <StatusLine>ls ./insights --sort date</StatusLine>
      <h1 className="mt-5 text-3xl font-semibold tracking-tight">Insights</h1>
      <p className="mt-3 max-w-xl leading-relaxed text-muted">
        Articles, learning journals and engineering notes.
      </p>
      <Search />
      <InsightsExplorer posts={posts} tags={tags} />
    </section>
  );
}
