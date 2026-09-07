"use client";

import { motion } from "motion/react";
import Image from "next/image";
import circleImg from "@/public/img/about/circle.png";
import circleImg2 from "@/public/img/about/circle2.png";

const Hero = () => {
  return (
    <section className="bg-[#0A0C00] text-white relative overflow-hidden  pt-35 md:pt-40 -top-25">
      <div className="max-w-7xl mx-auto relative">
        <div className="max-w-max mx-auto flex flex-col gap-0 md:pb-60 pb-10 md:pt-15 pt-10">
          <h3 className="text-center text-[18px] text-[#0D99FF]">About Us</h3>
          <motion.h1
            className="text-center font-bold text-3xl md:text-7xl font-display mb-5 leading-tight"
            initial={{ opacity: 0, y: 14, filter: "blur(6px)" }}
            animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
            transition={{ duration: 0.9, ease: "easeOut" }}
          >
            Your Complete B2B Solution<br />For Sustainable Business Growth
          </motion.h1>

          <p className="text-center text-xl/[1.9] max-w-[700px] mx-auto">Collaborative, reliable, and dedicated. We help you elevate your business through innovation and partnership.</p>
        </div>

        

      </div>

      <div className='absolute right-[-3%] top-[-5%] md:top-[-0%] rotateCircleAbout'>
        <Image className='object-contain md:max-w-[200px] max-w-[100px] h-auto' src={circleImg2} alt="About Us" />
      </div>

      <div className='hidden md:block absolute left-[-3%] bottom-[-12%] rotateCircleAbout'>
        <Image className='object-contain max-w-[230px] h-auto' src={circleImg} alt="About Us" />
      </div>
      {/* <div className='max-w-7xl mx-auto absolute bottom-[-75%] left-0 right-0'>
        <img className='object-contain' src={aboutHero} alt="About Us" />
      </div> */}

    </section>
  )
}

export default Hero