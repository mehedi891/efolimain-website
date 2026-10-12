"use client";

import { useEffect, useState } from "react";

/**
 * Counts the hero discount up to `to` (ease-out, ~1.4s). The server renders the
 * final number, so no-JS and reduced-motion visitors simply see "30".
 */
export default function HeroCount({ to }: { to: number }) {
  const [n, setN] = useState(to);

  useEffect(() => {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    let raf = 0;
    let t0: number | null = null;
    const step = (t: number) => {
      if (t0 === null) t0 = t;
      const p = Math.min(1, (t - t0) / 1400);
      setN(Math.round(to * (1 - Math.pow(1 - p, 3))));
      if (p < 1) raf = requestAnimationFrame(step);
    };
    raf = requestAnimationFrame(step);
    return () => cancelAnimationFrame(raf);
  }, [to]);

  return <>{n}</>;
}
