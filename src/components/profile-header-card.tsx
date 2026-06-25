// src/components/profile-header-card.tsx
import Image from "next/image";
import Link from "next/link";
import { profile } from "../../content/data/resume";
import { CopyEmailKv } from "./copy-email-kv";

function TerminalIconLink({
  href,
  label,
  children,
}: {
  href: string;
  label: string;
  children: React.ReactNode;
}) {
  return (
    <Link href={href} target="_blank" rel="noopener noreferrer" aria-label={label} className="inline-flex items-center gap-1.5 rounded border border-zinc-800 bg-surface/50 px-2 py-1 font-mono text-[10px] text-zinc-600 transition-colors hover:border-zinc-600 hover:text-zinc-500">
      {children}
    </Link>
  );
}

export function ProfileHeaderCard() {
  const [user, domain] = profile.links.email;

  return (
    <div className="mb-8 flex flex-col gap-6 rounded-xl border border-white/10 bg-surface/50 p-5 backdrop-blur-md sm:flex-row sm:items-center sm:justify-between sm:p-6 tech-card-glow">
      {/* Left — Identity */}
      <div className="flex items-start gap-4 sm:items-center sm:gap-5">
        <Image src="/avatar.JPG" alt="Ching Yung" width={150} height={150} className="h-[150px] w-[150px] shrink-0 -scale-x-100 rounded-[5px] border border-white/20 object-cover " priority />
        <div>
          <h2 className="font-bold text-2xl tracking-tight">Hi, I am {profile.name}</h2>
          <p className="mt-1 text-sm text-muted">
            Cloud · Platform · Security <span className="text-accent">Engineer</span>
          </p>
          <div className="mt-3 flex flex-wrap gap-2">
            <TerminalIconLink href={profile.links.github} label="GitHub">
              <svg width="12" height="12" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
                <path d="M12 0C5.37 0 0 5.37 0 12c0 5.31 3.435 9.795 8.205 11.385.6.105.825-.255.825-.57 0-.285-.015-1.23-.015-2.235-3.015.555-3.795-.735-4.035-1.41-.135-.345-.72-1.41-1.23-1.695-.42-.225-1.02-.78-.015-.795.945-.015 1.62.855 1.845 1.23 1.08 1.815 2.805 1.305 3.495.99.105-.78.42-1.305.765-1.605-2.67-.3-5.46-1.335-5.46-5.925 0-1.305.465-2.385 1.23-3.225-.12-.3-.54-1.53.12-3.18 0 0 1.005-.315 3.3 1.23.96-.27 1.98-.405 3-.405s2.04.135 3 .405c2.295-1.56 3.3-1.23 3.3-1.23.66 1.65.24 2.88.12 3.18.765.84 1.23 1.905 1.23 3.225 0 4.605-2.805 5.625-5.475 5.925.435.375.81 1.095.81 2.22 0 1.605-.015 2.895-.015 3.3 0 .315.225.69.825.57A12.02 12.02 0 0 0 24 12c0-6.63-5.37-12-12-12z" />
              </svg>
              github
            </TerminalIconLink>
            <TerminalIconLink href={profile.links.linkedin} label="LinkedIn">
              <svg width="12" height="12" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
                <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433a2.062 2.062 0 0 1-2.063-2.065 2.062 2.062 0 0 1 2.063-2.063 2.062 2.062 0 0 1 2.063 2.063 2.062 2.062 0 0 1-2.063 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z" />
              </svg>
              linkedin
            </TerminalIconLink>
          </div>
        </div>
      </div>

      {/* Right — Operator metadata (IaC KV) */}
      <div className="space-y-2 font-mono text-xs text-zinc-400 sm:text-right">
        <CopyEmailKv user={user} domain={domain} />

        <p>
          <span className="text-zinc-500">location</span>
          <span className="text-zinc-600"> = </span>
          <span className="text-zinc-400">London, UK</span>
        </p>

        <p className="flex items-center sm:justify-end">
          <span className="inline-block mr-2 h-2 w-2 animate-pulse rounded-full bg-cyan-400" aria-hidden="true" />
          <span className="text-zinc-500">OPERATOR_STATUS</span>
          <span className="text-zinc-600"> = </span>
          <span className="text-cyan-400">&quot;SECURE&quot;</span>
        </p>
      </div>
    </div>
  );
}