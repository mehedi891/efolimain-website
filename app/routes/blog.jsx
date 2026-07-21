import { useLoaderData } from "react-router";
import Bloglist from "../component/blogpage/Bloglist";
import { getCategories, listPosts } from "../data/blogPosts";

const PER_PAGE = 9;

export const loader = async ({ request }) => {
  const url = new URL(request.url);
  const page = Math.max(1, Number(url.searchParams.get("page")) || 1);
  const category = url.searchParams.get("category") || "";
  const tag = url.searchParams.get("tag") || "";
  const q = url.searchParams.get("q") || "";

  const [result, categories] = await Promise.all([
    listPosts({ page, limit: PER_PAGE, category, tag, search: q }),
    getCategories(),
  ]);

  return {
    posts: result.posts,
    total: result.total,
    page: result.page,
    totalPages: result.totalPages,
    categories,
    category,
    tag,
    q,
  };
};

const SITE_URL = "https://efoli.com/blog";

/**
 * Every filter state gets its own title, description and canonical URL —
 * otherwise category/tag/search/paginated views all look like the same page
 * duplicated, and Google collapses or penalises them.
 */
export function meta({ data }) {
  const page = data?.page || 1;
  const category = data?.category || "";
  const tag = data?.tag || "";
  const q = data?.q || "";
  const total = data?.total ?? 0;

  // Prefer the human-readable category name over the slug.
  const categoryName =
    data?.categories?.find((c) => c.slug === category)?.name || category;

  let heading;
  let description;
  const params = new URLSearchParams();

  if (q) {
    heading = `Search results for “${q}”`;
    description = `${total} ${
      total === 1 ? "article" : "articles"
    } matching “${q}” on the eFoli blog.`;
    params.set("q", q);
  } else if (category) {
    heading = `${categoryName} Articles`;
    description = `Read the latest ${categoryName.toLowerCase()} articles from the eFoli team — practical guides on B2B commerce, Shopify apps and conversion.`;
    params.set("category", category);
  } else if (tag) {
    heading = `Posts tagged “${tag}”`;
    description = `Every eFoli blog post tagged “${tag}” — guides on B2B commerce, Shopify apps and store growth.`;
    params.set("tag", tag);
  } else {
    heading = "Blog";
    description =
      "Practical guides on B2B commerce, Shopify apps, conversion optimization, and the engineering behind stores that scale — from the eFoli team.";
  }

  const pageSuffix = page > 1 ? ` — Page ${page}` : "";
  const title =
    heading === "Blog"
      ? `Blog${pageSuffix} | eFoli — Insights That Help You Sell Smarter`
      : `${heading}${pageSuffix} | eFoli Blog`;

  if (page > 1) params.set("page", String(page));
  const queryString = params.toString();
  const canonical = queryString ? `${SITE_URL}?${queryString}` : SITE_URL;

  // Internal search results and deep pagination shouldn't compete in the index.
  const noindex = Boolean(q) || page > 1;

  return [
    { title },
    { name: "description", content: description },
    { tagName: "link", rel: "canonical", href: canonical },
    ...(noindex ? [{ name: "robots", content: "noindex, follow" }] : []),

    { property: "og:title", content: title },
    { property: "og:description", content: description },
    { property: "og:type", content: "website" },
    { property: "og:url", content: canonical },
  ];
}

export default function Blog() {
  const data = useLoaderData();
  return <Bloglist {...data} />;
}
