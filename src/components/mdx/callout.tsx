const styles = {
  info: "border-accent/40 bg-accent-soft",
  warn: "border-amber-500/40 bg-amber-500/10",
} as const;

export function Callout({
  type = "info",
  children,
}: {
  type?: keyof typeof styles;
  children: React.ReactNode;
}) {
  return (
    <aside
      role="note"
      className={`my-6 rounded-lg border px-4 py-3 text-sm leading-relaxed ${styles[type]}`}
    >
      {children}
    </aside>
  );
}
