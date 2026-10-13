import type { Metadata } from "next";
import { listCategories } from "@/lib/bfcm/store";
import { CAMPAIGN } from "@/data/bfcmCampaign";
import PartnerForm from "../PartnerForm";
import DbMissing from "../../DbMissing";

export const metadata: Metadata = { title: "Add partner · eFoli admin", robots: { index: false, follow: false } };
export const dynamic = "force-dynamic";

export default async function NewPartnerPage() {
  const categories = await listCategories();
  if (!categories) return <DbMissing />;
  return <PartnerForm initial={null} categories={categories} defaultUntil={CAMPAIGN.endsAt.slice(0, 10)} />;
}
