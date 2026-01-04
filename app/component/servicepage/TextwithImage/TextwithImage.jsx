import Generalfaq from "../../Generalfaq/Generalfaq"
import sDev from "../../../images/sDevelopmet.webp";
import sCus from "../../../images/sCustomer.webp";


const TextwithImage = () => {
  const faqsArr = [
    {
      id: 1,
      question: "Email, Chat & Ticket Coverage",
      answer: "We handle all customer queries through email, live chat, and support tickets to ensure every issue is resolved quickly and professionally."
    },
    {
      id: 2,
      question: "Tier 1 & Tier 2 Shopify-Savvy Agents",
      answer: "Our trained agents manage both basic and advanced support cases, technical issues, specializing in Shopify apps and merchant workflows."
    },
    {
      id: 3,
      question: "Knowledge Base Creation",
      answer: "We build structured support systems backed by detailed research and continuous updates, ensuring every response is accurate, consistent, and aligned with customers’ needs."
    },
    {
      id: 4,
      question: "Feedback Collection & QA",
      answer: "We track user feedback, test workflows, and report insights to help you continuously improve app performance and customer satisfaction."
    },
    {
      id: 5,
      question: "Custom Time Zone / 24/7 Coverage",
      answer: "Our teams operate across global time zones, providing round-the-clock support that aligns perfectly with your users’ schedules."
    }
  ]

  const faqsArr2 = [
    {
      id: 1,
      question: "Shopify App Development",
      answer: "We design and build scalable Shopify apps tailored to your business goals, ensuring smooth performance and seamless integration with your store."
    },
    {
      id: 2,
      question: "Shopify Theme Customization",
      answer: "We customize Shopify themes to match your brand identity, creating a unique storefront that delivers both style and functionality."
    },
    {
      id: 3,
      question: "Shopify Store Setup",
      answer: "We handle the complete setup of your Shopify store from product configuration to navigation, ensuring a fast, conversion-ready launch."
    },
    {
      id: 4,
      question: "Custom Page Design",
      answer: "We design high-impact, user-friendly pages that enhance engagement and reflect your brand’s visual personality across every touchpoint."
    },
    {
      id: 5,
      question: "Custom Script & Coding",
      answer: "We write clean, optimized scripts and code for advanced Shopify functionalities, giving your store custom features that work flawlessly."
    }
  ]
  return (
    <section>
      <div className="max-w-7xl mx-auto md:py-30 md:pt-5 py-10 md:px-0 px-4">
          <div className="flex items-start justify-between gap-7 flex-wrap md:flex-row flex-col md:flex-nowrap md:gap-25 md:mb-25 mb-15">
              <div className="md:w-[48%] w-full">
                {/* <div className="h-[450px] md:w-[95%] w-full bg-[#D9D9D9]"></div> */}
                <img src={sCus} alt="Customer Suppport" className="max-w-full object-cover " />
              </div>

              <div className="md:w-[48%] ">
                  <h4 className="text-3xl md:text-5xl font-bold font-display tracking-[-1.44px]">Customer Support</h4>
                  <p className="text-base md:text-lg/[1.55] text-[#4B5154] mb-7 mt-5">Real, human-powered 24/7 support teams trained in the Shopify ecosystem. We provide white-label service under your brand, ensuring seamless merchant assistance while you stay focused on scaling your app.</p>

                  <Generalfaq
                   faqsArr={faqsArr}
                  />
              </div>
          </div>

         <div className="border border-[#e5e5e5]"></div>

          <div className="flex items-start justify-between gap-7 flex-wrap md:flex-row flex-col md:flex-nowrap md:gap-25 md:mt-25 mt-15">

              <div className="md:w-[48%] ">
                  <h4 className="text-3xl md:text-5xl font-bold font-display tracking-[-1.44px]">Development</h4>
                  <p className="text-base md:text-lg/[1.55] text-[#4B5154] mb-7 mt-5">We build robust, scalable Shopify apps and custom software solutions backed by research, innovation, and clean code. Our development process focuses on performance, reliability, and long-term growth for every client we serve.</p>

                  <Generalfaq
                   faqsArr={faqsArr2}
                  />
              </div>

             <div className="md:w-[48%] w-full">
                <img src={sDev} alt="Shopify development" className="max-w-full object-cover " />
              </div>


          </div>
      </div>
    </section>
  )
}

export default TextwithImage