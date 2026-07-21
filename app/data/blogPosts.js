/**
 * Blog data layer — eFoli CMS (https://cms.efoli.com/api/public).
 *
 * This is the only module that talks to the CMS. Everything else consumes the
 * normalized post shape produced by `normalizePost()` below.
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

const API_BASE = process.env.CMS_API_URL || "https://cms.efoli.com/api/public";
const SITE = process.env.CMS_SITE || "efoli";

/** Max the CMS allows per request. */
const MAX_LIMIT = 100;

/**
 * Excerpts imported from WordPress end with a "… Read More" teaser, which is
 * meaningless once the text is used as a standfirst or card summary. Strip it.
 */
function cleanExcerpt(text = "") {
  return String(text)
    .replace(/\s*(?:&hellip;|…|\.{2,})?\s*(?:Read\s*More|Continue\s*Reading)\s*[.…»>]*\s*$/i, "")
    .trim();
}

/** Normalize a CMS post (list or detail) into the shape our UI expects. */
function normalizePost(raw) {
  if (!raw) return null;
  return {
    id: raw.id,
    slug: raw.slug,
    title: raw.title || "",
    excerpt: cleanExcerpt(raw.excerpt || ""),
    content: raw.content || "",
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
  };
}

function buildUrl(path, params = {}) {
  const url = new URL(`${API_BASE}${path}`);
  url.searchParams.set("site", SITE);
  for (const [key, value] of Object.entries(params)) {
    if (value !== undefined && value !== null && value !== "") {
      url.searchParams.set(key, String(value));
    }
  }
  return url.toString();
}

async function fetchJson(url) {
  const res = await fetch(url, { headers: { Accept: "application/json" } });
  if (!res.ok) {
    const error = new Error(`CMS request failed (${res.status}) for ${url}`);
    error.status = res.status;
    throw error;
  }
  return res.json();
}

/* ── Full-list cache (only used for search + category derivation) ─────────── */

const CACHE_TTL_MS = 5 * 60 * 1000;
let allPostsCache = { at: 0, posts: null };

/** Pull every published post, following pagination. Cached for 5 minutes. */
async function fetchAllPosts() {
  if (allPostsCache.posts && Date.now() - allPostsCache.at < CACHE_TTL_MS) {
    return allPostsCache.posts;
  }

  const collected = [];
  let page = 1;
  let totalPages = 1;

  do {
    const data = await fetchJson(
      buildUrl("/posts", { page, limit: MAX_LIMIT })
    );
    collected.push(...(data.posts || []).map(normalizePost));
    totalPages = data.totalPages || 1;
    page += 1;
  } while (page <= totalPages && page <= 20); // hard stop, just in case

  allPostsCache = { at: Date.now(), posts: collected };
  return collected;
}

function matchesQuery(post, query) {
  const q = query.trim().toLowerCase();
  if (!q) return true;
  return (
    post.title.toLowerCase().includes(q) ||
    post.excerpt.toLowerCase().includes(q) ||
    post.category?.name?.toLowerCase().includes(q) ||
    post.tags.some((t) => t.name?.toLowerCase().includes(q))
  );
}

/* ── Public API ───────────────────────────────────────────────────────────── */

/**
 * List posts with server-side pagination.
 * @returns {{posts:Array, total:number, page:number, limit:number, totalPages:number}}
 */
export async function listPosts({
  page = 1,
  limit = 9,
  category = "",
  tag = "",
  search = "",
} = {}) {
  const safePage = Math.max(1, Number(page) || 1);
  const safeLimit = Math.min(MAX_LIMIT, Math.max(1, Number(limit) || 9));

  try {
    // Search isn't supported upstream → filter and paginate here.
    if (search && search.trim()) {
      let posts = await fetchAllPosts();
      if (category) {
        posts = posts.filter((p) =>
          p.categories.some((c) => c.slug === category)
        );
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
    const data = await fetchJson(
      buildUrl("/posts", { page: safePage, limit: safeLimit, category, tag })
    );

    return {
      posts: (data.posts || []).map(normalizePost),
      total: data.total ?? 0,
      page: data.page ?? safePage,
      limit: data.limit ?? safeLimit,
      totalPages: data.totalPages ?? 1,
    };
  } catch (error) {
    console.error("[blog] listPosts failed:", error.message);
    return { posts: [], total: 0, page: 1, limit: safeLimit, totalPages: 1 };
  }
}

/** Every published post — used by the sitemap. Empty array if the CMS is down. */
export async function getAllPosts() {
  try {
    return await fetchAllPosts();
  } catch (error) {
    console.error("[blog] getAllPosts failed:", error.message);
    return [];
  }
}

/** Latest N posts — used by the homepage. */
export async function getLatestPosts(limit = 3) {
  const { posts } = await listPosts({ page: 1, limit });
  return posts;
}

/** A single post by slug, or null when it doesn't exist. */
export async function getPostBySlug(slug) {
  if (!slug) return null;
  try {
    const data = await fetchJson(buildUrl(`/posts/${encodeURIComponent(slug)}`));
    return normalizePost(data);
  } catch (error) {
    if (error.status === 404) return null;
    console.error("[blog] getPostBySlug failed:", error.message);
    return null;
  }
}

/** Related posts — same category first, topped up with the most recent. */
export async function getRelatedPosts(slug, limit = 3) {
  try {
    const current = await getPostBySlug(slug);
    const categorySlug = current?.category?.slug;

    // Pull a small pool from the same category, then top up from the latest.
    const pool = [];
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

    const seen = new Set([slug]);
    const related = [];
    for (const post of pool) {
      if (seen.has(post.slug)) continue;
      seen.add(post.slug);
      related.push(post);
      if (related.length >= limit) break;
    }
    return related;
  } catch (error) {
    console.error("[blog] getRelatedPosts failed:", error.message);
    return [];
  }
}

/**
 * Distinct categories with post counts.
 * The CMS has no categories endpoint, so these are derived from the full list.
 */
export async function getCategories() {
  try {
    const posts = await fetchAllPosts();
    const counts = new Map();
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
    console.error("[blog] getCategories failed:", error.message);
    return [];
  }
}
