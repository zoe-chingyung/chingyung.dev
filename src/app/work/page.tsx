import type { Metadata } from "next";
import Link from "next/link";
import { getCertifications, getWorkItems } from "@/lib/content/api";
import { StatusLine } from "@/components/status-line";
import { DraftBadge, TagChip, formatDate } from "@/components/tag-chip";

export const metadata: Metadata = {
  title: "Work",
  description:
    "Projects, engineering case studies and certifications across AWS, Terraform, security and platform engineering.",
};

export default function WorkPage() {
  const items = getWorkItems();
  const certifications = getCertifications();

  return (
    <section className="py-16">
      <StatusLine>ls ./work --all</StatusLine>
      <h1 className="mt-5 text-3xl font-semibold tracking-tight">Work</h1>
      <p className="mt-3 max-w-xl leading-relaxed text-muted">
        Projects, engineering case studies and certifications.
      </p>

      <ul className="mt-10 space-y-2">
        {items.map((item) => (
          <li key={item.permalink}>
            <Link
              href={item.permalink}
              className="group flex flex-col gap-1 rounded-lg border border-transparent p-4 transition-colors hover:border-line hover:bg-surface"
            >
              <div className="flex flex-wrap items-center gap-2">
                <span className="font-mono text-xs text-muted">
                  {formatDate(item.date)}
                </span>
                <span className="font-mono text-[11px] uppercase tracking-wide text-muted">
                  {item.kind}
                </span>
                <DraftBadge draft={item.draft} />
              </div>
              <h2 className="font-semibold transition-colors group-hover:text-accent">
                {item.title}
              </h2>
              <p className="text-sm leading-relaxed text-muted">
                {item.description}
              </p>
              <div className="mt-1 flex flex-wrap gap-1.5">
                {item.tags.map((t) => (
                  <TagChip key={t} tag={t} />
                ))}
              </div>
            </Link>
          </li>
        ))}
      </ul>

      <div className="mt-16 border-t border-line pt-10">
        <StatusLine>ls ./certifications</StatusLine>
        <h2 className="sr-only">Certifications</h2>
      </div>
      <ul className="mt-5 grid gap-3 sm:grid-cols-2">
        {certifications.map((cert) => (
          <li
            key={cert.name}
            className="rounded-lg border border-line p-4"
          >
            <h3 className="text-sm font-semibold">{cert.name}</h3>
            <p className="mt-1 font-mono text-xs text-muted">
              {cert.issuer} · {formatDate(cert.issueDate)}
            </p>
            {cert.credentialUrl ? (
              <a
                href={cert.credentialUrl}
                className="mt-2 inline-block font-mono text-xs text-accent hover:underline"
              >
                Verify credential →
              </a>
            ) : null}
          </li>
        ))}
      </ul>
    </section>
  );
}
