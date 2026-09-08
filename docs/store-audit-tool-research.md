# Shopify Store Audit Tool — Research & Scoring Criteria

> **Working name:** eFoli Store Grader (BFCM Edition)
> **Type:** Public, self-serve lead-gen tool — "Submit your store URL → get a free readiness report."
> **Primary campaign:** Shopify BFCM 2026 (Black Friday **Fri Nov 27, 2026**, Cyber Monday **Mon Nov 30, 2026**).
> **Status:** Research + criteria. See [store-audit-tool-spec.md](./store-audit-tool-spec.md) for the build plan.
> **Last updated:** 2026-09-07

---

## 1. Goal & positioning

Build a page where **anyone can paste their Shopify store URL** and, within ~30–60 seconds, get a
**visual "readiness report"** scoring their store across performance, conversion, mobile, SEO, trust,
and app health — with **specific, prioritized fixes**. The report ends with a soft CTA to eFoli's
Shopify services (development, CRO, support).

**Why this is right for eFoli specifically:**
- eFoli sells Shopify apps + Shopify development/CRO/support services. This tool is a **qualified
  lead magnet** — the report surfaces exactly the problems eFoli fixes, then offers a call.
- It's timely: BFCM is the single biggest revenue window of the year. A "Is your store ready for
  Black Friday?" hook has natural urgency and shareability.
- It reuses infra we already have (Next.js App Router, the CMS, the contact/email pipeline).

**The model (mirrors [fixmystore.com](https://fixmystore.com/)):**

```
Enter store URL  →  Automated analysis  →  Teaser (score + grades) on-page
      →  "Unlock full report" (enter email)  →  Full report revealed + emailed  →  CTA
```

**Lead gate (decided — value-first unlock):** the visitor submits **only the store URL** and
immediately sees a **free teaser**: the headline Store Score, BFCM readiness badge, and per-pillar
grades ("At a glance"), plus a count of issues found. The **detailed breakdown, prioritized fixes,
screenshots, and BFCM checklist are gated** behind an **"Unlock full report"** button that captures
the email. On unlock, the full report is revealed on-page **and emailed** to that address, and the
lead is forwarded to eFoli. This shows value before asking for the email, which converts better than
an upfront email requirement.

fixmystore positions itself as **"Powered by AI. Reviewed by humans"** and runs five audits:
AI CRO, AI SEO, Mobile Experience, Page Speed, and AI App Performance. Our criteria below cover the
same surface area and add an explicit **BFCM Readiness** overlay, which is our differentiator for
the season.

---

## 2. Competitor / reference analysis — fixmystore.com

| Aspect | What they do | Our takeaway |
|---|---|---|
| Input | Store URL + pick which audits to run | Same. Default to "run all," let power users narrow. |
| Audits | CRO, SEO (incl. ChatGPT/AI discoverability), Mobile, Page Speed, App Performance | Adopt the same 5 pillars; add a **BFCM Readiness** score on top. |
| Positioning | "Powered by AI. Reviewed by humans" | Hybrid is the honest framing — automated scan + optional human/agency follow-up (eFoli). |
| Promise | Specific steps, "no code changes needed" | Each finding must be **actionable** with impact/effort, not just a red X. |
| Audience | Store owners, agencies, dropshippers, marketers | Same. Our CTA leans to owners who want it done-for-them. |

**Gaps we can beat them on:** a single **headline score + shareable report card**, a **BFCM
countdown/urgency** frame, and tying findings to concrete eFoli services (and our own apps where
genuinely relevant — disclosed, not spammy).

---

## 3. Feasibility — what a URL can actually tell us

This is the crux. A visitor gives us **only a URL**. Everything in the report must come from what we
can fetch or query about that public storefront. Findings split into three tiers:

### Tier A — Fully automatic (lab/field data + HTML parsing) ✅
Reliable, no login, computable in seconds. **This is the MVP.**

- **Performance / Core Web Vitals** via **Google PageSpeed Insights API** (Lighthouse under the
  hood). Returns lab scores + field data (CrUX): LCP, INP, CLS, TTFB, plus Performance/SEO/
  Accessibility/Best-Practices scores and specific "opportunities." Free tier: 25,000 req/day, API
  key only (no OAuth). One URL per request; run mobile + desktop strategies.
- **HTML/DOM scan** of the fetched storefront: meta tags, title, canonical, `<h1>`, Open Graph,
  favicon, viewport, image `alt`/`loading`, inline vs. external scripts, count/size of third-party
  scripts.
- **Structured data**: presence + validity of JSON-LD (`Product`, `Organization`, `BreadcrumbList`),
  Shopify theme schema output.
- **Technical SEO files**: `robots.txt` (incl. whether AI crawlers are blocked), `sitemap.xml`,
  canonical tags, HTTP status/redirect chain, HTTPS/SSL.
- **Shopify detection + app footprint**: confirm it's Shopify (`cdn.shopify.com`, `Shopify.theme`,
  `x-shopify` headers); detect installed apps by their storefront footprints — `shopify://apps/`
  app-block comments, known script domains, CSS class prefixes (the Wappalyzer approach). Count
  render-blocking / heavy third-party scripts.
- **Trust/CRO signals detectable in HTML**: presence of a reviews widget, trust badges near
  add-to-cart, announcement bar, free-shipping bar, countdown timer, sticky ATC, cookie/consent
  banner blocking first paint, number of pop-ups.
- **Mobile technical**: viewport meta, tap-target and CLS signals (from Lighthouse mobile run),
  responsive image usage.

### Tier B — Automatic but heuristic / lower confidence ⚠️
Detectable but with false-positive risk; label as "signals," soft-weight them.

- Whether shipping/returns info appears near ATC (keyword + DOM heuristics).
- Whether guest checkout / Shop Pay / Apple Pay / Google Pay wallets are surfaced (footprint on
  cart/product pages; true checkout is gated).
- Product-page proof density (review count text, rating stars, UGC).
- Homepage "sale readiness" (seasonal hero, sale collection links, countdown) — keyword/DOM based.

### Tier C — Not reachable from a URL (exclude or mark "manual") ❌
Be explicit that we **don't** score these automatically — say so, and offer the human review (eFoli).

- Real checkout completion, discount-code correctness, payment success, order-confirmation emails.
- Inventory forecasting, ABC analysis, fulfillment/logistics, staffing.
- Analytics/attribution correctness, cohort/economics (AOV, COGS, CAC).
- Email deliverability records (DMARC/SPF/DKIM) unless we add DNS lookups (optional Tier B add-on).
- Actual copy quality / brand fit (this is where "reviewed by humans" earns its keep).

> **Honesty principle:** the automated report scores Tier A/B and clearly frames Tier C as "needs a
> human audit" — which is the natural handoff to eFoli. Never imply we tested checkout when we didn't.

---

## 4. The scoring criteria (the report card)

Six pillars. Five mirror fixmystore + a **BFCM Readiness** overlay that re-weights the same signals
for the season. Each pillar rolls up weighted checks into a **0–100 score** and a **letter grade**;
the six pillars roll up into one **headline Store Score (0–100)**.

**Suggested pillar weights (headline score):**

| Pillar | Weight | Why |
|---|---:|---|
| 1. Page Speed & Core Web Vitals | 25% | Direct conversion multiplier; every 1s delay ≈ −7% conv. |
| 2. Mobile Experience | 20% | >70% of Shopify traffic is mobile; mobile converts 50–60% lower. |
| 3. Conversion (CRO) | 20% | Trust, proof, ATC, offer clarity — where revenue leaks. |
| 4. SEO & Discoverability | 15% | Organic + AI-search visibility (ChatGPT/LLM crawlers). |
| 5. App & Script Health | 10% | App bloat is a top hidden speed/conversion tax. |
| 6. Trust & Security | 10% | SSL, badges, policies, consent — baseline credibility. |

> The **BFCM Readiness score** is a *separate headline* computed from a re-weighted subset of the
> same checks (see §4.7), so a store can be "decent overall" but "not BFCM-ready."

---

### 4.1 Page Speed & Core Web Vitals — 25%
*Source: PageSpeed Insights API (mobile + desktop), Tier A.*

| Check | Signal / threshold | Detect |
|---|---|---|
| Largest Contentful Paint (LCP) | Good ≤2.5s / Needs work ≤4s / Poor >4s | A |
| Interaction to Next Paint (INP) | Good ≤200ms / ≤500ms / >500ms | A |
| Cumulative Layout Shift (CLS) | Good ≤0.1 / ≤0.25 / >0.25 | A |
| Time to First Byte (TTFB) | Good ≤0.8s | A |
| Lighthouse Performance score | 0–100 (mobile weighted higher) | A |
| Field (CrUX) data present & passing | Real-user pass/fail | A |
| Render-blocking resources | count + est. savings (ms) | A |
| Image optimization | next-gen formats, sizing, offscreen lazy-load | A |
| Total page weight / requests | flag heavy pages | A |

*BFCM note:* traffic spikes punish slow stores hardest — speed is the #1 BFCM technical risk.

### 4.2 Mobile Experience — 20%
*Source: Lighthouse mobile run + DOM, Tier A/B.*

| Check | Signal | Detect |
|---|---|---|
| Viewport meta present & correct | responsive baseline | A |
| Mobile LCP / INP / CLS | (mobile strategy of §4.1) | A |
| Tap-target sizing / spacing | Lighthouse a11y/best-practices | A |
| Font legibility (min sizes) | Lighthouse | A |
| Sticky / persistent add-to-cart on mobile | present? | B |
| Intrusive interstitials / pop-ups blocking first screen | count | B |
| Horizontal scroll / content wider than screen | Lighthouse | A |

### 4.3 Conversion (CRO) — 20%
*Source: DOM heuristics + Lighthouse, Tier B (label as "signals").*

| Check | Signal | Detect |
|---|---|---|
| Reviews / ratings widget present | social proof | B |
| Trust badges near add-to-cart | credibility | B |
| Clear, visible primary CTA (ATC) above the fold | conversion path | B |
| Shipping / delivery info before ATC | reduces #1 abandonment cause | B |
| Returns / guarantee visible | risk reversal | B |
| Free-shipping threshold bar | AOV lever | B |
| Announcement bar / offer clarity | offer surfaced | B |
| Excessive pop-ups / consent walls | friction | B |
| Product images count / video present | PDP quality proxy | B |

*Context:* avg Shopify conversion ≈ **1.4%**; good 2–3%; excellent 3–5%. Top abandonment cause is
**unexpected shipping cost at checkout (~48%)** — so "shipping clarity" is heavily weighted.

### 4.4 SEO & Discoverability — 15%
*Source: HTML + robots/sitemap + structured data, Tier A.*

| Check | Signal | Detect |
|---|---|---|
| `<title>` + meta description present, unique, sized | on-page SEO | A |
| Single, sensible `<h1>` | structure | A |
| Canonical tags present/valid | duplication control | A |
| `robots.txt` present; **AI crawlers not blocked** | LLM/ChatGPT discoverability | A |
| `sitemap.xml` present & referenced | crawlability | A |
| Structured data: `Product` / `Organization` JSON-LD valid | rich results + AI quotability | A |
| Open Graph / social tags | shareability | A |
| Image `alt` coverage | a11y + SEO | A |
| HTTPS + no mixed content | ranking + trust | A |

*Context:* ~67% of stores have duplicate meta descriptions, ~84% miss schema, ~52% fail CWV —
common, high-signal, and fully automatic to detect.

### 4.5 App & Script Health — 10%
*Source: HTML footprint scan + PSI third-party report, Tier A/B.*

| Check | Signal | Detect |
|---|---|---|
| Number of detected storefront apps | bloat proxy | A |
| Third-party script count & total transfer size | speed tax | A |
| Render-blocking third-party scripts | LCP/INP impact | A |
| Duplicate / overlapping app functionality | conflict risk | B |
| Known "heavy" apps flagged | targeted fixes | B |
| Legacy/orphaned scripts (asset domains, no matching app) | cleanup | B |

### 4.6 Trust & Security — 10%
*Source: HTTP/TLS + DOM, Tier A/B.*

| Check | Signal | Detect |
|---|---|---|
| Valid SSL / HTTPS everywhere | baseline | A |
| No mixed-content warnings | security | A |
| Security / payment badges present | credibility | B |
| Return & privacy policy pages linked | trust + compliance | A |
| Cookie/consent handled without blocking content | UX + compliance | B |
| Contact info / support channel visible | legitimacy | B |
| (Optional Tier B) DMARC/SPF/DKIM DNS records | email trust | B |

### 4.7 BFCM Readiness overlay (headline #2)
Re-weights the above for the season and adds seasonal-specific checks:

- **Speed under load** (§4.1) — weighted highest; spikes expose slow stores.
- **Mobile checkout friction** (§4.2/4.3).
- **Offer surfaced on storefront** — announcement bar, sale collection linked from home,
  countdown timer, free-shipping threshold (Tier B DOM checks).
- **Trust at the point of sale** — badges, policies, SSL (§4.6).
- **App bloat** slowing peak traffic (§4.5).
- **"Manual for BFCM" callouts** (Tier C, not scored, shown as a checklist): test every discount
  code, run a full test purchase on mobile + desktop, verify order-confirmation emails, inventory
  buffers, DDoS/CDN, fulfillment plan. Sourced from Shopify's BFCM checklist.

Output a **"BFCM Readiness: X/100 — On track / At risk / Not ready"** badge with days-to-BFCM
countdown.

---

## 4A. Helpfulness principles (non-negotiable guardrails)

The tool is only worth building if it's **genuinely useful to the merchant** — not a vanity score.
Every finding in the report MUST obey these rules, or we've just built "another score tool":

1. **Specific to their store, never generic.** Not "your site is slow" — instead *"your product
   page's hero image (`hero.jpg`, 1.8 MB) is the LCP element loading in 4.2s; serve WebP to save
   ~2s."* Each finding cites the **actual element, URL, and measured value** we found.
2. **Revenue-framed, not metric-framed.** Translate every technical result into conversion/$ impact
   (e.g. "each 1s of load delay ≈ −7% conversions"). Owners act on money, not on "CLS 0.28."
3. **Prioritized — top 3–5 that move revenue**, sorted impact-high / effort-low. Nobody fixes 60
   items; don't bury the ones that matter.
4. **Benchmarked.** Show their number against the Shopify average (≈1.4%) and "good" (2–3%). A number
   without context is meaningless.
5. **DIY vs. needs-a-dev.** Label each fix as self-serve (10-min change) or requires help — the
   honest split is what earns the eFoli lead instead of feeling like bait.
6. **Honest about limits.** State plainly what we could NOT test (checkout, discount codes, emails —
   Tier C). Trust > fake completeness.

> Failure mode to avoid: a generic grade + vague advice the owner can't act on. That captures a lead
> but burns trust. Specific + prioritized + revenue-framed is the whole point.

---

## 4B. Testing methodology — "how the test runs" (merchant-facing)

The basis must be **transparent and credible — not a black box we invented.** The credibility comes
from scoring against **Google's and Shopify's own published numbers**, so when an owner asks "says
who?", the answer is "Google and Shopify, not us." What a store goes through:

1. **Confirm it's a Shopify store** and reachable.
2. **Run Google PageSpeed Insights** (real Lighthouse lab + real Chrome-user CrUX field data) on
   **mobile + desktop**, for the **homepage AND a top product page** — product pages are where
   conversion happens, so testing only the homepage is a deliberately-avoided weakness.
3. **Fetch & parse the storefront HTML** for SEO tags, structured data, trust signals, and the
   installed-app footprint.
4. **Score against published, industry-standard thresholds** — Google's Core Web Vitals cutoffs
   (LCP ≤2.5s, INP ≤200ms, CLS ≤0.1) and Shopify's conversion benchmarks. We never invent the bar.
5. **Compare to Shopify averages** and roll into the 6-pillar score + BFCM readiness badge (§4/§5).

### Scope: which pages we test (not a full crawl)

We audit the store's **main page types only — one representative page per template** — not every
URL. Shopify stores are **template-based** (all products share one product template, all collections
one collection template), so testing one page per type reflects the whole store at a fraction of the
time and PageSpeed-quota cost. A full crawl would be slow, quota-hungry, and redundant.

Page types audited:

| Page type | How we find it | Speed test (PSI/Lighthouse) | HTML/SEO/trust scan |
|---|---|---|---|
| **Home page** | the submitted URL | ✅ mobile + desktop | ✅ |
| **Collection page** | first collection link / `sitemap.xml` | ✅ (v2; optional in MVP) | ✅ |
| **Product page (PDP)** | featured/first product link, `/products.json`, or sitemap | ✅ mobile + desktop (most important) | ✅ |
| **Cart page** | `/cart` | ⚠️ limited (checkout is gated) | ✅ |

Two cost tiers drive the split: **speed / Core Web Vitals** runs a real Lighthouse pass (expensive)
so it's limited to the highest-value pages (home + PDP first; collection/cart as we expand);
**HTML/SEO/trust/app scans** are cheap fetch-and-parse, so they can cover all the main page types.
Report copy states plainly which pages were tested (e.g. "home + a top product page, mobile +
desktop") so nothing is implied beyond what we measured.

Surface this methodology in the report ("How we tested" panel) — transparency is itself a
differentiator against black-box tools.

---

## 4C. Why ours, not the dozens of existing tools (differentiation & moat)

Honest position: **the automated scan alone is a commodity** (PageSpeed is free; SEO checkers are
everywhere). The scan is the *hook*, not the moat.

| The others | Ours |
|---|---|
| PageSpeed = raw speed only, no Shopify context | Shopify-native: apps, themes, PDPs, checkout |
| SEO checker = SEO only | **One** report unifying speed + CRO + SEO + apps + trust |
| Generic web advice | **BFCM-framed** — timed urgency around the #1 sales window |
| Metric dumps | **Revenue-framed, prioritized** action list |
| Pure automation → dead end | **eFoli can actually fix it** (15+ yrs Shopify + own apps) |

**The real moat is the last row.** Most free tools find problems and leave the owner stranded; ours
finds them *and* has a Shopify agency behind it to fix them before Black Friday. **The tool is the
lead magnet; eFoli's expertise is the product.** BFCM timing + plain-language synthesis + a human
backstop is the honest reason a merchant chooses ours over a raw PageSpeed run.

---

## 4D. Approach: deterministic / rule-based (no AI required)

**The tool is rule-based, not AI-driven.** Every result is: *measure a signal → compare to a fixed,
published threshold → score → render.* This is the whole engine — the criteria in §4 **are** the
product. AI is **not required** and is not part of the core build.

Why deterministic is the right default here (not just simpler):

| | Rule-based (chosen) | AI layer (rejected for core) |
|---|---|---|
| Reliability | Same store → identical result every run | Same store → different wording/output |
| Accuracy | Can't invent advice; bounded by thresholds | Can hallucinate a fix that harms the store |
| Speed / cost | Instant, free | Adds latency + per-report cost |
| Credibility | "Google's own threshold says X" | "an AI said X" — weaker for a trust tool |

For a **credibility tool a merchant may act on before BFCM**, a hallucinated fix is a real risk, so
deterministic wins. fixmystore's "AI" label is partly marketing — we don't need to copy it.

**Optional, much later:** an AI pass could rephrase the *already-computed* deterministic findings
into a friendlier narrative ("the one thing hurting you most…"). If ever added, the deterministic
findings remain the **source of truth** — AI only rewords; it never sets scores or invents fixes.
Not in scope for v1 or v2.

---

## 5. Scoring methodology

- Each **check** returns: `status` (pass / warn / fail / n-a), a raw value, and a `points` value.
- Each **pillar** = weighted sum of its checks → 0–100 → grade
  (**A** 90+, **B** 80–89, **C** 70–79, **D** 60–69, **F** <60).
- **Headline Store Score** = weighted sum of pillar scores (§4 weights).
- **BFCM Readiness** = separate weighted subset (§4.7).
- Every failing/warning check carries **Impact (H/M/L)**, **Effort (H/M/L)**, and a one-line **fix**,
  so the report can render a prioritized "Top 5 fixes" list (Impact-high / Effort-low first).
- Confidence labeling: Tier A = "measured," Tier B = "signal," Tier C = "needs human review."

---

## 6. Report UX (what the visitor sees)

1. **Hero input** — big URL field only (no email upfront), "Grade my store," BFCM countdown, trust
   line ("free · no login · instant score").
2. **Scanning state** — animated progress with the pillars ticking through (reuse motion + our
   `RouteLoading` style). Real work runs server-side.
3. **Report card** — headline Store Score (big circular gauge) + BFCM Readiness badge; six pillar
   cards with grade, key metrics, and pass/warn/fail counts.
4. **Top 5 prioritized fixes** — impact/effort chips, plain-language fix, "why it matters."
5. **Per-pillar detail** — expandable accordions (reuse the `.blog-content details` styling pattern)
   with each check, its value, and its fix.
6. **Manual/BFCM checklist** — the Tier C items as an interactive checklist (not scored).
7. **CTA** — "Want eFoli to fix these before Black Friday?" → contact form (reuse `Form.tsx` /
   `/api/contact`) pre-filled with the store URL + report reference.

**Teaser → unlock (show-all, faded gate):** the **entire report renders**, but when locked the deeper
sections (pages, full breakdown, checklist) **fade into a bottom shade** with an "Unlock your full
report — get it emailed" card over the shade. Shown free above the fade: the score gauge, BFCM badge,
"At a glance" pillar grades, and the Top-5 fixes. Entering the email removes the fade (reveals
everything) and emails the full report. **No captcha** on the unlock (kept frictionless);
rate-limiting guards abuse instead.

**Email delivery:** on unlock we email the full report to the captured address (reuse the nodemailer
pipeline behind `/api/contact`) and forward the lead (email + store URL + headline scores) to eFoli.

### 6B. Visual evidence & references (makes it a "real report")

The report is **visual, not a text list** — screenshots, charts, and cited sources give it the
credibility and usefulness of a genuine audit.

**Store screenshots (their actual pages):**
- The **PageSpeed Insights API returns screenshots for free** — a **final rendered screenshot** plus
  a **loading filmstrip** (frame-by-frame paint) for **mobile + desktop**. Show *their real homepage
  and product page* in the report.
- **Annotated evidence (v2):** Lighthouse reports the **LCP element** and the **elements causing
  CLS**, so we can overlay markers ("this hero image is your slow point / this banner shifts your
  layout"). Advanced, high-impact.
- **Hosting requirement:** for the **emailed** report, screenshots must be **uploaded to storage and
  referenced by hosted URL** (Vercel Blob / R2 — already in use). Base64-embedded images are clipped
  or blocked by email clients. On-page can use the data URI directly.

**Rendered visuals (on-brand UI, not fetched):**
- Headline **score gauge** (circular, brand blue) + **BFCM readiness badge**.
- **Core Web Vitals bars** with the good/needs-work/poor thresholds shown.
- **Pillar breakdown** cards with grades and pass/warn/fail counts.

**References (two kinds — both included):**
- **Benchmark references** — every key metric shown against its standard and the Shopify average
  (e.g. "LCP 4.2s vs. Google 'good' ≤2.5s vs. Shopify avg"), so numbers carry meaning.
- **Source citations** — each recommendation links to the authority behind it (Google web.dev,
  Shopify docs). Credibility comes from citing standards, not asserting opinions.

**"How we tested" panel** — which pages were tested (§4B scope), on mobile + desktop, using Google
Lighthouse + Shopify benchmarks. Transparency is itself a trust signal.

### 6C. Delivery formats — images shown in ALL of them

The **same report** is delivered three ways, and **images (section/evidence screenshots + benchmark
reference visuals) appear in every one**:

| Surface | Images | How |
|---|---|---|
| **Website** (on-page) | ✅ | Inline — screenshots as data URI or hosted URL; gauges/bars/charts rendered on-brand. Interactive (expandable pillars). |
| **PDF** | ✅ | Images **embedded directly in the PDF file** — self-contained, printable, shareable. Same layout/brand as the web report. |
| **Email** | ✅ | Preferred: **attach the PDF** (images embedded) + short summary + "view online" link. If images go in the email body instead, they must be **hosted URLs** (clients clip base64). |

**One source → three outputs:** we produce the on-brand **HTML report once**, then render it to PDF
with **headless Chrome (Playwright/Puppeteer on Vercel Fluid Compute)** so the PDF is pixel-identical
to the website version — same brand, same screenshots, same references. No separate PDF layout to
maintain.

**One PDF = all pages.** The report renders every page audit (Home / Collection / Product / Cart) in
the same document, so the emailed/downloaded PDF is a single file covering the whole store, not one
PDF per page.

Every pillar/section shows its relevant **evidence image** (the store screenshot tied to that
finding) plus its **benchmark reference** (your value vs. standard vs. Shopify avg) — consistently
across website and PDF.

---

## 6A. Design & brand consistency (must match the current site)

The tool page is **part of the eFoli site** and must look native to it — same fonts, palette, radii,
buttons, spacing, and motion. **Do NOT introduce a new visual language.** Use the existing design
system (verified from the live codebase):

**Design phase:** build the UI with the **`ui-ux-pro-max` skill** (invoke it when designing the
`/free-tools/shopify-store-audit` page and report components), constrained to the tokens below so the output stays
on-brand rather than generic.

### Palette (actual hex, by usage frequency in the codebase)

| Role | Token | Notes |
|---|---|---|
| **Primary / brand blue** | `#0D99FF` | The signature color (most-used). CTAs, links, accents, gauge. |
| Brand blue (hover/deep) | `#1D74BF` / `#0A7ACC` | Hover + darker states. |
| Ink / headings | `#13181E` | Display headings, high-contrast text. |
| Body text | `#4B5154` | Paragraph gray. |
| Muted / meta | `#9FA5A7` | Secondary labels. |
| Brand-tint surface | `#F2FBFA` | Soft panels, loading bg, table headers (already used). |
| Off-white surface | `#FAFCFD` | Section backgrounds. |
| Dark surface | `#010A1E` | Dark header/footer chrome (matches `darkHeader`/`darkFooter`). |
| Borders / dividers | `#E5E7EB` / `#E5E5E5` | Card + table borders. |
| Sky accent | `#7DD3FC` | Light-blue accent. |

### Status colors for scores/checks (reuse hues already in the codebase)

| State | Suggested | Already present as |
|---|---|---|
| Pass / good | green | `#34D399` / `#A7F3D0` / `#235D3A` |
| Warn / needs work | amber | `#F59E0B` / `#FDE68A` / `#D97706` |
| Fail / poor | red | pick a red consistent with above weights |

Keep **brand blue as the primary UI color**; use green/amber/red only for the score semaphores so
the report reads at a glance without fighting the brand.

### Typography, shape, layout, motion
- **Fonts:** body = **Inter** (`--font-sans`), headings = **Red Hat Display** (`--font-display`,
  via the `font-display` utility) — both already wired through `next/font` in `app/layout.tsx`.
- **Radii:** `rounded-full` (pills/badges/score gauge), `rounded-2xl` (cards — the dominant card
  radius), `rounded-xl`, `rounded-lg` (buttons). Match existing usage.
- **Containers:** `max-w-7xl mx-auto` with `px-4`/`px-6`, same as every current page.
- **Buttons:** reuse the signature two-line "roll-up" `components/Button.tsx` (`text1`/`text2` +
  `pClass` for color) and `ButtonWithIcon.tsx` — do not hand-roll new button styles.
- **Motion:** `motion/react` (already used site-wide) + `AnimatedSection` for reveals; the scanning
  state should match the `RouteLoading` spinner (brand-blue ring on `#F2FBFA`).
- **Chrome:** wrap the page in `SiteChrome` (Navbar + Footer) like every other route; choose
  light/dark header/footer per the design.
- **Blog-style detail:** the per-pillar accordions can reuse the `.blog-content details/summary`
  pattern already in `globals.css` (bordered rounded cards, animated +/− indicator) for a
  consistent look.

> Consistency check before ship: the page should be indistinguishable in styling from `/service` or
> `/about-us` — same fonts, blue, cards, buttons, spacing.

---

## 7. Data sources & APIs

| Source | Used for | Notes |
|---|---|---|
| Google PageSpeed Insights API | CWV, Lighthouse perf/SEO/a11y, opportunities | Free 25k/day, API key; mobile + desktop; ~10–30s/URL. |
| Direct HTML fetch (server) | meta/DOM/structured-data/app footprint/trust signals | Node runtime; parse with a DOM/HTML parser. |
| robots.txt / sitemap.xml fetch | technical SEO | simple GETs. |
| (Optional) DNS lookup | DMARC/SPF/DKIM | Tier B add-on. |
| (Optional) Wappalyzer-style ruleset | richer app/tech detection | can start with our own small ruleset. |

**Caching & abuse control:** cache results per URL (e.g. 24h) to protect the PSI quota; rate-limit
submissions; queue long scans; validate/normalize the URL and confirm it's a reachable Shopify
storefront before spending a PSI call.

---

## 8. Limitations, risks & honesty

- **Tier C is invisible to us** — never imply we tested checkout, discount codes, inventory, or
  emails. Present them as "manual checks we recommend / eFoli can do."
- **PSI variability** — lab scores fluctuate; prefer field (CrUX) data when available and label lab
  runs as "lab estimate."
- **Heuristic false positives** — Tier B signals (badges, shipping text) can misfire; hedge wording
  ("we couldn't detect…"), never assert absence as fact.
- **Non-Shopify / unreachable URLs** — detect and message gracefully; still offer generic perf/SEO.
- **JS-rendered / headless storefronts** — some stores (e.g. Hydrogen/headless) render content
  client-side, so the server HTML lacks title/meta/product markup. We detect this (no server
  `<title>`) and mark HTML-derived SEO/CRO/trust checks **n/a** with a note rather than false-failing
  them; the PageSpeed audit (which renders the page) remains the reliable signal. Implemented via the
  `contentReliable` guard in the collectors.
- **Quota & cost** — PSI free tier is generous but abusable; caching + rate-limit are mandatory.
- **Privacy** — only fetch public pages; store minimal data; disclose what we keep if we email-gate.
- **Don't be spammy** — recommending eFoli apps must be genuine and disclosed, or it erodes trust.

---

## 9. Open decisions (need your call)

1. ~~**Lead gate:**~~ **DECIDED (value-first unlock)** — visitor submits **URL only** → free teaser
   (score + BFCM badge + pillar grades + issue count) → **"Unlock full report"** captures the email →
   full detail revealed on-page **and** emailed; lead forwarded to eFoli. (Changed from the earlier
   upfront-email approach — show value first.)
2. ~~**Scope of MVP:**~~ **DECIDED** — Tier A first (deterministic speed/SEO/app/trust auto-checks);
   Tier B CRO signals in v2.
3. ~~**"AI review" layer:**~~ **DECIDED — no AI.** The tool is fully deterministic/rule-based (see
   §4D). AI is not required for v1 or v2; if ever added, it only rephrases already-computed findings
   and never sets scores or invents fixes.
4. ~~**Where it lives:**~~ **DECIDED** — SEO structure `efoli.com/free-tools/<slug>`: a **`/free-tools` hub**
   page + this tool at **`/free-tools/shopify-store-audit`** (keyword-rich, highest search intent).
   Future tools are siblings under `/free-tools`. Add both to `app/sitemap.ts`. A seasonal `/bfcm`
   campaign page (optional) can link to the tool but the evergreen canonical stays at
   `/free-tools/shopify-store-audit`.
5. ~~**Persistence:**~~ **DECIDED (MVP default)** — ephemeral for MVP (on-page report + hosted PDF
   link, which is already shareable). Shareable saved-report URLs deferred to v2. Revisit if we want
   the viral loop sooner.
6. ~~**Branding:**~~ **DECIDED (default)** — display name **"Free Shopify Store Audit"** (matches the
   URL + the "free" hook). Adjustable — say the word to rename.

---

## 10. Sources

- [FixMyStore](https://fixmystore.com/) — reference tool
- [Shopify — CRO checklist](https://www.shopify.com/blog/cro-checklist)
- [Shopify — BFCM checklist](https://www.shopify.com/ca/blog/bfcm-checklist)
- [Shopify — ecommerce SEO audit](https://www.shopify.com/blog/ecommerce-seo-audit)
- [EshopPick — Shopify store audit checklist 2026 (42 checks)](https://eshoppick.com/guides/shopify-store-audit-checklist-2026)
- [Cartylabs — Shopify CRO checklist (80 fixes)](https://cartylabs.com/blog/shopify-cro-checklist/)
- [Google — PageSpeed Insights API](https://developers.google.com/speed/docs/insights/v5/about)
- [DebugBear — PageSpeed Insights API guide](https://www.debugbear.com/blog/pagespeed-insights-api)
- [GemPages — how to see what apps a Shopify store uses](https://gempages.net/blogs/shopify/how-to-see-what-apps-a-shopify-store-using)
- [nikoalho — Shopify technical SEO](https://nikoalho.fi/writing/shopify-technical-seo/)
