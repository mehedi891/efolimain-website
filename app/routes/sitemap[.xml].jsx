const BASE_URL = "https://efoli.com";

const pages = [
  { path: "/",            changefreq: "weekly",  priority: "1.0" },
  { path: "/service/",   changefreq: "monthly", priority: "0.9" },
  { path: "/about-us/",  changefreq: "monthly", priority: "0.8" },
  { path: "/offer/",     changefreq: "monthly", priority: "0.8" },
  { path: "/career/",    changefreq: "weekly",  priority: "0.7" },
  { path: "/contact-us/",changefreq: "monthly", priority: "0.7" },
];

export const loader = () => {
  const urls = pages
    .map(
      ({ path, changefreq, priority }) => `
  <url>
    <loc>${BASE_URL}${path}</loc>
    <changefreq>${changefreq}</changefreq>
    <priority>${priority}</priority>
  </url>`
    )
    .join("");

  const xml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">${urls}
</urlset>`;

  return new Response(xml, {
    headers: {
      "Content-Type": "application/xml; charset=utf-8",
      "Cache-Control": "public, max-age=86400",
    },
  });
};
