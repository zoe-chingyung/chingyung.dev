import type { Metadata } from "next";
import { StatusLine } from "@/components/status-line";

export const metadata: Metadata = { title: "Work" };

export default function Page() {
  return (
    <section className="py-24">
      <StatusLine>cd ./work</StatusLine>
      <h1 className="mt-5 text-3xl font-semibold tracking-tight">Work</h1>
      <p className="mt-4 max-w-xl leading-relaxed text-muted">Projects, engineering case studies, certifications and open-source contributions — with type and tag filtering — arrive with the content engine in Phase 2–3.</p>
    </section>
  );
}
