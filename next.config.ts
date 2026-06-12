import type { NextConfig } from "next";

// Runs Velite as part of the Next.js compile so `npm run dev` and
// `npm run build` always have fresh, validated content. In dev it watches
// /content for changes. Pattern from the Velite docs.
class VeliteWebpackPlugin {
  static started = false;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  apply(compiler: any) {
    compiler.hooks.beforeCompile.tapPromise("VeliteWebpackPlugin", async () => {
      if (VeliteWebpackPlugin.started) return;
      VeliteWebpackPlugin.started = true;
      const dev = compiler.options.mode === "development";
      const { build } = await import("velite");
      await build({ watch: dev, clean: !dev });
    });
  }
}

const nextConfig: NextConfig = {
  // Static export: the entire site builds to ./out and is served from S3/CloudFront.
  // See docs/ARCHITECTURE.md ADR-001.
  output: "export",
  // Emit /resume/index.html style paths so S3 + the CloudFront URL-rewrite
  // function can serve clean URLs.
  trailingSlash: true,
  images: { unoptimized: true },
  webpack: (config) => {
    config.plugins.push(new VeliteWebpackPlugin());
    return config;
  },
};

export default nextConfig;
