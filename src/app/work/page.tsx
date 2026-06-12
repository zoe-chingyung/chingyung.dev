import type { Metadata } from "next";
import { getCertifications, getUsedWorkTags, getWorkMetas } from "@/lib/content/api";
import { StatusLine } from "@/components/status-line";
import { WorkExplorer } from "@/components/work-explorer";
import { formatDate } from "@/components/tag-chip";

export const metadata: Metadata = {
  title: "Work",
  description:
    "Projects, engineering case studies and certifications across AWS, Terraform, security and platform engineering.",
  alternates: { canonical: "/work/" },
};

export default function WorkPage() {
  const items = getWorkMetas();
  const certifications = getCertifications();
  const tags = getUsedWorkTags();

  return (
    <section className="py-16">
      <StatusLine>ls ./work --all</StatusLine>
      <h1 className="mt-5 text-3xl font-semibold tracking-tight">Work</h1>
      <p className="mt-3 max-w-xl leading-relaxed text-muted">
        Projects, engineering case studies and certifications.
      </p>
      <WorkExplorer items={items} tags={tags} />

      <div className="mt-16 border-t border-line pt-10">
        <StatusLine>ls ./certifications</StatusLine>
        <h2 className="sr-only">Certifications</h2>
      </div>
      <ul className="mt-5 grid gap-3 sm:grid-cols-2">
        {certifications.map((cert) => (
          <li key={cert.name} className="rounded-lg border border-line p-4">
            <h3 className="text-sm font-semibold">{cert.name}</h3>
            <p className="mt-1 font-mono text-xs text-muted">
              {cert.issuer} · {formatDate(cert.issueDate)}
            </p>
            {cert.credentialUrl ? (
              <a href={cert.credentialUrl} className="mt-2 inline-block font-mono text-xs text-accent hover:underline">
                Verify credential →
              </a>
            ) : null}
          </li>
        ))}
      </ul>
    </section>
  );
}
