import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { getInsight, getInsights, getSeriesEntries } from "@/lib/content/api";
import { JsonLd } from "@/components/jsonld";
import { MDXContent } from "@/components/mdx/mdx-content";
import { StatusLine } from "@/components/status-line";
import { DraftBadge, TagChip, formatDate } from "@/components/tag-chip";

type Params = { year: string; slug: string };

export function generateStaticParams(): Params[] {
  return getInsights().map((post) => {
    const [year, slug] = post.slug.split("/");
    return { year, slug };
  });
}

export async function generateMetadata({ params }: { params: Promise<Params> }): Promise<Metadata> {
  const { year, slug } = await params;
  const post = getInsight(year, slug);
  if (!post) return {};
  return {
    title: post.title,
    description: post.description,
    alternates: { canonical: post.permalink },
    openGraph: {
      type: "article",
      publishedTime: post.date,
      modifiedTime: post.updated ?? post.date,
    },
  };
}

export default async function InsightPage({ params }: { params: Promise<Params> }) {
  const { year, slug } = await params;
  const post = getInsight(year, slug);
  if (!post) notFound();

  const seriesEntries = post.series ? getSeriesEntries(post.series) : [];
  const partIndex = seriesEntries.findIndex((e) => e.permalink === post.permalink);

  return (
    <article className="py-16">
      <JsonLd
        data={{
          "@context": "https://schema.org",
          "@type": "Article",
          headline: post.title,
          description: post.description,
          datePublished: post.date,
          dateModified: post.updated ?? post.date,
          url: `https://chingyung.dev${post.permalink}`,
          author: { "@type": "Person", name: "Ching Yung", url: "https://chingyung.dev" },
        }}
      />
      <StatusLine>
        cat ./insights/{year}/{slug}.mdx
      </StatusLine>
      <header className="mt-5">
        <div className="flex flex-wrap items-center gap-2 font-mono text-xs text-muted">
          <time dateTime={post.date}>{formatDate(post.date)}</time>
          <span className="uppercase tracking-wide">{post.type}</span>
          <DraftBadge draft={post.draft} />
        </div>
        <h1 className="mt-3 text-3xl font-semibold leading-tight tracking-tight sm:text-4xl">
          {post.title}
        </h1>
        <p className="mt-3 max-w-xl leading-relaxed text-muted">{post.description}</p>
        <div className="mt-4 flex flex-wrap gap-1.5">
          {post.tags.map((t) => (
            <Link key={t} href={`/insights/tags/${t}/`}>
              <TagChip tag={t} />
            </Link>
          ))}
        </div>
        {post.series && partIndex >= 0 ? (
          <p className="mt-4 rounded-lg border border-line bg-surface px-4 py-2.5 font-mono text-xs text-muted">
            Part {partIndex + 1} of {seriesEntries.length} in{" "}
            <Link href={`/insights/series/${post.series}/`} className="text-accent hover:underline">
              this series
            </Link>
          </p>
        ) : null}
      </header>
      <div className="mt-10 border-t border-line pt-10">
        <MDXContent code={post.body} />
      </div>
    </article>
  );
}
