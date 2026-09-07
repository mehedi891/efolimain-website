"use client";

import { useAnimationFrame, useMotionValue, useReducedMotion, motion } from "motion/react";
import { useRef } from "react";

interface SliderMarqueProps {
  images: string[];
  slotWidth?: number;
  slotGap?: number;
  itemHeight?: number;
  speedPx?: number;
  edgeFade?: boolean;
  bg?: string;
  containerCls?: string;
}

function SliderMarque({
  images,
  slotWidth = 300,
  slotGap = 12,
  itemHeight = 220,
  speedPx = 5000,
  edgeFade = false,
  bg = "#0D99FF",
  containerCls = "",
}: SliderMarqueProps) {
  const reduce = useReducedMotion();
  const x = useMotionValue(0);
  const current = useRef(0);

  const trackDistance = images.length * (slotWidth + slotGap);

  useAnimationFrame((t, delta) => {
    if (reduce) return;
    const dx = (speedPx * delta) / 1000;
    current.current -= dx;
    if (current.current <= -trackDistance) current.current += trackDistance;
    x.set(current.current);
  });

  return (
    <div className={`relative overflow-hidden ${containerCls}`}>
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

export default SliderMarque;
