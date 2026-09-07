"use client";

import Link from "next/link";
import Image from "next/image";
import heroImg1 from "@/public/img/home/heroImg1.webp";
import heroImg2 from "@/public/img/home/heroImg2.webp";
import heroImg3 from "@/public/img/home/heroImg3.webp";
import heroImg4 from "@/public/img/home/heroImg4.webp";
import mobHero from "@/public/img/home/mobHero.webp";

const t1 = "/img/home/c1.webp";
const t2 = "/img/home/c2.webp";
const t3 = "/img/home/c3.webp";
const t4 = "/img/home/c4.webp";
const t5 = "/img/home/c5.webp";
const t6 = "/img/home/c6.webp";
const t7 = "/img/home/c7.webp";
const t8 = "/img/home/c8.webp";

import { motion } from "motion/react";
import CounterText from "@/components/CounterText";
import LogoMarquee from "@/components/LogoMarquee";
import Button from "@/components/Button";


export default function Hero() {
  return (
    <section className="relative">
      {/* Top copy */}

      <div className="mx-auto max-w-7xl px-4 sm:px-6 pt-12 sm:pt-16 lg:pt-20 text-center">
        {/* Badge */}
        <div className="inline-flex items-center gap-2 rounded-full border border-[#F59E0B] bg-[linear-gradient(180deg,#FFF_0%,#FFFBEB_100%)] px-4 py-1.5 text-sm font-medium text-[#D97706] shadow-sm">
          <span aria-hidden>
            <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 18 18" fill="none">
              <g clipPath="url(#clip0_2298_2896)">
                <path d="M14.6259 10.125C14.6273 10.3543 14.5576 10.5785 14.4264 10.7666C14.2952 10.9547 14.109 11.0976 13.8932 11.1755L10.2616 12.5114L8.92567 16.1402C8.84656 16.3552 8.70342 16.5406 8.51558 16.6717C8.32774 16.8027 8.10422 16.8729 7.8752 16.8729C7.64618 16.8729 7.42267 16.8027 7.23482 16.6717C7.04698 16.5406 6.90385 16.3552 6.82473 16.1402L5.48528 12.5156L1.85575 11.1797C1.64082 11.1006 1.45534 10.9574 1.32432 10.7696C1.1933 10.5818 1.12305 10.3582 1.12305 10.1292C1.12305 9.9002 1.1933 9.67668 1.32432 9.48884C1.45534 9.301 1.64082 9.15786 1.85575 9.07875L5.48739 7.74281L6.82333 4.11398C6.90244 3.89906 7.04557 3.71357 7.23342 3.58255C7.42126 3.45153 7.64477 3.38128 7.8738 3.38128C8.10282 3.38128 8.32633 3.45153 8.51417 3.58255C8.70202 3.71357 8.84515 3.89906 8.92426 4.11398L10.2602 7.74563L13.889 9.08156C14.1044 9.15836 14.2908 9.29982 14.4227 9.4866C14.5546 9.67338 14.6256 9.89634 14.6259 10.125ZM10.6884 3.375H11.8134V4.5C11.8134 4.64918 11.8727 4.79226 11.9782 4.89775C12.0836 5.00324 12.2267 5.0625 12.3759 5.0625C12.5251 5.0625 12.6682 5.00324 12.7737 4.89775C12.8791 4.79226 12.9384 4.64918 12.9384 4.5V3.375H14.0634C14.2126 3.375 14.3557 3.31574 14.4612 3.21025C14.5666 3.10476 14.6259 2.96168 14.6259 2.8125C14.6259 2.66332 14.5666 2.52024 14.4612 2.41475C14.3557 2.30926 14.2126 2.25 14.0634 2.25H12.9384V1.125C12.9384 0.975816 12.8791 0.832742 12.7737 0.727252C12.6682 0.621763 12.5251 0.5625 12.3759 0.5625C12.2267 0.5625 12.0836 0.621763 11.9782 0.727252C11.8727 0.832742 11.8134 0.975816 11.8134 1.125V2.25H10.6884C10.5392 2.25 10.3961 2.30926 10.2907 2.41475C10.1852 2.52024 10.1259 2.66332 10.1259 2.8125C10.1259 2.96168 10.1852 3.10476 10.2907 3.21025C10.3961 3.31574 10.5392 3.375 10.6884 3.375ZM16.8759 5.625H16.3134V5.0625C16.3134 4.91332 16.2541 4.77024 16.1487 4.66475C16.0432 4.55926 15.9001 4.5 15.7509 4.5C15.6017 4.5 15.4586 4.55926 15.3532 4.66475C15.2477 4.77024 15.1884 4.91332 15.1884 5.0625V5.625H14.6259C14.4767 5.625 14.3336 5.68426 14.2282 5.78975C14.1227 5.89524 14.0634 6.03832 14.0634 6.1875C14.0634 6.33668 14.1227 6.47976 14.2282 6.58525C14.3336 6.69074 14.4767 6.75 14.6259 6.75H15.1884V7.3125C15.1884 7.46168 15.2477 7.60476 15.3532 7.71025C15.4586 7.81574 15.6017 7.875 15.7509 7.875C15.9001 7.875 16.0432 7.81574 16.1487 7.71025C16.2541 7.60476 16.3134 7.46168 16.3134 7.3125V6.75H16.8759C17.0251 6.75 17.1682 6.69074 17.2737 6.58525C17.3791 6.47976 17.4384 6.33668 17.4384 6.1875C17.4384 6.03832 17.3791 5.89524 17.2737 5.78975C17.1682 5.68426 17.0251 5.625 16.8759 5.625Z" fill="#D97706" />
              </g>
              <defs>
                <clipPath id="clip0_2298_2896">
                  <rect width="18" height="18" fill="white" />
                </clipPath>
              </defs>
            </svg>
          </span>
          <span>Award winning shopify partner</span>
        </div>

        {/* Heading */}
        <h1 className="font-display mt-4 text-4xl sm:text-5xl lg:text-6xl xl:text-7xl font-bold  leading-[1.1] text-gray-900 tracking-[-2.3px]">
          <motion.span
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.9 }}
            className="block">B2B eCommerce Solutions</motion.span>
          <motion.span
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1, delay: 0.25 }}
            className="block">To Empower Growth.</motion.span>
        </h1>

        {/* Subcopy */}
        <p className="mx-auto mt-5 max-w-4xl text-xl/[1.9] text-[#4B5154]">
          EFOLI is a globally trusted software company with over<span className="font-semibold"> 15+ years </span> of experience in building
          <br className="hidden sm:block" />{" "}scalable, high-impact B2B eCommerce solutions for merchants worldwide.
        </p>

        {/* CTAs */}
        <div className="mt-7 flex flex-wrap items-center justify-center gap-4">
          <Link
            href="/#efProducts"
          >
            <Button
              pClass="rounded-lg px-6 py-3.5 font-medium text-white shadow-sm bg-[#0D99FF]"
              text1="Explore Our Products"
              text2="Explore Our Products"
            />
          </Link>



          <Link
            href="/contact-us"
          >
            <Button
              pClass="rounded-lg px-6 py-3.5 font-medium text-[#0D99FF] border border-[#0D99FF]"
              text1="Book a Discovery Call"
              text2="Book a Discovery Call"
            />
          </Link>
        </div>
      </div>

      {/* Image/Stats Mosaic */}
      <div className="max-w-1/1 mx-auto py-10 md:py-20">
        <div
          className="
      md:grid gap-6
      md:grid-cols-4
      grid-cols-1
       md:[grid-template-areas:'A_B_C_D''A_E_C_F']
       [grid-template-areas:'A']
       place-center
        hidden
        "
        >

          <div className="[grid-area:A]">
            <div className="w-full h-full pl-5">
              <Image src={heroImg1} alt="Team" priority sizes="(max-width: 768px) 100vw, 25vw" className="object-cover w-auto h-full  md:rounded-tr-[100px] rounded-xs" />
            </div>
          </div>
          <div className="[grid-area:B]">
            <div className="bg-[#FFD4EE] w-full h-full rounded-tl-[100px] gap-3 flex flex-col items-center justify-center">
              <CounterText
                className="text-[80px]/[0.8] text-[#6F3055] tracking-[-2.4px] font-semibold font-display"
                duration={1500}
                start={0}
                end={15}
                once={true}
              />
              <p className="text-[22px] text-[#6F3055] font-semibold font-display">Years Of Solid Experience.</p>
            </div>
          </div>
          <div className="[grid-area:C]">
            <Image src={heroImg3} alt="Team" sizes="(max-width: 768px) 100vw, 25vw" className="object-cover h-full rounded-xs lg:rounded-tr-[100px]" />
          </div>
          <div className="[grid-area:D]">
            <div className="w-full h-full pr-5">
              <Image src={heroImg4} alt="Team" sizes="(max-width: 768px) 100vw, 25vw" className="object-cover h-full rounded-xs lg:rounded-tl-[100px]" />
            </div>
          </div>
          <div className="[grid-area:E]">
            <Image src={heroImg2} alt="Team" sizes="(max-width: 768px) 100vw, 25vw" className="object-cover h-full rounded-xs lg:rounded-tr-[100px]" />
          </div>
          <div className="[grid-area:F]">
            <div className="w-full h-full pr-5">
              <div className="bg-[#D3FEE8] w-full h-full rounded-tr-[100px] gap-3 flex flex-col items-center justify-center">
                <CounterText
                  className="text-[80px]/[0.8] text-[#235D3A] tracking-[-2.4px] font-semibold font-display"
                  duration={1500}
                  start={50}
                  end={180}
                  once={true}
                />
                <p className="text-[22px] text-[#235D3A] font-semibold font-display">Countries Reached</p>
              </div>

            </div>
          </div>
        </div>

        <div className="md:hidden flex flex-col gap-6 px-4">
          <Image src={mobHero} alt="Team" sizes="100vw" className="object-inherit w-full h-auto rounded-xs" />
          <div className="flex gap-6">
            <div className="bg-[#FFD4EE] w-full h-full gap-3 flex flex-col items-center justify-center rounded-xl px-2 py-4">
              <CounterText
                className="text-2xl text-[#6F3055] font-bold font-display"
                duration={1500}
                start={0}
                end={15}
                once={true}
              />
              <p className="text-base text-[#6F3055] font-semibold font-display">Years Of Experience.</p>
            </div>

            <div className="bg-[#D3FEE8] w-full h-full gap-3 flex flex-col items-center justify-center rounded-xl px-2 py-4">
              <CounterText
                className="text-2xl text-[#235D3A] font-bold font-display"
                duration={1500}
                start={50}
                end={180}
                once={true}
              />
              <p className="text-base text-[#235D3A] font-semibold font-display">Countries Reached</p>
            </div>

          </div>
        </div>
      </div>

      {/* trusted customer */}

      {/* <div className="mx-auto max-w-7xl px-4 sm:px-6 pb-14 sm:pb-20 lg:pb-24">
        <div>
            <h2 className="font-display text-lg text-center">Trusted by thousands of companies around the world</h2>
            <div className="flex flex-wrap py-6 gap-1 justify-center items-center">
                {[t1,t2,t3,t4,t1,t2,t3,t4,t1,t2,t3,t4].map((t,i)=> <img
                key={i}
                src={t}
                className="object-cover h-auto max-w-[180px]"
                />)

                }
            </div>
        </div>
      </div> */}

      <LogoMarquee
        images={[t1, t2, t3, t4, t5, t6, t7, t8]}
        slotWidth={180}
        slotPad={60}
        logoHeight={48}
        speedPx={30}
        bg="#ffffff"
      />


    </section>
  );

}
