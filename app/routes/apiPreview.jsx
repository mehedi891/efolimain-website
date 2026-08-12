import { redirect } from "react-router";
import { previewCookie } from "../utils/preview.server";

/**
 * Enter draft preview — GET /api/preview?secret=…&slug=…[&locale=…]
 *
 * The CMS "Preview on site" button links here. We validate the secret, set an
 * httpOnly preview cookie, and redirect to the real post page — which then
 * fetches the draft (see getPostBySlug + blogPost loader). Equivalent to
 * Next.js draftMode(), adapted to React Router.
 *
 * Only blog single-post pages support preview upstream, so we only ever
 * redirect to /blog/<slug>.
 */
export const loader = async ({ request }) => {
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

  return redirect(target, {
    headers: { "Set-Cookie": await previewCookie.serialize("on") },
  });
};

export default function ApiPreview() {
  return null;
}
