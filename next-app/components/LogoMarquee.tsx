"use client";

import React, { useEffect, useRef, useState, type CSSProperties } from "react";

interface LogoMarqueeProps {
  images?: string[];
  slotWidth?: number;
  slotPad?: number;
  logoHeight?: number;
  speedPx?: number;
  bg?: string;
}

export default function LogoMarquee({
  images = [],
  slotWidth = 180,
  slotPad = 16,
  logoHeight = 48,
  speedPx = 80,
  bg = "#fff",
}: LogoMarqueeProps) {
  const contentRef = useRef<HTMLDivElement>(null);
  const [distance, setDistance] = useState(0); // how far to translate for a perfect loop

  useEffect(() => {
    if (!contentRef.current) return;
    // Measure the width of ONE track (natural width)
    setDistance(contentRef.current.scrollWidth);
  }, [images, slotWidth, slotPad]);

  if (!images.length) return null;

  // Convert px/sec to seconds for one full cycle over `distance`
  const durationSec = distance > 0 ? distance / speedPx : 0;

  return (
    <div className="mx-auto max-w-7xl px-4 sm:px-6 pb-14 sm:pb-20 lg:pb-24">
      <style>{`
        @keyframes marqueeX {
          from { transform: translateX(0); }
          to   { transform: translateX(calc(-1 * var(--marquee-distance, 0px))); }
        }
        @media (prefers-reduced-motion: reduce) {
          .marquee-anim { animation: none !important; transform: none !important; }
        }
      `}</style>

      <h2 className="font-display text-lg text-center">
        Trusted by thousands of companies around the world
      </h2>

      <div className="group relative mt-6 overflow-hidden">
        {/* edge fades */}
        <div
          className="pointer-events-none absolute inset-y-0 left-0 w-16"
          style={{ background: `linear-gradient(to right, ${bg}, ${bg}00)` }}
        />
        <div
          className="pointer-events-none absolute inset-y-0 right-0 w-16"
          style={{ background: `linear-gradient(to left, ${bg}, ${bg}00)` }}
        />

        <div
          className="marquee-anim flex items-center group-hover:[animation-play-state:paused]"
          style={
            {
              willChange: "transform",
              // distance is width of ONE track; we render 2 tracks back-to-back
              "--marquee-distance": `${distance}px`,
              animation: distance
                ? `marqueeX ${durationSec}s linear infinite`
                : "none",
            } as CSSProperties
          }
        >
          {/* Track A (measured) */}
          <Track
            ref={contentRef}
            images={images}
            slotWidth={slotWidth}
            slotPad={slotPad}
            logoHeight={logoHeight}
          />
          {/* Track B (duplicate) */}
          <Track
            images={images}
            slotWidth={slotWidth}
            slotPad={slotPad}
            logoHeight={logoHeight}
            ariaHidden
          />
        </div>
      </div>
    </div>
  );
}

interface TrackProps {
  images: string[];
  slotWidth: number;
  slotPad: number;
  logoHeight: number;
  ariaHidden?: boolean;
}

const Track = React.forwardRef<HTMLDivElement, TrackProps>(function Track(
  { images, ariaHidden = false, slotWidth, slotPad, logoHeight },
  ref
) {
  return (
    <div ref={ref} className="flex shrink-0 items-center">
      {images.map((src, i) => (
        <div
          key={(ariaHidden ? "dup-" : "") + i}
          className="flex-none"
          style={{
            width: slotWidth,
            paddingLeft: slotPad / 2,
            paddingRight: slotPad / 2,
          }}
          aria-hidden={ariaHidden}
        >
          <img
            src={src}
            alt=""
            className="block w-auto object-contain opacity-80 hover:opacity-100 transition-opacity"
            style={{ height: logoHeight }}
            loading="lazy"
            draggable="false"
          />
        </div>
      ))}
    </div>
  );
});
