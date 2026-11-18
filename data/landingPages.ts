/**
 * Landing pages data layer — eFoli CMS.
 *
 * Editors build landing pages in the CMS; a published page is served at the
 * root of this site, https://efoli.com/<slug> (app/(landing)/[slug]/page.tsx).
 *
 * Endpoints used:
 *   GET /api/public/landing-pages/:slug?site=   one page (drafts too, with the
 *                                               x-preview-token header)
 *   GET /api/public/landing-pages?site=         published pages, no content
 *
 * Caching: published pages are cached indefinitely under the `cms` tag. The
 * CMS POSTs to /api/revalidate on every publish / edit / unpublish / delete,
 * which expires that tag and the page's path (app/api/revalidate/route.ts).
 * Draft-mode requests skip the cache entirely.
 */

import { cache } from "react";
import { buildUrl, CmsError, fetchJson, type FetchOptions } from "./cms";
import type {
  LandingPage,
  LandingPageSummary,
  RawLandingPage,
  RawLandingPageList,
} from "./cms-types";

/** Cache tag on every landing-page fetch; expired by /api/revalidate. */
export const CMS_TAG = "cms";

/**
 * The root [slug] route sees every unknown one-segment URL, including bot
 * probes like /wp-login.php or /.env. CMS slugs are plain letters, digits,
 * hyphens and underscores, so anything else is a 404 without asking the CMS.
 */
const SLUG_PATTERN = /^[a-z0-9][a-z0-9_-]{0,199}$/i;

export function isLandingSlug(slug: string): boolean {
  return SLUG_PATTERN.test(slug);
}

function normalizeLandingPage(raw: RawLandingPage | null | undefined): LandingPage | null {
  if (!raw || typeof raw !== "object" || !raw.slug) return null;
  return {
    id: String(raw.id ?? ""),
    title: raw.title || "",
    slug: raw.slug,
    // Rendered exactly as received — never sanitized (see LandingHtml).
    content: raw.content || "",
    // Missing switches default to the site's normal chrome.
    showHeader: raw.showHeader !== false,
    showFooter: raw.showFooter !== false,
    metaTitle: raw.metaTitle || null,
    metaDescription: raw.metaDescription || null,
    ogImage: raw.ogImage || null,
    canonicalUrl: raw.canonicalUrl || null,
    noIndex: Boolean(raw.noIndex),
    publishedAt: raw.publishedAt || null,
    updatedAt: raw.updatedAt || null,
    status: raw.status || null,
    isPreview: Boolean(raw.isPreview),
  };
}

/**
 * Memoized per request (React `cache`) so generateMetadata and the page share
 * one CMS round trip. Primitive args only, so the memo key actually matches.
 */
const fetchLandingPage = cache(
  async (slug: string, preview: boolean): Promise<LandingPage | null> => {
    if (!isLandingSlug(slug)) return null;

    // The preview token goes in a header, never the query string.
    const previewToken = process.env.PREVIEW_SECRET || "";
    const options: FetchOptions =
      preview && previewToken
        ? { headers: { "x-preview-token": previewToken }, cache: "no-store" }
        : { next: { revalidate: false, tags: [CMS_TAG] } };

    try {
      const raw = await fetchJson<RawLandingPage>(
        buildUrl(`/landing-pages/${encodeURIComponent(slug)}`),
        options
      );
      return normalizeLandingPage(raw);
    } catch (error) {
      if (error instanceof CmsError && error.status === 404) return null;
      // Anything else (CMS down, 5xx) must NOT become a 404: rethrow so a
      // cached page is kept instead of being replaced by "not found".
      throw error;
    }
  }
);

/**
 * A landing page by slug, or null when there's no such page (→ 404).
 * With `preview` (draft mode) it also returns drafts, uncached.
 * Throws when the CMS is unreachable or errors.
 */
export function getLandingPage(
  slug: string,
  { preview = false }: { preview?: boolean } = {}
): Promise<LandingPage | null> {
  return fetchLandingPage(slug, preview);
}

/** Published landing pages (no content) — used by the sitemap. Empty if the CMS is down. */
export async function listLandingPages(): Promise<LandingPageSummary[]> {
  try {
    const data = await fetchJson<RawLandingPageList>(buildUrl("/landing-pages"), {
      next: { revalidate: 3600, tags: [CMS_TAG] },
    });
    return (data.pages || []).filter((page) => page?.slug);
  } catch (error) {
    console.error("[landing] listLandingPages failed:", (error as Error).message);
    return [];
  }
}
