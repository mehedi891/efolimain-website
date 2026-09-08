/**
 * Small, dependency-free HTML parsing helpers.
 *
 * The audit only needs presence/absence + a few attribute values, so targeted
 * regex/string scanning is sufficient and avoids a heavy DOM dependency. These
 * are deliberately forgiving: they never throw, and return null/false/[] when a
 * pattern isn't found.
 */

/** First <title> text, trimmed. */
export function getTitle(html: string): string | null {
  const m = html.match(/<title[^>]*>([\s\S]*?)<\/title>/i);
  return m ? decodeEntities(m[1].trim()) : null;
}

/** <meta name="..." content="..."> (case-insensitive, attribute order tolerant). */
export function getMetaName(html: string, name: string): string | null {
  const re = new RegExp(
    `<meta[^>]*\\bname=["']${escapeRe(name)}["'][^>]*>`,
    "i",
  );
  const tag = html.match(re)?.[0];
  return tag ? getAttr(tag, "content") : null;
}

/** <meta property="og:..." content="..."> */
export function getMetaProperty(html: string, prop: string): string | null {
  const re = new RegExp(
    `<meta[^>]*\\bproperty=["']${escapeRe(prop)}["'][^>]*>`,
    "i",
  );
  const tag = html.match(re)?.[0];
  return tag ? getAttr(tag, "content") : null;
}

export function hasCanonical(html: string): boolean {
  return /<link[^>]*\brel=["']canonical["'][^>]*>/i.test(html);
}

/** href of the first <link rel="..."> matching `rel` (rel can be multi-valued). */
export function getLinkHref(html: string, rel: string): string | null {
  const re = new RegExp(`<link[^>]*\\brel=["'][^"']*\\b${escapeRe(rel)}\\b[^"']*["'][^>]*>`, "i");
  const tag = html.match(re)?.[0];
  return tag ? getAttr(tag, "href") : null;
}

/** Parsed JSON-LD objects (each <script type="application/ld+json"> block). */
export function getJsonLdObjects(html: string): unknown[] {
  const out: unknown[] = [];
  const re = /<script[^>]*type=["']application\/ld\+json["'][^>]*>([\s\S]*?)<\/script>/gi;
  let m: RegExpExecArray | null;
  while ((m = re.exec(html)) !== null) {
    try {
      out.push(JSON.parse(m[1].trim()));
    } catch {
      /* skip malformed */
    }
  }
  return out;
}

/** Count occurrences of an opening tag, e.g. countTag(html, "h1"). */
export function countTag(html: string, tag: string): number {
  const re = new RegExp(`<${escapeRe(tag)}(\\s|>)`, "gi");
  return (html.match(re) ?? []).length;
}

/** All @type values found across JSON-LD blocks (handles arrays and @graph). */
export function getJsonLdTypes(html: string): string[] {
  const types = new Set<string>();
  const re = /<script[^>]*type=["']application\/ld\+json["'][^>]*>([\s\S]*?)<\/script>/gi;
  let m: RegExpExecArray | null;
  while ((m = re.exec(html)) !== null) {
    try {
      const json = JSON.parse(m[1].trim());
      collectTypes(json, types);
    } catch {
      // Ignore malformed JSON-LD blocks.
    }
  }
  return [...types];
}

function collectTypes(node: unknown, out: Set<string>): void {
  if (Array.isArray(node)) {
    for (const n of node) collectTypes(n, out);
    return;
  }
  if (node && typeof node === "object") {
    const obj = node as Record<string, unknown>;
    const t = obj["@type"];
    if (typeof t === "string") out.add(t);
    else if (Array.isArray(t)) for (const x of t) if (typeof x === "string") out.add(x);
    if (Array.isArray(obj["@graph"])) collectTypes(obj["@graph"], out);
  }
}

/** Hostnames of every <script src="..."> on the page. */
export function scriptSrcHosts(html: string, baseUrl: string): string[] {
  const hosts: string[] = [];
  const re = /<script[^>]*\bsrc=["']([^"']+)["']/gi;
  let m: RegExpExecArray | null;
  while ((m = re.exec(html)) !== null) {
    try {
      hosts.push(new URL(m[1], baseUrl).hostname);
    } catch {
      /* skip */
    }
  }
  return hosts;
}

/** Relative paths matching a prefix, e.g. hrefsMatching(html, "/products/"). */
export function hrefsMatching(html: string, prefix: string): string[] {
  const out = new Set<string>();
  const re = /\bhref=["']([^"'#?]+)["']/gi;
  let m: RegExpExecArray | null;
  while ((m = re.exec(html)) !== null) {
    const href = m[1];
    if (href.startsWith(prefix)) out.add(href);
  }
  return [...out];
}

/** Case-insensitive "does the HTML contain any of these substrings". */
export function containsAny(html: string, needles: string[]): boolean {
  const h = html.toLowerCase();
  return needles.some((n) => h.includes(n.toLowerCase()));
}

/**
 * Detect a bot-wall / security interstitial (Vercel/Cloudflare "checking your
 * browser", etc.) served instead of the real storefront. Such pages can return
 * HTTP 200 with a <title>, so we must recognize them explicitly and not audit
 * the checkpoint as if it were the store.
 */
export function looksBlocked(html: string): boolean {
  if (!html) return false;
  return containsAny(html, [
    "vercel security checkpoint",
    "we're verifying your browser",
    "checking your browser before accessing",
    "just a moment...",
    "cf-browser-verification",
    "challenge-platform",
    "__cf_chl",
    "attention required! | cloudflare",
    "ddos protection by",
    "enable javascript and cookies to continue",
    "please turn javascript on and reload the page",
  ]);
}

/** Count how many http:// (non-https) resource URLs appear — mixed-content signal. */
export function insecureResourceCount(html: string, isHttpsPage: boolean): number {
  if (!isHttpsPage) return 0;
  const re = /\b(?:src|href)=["']http:\/\/[^"']+["']/gi;
  return (html.match(re) ?? []).length;
}

function getAttr(tag: string, attr: string): string | null {
  const m = tag.match(new RegExp(`\\b${escapeRe(attr)}=["']([^"']*)["']`, "i"));
  return m ? decodeEntities(m[1]) : null;
}

function escapeRe(s: string): string {
  return s.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
}

function decodeEntities(s: string): string {
  return s
    .replace(/&amp;/g, "&")
    .replace(/&lt;/g, "<")
    .replace(/&gt;/g, ">")
    .replace(/&quot;/g, '"')
    .replace(/&#39;/g, "'");
}
