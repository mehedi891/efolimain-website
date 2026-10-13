/**
 * BFCM partner deals + categories (MongoDB). Server-only — reached from the
 * /bfcm-offers page (read) and the admin Server Actions (write).
 *
 *  • bfcm_categories — { slug (unique, immutable), label, color, position, isActive }
 *  • bfcm_partners   — one doc per deal card; `category` holds a category slug.
 *
 * Every write re-validates through lib/bfcm/validate.ts (same rules as the
 * admin form). Order is an integer `position` per collection, rewritten 0..n-1
 * on each drag-and-drop save.
 */

import { ObjectId, type Collection, type Document, type Filter } from "mongodb";
import { getDb } from "@/lib/leads";
import { isExpired, slugify, toPublicPartner } from "./format";
import type { BfcmCategory, BfcmPartner, PartnerInput, PublicCategory, PublicPartner } from "./types";
import { parseCategoryInput, parsePartnerInput, type FieldErrors } from "./validate";

interface PartnerDoc extends PartnerInput {
  _id: ObjectId;
  slug: string;
  position: number;
  createdAt: Date;
  updatedAt: Date;
  updatedBy?: string;
}

interface CategoryDoc {
  _id: ObjectId;
  slug: string;
  label: string;
  color: string;
  position: number;
  isActive: boolean;
  createdAt: Date;
  updatedAt: Date;
}

export type Result = { ok: true; id?: string } | { ok: false; error?: string; errors?: FieldErrors };

const NO_DB: Result = { ok: false, error: "Database not connected (MONGODB_URI)." };

let indexed = false;

async function collections(): Promise<{
  partners: Collection<PartnerDoc>;
  categories: Collection<CategoryDoc>;
} | null> {
  const db = await getDb();
  if (!db) return null;
  const partners = db.collection<PartnerDoc>("bfcm_partners");
  const categories = db.collection<CategoryDoc>("bfcm_categories");
  if (!indexed) {
    await Promise.all([
      partners.createIndex({ slug: 1 }, { unique: true }),
      partners.createIndex({ position: 1 }),
      categories.createIndex({ slug: 1 }, { unique: true }),
      categories.createIndex({ position: 1 }),
    ]);
    indexed = true;
  }
  return { partners, categories };
}

function oid(id: string): ObjectId | null {
  return typeof id === "string" && /^[0-9a-f]{24}$/i.test(id) ? new ObjectId(id) : null;
}

function toPartner(d: PartnerDoc): BfcmPartner {
  return {
    id: d._id.toHexString(),
    slug: d.slug,
    name: d.name,
    developer: d.developer,
    category: d.category,
    description: d.description,
    offerBadge: d.offerBadge,
    terms: d.terms,
    validUntil: d.validUntil,
    hideAfterEnd: !!d.hideAfterEnd,
    code: d.code ?? null,
    codeNote: d.codeNote ?? null,
    ctaUrl: d.ctaUrl,
    bannerUrl: d.bannerUrl ?? null,
    logoUrl: d.logoUrl ?? null,
    accentColor: d.accentColor ?? null,
    position: d.position,
    isActive: d.isActive !== false,
    updatedAt: d.updatedAt?.toISOString(),
    updatedBy: d.updatedBy,
  };
}

function toCategory(d: CategoryDoc): BfcmCategory {
  return {
    id: d._id.toHexString(),
    slug: d.slug,
    label: d.label,
    color: d.color,
    position: d.position,
    isActive: d.isActive !== false,
  };
}

/** A slug not yet used in `col`, derived from `text`. */
async function uniqueSlug<T extends { slug: string }>(col: Collection<T>, text: string): Promise<string> {
  const base = slugify(text);
  for (let n = 1; ; n++) {
    const slug = n === 1 ? base : `${base}-${n}`;
    if (!(await col.findOne({ slug } as Filter<T>, { projection: { _id: 1 } }))) return slug;
  }
}

async function nextPosition<T extends Document>(col: Collection<T>): Promise<number> {
  const last = await col.find({} as Filter<T>, { projection: { position: 1 } }).sort({ position: -1 }).limit(1).toArray();
  return last.length ? (last[0].position as number) + 1 : 0;
}

// ---------------------------------------------------------------------------
// Public page
// ---------------------------------------------------------------------------

/**
 * Visible partners (in admin order) + the category tabs that have at least one.
 * Hidden: inactive partners, partners in inactive categories, and expired deals
 * that opted into hideAfterEnd. Throws on DB errors so an ISR re-render keeps
 * serving the last good page instead of caching an empty one.
 */
export async function getPublicBfcmData(now: Date = new Date()): Promise<{
  partners: PublicPartner[];
  categories: PublicCategory[];
}> {
  const c = await collections();
  if (!c) return { partners: [], categories: [] };
  const [cats, docs] = await Promise.all([
    c.categories.find({ isActive: true }).sort({ position: 1 }).toArray(),
    c.partners.find({ isActive: true }).sort({ position: 1 }).toArray(),
  ]);
  const bySlug = new Map(cats.map((cat) => [cat.slug, cat]));
  const visible = docs.filter((d) => bySlug.has(d.category) && !(d.hideAfterEnd && isExpired(d.validUntil, now)));
  const used = new Set(visible.map((d) => d.category));
  return {
    partners: visible.map((d) => toPublicPartner(d, bySlug.get(d.category))),
    categories: cats.filter((cat) => used.has(cat.slug)).map((cat) => ({ slug: cat.slug, label: cat.label })),
  };
}

// ---------------------------------------------------------------------------
// Admin: partners
// ---------------------------------------------------------------------------

export async function listPartners(): Promise<BfcmPartner[] | null> {
  const c = await collections();
  if (!c) return null;
  return (await c.partners.find({}).sort({ position: 1 }).toArray()).map(toPartner);
}

export async function getPartner(id: string): Promise<BfcmPartner | null> {
  const c = await collections();
  const _id = oid(id);
  if (!c || !_id) return null;
  const d = await c.partners.findOne({ _id });
  return d ? toPartner(d) : null;
}

export async function savePartner(id: string | null, raw: unknown, by: string): Promise<Result> {
  const c = await collections();
  if (!c) return NO_DB;
  const parsed = parsePartnerInput(raw);
  if (!parsed.ok) return parsed;
  const data = parsed.data;
  if (!(await c.categories.findOne({ slug: data.category }, { projection: { _id: 1 } }))) {
    return { ok: false, errors: { category: "That category no longer exists" } };
  }
  const now = new Date();

  if (id === null) {
    const doc: PartnerDoc = {
      _id: new ObjectId(),
      ...data,
      slug: await uniqueSlug(c.partners, data.name),
      position: await nextPosition(c.partners),
      createdAt: now,
      updatedAt: now,
      updatedBy: by,
    };
    await c.partners.insertOne(doc);
    return { ok: true, id: doc._id.toHexString() };
  }

  const _id = oid(id);
  if (!_id) return { ok: false, error: "Unknown partner" };
  // The slug stays fixed on edit so page anchors (#p-<slug>) never break.
  const res = await c.partners.updateOne({ _id }, { $set: { ...data, updatedAt: now, updatedBy: by } });
  return res.matchedCount ? { ok: true, id } : { ok: false, error: "Partner not found (deleted?)" };
}

export async function setPartnerActive(id: string, isActive: boolean, by: string): Promise<Result> {
  const c = await collections();
  const _id = oid(id);
  if (!c) return NO_DB;
  if (!_id) return { ok: false, error: "Unknown partner" };
  const res = await c.partners.updateOne({ _id }, { $set: { isActive: !!isActive, updatedAt: new Date(), updatedBy: by } });
  return res.matchedCount ? { ok: true } : { ok: false, error: "Partner not found" };
}

export async function deletePartner(id: string): Promise<Result> {
  const c = await collections();
  const _id = oid(id);
  if (!c) return NO_DB;
  if (!_id) return { ok: false, error: "Unknown partner" };
  await c.partners.deleteOne({ _id });
  return { ok: true };
}

/** Rewrite positions 0..n-1 in the given order. `ids` must list every partner exactly once. */
export async function reorderPartners(ids: unknown): Promise<Result> {
  const c = await collections();
  if (!c) return NO_DB;
  return reorder(c.partners as unknown as Collection<{ _id: ObjectId; position: number }>, ids);
}

// ---------------------------------------------------------------------------
// Admin: categories
// ---------------------------------------------------------------------------

export async function listCategories(): Promise<(BfcmCategory & { partnerCount: number })[] | null> {
  const c = await collections();
  if (!c) return null;
  const [cats, counts] = await Promise.all([
    c.categories.find({}).sort({ position: 1 }).toArray(),
    c.partners.aggregate<{ _id: string; n: number }>([{ $group: { _id: "$category", n: { $sum: 1 } } }]).toArray(),
  ]);
  const countBy = new Map(counts.map((x) => [x._id, x.n]));
  return cats.map((d) => ({ ...toCategory(d), partnerCount: countBy.get(d.slug) ?? 0 }));
}

export async function saveCategory(id: string | null, raw: unknown): Promise<Result> {
  const c = await collections();
  if (!c) return NO_DB;
  const parsed = parseCategoryInput(raw);
  if (!parsed.ok) return parsed;
  const now = new Date();
  if (id === null) {
    const doc: CategoryDoc = {
      _id: new ObjectId(),
      ...parsed.data,
      slug: await uniqueSlug(c.categories, parsed.data.label),
      position: await nextPosition(c.categories),
      isActive: true,
      createdAt: now,
      updatedAt: now,
    };
    await c.categories.insertOne(doc);
    return { ok: true, id: doc._id.toHexString() };
  }
  const _id = oid(id);
  if (!_id) return { ok: false, error: "Unknown category" };
  const res = await c.categories.updateOne({ _id }, { $set: { ...parsed.data, updatedAt: now } });
  return res.matchedCount ? { ok: true, id } : { ok: false, error: "Category not found" };
}

export async function setCategoryActive(id: string, isActive: boolean): Promise<Result> {
  const c = await collections();
  const _id = oid(id);
  if (!c) return NO_DB;
  if (!_id) return { ok: false, error: "Unknown category" };
  const res = await c.categories.updateOne({ _id }, { $set: { isActive: !!isActive, updatedAt: new Date() } });
  return res.matchedCount ? { ok: true } : { ok: false, error: "Category not found" };
}

/** Refuses while any partner still uses the category. */
export async function deleteCategory(id: string): Promise<Result> {
  const c = await collections();
  const _id = oid(id);
  if (!c) return NO_DB;
  if (!_id) return { ok: false, error: "Unknown category" };
  const cat = await c.categories.findOne({ _id });
  if (!cat) return { ok: true };
  const used = await c.partners.countDocuments({ category: cat.slug });
  if (used) return { ok: false, error: `${used} partner(s) still use “${cat.label}”. Move them first.` };
  await c.categories.deleteOne({ _id });
  return { ok: true };
}

export async function reorderCategories(ids: unknown): Promise<Result> {
  const c = await collections();
  if (!c) return NO_DB;
  return reorder(c.categories as unknown as Collection<{ _id: ObjectId; position: number }>, ids);
}

// ---------------------------------------------------------------------------

async function reorder(col: Collection<{ _id: ObjectId; position: number }>, ids: unknown): Promise<Result> {
  if (!Array.isArray(ids) || ids.some((x) => !oid(x as string))) return { ok: false, error: "Invalid order" };
  const objectIds = (ids as string[]).map((x) => new ObjectId(x));
  const total = await col.countDocuments({});
  const unique = new Set(ids as string[]);
  // Guard against a stale list (someone added/removed an item meanwhile).
  if (unique.size !== ids.length || ids.length !== total) {
    return { ok: false, error: "The list changed since you loaded it. Refresh and try again." };
  }
  await col.bulkWrite(objectIds.map((_id, position) => ({ updateOne: { filter: { _id }, update: { $set: { position } } } })));
  return { ok: true };
}
