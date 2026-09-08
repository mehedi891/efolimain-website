"use client";

import { useState } from "react";
import { FiCopy, FiCheck } from "react-icons/fi";
import ToolShell from "@/components/tools/ToolShell";
import type { ToolResult } from "@/lib/tools/types";

function CopyButton({ text }: { text: string }) {
  const [copied, setCopied] = useState(false);
  return (
    <button
      type="button"
      onClick={async () => {
        try {
          await navigator.clipboard.writeText(text);
          setCopied(true);
          setTimeout(() => setCopied(false), 1500);
        } catch {
          /* ignore */
        }
      }}
      className="inline-flex items-center gap-1.5 rounded-lg bg-white/10 px-2.5 py-1 text-xs font-semibold text-white hover:bg-white/20 cursor-pointer"
    >
      {copied ? <FiCheck aria-hidden /> : <FiCopy aria-hidden />}
      {copied ? "Copied" : "Copy"}
    </button>
  );
}

export default function AiToolClient() {
  return (
    <ToolShell
      tool="ai-visibility-checker"
      heading="AI Visibility Checker"
      subheading="Can ChatGPT, Claude, Perplexity & Google AI find and quote your store? Check crawler access and get a ready-to-use llms.txt."
      cta="Check AI visibility"
      renderVisual={(r: ToolResult) => {
        const blocked = (r.data.blockedBots as string[]) ?? [];
        const llms = (r.data.generatedLlmsTxt as string) ?? "";
        return (
          <div className="grid gap-4">
            <div className="rounded-2xl bg-white p-5 ring-1 ring-gray-200">
              <p className="mb-2 text-xs font-semibold uppercase tracking-wide text-gray-500">AI crawler access</p>
              {blocked.length ? (
                <p className="text-sm font-medium text-[#dc2626]">Blocking: {blocked.join(", ")}</p>
              ) : (
                <p className="text-sm font-medium text-[#16a34a]">All major AI crawlers are allowed ✓</p>
              )}
            </div>
            <div className="rounded-2xl bg-[#010A1E] p-5">
              <div className="flex items-center justify-between">
                <p className="text-xs font-semibold uppercase tracking-wide text-white/60">Generated llms.txt</p>
                <CopyButton text={llms} />
              </div>
              <pre className="mt-3 overflow-x-auto whitespace-pre-wrap text-xs leading-relaxed text-white/90">{llms}</pre>
            </div>
          </div>
        );
      }}
    />
  );
}
