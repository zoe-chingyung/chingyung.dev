import type { Metadata } from "next";
import "./globals.css";
import { ThemeScript } from "@/components/theme-script";
import { SiteHeader } from "@/components/site-header";
import { SiteFooter } from "@/components/site-footer";

export const metadata: Metadata = {
  metadataBase: new URL("https://chingyung.dev"),
  title: {
    default: "Ching Yung — Cloud · Platform · Security Engineer",
    template: "%s — Ching Yung",
  },
  description:
    "Building secure, scalable and automated cloud platforms through Infrastructure as Code, Platform Engineering and Security Engineering.",
  openGraph: {
    type: "website",
    url: "https://chingyung.dev",
    siteName: "chingyung.dev",
  },
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <ThemeScript />
      </head>
      <body className="flex min-h-dvh flex-col font-sans">
        <a
          href="#main"
          className="sr-only focus:not-sr-only focus:absolute focus:left-4 focus:top-4 focus:z-50 focus:rounded-md focus:bg-accent focus:px-3 focus:py-2 focus:text-bg"
        >
          Skip to content
        </a>
        <SiteHeader />
        <main id="main" data-pagefind-body className="mx-auto w-full max-w-3xl flex-1 px-5">
          {children}
        </main>
        <SiteFooter />
      </body>
    </html>
  );
}
