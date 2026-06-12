"use client";

import { tagLabel } from "../../content/data/taxonomy";

/** Presentational filter chip bar — state lives in the parent explorer. */
export function FilterBar({
  options,
  labels,
  active,
  onChange,
}: {
  options: string[];
  labels?: Record<string, string>;
  active: string | null;
  onChange: (value: string | null) => void;
}) {
  const chip = (selected: boolean) =>
    `rounded-md px-2.5 py-1 font-mono text-[11px] transition-colors ${
      selected
        ? "bg-accent text-bg"
        : "bg-accent-soft text-accent hover:bg-accent hover:text-bg"
    }`;

  return (
    <div className="flex flex-wrap gap-1.5">
      <button type="button" onClick={() => onChange(null)} className={chip(active === null)}>
        all
      </button>
      {options.map((opt) => (
        <button key={opt} type="button" onClick={() => onChange(opt)} className={chip(active === opt)}>
          {labels?.[opt] ?? tagLabel(opt)}
        </button>
      ))}
    </div>
  );
}

/**
 * URL-synced filter state that stays prerender-safe. The server render uses
 * the defaults (everything visible) so the full list lands in static HTML for
 * crawlers; after mount the state syncs from the query string, and changes
 * are written back with history.replaceState so filtered views stay shareable.
 */
import { useEffect, useState } from "react";

export function useUrlFilters<K extends string>(keys: K[]) {
  const [filters, setFilters] = useState<Record<K, string | null>>(
    () => Object.fromEntries(keys.map((k) => [k, null])) as Record<K, string | null>,
  );

  useEffect(() => {
    const sp = new URLSearchParams(window.location.search);
    setFilters(Object.fromEntries(keys.map((k) => [k, sp.get(k)])) as Record<K, string | null>);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  function set(key: K, value: string | null) {
    setFilters((prev) => ({ ...prev, [key]: value }));
    const sp = new URLSearchParams(window.location.search);
    if (value === null) sp.delete(key);
    else sp.set(key, value);
    const qs = sp.toString();
    window.history.replaceState(null, "", qs ? `?${qs}` : window.location.pathname);
  }

  return [filters, set] as const;
}
