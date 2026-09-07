"use client";

import { useEffect, useState, useTransition } from "react";
import Link from "next/link";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { motion } from "motion/react";
import { formatDate, postPath, readingTime } from "@/lib/blog";
import ButtonWithIcon from "@/components/ButtonWithIcon";
import Avatar from "./Avatar";
import type { CategoryWithCount, Post } from "@/data/cms-types";

const fadeUp = {
  hidden: { opacity: 0, y: 28 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { type: "spring" as const, stiffness: 70, damping: 16 },
  },
};

const gridStagger = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.07 } },
};

const minutesOf = (post: Post): number =>
  post.readingTimeMinutes || readingTime(post.content || post.excerpt || "");

const Meta = ({ post, className = "" }: { post: Post; className?: string }) => (
  <p className={`flex flex-wrap items-center gap-x-2 gap-y-1 text-sm text-[#4B5154] ${className}`}>
    <span>{formatDate(post.publishedAt)}</span>
    <span aria-hidden="true" className="text-gray-300">•</span>
    <span>{minutesOf(post)} min read</span>
  </p>
);

const CoverImage = ({ post, className }: { post: Post; className?: string }) =>
  post.cover ? (
    <img src={post.cover} alt={post.coverAlt} loading="lazy" className={className} />
  ) : (
    <div
      className={`${className} grid place-items-center bg-gradient-to-br from-[#0D99FF] to-[#7dd3fc]`}
    >
      <span className="px-6 text-center font-display text-lg font-bold text-white/90">
        {post.category?.name || "eFoli"}
      </span>
    </div>
  );

const PostCard = ({ post }: { post: Post }) => (
  <motion.article variants={fadeUp} className="h-full">
    <Link href={postPath(post)} className="group flex h-full flex-col">
      <div className="relative overflow-hidden rounded-2xl">
        <CoverImage
          post={post}
          className="h-[220px] w-full object-cover transition duration-700 ease-out group-hover:scale-105 md:h-[240px]"
        />
        {post.category && (
          <span className="absolute left-4 top-4 rounded-full bg-white/95 px-3 py-1 text-xs font-semibold text-[#0D99FF] backdrop-blur">
            {post.category.name}
          </span>
        )}
      </div>

      <div className="flex flex-1 flex-col pt-5">
        <h3 className="font-display text-lg font-bold text-[#13181E] transition duration-300 group-hover:text-[#0D99FF] md:text-2xl">
          {post.title}
        </h3>
        <p className="mt-3 line-clamp-3 text-base/[1.7] text-[#4B5154]">
          {post.excerpt}
        </p>

        <div className="mt-auto flex items-center gap-3 pt-5">
          <Avatar author={post.author} />
          <div className="min-w-0">
            <p className="truncate text-sm font-semibold text-[#13181E]">
              {post.author.name}
            </p>
            <Meta post={post} />
          </div>
        </div>
      </div>
    </Link>
  </motion.article>
);

const FeaturedPost = ({ post }: { post: Post }) => (
  <motion.article variants={fadeUp} initial="hidden" animate="visible">
    <Link
      href={postPath(post)}
      className="group grid gap-8 overflow-hidden rounded-3xl border border-gray-100 bg-gradient-to-r from-white to-[#f2fbfa] p-5 shadow-lg transition duration-500 hover:shadow-2xl sm:p-7 lg:grid-cols-2 lg:gap-10 lg:p-8"
    >
      <div className="relative overflow-hidden rounded-2xl">
        <CoverImage
          post={post}
          className="h-[240px] w-full object-cover transition duration-700 ease-out group-hover:scale-105 sm:h-[320px] lg:h-full lg:min-h-[360px]"
        />
      </div>

      <div className="flex flex-col justify-center lg:py-4">
        <div className="flex flex-wrap items-center gap-3">
          <span className="rounded-full bg-[#0D99FF]/10 px-3 py-1 text-xs font-semibold text-[#0D99FF]">
            Latest
          </span>
          {post.category && (
            <span className="text-sm font-semibold text-[#4B5154]">
              {post.category.name}
            </span>
          )}
        </div>

        <h2 className="mt-4 font-display text-2xl font-bold text-[#13181E] transition duration-300 group-hover:text-[#0D99FF] sm:text-3xl md:text-4xl/[1.2]">
          {post.title}
        </h2>
        <p className="mt-4 line-clamp-4 text-base/[1.75] text-[#4B5154]">
          {post.excerpt}
        </p>

        <div className="mt-6 flex items-center gap-3">
          <Avatar author={post.author} className="h-11 w-11" textClass="text-sm" />
          <div>
            <p className="text-sm font-semibold text-[#13181E]">
              {post.author.name}
            </p>
            <Meta post={post} />
          </div>
        </div>

        <div className="mt-7">
          <ButtonWithIcon
            text1="Read article"
            text2="Read article"
            pClass="text-base font-semibold"
          />
        </div>
      </div>
    </Link>
  </motion.article>
);

/** Windowed page numbers, e.g. 1 … 4 5 6 … 12 */
function pageWindow(current: number, total: number): (number | "…")[] {
  const pages = new Set([1, total, current, current - 1, current + 1]);
  const list = [...pages].filter((p) => p >= 1 && p <= total).sort((a, b) => a - b);
  const out: (number | "…")[] = [];
  let prev = 0;
  for (const p of list) {
    if (prev && p - prev > 1) out.push("…");
    out.push(p);
    prev = p;
  }
  return out;
}

interface BloglistProps {
  posts: Post[];
  total: number;
  page: number;
  totalPages: number;
  categories: CategoryWithCount[];
  category: string;
  tag: string;
  q: string;
}

const Bloglist = ({
  posts = [],
  categories = [],
  page = 1,
  totalPages = 1,
  total = 0,
  category = "",
  tag = "",
  q = "",
}: BloglistProps) => {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const [term, setTerm] = useState(q);
  const [isPending, startTransition] = useTransition();

  // Keep the input in sync when the URL changes from elsewhere (e.g. clearing).
  useEffect(() => {
    setTerm(q);
  }, [q]);

  // Debounce search → URL, so every keystroke doesn't hit the loader.
  useEffect(() => {
    if (term === q) return;
    const id = setTimeout(() => {
      const next = new URLSearchParams(searchParams.toString());
      if (term.trim()) next.set("q", term.trim());
      else next.delete("q");
      next.delete("page"); // new query → back to page 1
      const qs = next.toString();
      startTransition(() => {
        router.replace(qs ? `${pathname}?${qs}` : pathname, { scroll: false });
      });
    }, 400);
    return () => clearTimeout(id);
  }, [term, q, searchParams, router, pathname]);

  /** Build a href preserving the other active filters. */
  const hrefWith = (overrides: Record<string, string | number | null | undefined>): string => {
    const next = new URLSearchParams(searchParams.toString());
    for (const [key, value] of Object.entries(overrides)) {
      if (value === null || value === "" || value === undefined) next.delete(key);
      else next.set(key, String(value));
    }
    const qs = next.toString();
    return qs ? `${pathname}?${qs}` : pathname;
  };

  const isFiltered = Boolean(category) || Boolean(tag) || Boolean(q);

  // The visible heading tracks the filter state so each view is a genuinely
  // distinct page, matching the <title> set in the route's meta().
  const categoryName =
    categories.find((c) => c.slug === category)?.name || category;

  const heading = q
    ? {
        lead: "Search results for",
        accent: `“${q}”`,
        subtitle: `${total} ${
          total === 1 ? "article" : "articles"
        } matching your search.`,
      }
    : category
      ? {
          lead: categoryName,
          accent: "Articles",
          subtitle: `Everything we've published in ${categoryName} — practical guides from the team that builds eFoli's Shopify apps.`,
        }
      : tag
        ? {
            lead: "Posts tagged",
            accent: `“${tag}”`,
            subtitle: `${total} ${
              total === 1 ? "article" : "articles"
            } tagged ${tag}.`,
          }
        : {
            lead: "Insights That Help You",
            accent: "Sell Smarter",
            subtitle:
              "Practical guides on B2B commerce, Shopify apps, conversion, and the engineering behind stores that scale — written by the team that builds them.",
          };

  const showFeatured = page === 1 && !isFiltered && posts.length > 0;
  const featured = showFeatured ? posts[0] : null;
  const gridPosts = showFeatured ? posts.slice(1) : posts;

  return (
    <>
      {/* ── Hero ─────────────────────────────────────────────── */}
      <section className="relative overflow-hidden bg-gradient-to-b from-[#f2fbfa] via-white to-white">
        <div
          aria-hidden="true"
          className="pointer-events-none absolute -top-32 left-1/2 h-72 w-[36rem] -translate-x-1/2 rounded-full bg-[#0D99FF]/10 blur-[110px]"
        />
        <div className="relative mx-auto max-w-7xl px-4 pb-10 pt-14 text-center sm:px-6 md:pb-14 md:pt-20">
          <motion.div variants={fadeUp} initial="hidden" animate="visible">
            <span className="inline-flex items-center gap-2 rounded-full border border-[#0D99FF]/20 bg-white px-4 py-1.5 text-xs font-semibold uppercase tracking-[0.18em] text-[#0D99FF] shadow-sm">
              <span className="h-1.5 w-1.5 animate-pulse rounded-full bg-[#0D99FF]" />
              eFoli Blog
            </span>

            <h1 className="mx-auto mt-6 max-w-4xl font-display text-3xl font-bold text-[#13181E] sm:text-4xl md:text-6xl/[1.1]">
              {heading.lead}{" "}
              <span className="bg-gradient-to-r from-[#0D99FF] to-[#7dd3fc] bg-clip-text text-transparent">
                {heading.accent}
              </span>
            </h1>

            <p className="mx-auto mt-5 max-w-2xl text-base/[1.75] text-[#4B5154] md:text-lg/[1.8]">
              {heading.subtitle}
            </p>
          </motion.div>

          {/* search */}
          <motion.div
            variants={fadeUp}
            initial="hidden"
            animate="visible"
            className="mx-auto mt-8 max-w-xl"
          >
            <label htmlFor="blog-search" className="sr-only">
              Search articles
            </label>
            <div className="relative">
              <svg
                aria-hidden="true"
                className="pointer-events-none absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2 text-gray-400"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
              >
                <circle cx="11" cy="11" r="7" />
                <path d="m20 20-3.5-3.5" strokeLinecap="round" />
              </svg>
              <input
                id="blog-search"
                type="search"
                value={term}
                onChange={(e) => setTerm(e.target.value)}
                placeholder="Search articles, topics, tags…"
                className="w-full rounded-full border border-gray-200 bg-white py-3.5 pl-12 pr-12 text-base text-[#13181E] shadow-sm outline-none transition placeholder:text-gray-400 focus:border-[#0D99FF] focus:ring-4 focus:ring-[#0D99FF]/10"
              />
              {isPending && (
                <span
                  aria-hidden="true"
                  className="absolute right-4 top-1/2 h-5 w-5 -translate-y-1/2 animate-spin rounded-full border-2 border-gray-200 border-t-[#0D99FF]"
                />
              )}
            </div>
          </motion.div>
        </div>
      </section>

      {/* ── Filters + posts ──────────────────────────────────── */}
      <section className="mx-auto max-w-7xl px-4 pb-16 sm:px-6 md:pb-24">
        <div className="flex flex-wrap justify-center gap-2.5 md:gap-3">
          <Link
            href={hrefWith({ category: null, page: null })}
            scroll={false}
            className={`rounded-full border px-4 py-2 text-sm font-semibold transition duration-300 ${
              !category
                ? "border-[#0D99FF] bg-[#0D99FF] text-white shadow-md shadow-[#0D99FF]/25"
                : "border-gray-200 bg-white text-[#4B5154] hover:border-[#0D99FF] hover:text-[#0D99FF]"
            }`}
          >
            All posts
          </Link>
          {categories.map((cat) => {
            const active = category === cat.slug;
            return (
              <Link
                key={cat.slug}
                href={hrefWith({ category: cat.slug, page: null })}
                scroll={false}
                className={`rounded-full border px-4 py-2 text-sm font-semibold transition duration-300 ${
                  active
                    ? "border-[#0D99FF] bg-[#0D99FF] text-white shadow-md shadow-[#0D99FF]/25"
                    : "border-gray-200 bg-white text-[#4B5154] hover:border-[#0D99FF] hover:text-[#0D99FF]"
                }`}
              >
                {cat.name}
                <span className="ml-1.5 opacity-60">{cat.count}</span>
              </Link>
            );
          })}
        </div>

        {/* active tag chip — set by legacy /blog/tag/<slug>/ redirects */}
        {tag && (
          <div className="mt-6 flex justify-center">
            <span className="inline-flex items-center gap-2 rounded-full border border-[#0D99FF]/30 bg-[#0D99FF]/10 py-1.5 pl-4 pr-2 text-sm font-semibold text-[#0D99FF]">
              Tag: {tag}
              <Link
                href={hrefWith({ tag: null, page: null })}
                scroll={false}
                aria-label="Remove tag filter"
                className="grid h-5 w-5 place-items-center rounded-full bg-[#0D99FF]/20 transition hover:bg-[#0D99FF] hover:text-white"
              >
                <svg viewBox="0 0 24 24" className="h-3 w-3" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round">
                  <path d="M18 6 6 18M6 6l12 12" />
                </svg>
              </Link>
            </span>
          </div>
        )}

        {/* result summary while filtering */}
        {isFiltered && (
          <p className="mt-8 text-center text-base text-[#4B5154]">
            {total > 0 ? (
              <>
                <span className="font-semibold text-[#13181E]">{total}</span>{" "}
                {total === 1 ? "article" : "articles"}
                {q && (
                  <>
                    {" "}for “<span className="font-semibold text-[#13181E]">{q}</span>”
                  </>
                )}
              </>
            ) : null}
          </p>
        )}

        {featured && (
          <div className="mt-10 md:mt-14">
            <FeaturedPost post={featured} />
          </div>
        )}

        {gridPosts.length > 0 ? (
          <motion.div
            key={`${category}-${q}-${page}`}
            variants={gridStagger}
            initial="hidden"
            animate="visible"
            className={`mt-10 grid grid-cols-1 gap-x-6 gap-y-10 sm:grid-cols-2 md:mt-14 lg:grid-cols-3 ${
              isPending ? "opacity-60 transition-opacity" : ""
            }`}
          >
            {gridPosts.map((post) => (
              <PostCard key={post.id || post.slug} post={post} />
            ))}
          </motion.div>
        ) : (
          !featured && (
            <div className="mt-16 text-center">
              <p className="font-display text-xl font-bold text-[#13181E]">
                No articles found
              </p>
              <p className="mt-2 text-base text-[#4B5154]">
                Try a different search term or category.
              </p>
              <Link
                href="/blog"
                className="mt-5 inline-block rounded-lg bg-[#0D99FF] px-5 py-2.5 text-sm font-semibold text-white transition hover:bg-[#0a7acc]"
              >
                Clear filters
              </Link>
            </div>
          )
        )}

        {/* ── Pagination ─────────────────────────────────────── */}
        {totalPages > 1 && (
          <nav
            aria-label="Pagination"
            className="mt-14 flex flex-wrap items-center justify-center gap-2"
          >
            {page > 1 ? (
              <Link
                href={hrefWith({ page: page - 1 === 1 ? null : page - 1 })}
                scroll={false}
                aria-label="Previous page"
                className="grid h-10 w-10 place-items-center rounded-full border border-gray-200 bg-white text-[#4B5154] transition hover:border-[#0D99FF] hover:text-[#0D99FF]"
              >
                <svg viewBox="0 0 24 24" className="h-4 w-4" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
                  <path d="M15 18l-6-6 6-6" />
                </svg>
              </Link>
            ) : (
              <span className="grid h-10 w-10 place-items-center rounded-full border border-gray-100 text-gray-300">
                <svg viewBox="0 0 24 24" className="h-4 w-4" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
                  <path d="M15 18l-6-6 6-6" />
                </svg>
              </span>
            )}

            {pageWindow(page, totalPages).map((p, i) =>
              p === "…" ? (
                <span key={`gap-${i}`} className="px-1 text-[#4B5154]">
                  …
                </span>
              ) : (
                <Link
                  key={p}
                  href={hrefWith({ page: p === 1 ? null : p })}
                  scroll={false}
                  aria-current={p === page ? "page" : undefined}
                  className={`grid h-10 min-w-10 place-items-center rounded-full border px-3 text-sm font-semibold transition ${
                    p === page
                      ? "border-[#0D99FF] bg-[#0D99FF] text-white shadow-md shadow-[#0D99FF]/25"
                      : "border-gray-200 bg-white text-[#4B5154] hover:border-[#0D99FF] hover:text-[#0D99FF]"
                  }`}
                >
                  {p}
                </Link>
              )
            )}

            {page < totalPages ? (
              <Link
                href={hrefWith({ page: page + 1 })}
                scroll={false}
                aria-label="Next page"
                className="grid h-10 w-10 place-items-center rounded-full border border-gray-200 bg-white text-[#4B5154] transition hover:border-[#0D99FF] hover:text-[#0D99FF]"
              >
                <svg viewBox="0 0 24 24" className="h-4 w-4" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
                  <path d="M9 18l6-6-6-6" />
                </svg>
              </Link>
            ) : (
              <span className="grid h-10 w-10 place-items-center rounded-full border border-gray-100 text-gray-300">
                <svg viewBox="0 0 24 24" className="h-4 w-4" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
                  <path d="M9 18l6-6-6-6" />
                </svg>
              </span>
            )}
          </nav>
        )}
      </section>
    </>
  );
};

export default Bloglist;
