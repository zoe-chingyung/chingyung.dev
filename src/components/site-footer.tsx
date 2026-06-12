export function SiteFooter() {
  return (
    <footer className="border-t border-line">
      <div className="mx-auto flex max-w-3xl flex-col gap-2 px-5 py-8 font-mono text-xs text-muted sm:flex-row sm:items-center sm:justify-between">
        <p>© {new Date().getFullYear()} Ching Yung</p>
        <p>
          Built with Next.js · Deployed on AWS via Terraform ·{" "}
          <a
            href="https://github.com/chingyung"
            className="text-accent hover:underline"
          >
            Source
          </a>
        </p>
      </div>
    </footer>
  );
}
