/**
 * Deterministic scoring: checks → pillar score → headline Store Score.
 *
 * No AI, no randomness. A check's status maps to fixed points; a pillar is the
 * weighted average of its scored checks; the headline is the weighted average of
 * pillars that have at least one scored check.
 */

import type { Check, Grade, Pillar, Status } from "./types";

/** Points a check contributes by status. `na` and `manual`-tier checks are excluded. */
const STATUS_POINTS: Record<Exclude<Status, "na">, number> = {
  pass: 100,
  warn: 55,
  fail: 0,
};

/** Pillar weights for the headline Store Score (must sum to 1). See research §4. */
export const PILLAR_WEIGHTS = {
  performance: 0.25,
  mobile: 0.2,
  cro: 0.2,
  seo: 0.15,
  apps: 0.1,
  trust: 0.1,
} as const;

export type PillarId = keyof typeof PILLAR_WEIGHTS;

export function gradeFromScore(score: number): Grade {
  if (score >= 90) return "A";
  if (score >= 80) return "B";
  if (score >= 70) return "C";
  if (score >= 60) return "D";
  return "F";
}

/** A check counts toward scoring only if it was actually measured/estimated. */
function isScored(check: Check): boolean {
  return check.tier !== "manual" && check.status !== "na";
}

/** Weighted average of a pillar's scored checks (0..100). Returns null if none. */
export function scoreChecks(checks: Check[]): number | null {
  const scored = checks.filter(isScored);
  if (scored.length === 0) return null;
  let weightedSum = 0;
  let weightTotal = 0;
  for (const c of scored) {
    const w = c.weight ?? 1;
    weightedSum += STATUS_POINTS[c.status as Exclude<Status, "na">] * w;
    weightTotal += w;
  }
  return weightTotal === 0 ? null : Math.round(weightedSum / weightTotal);
}

/** Build a Pillar from its id, label, and checks. */
export function buildPillar(
  id: PillarId,
  label: string,
  checks: Check[],
): Pillar {
  const raw = scoreChecks(checks);
  const score = raw ?? 0;
  return {
    id,
    label,
    weight: PILLAR_WEIGHTS[id],
    score,
    grade: gradeFromScore(score),
    checks,
  };
}

/**
 * Headline Store Score: weighted average across pillars that have scored checks.
 * Pillars with no scored checks are dropped and the remaining weights renormalized,
 * so a partial scan (e.g. only Performance available) still yields an honest score.
 */
export function headlineScore(pillars: Pillar[]): number {
  let weightedSum = 0;
  let weightTotal = 0;
  for (const p of pillars) {
    if (p.checks.some(isScored)) {
      weightedSum += p.score * p.weight;
      weightTotal += p.weight;
    }
  }
  if (weightTotal === 0) return 0;
  return Math.round(weightedSum / weightTotal);
}

const IMPACT_RANK = { H: 0, M: 1, L: 2 } as const;
const EFFORT_RANK = { L: 0, M: 1, H: 2 } as const;

/**
 * Prioritized fix list: failing checks first, then warnings; within each, highest
 * impact and lowest effort first. Manual-tier items are excluded (they go in the
 * separate manual checklist).
 */
export function topFixes(pillars: Pillar[], limit = 5): Check[] {
  const candidates = pillars
    .flatMap((p) => p.checks)
    .filter(
      (c) => c.tier !== "manual" && (c.status === "fail" || c.status === "warn"),
    );

  candidates.sort((a, b) => {
    // fails before warns
    if (a.status !== b.status) return a.status === "fail" ? -1 : 1;
    const ia = IMPACT_RANK[a.impact ?? "M"];
    const ib = IMPACT_RANK[b.impact ?? "M"];
    if (ia !== ib) return ia - ib;
    const ea = EFFORT_RANK[a.effort ?? "M"];
    const eb = EFFORT_RANK[b.effort ?? "M"];
    return ea - eb;
  });

  return candidates.slice(0, limit);
}
