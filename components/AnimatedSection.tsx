"use client";

import { motion, useAnimation, useInView } from "motion/react";
import { useEffect, useRef, type ReactNode } from "react";

export default function AnimatedSection({ children }: { children: ReactNode }) {
  const ref = useRef(null);
  const isInView = useInView(ref, { amount: 0.02, once: false });
  const controls = useAnimation();

  useEffect(() => {
    if (isInView) controls.start("visible");
  }, [isInView, controls]);

  return (
    <motion.div
      ref={ref}
      variants={{
        hidden: {
          opacity: 0,
          y: 100,
          scale: 0.95,
          rotateX: 10,
        },
        visible: {
          opacity: 1,
          y: 0,
          scale: 1,
          rotateX: 0,
          transition: {
            type: "spring",
            stiffness: 70,
            damping: 12,
            mass: 0.8,
          },
        },
      }}
      initial="hidden"
      animate={controls}
      style={{ transformOrigin: "center bottom" }}
    >
      {children}
    </motion.div>
  );
}
