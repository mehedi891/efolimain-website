import { index, layout, route } from "@react-router/dev/routes";

export default [
  route("sitemap.xml", "routes/sitemap[.xml].jsx"),
  layout("layouts/layout.jsx", [
    index("routes/home.jsx"),
    route("about-us", "routes/about.jsx"),
    route("career", "routes/career.jsx"),
    route("contact-us", "routes/contact.jsx"),
    route("service", "routes/service.jsx"),
    route("offer", "routes/offer.jsx"),
    route("blog", "routes/blog.jsx"),
    // Legacy WordPress URLs → 301. Static segments ("page"/"category"/"tag"/
    // "author"/"feed") outrank the dynamic :slug route when matching.
    route("blog/page/:page", "routes/blogLegacyRedirect.jsx", {
      id: "blog-legacy-page",
    }),
    route("blog/category/:categorySlug", "routes/blogLegacyRedirect.jsx", {
      id: "blog-legacy-category",
    }),
    route(
      "blog/category/:categorySlug/page/:page",
      "routes/blogLegacyRedirect.jsx",
      { id: "blog-legacy-category-page" }
    ),
    route("blog/tag/:tagSlug", "routes/blogLegacyRedirect.jsx", {
      id: "blog-legacy-tag",
    }),
    route("blog/tag/:tagSlug/page/:page", "routes/blogLegacyRedirect.jsx", {
      id: "blog-legacy-tag-page",
    }),
    route("blog/author/:author", "routes/blogLegacyRedirect.jsx", {
      id: "blog-legacy-author",
    }),
    route("blog/author/:author/page/:page", "routes/blogLegacyRedirect.jsx", {
      id: "blog-legacy-author-page",
    }),
    route("blog/feed", "routes/blogLegacyRedirect.jsx", {
      id: "blog-legacy-feed",
    }),
    // Date archives (/blog/2024/08/) and per-post feeds (/blog/<slug>/feed/).
    route("blog/:year/:month", "routes/blogLegacyRedirect.jsx", {
      id: "blog-legacy-date",
    }),
    route("blog/:slug", "routes/blogPost.jsx"),
    route("*", "routes/404.jsx"),
    // route("contact", "routes/contact.jsx"),
  ]),


];



