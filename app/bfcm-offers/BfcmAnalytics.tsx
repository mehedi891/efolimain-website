"use client";

import { useEffect } from "react";
import { sendGAEvent } from "@next/third-parties/google";

const CAMPAIGN_ID = "bfcm_2026";

/**
 * One delegated click listener for the BFCM page. Elements opt in with
 * data-ev="<event>" plus data-* params (data-offer-id, data-category, …), so
 * tracking stays declarative in the markup and every click fires exactly once
 * (the nearest data-ev element wins). Params are sent snake_cased to GA4,
 * always with campaign_id.
 *
 * Events: hero_cta_click, category_select, promo_code_copy, efoli_offer_click,
 * partner_deal_click, expand_more_deals, support_click.
 */
export default function BfcmAnalytics() {
  useEffect(() => {
    function onClick(e: MouseEvent) {
      const el = (e.target as Element | null)?.closest<HTMLElement>("[data-ev]");
      const ev = el?.dataset.ev;
      if (!el || !ev) return;
      const params: Record<string, string> = { campaign_id: CAMPAIGN_ID };
      for (const [key, value] of Object.entries(el.dataset)) {
        if (key !== "ev" && value) params[key.replace(/[A-Z]/g, (c) => `_${c.toLowerCase()}`)] = value;
      }
      sendGAEvent("event", ev, params);
    }
    document.addEventListener("click", onClick);
    return () => document.removeEventListener("click", onClick);
  }, []);
  return null;
}
