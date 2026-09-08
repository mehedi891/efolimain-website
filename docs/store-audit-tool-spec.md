# Store Audit Tool — Technical Build Spec

> Implementation plan for the tool researched in
> [store-audit-tool-research.md](./store-audit-tool-research.md).
> Targets this repo: Next.js 16 App Router + React 19 + TS + Tailwind v4, deployed on Vercel.
> **Last updated:** 2026-09-07

---

## 1. Scope

**MVP (v1) — Tier A, fully automatic:**
- **URL only** → server scan → **free teaser** (score + BFCM badge + pillar grades + issue count) →
  **"Unlock full report"** captures email → full detail revealed on-page **and emailed**; lead
  (email + URL + scores) forwarded to eFoli. (Value-first gate — see research §1/§9.)
- Pillars: Page Speed & CWV, SEO & Discoverability, App & Script Health, Trust & Security, Mobile
  (Lighthouse-derived). CRO/Trust *signals* (Tier B) added where cheap.
- Headline **Store Score** + **BFCM Readiness** badge + **Top 5 fixes** + per-pillar accordions.
- Manual/BFCM checklist (Tier C) shown as non-scored guidance.
- CTA into existing contact flow.

**Approach:** fully **deterministic / rule-based — no AI** (see research §4D). Measure → compare to
fixed thresholds → score → render.

**v2:** full Tier B CRO heuristics, shareable saved reports, annotated screenshots, DNS
(DMARC/SPF/DKIM) add-on.

---

## 2. Routes & files (proposed)

Path structure (SEO): a **`/free-tools` hub** + each tool as a keyword-rich child. This tool =
**`efoli.com/free-tools/shopify-store-audit`**. Future tools are siblings (e.g.
`/free-tools/shopify-app-detector`, `/free-tools/roi-calculator`).

```
app/
  free-tools/
    page.tsx                 # /free-tools hub — lists all tools (SEO: topical authority + internal links)
    shopify-store-audit/
      page.tsx               # /free-tools/shopify-store-audit — landing + URL/email form (Server shell)
      AuditForm.tsx          # "use client" — url + email input, submit, scanning state
      report/
        ReportView.tsx       # "use client" — renders a report object (gauge, cards, accordions)
      loading.tsx            # reuse RouteLoading style
  api/
    free-tools/
      store-audit/route.ts        # POST { url } -> deterministic scan -> report JSON (Node)
      store-audit/send/route.ts   # POST { url, email } -> unlock: email report + PDF, forward lead (Node)

lib/
  grader/
    index.ts                 # orchestrator: normalize URL -> run collectors -> score -> report
    fetchHtml.ts             # server-side fetch + parse of storefront HTML
    pagespeed.ts             # PageSpeed Insights API client (mobile + desktop) — incl. screenshots
    screenshots.ts           # extract PSI final-screenshot + filmstrip; upload to Blob/R2 for email
    detectShopify.ts         # confirm Shopify + app-footprint detection
    seo.ts                   # meta/canonical/robots/sitemap/structured-data checks
    trust.ts                 # SSL/badges/policies/consent checks
    cro.ts                   # Tier B DOM heuristics (reviews, ATC, shipping, offer bars)
    scoring.ts               # weights, thresholds, pillar + headline + BFCM rollups
    types.ts                 # Report, Pillar, Check, Grade types
    bfcm.ts                  # countdown + BFCM re-weighting + manual checklist content
    reportHtml.ts            # single source: report object -> on-brand HTML (used by web, PDF, email)
    pdf.ts                   # render report HTML -> PDF via headless Chrome; upload to Blob/R2
    reportEmail.ts           # email: short summary + attach PDF + "view online" link; forward lead
```

Reuse existing: **the nodemailer transport + hCaptcha pattern in `app/api/contact/route.ts`** (for
sending the report email and spam-guarding the form), `components/Form.tsx` (CTA), `RouteLoading.tsx`
(scanning), `SiteChrome` (page chrome), `motion/react` (animations), the `.blog-content details`
accordion CSS pattern (per-pillar detail), `Button`/`ButtonWithIcon`.

**Email required (lead gate):** the form collects URL **and** email; `/api/free-tools/store-audit` validates both,
runs the scan, then (a) emails the full report to the visitor and (b) forwards the lead (email + URL
+ headline Store Score + BFCM score) to eFoli's inbox. Validate email format server-side and
spam-guard the endpoint (hCaptcha as on the contact route, and/or rate-limit) before spending a PSI
call.

---

## 3. Data flow

```
Step 1 — SCAN (URL only)
Client (AuditTool @ /free-tools/shopify-store-audit)
  └─ POST /api/free-tools/store-audit { url }
       ├─ normalize/validate URL
       ├─ (Phase 5) spam-guard + cache lookup
       ├─ parallel collectors:
       │    ├─ pagespeed.ts   (PSI mobile)   ─┐
       │    ├─ pagespeed.ts   (PSI desktop)  ─┤ Promise.all
       │    ├─ scanSite.ts    (home+product+robots+sitemap) ─┘
       ├─ detectShopify + run seo/trust/cro/app checks
       ├─ scoring.ts -> Report JSON (+ screenshot data URIs)
       └─ return Report
  └─ ReportView renders TEASER (score + grades + issue count)

Step 2 — UNLOCK (email capture)
  └─ POST /api/free-tools/store-audit/send { url, email }
       ├─ validate email  ├─ (Phase 5) spam-guard
       ├─ (Phase 4) re-run/attach report -> reportHtml -> pdf.ts (headless Chrome) -> upload pdfUrl
       ├─ (Phase 4) reportEmail.ts: email report + PDF to visitor + forward lead to eFoli
       └─ return { success }
  └─ ReportView reveals FULL detail + "emailed a copy" confirmation
```

Email send and lead-forward (Phase 4) use the shared nodemailer transport (same as `/api/contact`).
Send failures must degrade gracefully — the on-page full report still reveals with a soft "we
couldn't email a copy" notice.

- **Runtime:** Node.js (default Fluid Compute on Vercel) — not Edge. PSI calls + HTML parsing need
  Node; default function timeout is 300s, ample for a ~10–30s scan.
- **Parallelism:** collectors run with `Promise.all`; PSI is the long pole (~10–30s). Consider
  streaming/polling UX if we exceed a comfortable single-request window.
- **PDF generation:** render `reportHtml.ts` output to PDF with **headless Chrome** — Playwright /
  Puppeteer (`@sparticuz/chromium` or Playwright) runs on Vercel **Fluid Compute** (Node, up to 5 GB
  package). Same HTML → identical-looking PDF. Alternatively offload to a screenshot/PDF API if the
  browser package is undesirable. PDF is heavier than the scan, so generate it after scoring and
  cache/host the result (`pdfUrl`).

---

## 4. Types (sketch)

```ts
type Status = "pass" | "warn" | "fail" | "na";
type Tier = "measured" | "signal" | "manual";   // A / B / C

interface Check {
  id: string; label: string; status: Status; tier: Tier;
  value?: string;                      // e.g. "LCP 3.8s"
  impact?: "H" | "M" | "L"; effort?: "H" | "M" | "L";
  fix?: string;                        // one-line recommendation
}
interface Pillar { id: string; label: string; weight: number; score: number; grade: string; checks: Check[]; }
interface Shot { page: "home" | "product" | "collection" | "cart"; device: "mobile" | "desktop";
                 dataUri?: string; hostedUrl?: string; }   // dataUri for on-page, hostedUrl for email
interface Report {
  url: string; email: string; isShopify: boolean; scannedAt: string;
  screenshots: Shot[];                 // real store screenshots from PSI (home + PDP, mobile+desktop)
  pdfUrl?: string;                     // hosted PDF (Blob/R2) — attached to email + downloadable on site
  storeScore: number; grade: string;
  bfcm: { score: number; status: "on-track" | "at-risk" | "not-ready"; daysToBlackFriday: number; };
  pillars: Pillar[];
  topFixes: Check[];                   // prioritized H-impact / L-effort first
  manualChecklist: { label: string; note?: string }[]; // Tier C
}
```

---

## 5. External config / env

- `PAGESPEED_API_KEY` — Google Cloud API key for PSI (project-level Vercel env var).
- **SMTP / nodemailer + hCaptcha env** — reuse the existing vars already configured for
  `/api/contact` (no new mail setup needed); add a lead-notification recipient if it differs.
- Optional cache backend: start with in-memory + `unstable_cache`/route revalidate; graduate to a
  marketplace KV/Redis if we add shareable saved reports (load the `marketplace` skill before
  picking a provider — do not hardcode one).
- **Screenshot hosting** — Vercel Blob / R2 (already in use for CMS media) to host the PSI
  screenshots so the emailed report can reference them by URL (email clients clip base64 images).

---

## 6. Abuse / cost controls (mandatory)

- **Validate + normalize** URL; reject non-http(s), private/internal hosts, obvious non-stores.
- **Rate-limit** by IP (and/or a lightweight token) on `/api/free-tools/store-audit`.
- **Cache per normalized URL** ~24h to protect the 25k/day PSI quota.
- **Timeout + graceful degradation** per collector — if PSI is slow/fails, return partial report with
  the HTML-based pillars rather than erroring the whole scan.
- **Confirm Shopify** before spending a PSI call where possible; still allow generic perf/SEO for
  non-Shopify with a note.

---

## 7. Phased plan

| Phase | Deliverable |
|---|---|
| 0 | ✅ Decisions locked: email gate, Tier-A-first MVP, **no AI**, route `/free-tools/shopify-store-audit`, ephemeral MVP, name "Free Shopify Store Audit". |
| 1 | ✅ **DONE** — `lib/grader` (`types`, `scoring`, `pagespeed`, `bfcm`, `index`) + `/api/free-tools/store-audit`. Deterministic engine tested (weighted pillars, headline renormalization, grades, top-fixes). Performance/Mobile/SEO/Trust pillars from live PSI; CRO/Apps placeholders (Phase 2). Partial-report + note on PSI failure verified. **Needs `PAGESPEED_API_KEY` for real scans** (anon quota 429s). |
| 2 | ✅ **DONE** — `html`, `fetchHtml` (home + product + robots + sitemap), `detectShopify` (domain-specific app footprints), `seo`, `trust`, `cro`, `apps` collectors wired into `index`. Full Tier A scoring across all 6 pillars. **SPA guard**: JS-rendered stores (no server `<title>`) mark HTML-derived checks n/a + note instead of false-failing. Verified live: ColourPop (Liquid) real SEO + 16 apps; Gymshark (headless) correctly skips HTML checks. |
| 3.5 | ✅ **DONE (per-page coverage)** — `fetchHtml` now fetches Home + Product + Collection + Cart; `pages.ts` builds a `PageAudit[]`; product-page speed (mobile PSI) added; every check tagged with its `page` (Home/Collection/Product/Cart/store); new collection/cart CRO signal checks. `ReportView` shows a **"Pages we tested"** section (4 cards, real discovered URLs, per-page checks + speed grade). Verified live on ColourPop. **PDF (Phase 4) = one file containing all pages** (reportHtml renders the whole report incl. page cards). |
| 3 | ✅ **DONE** — `/free-tools` hub + `/free-tools/shopify-store-audit` UI: `AuditTool` (**URL-only** form, scanning overlay), `ReportView` (**value-first teaser** = gauge + BFCM badge + "At a glance" pillar grades + issue count; **`UnlockGate`** email capture → reveals top-5 fixes, 6 pillar accordions, screenshots, manual checklist + emits `/store-audit/send`; dark CTA), `loading.tsx`, sitemap entries. Designed via UI/UX Pro Max skill, brand tokens; react-icons (no emoji), motion + reduced-motion, a11y (labels, inline validation, aria-live, color+icon+text semaphores, tabular figures, focus rings). Build passes; full flow (idle → teaser → unlocked) verified desktop + mobile via Playwright (ColourPop → 85 B). Speed pillars honestly "Not measured" until `PAGESPEED_API_KEY` set. |
| 4 | ✅ **DONE (email + PDF)** — Email = **short engaging body** (`renderReportEmailBody`: score, BFCM badge, "📎 full report attached as PDF", 3 quick-win teasers, CTA) — **not** the full report inline. Full report ships as the **attached PDF** (`renderReportHtml`, all pages → `pdf.ts` headless Chrome). `pdf.ts` uses `@sparticuz/chromium` on Vercel and **system Chrome locally** (verified 268 KB locally). Static docs (email/PDF) show **"Black Friday · Nov 27, 2026"** (a date, since they can't tick — the on-page report keeps the live countdown). `reportEmail.ts` sends body + PDF to visitor + forwards lead; reveal happens regardless of email success. `next.config` `serverExternalPackages` for Chrome deps. |
| 5 | ✅ **DONE (hardening)** — `cache.ts` (per-URL 1h TTL, verified `cached:true` on repeat), `rateLimit.ts` (12/10min per IP on scan + send), **bot-wall detection** (`looksBlocked` catches Vercel/Cloudflare interstitials even with a `<title>` → partial + note + page status "blocked"), Graceful partial/non-Shopify/email-failure states already in place. (hCaptcha on unlock was **removed by request** — kept frictionless; rate-limit guards abuse.) Unlock UX = **show-all with a faded bottom shade** over the locked sections + unlock card, not a hard hide. Note: in-memory cache/limit are per-instance — durable = KV later. |
| 6 | (v2) LLM summary layer, shareable saved reports, annotated screenshots (LCP/CLS markers), DNS add-on. |
| SEO+AI cluster | ✅ **DONE (3 evergreen tools)** — shared `lib/tools` framework (`http`, `types`, `cache`, `score`, `registry`, generic `email`/`reportHtml`) + `components/tools/ToolShell` (generic form → scan → free-teaser → faded lock → email unlock, no captcha) + shared APIs `/api/free-tools/scan` + `/scan/send`. Tools: **Meta & Social Preview** (Google + social card previews), **Structured Data Checker** (Product/Org/Breadcrumb JSON-LD + missing fields), **AI Visibility Checker** (AI-crawler access + generated llms.txt). No PageSpeed (fetch/parse only) → fast, quota-free. All prerender; verified live on ColourPop (Meta 95/A, AI 100/A, Schema 90/A). On hub + sitemap. Adding a 4th tool = one analyzer + one thin client page. |

---

## 8. Testing

- Golden-set of real Shopify stores (fast/slow, app-heavy/lean, good/bad SEO) → snapshot expected
  grades to catch scoring regressions.
- Verify PSI mobile + desktop parsing against known PSI web results.
- Playwright pass on `/free-tools/shopify-store-audit` (form, scanning, report render) as with prior phases.
- Load/timeout behavior: simulate slow PSI, ensure partial-report fallback.
