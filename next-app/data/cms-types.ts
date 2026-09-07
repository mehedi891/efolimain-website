/**
 * Shared CMS types for the blog data seam.
 *
 * `*Raw` types describe the loose JSON the CMS returns (fields may be missing);
 * the plain types describe the normalized shape our UI consumes.
 */

export interface Category {
  name: string;
  slug: string;
}

export interface CategoryWithCount extends Category {
  count: number;
}

export interface Tag {
  name: string;
  slug: string;
}

export interface Author {
  name: string;
  avatar: string | null;
  bio: string;
}

export type PostStatus = "DRAFT" | "PUBLISHED" | "SCHEDULED" | "ARCHIVED";

/** Normalized post — the shape everything downstream depends on. */
export interface Post {
  id: string | number;
  slug: string;
  title: string;
  excerpt: string;
  content: string;
  cover: string | null;
  coverAlt: string;
  category: Category | null;
  categories: Category[];
  tags: Tag[];
  author: Author;
  publishedAt: string | null;
  updatedAt: string | null;
  readingTimeMinutes: number | null;
  metaTitle: string | null;
  metaDescription: string | null;
  ogImage: string | null;
  canonicalUrl: string | null;
  noIndex: boolean;
  status: PostStatus | null;
  isPreview: boolean;
}

/** Loose shape of a post as returned by the CMS (any field may be absent). */
export interface RawPost {
  id?: string | number;
  slug?: string;
  title?: string;
  excerpt?: string;
  content?: string;
  coverImage?: string | null;
  coverImageAlt?: string | null;
  category?: Category | null;
  categories?: Category[];
  tags?: Tag[];
  author?: { name?: string; avatarUrl?: string | null; bio?: string } | null;
  publishedAt?: string | null;
  updatedAt?: string | null;
  readingTimeMinutes?: number | null;
  metaTitle?: string | null;
  metaDescription?: string | null;
  ogImage?: string | null;
  canonicalUrl?: string | null;
  noIndex?: boolean;
  status?: PostStatus | null;
  isPreview?: boolean;
}

/** CMS list-endpoint envelope. */
export interface RawPostList {
  posts?: RawPost[];
  total?: number;
  page?: number;
  limit?: number;
  totalPages?: number;
}

/** Normalized list result returned by `listPosts`. */
export interface PostListResult {
  posts: Post[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}

export interface ListPostsParams {
  page?: number;
  limit?: number;
  category?: string;
  tag?: string;
  search?: string;
}
