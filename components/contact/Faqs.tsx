import Generalfaq from "@/components/Generalfaq";

const Faqs = () => {
  const faqsArr = [
    {
      question: "Do you only provide services for Shopify?",
      answer: "We specialize in the Shopify ecosystem, such as apps, themes, and stores, because that’s where our products and experience are strongest. If your project is eCommerce or SaaS-related and connects to Shopify in any way, we’re usually a good fit."
    },
    {
      question: "What kind of services does eFoli offer?",
      answer: "eFoli builds and maintains Shopify apps, develops custom Shopify solutions (apps, themes, store setup, custom features), and provides white-label customer support through KivoSupport for SaaS and Shopify apps."
    },
    {
      question: "Who do you typically work with?",
      answer: "We work with Shopify merchants, SaaS founders, and agencies from early-stage startups to established brands who want stable products, thoughtful UX, and long-term technical or support partners."
    },
    {
      question: "Can you help with both new projects and existing apps or stores?",
      answer: "Yes. We can start from scratch with a new idea or step into an existing app or store to improve performance, add features, or take over ongoing maintenance and support."
    },
    {
      question: "What happens after I submit the contact form?",
      answer: "Our team reviews your message and usually replies within one business day. If there’s a potential fit, we’ll schedule a short call to understand your goals, then share next steps or a proposal based on your needs."
    },
    {
      question: "Do you work with platforms other than Shopify?",
      answer: "Our core expertise is Shopify and the Shopify App ecosystem. However, if your project involves eCommerce workflows, integrations, or SaaS tools that connect with Shopify, we can evaluate it. Feel free to reach out. If it’s a good fit, we’ll let you know how we can help."
    },
    {
      question: "Do you offer ongoing maintenance or long-term partnership plans?",
      answer: "Yes. We support long-term partnerships through continuous development, feature updates, performance optimization, bug fixes, and 24/7 customer support (via KivoSupport). Many clients rely on us as their dedicated technical team for stable, scalable growth."
    },
    {
      question: "Can eFoli help integrate third-party apps or custom APIs?",
      answer: "Absolutely. We frequently integrate third-party services, APIs, and external systems into Shopify apps or stores. Whether it’s payments, analytics, logistics, or custom business tools, we can build secure, seamless integrations tailored to your requirements."
    }
  ];
  return (
    <section>
      <div className="max-w-7xl mx-auto md:pb-20 md:pt-0 py-10 md:px-0 px-4">
        <h2 className="md:text-5xl/[1.125] text-3xl font-bold font-display text-[#13181E] text-center">Have Questions?</h2>

        <Generalfaq
          faqsArr={faqsArr}
          fClass="md:mt-20 mt-5 max-w-5xl mx-auto"
          defaultOpen={0}
          actionBtnType="plusminus"
        />
      </div>
    </section>
  );
};

export default Faqs;
