import type { Metadata } from "next";
import SiteChrome from "@/components/SiteChrome";
import AiToolClient from "./AiToolClient";

const TITLE = "Free AI Visibility Checker + llms.txt Generator — eFoli";
const DESCRIPTION =
  "Is your Shopify store visible to ChatGPT, Claude, Perplexity & Google AI? Check AI-crawler access (GPTBot, ClaudeBot, etc.) and generate a ready-to-use llms.txt.";

export const metadata: Metadata = {
  title: TITLE,
  description: DESCRIPTION,
  alternates: { canonical: "https://efoli.com/free-tools/ai-visibility-checker" },
  openGraph: { title: TITLE, description: DESCRIPTION, type: "website", url: "https://efoli.com/free-tools/ai-visibility-checker" },
};

export default function Route() {
  return (
    <SiteChrome darkFooter hideBanner>
      <AiToolClient />
    </SiteChrome>
  );
}
