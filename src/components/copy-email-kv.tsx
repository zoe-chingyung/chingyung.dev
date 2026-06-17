"use client";

import { useState } from "react";

export function CopyEmailKv({ user, domain }: { user: string; domain: string }) {
  const [copied, setCopied] = useState(false);
  const address = `${user}@${domain}`;

  async function handleCopy() {
    try {
      await navigator.clipboard.writeText(address);
      setCopied(true);
      window.setTimeout(() => setCopied(false), 2000);
    } catch {
      window.location.href = `mailto:${address}`;
    }
  }

  return (
    <button
      type="button"
      onClick={handleCopy}
      title={copied ? "Copied!" : "Click to copy email"}
      className="group w-full text-left transition-colors hover:text-zinc-500 sm:w-auto sm:text-right"
    >
      <span className="text-zinc-500">contact</span>
      <span className="text-zinc-600"> = </span>
      <span className="group-hover:text-accent">
        {copied ? `"${address}"` : '"echo $EMAIL"'}
      </span>
    </button>
  );
}