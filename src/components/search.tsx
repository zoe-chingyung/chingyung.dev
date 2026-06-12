"use client";

import { useRef, useState } from "react";

interface SearchResult {
  url: string;
  meta: { title?: string };
  excerpt: string;
}

/**
 * Full-text search over the Pagefind index generated at build time
 * (`pagefind --site out`). The index doesn't exist in `next dev`, so the
 * component degrades gracefully with a hint.
 */
export function Search() {
  const [results, setResults] = useState<SearchResult[] | null>(null);
  const [unavailable, setUnavailable] = useState(false);
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const pagefind = useRef<any>(null);

  async function ensureLoaded() {
    if (pagefind.current || unavailable) return;
    try {
      // Path kept as a variable: the module only exists in the production
      // build output, so neither tsc nor webpack must try to resolve it.
      const pagefindPath = "/pagefind/pagefind.js";
      pagefind.current = await import(/* webpackIgnore: true */ pagefindPath);
    } catch {
      setUnavailable(true);
    }
  }

  async function onSearch(query: string) {
    if (!query.trim()) {
      setResults(null);
      return;
    }
    await ensureLoaded();
    if (!pagefind.current) return;
    const search = await pagefind.current.search(query);
    const loaded = await Promise.all(
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      search.results.slice(0, 8).map((r: any) => r.data()),
    );
    setResults(loaded);
  }

  return (
    <div className="mt-8">
      <input
        type="search"
        placeholder="Search articles…"
        aria-label="Search articles"
        onFocus={ensureLoaded}
        onChange={(e) => onSearch(e.target.value)}
        className="w-full rounded-lg border border-line bg-surface px-4 py-2.5 text-sm outline-none transition-colors placeholder:text-muted focus:border-accent"
      />
      {unavailable ? (
        <p className="mt-2 font-mono text-xs text-muted">
          Search index is generated at build time — available on the live site.
        </p>
      ) : null}
      {results !== null ? (
        <ul className="mt-3 space-y-2" aria-label="Search results">
          {results.length === 0 ? (
            <li className="p-4 font-mono text-xs text-muted">No results.</li>
          ) : (
            results.map((r) => (
              <li key={r.url}>
                <a
                  href={r.url}
                  className="block rounded-lg border border-line p-4 transition-colors hover:border-accent"
                >
                  <h3 className="text-sm font-semibold">{r.meta.title}</h3>
                  <p
                    className="mt-1 text-xs leading-relaxed text-muted [&_mark]:bg-accent-soft [&_mark]:text-accent"
                    dangerouslySetInnerHTML={{ __html: r.excerpt }}
                  />
                </a>
              </li>
            ))
          )}
        </ul>
      ) : null}
    </div>
  );
}
