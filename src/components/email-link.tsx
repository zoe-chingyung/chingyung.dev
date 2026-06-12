"use client";

import { useState } from "react";

/** Assembles the mailto on interaction so the address never sits in the HTML. */
export function EmailLink({ user, domain }: { user: string; domain: string }) {
  const [revealed, setRevealed] = useState(false);
  const address = `${user}@${domain}`;

  if (revealed) {
    return (
      <a href={`mailto:${address}`} className="text-accent hover:underline">
        {address}
      </a>
    );
  }
  return (
    <button
      type="button"
      onClick={() => setRevealed(true)}
      className="text-accent hover:underline"
    >
      Reveal email
    </button>
  );
}
