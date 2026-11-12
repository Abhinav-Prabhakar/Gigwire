import type { NextConfig } from "next";

/**
 * The public demo is a fully static export so it can live on GitHub Pages.
 * Set GITHUB_PAGES=1 when building for the project page (adds the /Gigwire
 * base path). Local `next dev` / `next build` stays at the site root.
 */
const basePath = process.env.GITHUB_PAGES === "1" ? "/Gigwire" : "";

const nextConfig: NextConfig = {
  output: "export",
  trailingSlash: true,
  basePath: basePath || undefined,
  images: { unoptimized: true },
  env: {
    NEXT_PUBLIC_BASE_PATH: basePath,
    NEXT_PUBLIC_BUILD_DAY:
      process.env.NEXT_PUBLIC_BUILD_DAY ?? new Date().toISOString().slice(0, 10),
    NEXT_PUBLIC_SITE_URL:
      process.env.NEXT_PUBLIC_SITE_URL ??
      (basePath ? `https://abhinav-prabhakar.github.io${basePath}` : "http://localhost:3000"),
  },
};

export default nextConfig;
