import type { Metadata } from "next";
// 1. 💡 注意：這裡把 certifications 拿走了，不再從靜態的 resume.ts 讀取
import { experience, profile, skills, education, keyImpact } from "../../../content/data/resume";
// 2. 💡 引入 Velite 動態 API 同埋專案自帶的日期格式化工具
import { getCertifications } from "@/lib/content/api";
import { formatDate } from "@/components/tag-chip";
import { StatusLine } from "@/components/status-line";

export const metadata: Metadata = {
  title: "Resume",
  description: `${profile.title} — professional experience, skills matrix and career timeline.`,
  alternates: { canonical: "/resume/" },
};

// 安全的日期格式化工具（用於工作經驗）
function formatTimelineDate(dateStr: string): string {
  if (!dateStr) return "";
  if (dateStr.includes("-")) {
    return new Date(`${dateStr}-01`).toLocaleDateString("en-GB", { month: "short", year: "numeric" });
  }
  return dateStr;
}

// 💡 自動對照證照名稱，幫動態 YAML 資料配對漂亮的 Badge 級別
function getCertLevel(name: string): string {
  const lowerName = name.toLowerCase();
  if (lowerName.includes("professional")) return "PROFESSIONAL";
  if (lowerName.includes("associate")) return "ASSOCIATE";
  if (lowerName.includes("administrator") || lowerName.includes("cka")) return "CKA";
  if (lowerName.includes("practitioner")) return "FOUNDATIONAL";
  return "CERTIFIED";
}

export default function ResumePage() {
  // 3. 💡 呼叫 API，動態食番 content/certifications/*.yml 嘅所有資料！
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

      {/* Key Impact 區塊 */}
      <div className="mt-14">
        <StatusLine>cat ./key-metrics</StatusLine>
        <h2 className="sr-only">Key Impact</h2>
        <div className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {keyImpact.map((metric) => (
            <div key={metric.title} className="rounded-lg border border-line p-4 bg-surface/50">
              <div className="text-xl font-bold text-accent">{metric.title}</div>
              <p className="mt-1 text-xs text-muted leading-relaxed">{metric.description}</p>
            </div>
          ))}
        </div>
      </div>

      {/* 工作經驗區塊 */}
      <div className="mt-14">
        <StatusLine>history --career</StatusLine>
        <h2 className="sr-only">Experience</h2>
        <ol className="mt-6 space-y-8 border-l border-line pl-6">
          {experience.map((job) => (
            <li key={`${job.company}-${job.start}`} className="relative">
              <span aria-hidden="true" className="absolute -left-[1.85rem] top-1.5 h-2.5 w-2.5 rounded-full border-2 border-accent bg-bg" />
              <p className="font-mono text-xs text-muted">
                {formatTimelineDate(job.start)} — {job.end ? formatTimelineDate(job.end) : "present"}
              </p>
              <h3 className="mt-1 font-semibold">
                {job.role} · <span className="text-muted">{job.company}</span>
              </h3>
              {job.context && (
                <p className="mt-1 text-xs text-muted italic bg-surface/30 px-2 py-1 rounded border-l-2 border-accent/50 max-w-xl">
                  {job.context}
                </p>
              )}
              <ul className="mt-2 list-disc space-y-1 pl-5 text-sm leading-relaxed text-muted">
                {job.highlights.map((h) => (
                  <li key={h}>{h}</li>
                ))}
              </ul>
            </li>
          ))}
        </ol>
      </div>

      {/* 技能矩陣區塊 */}
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

      {/* ================= 🛠️ 證照區塊（🎉 100% 動態化） ================= */}
      <div className="mt-14">
        <StatusLine>ls ./certifications</StatusLine>
        <h2 className="sr-only">Certifications</h2>
        <ul className="mt-6 space-y-2">
          {certifications.map((cert) => (
            <li key={cert.name} className="flex flex-wrap items-baseline justify-between gap-2 rounded-lg border border-line px-4 py-3">
              <div className="flex flex-wrap items-center gap-2">
                <span className="text-sm font-semibold">{cert.name}</span>
                <span className="rounded bg-accent/10 px-1.5 py-0.5 font-mono text-[10px] font-bold text-accent">
                  {getCertLevel(cert.name)}
                </span>
                {cert.credentialUrl && (
                  <a 
                    href={cert.credentialUrl} 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="font-mono text-[11px] text-accent hover:underline ml-1"
                  >
                    Verify ↗
                  </a>
                )}
              </div>
              <span className="font-mono text-xs text-muted">
                {cert.issuer} · {formatDate(cert.issueDate)}
              </span>
            </li>
          ))}
        </ul>
      </div>

      {/* 教育程度區塊 */}
      <div className="mt-14">
        <StatusLine>ls ./education</StatusLine>
        <h2 className="sr-only">Education</h2>
        <ul className="mt-6 space-y-2">
          {education.map((edu) => (
            <li key={edu.degree} className="flex flex-wrap items-baseline justify-between gap-2 rounded-lg border border-line px-4 py-3">
              <span className="text-sm font-semibold">{edu.degree}</span>
              <span className="font-mono text-xs text-muted">{edu.school}</span>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}