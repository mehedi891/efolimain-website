"use client";

import ToolShell from "@/components/tools/ToolShell";
import type { ToolResult } from "@/lib/tools/types";

export default function SchemaToolClient() {
  return (
    <ToolShell
      tool="structured-data-checker"
      heading="Structured Data Checker"
      subheading="Validate your Product, Organization & Breadcrumb schema — and find what's blocking rich results in Google."
      cta="Check schema"
      placeholder="yourstore.com/products/your-product"
      renderVisual={(r: ToolResult) => {
        const types = (r.data.types as string[]) ?? [];
        const productCount = (r.data.productCount as number) ?? 0;
        return (
          <div className="rounded-2xl bg-white p-5 ring-1 ring-gray-200">
            <p className="mb-3 text-xs font-semibold uppercase tracking-wide text-gray-500">
              Structured data found ({productCount} product node{productCount === 1 ? "" : "s"})
            </p>
            {types.length ? (
              <div className="flex flex-wrap gap-2">
                {types.map((t) => (
                  <span key={t} className="rounded-full bg-[#F2FBFA] px-3 py-1 text-sm font-semibold text-[#0A7ACC] ring-1 ring-[#0D99FF]/15">
                    {t}
                  </span>
                ))}
              </div>
            ) : (
              <p className="text-sm text-gray-400">No JSON-LD structured data found on this page.</p>
            )}
          </div>
        );
      }}
    />
  );
}
