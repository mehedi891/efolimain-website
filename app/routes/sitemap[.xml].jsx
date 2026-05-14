const BASE_URL = "https://efoli.com";

const pages = [
  { path: "/",                                                                                          priority: "1.00" },
  { path: "/about-us/",                                                                                 priority: "0.80" },
  { path: "/blog/",                                                                                     priority: "0.80" },
  { path: "/career/",                                                                                   priority: "0.80" },
  { path: "/service/",                                                                                  priority: "0.80" },
  { path: "/contact-us/",                                                                               priority: "0.80" },
  { path: "/blog/from-shorelines-to-smiles-efolis-annual-gateway-to-saint-martin/",                    priority: "0.80" },
  { path: "/blog/why-your-ecommerce-store-fails/",                                                     priority: "0.80" },
  { path: "/blog/how-to-protect-your-business-from-ecommerce-fraud/",                                  priority: "0.80" },
  { path: "/blog/category/uncategorized/",                                                             priority: "0.64" },
  { path: "/blog/how-ai-automates-tasks-and-analyzes-customer-behavior/",                              priority: "0.64" },
  { path: "/blog/ecommerce-ux-tips-that-drive-sales/",                                                 priority: "0.64" },
  { path: "/blog/conversion-funnel-optimization-for-mobile-ecommerce/",                               priority: "0.64" },
  { path: "/blog/the-best-color-for-your-add-to-cart-button-at-ecommerce/",                           priority: "0.64" },
  { path: "/blog/evaluating-the-roi-of-loyalty-programs-for-ecommerce/",                              priority: "0.64" },
  { path: "/blog/unlocking-ecommerce-growth-choosing-the-perfect-business-model/",                    priority: "0.64" },
  { path: "/blog/beat-your-email-anxiety-tips-for-confident-communication/",                          priority: "0.64" },
  { path: "/blog/page/2/",                                                                             priority: "0.64" },
  { path: "/blog/category/uncategorized/page/2/",                                                     priority: "0.51" },
  { path: "/blog/ai-in-ecommerce-things-you-must-know-about/",                                        priority: "0.51" },
  { path: "/blog/common-reasons-why-ecommerce-business-fails/",                                       priority: "0.51" },
  { path: "/blog/winning-strategies-using-social-proof-to-grow-your-ecommerce-store/",                priority: "0.51" },
  { path: "/blog/understanding-the-importance-of-offering-complementary-products/",                   priority: "0.51" },
  { path: "/blog/turn-prospects-into-buyers-master-the-art-of-product-page-design/",                  priority: "0.51" },
  { path: "/blog/efolis-annual-tour-to-saintmartin/",                                                 priority: "0.51" },
  { path: "/blog/an-eventful-day-at-efoli-a-memorable-birthday-celebration/",                         priority: "0.51" },
  { path: "/blog/inkybay-product-personalizer-wins-the-basis-national-ict-award-2022/",               priority: "0.51" },
];

export const loader = () => {
  const lastmod = new Date().toISOString().replace(/\.\d{3}Z$/, "+00:00");

  const urls = pages
    .map(
      ({ path, priority }) => `
<url>
  <loc>${BASE_URL}${path}</loc>
  <lastmod>${lastmod}</lastmod>
  <priority>${priority}</priority>
</url>`
    )
    .join("");

  const xml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset
      xmlns="http://www.sitemaps.org/schemas/sitemap/0.9"
      xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance"
      xsi:schemaLocation="http://www.sitemaps.org/schemas/sitemap/0.9
            http://www.sitemaps.org/schemas/sitemap/0.9/sitemap.xsd">
${urls}
</urlset>`;

  return new Response(xml, {
    headers: {
      "Content-Type": "application/xml; charset=utf-8",
      "Cache-Control": "public, max-age=86400",
    },
  });
};
