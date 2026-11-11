"use client";

import { useEffect, type RefObject } from "react";

/**
 * Behaviour for CMS custom HTML blocks (<div data-html-block>). The server-side
 * sanitizer (lib/cmsHtml.ts) strips every <script> from post bodies, so the two
 * things those block scripts did are done here instead, for any block that
 * follows the same markup:
 *
 * - Reveal: an element with a class ending in "-reveal" (e.g. ".mv-card
 *   .mv-reveal") gets "is-visible" once 12% of it is in the viewport. The
 *   block's own CSS does the animation (and honours reduced motion).
 * - Copy: a <button data-<prefix>-copy="CODE"> copies CODE, then shows
 *   "Copied" with an "is-copied" class for 1.8 s before restoring its label.
 *
 * Runs whenever the post body changes, so direct loads and client-side
 * navigations behave the same.
 */

const BLOCK = "[data-html-block]";
const COPY_ATTR = /^data-[a-z0-9-]+-copy$/;
const REVEAL_THRESHOLD = 0.12;
const COPIED_MS = 1800;

function copyText(text: string): Promise<void> {
  const fallback = () => {
    const textarea = document.createElement("textarea");
    textarea.value = text;
    textarea.setAttribute("readonly", "");
    textarea.style.position = "fixed";
    textarea.style.opacity = "0";
    document.body.appendChild(textarea);
    textarea.select();
    try {
      document.execCommand("copy");
    } finally {
      textarea.remove();
    }
  };
  if (navigator.clipboard?.writeText) {
    return navigator.clipboard.writeText(text).catch(fallback);
  }
  fallback();
  return Promise.resolve();
}

export function useCmsBlocks(ref: RefObject<HTMLElement | null>, html: string): void {
  useEffect(() => {
    const root = ref.current;
    if (!root) return;

    // Reveal
    const revealables = Array.from(
      root.querySelectorAll<HTMLElement>(`${BLOCK} [class*="-reveal"]`)
    ).filter((el) => Array.from(el.classList).some((name) => name.endsWith("-reveal")));
    let observer: IntersectionObserver | undefined;
    if (typeof IntersectionObserver === "function") {
      const io = new IntersectionObserver(
        (entries) => {
          for (const entry of entries) {
            if (!entry.isIntersecting) continue;
            entry.target.classList.add("is-visible");
            io.unobserve(entry.target);
          }
        },
        { threshold: REVEAL_THRESHOLD }
      );
      revealables.forEach((el) => io.observe(el));
      observer = io;
    } else {
      revealables.forEach((el) => el.classList.add("is-visible"));
    }

    // Copy buttons (one delegated listener)
    const copied = new Map<HTMLElement, { label: string | null; timer: number }>();
    function onClick(event: MouseEvent) {
      const button = (event.target as Element | null)?.closest<HTMLElement>(`${BLOCK} button`);
      if (!button || !root?.contains(button)) return;
      const attr = button.getAttributeNames().find((name) => COPY_ATTR.test(name));
      if (!attr) return;

      void copyText(button.getAttribute(attr) ?? "").then(() => {
        const previous = copied.get(button);
        if (previous) window.clearTimeout(previous.timer);
        const label = previous ? previous.label : button.textContent;
        button.textContent = "Copied";
        button.classList.add("is-copied");
        const timer = window.setTimeout(() => {
          button.textContent = label;
          button.classList.remove("is-copied");
          copied.delete(button);
        }, COPIED_MS);
        copied.set(button, { label, timer });
      });
    }
    root.addEventListener("click", onClick);

    return () => {
      observer?.disconnect();
      root.removeEventListener("click", onClick);
      copied.forEach(({ timer }) => window.clearTimeout(timer));
    };
  }, [ref, html]);
}
