import Link from "next/link";
import { getFeatured } from "@/lib/content/api";
import { JsonLd } from "@/components/jsonld";
import { StatusLine } from "@/components/status-line";
import { formatDate } from "@/components/tag-chip";
import { profile } from "../../content/data/resume";

const focus = [
  "AWS security posture management",
  "Security remediation workflows",
  "Platform engineering",
  "Infrastructure automation",
  "AI-assisted engineering",
];

export default function HomePage() {
  const featured = getFeatured();

  const cards = [
    featured.work && {
      eyebrow: "Featured project",
      title: featured.work.title,
      desc: featured.work.description,
      href: featured.work.permalink,
      meta: formatDate(featured.work.date),
    },
    featured.insight && {
      eyebrow: "Featured article",
      title: featured.insight.title,
      desc: featured.insight.description,
      href: featured.insight.permalink,
      meta: formatDate(featured.insight.date),
    },
    featured.certification && {
      eyebrow: "Recent certification",
      title: featured.certification.name,
      desc: featured.certification.issuer,
      href: "/work/",
      meta: formatDate(featured.certification.issueDate),
    },
  ].filter(Boolean) as { eyebrow: string; title: string; desc: string; href: string; meta: string }[];

  return (
    <>
      <JsonLd
        data={{
          "@context": "https://schema.org",
          "@type": "Person",
          name: profile.name,
          jobTitle: profile.title,
          url: "https://chingyung.dev",
          sameAs: [profile.links.github, profile.links.linkedin],
        }}
      />
      <section className="pb-16 pt-24 sm:pt-32">
        <StatusLine>whoami</StatusLine>
        <h1 className="mt-5 text-4xl font-semibold leading-tight tracking-tight sm:text-5xl">
          Cloud · Platform · Security <span className="text-accent">Engineer</span>
        </h1>
        <p className="mt-6 max-w-xl text-base leading-relaxed text-muted sm:text-lg">
          {profile.summary}
        </p>
      </section>

      <section className="border-t border-line py-12">
        <StatusLine>current --focus</StatusLine>
        <ul className="mt-5 flex flex-wrap gap-2">
          {focus.map((item) => (
            <li key={item} className="rounded-md bg-accent-soft px-3 py-1.5 font-mono text-xs text-accent">
              {item}
            </li>
          ))}
        </ul>
      </section>

      <section className="border-t border-line py-12">
        <StatusLine>cat ./featured/*</StatusLine>
        <div className="mt-5 grid gap-3 sm:grid-cols-3">
          {cards.map((card) => (
            <Link key={card.href + card.title} href={card.href} className="group flex flex-col rounded-lg border border-line p-4 transition-colors hover:border-accent">
              <p className="font-mono text-[11px] uppercase tracking-wide text-muted">{card.eyebrow}</p>
              <h2 className="mt-2 text-sm font-semibold transition-colors group-hover:text-accent">{card.title}</h2>
              <p className="mt-1.5 line-clamp-3 text-sm leading-relaxed text-muted">{card.desc}</p>
              <p className="mt-auto pt-3 font-mono text-xs text-muted">{card.meta}</p>
            </Link>
          ))}
        </div>
      </section>

      <section className="border-t border-line py-12">
        <StatusLine>ls ./sections</StatusLine>
        <div className="mt-5 grid gap-3 sm:grid-cols-3">
          {[
            { href: "/resume/", title: "Resume", desc: "Experience, skills and career timeline." },
            { href: "/work/", title: "Work", desc: "Projects, case studies and certifications." },
            { href: "/insights/", title: "Insights", desc: "Articles, journals and engineering notes." },
          ].map((item) => (
            <Link key={item.href} href={item.href} className="group rounded-lg border border-line p-4 transition-colors hover:border-accent">
              <h2 className="text-sm font-semibold transition-colors group-hover:text-accent">
                {item.title} <span aria-hidden="true">→</span>
              </h2>
              <p className="mt-1.5 text-sm leading-relaxed text-muted">{item.desc}</p>
            </Link>
          ))}
        </div>
      </section>
    </>
  );
}
