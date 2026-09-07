import { draftMode } from "next/headers";
import { redirect } from "next/navigation";

/**
 * Exit draft preview — GET /api/preview/exit
 * Disables Next draft mode and returns to the published homepage.
 */
export async function GET() {
  const draft = await draftMode();
  draft.disable();
  redirect("/");
}
