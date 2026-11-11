"use client";

import { useEffect } from "react";

/**
 * Microsoft Clarity (session recordings + heatmaps), loaded as late as possible
 * so it never competes with the page for bandwidth or main-thread time.
 *
 * - Production only: runs on PRODUCTION_HOSTS, so localhost and Vercel preview
 *   traffic never reaches the Clarity project.
 * - Lazy: the tag is added after the visitor's first scroll, mousemove,
 *   touchstart, keydown or click, or after IDLE_FALLBACK_MS with no interaction,
 *   whichever comes first. Even then it waits for an idle moment, so it never
 *   delays the interaction that triggered it.
 * - Once: a window flag stops a second tag across remounts (two tags trigger
 *   Clarity's "CL001 Multiple Clarity tags" warning).
 * - No cookie banner: like GA4 (app/layout.tsx), Clarity loads for every
 *   visitor, and we tell it analytics storage is granted and ad storage denied
 *   (Clarity Consent API v2).
 * - Clarity follows client-side route changes itself, so no page-view code.
 * - If an ad blocker blocks clarity.ms, the queue stub stays in place: any
 *   window.clarity(...) call just queues and nothing throws.
 */

/** Clarity project ID; NEXT_PUBLIC_CLARITY_ID overrides it at build time. */
const CLARITY_ID = process.env.NEXT_PUBLIC_CLARITY_ID?.trim() || "zbyc4zn6eb";
const PRODUCTION_HOSTS = ["efoli.com", "www.efoli.com"];
const INTERACTION_EVENTS = ["scroll", "mousemove", "touchstart", "keydown", "click"] as const;
/** Load anyway after this long without an interaction. */
const IDLE_FALLBACK_MS = 5000;
/** Upper bound on waiting for an idle moment once loading is triggered. */
const IDLE_TIMEOUT_MS = 2000;

type ClarityQueue = ((...args: unknown[]) => void) & { q?: IArguments[] };

declare global {
  interface Window {
    clarity?: ClarityQueue;
    __efoliClarityLoaded?: boolean;
  }
}

function addClarityTag() {
  if (window.__efoliClarityLoaded === true) return;
  window.__efoliClarityLoaded = true;

  // Clarity's own queue stub: calls made before clarity.js arrives are queued
  // as the real `arguments` object and replayed once it loads. The typeof
  // check (instead of the snippet's `||`) ignores an element that a CMS post
  // gave id="clarity", which the browser also exposes as window.clarity.
  if (typeof window.clarity !== "function") {
    window.clarity = function () {
      // eslint-disable-next-line prefer-rest-params -- vendor queue format
      (window.clarity!.q = window.clarity!.q || []).push(arguments);
    };
  }
  window.clarity("consentv2", { ad_Storage: "denied", analytics_Storage: "granted" });

  const script = document.createElement("script");
  script.id = "clarity";
  script.async = true;
  script.src = `https://www.clarity.ms/tag/${CLARITY_ID}`;
  document.head.appendChild(script);
}

export default function MicrosoftClarity() {
  useEffect(() => {
    if (window.__efoliClarityLoaded === true) return;
    if (!PRODUCTION_HOSTS.includes(window.location.hostname)) return;

    let idleHandle: number | undefined;
    let timeoutHandle: number | undefined;

    function stopWaiting() {
      for (const type of INTERACTION_EVENTS) window.removeEventListener(type, schedule);
      window.clearTimeout(fallbackHandle);
    }

    function schedule() {
      stopWaiting();
      // Safari has no requestIdleCallback; a 0 ms timeout still lets the
      // triggering interaction finish first.
      if (typeof window.requestIdleCallback === "function") {
        idleHandle = window.requestIdleCallback(addClarityTag, { timeout: IDLE_TIMEOUT_MS });
      } else {
        timeoutHandle = window.setTimeout(addClarityTag, 0);
      }
    }

    for (const type of INTERACTION_EVENTS) {
      window.addEventListener(type, schedule, { passive: true, once: true });
    }
    const fallbackHandle = window.setTimeout(schedule, IDLE_FALLBACK_MS);

    return () => {
      stopWaiting();
      if (idleHandle !== undefined) window.cancelIdleCallback(idleHandle);
      window.clearTimeout(timeoutHandle);
    };
  }, []);

  return null;
}
