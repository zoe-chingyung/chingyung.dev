"use client";

import Link from "next/link";
import type { WorkMeta } from "@/lib/content/api";
import { FilterBar, useUrlFilters } from "./filter-bar";
import { DraftBadge, TagChip, formatDate } from "./tag-chip";

export function WorkExplorer({
  items,
  tags,
}: {
  items: WorkMeta[];
  tags: string[];
}) {
  const [filters, setFilter] = useUrlFilters(["kind", "tag"]);
  const { kind, tag } = filters;

  const visible = items.filter(
    (i) => (!kind || i.kind === kind) && (!tag || i.tags.includes(tag)),
  );

  return (
    <div className="mt-8">
      <div className="space-y-3">
        <FilterBar
          options={["project", "case-study"]}
          labels={{ project: "project", "case-study": "case study" }}
          active={kind}
          onChange={(v) => setFilter("kind", v)}
        />
        <FilterBar options={tags} active={tag} onChange={(v) => setFilter("tag", v)} />
      </div>

      <p className="mt-6 font-mono text-xs text-muted" role="status">
        {visible.length} of {items.length} entries
      </p>

      <ul className="mt-2 space-y-2">
        {visible.map((item) => (
          <li key={item.permalink}>
            <Link
              href={item.permalink}
              className="group flex flex-col gap-1 rounded-lg border border-transparent p-4 transition-colors hover:border-line hover:bg-surface"
            >
              <div className="flex flex-wrap items-center gap-2">
                <span className="font-mono text-xs text-muted">{formatDate(item.date)}</span>
                <span className="font-mono text-[11px] uppercase tracking-wide text-muted">{item.kind}</span>
                <DraftBadge draft={item.draft} />
              </div>
              <h2 className="font-semibold transition-colors group-hover:text-accent">{item.title}</h2>
              <p className="text-sm leading-relaxed text-muted">{item.description}</p>
              <div className="mt-1 flex flex-wrap gap-1.5">
                {item.tags.map((t) => (
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
