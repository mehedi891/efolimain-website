import type { MetadataRoute } from "next";
import { getAllPosts } from "@/data/blogPosts";

/**
 * CMS-driven sitemap. Static pages plus every indexable blog post, with real
 * per-post lastmod. Ported from routes/sitemap[.xml].jsx — Next serves it at
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
] as const;

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const posts = await getAllPosts();

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

  return [...staticEntries, ...postEntries];
}
