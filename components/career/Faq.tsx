import Generalfaq from "@/components/Generalfaq";

const Faq = () => {
  const faqsArr = [
    {
      question: "What kind of roles does eFoli hire for?",
      answer: "We hire across multiple teams, including development, design, marketing, QA, customer success, and technical support. We value creativity, curiosity, and problem-solving over titles, so if you’re passionate about innovation, there’s a place for you here."
    },
    {
      question: "Does eFoli offer remote or hybrid work opportunities?",
      answer: "Many of our team members work in hybrid setups."
    },
    {
      question: "How can I partner with eFoli?",
      answer: "If you’re an agency, app developer, or tech collaborator, you can partner with us through product integrations, affiliate programs, or joint marketing initiatives. Simply reach out via partnership@efoli.com to start the conversation."
    },
    {
      question: "What type of companies does eFoli typically work with?",
      answer: "We work with global eCommerce brands, SaaS businesses, and Shopify merchants, from startups to enterprise-level organizations, helping them scale with automation, personalization, and seamless user experiences."
    },
    {
      question: "Why should I join or collaborate with eFoli?",
      answer: "eFoli isn’t just a workplace, it’s a community of innovators building tools that empower thousands of businesses worldwide. Whether you join the team or partner with us, you become part of a mission that’s shaping the future of digital commerce."
    },
    {
      question: "What skills or qualities do you look for in candidates?",
      answer: "We look for people who take initiative, communicate clearly, and care about building things that make an impact. Whether you’re technical or creative, we value a growth mindset, attention to detail, and a collaborative spirit."
    },
    {
      question: "Does eFoli provide opportunities for learning and career growth?",
      answer: "Yes. We invest in long-term growth through mentorship, cross-team collaboration, and real project exposure. Our team members gain hands-on experience with global SaaS products and the latest eCommerce technologies."
    },
    {
      question: "What’s the recruitment process like at eFoli?",
      answer: "After you apply, our team reviews your profile and reaches out if there’s a fit. The process usually includes a written exam, a technical or skill-based task, and a final interview to ensure alignment with our values and goals."
    },


  ];



  return (
    <section>
      <div className="max-w-7xl mx-auto md:pb-20 pb-0 text-[#13181E] md:px-0 px-4">
        <div className="flex flex-wrap justify-between">
          <h2 className="md:text-5xl/[1.192] text-3xl md:text-left text-center font-display font-bold md:max-w-[500px]  max-w-full md:flex-none flex-1 md:mb-0 mb-10">
            Frequently Asked <br />Questions
          </h2>

          <Generalfaq faqsArr={faqsArr} defaultOpen={0} fClass="max-w-[750px]" />
        </div>
      </div>
    </section>
  );
};

export default Faq;
