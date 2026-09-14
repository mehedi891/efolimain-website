/**
 * Aggregate, anonymized usage stats for the public /free-tools hub.
 *
 * Reads the append-only `scans` collection. Never throws and never blocks the
 * page: if the DB is unavailable or empty it returns null and the hub simply
 * omits the panel. Cached so the hub isn't hitting Mongo on every request.
 */

import { unstable_cache } from "next/cache";
import { getDb } from "@/lib/leads";
import { TOOL_LABELS } from "@/lib/admin/data";

export interface PublicStats {
  totalScans: number;
  storesMeasured: number;
  avgScore: number | null;
  avgGrade: string | null;
  belowSeventyPct: number | null;
  medianTtfbMs: number | null;
  byTool: { tool: string; label: string; count: number }[];
}

function gradeFromScore(score: number): string {
  if (score >= 90) return "A";
  if (score >= 80) return "B";
  if (score >= 70) return "C";
  if (score >= 60) return "D";
  return "F";
}

async function computePublicStats(): Promise<PublicStats | null> {
  try {
    return await runPublicStats();
  } catch (err) {
    console.error("[publicStats] failed:", err);
    return null;
  }
}

async function runPublicStats(): Promise<PublicStats | null> {
  const db = await getDb();
  if (!db) return null;
  const scans = db.collection("scans");

  const [totals] = await scans
    .aggregate<{ total: number; scoreSum: number; scored: number; below70: number }>([
      {
        $group: {
          _id: null,
          total: { $sum: 1 },
          scoreSum: { $sum: { $ifNull: ["$score", 0] } },
          scored: { $sum: { $cond: [{ $ne: [{ $type: "$score" }, "missing"] }, 1, 0] } },
          below70: {
            $sum: { $cond: [{ $and: [{ $ne: [{ $type: "$score" }, "missing"] }, { $lt: ["$score", 70] }] }, 1, 0] },
          },
        },
      },
    ])
    .toArray();

  if (!totals || totals.total === 0) return null;

  const storesMeasured = (await scans.distinct("storeUrl")).length;

  const byToolRaw = await scans
    .aggregate<{ _id: string; count: number }>([
      { $group: { _id: "$tool", count: { $sum: 1 } } },
      { $sort: { count: -1 } },
    ])
    .toArray();

  const avgScore = totals.scored > 0 ? Math.round(totals.scoreSum / totals.scored) : null;

  return {
    totalScans: totals.total,
    storesMeasured,
    avgScore,
    avgGrade: avgScore != null ? gradeFromScore(avgScore) : null,
    belowSeventyPct: totals.scored > 0 ? Math.round((totals.below70 / totals.scored) * 100) : null,
    medianTtfbMs: null, // reserved — not captured per-scan yet
    byTool: byToolRaw.map((t) => ({ tool: t._id, label: TOOL_LABELS[t._id] ?? t._id, count: t.count })),
  };
}

/** Cached wrapper — refreshes at most every 10 minutes. */
export const getPublicStats = unstable_cache(computePublicStats, ["free-tools-public-stats"], {
  revalidate: 600,
  tags: ["free-tools-stats"],
});
