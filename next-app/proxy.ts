import { NextResponse, type NextRequest } from "next/server";

/**
 * Edge request rewriting (Next 16's renamed middleware — `proxy()` +
 * `proxyConfig`). Two jobs, ported from the React Router app:
 *
 *   1. Canonicalize every URL to NO trailing slash (/blog, not /blog/) with a
 *      single 301 — was app/root.jsx's loader.
 *   2. 301 legacy WordPress blog archives to their equivalent, in one hop —
 *      was app/routes/blogLegacyRedirect.jsx (+ the routes.js matchers).
 *
 * The matcher below excludes `_next/*` and any path containing a dot (static
 * files like /sitemap.xml, /robots.txt, assets), so those are never rewritten —
 * matching the old loader, which left dotted last segments alone.
 */

/**
 * Legacy WP blog archives: /blog/page/…, /blog/category/…, /blog/tag/…,
 * /blog/author/…, /blog/feed, plus anything two segments deep under /blog
 * (date archives like /blog/2024/08/ and per-post feeds like /blog/<slug>/feed/).
 * A normal post URL (/blog/<slug>) is only one segment deep, so it isn't matched.
 */
const LEGACY_BLOG_PATH =
  /^\/blog\/(?:page|category|tag|author|feed)(?:\/|$)|^\/blog\/[^/]+\/[^/]+/;

/**
 * Map a legacy blog path to its redirect target, mirroring the old
 * blogLegacyRedirect loader:
 *   /blog/page/:n                        → /blog
 *   /blog/category/:slug[/page/:n]       → /blog?category=:slug
 *   /blog/tag/:slug[/page/:n]            → /blog?tag=:slug
 *   /blog/author/*  /blog/feed           → /blog
 *   /blog/:year/:month  (date archive)   → /blog
 *   /blog/:slug/feed    (per-post feed)  → /blog/:slug
 */
function legacyBlogTarget(pathname: string): string | null {
  const segs = pathname.replace(/\/+$/, "").split("/").filter(Boolean);
  if (segs[0] !== "blog") return null;

  if (segs[1] === "page") return "/blog";
  if (segs[1] === "category" && segs[2])
    return `/blog?category=${encodeURIComponent(segs[2])}`;
  if (segs[1] === "tag" && segs[2])
    return `/blog?tag=${encodeURIComponent(segs[2])}`;
  if (segs[1] === "author" || segs[1] === "feed") return "/blog";

  // Two segments deep: per-post feed → the post; anything else → the index.
  if (segs.length >= 3) {
    if (segs[2] === "feed") return `/blog/${encodeURIComponent(segs[1])}`;
    return "/blog";
  }
  return null;
}

export function proxy(request: NextRequest) {
  const { pathname, search } = request.nextUrl;

  // 1. Legacy WordPress blog archives → single 301 to their equivalent.
  if (LEGACY_BLOG_PATH.test(pathname)) {
    const target = legacyBlogTarget(pathname);
    if (target) {
      return NextResponse.redirect(new URL(target, request.url), 301);
    }
  }

  // 2. Canonicalize to NO trailing slash (root keeps its slash; dotted paths
  //    are excluded by the matcher).
  if (pathname !== "/" && pathname.endsWith("/")) {
    const stripped = pathname.replace(/\/+$/, "");
    return NextResponse.redirect(
      new URL(`${stripped}${search}`, request.url),
      301
    );
  }

  return NextResponse.next();
}

export const proxyConfig = {
  // Everything except Next internals and files (any path with a dot).
  matcher: ["/((?!_next/|.*\\..*).*)"],
};
