import type { Metadata } from "next";
import { StatusLine } from "@/components/status-line";

export const metadata: Metadata = { title: "Contact" };

export default function Page() {
  return (
    <section className="py-24">
      <StatusLine>cd ./contact</StatusLine>
      <h1 className="mt-5 text-3xl font-semibold tracking-tight">Contact</h1>
      <p className="mt-4 max-w-xl leading-relaxed text-muted">Professional networking channels: LinkedIn, GitHub and email. Links will be added at launch.</p>
    </section>
  );
}
