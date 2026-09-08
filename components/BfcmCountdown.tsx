"use client";

import { useEffect, useState } from "react";

/** Black Friday 2026 = Fri Nov 27; Cyber Monday = Mon Nov 30. */
const BLACK_FRIDAY = new Date("2026-11-27T00:00:00Z");

interface Parts {
  d: number;
  h: number;
  m: number;
  s: number;
}

function pad(n: number): string {
  return String(n).padStart(2, "0");
}

/**
 * Live, futuristic countdown to Black Friday — segmented digit tiles with a
 * blinking pulse dot. Ticks every second (client-only after mount to avoid
 * hydration mismatch; renders a stable placeholder on first paint).
 *
 * `align` controls the caption/tiles alignment ("center" for the tool hero,
 * "start" for the left-aligned hub hero).
 */
export default function BfcmCountdown({
  align = "center",
  variant = "tiles",
}: {
  align?: "center" | "start";
  /** "tiles" = big futuristic digit tiles; "inline" = compact ticking text. */
  variant?: "tiles" | "inline";
}) {
  const [t, setT] = useState<Parts | null>(null);

  useEffect(() => {
    const tick = () => {
      const diff = Math.max(0, BLACK_FRIDAY.getTime() - Date.now());
      setT({
        d: Math.floor(diff / 86_400_000),
        h: Math.floor(diff / 3_600_000) % 24,
        m: Math.floor(diff / 60_000) % 60,
        s: Math.floor(diff / 1000) % 60,
      });
    };
    tick();
    const id = setInterval(tick, 1000);
    return () => clearInterval(id);
  }, []);

  const segments: Array<{ label: string; value: string; live?: boolean }> = [
    { label: "Days", value: t ? String(t.d) : "--" },
    { label: "Hrs", value: t ? pad(t.h) : "--" },
    { label: "Min", value: t ? pad(t.m) : "--" },
    { label: "Sec", value: t ? pad(t.s) : "--", live: true },
  ];

  if (variant === "inline") {
    return (
      <span className="tabular-nums">
        {t ? `${t.d}d ${pad(t.h)}h ${pad(t.m)}m ${pad(t.s)}s to Black Friday` : "Black Friday · Nov 27"}
      </span>
    );
  }

  const alignCls = align === "start" ? "items-start" : "items-center";

  return (
    <div className={`inline-flex flex-col gap-3 ${alignCls}`}>
      {/* caption + blinking dot */}
      <span className="inline-flex items-center gap-2 text-xs font-semibold uppercase tracking-[0.18em] text-[#0D99FF]">
        <span className="relative flex h-2.5 w-2.5" aria-hidden>
          <span className="absolute inline-flex h-full w-full rounded-full bg-[#0D99FF] opacity-75 motion-safe:animate-ping" />
          <span className="relative inline-flex h-2.5 w-2.5 rounded-full bg-[#0D99FF]" />
        </span>
        BFCM 2026 · Black Friday countdown
      </span>

      {/* digit tiles */}
      <div className="flex items-stretch gap-2 sm:gap-3" aria-label="Countdown to Black Friday">
        {segments.map((seg, i) => (
          <div key={seg.label} className="flex items-center gap-2 sm:gap-3">
            <div className="flex flex-col items-center">
              <div
                className="relative min-w-[56px] overflow-hidden rounded-xl bg-gradient-to-b from-[#0b1424] to-[#010A1E] px-3 py-2.5 text-center ring-1 ring-white/10 shadow-[0_10px_30px_-12px_rgba(13,153,255,0.55)]"
              >
                {/* subtle top accent line for the "futuristic" panel look */}
                <span
                  aria-hidden
                  className="absolute inset-x-3 top-0 h-px bg-gradient-to-r from-transparent via-[#0D99FF]/70 to-transparent"
                />
                <span
                  className={`block font-display text-2xl sm:text-3xl font-bold tabular-nums text-white ${
                    seg.live ? "[text-shadow:0_0_14px_rgba(13,153,255,0.9)]" : "[text-shadow:0_0_10px_rgba(13,153,255,0.45)]"
                  }`}
                >
                  {seg.value}
                </span>
              </div>
              <span className="mt-1.5 text-[10px] font-semibold uppercase tracking-[0.15em] text-[#9fa5a7]">
                {seg.label}
              </span>
            </div>
            {i < segments.length - 1 && (
              <span aria-hidden className="pb-4 text-lg font-bold text-[#0D99FF]/40">
                :
              </span>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
