/**
 * Shared eFoli CMS client: base URL, site slug, URL builder and JSON fetch.
 * Every CMS data module (data/blogPosts.ts, data/landingPages.ts) talks to the
 * CMS through these helpers.
 *
 * Config (server-only env vars, see .env.example):
 *   CMS_API_URL   CMS host, `/api` or `/api/public` form (all resolve the same)
 *   CMS_SITE      this site's slug in the CMS (e.g. "efoli")
 */

/**
 * All CMS storefront endpoints live under `/api/public`. Accept CMS_API_URL in
 * any of these forms and always resolve to the public API root, so a bare
 * host, `/api` or the full `/api/public` all work and can't silently 404:
 *   https://cms.efoli.com               → https://cms.efoli.com/api/public
 *   https://cms.efoli.com/api           → https://cms.efoli.com/api/public
 *   https://cms.efoli.com/api/public/   → https://cms.efoli.com/api/public
 */
function resolvePublicApiBase(raw: string | undefined): string {
  const base = (raw || "https://cms.efoli.com").trim().replace(/\/+$/, "");
  if (/\/api\/public$/.test(base)) return base;
  if (/\/api$/.test(base)) return `${base}/public`;
  return `${base}/api/public`;
}

export const API_BASE = resolvePublicApiBase(process.env.CMS_API_URL);
export const SITE = process.env.CMS_SITE || "efoli";

type QueryParams = Record<string, string | number | undefined | null>;

/** `${API_BASE}${path}?site=…&…` — empty params are dropped. */
export function buildUrl(path: string, params: QueryParams = {}): string {
  const url = new URL(`${API_BASE}${path}`);
  url.searchParams.set("site", SITE);
  for (const [key, value] of Object.entries(params)) {
    if (value !== undefined && value !== null && value !== "") {
      url.searchParams.set(key, String(value));
    }
  }
  return url.toString();
}

export interface FetchOptions {
  headers?: Record<string, string>;
  cache?: RequestCache;
  /** Next data-cache options (revalidate / tags). Ignored with `cache: "no-store"`. */
  next?: NextFetchRequestConfig;
}

/** Error carrying the upstream HTTP status so callers can special-case 404. */
export class CmsError extends Error {
  status?: number;
  constructor(message: string, status?: number) {
    super(message);
    this.status = status;
  }
}

export async function fetchJson<T>(
  url: string,
  { headers = {}, cache, next }: FetchOptions = {}
): Promise<T> {
  const res = await fetch(url, {
    headers: { Accept: "application/json", ...headers },
    ...(cache ? { cache } : {}),
    ...(next ? { next } : {}),
  });
  if (!res.ok) {
    throw new CmsError(`CMS request failed (${res.status}) for ${url}`, res.status);
  }
  return res.json() as Promise<T>;
}
