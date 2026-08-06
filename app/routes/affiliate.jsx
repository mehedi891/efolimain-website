import { useNavigation } from "react-router";
import Affiliatepage from "../component/affiliatepage/Affiliatepage";
import ElegantFloatingText from "../component/Loader/ElegantFloatingText";
import { config, faqs } from "../data/affiliateContent";

export function meta() {
  const title = "Affiliate & Partner Program | Earn Recurring Revenue with eFoli";
  const description = `Refer merchants to eFoli's Shopify apps and earn up to ${config.topRate}% recurring commission on every subscription — paid monthly, for as long as they stay subscribed.`;
  const url = "https://efoli.com/affiliate";

  return [
    { title },
    { name: "description", content: description },
    { property: "og:title", content: title },
    { property: "og:description", content: description },
    { property: "og:type", content: "website" },
    { property: "og:url", content: url },
    { name: "twitter:card", content: "summary_large_image" },
    { tagName: "link", rel: "canonical", href: url },
    {
      "script:ld+json": {
        "@context": "https://schema.org",
        "@type": "FAQPage",
        mainEntity: faqs.map((f) => ({
          "@type": "Question",
          name: f.question,
          acceptedAnswer: { "@type": "Answer", text: f.answer },
        })),
      },
    },
  ];
}

const Affiliate = () => {
  const navigation = useNavigation();
  return navigation.state === "loading" ? (
    <div className="h-lvh w-lvw bg-blue-50 flex items-center justify-center">
      <ElegantFloatingText text={"Loading..."} />
    </div>
  ) : (
    <Affiliatepage />
  );
};

export default Affiliate;
