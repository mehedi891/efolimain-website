import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Allow next/image to optimize remote images from the CMS (blog covers,
  // author avatars) and the 404 illustration host.
  images: {
    remotePatterns: [
      { protocol: "https", hostname: "cms.efoli.com" },
      // CMS media (blog covers, author avatars) is served from R2.
      { protocol: "https", hostname: "media.efoli.io" },
      { protocol: "https", hostname: "mediadev.efoli.io" },
      { protocol: "https", hostname: "i.ibb.co" },
    ],
  },

  // Let proxy.ts own trailing-slash handling. Without this, Next's built-in
  // slash-strip (a 308) fires BEFORE the proxy on legacy URLs like
  // /blog/page/2/, costing an extra hop before the 301 to /blog. Skipping it
  // lets the proxy collapse slash + legacy into a single 301.
  skipTrailingSlashRedirect: true,
};

export default nextConfig;
