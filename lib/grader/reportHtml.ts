/**
 * Single-source report HTML (inline-styled, self-contained) used for BOTH the
 * PDF (headless Chrome) and the emailed report. One document = all pages.
 *
 * Uses inline styles + email-safe fonts (no external CSS/webfonts), so it renders
 * consistently in email clients and in the PDF.
 */

import type { Check, PageAudit, Report, Status } from "./types";

const C = {
  brand: "#0D99FF",
  brandDark: "#0A7ACC",
  ink: "#13181E",
  body: "#4B5154",
  tint: "#F2FBFA",
  dark: "#010A1E",
  border: "#e5e7eb",
  gray: "#6b7280",
  pass: "#16a34a",
  warn: "#b45309",
  fail: "#dc2626",
  na: "#9ca3af",
};

/** Black Friday date — a static document (email/PDF) shows the date, not a ticking countdown. */
const BLACK_FRIDAY_LABEL = "Black Friday · Nov 27, 2026";

function esc(s: string): string {
  return s
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");
}

function scoreColor(score: number): string {
  if (score >= 80) return C.pass;
  if (score >= 60) return C.warn;
  return C.fail;
}

const STATUS_LABEL: Record<Status, { label: string; color: string }> = {
  pass: { label: "Pass", color: C.pass },
  warn: { label: "Needs work", color: C.warn },
  fail: { label: "Fail", color: C.fail },
  na: { label: "Not measured", color: C.na },
};

function host(url: string): string {
  return url.replace(/^https?:\/\//, "").replace(/\/$/, "");
}

function checkRow(c: Check): string {
  const s = STATUS_LABEL[c.status];
  return `
    <tr>
      <td style="padding:8px 0;border-bottom:1px solid ${C.border};color:${C.ink};font-size:14px;">
        ${esc(c.label)}${c.value ? `<span style="color:${C.gray};font-size:12px;"> — ${esc(c.value)}</span>` : ""}
      </td>
      <td style="padding:8px 0;border-bottom:1px solid ${C.border};text-align:right;white-space:nowrap;color:${s.color};font-size:13px;font-weight:bold;">
        ${s.label}
      </td>
    </tr>`;
}

function pageBlock(page: PageAudit): string {
  const statusColor =
    page.status === "tested" ? C.pass : page.status === "blocked" ? C.warn : C.gray;
  const statusText =
    page.status === "tested" ? "Tested" : page.status === "blocked" ? "JS-rendered" : "Not found";
  const speed =
    page.speedScore != null
      ? `<span style="color:${scoreColor(page.speedScore)};font-weight:bold;"> · Speed ${page.speedScore}/100 (${page.speedGrade})</span>`
      : "";
  const rows = page.checks.length
    ? `<table width="100%" cellpadding="0" cellspacing="0" style="border-collapse:collapse;margin-top:6px;">${page.checks.map(checkRow).join("")}</table>`
    : `<p style="margin:6px 0 0;color:${C.gray};font-size:13px;">No page-specific checks.</p>`;
  return `
    <div style="border:1px solid ${C.border};border-radius:12px;padding:16px;margin-top:12px;">
      <p style="margin:0;font-size:15px;font-weight:bold;color:${C.ink};">
        ${esc(page.label)}
        <span style="color:${statusColor};font-size:12px;font-weight:bold;"> ${statusText}</span>${speed}
      </p>
      ${page.url ? `<p style="margin:2px 0 0;color:${C.gray};font-size:12px;">${esc(host(page.url))}</p>` : ""}
      ${rows}
    </div>`;
}

function fixItem(c: Check, i: number): string {
  const color = STATUS_LABEL[c.status].color;
  return `
    <tr>
      <td width="28" valign="top" style="padding:10px 0;">
        <div style="width:24px;height:24px;border-radius:50%;background:${color};color:#fff;text-align:center;line-height:24px;font-weight:bold;font-size:13px;">${i + 1}</div>
      </td>
      <td style="padding:10px 0 10px 10px;">
        <p style="margin:0;font-weight:bold;color:${C.ink};font-size:15px;">${esc(c.label)}</p>
        ${c.fix ? `<p style="margin:4px 0 0;color:${C.body};font-size:14px;">${esc(c.fix)}</p>` : ""}
        ${c.impact || c.effort ? `<p style="margin:4px 0 0;color:${C.gray};font-size:12px;">${c.impact ? `${{ H: "High", M: "Med", L: "Low" }[c.impact]} impact` : ""}${c.impact && c.effort ? " · " : ""}${c.effort ? `${{ H: "High", M: "Med", L: "Low" }[c.effort]} effort` : ""}</p>` : ""}
      </td>
    </tr>`;
}

export function renderReportHtml(report: Report): string {
  const gradeColor = scoreColor(report.storeScore);
  const bfcmColor =
    report.bfcm.status === "on-track" ? C.pass : report.bfcm.status === "at-risk" ? C.warn : C.fail;
  const bfcmLabel =
    report.bfcm.status === "on-track" ? "On track" : report.bfcm.status === "at-risk" ? "At risk" : "Not ready";

  const topFixes = report.topFixes.length
    ? `<h2 style="font-size:18px;color:${C.ink};margin:28px 0 8px;">Top ${report.topFixes.length} fixes to prioritize</h2>
       <table width="100%" cellpadding="0" cellspacing="0">${report.topFixes.map(fixItem).join("")}</table>`
    : "";

  const pillarsRows = report.pillars
    .map((p) => {
      const measured = p.checks.some((c) => c.tier !== "manual" && c.status !== "na");
      const col = measured ? scoreColor(p.score) : C.na;
      return `<tr>
        <td style="padding:8px 0;border-bottom:1px solid ${C.border};font-size:14px;color:${C.ink};">${esc(p.label)}</td>
        <td style="padding:8px 0;border-bottom:1px solid ${C.border};text-align:right;color:${col};font-weight:bold;font-size:14px;">${measured ? `${p.score}/100 (${p.grade})` : "—"}</td>
      </tr>`;
    })
    .join("");

  const manual = report.manualChecklist.length
    ? `<h2 style="font-size:18px;color:${C.ink};margin:28px 0 8px;">Can't be tested from a URL — do these before BFCM</h2>
       <ul style="margin:0;padding-left:18px;color:${C.body};font-size:14px;">
         ${report.manualChecklist.map((m) => `<li style="margin:6px 0;"><strong style="color:${C.ink};">${esc(m.label)}</strong>${m.note ? ` — ${esc(m.note)}` : ""}</li>`).join("")}
       </ul>`
    : "";

  return `<!doctype html>
<html><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"></head>
<body style="margin:0;background:#fafcfd;font-family:Arial,Helvetica,sans-serif;color:${C.body};">
  <div style="max-width:680px;margin:0 auto;padding:24px;">
    <!-- header -->
    <div style="background:#fff;border:1px solid ${C.border};border-radius:16px;padding:24px;">
      <p style="margin:0;color:${C.brand};font-weight:bold;font-size:13px;letter-spacing:.04em;">eFOLI · SHOPIFY STORE AUDIT</p>
      <h1 style="margin:6px 0 0;font-size:24px;color:${C.ink};">${esc(host(report.url))}</h1>
      <p style="margin:2px 0 16px;color:${C.gray};font-size:13px;">${report.isShopify ? "Shopify store" : "Store"} · scanned ${esc(new Date(report.scannedAt).toLocaleString())}</p>
      <table cellpadding="0" cellspacing="0"><tr>
        <td valign="middle" style="padding-right:20px;">
          <div style="font-size:44px;font-weight:bold;color:${gradeColor};line-height:1;">${report.storeScore}<span style="font-size:18px;color:${C.gray};">/100</span></div>
          <div style="font-size:14px;font-weight:bold;color:${gradeColor};">Grade ${report.grade}</div>
        </td>
        <td valign="middle" style="border-left:1px solid ${C.border};padding-left:20px;">
          <div style="font-size:12px;color:${C.gray};text-transform:uppercase;letter-spacing:.04em;">BFCM readiness</div>
          <div style="font-size:16px;font-weight:bold;color:${bfcmColor};">${report.bfcm.score}/100 · ${bfcmLabel}</div>
          <div style="font-size:12px;color:${C.gray};">${BLACK_FRIDAY_LABEL}</div>
        </td>
      </tr></table>
      ${report.partial ? `<p style="margin:16px 0 0;background:#fffbeb;border:1px solid #fde68a;border-radius:8px;padding:10px 12px;color:#7c5306;font-size:13px;">Partial report — some checks couldn't be measured this run.</p>` : ""}
    </div>

    ${topFixes}

    <h2 style="font-size:18px;color:${C.ink};margin:28px 0 4px;">Pages we tested</h2>
    <p style="margin:0;color:${C.gray};font-size:13px;">Shopify themes are template-based, so one page per type reflects the whole store.</p>
    ${report.pages.map(pageBlock).join("")}

    <h2 style="font-size:18px;color:${C.ink};margin:28px 0 8px;">Full breakdown</h2>
    <table width="100%" cellpadding="0" cellspacing="0" style="border-collapse:collapse;">${pillarsRows}</table>

    ${manual}

    <!-- CTA -->
    <div style="background:${C.dark};border-radius:16px;padding:28px;margin-top:28px;text-align:center;">
      <p style="margin:0;font-size:20px;font-weight:bold;color:#fff;">Want eFoli to fix these before Black Friday?</p>
      <p style="margin:8px 0 16px;color:#ffffffb3;font-size:14px;">15+ years building and scaling Shopify stores and apps.</p>
      <a href="https://efoli.com/contact-us" style="display:inline-block;background:${C.brand};color:#fff;text-decoration:none;font-weight:bold;padding:12px 28px;border-radius:10px;font-size:15px;">Book a free consultation</a>
    </div>

    <p style="text-align:center;color:${C.gray};font-size:12px;margin:20px 0 0;">© eFoli · This audit is based on your public storefront and Google Lighthouse + Shopify benchmarks.</p>
  </div>
</body></html>`;
}

/**
 * Short, engaging EMAIL BODY. The full report ships as the attached PDF, so this
 * is a concise, friendly summary + a few quick wins + the attachment note — not
 * the whole report.
 */
export function renderReportEmailBody(report: Report): string {
  const gradeColor = scoreColor(report.storeScore);
  const bfcmColor =
    report.bfcm.status === "on-track" ? C.pass : report.bfcm.status === "at-risk" ? C.warn : C.fail;
  const bfcmLabel =
    report.bfcm.status === "on-track" ? "On track" : report.bfcm.status === "at-risk" ? "At risk" : "Not ready";
  const issues = report.pillars
    .flatMap((p) => p.checks)
    .filter((c) => c.tier !== "manual" && (c.status === "warn" || c.status === "fail")).length;
  const topThree = report.topFixes.slice(0, 3);
  const fixes = topThree.map((c, i) => fixItem(c, i)).join("");

  return `<!doctype html>
<html><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"></head>
<body style="margin:0;background:#fafcfd;font-family:Arial,Helvetica,sans-serif;color:${C.body};">
  <div style="max-width:600px;margin:0 auto;padding:24px;">
    <div style="background:#fff;border:1px solid ${C.border};border-radius:16px;padding:24px;">
      <p style="margin:0;color:${C.brand};font-weight:bold;font-size:13px;letter-spacing:.04em;">eFOLI · SHOPIFY STORE AUDIT</p>
      <h1 style="margin:6px 0 0;font-size:22px;color:${C.ink};">${esc(host(report.url))}</h1>
      <table cellpadding="0" cellspacing="0" style="margin-top:14px;"><tr>
        <td valign="middle" style="padding-right:20px;">
          <div style="font-size:40px;font-weight:bold;color:${gradeColor};line-height:1;">${report.storeScore}<span style="font-size:16px;color:${C.gray};">/100</span></div>
          <div style="font-size:13px;font-weight:bold;color:${gradeColor};">Grade ${report.grade}</div>
        </td>
        <td valign="middle" style="border-left:1px solid ${C.border};padding-left:20px;">
          <div style="font-size:11px;color:${C.gray};text-transform:uppercase;">BFCM readiness</div>
          <div style="font-size:15px;font-weight:bold;color:${bfcmColor};">${report.bfcm.score}/100 · ${bfcmLabel}</div>
          <div style="font-size:12px;color:${C.gray};">${BLACK_FRIDAY_LABEL}</div>
        </td>
      </tr></table>
    </div>

    <p style="margin:22px 2px 0;font-size:15px;line-height:1.6;color:${C.body};">
      Thanks for running the audit! Your store scored <strong style="color:${C.ink};">${report.storeScore}/100 (Grade ${report.grade})</strong>.
      We spotted <strong style="color:${C.ink};">${issues} prioritized ${issues === 1 ? "fix" : "fixes"}</strong> that can lift conversions and speed.
    </p>
    <p style="margin:12px 2px 0;font-size:15px;line-height:1.6;color:${C.body};">
      📎 <strong style="color:${C.ink};">Your full report is attached as a PDF</strong> — speed, mobile, SEO, conversion, apps, trust, and every page we tested, each with a step-by-step fix.
    </p>

    <h2 style="font-size:16px;color:${C.ink};margin:24px 2px 4px;">A few quick wins to start with</h2>
    <table width="100%" cellpadding="0" cellspacing="0">${fixes}</table>

    <div style="background:${C.dark};border-radius:16px;padding:26px;margin-top:26px;text-align:center;">
      <p style="margin:0;font-size:19px;font-weight:bold;color:#fff;">Want us to fix these for you?</p>
      <p style="margin:8px 0 16px;color:#ffffffb3;font-size:14px;">eFoli has built and scaled Shopify stores &amp; apps for 15+ years.</p>
      <a href="https://efoli.com/contact-us" style="display:inline-block;background:${C.brand};color:#fff;text-decoration:none;font-weight:bold;padding:12px 28px;border-radius:10px;font-size:15px;">Book a free consultation</a>
    </div>

    <p style="text-align:center;color:${C.gray};font-size:12px;margin:18px 0 0;">© eFoli · Free Shopify Store Audit · Based on your public storefront + Google Lighthouse.</p>
  </div>
</body></html>`;
}

/** Plain-text fallback for the email. */
export function renderReportText(report: Report): string {
  const lines = [
    `eFoli — Shopify Store Audit`,
    `${host(report.url)}`,
    `Store score: ${report.storeScore}/100 (Grade ${report.grade})`,
    `BFCM readiness: ${report.bfcm.score}/100 — ${report.bfcm.status} (${BLACK_FRIDAY_LABEL})`,
    ``,
    `Your full report is attached as a PDF.`,
    ``,
    `A few quick wins:`,
    ...report.topFixes.slice(0, 3).map((f, i) => `  ${i + 1}. ${f.label}${f.fix ? ` — ${f.fix}` : ""}`),
    ``,
    `Want help fixing these? https://efoli.com/contact-us`,
  ];
  return lines.join("\n");
}
