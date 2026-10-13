"use client";

import { Fragment, useEffect, useState } from "react";
import s from "./bfcm.module.css";

const pad = (n: number) => String(n).padStart(2, "0");

/**
 * Big lime countdown to the EFOLI offer deadline.
 * - Before JS runs (server HTML, slow devices) it shows "--", not a misleading
 *   "00 : 00 : 00 : 00"; the written deadline sits right below it as fallback.
 * - Ticks every second once mounted; digits use tabular figures so nothing shifts.
 * - At zero it says the offer has ended instead of freezing on zeros.
 */
export default function Countdown({ endsAt }: { endsAt: string }) {
  const [left, setLeft] = useState<number | null>(null);

  useEffect(() => {
    const end = new Date(endsAt).getTime();
    const tick = () => setLeft(Math.max(0, end - Date.now()));
    tick();
    const id = setInterval(tick, 1000);
    return () => clearInterval(id);
  }, [endsAt]);

  if (left === 0) {
    return (
      <p className={s.timerEnded} role="status">
        The EFOLI BFCM offer has ended.
      </p>
    );
  }

  const parts = [
    { label: "Days", value: left === null ? null : Math.floor(left / 86_400_000) },
    { label: "Hours", value: left === null ? null : Math.floor((left % 86_400_000) / 3_600_000) },
    { label: "Mins", value: left === null ? null : Math.floor((left % 3_600_000) / 60_000) },
    { label: "Secs", value: left === null ? null : Math.floor((left % 60_000) / 1000) },
  ];

  return (
    <div
      className={s.timer}
      role="timer"
      aria-label="Time remaining in the EFOLI BFCM offer"
      aria-busy={left === null || undefined}
    >
      {parts.map((p, i) => (
        <Fragment key={p.label}>
          {i > 0 && <i aria-hidden="true">:</i>}
          <div>
            <strong>{p.value === null ? "--" : pad(p.value)}</strong>
            <span>{p.label}</span>
          </div>
        </Fragment>
      ))}
    </div>
  );
}
