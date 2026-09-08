/** Shared deterministic scoring for tool checks. */
import type { ToolCheck } from "./types";

const POINTS = { pass: 100, warn: 55, fail: 0 } as const;

export function scoreChecks(checks: ToolCheck[]): number {
  const scored = checks.filter(
    (c): c is ToolCheck & { status: keyof typeof POINTS } =>
      c.status === "pass" || c.status === "warn" || c.status === "fail",
  );
  if (scored.length === 0) return 0;
  const sum = scored.reduce((a, c) => a + POINTS[c.status], 0);
  return Math.round(sum / scored.length);
}

export function gradeFromScore(score: number): string {
  if (score >= 90) return "A";
  if (score >= 80) return "B";
  if (score >= 70) return "C";
  if (score >= 60) return "D";
  return "F";
}
