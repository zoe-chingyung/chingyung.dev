import Link from "next/link";
import { StatusLine } from "@/components/status-line";

const focus = [
  "AWS security posture management",
  "Security remediation workflows",
  "Platform engineering",
  "Infrastructure automation",
  "AI-assisted engineering",
];

const links = [
  { href: "/resume/", title: "Resume", desc: "Experience, skills and career timeline." },
  { href: "/work/", title: "Work", desc: "Projects, case studies and certifications." },
  { href: "/insights/", title: "Insights", desc: "Articles, journals and engineering notes." },
];

export default function HomePage() {
  return (
    <>
      <section className="pb-16 pt-24 sm:pt-32">
        <StatusLine>whoami</StatusLine>
        <h1 className="mt-5 text-4xl font-semibold leading-tight tracking-tight sm:text-5xl">
          Cloud · Platform · Security{" "}
          <span className="text-accent">Engineer</span>
        </h1>
        <p className="mt-6 max-w-xl text-base leading-relaxed text-muted sm:text-lg">
          Building secure, scalable and automated cloud platforms through
          Infrastructure as Code, platform engineering and security
          engineering.
        </p>
      </section>

      <section className="border-t border-line py-12">
        <StatusLine>current --focus</StatusLine>
        <ul className="mt-5 flex flex-wrap gap-2">
          {focus.map((item) => (
            <li
              key={item}
              className="rounded-md bg-accent-soft px-3 py-1.5 font-mono text-xs text-accent"
            >
              {item}
            </li>
          ))}
        </ul>
      </section>

      <section className="border-t border-line py-12">
        <StatusLine>ls ./sections</StatusLine>
        <div className="mt-5 grid gap-3 sm:grid-cols-3">
          {links.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className="group rounded-lg border border-line p-4 transition-colors hover:border-accent"
            >
              <h2 className="text-sm font-semibold transition-colors group-hover:text-accent">
                {item.title} <span aria-hidden="true">→</span>
              </h2>
              <p className="mt-1.5 text-sm leading-relaxed text-muted">
                {item.desc}
              </p>
            </Link>
          ))}
        </div>
      </section>
    </>
  );
}
