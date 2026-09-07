"use client";

import AnimatedSection from "@/components/AnimatedSection";
import Button from "@/components/Button";
import Timer3 from "./Countdown";
import Link from "next/link";
import Form from "@/components/Form";
import { AnimatePresence, motion } from "motion/react";
import { useMemo, useState } from "react";
import SliderMarque from "@/components/SliderMarque";
import FormsubmitSuccessModal from "@/components/contact/FormsubmitSuccessModal";
import Image from "next/image";
import hero from "@/public/img/offer/hero.webp";
import mvIcon from "@/public/img/offer/mv_icon.png";
import pbIcon from "@/public/img/offer/pbLogo.png";
import drIcon from "@/public/img/offer/drLogo.png";
import emIcon from "@/public/img/offer/emLogo.png";
import pb_demo from "@/public/img/offer/pb.webp";
import dr_demo from "@/public/img/offer/dr.webp";
import mv_demo from "@/public/img/offer/mv_demo.png";
import em_demo from "@/public/img/offer/emDemo.webp";
import currveBg from "@/public/img/offer/sectionBg.png";
import plusImg from "@/public/img/offer/plus.svg";
import minusImg from "@/public/img/offer/minus.svg";

const shape = "/img/offer/shape.png";
const t1 = "/img/offer/discount.png";

const Offerpage = () => {
  const [copyCodeSuccess, setCopyCodeSuccess] = useState(false);
  const [showFaq, setShowFaq] = useState<number | null>(0);
  const handleShowFaq = (index: number) => setShowFaq(showFaq === index ? null : index);
  const images = useMemo(() => [t1, t1, t1, t1, t1, t1], []);
  const faqsArr = [
    {
      id: 1,
      question: "How can eFoli apps help me get ready for Black Friday?",
      answer: "eFoli apps are built to help Shopify merchants handle high traffic and large orders during Black Friday. You can set up discounts, create product bundles, and manage bulk orders in minutes. No coding required."
    },
    {
      id: 2,
      question: "Can I run multiple Black Friday deals at the same time?",
      answer: "Yes. With DiscountRay, you can schedule and stack different discounts, like bulk, tiered, or personalized offers, to run together or separately during your Black Friday campaign."
    },
    {
      id: 3,
      question: "How do I manage large Black Friday orders efficiently?",
      answer: "MultiVariants makes it easy to handle bulk or wholesale orders by letting customers add multiple variants to their cart at once and apply quantity restrictions to keep stock organized."
    },
    {
      id: 4,
      question: "What’s included in the 25% Black Friday offer?",
      answer: "During the campaign, you’ll receive 25% off all eFoli Shopify apps, which are MultiVariants, DiscountRay, PushBundle, and EmbedUp. The offer applies to all paid plans for both new and existing merchants."
    },
    {
      id: 5,
      question: " Can I use PushBundle to create Black Friday gift bundles?",
      answer: "Absolutely. PushBundle lets you design “Buy More, Save More” or “Gift Box” bundles that drive higher order values. You can mix products, set discounts, and show live savings instantly."
    },
    {
      id: 6,
      question: "Will my discounts and bundles work with Shopify checkout during Black Friday?",
      answer: "Yes. All eFoli apps are fully compatible with Shopify’s checkout system and discount engine, so your Black Friday deals apply automatically and reliably."
      ,
    },
    {
      id: 7,
      question: "Can I promote my Black Friday products outside Shopify?",
      answer: "Yes. EmbedUp lets you embed products or collections directly on external websites, blogs, or partner pages, helping you reach new customers while keeping Shopify’s secure checkout."
    },
    {
      id: 8,
      question: "Do I need any technical setup before Black Friday?",
      answer: "No advanced setup is needed. All eFoli apps are plug-and-play and optimized for Shopify 2.0, so you can launch your Black Friday campaigns quickly and focus on sales."
    }
  ];

  const handleCopyCode = () => {
    navigator.clipboard.writeText("BFCM30");
    setCopyCodeSuccess(true);
  };

  return (
    <>
      <section className="">
        <div className="grid ">
          <Image src={hero} alt="Offerpage Hero" className="w-full h-auto col-start-1 row-start-1" sizes="100vw" priority />
          <div className="col-start-1 row-start-1 z-10 place-self-center pt-100">
            <Timer3 endDate="2025-11-29T00:00:00Z" persistKey="bfcm-countdown" />
            <div className="flex items-center gap-4">
              <Link href={"/offer/#efProducts"} >
                <Button
                  text1="Explore Our Products"
                  text2="Explore Our Products"
                  pClass="bg-[#0D99FF] py-4.5 px-7 text-[#fff] rounded-lg mt-10 mb-10 mx-auto block shadow-md text-xl"
                />
              </Link>
              <button
              onClick={handleCopyCode}
                className="
    relative inline-flex items-center justify-center
    px-10 py-5 text-2xl text-white
    rounded-[10px] cursor-pointer overflow-hidden bg-transparent

    /* spinning rainbow border (behind) */
    before:content-[''] before:absolute
    before:top-[-50%] before:left-[-50%]
    before:w-[200%] before:h-[200%]
    before:bg-[conic-gradient(red,yellow,lime,aqua,blue,magenta,red)]
    before:animate-[spin_2s_linear_infinite]
    before:z-[-2]

    /* inner black panel (above ::before, below content) */
    after:content-[''] after:absolute
    after:top-[2px] after:left-[2px] after:right-[2px] after:bottom-[2px]
    after:bg-black after:rounded-[8px]
    after:z-[-1]
  "
              >
                Copy Discount Code BFCM30
              </button>

              {/* keyframes for the conic spin */}
              <style>{`
  @keyframes spin {
    0% { transform: rotate(0deg); }
    100% { transform: rotate(360deg); }
  }
`}</style>

            </div>
          </div>
        </div>

        <div>
          <Image src={currveBg} alt="Section" className="w-full h-auto" sizes="100vw" />
        </div>
      </section>

      <section className="bg-[#0D0827] py-30 relative top-[-1px]">
        <AnimatedSection>
          <div id="efProducts" className="mx-auto max-w-7xl px-4 md:px-0 ">
            <h2 className="font-display md:text-5xl/[1.25] text-3xl text-[#fff] font-bold text-center pt-2 md:mb-3 mb-4">Dominate Black Friday with the <br /> Power of eFoli</h2>
            <p className="text-lg/[1.66] text-[#fff] max-w-[801px] mx-auto md:mb-20 mb-10 text-center">eFoli turns complex selling into simple experiences this Black Friday. Achieve smooth bulk ordering, tailored discounts, irresistible bundles, and effortless multi-channel sales.</p>

            <div className="mb-7 flex md:flex-wrap flex-wrap-reverse items-center justify-between shadow-lg p-10 rounded-2xl bg-linear-to-r from-[#fff] to-[#f2fbfa] transition ease-in duration-300 hover:scale-105 hover:cursor-pointer hover-drop-shadow-2xl">
              <div className="max-w-[550px]">
                <div className="flex items-center gap-2">
                  <Image src={mvIcon} alt="Multivariants" className="md:max-w-[42px] max-w-[35px] h-auto" />
                  <h4 className="md:text-2xl text-xl text-[#13181E] font-bold font-display">MultiVariants ‑ Bulk Order</h4>
                </div>
                <div className="mt-6 mb-4 text-[#13181E]">
                  <h4 className="text-lg text-[#13181E] font-medium mb-6">Black Friday Offer: <span className="text-xl font-bold">Get 30% Off (Code: BFCM30)</span></h4>
                  <p className="font-semibold">Top Features:</p>
                  <ul className="mt-2 pl-5 space-y-2 list-disc">
                    <li><span className="font-semibold">Grid & List Layouts:</span> Let customers add multiple variants to the cart in one click.</li>
                    <li><span className="font-semibold"> Min/Max Quantity Control: </span>Enforce order limits for precise wholesale management..</li>
                    <li><span className="font-semibold">Mix & Match Bundles:</span> Allow customers to combine variants easily.</li>
                    <li><span className="font-semibold">Live Inventory Display: </span>Show in-stock and out-of-stock badges in real time.</li>
                  </ul>
                </div>

                <a href={"https://apps.shopify.com/multivariants/"} target="_blank" rel="noopener noreferrer" >
                  <Button
                    text1="👉 Get the Offer"
                    text2="👉 Get the Offer"
                    pClass="bg-[#0D99FF] py-3.5 px-6 text-[#fff] rounded-lg block shadow-md"
                  />
                </a>




              </div>

              <div className="max-w-[500px]">
                <Image className="object-cover w-full h-auto" src={mv_demo} alt="Multivariants" sizes="(max-width: 768px) 100vw, 600px" />
              </div>

            </div>

            <div className="flex flex-wrap gap-7 justify-between flex-col">

              <div className=" flex flex-row-reverse  gap-4 items-center justify-between shadow-lg p-8 rounded-2xl bg-linear-to-r from-[#fff] to-[#f2fbfa] max-w-full md:max-w-[100%]
          transition ease-in duration-300 hover:scale-105 hover:cursor-pointer hover-drop-shadow-2xl flex-1
          ">
                <div className="max-w-[550px]">
                  <div className="flex items-center gap-2">
                    <Image src={drIcon} alt="Multivariants" className="md:max-w-[42px] max-w-[35px] h-auto" />
                    <h4 className="md:text-2xl text-xl text-[#13181E] font-bold font-display">DiscountRay ‑ B2B Custom Pricing</h4>
                  </div>
                  <div className="mt-6 mb-4 text-[#13181E]">
                    <h4 className="text-lg text-[#13181E] font-medium mb-6">Black Friday Offer: <span className="text-xl font-bold">Get 30% Off (Code: BFCM30)</span></h4>
                    <p className="font-semibold">Top Features:</p>
                    <ul className="mt-2 pl-5 space-y-2 list-disc">
                      <li><span className="font-semibold">Tiered & Quantity Discounts: </span>Tiered & Quantity Discounts: Reward bulk buyers automatically.</li>
                      <li><span className="font-semibold">Personalized Pricing Rules:</span> Target offers by customer, region, or tags.</li>
                      <li><span className="font-semibold">Bundle Pricing: </span>Combine products for progressive savings.</li>
                      <li><span className="font-semibold">Scheduled Campaigns: </span>Launch and manage promotions in advance.</li>
                    </ul>
                  </div>

                  <a href={"https://apps.shopify.com/discountray/"} target="_blank" rel="noopener noreferrer" >
                    <Button
                      text1="👉 Get the Offer"
                      text2="👉 Get the Offer"
                      pClass="bg-[#0D99FF] py-3.5 px-6 text-[#fff] rounded-lg block shadow-md"
                    />
                  </a>
                </div>

                <div className="max-w-[600px]">
                  <Image className="object-cover w-full h-auto" src={dr_demo} alt="Multivariants" sizes="(max-width: 768px) 100vw, 600px" />
                </div>

              </div>

              <div className=" flex gap-4 items-center justify-between shadow-lg p-8 rounded-2xl bg-linear-to-r from-[#fff] to-[#f2fbfa] max-w-full md:max-w-[100%] flex-1
          transition ease-in duration-300 hover:scale-105 hover:cursor-pointer hover-drop-shadow-2xl
          ">
                <div className="max-w-[550px]">
                  <div className="flex items-center gap-2">
                    <Image src={pbIcon} alt="Multivariants" className="md:max-w-[42px] max-w-[35px] h-auto rounded-sm" />
                    <h4 className="md:text-2xl text-xl text-[#13181E] font-bold font-display">Push Bundle ‑ Build a Box</h4>
                  </div>
                  <div className="mt-6 mb-4 text-[#13181E]">
                    <h4 className="text-lg text-[#13181E] font-medium mb-6">Black Friday Offer: <span className="text-xl font-bold">Get 30% Off (Code: BFCM30)</span></h4>
                    <p className="font-semibold">Top Features:</p>
                    <ul className="mt-2 pl-5 space-y-2 list-disc">
                      <li><span className="font-semibold"> Mix & Match Bundles: </span>Combine products or variants into one box.</li>
                      <li><span className="font-semibold">Volume Discounts:</span> Encourage higher purchases with automatic savings.</li>
                      <li><span className="font-semibold"> Cross-Sell Offers: </span>Suggest related items directly in bundles.</li>
                      <li><span className="font-semibold">Custom Layouts: </span>Choose from grid, list, or box views to match your theme.</li>
                    </ul>
                  </div>

                  <a href={"https://apps.shopify.com/push-bundle/"} target="_blank" rel="noopener noreferrer" >
                    <Button
                      text1="👉 Get the Offer"
                      text2="👉 Get the Offer"
                      pClass="bg-[#0D99FF] py-3.5 px-6 text-[#fff] rounded-lg block shadow-md"
                    />
                  </a>
                </div>

                <div className="max-w-[550px]">
                  <Image className="object-cover w-full h-auto" src={pb_demo} alt="Multivariants" sizes="(max-width: 768px) 100vw, 600px" />
                </div>

              </div>



            </div>

            <div className="mt-7 flex flex-row-reverse items-center justify-between shadow-2xl p-8 rounded-2xl bg-linear-to-r from-[#fff] to-[#f2fbfa]
        transition ease-in duration-300 hover:scale-105 hover:cursor-pointer hover-drop-shadow-2xl
        ">
              <div className="max-w-[550px]">
                <div className="flex items-center gap-2">
                  <Image src={emIcon} alt="EmbedUp" className="md:max-w-[42px] max-w-[35px] h-auto" />
                  <h4 className="md:text-2xl text-xl text-[#13181E] font-bold font-display">Embedup - sell anywherer</h4>
                </div>
                <div className="mt-6 mb-4 text-[#13181E]">
                  <h4 className="text-lg text-[#13181E] font-medium mb-6">Black Friday Offer: <span className="text-xl font-bold">Get 30% Off (Code: BFCM30)</span></h4>
                  <p className="font-semibold">Top Features:</p>
                  <ul className="mt-2 pl-5 space-y-2 list-disc">
                    <li><span className="font-semibold">Embed Products or Collections: </span> Add shoppable sections to any webpage.</li>
                    <li><span className="font-semibold">Customizable Design:</span> Match your site’s style with flexible layouts and CTAs.</li>
                    <li><span className="font-semibold">Real-Time Sync: </span>Keep pricing, stock, and product data always updated.</li>
                    <li><span className="font-semibold">Multi-Store Checkout:</span> Let shoppers buy single or multiple items instantly.</li>
                  </ul>
                </div>

                <a href={"https://apps.shopify.com/embedup/"} target="_blank" rel="noopener noreferrer" >
                  <Button
                    text1="👉 Get the Offer"
                    text2="👉 Get the Offer"
                    pClass="bg-[#0D99FF] py-3.5 px-6 text-[#fff] rounded-lg block shadow-md"
                  />
                </a>
              </div>

              <div className="max-w-[600px]">
                <Image className="object-cover w-full h-auto" src={em_demo} alt="EmbedUp" sizes="(max-width: 768px) 100vw, 600px" />
              </div>

            </div>

          </div>
        </AnimatedSection>
      </section>

      <section className="bg-[#15112E] py-30 z-20 relative">
        <div className="max-w-7xl mx-auto">
          <div className="flex justify-between">
            <div className="md:max-w-[45%] w-full">
              <h5 className="text-lg text-[#0D99FF] mb-2.5 font-semibold">GET IN TOUCH</h5>
              <h2 className="text-3xl md:text-5xl/[1.25] font-bold font-display tracking-[-1.44px] max-w-[660px] text-white">Contact Our Support Team To Grow Your Business</h2>
              <p className="text-base md:text-xl/[1.6] mt-6 text-white">We&apos;ll schedule a call to discuss your idea. After discovery sessions, we&apos;ll send a proposal, and upon approval, we&apos;ll get started.</p>
            </div>

            <div className="w-full md:w-1/2">
              <Form
                fClass="w-full bg-white p-8 rounded-sm"
                btnClass="bg-[#0D99FF] text-white px-6 py-3.5 font-medium"
                btnTxt='Submit Message'
                hideService={true}
              />
            </div>

          </div>
        </div>
      </section>

      <section className="bg-[#0D0827] py-30">
        <div className="max-w-7xl mx-auto">
          <p className="text-lg text-[#0D99FF] mb-2.5 font-semibold text-center">Faq</p>
          <h2 className="font-display md:text-5xl text-3xl text-[#fff] font-bold text-center pt-2 md:mb-20 mb-6">Frequently Asked Questions</h2>
          <div className={`flex flex-col gap-6 w-full text-white max-w-[965px] mx-auto`}>
            {faqsArr?.length > 0 &&
              faqsArr.map((faq, index) => {
                const open = showFaq === index;
                return (
                  <div
                    key={index}
                    className={`md:py-6 py-8 flex flex-col justify-start items-start  bg-[#15112E] border border-[#221D39] px-4 rounded-2xl`}
                  >
                    <div
                      onClick={() => handleShowFaq(index)}
                      className="flex flex-row-reverse items-center cursor-pointer pb-0 gap-5"
                    >
                      <h4 className="text-[22px] font-semibold tracking-[-0.44px] font-display">{faq?.question}</h4>

                      {open ? (
                        <Image src={minusImg} alt="minus" className="w-10 h-10" />
                      ) : (
                        <Image src={plusImg} alt="plus" className="w-10 h-10" />
                      )
                      }

                    </div>

                    <AnimatePresence initial={false}>
                      {open && (
                        <motion.div
                          key="content"
                          initial={{ height: 0, opacity: 0, y: -4 }}
                          animate={{ height: "auto", opacity: 1, y: 0 }}
                          exit={{ height: 0, opacity: 0, y: -4 }}
                          transition={{ duration: 0.25, ease: "easeOut" }}
                          className="overflow-hidden"
                        >
                          <p className="text-base pt-3 md:text-lg pl-16 max-w-11/12">
                            {faq?.answer}
                          </p>
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </div>
                );
              })}
          </div>

        </div>
      </section>

      <section>
        <SliderMarque
          images={images}
          slotWidth={350}   // px width of each slide "lane"
          slotGap={10}      // px horizontal gap between slides
          itemHeight={'auto'}
          speedPx={30}
          containerCls="bg-[#09D6F6] py-5"
          bg="#fff"
          edgeFade
        />
      </section>

      <section className="py-30 bg-[#010A1E] text-white">
        <div className="max-w-7xl mx-auto text-center">
          <h2 className="font-display md:text-5xl/[1.25] text-3xl font-bold text-center pt-2 mb-0">Grab The Best Deal And Crush <br /> Your Sales In 2025</h2>
          <div className="pt-8 object-cover" style={{ backgroundImage: `url(${shape})` }}>
            <p className="text-lg/[1.66] max-w-[831px] mx-auto mb-10">No advanced setup is needed. All eFoli apps are plug-and-play and optimized for Shopify 2.0, so you can launch your Black Friday campaigns quickly and focus on sales.</p>
            <Link href={"/offer/#efProducts"} >
              <Button
                text1="Explore Our Products"
                text2="Explore Our Products"
                pClass="bg-[#0D99FF] py-4.5 px-7 text-[#fff] rounded-lg shadow-md text-xl mx-auto"
              />
            </Link>
            <p className="text-sm mt-5">Terms and conditions apply. Offer valid for annual plans only.</p>
          </div>
        </div>
      </section>

      <FormsubmitSuccessModal
        isModalOpen={copyCodeSuccess}
        setIsModalOpen={setCopyCodeSuccess}
        text1="Discount Code copied successfully."
        text2=""
      />

    </>
  )
}

export default Offerpage
