"use client";

import { Fragment, useEffect, useState } from "react";
import s from "./bfcm.module.css";

const pad = (n: number) => String(n).padStart(2, "0");

/**
 * Big lime countdown to the campaign close. Renders "00" on the server and on
 * first paint (avoids a hydration mismatch), then ticks every second.
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

  const ms = left ?? 0;
  const parts = [
    { label: "Days", value: Math.floor(ms / 86_400_000) },
    { label: "Hours", value: Math.floor((ms % 86_400_000) / 3_600_000) },
    { label: "Mins", value: Math.floor((ms % 3_600_000) / 60_000) },
    { label: "Secs", value: Math.floor((ms % 60_000) / 1000) },
  ];

  return (
    <div className={s.timer} role="timer" aria-label="Time remaining in the eFoli BFCM campaign">
      {parts.map((p, i) => (
        <Fragment key={p.label}>
          {i > 0 && <i aria-hidden="true">:</i>}
          <div>
            <strong>{pad(p.value)}</strong>
            <span>{p.label}</span>
          </div>
        </Fragment>
      ))}
    </div>
  );
}
