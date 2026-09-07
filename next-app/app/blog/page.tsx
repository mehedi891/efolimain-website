import type { Metadata } from "next";
import SiteChrome from "@/components/SiteChrome";
import Bloglist from "@/components/blog/Bloglist";
import { getCategories, listPosts } from "@/data/blogPosts";

const PER_PAGE = 9;
const SITE_URL = "https://efoli.com/blog";

/**
 * Every filter state gets its own title, description and canonical URL —
 * otherwise category/tag/search/paginated views all look like the same page
 * duplicated, and Google collapses or penalises them.
 */
export async function generateMetadata({
  searchParams,
}: PageProps<"/blog">): Promise<Metadata> {
  const sp = await searchParams;
  const page = Math.max(1, Number(sp.page) || 1);
  const category = (typeof sp.category === "string" && sp.category) || "";
  const tag = (typeof sp.tag === "string" && sp.tag) || "";
  const q = (typeof sp.q === "string" && sp.q) || "";

  const [result, categories] = await Promise.all([
    listPosts({ page, limit: PER_PAGE, category, tag, search: q }),
    getCategories(),
  ]);
  const total = result.total;

  // Prefer the human-readable category name over the slug.
  const categoryName =
    categories.find((c) => c.slug === category)?.name || category;

  let heading: string;
  let description: string;
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

  return {
    title,
    description,
    alternates: { canonical },
    ...(noindex ? { robots: { index: false, follow: true } } : {}),
    openGraph: {
      title,
      description,
      type: "website",
      url: canonical,
    },
  };
}

export default async function BlogRoute({ searchParams }: PageProps<"/blog">) {
  const sp = await searchParams;
  const page = Math.max(1, Number(sp.page) || 1);
  const category = (typeof sp.category === "string" && sp.category) || "";
  const tag = (typeof sp.tag === "string" && sp.tag) || "";
  const q = (typeof sp.q === "string" && sp.q) || "";

  const [result, categories] = await Promise.all([
    listPosts({ page, limit: PER_PAGE, category, tag, search: q }),
    getCategories(),
  ]);

  return (
    <SiteChrome>
      <Bloglist
        posts={result.posts}
        total={result.total}
        page={result.page}
        totalPages={result.totalPages}
        categories={categories}
        category={category}
        tag={tag}
        q={q}
      />
    </SiteChrome>
  );
}
