/**
 * Read models for the admin dashboard: headline stats + a filtered, paginated
 * leads query (also reused for CSV export). All reads go through the shared
 * getDb() connection.
 */

import { getDb, dayKey, type LeadDoc } from "@/lib/leads";

export const TOOL_LABELS: Record<string, string> = {
  "shopify-store-audit": "Store Audit",
  "meta-social-preview": "Meta & Social Preview",
  "structured-data-checker": "Structured Data Checker",
  "ai-visibility-checker": "AI Visibility Checker",
};

export interface LeadFilters {
  tool?: string;
  q?: string;
  from?: string; // YYYY-MM-DD
  to?: string; // YYYY-MM-DD
}

function escapeRegex(s: string): string {
  return s.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
}

function buildQuery(f: LeadFilters): Record<string, unknown> {
  const query: Record<string, unknown> = {};
  if (f.tool) query.tools = f.tool;
  if (f.q?.trim()) {
    const rx = new RegExp(escapeRegex(f.q.trim()), "i");
    query.$or = [{ email: rx }, { storeUrl: rx }, { name: rx }];
  }
  if (f.from || f.to) {
    const range: Record<string, Date> = {};
    if (f.from) range.$gte = new Date(`${f.from}T00:00:00.000Z`);
    if (f.to) range.$lte = new Date(`${f.to}T23:59:59.999Z`);
    query.createdAt = range;
  }
  return query;
}

export interface LeadRow {
  email: string;
  name: string;
  storeUrl: string;
  tools: string[];
  createdAt: string;
  updatedAt: string;
}

function toRow(d: LeadDoc): LeadRow {
  return {
    email: d.email,
    name: d.name ?? "",
    storeUrl: d.storeUrl,
    tools: d.tools ?? [],
    createdAt: d.createdAt instanceof Date ? d.createdAt.toISOString() : String(d.createdAt),
    updatedAt: d.updatedAt instanceof Date ? d.updatedAt.toISOString() : String(d.updatedAt),
  };
}

export interface LeadPage {
  rows: LeadRow[];
  total: number;
  page: number;
  limit: number;
}

/** Filtered + paginated leads, newest first. */
export async function listLeads(f: LeadFilters, page: number, limit: number): Promise<LeadPage> {
  const db = await getDb();
  if (!db) return { rows: [], total: 0, page, limit };
  const col = db.collection<LeadDoc>("leads");
  const query = buildQuery(f);
  const total = await col.countDocuments(query);
  const docs = await col
    .find(query)
    .sort({ updatedAt: -1 })
    .skip((page - 1) * limit)
    .limit(limit)
    .toArray();
  return { rows: docs.map(toRow), total, page, limit };
}

/** All matching leads (capped) for CSV export. */
export async function listLeadsForExport(f: LeadFilters, cap = 50000): Promise<LeadRow[]> {
  const db = await getDb();
  if (!db) return [];
  const docs = await db
    .collection<LeadDoc>("leads")
    .find(buildQuery(f))
    .sort({ updatedAt: -1 })
    .limit(cap)
    .toArray();
  return docs.map(toRow);
}

export interface DashboardStats {
  totalScans: number;
  totalLeads: number;
  todayScans: number;
  todayLeads: number;
  byTool: { tool: string; uses: number }[];
  recentDays: { day: string; scans: number; leads: number; byTool: Record<string, number> }[];
  topStores: { storeUrl: string; uses: number; tools: string[] }[];
}

/** Headline numbers for the dashboard, or null if the DB is unavailable. */
export async function getDashboardStats(): Promise<DashboardStats | null> {
  const db = await getDb();
  if (!db) return null;
  const today = dayKey();

  const [totalScans, totalLeads, todayStat, byToolRaw, recentRaw, topRaw] = await Promise.all([
    db.collection("scans").countDocuments(),
    db.collection("leads").countDocuments(),
    db.collection("daily_stats").findOne({ _id: today } as unknown as Record<string, unknown>),
    db.collection("scans").aggregate([{ $group: { _id: "$tool", uses: { $sum: 1 } } }, { $sort: { uses: -1 } }]).toArray(),
    db.collection("daily_stats").find().sort({ _id: -1 }).limit(14).toArray(),
    db
      .collection("scans")
      .aggregate([
        { $group: { _id: "$storeUrl", uses: { $sum: 1 }, tools: { $addToSet: "$tool" } } },
        { $sort: { uses: -1 } },
        { $limit: 10 },
      ])
      .toArray(),
  ]);

  const stat = todayStat as { scans?: number; leads?: number } | null;

  return {
    totalScans,
    totalLeads,
    todayScans: stat?.scans ?? 0,
    todayLeads: stat?.leads ?? 0,
    byTool: byToolRaw.map((d) => ({ tool: String(d._id), uses: d.uses as number })),
    recentDays: recentRaw.map((d) => ({
      day: String(d._id),
      scans: (d.scans as number) ?? 0,
      leads: (d.leads as number) ?? 0,
      byTool: (d.byTool as Record<string, number>) ?? {},
    })),
    topStores: topRaw.map((d) => ({ storeUrl: String(d._id), uses: d.uses as number, tools: (d.tools as string[]) ?? [] })),
  };
}
