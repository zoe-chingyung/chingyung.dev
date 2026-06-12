// Signature element: a terminal-style status line. Reused across pages as a
// section eyebrow, it ties the visual identity to the engineering subject.
export function StatusLine({ children }: { children: React.ReactNode }) {
  return (
    <p className="font-mono text-xs tracking-wide text-muted">
      <span aria-hidden="true" className="text-accent">
        ${" "}
      </span>
      {children}
      <span aria-hidden="true" className="ml-0.5 inline-block w-2 animate-pulse text-accent">
        ▍
      </span>
    </p>
  );
}
