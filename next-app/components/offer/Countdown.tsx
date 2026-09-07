"use client";

import { useEffect, useMemo, useState } from "react";

interface TimeLeft {
  days: number;
  hours: number;
  minutes: number;
  seconds: number;
}

/**
 * Timer3 props
 *  - endDate: string | number | Date  (required)
 *      Examples:
 *        "2026-01-01T00:00:00Z"      // UTC ISO
 *        "2026-01-01 00:00:00"       // local time (see interpretAsLocal)
 *        Date.now() + 30*864e5       // timestamp ms
 *        new Date("2026-01-01T00:00:00Z")
 *  - interpretAsLocal: boolean (default false)
 *      If true and endDate is a string w/o timezone, treat as local time.
 *  - onComplete: () => void (optional)
 */
interface Timer3Props {
  endDate: string | number | Date;
  interpretAsLocal?: boolean;
  onComplete?: () => void;
  /** Accepted for markup parity with the original page; not used internally. */
  persistKey?: string;
}

const Timer3 = ({ endDate, interpretAsLocal = false, onComplete }: Timer3Props) => {
  const [timeLeft, setTimeLeft] = useState<TimeLeft>({
    days: 0, hours: 0, minutes: 0, seconds: 0,
  });

  // Parse endDate once
  const endTs = useMemo(() => {
    if (endDate instanceof Date) return endDate.getTime();
    if (typeof endDate === "number") return endDate;

    if (typeof endDate === "string") {
      // If string has 'Z' or timezone offset, Date will parse as absolute.
      // If no timezone and interpretAsLocal = true, coerce to local by replacing
      // space with 'T' and not appending 'Z'.
      const looksLikeLocal = interpretAsLocal && !/[zZ]|[+\-]\d{2}:?\d{2}$/.test(endDate);
      if (looksLikeLocal) {
        // Accept "YYYY-MM-DD HH:mm[:ss]" -> "YYYY-MM-DDTHH:mm[:ss]"
        const normalized = endDate.trim().replace(" ", "T");
        const d = new Date(normalized);
        return isNaN(d.getTime()) ? NaN : d.getTime();
      }
      const d = new Date(endDate);
      return isNaN(d.getTime()) ? NaN : d.getTime();
    }

    return NaN;
  }, [endDate, interpretAsLocal]);

  useEffect(() => {
    if (!endTs || Number.isNaN(endTs)) {
      console.warn("Timer3: invalid endDate", endDate);
      setTimeLeft({ days: 0, hours: 0, minutes: 0, seconds: 0 });
      return;
    }

    const tick = () => {
      const diff = endTs - Date.now();
      if (diff <= 0) {
        setTimeLeft({ days: 0, hours: 0, minutes: 0, seconds: 0 });
        if (onComplete) onComplete();
        return true; // finished
      }
      const days = Math.floor(diff / 86400000);
      const hours = Math.floor((diff % 86400000) / 3600000);
      const minutes = Math.floor((diff % 3600000) / 60000);
      const seconds = Math.floor((diff % 60000) / 1000);
      setTimeLeft({ days, hours, minutes, seconds });
      return false;
    };

    // initial + interval
    const doneInitially = tick();
    if (doneInitially) return;
    const id = setInterval(() => {
      const done = tick();
      if (done) clearInterval(id);
    }, 1000);

    return () => clearInterval(id);
  }, [endTs, endDate, onComplete]);

  const pad = (n: number) => String(n).padStart(2, "0");

  return (
    <div className="flex justify-center gap-3 sm:gap-8">
      {/* Days */}
      <Box label={timeLeft.days === 1 ? "Day" : "Days"} value={pad(timeLeft.days)} />
      {/* Hours */}
      <Box label={timeLeft.hours === 1 ? "Hour" : "Hours"} value={pad(timeLeft.hours)} />
      {/* Minutes */}
      <Box label={timeLeft.minutes === 1 ? "Minute" : "Minutes"} value={pad(timeLeft.minutes)} />
      {/* Seconds */}
      <Box label={timeLeft.seconds === 1 ? "Second" : "Seconds"} value={pad(timeLeft.seconds)} />
    </div>
  );
};

interface BoxProps {
  value: string;
  label: string;
}

const Box = ({ value, label }: BoxProps) => (
  <div className="h-16 w-16 sm:w-32 sm:h-32 lg:w-40 lg:h-40 flex flex-col justify-center gap-3 items-center bg-[#00000080] rounded-lg">
    <span className="lg:text-7xl sm:text-6xl text-3xl font-semibold text-[#a5b4fc]">
      {value}
    </span>
    <span className="text-[#8486A9] text-xs sm:text-2xl text-center capitalize">
      {label}
    </span>
  </div>
);

export default Timer3;
