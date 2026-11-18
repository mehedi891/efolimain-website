import { draftMode } from "next/headers";
import { redirect } from "next/navigation";

/**
 * Enter draft preview — GET /api/preview?secret=…&slug=…[&locale=…][&type=landing]
 *
 * The CMS "Preview on site" button links here. We validate the secret, enable
 * Next's draft mode (sets the httpOnly draft cookie), and redirect to the page,
 * which then fetches the draft:
 *   - type=landing → /<slug>        (app/(landing)/[slug]/page.tsx, English only)
 *   - otherwise    → /blog/<slug>   (blog/[slug]/page.tsx + getPostBySlug)
 */
export async function GET(request: Request) {
  const secret = process.env.PREVIEW_SECRET;
  if (!secret) {
    return new Response("Preview is not configured", { status: 503 });
  }

  const url = new URL(request.url);
  if (url.searchParams.get("secret") !== secret) {
    return new Response("Invalid token", { status: 401 });
  }

  const slug = url.searchParams.get("slug");
  if (!slug) {
    return new Response("slug required", { status: 400 });
  }

  const draft = await draftMode();
  draft.enable();

  // Landing pages live at the site root and are one segment: encode fully.
  if (url.searchParams.get("type") === "landing") {
    redirect(`/${encodeURIComponent(slug)}`);
  }

  const locale = url.searchParams.get("locale");
  // Keep the slug path-safe; the CMS sends a plain slug but be defensive.
  const safeSlug = encodeURIComponent(slug).replace(/%2F/gi, "/");
  redirect(locale ? `/${locale}/blog/${safeSlug}` : `/blog/${safeSlug}`);
}
