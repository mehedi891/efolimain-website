/**
 * Tiny in-memory TTL cache for audit results, keyed by normalized URL.
 *
 * Protects the PageSpeed quota and speeds up repeat scans of the same store.
 * This is per-instance (serverless functions are ephemeral), so it absorbs
 * bursts and warm-instance repeats — durable cross-instance caching would move
 * to a marketplace KV/Redis later (load the `marketplace` skill before picking
 * a provider).
 */

import type { Report } from "./types";

const TTL_MS = 60 * 60 * 1000; // 1 hour
const MAX_ENTRIES = 200;

interface Entry {
  report: Report;
  expires: number;
}

const store = new Map<string, Entry>();

export function getCachedReport(url: string): Report | null {
  const hit = store.get(url);
  if (!hit) return null;
  if (Date.now() > hit.expires) {
    store.delete(url);
    return null;
  }
  return hit.report;
}

export function setCachedReport(url: string, report: Report): void {
  // Simple size cap: drop the oldest entry when full.
  if (store.size >= MAX_ENTRIES) {
    const oldest = store.keys().next().value;
    if (oldest) store.delete(oldest);
  }
  store.set(url, { report, expires: Date.now() + TTL_MS });
}
