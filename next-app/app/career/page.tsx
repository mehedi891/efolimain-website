import type { Metadata } from "next";
import SiteChrome from "@/components/SiteChrome";
import Careerpage from "@/components/career/Careerpage";
import { getOpenJobs } from "@/data/jobs";

export const metadata: Metadata = {
  title: "Careers at eFoli | Build Your Future With Us",
  description:
    "Join a global team of innovators. Explore roles in development, design, support, and strategy, and grow your career while shaping digital commerce.",
  alternates: { canonical: "https://efoli.com/career" },
  openGraph: {
    title: "Careers at eFoli | Build Your Future With Us",
    description:
      "Join a global team of innovators. Explore roles in development, design, support, and strategy, and grow your career while shaping digital commerce.",
    type: "website",
    url: "https://efoli.com/career",
  },
};

// Open positions come from easy.jobs — refresh periodically (matches the
// 5-minute cache in the jobs data seam).
export const revalidate = 300;

// This page uses the light header + black footer (see docs §4.1 matrix).
export default async function CareerRoute() {
  const jobs = await getOpenJobs();
  return (
    <SiteChrome darkFooter>
      <Careerpage jobs={jobs} />
    </SiteChrome>
  );
}
