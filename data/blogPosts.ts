/**
 * Blog data layer — eFoli CMS (https://cms.efoli.com/api/public).
 *
 * The only module that fetches blog content. Everything else consumes the
 * normalized `Post` shape produced by `normalizePost()` below. The shared CMS
 * client (base URL, site slug, fetch) lives in data/cms.ts.
 *
 * Endpoints used:
 *   GET /api/public/posts?site=&page=&limit=&category=&tag=
 *   GET /api/public/posts/:slug?site=
 *
 * NOTE ON SEARCH: the CMS does not support a search parameter — passing
 * `search`/`q` is silently ignored and returns the full set. So search is
 * performed here: we pull the full post list (cached) and filter + paginate it
 * ourselves. Pagination and category filtering, which the API *does* support,
 * are delegated to the API so we only ever fetch one page.
 */

import type {
  CategoryWithCount,
  ListPostsParams,
  Post,
  PostListResult,
  RawPost,
  RawPostList,
} from "./cms-types";
import { sanitizeCmsHtml } from "@/lib/cmsHtml";
import { buildUrl, CmsError, fetchJson, type FetchOptions } from "./cms";

/** Max the CMS allows per request. */
const MAX_LIMIT = 100;

/**
 * Excerpts imported from WordPress end with a "… Read More" teaser, which is
 * meaningless once the text is used as a standfirst or card summary. Strip it.
 */
function cleanExcerpt(text = ""): string {
  return String(text)
    .replace(
      /\s*(?:&hellip;|…|\.{2,})?\s*(?:Read\s*More|Continue\s*Reading)\s*[.…»>]*\s*$/i,
      ""
    )
    .trim();
}

/** Normalize a CMS post (list or detail) into the shape our UI expects. */
function normalizePost(raw: RawPost | null | undefined): Post | null {
  if (!raw) return null;
  return {
    id: raw.id ?? "",
    slug: raw.slug ?? "",
    title: raw.title || "",
    excerpt: cleanExcerpt(raw.excerpt || ""),
    // Rendered as raw HTML, so sanitize it here, on the server (lib/cmsHtml.ts).
    content: sanitizeCmsHtml(raw.content || ""),
    cover: raw.coverImage || null,
    coverAlt: raw.coverImageAlt || raw.title || "",
    category: raw.category || raw.categories?.[0] || null,
    categories: raw.categories || [],
    tags: raw.tags || [],
    author: {
      name: raw.author?.name || "eFoli",
      avatar: raw.author?.avatarUrl || null,
      bio: raw.author?.bio || "",
    },
    publishedAt: raw.publishedAt || null,
    updatedAt: raw.updatedAt || null,
    readingTimeMinutes: raw.readingTimeMinutes || null,
    // SEO fields (detail endpoint only)
    metaTitle: raw.metaTitle || null,
    metaDescription: raw.metaDescription || null,
    ogImage: raw.ogImage || null,
    canonicalUrl: raw.canonicalUrl || null,
    noIndex: Boolean(raw.noIndex),
    // Preview-only fields (present when fetched with the preview token).
    status: raw.status || null, // DRAFT · PUBLISHED · SCHEDULED · ARCHIVED
    isPreview: Boolean(raw.isPreview),
  };
}

/* ── Full-list cache (only used for search + category derivation) ─────────── */

const CACHE_TTL_MS = 5 * 60 * 1000;
let allPostsCache: { at: number; posts: Post[] | null } = { at: 0, posts: null };

/** Pull every published post, following pagination. Cached for 5 minutes. */
async function fetchAllPosts(): Promise<Post[]> {
  if (allPostsCache.posts && Date.now() - allPostsCache.at < CACHE_TTL_MS) {
    return allPostsCache.posts;
  }

  const collected: Post[] = [];
  let page = 1;
  let totalPages = 1;

  do {
    const data = await fetchJson<RawPostList>(
      buildUrl("/posts", { page, limit: MAX_LIMIT })
    );
    for (const raw of data.posts || []) {
      const post = normalizePost(raw);
      if (post) collected.push(post);
    }
    totalPages = data.totalPages || 1;
    page += 1;
  } while (page <= totalPages && page <= 20); // hard stop, just in case

  allPostsCache = { at: Date.now(), posts: collected };
  return collected;
}

/**
 * Drop the cached post list so the next read hits the CMS immediately.
 * Called by the /api/revalidate endpoint when the CMS pushes a content change.
 */
export function clearBlogCache(): void {
  allPostsCache = { at: 0, posts: null };
}

function matchesQuery(post: Post, query: string): boolean {
  const q = query.trim().toLowerCase();
  if (!q) return true;
  return (
    post.title.toLowerCase().includes(q) ||
    post.excerpt.toLowerCase().includes(q) ||
    (post.category?.name?.toLowerCase().includes(q) ?? false) ||
    post.tags.some((t) => t.name?.toLowerCase().includes(q))
  );
}

/* ── Public API ───────────────────────────────────────────────────────────── */

/** List posts with server-side pagination. */
export async function listPosts({
  page = 1,
  limit = 9,
  category = "",
  tag = "",
  search = "",
}: ListPostsParams = {}): Promise<PostListResult> {
  const safePage = Math.max(1, Number(page) || 1);
  const safeLimit = Math.min(MAX_LIMIT, Math.max(1, Number(limit) || 9));

  try {
    // Search isn't supported upstream → filter and paginate here.
    if (search && search.trim()) {
      let posts = await fetchAllPosts();
      if (category) {
        posts = posts.filter((p) => p.categories.some((c) => c.slug === category));
      }
      if (tag) {
        posts = posts.filter((p) => p.tags.some((t) => t.slug === tag));
      }
      posts = posts.filter((p) => matchesQuery(p, search));

      const total = posts.length;
      const totalPages = Math.max(1, Math.ceil(total / safeLimit));
      const current = Math.min(safePage, totalPages);
      const start = (current - 1) * safeLimit;

      return {
        posts: posts.slice(start, start + safeLimit),
        total,
        page: current,
        limit: safeLimit,
        totalPages,
      };
    }

    // No search → let the CMS paginate and filter.
    const data = await fetchJson<RawPostList>(
      buildUrl("/posts", { page: safePage, limit: safeLimit, category, tag })
    );

    return {
      posts: (data.posts || [])
        .map(normalizePost)
        .filter((p): p is Post => p !== null),
      total: data.total ?? 0,
      page: data.page ?? safePage,
      limit: data.limit ?? safeLimit,
      totalPages: data.totalPages ?? 1,
    };
  } catch (error) {
    console.error("[blog] listPosts failed:", (error as Error).message);
    return { posts: [], total: 0, page: 1, limit: safeLimit, totalPages: 1 };
  }
}

/**
 * The unfiltered blog index, accounting for the featured post.
 *
 * Page 1 renders the latest post as a full-width feature ABOVE the grid, so it
 * shows `gridSize + 1` posts total (feature + a full grid) — otherwise the grid
 * would be one short and leave a gap in the last row. Later pages continue the
 * stream `gridSize` at a time with no overlap. Returns the same shape as
 * listPosts, with the feature as posts[0] on page 1 (Bloglist slices it off).
 */
export async function listBlogIndex({
  page = 1,
  gridSize = 12,
}: { page?: number; gridSize?: number } = {}): Promise<PostListResult> {
  const size = Math.max(1, Number(gridSize) || 12);
  try {
    const all = await fetchAllPosts(); // newest first, cached
    const total = all.length;
    const firstPageCount = size + 1; // feature + full grid

    const totalPages =
      total <= firstPageCount ? 1 : 1 + Math.ceil((total - firstPageCount) / size);
    const current = Math.min(Math.max(1, Number(page) || 1), totalPages);

    const start = current === 1 ? 0 : firstPageCount + (current - 2) * size;
    const count = current === 1 ? firstPageCount : size;

    return {
      posts: all.slice(start, start + count),
      total,
      page: current,
      limit: size,
      totalPages,
    };
  } catch (error) {
    console.error("[blog] listBlogIndex failed:", (error as Error).message);
    return { posts: [], total: 0, page: 1, limit: size, totalPages: 1 };
  }
}

/** Every published post — used by the sitemap. Empty array if the CMS is down. */
export async function getAllPosts(): Promise<Post[]> {
  try {
    return await fetchAllPosts();
  } catch (error) {
    console.error("[blog] getAllPosts failed:", (error as Error).message);
    return [];
  }
}

/** Latest N posts — used by the homepage. */
export async function getLatestPosts(limit = 3): Promise<Post[]> {
  const { posts } = await listPosts({ page: 1, limit });
  return posts;
}

/**
 * A single post by slug, or null when it doesn't exist.
 *
 * In preview mode the CMS's preview token is sent as an `x-preview-token`
 * header (never a query string — the doc is explicit about that) and caching is
 * disabled, so an editor sees the newest DRAFT on every reload.
 */
export async function getPostBySlug(
  slug: string,
  { preview = false }: { preview?: boolean } = {}
): Promise<Post | null> {
  if (!slug) return null;

  const previewToken = process.env.PREVIEW_SECRET || "";
  const options: FetchOptions =
    preview && previewToken
      ? { headers: { "x-preview-token": previewToken }, cache: "no-store" }
      : {};

  try {
    const data = await fetchJson<RawPost>(
      buildUrl(`/posts/${encodeURIComponent(slug)}`),
      options
    );
    return normalizePost(data);
  } catch (error) {
    if (error instanceof CmsError && error.status === 404) return null;
    console.error("[blog] getPostBySlug failed:", (error as Error).message);
    return null;
  }
}

/** Related posts — same category first, topped up with the most recent. */
export async function getRelatedPosts(slug: string, limit = 3): Promise<Post[]> {
  try {
    const current = await getPostBySlug(slug);
    const categorySlug = current?.category?.slug;

    // Pull a small pool from the same category, then top up from the latest.
    const pool: Post[] = [];
    if (categorySlug) {
      const { posts } = await listPosts({
        page: 1,
        limit: limit + 3,
        category: categorySlug,
      });
      pool.push(...posts);
    }
    if (pool.length < limit + 1) {
      const { posts } = await listPosts({ page: 1, limit: limit + 3 });
      pool.push(...posts);
    }

    const seen = new Set<string>([slug]);
    const related: Post[] = [];
    for (const post of pool) {
      if (seen.has(post.slug)) continue;
      seen.add(post.slug);
      related.push(post);
      if (related.length >= limit) break;
    }
    return related;
  } catch (error) {
    console.error("[blog] getRelatedPosts failed:", (error as Error).message);
    return [];
  }
}

/**
 * Distinct categories with post counts.
 * The CMS has no categories endpoint, so these are derived from the full list.
 */
export async function getCategories(): Promise<CategoryWithCount[]> {
  try {
    const posts = await fetchAllPosts();
    const counts = new Map<string, CategoryWithCount>();
    for (const post of posts) {
      for (const cat of post.categories) {
        if (!cat?.slug) continue;
        const existing = counts.get(cat.slug);
        counts.set(cat.slug, {
          name: cat.name,
          slug: cat.slug,
          count: (existing?.count || 0) + 1,
        });
      }
    }
    return [...counts.values()].sort((a, b) => b.count - a.count);
  } catch (error) {
    console.error("[blog] getCategories failed:", (error as Error).message);
    return [];
  }
}
