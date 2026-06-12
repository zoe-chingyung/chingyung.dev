import type { Metadata } from "next";
import Link from "next/link";
import { getInsights } from "@/lib/content/api";
import { StatusLine } from "@/components/status-line";
import { DraftBadge, TagChip, formatDate } from "@/components/tag-chip";

export const metadata: Metadata = {
  title: "Insights",
  description:
    "Articles, learning journals and engineering notes on AWS, Terraform, security and platform engineering.",
};

export default function InsightsPage() {
  const insights = getInsights();

  return (
    <section className="py-16">
      <StatusLine>ls ./insights --sort date</StatusLine>
      <h1 className="mt-5 text-3xl font-semibold tracking-tight">Insights</h1>
      <p className="mt-3 max-w-xl leading-relaxed text-muted">Articles, learning journals and engineering notes.</p>

      <ul className="mt-10 space-y-2">
        {insights.map((post) => (
          <li key={post.permalink}>
            <Link href={post.permalink} className="group flex flex-col gap-1 rounded-lg border border-transparent p-4 transition-colors hover:border-line hover:bg-surface">
              <div className="flex flex-wrap items-center gap-2">
                <span className="font-mono text-xs text-muted">{formatDate(post.date)}</span>
                <span className="font-mono text-[11px] uppercase tracking-wide text-muted">{post.type}</span>
                <DraftBadge draft={post.draft} />
              </div>
              <h2 className="font-semibold transition-colors group-hover:text-accent">{post.title}</h2>
              <p className="text-sm leading-relaxed text-muted">{post.description}</p>
              <div className="mt-1 flex flex-wrap gap-1.5">
                {post.tags.map((t: any) => (
                  <TagChip key={t} tag={t} />
                ))}
              </div>
            </Link>
          </li>
        ))}
      </ul>
    </section>
  );
}
