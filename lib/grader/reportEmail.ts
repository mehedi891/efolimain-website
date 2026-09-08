/**
 * Email the full report to the visitor + forward the lead to eFoli.
 *
 * Reuses the same SMTP/nodemailer configuration as /api/contact (service "gmail",
 * SMTP_HOST/PORT/USER/PASS env). Attaches the PDF when it could be generated.
 */

import { createTransport } from "nodemailer";
import type { Report } from "./types";
import { renderReportHtml, renderReportEmailBody, renderReportText } from "./reportHtml";
import { renderReportPdf } from "./pdf";

function transport() {
  return createTransport({
    service: "gmail",
    host: process.env.SMTP_HOST,
    port: Number(process.env.SMTP_PORT),
    secure: true,
    auth: { user: process.env.SMTP_USER, pass: process.env.SMTP_PASS },
  });
}

function host(url: string): string {
  return url.replace(/^https?:\/\//, "").replace(/\/$/, "");
}

export interface SendResult {
  emailed: boolean;
  pdf: boolean;
}

/**
 * Sends the report to the visitor and a lead notice to eFoli. Throws on SMTP
 * failure — the caller decides how to surface that (the on-page report still
 * reveals regardless).
 */
export async function sendReportEmail(report: Report): Promise<SendResult> {
  const to = report.email;
  if (!to) return { emailed: false, pdf: false };

  // Short, engaging email body; the FULL report is the attached PDF.
  const body = renderReportEmailBody(report);
  const text = renderReportText(report);
  const pdf = await renderReportPdf(renderReportHtml(report));
  const attachments = pdf
    ? [{ filename: `eFoli-store-audit-${host(report.url)}.pdf`, content: pdf, contentType: "application/pdf" }]
    : [];

  const t = transport();
  const sender = process.env.SMTP_USER;
  const from = sender ? `eFoli Store Audit <${sender}>` : "eFoli Store Audit";

  // 1) Engaging summary + attached PDF to the visitor.
  await t.sendMail({
    from,
    to,
    subject: `Your Shopify store audit — ${report.storeScore}/100 (${host(report.url)})`,
    text,
    html: body,
    attachments,
  });

  // 2) Lead notice to eFoli.
  if (sender) {
    await t.sendMail({
      from,
      to: sender,
      replyTo: to,
      subject: `New store-audit lead: ${host(report.url)} — ${report.storeScore}/100`,
      text: [
        `Email: ${to}`,
        `Store: ${report.url}`,
        `Store score: ${report.storeScore}/100 (Grade ${report.grade})`,
        `BFCM readiness: ${report.bfcm.score}/100 — ${report.bfcm.status}`,
        `Shopify: ${report.isShopify ? "yes" : "unconfirmed"}`,
        `Scanned: ${report.scannedAt}`,
      ].join("\n"),
    });
  }

  return { emailed: true, pdf: !!pdf };
}
