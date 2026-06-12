import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { getInsight, getInsights } from "@/lib/content/api";
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

export async function generateMetadata({
  params,
}: {
  params: Promise<Params>;
}): Promise<Metadata> {
  const { year, slug } = await params;
  const post = getInsight(year, slug);
  if (!post) return {};
  return {
    title: post.title,
    description: post.description,
    openGraph: { type: "article", publishedTime: post.date },
  };
}

export default async function InsightPage({
  params,
}: {
  params: Promise<Params>;
}) {
  const { year, slug } = await params;
  const post = getInsight(year, slug);
  if (!post) notFound();

  return (
    <article className="py-16">
      <StatusLine>
        cat ./insights/{year}/{slug}.mdx
      </StatusLine>
      <header className="mt-5">
        <div className="flex flex-wrap items-center gap-2 font-mono text-xs text-muted">
          <time dateTime={post.date}>{formatDate(post.date)}</time>
          <span className="uppercase tracking-wide">{post.type}</span>
          <DraftBadge draft={post.draft} />
        </div>
        <h1 className="mt-3 text-3xl font-semibold leading-tight tracking-tight sm:text-4xl">{post.title}</h1>
        <p className="mt-3 max-w-xl leading-relaxed text-muted">{post.description}</p>
        <div className="mt-4 flex flex-wrap gap-1.5">
          {post.tags.map((t: any) => (
            <TagChip key={t} tag={t} />
          ))}
        </div>
      </header>
      <div className="mt-10 border-t border-line pt-10">
        <MDXContent code={post.body} />
      </div>
    </article>
  );
}
