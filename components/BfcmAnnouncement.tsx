import Link from "next/link";
import { CAMPAIGN, PAGE_PATH, isCampaignLive } from "@/data/bfcmCampaign";

/**
 * Site-wide BFCM 2026 announcement bar, shown above the navbar on every public
 * page (rendered by SiteChrome). Links to the campaign page and stops rendering
 * once the campaign has ended — on static pages that takes effect at the next
 * build/revalidation after the end date.
 */
export default function BfcmAnnouncement() {
  if (!isCampaignLive()) return null;
  const ends = CAMPAIGN.endsLong.replace(/, \d{4}$/, "");
  return (
    <Link
      href={PAGE_PATH}
      className="block bg-[linear-gradient(90deg,#0b4d83,#1d74bf_50%,#168780)] px-4 py-[9px] text-center text-[0.82rem] font-bold uppercase tracking-[0.05em] text-white transition hover:brightness-110 focus-visible:outline-2 focus-visible:-outline-offset-2 focus-visible:outline-white"
    >
      BFCM 2026 • {CAMPAIGN.discount}% off eligible EFOLI plans for {CAMPAIGN.duration} • Ends {ends}
    </Link>
  );
}
