import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Static export: the entire site builds to ./out and is served from S3/CloudFront.
  // See docs/ARCHITECTURE.md ADR-001.
  output: "export",
  // Emit /resume/index.html style paths so S3 + the CloudFront URL-rewrite
  // function can serve clean URLs.
  trailingSlash: true,
  images: { unoptimized: true },
};

export default nextConfig;
