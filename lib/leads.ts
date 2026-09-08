/**
 * Free-tools lead + usage store (MongoDB Atlas).
 *
 * Three collections, all best-effort (a DB hiccup never blocks a scan, email,
 * or on-page reveal — we log and move on):
 *
 *  • leads       — one doc per (email, storeUrl); that pair is unique. Holds the
 *                  visitor's name and a deduped `tools` array of everything that
 *                  email ran against that store. Written on UNLOCK (email given).
 *
 *  • scans       — append-only usage event, one per scan/button click, even when
 *                  no email is given: { tool, storeUrl, day, at }. The flexible
 *                  source of truth for per-day / per-store / per-tool analytics.
 *
 *  • daily_stats — per-day rollup keyed by day (YYYY-MM-DD, UTC):
 *                  { day, scans, byTool: { <slug>: n }, leads, updatedAt }.
 *                  Powers the future admin dashboard's headline numbers cheaply.
 *
 * The MongoClient is cached across invocations (Vercel Fluid Compute reuses the
 * module scope). If MONGODB_URI is unset, every function no-ops and returns
 * false so the tools keep working without a database.
 */

import { MongoClient, type Db } from "mongodb";

export interface LeadDoc {
  email: string;
  storeUrl: string;
  name?: string;
  tools: string[];
  createdAt: Date;
  updatedAt: Date;
}

export interface ScanDoc {
  tool: string;
  storeUrl: string;
  day: string;
  at: Date;
}

const DB_NAME = process.env.MONGODB_DB || "efoli";

// Cache the connection promise across hot invocations.
let clientPromise: Promise<MongoClient> | null = null;
let indexesReady = false;

function connect(): Promise<MongoClient> | null {
  const uri = process.env.MONGODB_URI;
  if (!uri) return null;
  if (!clientPromise) {
    // Fail fast: default serverSelectionTimeoutMS is 30s, which would hang a
    // whole request if Atlas is unreachable (e.g. Network Access not allowing
    // Vercel). 5s is plenty for a healthy cluster.
    clientPromise = new MongoClient(uri, {
      serverSelectionTimeoutMS: 5000,
      connectTimeoutMS: 5000,
    })
      .connect()
      .catch((err) => {
        // Reset so a later request can retry the connection.
        clientPromise = null;
        throw err;
      });
  }
  return clientPromise;
}

async function getDb(): Promise<Db | null> {
  const cp = connect();
  if (!cp) return null;
  const db = (await cp).db(DB_NAME);
  if (!indexesReady) {
    await Promise.all([
      // Enforces the (email, storeUrl) uniqueness rule.
      db.collection("leads").createIndex({ email: 1, storeUrl: 1 }, { unique: true }),
      // Analytics access paths.
      db.collection("scans").createIndex({ day: 1 }),
      db.collection("scans").createIndex({ storeUrl: 1 }),
      db.collection("scans").createIndex({ tool: 1 }),
    ]);
    indexesReady = true;
  }
  return db;
}

/** UTC calendar day, e.g. "2026-09-08". Sorts chronologically as a string. */
export function dayKey(d: Date = new Date()): string {
  return d.toISOString().slice(0, 10);
}

/** Normalize a store URL/host to a stable key: lowercase host, no protocol/www/path. */
export function storeKey(input: string): string {
  const raw = input.trim().toLowerCase();
  const host = raw.replace(/^https?:\/\//, "").replace(/^www\./, "").split(/[/?#]/)[0];
  return host.replace(/\/+$/, "");
}

async function bumpDaily(db: Db, inc: Record<string, number>, now: Date): Promise<void> {
  const day = dayKey(now);
  await db.collection("daily_stats").updateOne(
    { _id: day as unknown as object },
    { $setOnInsert: { day, createdAt: now }, $inc: inc, $set: { updatedAt: now } },
    { upsert: true },
  );
}

/**
 * Record a single tool use (scan/button click) — no email required. Writes an
 * append-only scan event and bumps the day's rollup. Returns true when
 * persisted, false when skipped/failed (never throws).
 */
export async function recordScan({ tool, storeUrl }: { tool: string; storeUrl: string }): Promise<boolean> {
  const key = storeKey(storeUrl);
  if (!tool || !key) return false;
  try {
    const db = await getDb();
    if (!db) return false;
    const now = new Date();
    await db.collection<ScanDoc>("scans").insertOne({ tool, storeUrl: key, day: dayKey(now), at: now });
    await bumpDaily(db, { scans: 1, [`byTool.${tool}`]: 1 }, now);
    return true;
  } catch (err) {
    console.error("[analytics] recordScan failed:", err);
    return false;
  }
}

export interface SaveLeadInput {
  email: string;
  storeUrl: string;
  /** Tool slug, e.g. "shopify-store-audit". Appended to the store's tools array. */
  tool: string;
  name?: string;
}

/**
 * Upsert a lead: create the (email, storeUrl) doc if new, otherwise add this
 * tool to its list. A genuinely new lead also increments the day's `leads`
 * rollup. Returns true when persisted, false when skipped/failed (never throws).
 */
export async function saveLead({ email, storeUrl, tool, name }: SaveLeadInput): Promise<boolean> {
  const cleanEmail = email.trim().toLowerCase();
  const key = storeKey(storeUrl);
  if (!cleanEmail || !key || !tool) return false;

  try {
    const db = await getDb();
    if (!db) return false;
    const now = new Date();
    const res = await db.collection<LeadDoc>("leads").updateOne(
      { email: cleanEmail, storeUrl: key },
      {
        $setOnInsert: { email: cleanEmail, storeUrl: key, createdAt: now },
        $addToSet: { tools: tool },
        $set: { updatedAt: now, ...(name?.trim() ? { name: name.trim() } : {}) },
      },
      { upsert: true },
    );
    // Only count a new lead the first time this (email, store) pair appears.
    if (res.upsertedCount > 0) await bumpDaily(db, { leads: 1 }, now);
    return true;
  } catch (err) {
    console.error("[leads] save failed:", err);
    return false;
  }
}
