import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { getPartner, listCategories } from "@/lib/bfcm/store";
import { CAMPAIGN } from "@/data/bfcmCampaign";
import PartnerForm from "../PartnerForm";
import DbMissing from "../../DbMissing";

export const metadata: Metadata = { title: "Edit partner · eFoli admin", robots: { index: false, follow: false } };
export const dynamic = "force-dynamic";

export default async function EditPartnerPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const [partner, categories] = await Promise.all([getPartner(id), listCategories()]);
  if (!categories) return <DbMissing />;
  if (!partner) notFound();
  return <PartnerForm initial={partner} categories={categories} defaultUntil={CAMPAIGN.endsAt.slice(0, 10)} />;
}
