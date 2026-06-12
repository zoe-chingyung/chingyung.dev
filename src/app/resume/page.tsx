import type { Metadata } from "next";
import { experience, profile, skills } from "../../../content/data/resume";
import { getCertifications } from "@/lib/content/api";
import { StatusLine } from "@/components/status-line";
import { formatDate } from "@/components/tag-chip";

export const metadata: Metadata = {
  title: "Resume",
  description: `${profile.title} — professional experience, skills matrix and career timeline.`,
  alternates: { canonical: "/resume/" },
};

function formatYm(ym: string): string {
  return new Date(`${ym}-01`).toLocaleDateString("en-GB", { month: "short", year: "numeric" });
}

export default function ResumePage() {
  const certifications = getCertifications();

  return (
    <section className="py-16">
      <StatusLine>cat ./resume --format full</StatusLine>
      <div className="mt-5 flex flex-wrap items-end justify-between gap-4">
        <div>
          <h1 className="text-3xl font-semibold tracking-tight">{profile.name}</h1>
          <p className="mt-1 text-muted">{profile.title} · {profile.location}</p>
        </div>
        <a
          href={profile.pdfPath}
          download
          className="rounded-lg bg-accent px-4 py-2 text-sm font-semibold text-bg transition-opacity hover:opacity-90"
        >
          Download PDF
        </a>
      </div>
      <p className="mt-6 max-w-xl leading-relaxed text-muted">{profile.summary}</p>

      <div className="mt-14">
        <StatusLine>history --career</StatusLine>
        <h2 className="sr-only">Experience</h2>
        <ol className="mt-6 space-y-8 border-l border-line pl-6">
          {experience.map((job) => (
            <li key={`${job.company}-${job.start}`} className="relative">
              <span aria-hidden="true" className="absolute -left-[1.85rem] top-1.5 h-2.5 w-2.5 rounded-full border-2 border-accent bg-bg" />
              <p className="font-mono text-xs text-muted">
                {formatYm(job.start)} — {job.end ? formatYm(job.end) : "present"}
              </p>
              <h3 className="mt-1 font-semibold">{job.role} · <span className="text-muted">{job.company}</span></h3>
              <ul className="mt-2 list-disc space-y-1 pl-5 text-sm leading-relaxed text-muted">
                {job.highlights.map((h) => (
                  <li key={h}>{h}</li>
                ))}
              </ul>
            </li>
          ))}
        </ol>
      </div>

      <div className="mt-14">
        <StatusLine>cat ./skills-matrix</StatusLine>
        <h2 className="sr-only">Skills</h2>
        <dl className="mt-6 grid gap-x-8 gap-y-5 sm:grid-cols-2">
          {skills.map((group) => (
            <div key={group.category}>
              <dt className="text-sm font-semibold">{group.category}</dt>
              <dd className="mt-1.5 flex flex-wrap gap-1.5">
                {group.items.map((item) => (
                  <span key={item} className="rounded-md bg-surface px-2 py-0.5 font-mono text-[11px] text-muted">
                    {item}
                  </span>
                ))}
              </dd>
            </div>
          ))}
        </dl>
      </div>

      <div className="mt-14">
        <StatusLine>ls ./certifications</StatusLine>
        <h2 className="sr-only">Certifications</h2>
        <ul className="mt-6 space-y-2">
          {certifications.map((cert) => (
            <li key={cert.name} className="flex flex-wrap items-baseline justify-between gap-2 rounded-lg border border-line px-4 py-3">
              <span className="text-sm font-semibold">{cert.name}</span>
              <span className="font-mono text-xs text-muted">{cert.issuer} · {formatDate(cert.issueDate)}</span>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
