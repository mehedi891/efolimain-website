import { renderShareImage, shareAlt, shareSize } from "./shareImage";

// Share card for this page (generated at build; see shareImage.tsx).
export const alt = shareAlt;
export const size = shareSize;
export const contentType = "image/png";

export default async function Image() {
  return renderShareImage();
}
