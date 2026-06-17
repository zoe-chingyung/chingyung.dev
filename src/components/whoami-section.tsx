import { profile } from "../../content/data/resume";
import { StatusLine } from "./status-line";

const TECH_TERMS = [
  "Terraform",
  "CloudFormation",
  "Datadog",
  "Prometheus",
  "CloudWatch",
] as const;

const METRICS = [
  { value: "5+", label: "YEARS OPERATING", accent: false },
  { value: "70+", label: "AWS ACCOUNTS", accent: false },
  { value: "200+", label: "IaC MODULES", accent: false },
  { value: "3x", label: "ELITE CREDENTIALS", accent: true },
] as const;

function TechTag({ children }: { children: string }) {
  return <span className="mx-0.5 inline-block rounded bg-surface/50 px-1.5 py-0.5 font-mono text-xs text-cyan-400">{children}</span>;
}

function highlightTechTerms(text: string) {
  const pattern = new RegExp(`(${TECH_TERMS.join("|")})`, "g");
  return text.split(pattern).map((part, index) => {
    if (TECH_TERMS.includes(part as (typeof TECH_TERMS)[number])) {
      return <TechTag key={`${part}-${index}`}>{part}</TechTag>;
    }
    return part;
  });
}

export function WhoAmiSection() {
  return (
    <section className="pb-12 pt-8">
      <StatusLine>whoami</StatusLine>

      <h1 className="mt-5 text-4xl font-semibold leading-tight tracking-tight sm:text-5xl">
        Cloud · Platform · Security <span className="text-cyan-400">Engineer</span>
      </h1>

      <div className="mt-6 max-w-2xl space-y-4">
        {profile.summary.map((text) => (
          <p key={text.slice(0, 32)} className="text-base leading-relaxed sm:text-lg">
            {highlightTechTerms(text)}
          </p>
        ))}
      </div>

      <div className="mt-8 grid grid-cols-2 gap-4 md:grid-cols-4">
        {METRICS.map((metric) => (
          <div key={metric.label} className="rounded-xl border border-zinc-800 bg-surface/30 p-6 text-center transition-all duration-300 tech-card-glow">
            <p className={`font-mono text-3xl font-extrabold ${metric.accent ? "text-cyan-400" : "text-accent"}`}>{metric.value}</p>
            <p className="mt-2 font-sans text-xs font-semibold tracking-wider">{metric.label}</p>
          </div>
        ))}
      </div>
    </section>
  );
}
