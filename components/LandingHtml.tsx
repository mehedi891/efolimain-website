"use client";

import { useEffect, useRef } from "react";

/**
 * Renders a CMS landing page's HTML exactly as received (no sanitizing) and
 * makes its <script> tags run — exactly once, in document order.
 *
 * Two ways this HTML reaches the browser:
 *
 * 1. Full page load (the usual case, e.g. from an ad): the HTML is part of the
 *    server-rendered document, so the browser's HTML parser already runs its
 *    scripts. Re-creating them would run every script a second time, so we
 *    leave them alone. The server marks its markup with `data-ssr` to tell us.
 *
 * 2. Client-side navigation: React inserts the HTML with innerHTML, and
 *    browsers never execute scripts inserted that way. We re-create each one.
 *    An external script is awaited before the next script runs, like the
 *    parser would, so `<script src=lib.js>` + `<script>Lib.init()</script>`
 *    (e.g. HubSpot / Typeform embeds) works. `async` scripts aren't awaited.
 *
 * Content scripts that wait for DOMContentLoaded / window.onload only work on
 * a full page load: on client navigation those events have already fired.
 */
export default function LandingHtml({ html }: { html: string }) {
  const ref = useRef<HTMLDivElement>(null);
  // The html whose scripts have been handled. Guards against Strict Mode's
  // double effect in dev without cancelling the in-flight script chain.
  const handledFor = useRef<string | null>(null);

  useEffect(() => {
    const root = ref.current;
    if (!root || handledFor.current === html) return;
    handledFor.current = html;

    // Case 1: server-rendered — the parser already ran these scripts.
    if (root.hasAttribute("data-ssr")) {
      root.removeAttribute("data-ssr");
      return;
    }

    // Case 2: inserted via innerHTML — re-create the scripts, in order.
    void runScriptsInOrder(root);
  }, [html]);

  return (
    <div
      ref={ref}
      // Present only in the server-rendered HTML (see case 1 above).
      data-ssr={typeof window === "undefined" ? "" : undefined}
      // The server/client data-ssr difference is intentional, and the content's
      // own scripts may already have changed the DOM before hydration.
      suppressHydrationWarning
      dangerouslySetInnerHTML={{ __html: html }}
    />
  );
}

async function runScriptsInOrder(root: HTMLElement) {
  // Snapshot first: scripts we run may inject more <script> tags, and those
  // already execute on their own.
  for (const old of Array.from(root.querySelectorAll("script"))) {
    // The content was replaced or unmounted mid-way: stop this chain.
    if (!root.isConnected || !root.contains(old)) return;

    const script = document.createElement("script");
    for (const attr of Array.from(old.attributes)) {
      script.setAttribute(attr.name, attr.value);
    }
    script.text = old.text;

    const external = old.hasAttribute("src");
    const awaitLoad = external && !old.hasAttribute("async");
    let loaded: Promise<void> | undefined;
    if (awaitLoad) {
      script.async = false; // dynamically created scripts default to async
      loaded = new Promise<void>((resolve) => {
        script.onload = script.onerror = () => resolve();
      });
    }

    old.replaceWith(script); // inline scripts run right here
    if (loaded) await loaded;
  }
}
