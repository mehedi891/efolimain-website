/**
 * Shared server-side fetch helpers for the lightweight /free-tools (SEO & AI
 * visibility). Never throw — return `ok:false` so tools degrade gracefully.
 */

const FETCH_TIMEOUT_MS = 15_000;
const MAX_BYTES = 600_000;
const UA = "eFoli-Tools/1.0 (+https://efoli.com)";

export interface FetchedPage {
  url: string;
  ok: boolean;
  status: number;
  finalUrl: string;
  isHttps: boolean;
  html: string;
  headers: Record<string, string>;
}

export async function fetchPage(url: string): Promise<FetchedPage> {
  const empty: FetchedPage = {
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
    return {
      url,
      ok: res.ok,
      status: res.status,
      finalUrl: res.url || url,
      isHttps: (res.url || url).startsWith("https:"),
      html: (await res.text()).slice(0, MAX_BYTES),
      headers,
    };
  } catch {
    return empty;
  } finally {
    clearTimeout(timer);
  }
}

export async function fetchText(url: string): Promise<string | null> {
  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), FETCH_TIMEOUT_MS);
  try {
    const res = await fetch(url, {
      signal: controller.signal,
      cache: "no-store",
      headers: { "user-agent": UA },
    });
    if (!res.ok) return null;
    return (await res.text()).slice(0, MAX_BYTES);
  } catch {
    return null;
  } finally {
    clearTimeout(timer);
  }
}

/** Normalize a user URL to an absolute https URL. Throws with a friendly message. */
export function normalizeUrl(input: string): string {
  const trimmed = input.trim();
  if (!trimmed) throw new Error("Please enter a URL.");
  const withProto = /^https?:\/\//i.test(trimmed) ? trimmed : `https://${trimmed}`;
  let u: URL;
  try {
    u = new URL(withProto);
  } catch {
    throw new Error("That doesn't look like a valid URL.");
  }
  if (u.protocol !== "http:" && u.protocol !== "https:") {
    throw new Error("Only http(s) URLs are supported.");
  }
  u.protocol = "https:";
  u.hash = "";
  return u.toString();
}

export function host(url: string): string {
  return url.replace(/^https?:\/\//, "").replace(/\/$/, "");
}
