import type { Metadata } from "next";
import { listCategories, listPartners } from "@/lib/bfcm/store";
import { CAMPAIGN, PAGE_PATH } from "@/data/bfcmCampaign";
import PartnersBoard from "./PartnersBoard";
import DbMissing from "../DbMissing";

export const metadata: Metadata = { title: "BFCM partners · eFoli admin", robots: { index: false, follow: false } };
export const dynamic = "force-dynamic";

export default async function BfcmPartnersAdmin() {
  const [partners, categories] = await Promise.all([listPartners(), listCategories()]);
  if (!partners || !categories) return <DbMissing />;
  return (
    <PartnersBoard initial={partners} categories={categories} visibleCount={CAMPAIGN.partnersVisible} pagePath={PAGE_PATH} />
  );
}
