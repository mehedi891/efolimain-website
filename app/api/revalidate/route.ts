import { revalidatePath } from "next/cache";
import { clearBlogCache } from "@/data/blogPosts";

/**
 * On-demand revalidation — POST /api/revalidate
 *
 * The eFoli CMS calls this whenever content changes so edits appear without a
 * redeploy. Contract from docs/cms.md:
 *   - Header `x-revalidate-token` must equal REVALIDATE_SECRET.
 *   - JSON body `{ path }` — the storefront path that changed.
 *   - Fails CLOSED: with REVALIDATE_SECRET unset it returns 503 and refuses to
 *     run rather than authenticating a tokenless request.
 *
 * On Next we do two things for a blog change: drop the in-memory post-list
 * cache (used by search, category pills, the homepage rail and the sitemap)
 * via clearBlogCache(), and call revalidatePath() so any cached routes refresh.
 * Non-blog sections aren't consumed from the CMS on this site, so they're
 * acknowledged but no-op.
 */

function tagForPath(path: string): "cms:blog" | null {
  if (path === "/" || path === "/blog" || path.startsWith("/blog/")) {
    return "cms:blog";
  }
  // Locale-prefixed blog paths, e.g. /ja/blog/...
  if (/^\/[a-z]{2}(\/blog(\/|$)|$)/.test(path)) return "cms:blog";
  return null;
}

export async function POST(request: Request) {
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

  let path: unknown;
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
    // Refresh the routes that render CMS content.
    revalidatePath("/");
    revalidatePath("/blog");
    revalidatePath("/blog/[slug]", "page");
    revalidatePath("/sitemap.xml");
  }

  return Response.json({ revalidated: Boolean(tag), path, tag });
}

// A loader so a stray GET returns 405 instead of a router match error.
export function GET() {
  return Response.json({ error: "Method not allowed" }, { status: 405 });
}
