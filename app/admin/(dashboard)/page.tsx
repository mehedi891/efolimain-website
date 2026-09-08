import Link from "next/link";
import { FiDownload } from "react-icons/fi";
import { getDashboardStats, listLeads, TOOL_LABELS } from "@/lib/admin/data";
import LeadsFilters from "./LeadsFilters";

export const dynamic = "force-dynamic";

const LIMIT = 20;

function StatCard({ label, value }: { label: string; value: number | string }) {
  return (
    <div className="rounded-2xl bg-white p-5 ring-1 ring-gray-200">
      <p className="text-sm text-gray-500">{label}</p>
      <p className="mt-1 font-display text-3xl font-bold tabular-nums text-[#13181E]">{value}</p>
    </div>
  );
}

function fmt(iso: string): string {
  const d = new Date(iso);
  return isNaN(d.getTime()) ? "—" : d.toLocaleDateString(undefined, { year: "numeric", month: "short", day: "numeric" });
}

export default async function AdminDashboard({
  searchParams,
}: {
  searchParams: Promise<Record<string, string | string[] | undefined>>;
}) {
  const sp = await searchParams;
  const str = (k: string) => (typeof sp[k] === "string" ? (sp[k] as string) : "");
  const tool = str("tool");
  const q = str("q");
  const from = str("from");
  const to = str("to");
  const page = Math.max(1, parseInt(str("page") || "1", 10) || 1);

  const toolLabel = (slug: string) => TOOL_LABELS[slug] ?? slug;

  const stats = await getDashboardStats();
  if (!stats) {
    return (
      <div className="rounded-2xl bg-white p-8 text-center ring-1 ring-gray-200">
        <p className="font-display text-lg font-bold text-[#13181E]">Database not connected</p>
        <p className="mt-1 text-sm text-[#4B5154]">Set MONGODB_URI and confirm Atlas Network Access allows this server.</p>
      </div>
    );
  }

  const leads = await listLeads({ tool, q, from, to }, page, LIMIT);
  const pages = Math.max(1, Math.ceil(leads.total / LIMIT));

  // Build a query string carrying the active filters (+ optional overrides).
  const qs = (extra?: Record<string, string | number>) => {
    const p = new URLSearchParams();
    if (tool) p.set("tool", tool);
    if (q) p.set("q", q);
    if (from) p.set("from", from);
    if (to) p.set("to", to);
    Object.entries(extra ?? {}).forEach(([k, v]) => p.set(k, String(v)));
    return p.toString();
  };

  return (
    <div className="space-y-8">
      <div>
        <h1 className="font-display text-2xl font-bold text-[#13181E]">Overview</h1>
        <p className="mt-1 text-sm text-gray-500">Usage and leads across all free tools.</p>
      </div>

      {/* Headline stats */}
      <div className="grid grid-cols-2 gap-4 md:grid-cols-4">
        <StatCard label="Total tool uses" value={stats.totalScans} />
        <StatCard label="Total leads" value={stats.totalLeads} />
        <StatCard label="Uses today" value={stats.todayScans} />
        <StatCard label="Leads today" value={stats.todayLeads} />
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        {/* By tool */}
        <section className="rounded-2xl bg-white p-6 ring-1 ring-gray-200">
          <h2 className="font-display text-lg font-bold text-[#13181E]">Uses by tool</h2>
          <ul className="mt-4 space-y-3">
            {stats.byTool.length === 0 && <li className="text-sm text-gray-400">No usage yet.</li>}
            {stats.byTool.map((t) => {
              const max = stats.byTool[0]?.uses || 1;
              return (
                <li key={t.tool}>
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-[#13181E]">{toolLabel(t.tool)}</span>
                    <span className="tabular-nums font-semibold text-[#13181E]">{t.uses}</span>
                  </div>
                  <div className="mt-1 h-2 overflow-hidden rounded-full bg-gray-100">
                    <div className="h-full rounded-full bg-[#0D99FF]" style={{ width: `${Math.round((t.uses / max) * 100)}%` }} />
                  </div>
                </li>
              );
            })}
          </ul>
        </section>

        {/* Top stores */}
        <section className="rounded-2xl bg-white p-6 ring-1 ring-gray-200">
          <h2 className="font-display text-lg font-bold text-[#13181E]">Top stores</h2>
          <ul className="mt-4 divide-y divide-gray-100">
            {stats.topStores.length === 0 && <li className="py-2 text-sm text-gray-400">No usage yet.</li>}
            {stats.topStores.map((s) => (
              <li key={s.storeUrl} className="flex items-center justify-between gap-3 py-2.5">
                <div className="min-w-0">
                  <p className="truncate text-sm font-medium text-[#13181E]">{s.storeUrl}</p>
                  <p className="truncate text-xs text-gray-400">{s.tools.map(toolLabel).join(", ")}</p>
                </div>
                <span className="shrink-0 tabular-nums text-sm font-semibold text-[#13181E]">{s.uses}</span>
              </li>
            ))}
          </ul>
        </section>
      </div>

      {/* Recent days */}
      <section className="rounded-2xl bg-white p-6 ring-1 ring-gray-200">
        <h2 className="font-display text-lg font-bold text-[#13181E]">Last 14 days</h2>
        <div className="mt-4 overflow-x-auto">
          <table className="w-full min-w-[420px] text-sm">
            <thead>
              <tr className="text-left text-gray-500">
                <th className="pb-2 font-medium">Day (UTC)</th>
                <th className="pb-2 font-medium text-right">Uses</th>
                <th className="pb-2 font-medium text-right">Leads</th>
              </tr>
            </thead>
            <tbody>
              {stats.recentDays.length === 0 && (
                <tr><td colSpan={3} className="py-3 text-gray-400">No data yet.</td></tr>
              )}
              {stats.recentDays.map((d) => (
                <tr key={d.day} className="border-t border-gray-100">
                  <td className="py-2 text-[#13181E]">{d.day}</td>
                  <td className="py-2 text-right tabular-nums text-[#13181E]">{d.scans}</td>
                  <td className="py-2 text-right tabular-nums text-[#13181E]">{d.leads}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>

      {/* Leads: filter + paginate + export */}
      <section className="rounded-2xl bg-white p-6 ring-1 ring-gray-200">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <h2 className="font-display text-lg font-bold text-[#13181E]">
            Leads <span className="ml-1 text-sm font-normal text-gray-400">({leads.total})</span>
          </h2>
          <a
            href={`/api/admin/leads/export?${qs()}`}
            className="inline-flex items-center gap-1.5 rounded-lg bg-[#0D99FF] px-3.5 py-2 text-sm font-semibold text-white transition hover:bg-[#0A7ACC]"
          >
            <FiDownload aria-hidden /> Export CSV
          </a>
        </div>

        <LeadsFilters tool={tool} q={q} from={from} to={to} />

        <div className="mt-5 overflow-x-auto">
          <table className="w-full min-w-[720px] text-sm">
            <thead>
              <tr className="text-left text-gray-500">
                <th className="pb-2 font-medium">Name</th>
                <th className="pb-2 font-medium">Email</th>
                <th className="pb-2 font-medium">Store</th>
                <th className="pb-2 font-medium">Tools</th>
                <th className="pb-2 font-medium">First seen</th>
              </tr>
            </thead>
            <tbody>
              {leads.rows.length === 0 ? (
                <tr><td colSpan={5} className="py-6 text-center text-gray-400">No leads match these filters.</td></tr>
              ) : (
                leads.rows.map((r) => (
                  <tr key={`${r.email}|${r.storeUrl}`} className="border-t border-gray-100 align-top">
                    <td className="py-2.5 pr-3 text-[#13181E]">{r.name || "—"}</td>
                    <td className="py-2.5 pr-3 text-[#13181E]">{r.email}</td>
                    <td className="py-2.5 pr-3 text-[#4B5154]">{r.storeUrl}</td>
                    <td className="py-2.5 pr-3">
                      <div className="flex flex-wrap gap-1">
                        {r.tools.map((t) => (
                          <span key={t} className="rounded-md bg-[#F2FBFA] px-2 py-0.5 text-xs font-medium text-[#0A7ACC]">
                            {toolLabel(t)}
                          </span>
                        ))}
                      </div>
                    </td>
                    <td className="py-2.5 whitespace-nowrap text-gray-500">{fmt(r.createdAt)}</td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        {/* Pagination */}
        <div className="mt-5 flex items-center justify-between">
          <p className="text-sm text-gray-500">Page {page} of {pages}</p>
          <div className="flex gap-2">
            {page > 1 ? (
              <Link href={`/admin?${qs({ page: page - 1 })}`} className="rounded-lg border border-gray-300 px-3 py-1.5 text-sm font-semibold text-[#13181E] transition hover:bg-gray-50">
                Prev
              </Link>
            ) : (
              <span className="rounded-lg border border-gray-200 px-3 py-1.5 text-sm font-semibold text-gray-300">Prev</span>
            )}
            {page < pages ? (
              <Link href={`/admin?${qs({ page: page + 1 })}`} className="rounded-lg border border-gray-300 px-3 py-1.5 text-sm font-semibold text-[#13181E] transition hover:bg-gray-50">
                Next
              </Link>
            ) : (
              <span className="rounded-lg border border-gray-200 px-3 py-1.5 text-sm font-semibold text-gray-300">Next</span>
            )}
          </div>
        </div>
      </section>
    </div>
  );
}
