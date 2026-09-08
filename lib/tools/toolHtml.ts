/**
 * Pure HTML renderers for tool reports (no side effects, type-only imports).
 * `renderToolHtml` = FULL report (for the attached PDF).
 * `renderToolEmailBody` = SHORT engaging email body.
 */

import type { ToolResult, ToolStatus } from "./types";

const C = {
  brand: "#0D99FF",
  ink: "#13181E",
  body: "#4B5154",
  dark: "#010A1E",
  border: "#e5e7eb",
  pass: "#16a34a",
  warn: "#b45309",
  fail: "#dc2626",
  na: "#9ca3af",
};

const STATUS: Record<ToolStatus, { label: string; color: string }> = {
  pass: { label: "Pass", color: C.pass },
  warn: { label: "Fix", color: C.warn },
  fail: { label: "Fail", color: C.fail },
  na: { label: "n/a", color: C.na },
  info: { label: "Info", color: C.brand },
};

function esc(s: string): string {
  return s.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;");
}

function scoreColor(s: number): string {
  if (s >= 80) return C.pass;
  if (s >= 60) return C.warn;
  return C.fail;
}

/** Tool-specific detail block for the PDF (llms.txt, tag values, schema types). */
function renderData(result: ToolResult): string {
  const d = result.data;
  if (typeof d.generatedLlmsTxt === "string") {
    const blocked = Array.isArray(d.blockedBots) ? (d.blockedBots as string[]) : [];
    return `
      <h2 style="font-size:18px;color:${C.ink};margin:28px 0 6px;">AI crawler access</h2>
      <p style="margin:0;color:${C.body};font-size:14px;">${blocked.length ? `Blocking: ${esc(blocked.join(", "))}` : "All major AI crawlers allowed."}</p>
      <h2 style="font-size:18px;color:${C.ink};margin:24px 0 6px;">Generated llms.txt</h2>
      <pre style="background:#0b1120;color:#e2e8f0;padding:14px;border-radius:10px;overflow-x:auto;font-size:12px;white-space:pre-wrap;">${esc(d.generatedLlmsTxt)}</pre>`;
  }
  if (Array.isArray(d.types)) {
    const types = d.types as string[];
    return `<h2 style="font-size:18px;color:${C.ink};margin:28px 0 6px;">Schema types found</h2>
      <p style="margin:0;color:${C.body};font-size:14px;">${types.length ? esc(types.join(", ")) : "None found"}</p>`;
  }
  if (d.og && typeof d.og === "object") {
    const og = d.og as Record<string, string | null>;
    const tw = (d.twitter as Record<string, string | null>) ?? {};
    const row = (k: string, v: string | null | undefined) =>
      `<tr><td style="padding:6px 0;border-bottom:1px solid ${C.border};font-size:13px;color:${C.ink};">${k}</td><td style="padding:6px 0;border-bottom:1px solid ${C.border};font-size:13px;color:${C.na};">${v ? esc(String(v)) : "—"}</td></tr>`;
    return `<h2 style="font-size:18px;color:${C.ink};margin:28px 0 6px;">Detected tags</h2>
      <table width="100%" cellpadding="0" cellspacing="0" style="border-collapse:collapse;">
        ${row("Title", d.title as string)}${row("Meta description", d.description as string)}
        ${row("og:image", og.image)}${row("og:title", og.title)}${row("twitter:card", tw.card)}
      </table>`;
  }
  return "";
}

/** FULL report HTML — used for the attached PDF. */
export function renderToolHtml(result: ToolResult, toolName: string): string {
  const rows = result.checks
    .map((c) => {
      const s = STATUS[c.status];
      return `<tr>
        <td style="padding:8px 0;border-bottom:1px solid ${C.border};font-size:14px;color:${C.ink};">${esc(c.label)}${c.value ? ` <span style="color:${C.na};font-size:12px;">— ${esc(c.value)}</span>` : ""}${c.status !== "pass" && c.fix ? `<div style="color:${C.body};font-size:13px;margin-top:2px;">${esc(c.fix)}</div>` : ""}</td>
        <td style="padding:8px 0;border-bottom:1px solid ${C.border};text-align:right;white-space:nowrap;color:${s.color};font-weight:bold;font-size:13px;">${s.label}</td>
      </tr>`;
    })
    .join("");

  return `<!doctype html><html><head><meta charset="utf-8"></head>
  <body style="margin:0;background:#fafcfd;font-family:Arial,Helvetica,sans-serif;color:${C.body};">
    <div style="max-width:680px;margin:0 auto;padding:24px;">
      <div style="background:#fff;border:1px solid ${C.border};border-radius:16px;padding:24px;">
        <p style="margin:0;color:${C.brand};font-weight:bold;font-size:13px;">eFOLI · ${esc(toolName.toUpperCase())}</p>
        <h1 style="margin:6px 0 0;font-size:22px;color:${C.ink};">${esc(result.host)}</h1>
        ${result.score != null ? `<p style="margin:8px 0 0;font-size:32px;font-weight:bold;color:${scoreColor(result.score)};">${result.score}<span style="font-size:15px;color:${C.na};">/100 (${result.grade})</span></p>` : ""}
        <p style="margin:6px 0 0;color:${C.body};font-size:14px;">${esc(result.summary)}</p>
      </div>
      ${renderData(result)}
      <h2 style="font-size:18px;color:${C.ink};margin:28px 0 6px;">All checks</h2>
      <table width="100%" cellpadding="0" cellspacing="0" style="border-collapse:collapse;">${rows}</table>
      <div style="background:${C.dark};border-radius:16px;padding:24px;margin-top:24px;text-align:center;">
        <p style="margin:0;font-size:18px;font-weight:bold;color:#fff;">Want eFoli to fix these for you?</p>
        <a href="https://efoli.com/contact-us" style="display:inline-block;margin-top:14px;background:${C.brand};color:#fff;text-decoration:none;font-weight:bold;padding:12px 26px;border-radius:10px;">Book a free consultation</a>
      </div>
    </div>
  </body></html>`;
}

/** SHORT, engaging email body — full report ships as the attached PDF. */
export function renderToolEmailBody(result: ToolResult, toolName: string): string {
  const quickWins = result.checks.filter((c) => c.status === "warn" || c.status === "fail").slice(0, 3);
  const winRows = quickWins
    .map(
      (c, i) => `<tr>
        <td width="26" valign="top" style="padding:8px 0;"><div style="width:22px;height:22px;border-radius:50%;background:${STATUS[c.status].color};color:#fff;text-align:center;line-height:22px;font-weight:bold;font-size:12px;">${i + 1}</div></td>
        <td style="padding:8px 0 8px 10px;"><p style="margin:0;font-weight:bold;color:${C.ink};font-size:14px;">${esc(c.label)}</p>${c.fix ? `<p style="margin:3px 0 0;color:${C.body};font-size:13px;">${esc(c.fix)}</p>` : ""}</td>
      </tr>`,
    )
    .join("");

  return `<!doctype html><html><head><meta charset="utf-8"></head>
  <body style="margin:0;background:#fafcfd;font-family:Arial,Helvetica,sans-serif;color:${C.body};">
    <div style="max-width:600px;margin:0 auto;padding:24px;">
      <div style="background:#fff;border:1px solid ${C.border};border-radius:16px;padding:24px;">
        <p style="margin:0;color:${C.brand};font-weight:bold;font-size:13px;">eFOLI · ${esc(toolName.toUpperCase())}</p>
        <h1 style="margin:6px 0 0;font-size:22px;color:${C.ink};">${esc(result.host)}</h1>
        ${result.score != null ? `<p style="margin:8px 0 0;font-size:36px;font-weight:bold;color:${scoreColor(result.score)};line-height:1;">${result.score}<span style="font-size:15px;color:${C.na};">/100 (${result.grade})</span></p>` : ""}
      </div>
      <p style="margin:22px 2px 0;font-size:15px;line-height:1.6;">Thanks for running the ${esc(toolName)}! ${esc(result.summary)}.</p>
      <p style="margin:12px 2px 0;font-size:15px;line-height:1.6;">📎 <strong style="color:${C.ink};">Your full report is attached as a PDF</strong> — every check, the fixes, and the details.</p>
      ${winRows ? `<h2 style="font-size:16px;color:${C.ink};margin:24px 2px 4px;">A few quick wins</h2><table width="100%" cellpadding="0" cellspacing="0">${winRows}</table>` : ""}
      <div style="background:${C.dark};border-radius:16px;padding:26px;margin-top:26px;text-align:center;">
        <p style="margin:0;font-size:19px;font-weight:bold;color:#fff;">Want us to fix these for you?</p>
        <a href="https://efoli.com/contact-us" style="display:inline-block;margin-top:14px;background:${C.brand};color:#fff;text-decoration:none;font-weight:bold;padding:12px 28px;border-radius:10px;font-size:15px;">Book a free consultation</a>
      </div>
      <p style="text-align:center;color:${C.na};font-size:12px;margin:18px 0 0;">© eFoli · Free Shopify tools</p>
    </div>
  </body></html>`;
}
