/**
 * Server-side storefront fetch + representative-page discovery.
 *
 * We audit main page TYPES, not the whole site (Shopify is template-based, so one
 * representative page per template reflects the store — see research §4B). Here we
 * fetch the homepage and one product page, plus robots.txt / sitemap.xml.
 *
 * Never throws — failures come back as `ok: false` so the report degrades to
 * partial rather than erroring.
 */

import { hrefsMatching } from "./html";

const FETCH_TIMEOUT_MS = 15_000;
const MAX_HTML_BYTES = 600_000; // cap parsing cost on huge pages
const UA = "eFoli-StoreAudit/1.0 (+https://efoli.com)";

export interface PageData {
  url: string;
  ok: boolean;
  status: number;
  finalUrl: string;
  isHttps: boolean;
  html: string;
  headers: Record<string, string>;
}

export interface SiteScan {
  origin: string;
  home: PageData;
  product: PageData | null;
  collection: PageData | null;
  cart: PageData | null;
  robotsTxt: string | null;
  sitemapOk: boolean;
}

async function fetchPage(url: string): Promise<PageData> {
  const empty: PageData = {
    url,
    ok: false,
    status: 0,
    finalUrl: url,
    isHttps: url.startsWith("https:"),
    html: "",
    headers: {},
  };
  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), FETCH_TIMEOUT_MS);
  try {
    const res = await fetch(url, {
      signal: controller.signal,
      redirect: "follow",
      cache: "no-store",
      headers: { "user-agent": UA, accept: "text/html,*/*" },
    });
    const headers: Record<string, string> = {};
    res.headers.forEach((v, k) => (headers[k] = v));
    const raw = await res.text();
    return {
      url,
      ok: res.ok,
      status: res.status,
      finalUrl: res.url || url,
      isHttps: (res.url || url).startsWith("https:"),
      html: raw.slice(0, MAX_HTML_BYTES),
      headers,
    };
  } catch {
    return empty;
  } finally {
    clearTimeout(timer);
  }
}

async function fetchText(url: string): Promise<string | null> {
  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), FETCH_TIMEOUT_MS);
  try {
    const res = await fetch(url, {
      signal: controller.signal,
      cache: "no-store",
      headers: { "user-agent": UA },
    });
    if (!res.ok) return null;
    return (await res.text()).slice(0, MAX_HTML_BYTES);
  } catch {
    return null;
  } finally {
    clearTimeout(timer);
  }
}

/** First href on the homepage matching a prefix, resolved to an absolute URL. */
function firstLink(origin: string, html: string, prefix: string, exclude?: string): string | null {
  const path = hrefsMatching(html, prefix).find((p) => !exclude || !p.startsWith(exclude));
  return path ? new URL(path, origin).toString() : null;
}

/** Find a representative product page from the homepage, then /collections/all. */
async function discoverProduct(origin: string, homeHtml: string): Promise<PageData | null> {
  let url = firstLink(origin, homeHtml, "/products/");
  if (!url) {
    const all = await fetchPage(`${origin}/collections/all`);
    if (all.ok) url = firstLink(origin, all.html, "/products/");
  }
  return url ? fetchPage(url) : null;
}

/** Find a representative collection page (skip /collections/all — not a real category). */
async function discoverCollection(origin: string, homeHtml: string): Promise<PageData | null> {
  const url =
    firstLink(origin, homeHtml, "/collections/", "/collections/all") ||
    `${origin}/collections/all`;
  const page = await fetchPage(url);
  return page.ok ? page : null;
}

export async function scanSite(homeUrl: string): Promise<SiteScan> {
  const origin = new URL(homeUrl).origin;
  const home = await fetchPage(homeUrl);

  const [product, collection, cart, robotsTxt, sitemap] = await Promise.all([
    home.ok ? discoverProduct(origin, home.html) : Promise.resolve(null),
    home.ok ? discoverCollection(origin, home.html) : Promise.resolve(null),
    fetchPage(`${origin}/cart`).then((p) => (p.ok ? p : null)),
    fetchText(`${origin}/robots.txt`),
    fetchPage(`${origin}/sitemap.xml`),
  ]);

  return {
    origin,
    home,
    product,
    collection,
    cart,
    robotsTxt,
    sitemapOk: sitemap.ok && /<(urlset|sitemapindex)/i.test(sitemap.html),
  };
}
