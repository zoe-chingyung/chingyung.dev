import { tagLabel } from "@/lib/content/api";

export function TagChip({ tag }: { tag: string }) {
  return (
    <span className="rounded-md bg-accent-soft px-2 py-0.5 font-mono text-[11px] text-accent">
      {tagLabel(tag)}
    </span>
  );
}

export function DraftBadge({ draft }: { draft: boolean }) {
  if (!draft) return null;
  return (
    <span className="rounded-md border border-amber-500/50 bg-amber-500/10 px-2 py-0.5 font-mono text-[11px] text-amber-600 dark:text-amber-400">
      DRAFT
    </span>
  );
}

export function formatDate(iso: string): string {
  return new Date(iso).toLocaleDateString("en-GB", {
    day: "numeric",
    month: "short",
    year: "numeric",
  });
}
