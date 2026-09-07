import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // The React Router app one level up has its own lockfile; pin the workspace
  // root to this app so Turbopack doesn't infer the parent directory.
  turbopack: {
    root: import.meta.dirname,
  },

  // Let proxy.ts own trailing-slash handling. Without this, Next's built-in
  // slash-strip (a 308) fires BEFORE the proxy on legacy URLs like
  // /blog/page/2/, costing an extra hop before the 301 to /blog. Skipping it
  // lets the proxy collapse slash + legacy into a single 301.
  skipTrailingSlashRedirect: true,
};

export default nextConfig;
