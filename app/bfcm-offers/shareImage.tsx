import { readFile } from "node:fs/promises";
import { join } from "node:path";
import { ImageResponse } from "next/og";
import { CAMPAIGN } from "@/data/bfcmCampaign";

/**
 * Social share card for /bfcm-offers (LinkedIn, Facebook, X, Slack…), rendered
 * once at build by opengraph-image.tsx and twitter-image.tsx. Flexbox only —
 * that's what next/og supports. Images are inlined as data URIs (PNG/SVG).
 */

export const shareAlt = `EFOLI BFCM 2026: ${CAMPAIGN.discount}% off eligible EFOLI plans for ${CAMPAIGN.duration} plus Shopify partner offers. Code ${CAMPAIGN.code}, ends ${CAMPAIGN.endsMedium}.`;
export const shareSize = { width: 1200, height: 630 };

const toDataUri = (buf: Buffer, mime: string) => `data:${mime};base64,${buf.toString("base64")}`;

/** Literal paths (not a loop over a variable) so the bundler traces only these files. */
function loadAssets() {
  const cwd = process.cwd();
  return Promise.all([
    readFile(join(cwd, "public/brand/logo.svg")),
    readFile(join(cwd, "public/img/home/mv_icon.png")),
    readFile(join(cwd, "public/img/home/pbLogo.png")),
    readFile(join(cwd, "public/img/home/drLogo.png")),
    readFile(join(cwd, "public/img/home/emLogo.png")),
    readFile(join(cwd, "public/img/home/or_icon.png")),
    readFile(join(cwd, "public/img/home/qw-icon-color.png")),
  ]);
}

export async function renderShareImage() {
  const [logoBuf, ...iconBufs] = await loadAssets();
  const logo = toDataUri(logoBuf, "image/svg+xml");
  const icons = iconBufs.map((b) => toDataUri(b, "image/png"));

  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between",
          padding: "56px 64px",
          color: "#fff",
          background: "linear-gradient(135deg, #060a18 0%, #0b4d83 55%, #1d74bf 100%)",
        }}
      >
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
          <div style={{ display: "flex", alignItems: "center", gap: 16 }}>
            <img src={logo} alt="" width={72} height={72} style={{ borderRadius: 16, background: "#fff" }} />
            <div style={{ display: "flex", fontSize: 26, fontWeight: 700, letterSpacing: 2 }}>EFOLI</div>
          </div>
          <div
            style={{
              display: "flex",
              padding: "10px 20px",
              borderRadius: 999,
              border: "2px solid rgba(255,255,255,0.35)",
              fontSize: 22,
              fontWeight: 700,
              letterSpacing: 2,
            }}
          >
            BFCM 2026 · PARTNER CAMPAIGN
          </div>
        </div>

        <div style={{ display: "flex", flexDirection: "column", gap: 18 }}>
          <div style={{ display: "flex", fontSize: 64, fontWeight: 800, lineHeight: 1.05, letterSpacing: -2 }}>
            Shopify App Deals &amp; Partner Offers
          </div>
          <div style={{ display: "flex", alignItems: "center", gap: 22 }}>
            <div style={{ display: "flex", fontSize: 96, fontWeight: 800, color: "#d6ff4f", letterSpacing: -4 }}>
              {`${CAMPAIGN.discount}% OFF`}
            </div>
            <div style={{ display: "flex", flexDirection: "column", fontSize: 28, lineHeight: 1.25, color: "#dbe8f7" }}>
              <span>eligible EFOLI plans</span>
              <span>{`for ${CAMPAIGN.duration}`}</span>
            </div>
          </div>
        </div>

        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
          <div style={{ display: "flex", gap: 14 }}>
            {icons.map((src, i) => (
              <img key={i} src={src} alt="" width={64} height={64} style={{ borderRadius: 14, background: "#fff" }} />
            ))}
          </div>
          <div style={{ display: "flex", flexDirection: "column", alignItems: "flex-end", fontSize: 26 }}>
            <span style={{ fontWeight: 700 }}>{`Code ${CAMPAIGN.code} · Ends ${CAMPAIGN.endsMedium}`}</span>
            <span style={{ color: "#9cc9ff" }}>efoli.com/bfcm-offers</span>
          </div>
        </div>
      </div>
    ),
    shareSize,
  );
}
