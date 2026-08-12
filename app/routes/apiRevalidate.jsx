import { clearBlogCache } from "../data/blogPosts";

/**
 * On-demand revalidation — POST /api/revalidate
 *
 * The eFoli CMS calls this whenever content changes so edits appear without a
 * redeploy. Contract from docs/cms.md:
 *   - Header `x-revalidate-token` must equal REVALIDATE_SECRET.
 *   - JSON body `{ path }` — the storefront path that changed.
 *   - Fails CLOSED: with REVALIDATE_SECRET unset it returns 503 and refuses to
 *     run, rather than authenticating a tokenless request (the Next.js sample
 *     in the doc has exactly that bug).
 *
 * This site is React Router (not Next.js), so there is no `revalidatePath()`.
 * The only CMS data we cache is the blog post list (a 5-minute in-memory cache
 * used by search, category pills, the homepage rail and the sitemap); blog
 * listing and post loaders otherwise fetch live per request. So "revalidate"
 * here means: drop that cache for any blog-related path. Non-blog sections
 * (opinions/docs/partners/changelog/faq/clients) aren't consumed from the CMS
 * on this site, so they're acknowledged but no-op.
 */

// Map a CMS section path to the cache tag it affects on this site.
function tagForPath(path) {
  if (path === "/" || path === "/blog" || path.startsWith("/blog/")) {
    return "cms:blog";
  }
  // Locale-prefixed blog paths, e.g. /ja/blog/...
  if (/^\/[a-z]{2}(\/blog(\/|$)|$)/.test(path)) return "cms:blog";
  return null; // a section this storefront does not render from the CMS
}

export const action = async ({ request }) => {
  if (request.method !== "POST") {
    return Response.json({ error: "Method not allowed" }, { status: 405 });
  }

  const secret = process.env.REVALIDATE_SECRET;
  if (!secret) {
    // Fail closed — never authenticate when no secret is configured.
    return Response.json(
      { error: "Revalidation is not configured" },
      { status: 503 }
    );
  }

  if (request.headers.get("x-revalidate-token") !== secret) {
    return Response.json({ error: "Unauthorized" }, { status: 401 });
  }

  let path;
  try {
    ({ path } = await request.json());
  } catch {
    return Response.json({ error: "Invalid JSON body" }, { status: 400 });
  }
  if (!path || typeof path !== "string") {
    return Response.json({ error: "path required" }, { status: 400 });
  }

  const tag = tagForPath(path);
  if (tag === "cms:blog") {
    clearBlogCache();
  }

  return Response.json({ revalidated: Boolean(tag), path, tag });
};

// A loader so a stray GET returns 405 instead of a router match error.
export const loader = () =>
  Response.json({ error: "Method not allowed" }, { status: 405 });
