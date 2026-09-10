/**
 * SEO & Discoverability checks (Tier A — measured from HTML + robots/sitemap).
 * Complements the Lighthouse SEO score already added in Phase 1.
 */

import type { Check, Status } from "./types";
import type { SiteScan } from "./fetchHtml";
import {
  countTag,
  getJsonLdTypes,
  getMetaName,
  getMetaProperty,
  getTitle,
  hasCanonical,
} from "./html";

const REF = {
  title: "https://developers.google.com/search/docs/appearance/title-link",
  meta: "https://developers.google.com/search/docs/appearance/snippet",
  h1: "https://www.shopify.com/blog/ecommerce-seo-audit",
  canonical: "https://developers.google.com/search/docs/crawling-indexing/canonicalization",
  og: "https://ogp.me/",
  schema: "https://developers.google.com/search/docs/appearance/structured-data/product",
  robots: "https://developers.google.com/search/docs/crawling-indexing/robots/intro",
  sitemap: "https://developers.google.com/search/docs/crawling-indexing/sitemaps/overview",
} as const;

/** Collapse whitespace and cap length — for showing the current found text. */
function trunc(s: string, n = 100): string {
  const t = s.replace(/\s+/g, " ").trim();
  return t.length > n ? `${t.slice(0, n - 1)}…` : t;
}

/** Does robots.txt block major AI crawlers with a blanket disallow? */
function blocksAiCrawlers(robots: string): boolean {
  const bots = ["gptbot", "claudebot", "ccbot", "google-extended", "perplexitybot"];
  const blocks = robots.toLowerCase().split(/\n\s*\n/);
  return blocks.some((b) => {
    const isBotBlock = bots.some((bot) => b.includes(`user-agent: ${bot}`));
    return isBotBlock && /disallow:\s*\/\s*$/im.test(b);
  });
}

/**
 * @param contentReliable false when the store renders content client-side (server
 * HTML has no <title>), so HTML-derived checks return `na` rather than false fails.
 */
export function seoChecks(scan: SiteScan, contentReliable: boolean): Check[] {
  const html = scan.home.html;
  const cr = contentReliable;
  const checks: Check[] = [];

  // Title
  const title = getTitle(html);
  const titleLen = title?.length ?? 0;
  let titleStatus: Status = "fail";
  if (title) titleStatus = titleLen >= 10 && titleLen <= 60 ? "pass" : "warn";
  checks.push({
    id: "seo-title",
    label: "Page title present and well-sized",
    status: cr ? titleStatus : "na",
    tier: "measured",
    value: title ? `${titleLen} chars` : "missing",
    current: cr ? (title ? `Current: “${trunc(title)}”` : "No <title> tag found") : undefined,
    impact: "M",
    effort: "L",
    fix: "Write a unique 10–60 character title with your brand and primary keyword.",
    ref: REF.title,
  });

  // Meta description
  const desc = getMetaName(html, "description");
  const descLen = desc?.length ?? 0;
  let descStatus: Status = "fail";
  if (desc) descStatus = descLen >= 50 && descLen <= 160 ? "pass" : "warn";
  checks.push({
    id: "seo-meta-description",
    label: "Meta description present and well-sized",
    status: cr ? descStatus : "na",
    tier: "measured",
    value: desc ? `${descLen} chars` : "missing",
    current: cr ? (desc ? `Current: “${trunc(desc)}”` : "No meta description found") : undefined,
    impact: "M",
    effort: "L",
    fix: "Add a unique 50–160 character meta description that earns the click.",
    ref: REF.meta,
  });

  // Single H1
  const h1s = countTag(html, "h1");
  checks.push({
    id: "seo-h1",
    label: "Exactly one H1 heading",
    status: !cr ? "na" : h1s === 1 ? "pass" : "warn",
    tier: "measured",
    value: `${h1s} found`,
    impact: "L",
    effort: "L",
    fix: "Use a single, descriptive H1 per page for clear document structure.",
    ref: REF.h1,
  });

  // Canonical
  checks.push({
    id: "seo-canonical",
    label: "Canonical tag present",
    status: !cr ? "na" : hasCanonical(html) ? "pass" : "warn",
    tier: "measured",
    impact: "L",
    effort: "L",
    fix: "Add a rel=canonical link to prevent duplicate-content dilution.",
    ref: REF.canonical,
  });

  // Open Graph
  const ogTitle = getMetaProperty(html, "og:title");
  const ogImage = getMetaProperty(html, "og:image");
  let ogStatus: Status = "warn";
  if (ogTitle && ogImage) ogStatus = "pass";
  checks.push({
    id: "seo-og",
    label: "Open Graph social tags",
    status: !cr ? "na" : ogStatus,
    tier: "measured",
    value: ogTitle && ogImage ? "title + image" : ogTitle || ogImage ? "partial" : "missing",
    impact: "L",
    effort: "L",
    fix: "Add og:title, og:description, and og:image so shared links look right.",
    ref: REF.og,
  });

  // Structured data (Product on the product page; Organization/Website on home)
  const homeTypes = getJsonLdTypes(html);
  const prodTypes = scan.product?.ok ? getJsonLdTypes(scan.product.html) : [];
  const allTypes = new Set([...homeTypes, ...prodTypes]);
  const hasProduct = prodTypes.includes("Product");
  const hasOrg = homeTypes.includes("Organization") || homeTypes.includes("WebSite");
  let sdStatus: Status = "fail";
  if (hasProduct && hasOrg) sdStatus = "pass";
  else if (hasProduct || hasOrg || allTypes.size > 0) sdStatus = "warn";
  checks.push({
    id: "seo-structured-data",
    label: "Structured data (Product / Organization JSON-LD)",
    status: !cr ? "na" : sdStatus,
    tier: "measured",
    value: allTypes.size ? [...allTypes].slice(0, 4).join(", ") : "none found",
    impact: "M",
    effort: "M",
    fix: "Add valid Product and Organization JSON-LD for rich results and AI-search quotability.",
    ref: REF.schema,
  });

  // robots.txt
  const robots = scan.robotsTxt;
  let robotsStatus: Status;
  let robotsValue: string;
  if (robots == null) {
    robotsStatus = "warn";
    robotsValue = "not found";
  } else if (blocksAiCrawlers(robots)) {
    robotsStatus = "warn";
    robotsValue = "blocks AI crawlers";
  } else {
    robotsStatus = "pass";
    robotsValue = "present";
  }
  checks.push({
    id: "seo-robots",
    label: "robots.txt present and not blocking AI crawlers",
    status: robotsStatus,
    tier: "measured",
    value: robotsValue,
    impact: "M",
    effort: "L",
    fix: "Keep robots.txt available and don't blanket-block GPTBot/ClaudeBot if you want AI-search visibility.",
    ref: REF.robots,
  });

  // sitemap.xml
  checks.push({
    id: "seo-sitemap",
    label: "sitemap.xml present",
    status: scan.sitemapOk ? "pass" : "warn",
    tier: "measured",
    value: scan.sitemapOk ? "present" : "not found",
    impact: "L",
    effort: "L",
    fix: "Ensure sitemap.xml is reachable so search engines can discover all pages.",
    ref: REF.sitemap,
  });

  return checks;
}
