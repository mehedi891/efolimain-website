/**
 * Image hosts allowed for BFCM partner banners/logos (admins paste direct
 * image links — no uploads). Shared by the admin form validation and
 * next.config.ts `images.remotePatterns`, so next/image can optimize every
 * allowed link while our optimizer can't be used as an open proxy.
 *
 * Client-safe: no server imports. Add a host here to allow it everywhere.
 */

export const BFCM_IMAGE_HOSTS = [
  "cdn.shopify.com",
  "efoli.com",
  "www.efoli.com",
  "media.efoli.io",
  "i.ibb.co",
  // Google Drive thumbnails redirect to lh3.googleusercontent.com.
  "drive.google.com",
  "lh3.googleusercontent.com",
] as const;

/** Self-hosted files under /public (e.g. /img/bfcm-2026/partners/x.webp). */
const LOCAL_PATH = /^\/[A-Za-z0-9/_\-.]+\.(?:png|jpe?g|webp|avif|gif|svg)$/i;

/**
 * Turn a Google Drive *share* link (…/file/d/<id>/view) into a direct
 * thumbnail link, since share links are HTML pages, not images.
 */
export function normalizeImageUrl(raw: string): string {
  const url = raw.trim();
  const drive = url.match(/^https:\/\/drive\.google\.com\/file\/d\/([A-Za-z0-9_-]+)/);
  if (drive) return `https://drive.google.com/thumbnail?id=${drive[1]}&sz=w1600`;
  return url;
}

/** Why an image link is rejected, or null when it's fine. */
export function imageUrlProblem(raw: string): string | null {
  const url = raw.trim();
  if (!url) return null;
  if (url.startsWith("/")) return LOCAL_PATH.test(url) ? null : "Local paths must point to an image file, e.g. /img/x.webp";
  let u: URL;
  try {
    u = new URL(url);
  } catch {
    return "Not a valid link";
  }
  if (u.protocol !== "https:") return "Use an https:// link";
  if (!(BFCM_IMAGE_HOSTS as readonly string[]).includes(u.hostname)) {
    return `Host "${u.hostname}" isn't allowed. Use Shopify CDN, efoli.com, media.efoli.io, i.ibb.co or Google Drive.`;
  }
  return null;
}
