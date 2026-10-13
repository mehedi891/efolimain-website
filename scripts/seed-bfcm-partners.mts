/**
 * One-time import of the BFCM 2026 partner deals + categories into MongoDB
 * (scripts/bfcm-seed-data.mts → bfcm_categories / bfcm_partners).
 *
 * Safe to re-run: it only INSERTS what's missing (matched by slug) and never
 * overwrites anything already edited in /admin. New rows are appended after
 * the current last position, in seed order.
 *
 * Usage (writes to the database in MONGODB_URI / MONGODB_DB):
 *   node --env-file=.env.local --experimental-strip-types scripts/seed-bfcm-partners.mts --dry-run
 *   node --env-file=.env.local --experimental-strip-types scripts/seed-bfcm-partners.mts
 */

import { MongoClient, type Collection } from "mongodb";
import type { SeedCategory, SeedPartner } from "./bfcm-seed-data.mjs";

const dryRun = process.argv.includes("--dry-run");

const uri = process.env.MONGODB_URI;
if (!uri) {
  console.error("MONGODB_URI is not set (pass --env-file=.env.local).");
  process.exit(1);
}
const dbName = process.env.MONGODB_DB || "efoli";

// Loaded dynamically: Node needs the .ts extension, which `tsc` won't accept in a static import.
const { SEED_CATEGORIES, SEED_PARTNERS } = (await import(new URL("./bfcm-seed-data.mts", import.meta.url).href)) as {
  SEED_CATEGORIES: SeedCategory[];
  SEED_PARTNERS: SeedPartner[];
};

const host = (() => {
  try {
    return new URL(uri.replace(/^mongodb(\+srv)?:/, "http:")).hostname;
  } catch {
    return "(unknown host)";
  }
})();
console.log(`Target: ${host} / database "${dbName}"${dryRun ? "  (DRY RUN — nothing will be written)" : ""}`);

async function insertMissing<T extends { slug: string }>(
  col: Collection,
  items: T[],
  label: string,
): Promise<void> {
  const existing = new Set((await col.find({}, { projection: { slug: 1 } }).toArray()).map((d) => d.slug as string));
  const missing = items.filter((i) => !existing.has(i.slug));
  const last = await col.find({}, { projection: { position: 1 } }).sort({ position: -1 }).limit(1).toArray();
  let position = last.length ? (last[0].position as number) + 1 : 0;
  const now = new Date();
  const docs = missing.map((i) => ({ ...i, position: position++, isActive: true, createdAt: now, updatedAt: now, updatedBy: "seed" }));
  console.log(`${label}: ${missing.length} to add, ${items.length - missing.length} already present (left untouched).`);
  for (const d of docs) console.log(`  + [${d.position}] ${d.slug}`);
  if (!dryRun && docs.length) await col.insertMany(docs);
}

const client = await new MongoClient(uri, { serverSelectionTimeoutMS: 10_000 }).connect();
try {
  const db = client.db(dbName);
  const categories = db.collection("bfcm_categories");
  const partners = db.collection("bfcm_partners");
  if (!dryRun) {
    await Promise.all([
      categories.createIndex({ slug: 1 }, { unique: true }),
      categories.createIndex({ position: 1 }),
      partners.createIndex({ slug: 1 }, { unique: true }),
      partners.createIndex({ position: 1 }),
    ]);
  }
  await insertMissing(categories, SEED_CATEGORIES, "Categories");
  await insertMissing(partners, SEED_PARTNERS, "Partners");
  console.log(dryRun ? "Dry run complete." : "Import complete. Manage them at /admin/bfcm/partners.");
} finally {
  await client.close();
}
process.exit(0);
