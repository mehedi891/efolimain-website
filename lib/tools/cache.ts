/**
 * Tiny per-instance TTL cache for tool results, keyed by `${tool}:${url}`.
 * Same rationale as the audit cache — protects repeat scans; durable = KV later.
 */

import type { ToolResult } from "./types";

const TTL_MS = 30 * 60 * 1000; // 30 min
const MAX_ENTRIES = 300;

const store = new Map<string, { result: ToolResult; expires: number }>();

export function getCached(key: string): ToolResult | null {
  const hit = store.get(key);
  if (!hit) return null;
  if (Date.now() > hit.expires) {
    store.delete(key);
    return null;
  }
  return hit.result;
}

export function setCached(key: string, result: ToolResult): void {
  if (store.size >= MAX_ENTRIES) {
    const oldest = store.keys().next().value;
    if (oldest) store.delete(oldest);
  }
  store.set(key, { result, expires: Date.now() + TTL_MS });
}
