/**
 * Admin leads CSV export — GET with the same filters as the list endpoint
 * (tool, q, from, to), no pagination. Requires a valid admin session.
 */

import { getAdminSession } from "@/lib/admin/auth";
import { listLeadsForExport, type LeadRow } from "@/lib/admin/data";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

/** Quote a CSV field, escaping embedded quotes; guard against CSV injection. */
function csvCell(value: string): string {
  let v = value ?? "";
  if (/^[=+\-@]/.test(v)) v = `'${v}`; // neutralize spreadsheet formula injection
  return `"${v.replace(/"/g, '""')}"`;
}

function toCsv(rows: LeadRow[]): string {
  const header = ["Email", "Name", "Store URL", "Tools", "First seen", "Last seen"];
  const lines = rows.map((r) =>
    [r.email, r.name, r.storeUrl, r.tools.join(" | "), r.createdAt, r.updatedAt].map(csvCell).join(","),
  );
  return [header.map(csvCell).join(","), ...lines].join("\r\n");
}

export async function GET(request: Request) {
  if (!(await getAdminSession())) {
    return Response.json({ success: false, message: "Unauthorized." }, { status: 401 });
  }

  const sp = new URL(request.url).searchParams;
  const rows = await listLeadsForExport({
    tool: sp.get("tool") || undefined,
    q: sp.get("q") || undefined,
    from: sp.get("from") || undefined,
    to: sp.get("to") || undefined,
  });

  const csv = `﻿${toCsv(rows)}`; // BOM so Excel reads UTF-8
  const stamp = new Date().toISOString().slice(0, 10);
  return new Response(csv, {
    headers: {
      "Content-Type": "text/csv; charset=utf-8",
      "Content-Disposition": `attachment; filename="efoli-leads-${stamp}.csv"`,
    },
  });
}
