import Link from "next/link";
import { StatusLine } from "@/components/status-line";

export default function NotFound() {
  return (
    <section className="py-24">
      <StatusLine>cat ./page — no such file or directory</StatusLine>
      <h1 className="mt-5 text-3xl font-semibold tracking-tight">
        404 — page not found
      </h1>
      <p className="mt-4 max-w-xl leading-relaxed text-muted">
        This page doesn&apos;t exist or has moved.{" "}
        <Link href="/" className="text-accent hover:underline">
          Return home
        </Link>
        .
      </p>
    </section>
  );
}
