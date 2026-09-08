/** Slug → analyzer registry for the lightweight /free-tools. */

import type { ToolResult } from "./types";
import { analyzeMeta } from "./analyzers/meta";
import { analyzeSchema } from "./analyzers/schema";
import { analyzeAiVisibility } from "./analyzers/aiVisibility";

export interface ToolDef {
  slug: string;
  name: string;
  analyze: (url: string) => Promise<ToolResult>;
}

export const TOOLS: Record<string, ToolDef> = {
  "meta-social-preview": { slug: "meta-social-preview", name: "Meta & Social Preview", analyze: analyzeMeta },
  "structured-data-checker": { slug: "structured-data-checker", name: "Structured Data Checker", analyze: analyzeSchema },
  "ai-visibility-checker": { slug: "ai-visibility-checker", name: "AI Visibility Checker", analyze: analyzeAiVisibility },
};

export function getTool(slug: string): ToolDef | null {
  return TOOLS[slug] ?? null;
}
