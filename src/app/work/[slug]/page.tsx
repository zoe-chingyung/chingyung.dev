import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { getWorkItem, getWorkItems } from "@/lib/content/api";
import { MDXContent } from "@/components/mdx/mdx-content";
import { StatusLine } from "@/components/status-line";
import { DraftBadge, TagChip, formatDate } from "@/components/tag-chip";

type Params = { slug: string };

export function generateStaticParams(): Params[] {
  return getWorkItems().map((item) => ({ slug: item.slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<Params>;
}): Promise<Metadata> {
  const { slug } = await params;
  const item = getWorkItem(slug);
  if (!item) return {};
  return { title: item.title, description: item.description };
}

export default async function WorkItemPage({
  params,
}: {
  params: Promise<Params>;
}) {
  const { slug } = await params;
  const item = getWorkItem(slug);
  if (!item) notFound();

  return (
    <article className="py-16">
      <StatusLine>cat ./work/{slug}.mdx</StatusLine>
      <header className="mt-5">
        <div className="flex flex-wrap items-center gap-2 font-mono text-xs text-muted">
          <time dateTime={item.date}>{formatDate(item.date)}</time>
          <span className="uppercase tracking-wide">{item.kind}</span>
          <DraftBadge draft={item.draft} />
        </div>
        <h1 className="mt-3 text-3xl font-semibold leading-tight tracking-tight sm:text-4xl">
          {item.title}
        </h1>
        <p className="mt-3 max-w-xl leading-relaxed text-muted">
          {item.description}
        </p>
        <div className="mt-4 flex flex-wrap items-center gap-1.5">
          {item.tags.map((t) => (
            <TagChip key={t} tag={t} />
          ))}
          {"repo" in item && item.repo ? (
            <a
              href={item.repo}
              className="ml-1 font-mono text-xs text-accent hover:underline"
            >
              Repository →
            </a>
          ) : null}
        </div>
      </header>
      <div className="mt-10 border-t border-line pt-10">
        <MDXContent code={item.body} />
      </div>
    </article>
  );
}
