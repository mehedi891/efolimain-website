/**
 * Sanitize + trim CMS post HTML before it's rendered with
 * dangerouslySetInnerHTML (components/blog/Singlepost.tsx).
 *
 * SERVER-ONLY: import it from data/blogPosts.ts, never from a client
 * component, so sanitize-html (and postcss) stay out of the browser bundle.
 *
 * Sanitize — parser-based allowlist (sanitize-html):
 * - Every <script> is removed, including the ones inside custom HTML blocks
 *   (<div data-html-block>). What those scripts did (scroll-reveal + Copy
 *   buttons) is provided by first-party code: components/blog/cmsBlocks.ts.
 *   JSON-LD is the exception: it's parsed and re-serialized, never run.
 * - No event-handler attributes (on*), no javascript:/data: links, no forms,
 *   objects, embeds, base/meta/link tags. Iframes only from YouTube/Vimeo.
 * - <style> is kept (custom blocks are styled by it), but every "<" in it is
 *   CSS-escaped, so its text can never become markup — not even inside <svg>,
 *   where browsers parse <style> contents as HTML.
 *
 * Trim — comments and redundant whitespace are removed from <style> blocks
 * (strings and escapes are kept byte-for-byte). Text between tags is left as
 * is: some block CSS uses `white-space: pre`, where whitespace is visible.
 */
import sanitizeHtml from "sanitize-html";

const SVG_TAGS = [
  "svg", "g", "path", "circle", "ellipse", "line", "polyline", "polygon", "rect",
  "defs", "lineargradient", "radialgradient", "stop", "title",
];

const SVG_ATTRS = [
  "viewbox", "xmlns", "width", "height", "fill", "fill-rule", "fill-opacity", "clip-rule",
  "stroke", "stroke-width", "stroke-linecap", "stroke-linejoin", "stroke-opacity",
  "stroke-dasharray", "d", "cx", "cy", "r", "rx", "ry", "x", "y", "x1", "x2", "y1", "y2",
  "points", "transform", "opacity", "focusable", "preserveaspectratio", "offset",
  "stop-color", "stop-opacity", "gradientunits", "gradienttransform",
];

const OPTIONS: sanitizeHtml.IOptions = {
  allowedTags: [
    "a", "abbr", "article", "aside", "b", "blockquote", "br", "button", "caption", "cite",
    "code", "col", "colgroup", "dd", "del", "details", "div", "dl", "dt", "em", "figcaption",
    "figure", "footer", "h1", "h2", "h3", "h4", "h5", "h6", "header", "hr", "i", "iframe",
    "img", "ins", "kbd", "li", "mark", "ol", "p", "picture", "pre", "q", "s", "section",
    "small", "source", "span", "strong", "style", "sub", "summary", "sup", "table", "tbody",
    "td", "tfoot", "th", "thead", "time", "tr", "u", "ul",
    ...SVG_TAGS,
  ],
  allowedAttributes: {
    "*": ["class", "id", "style", "title", "lang", "dir", "role", "hidden", "aria-*", "data-*"],
    a: ["href", "target", "rel"],
    img: ["src", "srcset", "sizes", "alt", "width", "height", "loading", "decoding"],
    source: ["srcset", "sizes", "media", "type", "width", "height"],
    iframe: [
      "src", "width", "height", "title", "frameborder", "allow", "allowfullscreen",
      "referrerpolicy", "loading",
    ],
    td: ["colspan", "rowspan", "headers"],
    th: ["colspan", "rowspan", "headers", "scope"],
    col: ["span", "width"],
    colgroup: ["span", "width"],
    ol: ["start", "reversed", "type"],
    li: ["value"],
    button: ["type"],
    details: ["open"],
    time: ["datetime"],
    blockquote: ["cite"],
    q: ["cite"],
    del: ["cite", "datetime"],
    ins: ["cite", "datetime"],
    ...Object.fromEntries(SVG_TAGS.map((tag) => [tag, SVG_ATTRS])),
  },
  allowedSchemes: ["http", "https", "mailto", "tel"],
  allowedSchemesByTag: { img: ["http", "https", "data"], iframe: ["https"] },
  allowedIframeHostnames: [
    "www.youtube.com", "youtube.com", "www.youtube-nocookie.com", "player.vimeo.com",
  ],
  // An iframe whose src was rejected would otherwise stay as an empty box.
  exclusiveFilter: (frame) => frame.tag === "iframe" && !frame.attribs.src,
  // <style> is otherwise flagged as vulnerable; its text is neutralized below.
  allowVulnerableTags: true,
};

/** CSS tokens copied verbatim: strings, escapes. Comments are matched to drop them. */
const CSS_VERBATIM =
  /"(?:\\[\s\S]|[^"\\\n])*"|'(?:\\[\s\S]|[^'\\\n])*'|\\[0-9a-fA-F]{1,6}[ \t\n\r\f]?|\\[\s\S]|\/\*[\s\S]*?(?:\*\/|$)/g;

function squeezeCss(code: string): string {
  return code.replace(/\s+/g, " ").replace(/\s*([{};])\s*/g, "$1");
}

/**
 * Drop comments and redundant whitespace from a stylesheet, keeping strings and
 * escapes untouched. CSS with an unterminated string is returned unchanged
 * (collapsing its newline would change where that string ends).
 */
export function trimCss(css: string): string {
  // Pass 1: comments → a space (a comment separates tokens, like whitespace).
  const noComments = css.replace(CSS_VERBATIM, (token) => (token.startsWith("/*") ? " " : token));
  // Pass 2: squeeze the code between verbatim tokens.
  let out = "";
  let last = 0;
  for (const match of noComments.matchAll(CSS_VERBATIM)) {
    const code = noComments.slice(last, match.index);
    if (/["']/.test(code)) return css;
    out += squeezeCss(code) + match[0];
    last = match.index + match[0].length;
  }
  const tail = noComments.slice(last);
  if (/["']/.test(tail)) return css;
  return (out + squeezeCss(tail)).trim();
}

/** "<" → CSS escape, so stylesheet text can't open a tag in any parsing mode. */
function neutralizeCss(css: string): string {
  return css.replace(/</g, "\\3c ");
}

const JSON_LD =
  /<script\b[^>]*\btype\s*=\s*["']?application\/ld\+json["']?[^>]*>([\s\S]*?)<\/script\s*>/gi;

/** JSON-LD blocks, re-serialized from parsed JSON (invalid ones are dropped). */
function safeJsonLd(html: string): string {
  let out = "";
  for (const [, json] of html.matchAll(JSON_LD)) {
    try {
      const data: unknown = JSON.parse(json);
      out += `<script type="application/ld+json">${JSON.stringify(data).replace(/</g, "\\u003c")}</script>`;
    } catch {
      // Not valid JSON: drop it.
    }
  }
  return out;
}

export function sanitizeCmsHtml(html: string): string {
  if (!html) return "";
  const clean = sanitizeHtml(html, OPTIONS);
  // sanitize-html re-emits attributes escaped and drops comments, so in its
  // output this regex sees exactly the real <style> elements and their text.
  const styled = clean.replace(
    /(<style\b[^>]*>)([\s\S]*?)(<\/style>)/gi,
    (_, open: string, css: string, close: string) => open + neutralizeCss(trimCss(css)) + close
  );
  return styled + safeJsonLd(html);
}
