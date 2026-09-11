"use client";

import { useState } from "react";
import Link from "next/link";
import { motion, useReducedMotion } from "motion/react";
import {
  FiCheckCircle,
  FiAlertTriangle,
  FiXCircle,
  FiMinusCircle,
  FiExternalLink,
  FiChevronDown,
  FiRefreshCw,
  FiCalendar,
  FiLock,
  FiArrowLeft,
} from "react-icons/fi";
import type { Check, PageAudit, Pillar, Report, Shot, Status, Vitals } from "@/lib/grader/types";
import BfcmCountdown from "@/components/BfcmCountdown";

/* ---------- color / status helpers (semaphore = color + icon + text) ---------- */

function scoreColor(score: number): string {
  if (score >= 80) return "#16a34a";
  if (score >= 60) return "#d97706";
  return "#dc2626";
}

const STATUS_META: Record<Status, { color: string; bg: string; label: string; Icon: typeof FiCheckCircle }> = {
  pass: { color: "#16a34a", bg: "#ecfdf5", label: "Pass", Icon: FiCheckCircle },
  warn: { color: "#b45309", bg: "#fffbeb", label: "Needs work", Icon: FiAlertTriangle },
  fail: { color: "#dc2626", bg: "#fef2f2", label: "Fail", Icon: FiXCircle },
  na: { color: "#6b7280", bg: "#f3f4f6", label: "Not measured", Icon: FiMinusCircle },
};

const BFCM_META = {
  "on-track": { color: "#16a34a", bg: "#ecfdf5", label: "On track" },
  "at-risk": { color: "#b45309", bg: "#fffbeb", label: "At risk" },
  "not-ready": { color: "#dc2626", bg: "#fef2f2", label: "Not ready" },
} as const;

function isScored(c: Check): boolean {
  return c.tier !== "manual" && c.status !== "na";
}

/* ---------- score gauge ---------- */

function ScoreGauge({ score, grade }: { score: number; grade: string }) {
  const reduce = useReducedMotion();
  const r = 78;
  const c = 2 * Math.PI * r;
  const color = scoreColor(score);
  const offset = c - (score / 100) * c;
  return (
    <div className="relative h-48 w-48 shrink-0" role="img" aria-label={`Store score ${score} out of 100, grade ${grade}`}>
      <svg viewBox="0 0 180 180" className="h-full w-full -rotate-90">
        <circle cx="90" cy="90" r={r} fill="none" stroke="#eef2f4" strokeWidth="14" />
        <motion.circle
          cx="90"
          cy="90"
          r={r}
          fill="none"
          stroke={color}
          strokeWidth="14"
          strokeLinecap="round"
          strokeDasharray={c}
          initial={{ strokeDashoffset: c }}
          animate={{ strokeDashoffset: offset }}
          transition={{ duration: reduce ? 0 : 1, ease: "easeOut" }}
        />
      </svg>
      <div className="absolute inset-0 flex flex-col items-center justify-center">
        <span className="font-display text-5xl font-bold tabular-nums text-[#13181E]">{score}</span>
        <span className="text-sm font-semibold" style={{ color }}>
          Grade {grade}
        </span>
      </div>
    </div>
  );
}

/* ---------- core web vitals ---------- */

type VitalKind = "ms" | "num";

const VITAL_DEFS: {
  key: "lcpMs" | "inpMs" | "clsScore" | "ttfbMs" | "fcpMs" | "tbtMs";
  abbr: string;
  label: string;
  good: number;
  poor: number;
  kind: VitalKind;
}[] = [
  { key: "lcpMs", abbr: "LCP", label: "Largest Contentful Paint", good: 2500, poor: 4000, kind: "ms" },
  { key: "fcpMs", abbr: "FCP", label: "First Contentful Paint", good: 1800, poor: 3000, kind: "ms" },
  { key: "clsScore", abbr: "CLS", label: "Cumulative Layout Shift", good: 0.1, poor: 0.25, kind: "num" },
  { key: "tbtMs", abbr: "TBT", label: "Total Blocking Time", good: 200, poor: 600, kind: "ms" },
  { key: "inpMs", abbr: "INP", label: "Interaction to Next Paint", good: 200, poor: 500, kind: "ms" },
  { key: "ttfbMs", abbr: "TTFB", label: "Time to First Byte", good: 800, poor: 1800, kind: "ms" },
];

const VITAL_RATING = {
  good: { label: "Good", color: "#16a34a", bg: "#ecfdf5" },
  needs: { label: "Needs work", color: "#b45309", bg: "#fffbeb" },
  poor: { label: "Poor", color: "#dc2626", bg: "#fef2f2" },
  na: { label: "No data", color: "#6b7280", bg: "#f3f4f6" },
} as const;

function fmtMs(ms: number): string {
  return ms >= 1000 ? `${(ms / 1000).toFixed(1)}s` : `${Math.round(ms)}ms`;
}
function fmtVital(v: number, kind: VitalKind): string {
  return kind === "ms" ? fmtMs(v) : v.toFixed(2);
}
function rateVital(value: number | null, good: number, poor: number): keyof typeof VITAL_RATING {
  if (value == null) return "na";
  if (value <= good) return "good";
  if (value <= poor) return "needs";
  return "poor";
}

function ScoreChip({ label, score }: { label: string; score: number | null }) {
  const color = score == null ? "#6b7280" : scoreColor(score);
  return (
    <div className="flex items-center gap-2 rounded-xl bg-white px-3 py-2 ring-1 ring-gray-200">
      <span className="text-xs text-gray-500">{label} speed</span>
      <span className="font-display text-sm font-bold tabular-nums" style={{ color }}>
        {score == null ? "n/a" : `${score}/100`}
      </span>
    </div>
  );
}

function CoreWebVitals({ vitals, shot }: { vitals: Vitals; shot?: Shot }) {
  const sourceLabel =
    vitals.source === "field"
      ? "Real-user data (Chrome UX Report)"
      : vitals.source === "lab"
        ? "Lab data (Lighthouse)"
        : "Not available this run";
  const img = shot?.dataUri || shot?.hostedUrl;

  return (
    <section className="mt-8">
      <div className="flex flex-wrap items-center justify-between gap-2">
        <h2 className="font-display text-xl font-bold text-[#13181E]">Core Web Vitals</h2>
        <span className="rounded-full bg-[#F2FBFA] px-3 py-1 text-xs font-semibold text-[#0A7ACC]">
          {sourceLabel}
        </span>
      </div>
      <p className="mt-1 text-sm text-gray-500">
        Google&apos;s real page-experience metrics — they directly affect search rankings and conversion.
      </p>

      <div className="mt-4 grid gap-5 lg:grid-cols-[1.5fr_1fr]">
        <div>
          <div className="grid grid-cols-2 gap-3">
            {VITAL_DEFS.map((def) => {
              const raw = vitals[def.key];
              const meta = VITAL_RATING[rateVital(raw, def.good, def.poor)];
              return (
                <div key={def.abbr} className="rounded-2xl bg-white p-4 ring-1 ring-gray-200">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold tracking-wide text-gray-500">{def.abbr}</span>
                    <span className="rounded-full px-2 py-0.5 text-[11px] font-semibold" style={{ background: meta.bg, color: meta.color }}>
                      {meta.label}
                    </span>
                  </div>
                  <p
                    className="mt-2 font-display text-2xl font-bold tabular-nums"
                    style={{ color: raw == null ? "#9ca3af" : meta.color }}
                  >
                    {raw == null ? "—" : fmtVital(raw, def.kind)}
                  </p>
                  <p className="mt-0.5 text-xs text-[#4B5154]">{def.label}</p>
                  <p className="mt-1 text-[11px] text-gray-400">Good ≤ {fmtVital(def.good, def.kind)}</p>
                </div>
              );
            })}
          </div>
          <div className="mt-3 flex flex-wrap gap-3">
            <ScoreChip label="Mobile" score={vitals.mobileScore} />
            <ScoreChip label="Desktop" score={vitals.desktopScore} />
          </div>
        </div>

        {img && (
          <figure className="rounded-2xl bg-white p-3 ring-1 ring-gray-200">
            {/* PageSpeed screenshot is a base64 data URI — next/image can't optimize it. */}
            <img src={img} alt="What Google rendered on mobile" className="mx-auto w-full max-w-[260px] rounded-lg" />
            <figcaption className="mt-2 text-center text-xs text-gray-500">What Google rendered (mobile)</figcaption>
          </figure>
        )}
      </div>
    </section>
  );
}

/* ---------- chips ---------- */

function ImpactEffort({ check }: { check: Check }) {
  if (!check.impact && !check.effort) return null;
  return (
    <div className="flex flex-wrap items-center gap-1.5">
      {check.impact && (
        <span className="rounded-md bg-[#F2FBFA] px-2 py-0.5 text-[11px] font-semibold text-[#0A7ACC]">
          {{ H: "High", M: "Med", L: "Low" }[check.impact]} impact
        </span>
      )}
      {check.effort && (
        <span className="rounded-md bg-gray-100 px-2 py-0.5 text-[11px] font-semibold text-gray-600">
          {{ H: "High", M: "Med", L: "Low" }[check.effort]} effort
        </span>
      )}
    </div>
  );
}

function StatusIcon({ status }: { status: Status }) {
  const m = STATUS_META[status];
  const Icon = m.Icon;
  return (
    <span className="inline-flex items-center gap-1.5 text-xs font-semibold" style={{ color: m.color }}>
      <Icon aria-hidden /> {m.label}
    </span>
  );
}

/* ---------- pillar accordion ---------- */

function PillarCard({ pillar, defaultOpen }: { pillar: Pillar; defaultOpen: boolean }) {
  const [open, setOpen] = useState(defaultOpen);
  const scored = pillar.checks.filter(isScored);
  const measured = scored.length > 0;
  const counts = {
    pass: scored.filter((c) => c.status === "pass").length,
    warn: scored.filter((c) => c.status === "warn").length,
    fail: scored.filter((c) => c.status === "fail").length,
  };
  const color = measured ? scoreColor(pillar.score) : "#6b7280";

  return (
    <div className="rounded-2xl ring-1 ring-gray-200 bg-white overflow-hidden">
      <button
        onClick={() => setOpen((o) => !o)}
        aria-expanded={open}
        className="flex w-full items-center gap-4 px-5 py-4 text-left cursor-pointer hover:bg-gray-50/70 transition"
      >
        <span
          className="grid h-12 w-12 shrink-0 place-items-center rounded-xl font-display text-lg font-bold tabular-nums"
          style={{ background: `${color}14`, color }}
        >
          {measured ? pillar.grade : "—"}
        </span>
        <span className="min-w-0 flex-1">
          <span className="block font-display font-bold text-[#13181E]">{pillar.label}</span>
          <span className="mt-0.5 flex flex-wrap items-center gap-x-3 gap-y-0.5 text-xs text-gray-500">
            {measured ? (
              <>
                <span className="tabular-nums" style={{ color }}>{pillar.score}/100</span>
                {counts.pass > 0 && <span className="text-[#16a34a]">{counts.pass} pass</span>}
                {counts.warn > 0 && <span className="text-[#b45309]">{counts.warn} warn</span>}
                {counts.fail > 0 && <span className="text-[#dc2626]">{counts.fail} fail</span>}
                <span className="text-gray-400">· {Math.round(pillar.weight * 100)}% of score</span>
              </>
            ) : (
              <span>Not measured for this scan</span>
            )}
          </span>
        </span>
        <FiChevronDown
          aria-hidden
          className={`shrink-0 text-gray-400 transition-transform ${open ? "rotate-180" : ""}`}
        />
      </button>

      {open && (
        <ul className="divide-y divide-gray-100 border-t border-gray-100">
          {pillar.checks.map((check) => (
            <li key={check.id} className="px-5 py-4">
              <div className="flex flex-wrap items-start justify-between gap-2">
                <div className="min-w-0">
                  <p className="font-medium text-[#13181E]">{check.label}</p>
                  {check.value && (
                    <p className="mt-0.5 text-sm text-gray-500 tabular-nums">{check.value}</p>
                  )}
                  {check.current && (
                    <p className="mt-1 break-words text-sm text-[#4B5154]">{check.current}</p>
                  )}
                  {check.status === "na" && check.note && (
                    <p className="mt-1 text-xs text-gray-400">Not measured — {check.note}</p>
                  )}
                </div>
                <StatusIcon status={check.status} />
              </div>
              {(check.status === "warn" || check.status === "fail") && check.fix && (
                <div className="mt-2 rounded-lg bg-[#F2FBFA] px-3.5 py-2.5">
                  <p className="text-sm text-[#13181E]">
                    <span className="font-semibold text-[#0A7ACC]">Fix:</span> {check.fix}
                  </p>
                  <div className="mt-2">
                    <ImpactEffort check={check} />
                  </div>
                </div>
              )}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}

/* ---------- per-page card ---------- */

const PAGE_STATUS_META = {
  tested: { label: "Tested", color: "#16a34a", bg: "#ecfdf5" },
  "not-found": { label: "Not found", color: "#6b7280", bg: "#f3f4f6" },
  blocked: { label: "JS-rendered", color: "#b45309", bg: "#fffbeb" },
} as const;

function PageCard({ page }: { page: PageAudit }) {
  const meta = PAGE_STATUS_META[page.status];
  return (
    <div className="rounded-2xl bg-white ring-1 ring-gray-200 p-5">
      <div className="flex items-start justify-between gap-3">
        <div className="min-w-0">
          <p className="font-display font-bold text-[#13181E]">{page.label}</p>
          {page.url && (
            <p className="mt-0.5 truncate text-xs text-gray-400">
              {page.url.replace(/^https?:\/\//, "")}
            </p>
          )}
        </div>
        <span
          className="shrink-0 rounded-full px-2.5 py-1 text-xs font-semibold"
          style={{ background: meta.bg, color: meta.color }}
        >
          {meta.label}
        </span>
      </div>

      {page.speedScore != null && (
        <p className="mt-3 text-sm text-[#4B5154]">
          Speed:{" "}
          <span className="font-semibold tabular-nums" style={{ color: scoreColor(page.speedScore) }}>
            {page.speedScore}/100 ({page.speedGrade})
          </span>
        </p>
      )}

      {page.checks.length > 0 ? (
        <ul className="mt-3 divide-y divide-gray-100 border-t border-gray-100">
          {page.checks.map((c) => (
            <li key={c.id} className="py-2.5 text-sm">
              <div className="flex items-start justify-between gap-3">
                <span className="min-w-0 text-[#13181E]">
                  {c.label}
                  {c.value && <span className="ml-1 text-gray-400 tabular-nums">— {c.value}</span>}
                </span>
                <StatusIcon status={c.status} />
              </div>
              {c.current && <p className="mt-1 break-words text-[13px] text-[#4B5154]">{c.current}</p>}
              {c.status === "na" && c.note && (
                <p className="mt-1 text-xs text-gray-400">Not measured — {c.note}</p>
              )}
              {(c.status === "warn" || c.status === "fail") && c.fix && (
                <p className="mt-1.5 rounded-lg bg-[#F2FBFA] px-3 py-2 text-[13px] text-[#13181E]">
                  <span className="font-semibold text-[#0A7ACC]">Fix:</span> {c.fix}
                </p>
              )}
            </li>
          ))}
        </ul>
      ) : (
        <p className="mt-3 border-t border-gray-100 pt-3 text-sm text-gray-400">
          {page.status === "tested" ? "No page-specific checks." : "This page couldn't be analyzed."}
        </p>
      )}
    </div>
  );
}

/* ---------- teaser: pillar summary strip ---------- */

function PillarSummary({ pillar }: { pillar: Pillar }) {
  const scored = pillar.checks.filter(isScored);
  const measured = scored.length > 0;
  const color = measured ? scoreColor(pillar.score) : "#6b7280";
  return (
    <div className="rounded-xl bg-white ring-1 ring-gray-200 p-4">
      <div className="flex items-center gap-2.5">
        <span
          className="grid h-9 w-9 shrink-0 place-items-center rounded-lg font-display text-base font-bold"
          style={{ background: `${color}14`, color }}
        >
          {measured ? pillar.grade : "—"}
        </span>
        <span className="tabular-nums text-sm font-semibold" style={{ color }}>
          {measured ? `${pillar.score}/100` : "n/a"}
        </span>
      </div>
      <p className="mt-2.5 text-sm font-medium leading-snug text-[#13181E]">{pillar.label}</p>
    </div>
  );
}

/* ---------- unlock gate (email capture) ---------- */

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

function UnlockGate({ report, issues, onUnlock }: { report: Report; issues: number; onUnlock: (email: string, emailed: boolean) => void }) {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [sending, setSending] = useState(false);
  const [err, setErr] = useState<string | undefined>();

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    if (!name.trim()) {
      setErr("Please enter your name.");
      return;
    }
    if (!EMAIL_RE.test(email.trim())) {
      setErr("Please enter a valid email address.");
      return;
    }
    setErr(undefined);
    setSending(true);
    try {
      const res = await fetch("/api/free-tools/store-audit/send", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ url: report.url, name: name.trim(), email: email.trim(), report }),
      });
      const json = await res.json();
      if (json?.success) onUnlock(email.trim(), !!json.emailed);
      else setErr(json?.message ?? "Something went wrong. Please try again.");
    } catch {
      setErr("We couldn't send the report. Please try again.");
    } finally {
      setSending(false);
    }
  }

  return (
    <section className="overflow-hidden rounded-3xl ring-1 ring-[#0D99FF]/25 bg-white shadow-[0_-10px_40px_-20px_rgba(13,153,255,0.35)] p-6 md:p-10 text-center">
      <span className="mx-auto grid h-14 w-14 place-items-center rounded-2xl bg-[#0D99FF]/10 text-2xl text-[#0D99FF]">
        <FiLock aria-hidden />
      </span>
      <h2 className="mt-5 font-display text-2xl md:text-3xl font-bold text-[#13181E]">
        Unlock your full report
      </h2>
      <p className="mx-auto mt-3 max-w-xl text-[#4B5154]">
        We found <strong className="text-[#13181E]">{issues} prioritized {issues === 1 ? "fix" : "fixes"}</strong>{" "}
        for your store. Enter your name and email to see every fix step-by-step, your store
        screenshots, and the BFCM checklist — and we&apos;ll email you the full report.
      </p>

      <ul className="mx-auto mt-6 flex max-w-md flex-col gap-2.5 text-left">
        {[
          "Every fix with impact, effort & how-to",
          "Full pillar-by-pillar breakdown",
          "Your store screenshots + BFCM readiness checklist",
        ].map((b) => (
          <li key={b} className="flex items-center gap-2.5 text-sm text-[#13181E]">
            <FiCheckCircle aria-hidden className="text-[#16a34a]" /> {b}
          </li>
        ))}
      </ul>

      <form onSubmit={submit} noValidate className="mx-auto mt-7 flex max-w-md flex-col gap-3">
        <label htmlFor="unlock-name" className="sr-only">
          Your name
        </label>
        <input
          id="unlock-name"
          type="text"
          autoComplete="name"
          placeholder="Your name"
          value={name}
          onChange={(e) => setName(e.target.value)}
          className="w-full rounded-xl border border-gray-300 bg-white px-4 py-3.5 text-base text-[#13181E] placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-[#0D99FF] focus:border-[#0D99FF]"
        />
        <label htmlFor="unlock-email" className="sr-only">
          Email address
        </label>
        <input
          id="unlock-email"
          type="email"
          inputMode="email"
          autoComplete="email"
          placeholder="you@company.com"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          aria-invalid={!!err}
          aria-describedby={err ? "unlock-err" : undefined}
          className="w-full rounded-xl border border-gray-300 bg-white px-4 py-3.5 text-base text-[#13181E] placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-[#0D99FF] focus:border-[#0D99FF]"
        />
        <button
          type="submit"
          disabled={sending}
          className="inline-flex w-full items-center justify-center gap-2 rounded-xl bg-[#0D99FF] px-7 py-3.5 font-semibold text-white transition hover:bg-[#0A7ACC] focus:outline-none focus:ring-2 focus:ring-[#0D99FF] focus:ring-offset-2 disabled:opacity-60 cursor-pointer"
        >
          {sending ? "Unlocking…" : "Email me the full report"}
        </button>
      </form>
      {err && (
        <p id="unlock-err" role="alert" className="mt-2 text-sm text-red-600">
          {err}
        </p>
      )}
      <p className="mt-3 text-xs text-gray-500">Free · no spam · unsubscribe anytime</p>
    </section>
  );
}

/* ---------- main ---------- */

export default function ReportView({ report, onReset }: { report: Report; onReset: () => void }) {
  const bfcm = BFCM_META[report.bfcm.status];
  const [checked, setChecked] = useState<Record<number, boolean>>({});
  const [locked, setLocked] = useState(true);
  const [unlockedEmail, setUnlockedEmail] = useState<string | null>(null);
  const [emailedOk, setEmailedOk] = useState(false);

  const issues = report.pillars
    .flatMap((p) => p.checks)
    .filter((c) => c.tier !== "manual" && (c.status === "warn" || c.status === "fail")).length;

  return (
    <main className="bg-[#fafcfd]">
      <div className="max-w-5xl mx-auto px-4 py-14 md:py-20">
        <Link
          href="/free-tools"
          className="mb-6 inline-flex items-center gap-1.5 text-sm font-semibold text-[#0D99FF] hover:text-[#0A7ACC]"
        >
          <FiArrowLeft aria-hidden /> All free tools
        </Link>
        {/* Header / score */}
        <div className="rounded-3xl bg-white ring-1 ring-gray-200 shadow-[0_18px_50px_-30px_rgba(13,153,255,0.4)] p-6 md:p-10">
          <div className="flex flex-col md:flex-row md:items-center gap-8">
            <div className="flex-1">
              <p className="text-sm font-semibold uppercase tracking-wide text-[#0D99FF]">
                Store audit report
              </p>
              <h1 className="mt-1 font-display text-2xl md:text-3xl font-bold text-[#13181E] break-all">
                {report.url.replace(/^https?:\/\//, "").replace(/\/$/, "")}
              </h1>
              <p className="mt-1 text-sm text-gray-500">
                {report.isShopify ? "Shopify store" : "Store"} · scanned{" "}
                {new Date(report.scannedAt).toLocaleString()}
              </p>

              {/* BFCM badge */}
              <div className="mt-5 inline-flex items-center gap-3 rounded-2xl px-4 py-3" style={{ background: bfcm.bg }}>
                <FiCalendar aria-hidden style={{ color: bfcm.color }} className="text-xl" />
                <div>
                  <p className="text-xs font-semibold uppercase tracking-wide text-gray-500">
                    BFCM readiness
                  </p>
                  <p className="font-display font-bold" style={{ color: bfcm.color }}>
                    {report.bfcm.score}/100 · {bfcm.label}
                    <span className="ml-2 font-normal text-gray-500">
                      <BfcmCountdown variant="inline" />
                    </span>
                  </p>
                </div>
              </div>
            </div>
            <ScoreGauge score={report.storeScore} grade={report.grade} />
          </div>

          {report.partial && (
            <div className="mt-6 rounded-xl bg-[#fffbeb] px-4 py-3 text-sm text-[#7c5306] ring-1 ring-amber-200">
              This is a partial report — some checks couldn&apos;t be measured this run.
              {report.notes.length > 0 && (
                <ul className="mt-1 list-disc pl-5">
                  {report.notes.map((n) => (
                    <li key={n}>{n}</li>
                  ))}
                </ul>
              )}
            </div>
          )}

          <button
            onClick={onReset}
            className="mt-6 inline-flex items-center gap-2 text-sm font-semibold text-[#0D99FF] hover:text-[#0A7ACC] cursor-pointer"
          >
            <FiRefreshCw aria-hidden /> Audit another store
          </button>
        </div>

        {/* At a glance — pillar summary (always shown, free) */}
        <section className="mt-8">
          <h2 className="font-display text-xl font-bold text-[#13181E]">At a glance</h2>
          <div className="mt-4 grid grid-cols-2 md:grid-cols-3 gap-3">
            {report.pillars.map((p) => (
              <PillarSummary key={p.id} pillar={p} />
            ))}
          </div>
        </section>

        {/* Core Web Vitals — real measured metrics + the rendered screenshot */}
        <CoreWebVitals
          vitals={report.vitals}
          shot={report.screenshots.find((s) => s.device === "mobile") ?? report.screenshots[0]}
        />

        {/* Unlock confirmation (after unlocking) */}
        {!locked && unlockedEmail && (
          <div className="mt-8 flex items-center gap-2 rounded-xl bg-[#ecfdf5] px-4 py-3 text-sm text-[#15803d] ring-1 ring-green-200">
            <FiCheckCircle aria-hidden />{" "}
            {emailedOk
              ? `Full report unlocked — we've emailed a copy to ${unlockedEmail}.`
              : "Full report unlocked. (We couldn't email a copy right now — save this page.)"}
          </div>
        )}

        {/* Detail region — visible to everyone, but faded + locked until unlocked */}
        <div className="relative">
          <div className={locked ? "relative max-h-[760px] overflow-hidden" : undefined}>
            <div className={locked ? "pointer-events-none select-none" : undefined} aria-hidden={locked || undefined}>

        {/* Screenshots */}
        {report.screenshots.length > 0 && (
          <section className="mt-10">
            <h2 className="font-display text-xl font-bold text-[#13181E]">What we saw</h2>
            <div className="mt-4 flex flex-wrap gap-5">
              {report.screenshots.map((s) => (
                <figure key={`${s.page}-${s.device}`} className="w-40">
                  <div className="overflow-hidden rounded-xl ring-1 ring-gray-200 bg-white">
                    {/* Screenshots are base64 data URIs from PageSpeed — next/image can't optimize those. */}
                    <img
                      src={s.dataUri || s.hostedUrl}
                      alt={`${s.page} page on ${s.device}`}
                      className="w-full h-auto"
                    />
                  </div>
                  <figcaption className="mt-2 text-center text-xs text-gray-500 capitalize">
                    {s.page} · {s.device}
                  </figcaption>
                </figure>
              ))}
            </div>
          </section>
        )}

        {/* Top fixes */}
        {report.topFixes.length > 0 && (
          <section className="mt-10">
            <h2 className="font-display text-xl font-bold text-[#13181E]">
              Top {report.topFixes.length} fixes to prioritize
            </h2>
            <ol className="mt-4 space-y-3">
              {report.topFixes.map((fix, i) => {
                const m = STATUS_META[fix.status];
                return (
                  <li
                    key={fix.id}
                    className="flex gap-4 rounded-2xl bg-white ring-1 ring-gray-200 p-4 md:p-5"
                  >
                    <span
                      className="grid h-8 w-8 shrink-0 place-items-center rounded-full font-display text-sm font-bold text-white"
                      style={{ background: m.color }}
                    >
                      {i + 1}
                    </span>
                    <div className="min-w-0 flex-1">
                      <p className="font-display font-bold text-[#13181E]">{fix.label}</p>
                      {fix.fix && (
                        <p className="mt-1 text-sm text-[#4B5154]">
                          {fix.value && <span className="mr-1 font-semibold text-[#13181E] tabular-nums">{fix.value} —</span>}
                          {fix.fix}
                        </p>
                      )}
                      <div className="mt-2">
                        <ImpactEffort check={fix} />
                      </div>
                    </div>
                  </li>
                );
              })}
            </ol>
          </section>
        )}

        {/* Pages we tested */}
        <section className="mt-10">
          <h2 className="font-display text-xl font-bold text-[#13181E]">Pages we tested</h2>
          <p className="mt-1 text-sm text-gray-500">
            Shopify themes are template-based, so one page per type reflects the whole store.
          </p>
          <div className="mt-4 grid gap-4 md:grid-cols-2">
            {report.pages.map((p) => (
              <PageCard key={p.type} page={p} />
            ))}
          </div>
        </section>

        {/* Pillars */}
        <section className="mt-10">
          <h2 className="font-display text-xl font-bold text-[#13181E]">Full breakdown</h2>
          <div className="mt-4 space-y-3">
            {report.pillars.map((p, i) => (
              <PillarCard key={p.id} pillar={p} defaultOpen={i === 0} />
            ))}
          </div>
        </section>

        {/* Manual / BFCM checklist */}
        {report.manualChecklist.length > 0 && (
          <section className="mt-10 rounded-2xl bg-white ring-1 ring-gray-200 p-6 md:p-8">
            <h2 className="font-display text-xl font-bold text-[#13181E]">
              Can&apos;t be tested from a URL — do these before BFCM
            </h2>
            <p className="mt-1 text-sm text-gray-500">
              These aren&apos;t scored, but they decide a successful Black Friday.
            </p>
            <ul className="mt-4 space-y-2.5">
              {report.manualChecklist.map((item, i) => (
                <li key={item.label}>
                  <label className="flex cursor-pointer items-start gap-3">
                    <input
                      type="checkbox"
                      checked={!!checked[i]}
                      onChange={() => setChecked((c) => ({ ...c, [i]: !c[i] }))}
                      className="mt-1 h-4 w-4 shrink-0 accent-[#0D99FF]"
                    />
                    <span>
                      <span className={`font-medium ${checked[i] ? "text-gray-400 line-through" : "text-[#13181E]"}`}>
                        {item.label}
                      </span>
                      {item.note && <span className="block text-sm text-gray-500">{item.note}</span>}
                    </span>
                  </label>
                </li>
              ))}
            </ul>
          </section>
        )}

            </div>
            {/* bottom shade that fades the locked content into the page */}
            {locked && (
              <div className="pointer-events-none absolute inset-x-0 bottom-0 h-72 bg-gradient-to-b from-transparent to-[#fafcfd]" />
            )}
          </div>

          {locked && (
            <div className="relative z-10 -mt-28">
              <UnlockGate
                report={report}
                issues={issues}
                onUnlock={(e, emailed) => {
                  setUnlockedEmail(e);
                  setEmailedOk(emailed);
                  setLocked(false);
                }}
              />
            </div>
          )}
        </div>

        {/* CTA */}
        <section className="mt-12 overflow-hidden rounded-3xl bg-[#010A1E] px-6 py-12 md:py-16 text-center">
          <h2 className="font-display text-2xl md:text-4xl font-bold text-white">
            Want eFoli to fix these before Black Friday?
          </h2>
          <p className="mx-auto mt-3 max-w-xl text-white/70">
            We&apos;ve built and scaled Shopify stores and apps for 15+ years. Let&apos;s
            turn this report into revenue.
          </p>
          <Link
            href="/contact-us"
            className="mt-7 inline-flex items-center gap-2 rounded-xl bg-[#0D99FF] px-8 py-4 font-semibold text-white transition hover:bg-[#0A7ACC] focus:outline-none focus:ring-2 focus:ring-white/40"
          >
            Book a free consultation <FiExternalLink aria-hidden />
          </Link>
        </section>
      </div>
    </main>
  );
}
