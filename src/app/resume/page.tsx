import type { Metadata } from "next";
import { StatusLine } from "@/components/status-line";

export const metadata: Metadata = { title: "Resume" };

export default function Page() {
  return (
    <section className="py-24">
      <StatusLine>cd ./resume</StatusLine>
      <h1 className="mt-5 text-3xl font-semibold tracking-tight">Resume</h1>
      <p className="mt-4 max-w-xl leading-relaxed text-muted">Professional experience, career timeline and skills matrix land here in Phase 3. The downloadable PDF will be wired to the existing resume pipeline.</p>
    </section>
  );
}
