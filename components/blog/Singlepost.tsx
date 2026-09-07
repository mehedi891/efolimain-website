"use client";

import Image from "next/image";
import Link from "next/link";
import { motion, useScroll, useSpring } from "motion/react";
import {
  buildToc,
  formatDate,
  postPath,
  readingTime,
} from "@/lib/blog";
import Avatar from "./Avatar";
import type { Post } from "@/data/cms-types";

// Keep the cover's entrance animation while gaining next/image optimization.
const MotionImage = motion.create(Image);

const minutesOf = (post: Post): number =>
  post.readingTimeMinutes || readingTime(post.content || "");

const fadeUp = {
  hidden: { opacity: 0, y: 26 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { type: "spring" as const, stiffness: 70, damping: 16 },
  },
};

const ShareLinks = ({ post, vertical = false }: { post: Post; vertical?: boolean }) => {
  const url =
    typeof window !== "undefined"
      ? window.location.href
      : `https://efoli.com${postPath(post)}`;
  const text = encodeURIComponent(post.title);
  const encoded = encodeURIComponent(url);

  const links = [
    {
      label: "Share on LinkedIn",
      href: `https://www.linkedin.com/sharing/share-offsite/?url=${encoded}`,
      path: "M6.94 5a2 2 0 1 1-4-.002 2 2 0 0 1 4 .002ZM7 8.48H3V21h4V8.48Zm6.32 0H9.34V21h3.94v-6.57c0-3.66 4.77-4 4.77 0V21H22v-7.93c0-6.17-7.06-5.94-8.72-2.91l.04-1.68Z",
    },
    {
      label: "Share on X",
      href: `https://twitter.com/intent/tweet?text=${text}&url=${encoded}`,
      path: "M18.9 1.15h3.68l-8.04 9.19L24 22.85h-7.41l-5.8-7.58-6.64 7.58H.46l8.6-9.83L0 1.15h7.59l5.24 6.93 6.07-6.93Zm-1.29 19.5h2.04L6.49 3.24H4.3l13.31 17.41Z",
    },
    {
      label: "Share on Facebook",
      href: `https://www.facebook.com/sharer/sharer.php?u=${encoded}`,
      path: "M22 12.06C22 6.5 17.52 2 12 2S2 6.5 2 12.06c0 5 3.66 9.15 8.44 9.94v-7H7.9v-2.9h2.54V9.85c0-2.52 1.5-3.91 3.77-3.91 1.09 0 2.24.2 2.24.2v2.46h-1.26c-1.24 0-1.63.78-1.63 1.57v1.89h2.78l-.45 2.9h-2.33v7C18.34 21.2 22 17.06 22 12.06Z",
    },
  ];

  return (
    <div className={`flex gap-2 ${vertical ? "flex-col" : "flex-wrap"}`}>
      {links.map((l) => (
        <a
          key={l.label}
          href={l.href}
          target="_blank"
          rel="noreferrer noopener"
          aria-label={l.label}
          title={l.label}
          className="grid h-10 w-10 place-items-center rounded-full border border-gray-200 bg-white text-[#4B5154] transition duration-300 hover:-translate-y-0.5 hover:border-[#0D99FF] hover:text-[#0D99FF] hover:shadow-md"
        >
          <svg viewBox="0 0 24 24" className="h-4 w-4" fill="currentColor">
            <path d={l.path} />
          </svg>
        </a>
      ))}
    </div>
  );
};

const RelatedCard = ({ post }: { post: Post }) => (
  <Link href={postPath(post)} className="group flex flex-col">
    <div className="overflow-hidden rounded-2xl">
      {post.cover ? (
        <Image
          src={post.cover}
          alt={post.coverAlt}
          width={800}
          height={450}
          sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
          className="h-[200px] w-full object-cover transition duration-700 ease-out group-hover:scale-105"
        />
      ) : (
        <div className="grid h-[200px] w-full place-items-center bg-gradient-to-br from-[#0D99FF] to-[#7dd3fc]">
          <span className="px-6 text-center font-display text-lg font-bold text-white/90">
            {post.category?.name || "eFoli"}
          </span>
        </div>
      )}
    </div>
    {post.category && (
      <span className="pt-4 text-xs font-semibold uppercase tracking-wider text-[#0D99FF]">
        {post.category.name}
      </span>
    )}
    <h3 className="mt-2 font-display text-lg font-bold text-[#13181E] transition duration-300 group-hover:text-[#0D99FF] md:text-xl">
      {post.title}
    </h3>
    <p className="mt-2 text-sm text-[#4B5154]">
      {formatDate(post.publishedAt)} • {minutesOf(post)} min read
    </p>
  </Link>
);

interface SinglepostProps {
  post: Post;
  related?: Post[];
}

const Singlepost = ({ post, related = [] }: SinglepostProps) => {
  const { scrollYProgress } = useScroll();
  const progress = useSpring(scrollYProgress, {
    stiffness: 120,
    damping: 30,
    restDelta: 0.001,
  });

  const { html, headings } = buildToc(post.content);

  return (
    <article>
      {/* reading progress */}
      <motion.div
        style={{ scaleX: progress }}
        className="fixed left-0 top-0 z-[60] h-1 w-full origin-left bg-gradient-to-r from-[#0D99FF] to-[#7dd3fc]"
      />

      {/* ── Header ───────────────────────────────────────────── */}
      <header className="relative overflow-hidden bg-gradient-to-b from-[#f2fbfa] to-white">
        <div
          aria-hidden="true"
          className="pointer-events-none absolute -top-28 left-1/2 h-64 w-[32rem] -translate-x-1/2 rounded-full bg-[#0D99FF]/10 blur-[100px]"
        />
        <div className="relative mx-auto max-w-4xl px-4 pb-8 pt-10 sm:px-6 md:pt-14">
          {/* breadcrumb */}
          <nav aria-label="Breadcrumb" className="text-sm text-[#4B5154]">
            <ol className="flex flex-wrap items-center gap-2">
              <li>
                <Link href="/" className="transition hover:text-[#0D99FF]">
                  Home
                </Link>
              </li>
              <li aria-hidden="true" className="text-gray-300">/</li>
              <li>
                <Link href="/blog" className="transition hover:text-[#0D99FF]">
                  Blog
                </Link>
              </li>
              <li aria-hidden="true" className="text-gray-300">/</li>
              <li className="max-w-[16rem] truncate font-medium text-[#13181E]">
                {post.title}
              </li>
            </ol>
          </nav>

          <motion.div variants={fadeUp} initial="hidden" animate="visible">
            {post.category && (
              <span className="mt-6 inline-block rounded-full bg-[#0D99FF]/10 px-3.5 py-1.5 text-xs font-semibold uppercase tracking-wider text-[#0D99FF]">
                {post.category.name}
              </span>
            )}

            <h1 className="mt-5 font-display text-3xl font-bold text-[#13181E] sm:text-4xl md:text-5xl/[1.15]">
              {post.title}
            </h1>

            {post.excerpt && (
              <p className="mt-5 text-lg/[1.75] text-[#4B5154]">{post.excerpt}</p>
            )}

            <div className="mt-8 flex flex-wrap items-center justify-between gap-5 border-t border-gray-200 pt-6">
              <div className="flex items-center gap-3">
                <Avatar
                  author={post.author}
                  className="h-12 w-12"
                  textClass="text-sm"
                />
                <div>
                  <p className="font-semibold text-[#13181E]">
                    {post.author.name}
                  </p>
                  <p className="text-sm text-[#4B5154]">
                    {formatDate(post.publishedAt)} • {minutesOf(post)} min read
                  </p>
                </div>
              </div>
              <ShareLinks post={post} />
            </div>
          </motion.div>
        </div>
      </header>

      {/* ── Cover ────────────────────────────────────────────── */}
      {post.cover && (
        <div className="mx-auto max-w-6xl px-4 sm:px-6">
          <MotionImage
            initial={{ opacity: 0, scale: 0.98 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.7, ease: "easeOut" }}
            src={post.cover}
            alt={post.coverAlt}
            width={1600}
            height={900}
            priority
            sizes="(max-width: 1152px) 100vw, 1152px"
            className="max-h-[520px] w-full rounded-3xl object-cover shadow-xl"
          />
        </div>
      )}

      {/* ── Body ─────────────────────────────────────────────── */}
      <div className="mx-auto max-w-6xl px-4 pb-16 pt-12 sm:px-6 md:pb-24 md:pt-16">
        <div className="grid gap-12 lg:grid-cols-[minmax(0,1fr)_240px]">
          <div className="min-w-0">
            {/* Mobile/tablet table of contents — the sidebar is desktop-only,
                so without this there's no way to jump between sections. */}
            {headings.length > 0 && (
              <details className="mb-10 rounded-2xl border border-gray-200 bg-gradient-to-r from-white to-[#f2fbfa] p-5 lg:hidden">
                <summary className="cursor-pointer list-none font-display text-sm font-bold uppercase tracking-wider text-[#13181E] marker:hidden">
                  <span className="flex items-center justify-between gap-3">
                    On this page
                    <svg
                      aria-hidden="true"
                      viewBox="0 0 24 24"
                      className="h-4 w-4 shrink-0 text-[#0D99FF] transition-transform"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                    >
                      <path d="m6 9 6 6 6-6" />
                    </svg>
                  </span>
                </summary>
                <ul className="mt-4 space-y-2.5 border-l border-gray-200 pl-4">
                  {headings.map((h) => (
                    <li key={h.id} className={h.level === 3 ? "pl-3" : ""}>
                      <a
                        href={`#${h.id}`}
                        className={`block leading-snug transition hover:text-[#0D99FF] ${
                          h.level === 3
                            ? "text-[13px] text-[#4B5154]/80"
                            : "text-sm font-medium text-[#4B5154]"
                        }`}
                      >
                        {h.text}
                      </a>
                    </li>
                  ))}
                </ul>
              </details>
            )}

            <div
              className="blog-content"
              dangerouslySetInnerHTML={{ __html: html }}
            />

            {/* tags */}
            {post.tags?.length > 0 && (
              <div className="mt-12 flex flex-wrap items-center gap-2 border-t border-gray-200 pt-8">
                <span className="text-sm font-semibold text-[#13181E]">
                  Tags:
                </span>
                {post.tags.map((tag) => (
                  <Link
                    key={tag.slug}
                    href={`/blog/?q=${encodeURIComponent(tag.name)}`}
                    className="rounded-full border border-gray-200 px-3 py-1 text-sm text-[#4B5154] transition hover:border-[#0D99FF] hover:text-[#0D99FF]"
                  >
                    {tag.name}
                  </Link>
                ))}
              </div>
            )}

            {/* author bio */}
            <div className="mt-10 flex flex-col gap-5 rounded-2xl bg-gradient-to-r from-white to-[#f2fbfa] p-6 shadow-lg sm:flex-row sm:items-center md:p-8">
              <Avatar
                author={post.author}
                className="h-16 w-16"
                textClass="text-xl"
              />
              <div>
                <p className="font-display text-lg font-bold text-[#13181E]">
                  {post.author.name}
                </p>
                <p className="mt-2 text-base/[1.7] text-[#4B5154]">
                  {post.author.bio ||
                    "Part of the eFoli team, building Shopify apps and B2B commerce solutions for merchants worldwide."}
                </p>
              </div>
            </div>
          </div>

          {/* sidebar */}
          <aside className="hidden lg:block">
            <div className="sticky top-28">
              {headings.length > 0 && (
                <>
                  <p className="font-display text-sm font-bold uppercase tracking-wider text-[#13181E]">
                    On this page
                  </p>
                  <ul className="mt-4 space-y-2.5 border-l border-gray-200 pl-4">
                    {headings.map((h) => (
                      <li key={h.id} className={h.level === 3 ? "pl-3" : ""}>
                        <a
                          href={`#${h.id}`}
                          className={`block leading-snug transition hover:text-[#0D99FF] ${
                            h.level === 3
                              ? "text-[13px] text-[#4B5154]/80"
                              : "text-sm font-medium text-[#4B5154]"
                          }`}
                        >
                          {h.text}
                        </a>
                      </li>
                    ))}
                  </ul>
                </>
              )}

              <div className="mt-8 border-t border-gray-200 pt-6">
                <p className="mb-3 font-display text-sm font-bold uppercase tracking-wider text-[#13181E]">
                  Share
                </p>
                <ShareLinks post={post} />
              </div>

              <Link
                href="/blog"
                className="mt-8 inline-flex items-center gap-2 text-sm font-semibold text-[#0D99FF] transition hover:gap-3"
              >
                <svg
                  viewBox="0 0 24 24"
                  className="h-4 w-4"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                >
                  <path d="M19 12H5m0 0 6-6m-6 6 6 6" />
                </svg>
                Back to all articles
              </Link>
            </div>
          </aside>
        </div>
      </div>

      {/* ── Related ──────────────────────────────────────────── */}
      {related.length > 0 && (
        <section className="border-t border-gray-100 bg-[#fafcfd]">
          <div className="mx-auto max-w-7xl px-4 py-14 sm:px-6 md:py-20">
            <div className="flex flex-wrap items-end justify-between gap-4">
              <h2 className="font-display text-2xl font-bold text-[#13181E] md:text-4xl">
                Keep reading
              </h2>
              <Link
                href="/blog"
                className="text-base font-semibold text-[#0D99FF] transition hover:underline"
              >
                View all articles →
              </Link>
            </div>

            <div className="mt-8 grid grid-cols-1 gap-x-6 gap-y-10 sm:grid-cols-2 md:mt-12 lg:grid-cols-3">
              {related.map((p) => (
                <RelatedCard key={p.slug} post={p} />
              ))}
            </div>
          </div>
        </section>
      )}
    </article>
  );
};

export default Singlepost;
