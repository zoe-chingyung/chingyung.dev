import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { getUsedWorkTags, getWorkByTag, tagLabel, taxonomy } from "@/lib/content/api";
import { StatusLine } from "@/components/status-line";
import { DraftBadge, formatDate } from "@/components/tag-chip";

type Params = { tag: string };

export function generateStaticParams(): Params[] {
  return getUsedWorkTags().map((tag) => ({ tag }));
}

export async function generateMetadata({ params }: { params: Promise<Params> }): Promise<Metadata> {
  const { tag } = await params;
  const entry = taxonomy.find((t) => t.slug === tag);
  if (!entry) return {};
  return {
    title: `${entry.label} — Work`,
    description: entry.description,
    alternates: { canonical: `/work/tags/${tag}/` },
  };
}

export default async function WorkTagPage({ params }: { params: Promise<Params> }) {
  const { tag } = await params;
  const entry = taxonomy.find((t) => t.slug === tag);
  const items = getWorkByTag(tag);
  if (!entry || items.length === 0) notFound();

  return (
    <section className="py-16">
      <StatusLine>grep -rl &quot;{tag}&quot; ./work</StatusLine>
      <h1 className="mt-5 text-3xl font-semibold tracking-tight">{tagLabel(tag)}</h1>
      <p className="mt-3 max-w-xl leading-relaxed text-muted">{entry.description}</p>
      <ul className="mt-10 space-y-2">
        {items.map((item) => (
          <li key={item.permalink}>
            <Link href={item.permalink} className="group flex flex-col gap-1 rounded-lg border border-transparent p-4 transition-colors hover:border-line hover:bg-surface">
              <div className="flex flex-wrap items-center gap-2">
                <span className="font-mono text-xs text-muted">{formatDate(item.date)}</span>
                <span className="font-mono text-[11px] uppercase tracking-wide text-muted">{item.kind}</span>
                <DraftBadge draft={item.draft} />
              </div>
              <h2 className="font-semibold transition-colors group-hover:text-accent">{item.title}</h2>
              <p className="text-sm leading-relaxed text-muted">{item.description}</p>
            </Link>
          </li>
        ))}
      </ul>
    </section>
  );
}
