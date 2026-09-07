"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "motion/react";

const plusImg = "/img/ui/plus.svg";
const minusImg = "/img/ui/minus.svg";

export interface Faq {
  question: string;
  answer: string;
}

interface GeneralfaqProps {
  faqsArr?: Faq[];
  fClass?: string;
  defaultOpen?: number | null;
  actionBtnType?: "arrow" | "plusminus";
}

export default function Generalfaq({
  faqsArr = [],
  fClass = "",
  defaultOpen = null,
  actionBtnType = "arrow",
}: GeneralfaqProps) {
  const [showFaq, setShowFaq] = useState<number | null>(defaultOpen);
  const handleShowFaq = (index: number) =>
    setShowFaq(showFaq === index ? null : index);

  return (
    <div className={`flex flex-col gap-0 w-full ${fClass}`}>
      {faqsArr?.length > 0 &&
        faqsArr.map((faq, index) => {
          const open = showFaq === index;
          return (
            <div
              key={index}
              className={`md:py-6 py-3 border-b ${index === 0 ? "border-t" : ""} border-[#e5e5e5]`}
            >
              <div
                onClick={() => handleShowFaq(index)}
                className="flex justify-between items-center cursor-pointer pb-0 gap-5"
              >
                <h4 className="text-xl font-bold font-display">{faq?.question}</h4>
                {actionBtnType === "arrow" ? (
                  <svg
                    className={`${open ? "rotate-180" : ""} transition-transform duration-200`}
                    width="28"
                    height="28"
                    viewBox="0 0 28 28"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path
                      d="M14.0007 15.3667L19.7755 9.59204L21.4254 11.242L14.0007 18.6666L6.57617 11.242L8.22608 9.59204L14.0007 15.3667Z"
                      fill="#13181E"
                    />
                  </svg>
                ) : open ? (
                  <img src={minusImg} alt="minus" className="w-10 h-10" />
                ) : (
                  <img src={plusImg} alt="plus" className="w-10 h-10" />
                )}
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
                    <p className="text-base pb-0 pt-3 text-[#4B5154] max-w-11/12">
                      {faq?.answer}
                    </p>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          );
        })}
    </div>
  );
}
