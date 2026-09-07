/** Presentation helpers shared by the blog listing and single post pages. */

import type { Post } from "@/data/cms-types";

export interface TocHeading {
  text: string;
  id: string;
  level: number;
}

export interface TocResult {
  html: string;
  headings: TocHeading[];
}

export function formatDate(iso: string | null | undefined, locale = "en-US"): string {
  if (!iso) return "";
  const d = new Date(iso);
  if (isNaN(d.getTime())) return "";
  return new Intl.DateTimeFormat(locale, {
    month: "long",
    day: "numeric",
    year: "numeric",
  }).format(d);
}

/** Decode the HTML entities that show up inside CMS-rendered markup. */
export function decodeEntities(str: string = ""): string {
  return String(str)
    .replace(/&#(\d+);/g, (_, d) => String.fromCharCode(Number(d)))
    .replace(/&#x([0-9a-f]+);/gi, (_, h) => String.fromCharCode(parseInt(h, 16)))
    .replace(/&nbsp;/gi, " ")
    .replace(/&hellip;/g, "…")
    .replace(/&mdash;/g, "—")
    .replace(/&ndash;/g, "–")
    .replace(/&rsquo;/g, "’")
    .replace(/&lsquo;/g, "‘")
    .replace(/&ldquo;/g, "“")
    .replace(/&rdquo;/g, "”")
    .replace(/&quot;/g, '"')
    .replace(/&apos;/g, "'")
    .replace(/&lt;/g, "<")
    .replace(/&gt;/g, ">")
    .replace(/&amp;/g, "&");
}

/** Strip tags, decode entities and collapse whitespace. */
export function stripHtml(html: string = ""): string {
  return decodeEntities(String(html).replace(/<[^>]*>/g, " "))
    .replace(/\s+/g, " ")
    .trim();
}

/** Rough reading time in minutes, based on ~200 words per minute. */
export function readingTime(html: string = ""): number {
  const words = stripHtml(html).split(" ").filter(Boolean).length;
  return Math.max(1, Math.round(words / 200));
}

export function postPath(post: Pick<Post, "slug">): string {
  return `/blog/${post.slug}`;
}

/**
 * Build a table of contents and inject matching ids in a single pass, so the
 * anchors can never drift out of sync with the headings they point at.
 *
 * Picks up <h2> and <h3> (the CMS emits `<h2 class="wp-block-heading">`), and
 * de-duplicates ids when two headings share the same text.
 */
export function buildToc(html: string = ""): TocResult {
  const used = new Map<string, number>();
  const headings: TocHeading[] = [];

  const out = String(html).replace(
    /<(h2|h3)([^>]*)>([\s\S]*?)<\/\1>/gi,
    (match, tag: string, attrs: string, inner: string) => {
      const text = stripHtml(inner);
      if (!text) return match;

      let id = slugify(text);
      const seen = used.get(id) || 0;
      used.set(id, seen + 1);
      if (seen) id = `${id}-${seen + 1}`;

      headings.push({ text, id, level: Number(tag[1]) });

      const cleanedAttrs = attrs.replace(/\s*id="[^"]*"/i, "");
      return `<${tag}${cleanedAttrs} id="${id}">${inner}</${tag}>`;
    }
  );

  return { html: out, headings };
}

export function slugify(text: string = ""): string {
  return String(text)
    .toLowerCase()
    .replace(/[^a-z0-9\s-]/g, "")
    .trim()
    .replace(/\s+/g, "-");
}
