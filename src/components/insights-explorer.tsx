"use client";

import Link from "next/link";
import type { InsightMeta } from "@/lib/content/api";
import { FilterBar, useUrlFilters } from "./filter-bar";
import { DraftBadge, TagChip, formatDate } from "./tag-chip";

export function InsightsExplorer({
  posts,
  tags,
}: {
  posts: InsightMeta[];
  tags: string[];
}) {
  const [filters, setFilter] = useUrlFilters(["type", "tag"]);
  const { type, tag } = filters;

  const visible = posts.filter(
    (p) => (!type || p.type === type) && (!tag || p.tags.includes(tag)),
  );

  return (
    <div className="mt-8">
      <div className="space-y-3">
        <FilterBar
          options={["article", "journal", "note"]}
          active={type}
          onChange={(v) => setFilter("type", v)}
        />
        <FilterBar options={tags} active={tag} onChange={(v) => setFilter("tag", v)} />
      </div>

      <p className="mt-6 font-mono text-xs text-muted" role="status">
        {visible.length} of {posts.length} entries
      </p>

      <ul className="mt-2 space-y-2">
        {visible.map((post) => (
          <li key={post.permalink}>
            <Link
              href={post.permalink}
              className="group flex flex-col gap-1 rounded-lg border border-transparent p-4 transition-colors hover:border-line hover:bg-surface"
            >
              <div className="flex flex-wrap items-center gap-2">
                <span className="font-mono text-xs text-muted">{formatDate(post.date)}</span>
                <span className="font-mono text-[11px] uppercase tracking-wide text-muted">{post.type}</span>
                <DraftBadge draft={post.draft} />
              </div>
              <h2 className="font-semibold transition-colors group-hover:text-accent">{post.title}</h2>
              <p className="text-sm leading-relaxed text-muted">{post.description}</p>
              <div className="mt-1 flex flex-wrap gap-1.5">
                {post.tags.map((t) => (
                  <TagChip key={t} tag={t} />
                ))}
              </div>
            </Link>
          </li>
        ))}
      </ul>
    </div>
  );
}
