"use client";

import { useEffect, useRef, useState } from "react";
import { useInView, animate } from "motion/react";

interface CounterTextProps {
  start?: number;
  end?: number;
  duration?: number;
  once?: boolean;
  className?: string;
}

export default function CounterText({
  start = 1,
  end = 15,
  duration = 1200,
  once = true,
  className = "",
}: CounterTextProps) {
  const [value, setValue] = useState(start);
  const ref = useRef(null);
  const inView = useInView(ref, {
    amount: 0.15,
    margin: "0px 0px -10% 0px",
    once,
  });

  useEffect(() => {
    if (!inView) return;

    const controls = animate(start, end, {
      type: "spring",
      stiffness: 140,
      damping: 20,
      onUpdate: (v) => setValue(Math.floor(v)),
    });

    return () => controls.stop();
  }, [inView, start, end, duration]);

  return (
    <span ref={ref} className={className} aria-live="polite">
      {value}+
    </span>
  );
}
