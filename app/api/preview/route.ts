import { draftMode } from "next/headers";
import { redirect } from "next/navigation";

/**
 * Enter draft preview — GET /api/preview?secret=…&slug=…[&locale=…]
 *
 * The CMS "Preview on site" button links here. We validate the secret, enable
 * Next's draft mode (sets the httpOnly draft cookie), and redirect to the post
 * page — which then fetches the draft (see blog/[slug]/page.tsx + getPostBySlug).
 *
 * Only blog single-post pages support preview upstream, so we only ever
 * redirect to /blog/<slug>.
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

  const locale = url.searchParams.get("locale");
  // Keep the slug path-safe; the CMS sends a plain slug but be defensive.
  const safeSlug = encodeURIComponent(slug).replace(/%2F/gi, "/");
  const target = locale ? `/${locale}/blog/${safeSlug}` : `/blog/${safeSlug}`;

  const draft = await draftMode();
  draft.enable();

  redirect(target);
}
