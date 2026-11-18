import type { MetadataRoute } from "next";
import { getAllPosts } from "@/data/blogPosts";
import { isLandingSlug, listLandingPages } from "@/data/landingPages";

/**
 * CMS-driven sitemap. Static pages, indexable CMS landing pages and every
 * indexable blog post, with real per-item lastmod. Ported from routes/sitemap[.xml].jsx — Next serves it at
 * /sitemap.xml automatically from this file.
 *
 * URLs have no trailing slash, matching the site's canonical form (proxy.ts).
 * Revalidated hourly to match the old Cache-Control: max-age=3600.
 */
export const revalidate = 3600;

const BASE_URL = "https://efoli.com";

const staticPages = [
  { path: "/", priority: 1.0, changeFrequency: "weekly" },
  { path: "/blog", priority: 0.9, changeFrequency: "daily" },
  { path: "/about-us", priority: 0.8, changeFrequency: "monthly" },
  { path: "/service", priority: 0.8, changeFrequency: "monthly" },
  { path: "/career", priority: 0.8, changeFrequency: "weekly" },
  { path: "/affiliate", priority: 0.8, changeFrequency: "monthly" },
  { path: "/contact-us", priority: 0.8, changeFrequency: "monthly" },
  { path: "/bfcm-offers", priority: 0.8, changeFrequency: "weekly" },
  { path: "/free-tools", priority: 0.7, changeFrequency: "monthly" },
  { path: "/free-tools/shopify-store-audit", priority: 0.8, changeFrequency: "monthly" },
  { path: "/free-tools/meta-social-preview", priority: 0.7, changeFrequency: "monthly" },
  { path: "/free-tools/structured-data-checker", priority: 0.7, changeFrequency: "monthly" },
  { path: "/free-tools/ai-visibility-checker", priority: 0.7, changeFrequency: "monthly" },
] as const;

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const [posts, landingPages] = await Promise.all([
    getAllPosts(),
    listLandingPages(),
  ]);

  // Newest posts first, and never list anything the CMS marked noIndex.
  const indexablePosts = posts
    .filter((post) => post.slug && !post.noIndex)
    .sort(
      (a, b) =>
        new Date(b.publishedAt ?? 0).getTime() -
        new Date(a.publishedAt ?? 0).getTime()
    );

  // Freshest post date doubles as the blog index's lastmod.
  const newestPostDate = indexablePosts[0]?.publishedAt || null;

  const staticEntries: MetadataRoute.Sitemap = staticPages.map((page) => ({
    url: `${BASE_URL}${page.path}`,
    lastModified:
      page.path === "/blog" && newestPostDate
        ? new Date(newestPostDate)
        : undefined,
    changeFrequency: page.changeFrequency,
    priority: page.priority,
  }));

  const postEntries: MetadataRoute.Sitemap = indexablePosts.map((post) => ({
    url: `${BASE_URL}/blog/${post.slug}`,
    lastModified: new Date(post.updatedAt || post.publishedAt || Date.now()),
    changeFrequency: "monthly",
    priority: 0.7,
  }));

  // Published CMS landing pages at the root, minus noIndex ones and any slug
  // already listed above (a static route always wins over a landing page).
  const staticPaths = new Set<string>(staticPages.map((page) => page.path));
  const landingEntries: MetadataRoute.Sitemap = landingPages
    .filter(
      (page) =>
        !page.noIndex &&
        isLandingSlug(page.slug) &&
        !staticPaths.has(`/${page.slug}`)
    )
    .map((page) => ({
      url: `${BASE_URL}/${page.slug}`,
      lastModified: new Date(page.updatedAt || page.publishedAt || Date.now()),
      changeFrequency: "weekly",
      priority: 0.7,
    }));

  return [...staticEntries, ...landingEntries, ...postEntries];
}
