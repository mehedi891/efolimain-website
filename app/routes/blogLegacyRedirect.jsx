import { redirect } from "react-router";

/**
 * 301 redirects for legacy WordPress blog URLs.
 *
 * All of these still return 200 on the old WP site, so they're indexed and
 * carry ranking/backlinks. Without a redirect they'd fall through to the
 * catch-all and 404, throwing that equity away.
 *
 *   /blog/page/2/                        → /blog/
 *   /blog/category/<slug>/               → /blog/?category=<slug>
 *   /blog/category/<slug>/page/2/        → /blog/?category=<slug>
 *   /blog/tag/<slug>/                    → /blog/?tag=<slug>
 *   /blog/tag/<slug>/page/2/             → /blog/?tag=<slug>
 *   /blog/author/<name>/                 → /blog/
 *   /blog/feed/                          → /blog/
 *   /blog/2024/08/  (date archive)       → /blog/
 *   /blog/<slug>/feed/  (per-post feed)  → /blog/<slug>/
 *
 * Category and tag archives map onto real filtered views because the CMS
 * supports both filters. Author, date and feed archives have no equivalent,
 * so they go to the blog index.
 *
 * Individual post URLs (/blog/<slug>/) keep the same shape as WordPress and
 * need no redirect — routes/blogPost.jsx handles them directly.
 */
export const loader = ({ params }) => {
  const { categorySlug, tagSlug, year, month } = params;

  // Per-post feeds (/blog/<slug>/feed/) arrive here via the :year/:month
  // pattern — send those to the post itself rather than the index.
  if (year && month === "feed") {
    return redirect(`/blog/${encodeURIComponent(year)}`, 301);
  }

  if (categorySlug) {
    return redirect(
      `/blog?category=${encodeURIComponent(categorySlug)}`,
      301
    );
  }

  if (tagSlug) {
    return redirect(`/blog?tag=${encodeURIComponent(tagSlug)}`, 301);
  }

  return redirect("/blog", 301);
};

// Never renders — the loader always redirects first.
export default function BlogLegacyRedirect() {
  return null;
}
