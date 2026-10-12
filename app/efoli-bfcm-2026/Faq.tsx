"use client";

import { useState } from "react";
import s from "./bfcm.module.css";

/** Accordion — the first answer starts open, matching the design. */
export default function Faq({ items }: { items: { q: string; a: string }[] }) {
  const [open, setOpen] = useState<Set<number>>(() => new Set([0]));

  function toggle(i: number) {
    setOpen((prev) => {
      const next = new Set(prev);
      if (next.has(i)) next.delete(i);
      else next.add(i);
      return next;
    });
  }

  return (
    <>
      {items.map((item, i) => {
        const isOpen = open.has(i);
        return (
          <div key={item.q} className={s.faqItem} data-open={isOpen}>
            <button
              type="button"
              className={s.faqQ}
              aria-expanded={isOpen}
              aria-controls={`faq-a-${i}`}
              onClick={() => toggle(i)}
            >
              {item.q}
              <i aria-hidden="true">+</i>
            </button>
            <p className={s.faqA} id={`faq-a-${i}`} hidden={!isOpen}>
              {item.a}
            </p>
          </div>
        );
      })}
    </>
  );
}
