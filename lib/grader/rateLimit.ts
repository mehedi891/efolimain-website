/**
 * In-memory fixed-window rate limiter, keyed by client IP.
 *
 * Per-instance (serverless), so it adds friction against bursts/abuse rather
 * than being a hard global guarantee — durable limiting would move to KV later.
 */

interface Window {
  count: number;
  resetAt: number;
}

const windows = new Map<string, Window>();

/** Extract a best-effort client IP from request headers. */
export function clientIp(request: Request): string {
  const xff = request.headers.get("x-forwarded-for");
  if (xff) return xff.split(",")[0].trim();
  return request.headers.get("x-real-ip") ?? "unknown";
}

/**
 * Returns true if the caller is within the limit (and records the hit).
 * Default: 12 requests per 10 minutes per key.
 */
export function rateLimit(key: string, limit = 12, windowMs = 10 * 60 * 1000): boolean {
  const now = Date.now();
  const w = windows.get(key);
  if (!w || now > w.resetAt) {
    windows.set(key, { count: 1, resetAt: now + windowMs });
    return true;
  }
  if (w.count >= limit) return false;
  w.count += 1;
  return true;
}
