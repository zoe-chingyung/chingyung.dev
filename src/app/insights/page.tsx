import type { Metadata } from "next";
import { StatusLine } from "@/components/status-line";

export const metadata: Metadata = { title: "Insights" };

export default function Page() {
  return (
    <section className="py-24">
      <StatusLine>cd ./insights</StatusLine>
      <h1 className="mt-5 text-3xl font-semibold tracking-tight">Insights</h1>
      <p className="mt-4 max-w-xl leading-relaxed text-muted">Articles, learning journals and engineering notes. The MDX content engine in Phase 2 powers this section.</p>
    </section>
  );
}
