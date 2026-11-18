import { revalidatePath, revalidateTag } from "next/cache";
import { clearBlogCache } from "@/data/blogPosts";
import { CMS_TAG } from "@/data/landingPages";

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
 * Every accepted call:
 *   - expires the `cms` fetch tag (landing pages + their sitemap list) and
 *     revalidates the exact path sent, so a root path like /black-friday — a
 *     landing page published, edited, unpublished or deleted — is fresh on its
 *     next visit. When a landing page's URL changes, the CMS also sends the old
 *     path, which then re-renders as a 404.
 *   - refreshes the sitemap.
 * A blog change additionally drops the in-memory post-list cache (used by
 * search, category pills, the homepage rail and the sitemap) and refreshes the
 * blog routes.
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
  if (!path.startsWith("/") || path.length > 1024) {
    return Response.json(
      { error: "path must be a site path starting with /" },
      { status: 400 }
    );
  }

  // Landing pages (and anything else fetched with the `cms` tag). This is a
  // webhook, so expire right away rather than serving stale-while-revalidate:
  // the editor should see the change on their next reload.
  revalidateTag(CMS_TAG, { expire: 0 });
  revalidatePath(path);
  revalidatePath("/sitemap.xml");

  const tag = tagForPath(path);
  if (tag === "cms:blog") {
    clearBlogCache();
    // Refresh the routes that render blog content.
    revalidatePath("/");
    revalidatePath("/blog");
    revalidatePath("/blog/[slug]", "page");
  }

  return Response.json({ revalidated: true, path, tags: tag ? [CMS_TAG, tag] : [CMS_TAG] });
}

// A loader so a stray GET returns 405 instead of a router match error.
export function GET() {
  return Response.json({ error: "Method not allowed" }, { status: 405 });
}
