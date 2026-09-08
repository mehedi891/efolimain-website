"use client";

import { useState } from "react";
import Link from "next/link";
import {
  FiSearch,
  FiArrowRight,
  FiLock,
  FiCheckCircle,
  FiAlertTriangle,
  FiXCircle,
  FiMinusCircle,
  FiInfo,
  FiExternalLink,
  FiRefreshCw,
  FiArrowLeft,
} from "react-icons/fi";

function AllToolsLink({ className = "" }: { className?: string }) {
  return (
    <Link
      href="/free-tools"
      className={`inline-flex items-center gap-1.5 text-sm font-semibold text-[#0D99FF] hover:text-[#0A7ACC] ${className}`}
    >
      <FiArrowLeft aria-hidden /> All free tools
    </Link>
  );
}
import type { ToolResult, ToolStatus, ToolCheck } from "@/lib/tools/types";

type Phase = "idle" | "scanning" | "done" | "error";

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

const STATUS_META: Record<ToolStatus, { color: string; label: string; Icon: typeof FiCheckCircle }> = {
  pass: { color: "#16a34a", label: "Pass", Icon: FiCheckCircle },
  warn: { color: "#b45309", label: "Fix", Icon: FiAlertTriangle },
  fail: { color: "#dc2626", label: "Fail", Icon: FiXCircle },
  na: { color: "#6b7280", label: "n/a", Icon: FiMinusCircle },
  info: { color: "#0D99FF", label: "Info", Icon: FiInfo },
};

function scoreColor(s: number): string {
  if (s >= 80) return "#16a34a";
  if (s >= 60) return "#d97706";
  return "#dc2626";
}

function ScoreGauge({ score, grade }: { score: number; grade: string }) {
  const r = 52;
  const c = 2 * Math.PI * r;
  const offset = c - (score / 100) * c;
  const color = scoreColor(score);
  return (
    <div className="relative h-28 w-28 shrink-0" role="img" aria-label={`Score ${score} out of 100, grade ${grade}`}>
      <svg viewBox="0 0 120 120" className="h-full w-full -rotate-90">
        <circle cx="60" cy="60" r={r} fill="none" stroke="#eef2f4" strokeWidth="10" />
        <circle cx="60" cy="60" r={r} fill="none" stroke={color} strokeWidth="10" strokeLinecap="round" strokeDasharray={c} strokeDashoffset={offset} />
      </svg>
      <div className="absolute inset-0 flex flex-col items-center justify-center">
        <span className="font-display text-3xl font-bold tabular-nums text-[#13181E]">{score}</span>
        <span className="text-xs font-semibold" style={{ color }}>Grade {grade}</span>
      </div>
    </div>
  );
}

function CheckRow({ c }: { c: ToolCheck }) {
  const m = STATUS_META[c.status];
  const Icon = m.Icon;
  return (
    <li className="px-5 py-3.5">
      <div className="flex items-start justify-between gap-3">
        <div className="min-w-0">
          <p className="font-medium text-[#13181E]">{c.label}</p>
          {c.value && <p className="mt-0.5 text-sm text-gray-500">{c.value}</p>}
        </div>
        <span className="inline-flex shrink-0 items-center gap-1.5 text-xs font-semibold" style={{ color: m.color }}>
          <Icon aria-hidden /> {m.label}
        </span>
      </div>
      {(c.status === "warn" || c.status === "fail") && c.fix && (
        <div className="mt-2 rounded-lg bg-[#F2FBFA] px-3.5 py-2.5">
          <p className="text-sm text-[#13181E]">{c.fix}</p>
          {c.ref && (
            <a href={c.ref} target="_blank" rel="noopener noreferrer" className="mt-1 inline-flex items-center gap-1 text-xs font-semibold text-[#0D99FF] hover:text-[#0A7ACC]">
              Learn more <FiExternalLink aria-hidden />
            </a>
          )}
        </div>
      )}
    </li>
  );
}

function UnlockCard({ tool, result, onUnlock }: { tool: string; result: ToolResult; onUnlock: (email: string, emailed: boolean) => void }) {
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
      const res = await fetch("/api/free-tools/scan/send", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ tool, name: name.trim(), email: email.trim(), result }),
      });
      const json = await res.json();
      if (json?.success) onUnlock(email.trim(), !!json.emailed);
      else setErr(json?.message ?? "Something went wrong.");
    } catch {
      setErr("We couldn't send the report. Please try again.");
    } finally {
      setSending(false);
    }
  }

  return (
    <section className="overflow-hidden rounded-3xl bg-white p-6 md:p-10 text-center ring-1 ring-[#0D99FF]/25 shadow-[0_-10px_40px_-20px_rgba(13,153,255,0.35)]">
      <span className="mx-auto grid h-14 w-14 place-items-center rounded-2xl bg-[#0D99FF]/10 text-2xl text-[#0D99FF]">
        <FiLock aria-hidden />
      </span>
      <h2 className="mt-5 font-display text-2xl font-bold text-[#13181E]">Unlock the full report</h2>
      <p className="mx-auto mt-3 max-w-lg text-[#4B5154]">
        Enter your name and email to see every finding, the fixes, and get the full report in your inbox.
      </p>
      <form onSubmit={submit} noValidate className="mx-auto mt-6 flex max-w-md flex-col gap-3">
        <label htmlFor="tool-name" className="sr-only">Your name</label>
        <input
          id="tool-name"
          type="text"
          autoComplete="name"
          placeholder="Your name"
          value={name}
          onChange={(e) => setName(e.target.value)}
          className="w-full rounded-xl border border-gray-300 bg-white px-4 py-3.5 text-base text-[#13181E] placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-[#0D99FF] focus:border-[#0D99FF]"
        />
        <label htmlFor="tool-email" className="sr-only">Email address</label>
        <input
          id="tool-email"
          type="email"
          inputMode="email"
          autoComplete="email"
          placeholder="you@company.com"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
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
      {err && <p role="alert" className="mt-2 text-sm text-red-600">{err}</p>}
      <p className="mt-3 text-xs text-gray-500">Free · no spam · unsubscribe anytime</p>
    </section>
  );
}

export interface ToolShellProps {
  tool: string;
  heading: string;
  subheading: string;
  placeholder?: string;
  cta?: string;
  /** Tool-specific premium visual, shown in the locked region. */
  renderVisual?: (result: ToolResult) => React.ReactNode;
}

export default function ToolShell({ tool, heading, subheading, placeholder = "yourstore.com", cta = "Analyze", renderVisual }: ToolShellProps) {
  const [phase, setPhase] = useState<Phase>("idle");
  const [url, setUrl] = useState("");
  const [result, setResult] = useState<ToolResult | null>(null);
  const [error, setError] = useState<string | undefined>();
  const [locked, setLocked] = useState(true);
  const [unlockedEmail, setUnlockedEmail] = useState<string | null>(null);
  const [emailedOk, setEmailedOk] = useState(false);

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!url.trim()) {
      setError("Please enter a URL.");
      return;
    }
    setError(undefined);
    setPhase("scanning");
    try {
      const res = await fetch("/api/free-tools/scan", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ tool, url: url.trim() }),
      });
      const json = await res.json();
      if (json?.success && json.result) {
        setResult(json.result as ToolResult);
        setLocked(true);
        setUnlockedEmail(null);
        setPhase("done");
      } else {
        setError(json?.message ?? "Something went wrong.");
        setPhase("idle");
      }
    } catch {
      setError("We couldn't reach the service. Please try again.");
      setPhase("idle");
    }
  }

  if (phase === "done" && result) {
    const freeChecks = result.checks.filter((c) => c.free);
    const gatedChecks = result.checks.filter((c) => !c.free);
    return (
      <main className="bg-[#fafcfd]">
        <div className="mx-auto max-w-3xl px-4 py-14 md:py-20">
          <AllToolsLink className="mb-6" />
          {/* header */}
          <div className="rounded-3xl bg-white p-6 md:p-8 ring-1 ring-gray-200 shadow-[0_18px_50px_-30px_rgba(13,153,255,0.4)]">
            <div className="flex flex-col sm:flex-row sm:items-center gap-6">
              <div className="min-w-0 flex-1">
                <p className="text-sm font-semibold uppercase tracking-wide text-[#0D99FF]">{heading}</p>
                <h1 className="mt-1 font-display text-2xl md:text-3xl font-bold text-[#13181E] break-all">{result.host}</h1>
                <p className="mt-2 text-[#4B5154]">{result.summary}</p>
                {result.notes.length > 0 && (
                  <ul className="mt-3 list-disc pl-5 text-sm text-amber-700">
                    {result.notes.map((n) => <li key={n}>{n}</li>)}
                  </ul>
                )}
                <button onClick={() => setPhase("idle")} className="mt-5 inline-flex items-center gap-2 text-sm font-semibold text-[#0D99FF] hover:text-[#0A7ACC] cursor-pointer">
                  <FiRefreshCw aria-hidden /> Analyze another URL
                </button>
              </div>
              {result.score != null && <ScoreGauge score={result.score} grade={result.grade ?? ""} />}
            </div>
          </div>

          {/* free teaser checks */}
          {freeChecks.length > 0 && (
            <ul className="mt-6 divide-y divide-gray-100 rounded-2xl bg-white ring-1 ring-gray-200">
              {freeChecks.map((c) => <CheckRow key={c.id} c={c} />)}
            </ul>
          )}

          {/* unlock confirmation */}
          {!locked && unlockedEmail && (
            <div className="mt-6 flex items-center gap-2 rounded-xl bg-[#ecfdf5] px-4 py-3 text-sm text-[#15803d] ring-1 ring-green-200">
              <FiCheckCircle aria-hidden />{" "}
              {emailedOk ? `Unlocked — we've emailed a copy to ${unlockedEmail}.` : "Unlocked. (We couldn't email a copy right now — save this page.)"}
            </div>
          )}

          {/* locked region: visual + gated checks, faded until unlocked */}
          <div className="relative mt-6">
            <div className={locked ? "relative max-h-[520px] overflow-hidden" : undefined}>
              <div className={locked ? "pointer-events-none select-none" : undefined} aria-hidden={locked || undefined}>
                {renderVisual && <div className="mb-6">{renderVisual(result)}</div>}
                {gatedChecks.length > 0 && (
                  <ul className="divide-y divide-gray-100 rounded-2xl bg-white ring-1 ring-gray-200">
                    {gatedChecks.map((c) => <CheckRow key={c.id} c={c} />)}
                  </ul>
                )}
              </div>
              {locked && <div className="pointer-events-none absolute inset-x-0 bottom-0 h-64 bg-gradient-to-b from-transparent to-[#fafcfd]" />}
            </div>
            {locked && (
              <div className="relative z-10 -mt-24">
                <UnlockCard tool={tool} result={result} onUnlock={(e, emailed) => { setUnlockedEmail(e); setEmailedOk(emailed); setLocked(false); }} />
              </div>
            )}
          </div>

          {/* CTA */}
          <section className="mt-12 overflow-hidden rounded-3xl bg-[#010A1E] px-6 py-12 text-center">
            <h2 className="font-display text-2xl md:text-3xl font-bold text-white">Want eFoli to fix these for you?</h2>
            <p className="mx-auto mt-3 max-w-xl text-white/70">15+ years building and scaling Shopify stores and apps.</p>
            <Link href="/contact-us" className="mt-6 inline-flex items-center gap-2 rounded-xl bg-[#0D99FF] px-8 py-4 font-semibold text-white transition hover:bg-[#0A7ACC]">
              Book a free consultation <FiExternalLink aria-hidden />
            </Link>
          </section>
        </div>
      </main>
    );
  }

  return (
    <main className="bg-white">
      <div className="mx-auto max-w-2xl px-4 pt-6">
        <AllToolsLink />
      </div>
      <section className="relative overflow-hidden">
        <div aria-hidden className="pointer-events-none absolute inset-0 -z-10" style={{ background: "radial-gradient(60rem 30rem at 50% -10%, #F2FBFA 0%, rgba(242,251,250,0) 70%)" }} />
        <div className="mx-auto max-w-2xl px-4 pt-10 pb-16 md:pt-14 text-center">
          <h1 className="font-display text-4xl md:text-5xl font-bold tracking-[-1px] text-[#13181E]">{heading}</h1>
          <p className="mt-4 text-lg/[1.6] text-[#4B5154]">{subheading}</p>
          <form onSubmit={onSubmit} noValidate className="mt-8 flex flex-col gap-3 sm:flex-row">
            <div className="relative flex-1">
              <FiSearch aria-hidden className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400" />
              <input
                type="url"
                inputMode="url"
                placeholder={placeholder}
                value={url}
                onChange={(e) => setUrl(e.target.value)}
                className="w-full rounded-xl border border-gray-300 pl-10 pr-3 py-3.5 text-base text-[#13181E] placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-[#0D99FF] focus:border-[#0D99FF]"
              />
            </div>
            <button type="submit" disabled={phase === "scanning"} className="group inline-flex items-center justify-center gap-2 rounded-xl bg-[#0D99FF] px-8 py-3.5 font-semibold text-white transition hover:bg-[#0A7ACC] focus:outline-none focus:ring-2 focus:ring-[#0D99FF] focus:ring-offset-2 disabled:opacity-60 cursor-pointer whitespace-nowrap">
              {phase === "scanning" ? "Analyzing…" : cta}
              {phase !== "scanning" && <FiArrowRight aria-hidden className="transition group-hover:translate-x-1" />}
            </button>
          </form>
          {error && <p role="alert" className="mt-3 text-sm text-red-600">{error}</p>}
          <p className="mt-4 flex items-center justify-start gap-2 text-sm text-[#4B5154]">
            <FiLock aria-hidden className="text-[#0D99FF]" /> Free · no login · instant
          </p>
        </div>
      </section>
    </main>
  );
}
