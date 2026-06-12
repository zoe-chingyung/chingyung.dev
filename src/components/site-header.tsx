import Link from "next/link";
import { ThemeToggle } from "./theme-toggle";

const nav = [
  { href: "/resume/", label: "Resume" },
  { href: "/work/", label: "Work" },
  { href: "/insights/", label: "Insights" },
  { href: "/contact/", label: "Contact" },
];

export function SiteHeader() {
  return (
    <header className="sticky top-0 z-10 border-b border-line bg-bg/85 backdrop-blur">
      <div className="mx-auto flex h-16 max-w-3xl items-center justify-between px-5">
        <Link
          href="/"
          className="font-mono text-sm text-ink transition-colors hover:text-accent"
        >
          <span className="text-accent">~/</span>chingyung
        </Link>
        <nav aria-label="Main" className="flex items-center gap-1 sm:gap-2">
          {nav.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className="rounded-md px-2 py-1.5 text-sm text-muted transition-colors hover:text-accent sm:px-3"
            >
              {item.label}
            </Link>
          ))}
          <ThemeToggle />
        </nav>
      </div>
    </header>
  );
}
