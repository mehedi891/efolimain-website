"use client";

import { useEffect, useRef, useState } from "react";

async function copyText(text: string): Promise<boolean> {
  try {
    if (navigator.clipboard && window.isSecureContext) {
      await navigator.clipboard.writeText(text);
      return true;
    }
  } catch {
    /* fall through to the legacy path */
  }
  // Non-secure contexts (plain http) lack the Clipboard API.
  try {
    const ta = document.createElement("textarea");
    ta.value = text;
    ta.setAttribute("readonly", "");
    ta.style.position = "fixed";
    ta.style.opacity = "0";
    document.body.appendChild(ta);
    ta.select();
    const ok = document.execCommand("copy");
    ta.remove();
    return ok;
  } catch {
    return false;
  }
}

export default function CopyButton({
  text,
  className,
  label = "Copy",
  resetMs = 2000,
  srContext,
}: {
  text: string;
  className?: string;
  label?: string;
  resetMs?: number;
  /** Extra screen-reader-only context, e.g. "code BFCM50" (keeps the visible label short). */
  srContext?: string;
}) {
  const [state, setState] = useState<"idle" | "ok" | "fail">("idle");
  const timer = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => () => {
    if (timer.current) clearTimeout(timer.current);
  }, []);

  async function onClick() {
    const ok = await copyText(text);
    setState(ok ? "ok" : "fail");
    if (timer.current) clearTimeout(timer.current);
    timer.current = setTimeout(() => setState("idle"), resetMs);
  }

  return (
    <button type="button" className={className} onClick={onClick} aria-live="polite">
      {state === "ok" ? "Copied!" : state === "fail" ? "Select to copy" : label}
      {state === "idle" && srContext && <span className="sr-only"> {srContext}</span>}
    </button>
  );
}
