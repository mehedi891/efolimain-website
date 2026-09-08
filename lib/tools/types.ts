/**
 * Shared result shape for the lightweight /free-tools. Each tool's analyzer
 * produces a ToolResult: a headline, a list of checks, and a tool-specific
 * `data` payload for custom rendering (social cards, generated llms.txt, etc.).
 */

export type ToolStatus = "pass" | "warn" | "fail" | "na" | "info";

export interface ToolCheck {
  id: string;
  label: string;
  status: ToolStatus;
  value?: string;
  fix?: string;
  ref?: string;
  /** Free in the teaser (true) vs gated behind the email unlock (false). */
  free?: boolean;
}

export interface ToolResult {
  /** Tool slug, e.g. "meta-social-preview". */
  tool: string;
  url: string;
  host: string;
  scannedAt: string;
  /** Optional headline score 0..100 + label. */
  score?: number;
  grade?: string;
  summary: string;
  checks: ToolCheck[];
  /** Tool-specific payload rendered by that tool's client. */
  data: Record<string, unknown>;
  notes: string[];
}
