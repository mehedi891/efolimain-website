import { getAllPosts } from "../data/blogPosts";

const BASE_URL = "https://efoli.com";

/**
 * Static pages. Blog posts are appended from the CMS at request time.
 *
 * URLs have no trailing slash to match the site's canonical form — a sitemap
 * should only ever list final URLs, never ones that redirect.
 */
const staticPages = [
  { path: "/", priority: "1.00", changefreq: "weekly" },
  { path: "/blog", priority: "0.90", changefreq: "daily" },
  { path: "/about-us", priority: "0.80", changefreq: "monthly" },
  { path: "/service", priority: "0.80", changefreq: "monthly" },
  { path: "/career", priority: "0.80", changefreq: "weekly" },
  { path: "/contact-us", priority: "0.80", changefreq: "monthly" },
];

/** XML-escape a URL (ampersands in query strings must be encoded). */
const escapeXml = (value) =>
  String(value)
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&apos;");

/** W3C datetime, which is what the sitemap spec expects for <lastmod>. */
const toLastmod = (value) => {
  const d = new Date(value);
  if (isNaN(d)) return null;
  return d.toISOString().replace(/\.\d{3}Z$/, "+00:00");
};

const buildUrlEntry = ({ loc, lastmod, changefreq, priority }) =>
  [
    "<url>",
    `  <loc>${escapeXml(loc)}</loc>`,
    lastmod ? `  <lastmod>${lastmod}</lastmod>` : null,
    changefreq ? `  <changefreq>${changefreq}</changefreq>` : null,
    priority ? `  <priority>${priority}</priority>` : null,
    "</url>",
  ]
    .filter(Boolean)
    .join("\n");

export const loader = async () => {
  const posts = await getAllPosts();

  // Newest posts first, and never list anything the CMS marked noIndex.
  const indexablePosts = posts
    .filter((post) => post.slug && !post.noIndex)
    .sort((a, b) => new Date(b.publishedAt) - new Date(a.publishedAt));

  // Freshest post date doubles as the blog index's lastmod.
  const newestPostDate = indexablePosts[0]?.publishedAt || null;

  const staticEntries = staticPages.map((page) =>
    buildUrlEntry({
      loc: `${BASE_URL}${page.path}`,
      lastmod: page.path === "/blog" ? toLastmod(newestPostDate) : null,
      changefreq: page.changefreq,
      priority: page.priority,
    })
  );

  const postEntries = indexablePosts.map((post) =>
    buildUrlEntry({
      loc: `${BASE_URL}/blog/${post.slug}`,
      lastmod: toLastmod(post.updatedAt || post.publishedAt),
      changefreq: "monthly",
      priority: "0.70",
    })
  );

  const xml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${[...staticEntries, ...postEntries].join("\n")}
</urlset>`;

  return new Response(xml, {
    headers: {
      "Content-Type": "application/xml; charset=utf-8",
      "Cache-Control": "public, max-age=3600",
    },
  });
};
