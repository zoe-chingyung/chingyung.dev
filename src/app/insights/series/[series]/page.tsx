import type { Metadata } from "next";
import Link from "next/link";
import { getSeriesEntries, getSeriesSlugs } from "@/lib/content/api";
import { StatusLine } from "@/components/status-line";
import { DraftBadge, formatDate } from "@/components/tag-chip";

type Params = { series: string };

function seriesTitle(slug: string): string {
  return slug.split("-").map((w) => w[0].toUpperCase() + w.slice(1)).join(" ");
}

export function generateStaticParams(): Params[] {
  const slugs = getSeriesSlugs();
  // output: 'export' rejects an empty params list, so until the first series
  // is published we emit one unlinked, noindexed placeholder page instead.
  if (slugs.length === 0) return [{ series: "coming-soon" }];
  return slugs.map((series) => ({ series }));
}

export async function generateMetadata({ params }: { params: Promise<Params> }): Promise<Metadata> {
  const { series } = await params;
  const empty = getSeriesEntries(series).length === 0;
  return {
    title: `${seriesTitle(series)} — Series`,
    description: `All entries in the ${seriesTitle(series)} series, in reading order.`,
    alternates: { canonical: `/insights/series/${series}/` },
    robots: empty ? { index: false } : undefined,
  };
}

export default async function SeriesPage({ params }: { params: Promise<Params> }) {
  const { series } = await params;
  const entries = getSeriesEntries(series);

  if (entries.length === 0) {
    return (
      <section className="py-16">
        <StatusLine>ls ./series</StatusLine>
        <h1 className="mt-5 text-3xl font-semibold tracking-tight">No series yet</h1>
        <p className="mt-3 max-w-xl leading-relaxed text-muted">
          Series collect journal entries into an ordered reading path. The first one is on its way —{" "}
          <Link href="/insights/" className="text-accent hover:underline">browse all insights</Link> meanwhile.
        </p>
      </section>
    );
  }

  return (
    <section className="py-16">
      <StatusLine>{`cat ./series/${series}/*.mdx`}</StatusLine>
      <h1 className="mt-5 text-3xl font-semibold tracking-tight">{seriesTitle(series)}</h1>
      <p className="mt-3 max-w-xl leading-relaxed text-muted">
        A series in {entries.length} part{entries.length > 1 ? "s" : ""}, in reading order.
      </p>
      <ol className="mt-10 space-y-2">
        {entries.map((post, idx) => (
          <li key={post.permalink}>
            <Link href={post.permalink} className="group flex items-baseline gap-4 rounded-lg border border-transparent p-4 transition-colors hover:border-line hover:bg-surface">
              <span className="font-mono text-sm text-accent">{String(idx + 1).padStart(2, "0")}</span>
              <span className="flex flex-col gap-1">
                <span className="flex flex-wrap items-center gap-2">
                  <span className="font-mono text-xs text-muted">{formatDate(post.date)}</span>
                  <DraftBadge draft={post.draft} />
                </span>
                <span className="font-semibold transition-colors group-hover:text-accent">{post.title}</span>
                <span className="text-sm leading-relaxed text-muted">{post.description}</span>
              </span>
            </Link>
          </li>
        ))}
      </ol>
    </section>
  );
}
