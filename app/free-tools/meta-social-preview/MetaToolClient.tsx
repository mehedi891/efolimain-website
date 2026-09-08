"use client";

import ToolShell from "@/components/tools/ToolShell";
import type { ToolResult } from "@/lib/tools/types";

interface MetaData {
  title: string;
  description: string;
  displayUrl: string;
  og: { title?: string | null; description?: string | null; image?: string | null; siteName?: string | null };
  twitter: { card?: string | null; title?: string | null; description?: string | null; image?: string | null };
  favicon: string | null;
}

function GooglePreview({ d }: { d: MetaData }) {
  return (
    <div className="rounded-2xl bg-white p-5 ring-1 ring-gray-200">
      <p className="mb-3 text-xs font-semibold uppercase tracking-wide text-gray-500">Google result preview</p>
      <div className="max-w-xl">
        <div className="flex items-center gap-2 text-sm text-[#202124]">
          {/* remote favicon — plain img is fine */}
          {d.favicon && <img src={d.favicon} alt="" className="h-4 w-4 rounded-sm" />}
          <span className="truncate">{d.displayUrl}</span>
        </div>
        <p className="mt-1 truncate text-xl leading-tight text-[#1a0dab]">{d.title || "Untitled page"}</p>
        <p className="mt-1 line-clamp-2 text-sm text-[#4d5156]">
          {d.description || "No meta description — Google will guess one from the page."}
        </p>
      </div>
    </div>
  );
}

function SocialCard({ d }: { d: MetaData }) {
  const title = d.og.title || d.title || "Untitled";
  const desc = d.og.description || d.description || "";
  const img = d.og.image;
  return (
    <div className="rounded-2xl bg-white p-5 ring-1 ring-gray-200">
      <p className="mb-3 text-xs font-semibold uppercase tracking-wide text-gray-500">Social share preview</p>
      <div className="max-w-md overflow-hidden rounded-xl ring-1 ring-gray-200">
        {img ? (
          <img src={img} alt="" className="aspect-[1200/630] w-full object-cover" />
        ) : (
          <div className="grid aspect-[1200/630] w-full place-items-center bg-gray-100 text-sm text-gray-400">
            No og:image set
          </div>
        )}
        <div className="p-3">
          <p className="text-xs uppercase text-gray-400">{d.displayUrl}</p>
          <p className="truncate font-semibold text-[#13181E]">{title}</p>
          <p className="line-clamp-2 text-sm text-gray-500">{desc}</p>
        </div>
      </div>
    </div>
  );
}

export default function MetaToolClient() {
  return (
    <ToolShell
      tool="meta-social-preview"
      heading="Meta & Social Preview"
      subheading="See exactly how your store looks in Google and on social shares — and fix what's off."
      cta="Preview"
      renderVisual={(r: ToolResult) => {
        const d = r.data as unknown as MetaData;
        return (
          <div className="grid gap-4">
            <GooglePreview d={d} />
            <SocialCard d={d} />
          </div>
        );
      }}
    />
  );
}
