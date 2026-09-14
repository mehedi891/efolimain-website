import type { PublicStats } from "@/lib/tools/publicStats";

function gradeColor(grade: string | null): string {
  switch (grade) {
    case "A":
      return "#16a34a";
    case "B":
      return "#65a30d";
    case "C":
      return "#d97706";
    case "D":
      return "#ea580c";
    default:
      return "#dc2626"; // F / unknown
  }
}

function Tile({ value, label, color }: { value: string; label: string; color?: string }) {
  return (
    <div className="rounded-2xl bg-white p-4 ring-1 ring-gray-200">
      <p className="font-display text-2xl font-bold tabular-nums" style={{ color: color ?? "#13181E" }}>
        {value}
      </p>
      <p className="mt-0.5 text-xs text-gray-500">{label}</p>
    </div>
  );
}

/**
 * Live, anonymized usage stats for the /free-tools hub — real numbers from the
 * scans collection. Rendered only when there's data (the page omits it otherwise).
 */
export default function StatsPanel({ stats, className = "" }: { stats: PublicStats; className?: string }) {
  const topTools = stats.byTool.slice(0, 4);
  const maxCount = Math.max(1, ...topTools.map((t) => t.count));

  return (
    <aside className={`rounded-3xl bg-[#fafcfd] p-6 ring-1 ring-gray-200 ${className}`}>
      <p className="text-xs font-semibold uppercase tracking-wide text-[#0D99FF]">Live across all tools</p>

      <div className="mt-4 grid grid-cols-2 gap-3">
        <Tile value={stats.totalScans.toLocaleString()} label="scans run" />
        <Tile value={stats.storesMeasured.toLocaleString()} label="stores measured" />
        {stats.avgGrade ? (
          <Tile
            value={stats.avgGrade}
            label={stats.avgScore != null ? `avg grade · ${stats.avgScore}/100` : "average grade"}
            color={gradeColor(stats.avgGrade)}
          />
        ) : (
          <Tile value="—" label="average grade" />
        )}
        {stats.belowSeventyPct != null ? (
          <Tile value={`${stats.belowSeventyPct}%`} label="scored below 70" color="#dc2626" />
        ) : (
          <Tile value="—" label="scored below 70" />
        )}
      </div>

      {topTools.length > 0 && (
        <div className="mt-5">
          <p className="text-xs font-semibold uppercase tracking-wide text-gray-500">Most-used tools</p>
          <div className="mt-3 space-y-2.5">
            {topTools.map((t) => (
              <div key={t.tool}>
                <div className="flex items-center justify-between text-sm">
                  <span className="truncate pr-2 text-[#13181E]">{t.label}</span>
                  <span className="shrink-0 tabular-nums text-gray-500">{t.count.toLocaleString()}</span>
                </div>
                <div className="mt-1 h-1.5 overflow-hidden rounded-full bg-gray-200">
                  <div
                    className="h-full rounded-full bg-[#0D99FF]"
                    style={{ width: `${Math.max(6, Math.round((t.count / maxCount) * 100))}%` }}
                  />
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      <p className="mt-5 text-xs text-gray-400">
        Anonymized, aggregated across every store scanned with these tools.
      </p>
    </aside>
  );
}
