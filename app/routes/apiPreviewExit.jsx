import { redirect } from "react-router";
import { previewCookie } from "../utils/preview.server";

/**
 * Exit draft preview — GET /api/preview/exit
 * Clears the preview cookie and returns to the published homepage.
 */
export const loader = async () =>
  redirect("/", {
    headers: {
      "Set-Cookie": await previewCookie.serialize("", { maxAge: 0 }),
    },
  });

export default function ApiPreviewExit() {
  return null;
}
