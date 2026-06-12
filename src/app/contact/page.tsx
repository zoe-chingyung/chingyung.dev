import type { Metadata } from "next";
import { profile } from "../../../content/data/resume";
import { EmailLink } from "@/components/email-link";
import { StatusLine } from "@/components/status-line";

export const metadata: Metadata = {
  title: "Contact",
  description: "Professional networking channels: LinkedIn, GitHub and email.",
  alternates: { canonical: "/contact/" },
};

const channels = [
  { label: "LinkedIn", href: profile.links.linkedin, handle: profile.links.linkedin.replace("https://www.", "") },
  { label: "GitHub", href: profile.links.github, handle: profile.links.github.replace("https://", "") },
];

export default function ContactPage() {
  const [user, domain] = profile.links.email;

  return (
    <section className="py-16">
      <StatusLine>cat ./contact</StatusLine>
      <h1 className="mt-5 text-3xl font-semibold tracking-tight">Contact</h1>
      <p className="mt-3 max-w-xl leading-relaxed text-muted">
        For roles, collaboration or engineering conversations — these channels reach me directly.
      </p>
      <ul className="mt-10 max-w-md space-y-3">
        {channels.map((c) => (
          <li key={c.label} className="flex items-baseline justify-between gap-4 rounded-lg border border-line px-4 py-3">
            <span className="text-sm font-semibold">{c.label}</span>
            <a href={c.href} className="font-mono text-xs text-accent hover:underline">{c.handle} →</a>
          </li>
        ))}
        <li className="flex items-baseline justify-between gap-4 rounded-lg border border-line px-4 py-3">
          <span className="text-sm font-semibold">Email</span>
          <span className="font-mono text-xs"><EmailLink user={user} domain={domain} /></span>
        </li>
      </ul>
    </section>
  );
}
