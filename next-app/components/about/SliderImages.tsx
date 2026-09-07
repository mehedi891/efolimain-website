"use client";

import { useMemo, useRef } from "react";
import { motion, useAnimationFrame, useMotionValue, useReducedMotion } from "motion/react";

const img1 = "/img/about/ja.webp";
const img2 = "/img/about/eva.webp";
const img3 = "/img/about/syn.webp";
const img4 = "/img/about/tabassum.webp";
const img5 = "/img/about/rabby.webp";
const img6 = "/img/about/wakhil.webp";
const img7 = "/img/about/anika.webp";
const img8 = "/img/about/tanzom.webp";
const img9 = "/img/about/mehedi.webp";
const img10 = "/img/about/sayed.webp";
const img11 = "/img/about/iftekhar.webp";
const img12 = "/img/about/sumon.webp";
const img13 = "/img/about/hemel.webp";
const img14 = "/img/about/touhid.webp";


export default function SliderImages() {
  const images = useMemo(() => [img1, img2, img3, img4, img5, img6, img7, img8, img9, img10, img11, img12, img13, img14], []);
  return (
    <section className="bg-[#0A0C00] text-white md:py-30 py-15">
      <div className="max-w-full mx-auto">
        <h2 className="md:text-5xl/[1.25] text-3xl font-bold font-display text-center pb-20">
           A Culture Built on Creativity,<br /> Collaboration and Growth
        </h2>
        <div className="">
          <FMMarquee
            images={images}
            slotWidth={500}   // px width of each slide "lane"
            slotGap={-90}      // px horizontal gap between slides
            itemHeight={400}  // px image height (keeps aspect with object-contain)
            speedPx={60}     // pixels per second
            bg="#fff"      // for edge fade (optional)
            edgeFade
          />
        </div>
      </div>
    </section>
  );
}

interface MarqueeProps {
  images: string[];
  slotWidth?: number;
  slotGap?: number;
  itemHeight?: number;
  speedPx?: number;
  edgeFade?: boolean;
  bg?: string;
}

function FMMarquee({
  images,
  slotWidth = 300,
  slotGap = 12,
  itemHeight = 220,
  speedPx = 5000,
  edgeFade = false,
  bg = "#fff",
}: MarqueeProps) {
  const reduce = useReducedMotion();
  const x = useMotionValue(0);
  const current = useRef(0);

  const trackDistance = images.length * (slotWidth + slotGap);

  useAnimationFrame((t, delta) => {
    if (reduce) return;
    // delta in ms; convert to seconds
    const dx = (speedPx * delta) / 1000;
    current.current -= dx;
    if (current.current <= -trackDistance) current.current += trackDistance;
    x.set(current.current);
  });

  return (
    <div className="relative overflow-hidden">
      {edgeFade && (
        <>
          <div
            className="pointer-events-none absolute inset-y-0 left-0 w-16"
            style={{ background: `linear-gradient(to right, ${bg}, ${bg}00)` }}
          />
          <div
            className="pointer-events-none absolute inset-y-0 right-0 w-16"
            style={{ background: `linear-gradient(to left, ${bg}, ${bg}00)` }}
          />
        </>
      )}

      {/* Two identical tracks back-to-back; x animates continuously */}
      <motion.div className="flex items-center" style={{ x, willChange: "transform" }}>
        <Track images={images} slotWidth={slotWidth} slotGap={slotGap} itemHeight={itemHeight} />
        <Track images={images} slotWidth={slotWidth} slotGap={slotGap} itemHeight={itemHeight} ariaHidden />
      </motion.div>
    </div>
  );
}

function Track({
  images,
  slotWidth,
  slotGap,
  itemHeight,
  ariaHidden = false,
}: {
  images: string[];
  slotWidth: number;
  slotGap: number;
  itemHeight: number;
  ariaHidden?: boolean;
}) {
  return (
    <div className="flex shrink-0 items-center">
      {images.map((src, i) => (
        <div
          key={(ariaHidden ? "dup-" : "") + i}
          className="flex-none"
          style={{ width: slotWidth, marginRight: slotGap }}
          aria-hidden={ariaHidden}
        >
          <img
            src={src}
            alt=""
            className="block w-full h-auto object-contain rounded-xl"
            style={{ height: itemHeight }}
            loading="lazy"
            draggable="false"
          />
        </div>
      ))}
    </div>
  );
}
