"use client";

import { motion, useAnimationFrame, useMotionValue, useReducedMotion } from "motion/react";
import { useMemo, useRef } from "react";

const img1 = "/img/career/img1.webp";
const img2 = "/img/career/img2.webp";
const img3 = "/img/career/img3.webp";
const img4 = "/img/career/img4.webp";

const ShowOffImg = () => {
  const images = useMemo(() => [img1, img2, img3, img4, img2, img4], []);
  return (
    <section>
      <div className="mx-auto max-w-full px-4 sm:px-6 pb-10 md:pb-8 pt-1">
          <div>

            <div className="pb-20">
              <FMMarquee
                images={images}
                slotWidth={370}
                slotGap={35}
                itemHeight={550}
                speedPx={30}
                bg="#fff"
                edgeFade
              />
            </div>
          </div>
      </div>
    </section>
  );
};

export default ShowOffImg;

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
    <div className="relative overflow-x-hidden h-[640px]">
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
            className={`block w-full h-auto object-contain rounded-xl ${i%2 === 0 ? 'translate-y-[14%]' : ''}`}
            style={{ height: itemHeight }}
            loading="lazy"
            draggable="false"
          />
        </div>
      ))}
    </div>
  );
}
