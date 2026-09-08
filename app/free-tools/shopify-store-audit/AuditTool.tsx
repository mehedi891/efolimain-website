"use client";

import { useState } from "react";
import Link from "next/link";
import { motion, useReducedMotion } from "motion/react";
import { FiArrowRight, FiSearch, FiLock, FiArrowLeft } from "react-icons/fi";
import type { Report } from "@/lib/grader/types";
import BfcmCountdown from "@/components/BfcmCountdown";
import ReportView from "./ReportView";

type Phase = "idle" | "scanning" | "done" | "error";

const SCAN_STEPS = [
  "Fetching your storefront…",
  "Measuring Core Web Vitals (mobile + desktop)…",
  "Checking SEO & structured data…",
  "Scanning conversion signals…",
  "Detecting apps & third-party scripts…",
  "Scoring BFCM readiness…",
];

export default function AuditTool() {
  const reduce = useReducedMotion();
  const [phase, setPhase] = useState<Phase>("idle");
  const [url, setUrl] = useState("");
  const [errors, setErrors] = useState<{ url?: string; form?: string }>({});
  const [report, setReport] = useState<Report | null>(null);
  const [step, setStep] = useState(0);

  function validate(): boolean {
    const e: typeof errors = {};
    if (!url.trim()) e.url = "Please enter your store URL.";
    setErrors(e);
    return Object.keys(e).length === 0;
  }

  async function onSubmit(ev: React.FormEvent) {
    ev.preventDefault();
    if (!validate()) return;
    setPhase("scanning");
    setStep(0);
    // Advance the visible step while the single request runs (cosmetic progress).
    const ticker = setInterval(
      () => setStep((s) => Math.min(s + 1, SCAN_STEPS.length - 1)),
      2600,
    );
    try {
      const res = await fetch("/api/free-tools/store-audit", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ url: url.trim() }),
      });
      const json = await res.json();
      clearInterval(ticker);
      if (json?.success && json.report) {
        setReport(json.report as Report);
        setPhase("done");
        window.scrollTo({ top: 0, behavior: reduce ? "auto" : "smooth" });
      } else {
        setErrors({ form: json?.message ?? "Something went wrong. Please try again." });
        setPhase("error");
      }
    } catch {
      clearInterval(ticker);
      setErrors({ form: "We couldn't reach the audit service. Please try again." });
      setPhase("error");
    }
  }

  function reset() {
    setPhase("idle");
    setReport(null);
    setErrors({});
  }

  if (phase === "done" && report) {
    return <ReportView report={report} onReset={reset} />;
  }

  return (
    <main className="bg-white">
      <div className="max-w-3xl mx-auto px-4 pt-6">
        <Link
          href="/free-tools"
          className="inline-flex items-center gap-1.5 text-sm font-semibold text-[#0D99FF] hover:text-[#0A7ACC]"
        >
          <FiArrowLeft aria-hidden /> All free tools
        </Link>
      </div>
      {/* Hero + form */}
      <section className="relative overflow-hidden">
        <div
          aria-hidden
          className="pointer-events-none absolute inset-0 -z-10"
          style={{
            background:
              "radial-gradient(60rem 30rem at 50% -10%, #F2FBFA 0%, rgba(242,251,250,0) 70%)",
          }}
        />
        <div className="max-w-3xl mx-auto px-4 pt-10 pb-16 md:pt-14 text-center">
          <BfcmCountdown />
          <h1 className="mt-6 font-display font-bold tracking-[-1.5px] text-4xl md:text-6xl text-[#13181E]">
            Free Shopify Store Audit
          </h1>
          <p className="mt-5 text-lg md:text-xl/[1.6] text-[#4B5154] max-w-2xl mx-auto">
            Paste your store URL and get an instant, no-nonsense report on speed,
            mobile, SEO, conversion, and app bloat — plus your Black Friday
            readiness score and the fixes that matter most.
          </p>

          <form
            onSubmit={onSubmit}
            noValidate
            className="mt-10 text-left bg-white rounded-2xl ring-1 ring-gray-200 shadow-[0_18px_50px_-24px_rgba(13,153,255,0.35)] p-5 md:p-7"
          >
            <label htmlFor="store-url" className="block text-sm font-semibold text-[#13181E] mb-2">
              Your Shopify store URL
            </label>
            <div className="flex flex-col md:flex-row gap-3">
              <div className="relative flex-1">
                <FiSearch aria-hidden className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400" />
                <input
                  id="store-url"
                  type="url"
                  inputMode="url"
                  autoComplete="url"
                  placeholder="yourstore.com"
                  value={url}
                  onChange={(e) => setUrl(e.target.value)}
                  onBlur={validate}
                  aria-invalid={!!errors.url}
                  aria-describedby={errors.url ? "url-err" : undefined}
                  className="w-full rounded-xl border border-gray-300 pl-10 pr-3 py-3.5 text-base text-[#13181E] placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-[#0D99FF] focus:border-[#0D99FF]"
                />
              </div>
              <button
                type="submit"
                className="group inline-flex items-center justify-center gap-2 rounded-xl bg-[#0D99FF] px-8 py-3.5 text-base font-semibold text-white transition hover:bg-[#0A7ACC] focus:outline-none focus:ring-2 focus:ring-[#0D99FF] focus:ring-offset-2 cursor-pointer whitespace-nowrap"
              >
                Grade my store
                <FiArrowRight aria-hidden className="transition group-hover:translate-x-1" />
              </button>
            </div>
            {errors.url && (
              <p id="url-err" role="alert" className="mt-2 text-sm text-red-600">
                {errors.url}
              </p>
            )}
            {errors.form && (
              <p role="alert" className="mt-4 text-sm text-red-600">
                {errors.form}
              </p>
            )}

            <p className="mt-4 flex items-center gap-2 text-sm text-[#4B5154]">
              <FiLock aria-hidden className="text-[#0D99FF]" />
              Free · no login · instant score · takes ~30 seconds
            </p>
          </form>

          <p className="mt-6 text-sm text-gray-500">
            We test your homepage and a top product page on mobile &amp; desktop
            using Google Lighthouse and Shopify benchmarks.
          </p>
        </div>
      </section>

      {phase === "scanning" && (
        <ScanningOverlay step={step} reduce={!!reduce} url={url} />
      )}
    </main>
  );
}

function ScanningOverlay({ step, reduce, url }: { step: number; reduce: boolean; url: string }) {
  return (
    <div
      className="fixed inset-0 z-[60] flex items-center justify-center bg-[#010A1E]/70 backdrop-blur-sm px-4"
      role="status"
      aria-live="polite"
    >
      <div className="w-full max-w-md rounded-2xl bg-white p-8 text-center shadow-2xl">
        <span
          className={`mx-auto block h-12 w-12 rounded-full border-[3px] border-[#0D99FF]/25 border-t-[#0D99FF] ${
            reduce ? "" : "animate-spin"
          }`}
          aria-hidden
        />
        <h2 className="mt-5 font-display text-xl font-bold text-[#13181E]">
          Auditing your store
        </h2>
        <p className="mt-1 text-sm text-gray-500 break-all">{url}</p>
        <ul className="mt-6 space-y-2.5 text-left">
          {SCAN_STEPS.map((label, i) => {
            const state = i < step ? "done" : i === step ? "active" : "todo";
            return (
              <li key={label} className="flex items-center gap-3 text-sm">
                <span
                  className={`grid h-5 w-5 shrink-0 place-items-center rounded-full text-[11px] font-bold ${
                    state === "done"
                      ? "bg-[#16a34a] text-white"
                      : state === "active"
                        ? "bg-[#0D99FF] text-white"
                        : "bg-gray-200 text-gray-500"
                  }`}
                >
                  {state === "done" ? "✓" : i + 1}
                </span>
                <span className={state === "todo" ? "text-gray-400" : "text-[#13181E]"}>
                  {label}
                </span>
              </li>
            );
          })}
        </ul>
        <motion.div
          className="mt-6 h-1.5 w-full overflow-hidden rounded-full bg-gray-100"
          aria-hidden
        >
          <motion.div
            className="h-full rounded-full bg-[#0D99FF]"
            initial={{ width: "8%" }}
            animate={{ width: `${Math.round(((step + 1) / SCAN_STEPS.length) * 100)}%` }}
            transition={{ duration: reduce ? 0 : 0.5, ease: "easeOut" }}
          />
        </motion.div>
      </div>
    </div>
  );
}
