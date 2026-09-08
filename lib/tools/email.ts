/**
 * Email a tool result to the visitor + forward the lead to eFoli.
 *
 * Matches the store-audit email: a SHORT, engaging body + the full report as an
 * attached PDF (rendered from `renderToolHtml` via the shared headless-Chrome
 * `renderReportPdf`). Reuses the same SMTP config as /api/contact.
 */

import { createTransport } from "nodemailer";
import type { ToolResult } from "./types";
import { renderToolHtml, renderToolEmailBody } from "./toolHtml";
import { renderReportPdf } from "../grader/pdf";

function transport() {
  return createTransport({
    service: "gmail",
    host: process.env.SMTP_HOST,
    port: Number(process.env.SMTP_PORT),
    secure: true,
    auth: { user: process.env.SMTP_USER, pass: process.env.SMTP_PASS },
  });
}

export interface ToolSendResult {
  emailed: boolean;
  pdf: boolean;
}

export async function sendToolEmail(result: ToolResult, email: string, toolName: string): Promise<ToolSendResult> {
  if (!email) return { emailed: false, pdf: false };

  const body = renderToolEmailBody(result, toolName);
  const pdf = await renderReportPdf(renderToolHtml(result, toolName));
  const attachments = pdf
    ? [{ filename: `eFoli-${result.tool}-${result.host}.pdf`, content: pdf, contentType: "application/pdf" }]
    : [];

  const t = transport();
  const sender = process.env.SMTP_USER;
  const from = sender ? `eFoli Free Tools <${sender}>` : "eFoli Free Tools";

  await t.sendMail({
    from,
    to: email,
    subject: `${toolName} report — ${result.host}`,
    html: body,
    text: `${toolName} report for ${result.host}\n${result.summary}\nYour full report is attached as a PDF. Need help? https://efoli.com/contact-us`,
    attachments,
  });

  if (sender) {
    await t.sendMail({
      from,
      to: sender,
      replyTo: email,
      subject: `New free-tool lead: ${toolName} — ${result.host}`,
      text: [`Email: ${email}`, `Tool: ${toolName}`, `URL: ${result.url}`, `Score: ${result.score ?? "n/a"}`].join("\n"),
    });
  }

  return { emailed: true, pdf: !!pdf };
}
