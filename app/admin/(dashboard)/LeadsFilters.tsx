"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { FiSearch, FiRefreshCw } from "react-icons/fi";

const TOOLS: { slug: string; label: string }[] = [
  { slug: "shopify-store-audit", label: "Store Audit" },
  { slug: "meta-social-preview", label: "Meta & Social Preview" },
  { slug: "structured-data-checker", label: "Structured Data Checker" },
  { slug: "ai-visibility-checker", label: "AI Visibility Checker" },
];

export default function LeadsFilters({ tool, q, from, to }: { tool: string; q: string; from: string; to: string }) {
  const router = useRouter();
  const [t, setT] = useState(tool);
  const [query, setQuery] = useState(q);
  const [f, setF] = useState(from);
  const [t2, setT2] = useState(to);

  function apply(e: React.FormEvent) {
    e.preventDefault();
    const p = new URLSearchParams();
    if (t) p.set("tool", t);
    if (query.trim()) p.set("q", query.trim());
    if (f) p.set("from", f);
    if (t2) p.set("to", t2);
    router.push(p.toString() ? `/admin?${p}` : "/admin");
  }

  function reset() {
    setT("");
    setQuery("");
    setF("");
    setT2("");
    router.push("/admin");
  }

  const field = "rounded-lg border border-gray-300 px-3 py-2 text-sm text-[#13181E] focus:outline-none focus:ring-2 focus:ring-[#0D99FF] focus:border-[#0D99FF]";

  return (
    <form onSubmit={apply} className="mt-4 grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-5">
      <div className="relative lg:col-span-2">
        <FiSearch aria-hidden className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
        <input
          type="text"
          placeholder="Search email, store or name"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          className={`${field} w-full pl-9`}
        />
      </div>
      <select value={t} onChange={(e) => setT(e.target.value)} aria-label="Filter by tool" className={field}>
        <option value="">All tools</option>
        {TOOLS.map((x) => (
          <option key={x.slug} value={x.slug}>{x.label}</option>
        ))}
      </select>
      <input type="date" value={f} onChange={(e) => setF(e.target.value)} aria-label="From date" className={field} />
      <input type="date" value={t2} onChange={(e) => setT2(e.target.value)} aria-label="To date" className={field} />
      <div className="flex gap-2 sm:col-span-2 lg:col-span-5">
        <button type="submit" className="inline-flex items-center gap-1.5 rounded-lg bg-[#13181E] px-4 py-2 text-sm font-semibold text-white transition hover:bg-black cursor-pointer">
          Apply filters
        </button>
        <button type="button" onClick={reset} className="inline-flex items-center gap-1.5 rounded-lg border border-gray-300 px-4 py-2 text-sm font-semibold text-[#13181E] transition hover:bg-gray-50 cursor-pointer">
          <FiRefreshCw aria-hidden /> Reset
        </button>
      </div>
    </form>
  );
}
