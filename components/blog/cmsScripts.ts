"use client";

import { useEffect, type RefObject } from "react";

/**
 * CMS post bodies can contain custom HTML blocks with inline <script>s (e.g.
 * the BFCM app cards' scroll-reveal + Copy buttons). We render the body with
 * dangerouslySetInnerHTML, and browsers NEVER run <script>s inserted via
 * innerHTML — so after a client-side navigation those blocks stayed hidden
 * (opacity 0 until their script ran), while a direct page load worked.
 *
 * Fix: mark executable scripts inert in the HTML string (so a direct load
 * doesn't run them at parse time), then run each exactly once on the client
 * after the body is in the DOM. Same behaviour for direct loads and client
 * navigations, never double-run. Non-JS scripts (JSON-LD etc.) are untouched,
 * so structured data stays in the server HTML.
 */

const DEFERRED = "text/x-cms-deferred";
const JS_TYPES = new Set(["", "text/javascript", "application/javascript", "module"]);

/** Pure + deterministic (same on server and client), so hydration matches. */
export function deferCmsScripts(html: string): string {
  return html.replace(/<script\b([^>]*)>/gi, (tag, attrs: string) => {
    const type = (attrs.match(/\btype\s*=\s*["']?([^"'\s>]+)["']?/i)?.[1] ?? "").toLowerCase();
    if (!JS_TYPES.has(type)) return tag;
    const rest = attrs.replace(/\btype\s*=\s*["']?[^"'\s>]+["']?/i, "");
    const original = type ? ` data-cms-type="${type}"` : "";
    return `<script type="${DEFERRED}"${original}${rest}>`;
  });
}

/**
 * Run the deferred scripts inside `ref` once per `html`. Replacing each inert
 * <script> with a DOM-created copy makes the browser execute it in place. It's
 * naturally idempotent: executed scripts lose the deferred type, so a re-run
 * (React Strict Mode, re-render) finds nothing left to execute.
 */
export function useRunCmsScripts(ref: RefObject<HTMLElement | null>, html: string): void {
  useEffect(() => {
    const root = ref.current;
    if (!root) return;
    root.querySelectorAll<HTMLScriptElement>(`script[type="${DEFERRED}"]`).forEach((inert) => {
      const live = document.createElement("script");
      for (const { name, value } of Array.from(inert.attributes)) {
        if (name !== "type" && name !== "data-cms-type") live.setAttribute(name, value);
      }
      const original = inert.getAttribute("data-cms-type");
      if (original) live.type = original;
      live.text = inert.text;
      inert.replaceWith(live);
    });
  }, [ref, html]);
}
