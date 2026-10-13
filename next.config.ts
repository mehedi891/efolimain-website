import type { NextConfig } from "next";
import { BFCM_IMAGE_HOSTS } from "./lib/bfcm/imageHosts";

const BASE_IMAGE_HOSTS = [
  "cms.efoli.com",
  // CMS media (blog covers, author avatars) is served from R2.
  "media.efoli.io",
  "mediadev.efoli.io",
  // Some CMS media (e.g. author avatars) is served from Vercel Blob.
  "**.public.blob.vercel-storage.com",
  "i.ibb.co",
];

const nextConfig: NextConfig = {
  // Allow next/image to optimize remote images from the CMS (blog covers,
  // author avatars), the 404 illustration host, and the BFCM partner image
  // hosts admins may paste links from (lib/bfcm/imageHosts.ts).
  images: {
    remotePatterns: [...new Set([...BASE_IMAGE_HOSTS, ...BFCM_IMAGE_HOSTS])].map((hostname) => ({
      protocol: "https" as const,
      hostname,
    })),
  },

  // Keep the headless-Chrome PDF deps external (they ship native binaries that
  // must not be bundled) — used by lib/grader/pdf.ts on the store-audit route.
  serverExternalPackages: ["@sparticuz/chromium", "puppeteer-core", "mongodb"],

  // Let proxy.ts own trailing-slash handling. Without this, Next's built-in
  // slash-strip (a 308) fires BEFORE the proxy on legacy URLs like
  // /blog/page/2/, costing an extra hop before the 301 to /blog. Skipping it
  // lets the proxy collapse slash + legacy into a single 301.
  skipTrailingSlashRedirect: true,
};

export default nextConfig;
