"use client";

import { motion, type Variants } from "motion/react";
import Button from "@/components/Button";
import Generalfaq from "@/components/Generalfaq";
import {
  apps,
  commission,
  config,
  faqs,
  gettingPaid,
  hero,
  links,
  steps,
  terms,
  tiers,
  tracking,
} from "@/data/affiliateContent";

/* ── shared animation ─────────────────────────────────────────────────────── */
const fadeUp: Variants = {
  hidden: { opacity: 0, y: 30 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { type: "spring", stiffness: 70, damping: 16 },
  },
};
const stagger: Variants = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.1 } },
};
const viewport = { once: true, amount: 0.2 };

/* Section heading (eyebrow + title + optional lead), reused across sections. */
interface SectionHeadProps {
  eyebrow?: string;
  title: string;
  lead?: string;
  center?: boolean;
  className?: string;
}
const SectionHead = ({ eyebrow, title, lead, center = true, className = "" }: SectionHeadProps) => (
  <motion.div
    variants={fadeUp}
    initial="hidden"
    whileInView="visible"
    viewport={viewport}
    className={`${center ? "mx-auto max-w-2xl text-center" : "max-w-3xl"} ${className}`}
  >
    {eyebrow && (
      <span className="text-sm font-semibold uppercase tracking-[0.18em] text-[#0D99FF]">
        {eyebrow}
      </span>
    )}
    <h2 className="mt-3 font-display text-3xl font-bold text-[#13181E] md:text-5xl/[1.1]">
      {title}
    </h2>
    {lead && <p className="mt-4 text-base/[1.75] text-[#4B5154] md:text-lg">{lead}</p>}
  </motion.div>
);

const CheckIcon = ({ className = "h-5 w-5" }: { className?: string }) => (
  <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
    <path d="M20 6 9 17l-5-5" />
  </svg>
);

/* ═══════════════════════════════════════════════════════════════════════════
   HERO
   ═══════════════════════════════════════════════════════════════════════════ */
const Hero = () => (
  <section className="relative overflow-hidden bg-gradient-to-b from-[#f2fbfa] via-white to-white">
    {/* animated aurora backdrop */}
    <div aria-hidden="true" className="pointer-events-none absolute inset-0 overflow-hidden">
      <motion.div
        className="absolute -top-32 left-[8%] h-96 w-96 rounded-full bg-[#0D99FF]/15 blur-[120px]"
        animate={{ x: [0, 40, 0], y: [0, 30, 0] }}
        transition={{ duration: 18, repeat: Infinity, ease: "easeInOut" }}
        style={{ willChange: "transform" }}
      />
      <motion.div
        className="absolute -bottom-24 right-[6%] h-96 w-96 rounded-full bg-emerald-400/10 blur-[120px]"
        animate={{ x: [0, -30, 0], y: [0, -25, 0] }}
        transition={{ duration: 22, repeat: Infinity, ease: "easeInOut" }}
        style={{ willChange: "transform" }}
      />
    </div>

    <motion.div
      variants={stagger}
      initial="hidden"
      animate="visible"
      className="relative mx-auto max-w-7xl px-4 pb-16 pt-16 text-center sm:px-6 md:pb-24 md:pt-24"
    >
      <motion.span variants={fadeUp} className="inline-flex items-center gap-2 rounded-full border border-[#0D99FF]/20 bg-white px-4 py-1.5 text-xs font-semibold uppercase tracking-[0.18em] text-[#0D99FF] shadow-sm">
        <span className="h-1.5 w-1.5 animate-pulse rounded-full bg-[#0D99FF]" />
        {hero.badge}
      </motion.span>

      <motion.h1 variants={fadeUp} className="mx-auto mt-6 max-w-4xl font-display text-4xl font-bold text-[#13181E] sm:text-5xl md:text-7xl/[1.05]">
        {hero.headline[0]}{" "}
        <span className="bg-gradient-to-r from-[#0D99FF] to-[#7dd3fc] bg-clip-text text-transparent">
          {hero.headline[1]}
        </span>
      </motion.h1>

      <motion.p variants={fadeUp} className="mx-auto mt-6 max-w-2xl text-base/[1.8] text-[#4B5154] md:text-lg">
        {hero.subhead}
      </motion.p>

      <motion.div variants={fadeUp} className="mt-9 flex flex-wrap items-center justify-center gap-4">
        <a href={links.apply} target="_blank" rel="noopener noreferrer">
          <Button
            pClass="bg-[#0D99FF] rounded-xl px-8 py-3.5 text-white text-base font-bold font-display shadow-lg shadow-[#0D99FF]/25 transition hover:shadow-xl hover:shadow-[#0D99FF]/30"
            text1="Become a partner"
            text2="Become a partner"
          />
        </a>
        <a href="#how-it-works" className="rounded-xl border border-gray-200 bg-white px-8 py-3.5 text-base font-bold font-display text-[#13181E] transition hover:border-[#0D99FF] hover:text-[#0D99FF]">
          How it works ↓
        </a>
      </motion.div>

      {/* trust points */}
      <motion.div variants={stagger} className="mx-auto mt-16 grid max-w-4xl gap-5 sm:grid-cols-3">
        {hero.trustPoints.map((tp) => (
          <motion.div
            key={tp.label}
            variants={fadeUp}
            className="rounded-2xl border border-gray-100 bg-white/70 p-6 text-left shadow-sm backdrop-blur transition hover:-translate-y-1 hover:shadow-lg"
          >
            <p className="font-display text-3xl font-bold text-[#0D99FF]">{tp.value}</p>
            <p className="font-display text-lg font-bold text-[#13181E]">{tp.label}</p>
            <p className="mt-1.5 text-sm/[1.6] text-[#4B5154]">{tp.detail}</p>
          </motion.div>
        ))}
      </motion.div>
    </motion.div>
  </section>
);

/* ═══════════════════════════════════════════════════════════════════════════
   HOW IT WORKS
   ═══════════════════════════════════════════════════════════════════════════ */
const HowItWorks = () => (
  <section id="how-it-works" className="scroll-mt-24 bg-white py-16 md:py-24">
    <div className="mx-auto max-w-7xl px-4 sm:px-6">
      <SectionHead
        eyebrow="How it works"
        title="From referral to recurring revenue"
        lead="Four steps. Approval takes about a day, and there's no cost to join."
      />

      <motion.div
        variants={stagger}
        initial="hidden"
        whileInView="visible"
        viewport={viewport}
        className="relative mt-14 grid gap-6 md:mt-20 md:grid-cols-2 lg:grid-cols-4"
      >
        {steps.map((step, i) => (
          <motion.div key={step.title} variants={fadeUp} className="group relative">
            <div className="h-full rounded-2xl border border-gray-100 bg-gradient-to-b from-white to-[#f2fbfa] p-7 shadow-sm transition duration-300 hover:-translate-y-1.5 hover:shadow-xl">
              <span className="grid h-11 w-11 place-items-center rounded-xl bg-[#0D99FF] font-display text-lg font-bold text-white shadow-md shadow-[#0D99FF]/30">
                {i + 1}
              </span>
              <h3 className="mt-5 font-display text-xl font-bold text-[#13181E]">{step.title}</h3>
              <p className="mt-2.5 text-base/[1.7] text-[#4B5154]">{step.body}</p>
            </div>
          </motion.div>
        ))}
      </motion.div>
    </div>
  </section>
);

/* ═══════════════════════════════════════════════════════════════════════════
   COMMISSION
   ═══════════════════════════════════════════════════════════════════════════ */
const Commission = () => (
  <section className="bg-[#fafcfd] py-16 md:py-24">
    <div className="mx-auto max-w-7xl px-4 sm:px-6">
      <SectionHead eyebrow="Commission" title="How you get paid" lead={commission.intro} />

      <motion.div
        variants={stagger}
        initial="hidden"
        whileInView="visible"
        viewport={viewport}
        className="mt-14 grid gap-6 md:grid-cols-2"
      >
        {commission.points.map((p) => (
          <motion.div key={p.title} variants={fadeUp} className="flex gap-4 rounded-2xl border border-gray-100 bg-white p-7 shadow-sm">
            <span className="mt-0.5 grid h-9 w-9 shrink-0 place-items-center rounded-full bg-[#0D99FF]/10 text-[#0D99FF]">
              <CheckIcon className="h-5 w-5" />
            </span>
            <div>
              <h3 className="font-display text-lg font-bold text-[#13181E]">{p.title}</h3>
              <p className="mt-1.5 text-base/[1.7] text-[#4B5154]">{p.body}</p>
            </div>
          </motion.div>
        ))}
      </motion.div>

      {/* merchant discount callout */}
      <motion.div
        variants={fadeUp}
        initial="hidden"
        whileInView="visible"
        viewport={viewport}
        className="mt-6 flex flex-col items-start gap-4 rounded-2xl bg-gradient-to-r from-[#0D99FF] to-[#7dd3fc] p-7 text-white sm:flex-row sm:items-center md:p-8"
      >
        <span className="grid h-12 w-12 shrink-0 place-items-center rounded-xl bg-white/20">
          <svg className="h-6 w-6" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M9 11H3v10h6M9 11V5a3 3 0 0 1 6 0v6m0 0h6v10h-6m-6 0h6" />
          </svg>
        </span>
        <p className="font-display text-lg font-semibold md:text-xl">{commission.merchantDiscount}</p>
      </motion.div>
    </div>
  </section>
);

/* ═══════════════════════════════════════════════════════════════════════════
   TIERS
   ═══════════════════════════════════════════════════════════════════════════ */
const Tiers = () => (
  <section className="bg-white py-16 md:py-24">
    <div className="mx-auto max-w-7xl px-4 sm:px-6">
      <SectionHead
        eyebrow="Tiers"
        title="Earn more as you grow"
        lead="Your rate increases with your active paying referrals — a store on 5 apps counts as 5."
      />

      <motion.div
        variants={stagger}
        initial="hidden"
        whileInView="visible"
        viewport={viewport}
        className="mt-14 grid gap-6 md:grid-cols-3 md:items-center"
      >
        {tiers.map((tier) => (
          <motion.div
            key={tier.name}
            variants={fadeUp}
            className={`relative overflow-hidden rounded-3xl border p-8 text-center transition duration-300 hover:-translate-y-1.5 ${
              tier.highlight
                ? "border-transparent bg-gradient-to-b from-[#0b1120] to-[#0D2440] text-white shadow-2xl md:scale-105"
                : "border-gray-100 bg-white text-[#13181E] shadow-sm hover:shadow-xl"
            }`}
          >
            {tier.highlight && (
              <>
                <div className="pointer-events-none absolute -top-16 left-1/2 h-40 w-40 -translate-x-1/2 rounded-full bg-[#0D99FF]/40 blur-3xl" />
                <span className="relative inline-block rounded-full bg-[#0D99FF] px-3 py-1 text-xs font-semibold uppercase tracking-wider text-white">
                  Top tier
                </span>
              </>
            )}
            <h3 className={`relative font-display text-xl font-bold ${tier.highlight ? "mt-3 text-white" : "text-[#13181E]"}`}>
              {tier.name}
            </h3>
            <div className="relative mt-4 flex items-end justify-center gap-1">
              <span className={`font-display text-6xl font-bold ${tier.highlight ? "text-white" : "text-[#0D99FF]"}`}>
                {tier.rate}
              </span>
              <span className={`pb-2 font-display text-2xl font-bold ${tier.highlight ? "text-[#7dd3fc]" : "text-[#0D99FF]"}`}>%</span>
            </div>
            <p className={`relative mt-1 text-sm ${tier.highlight ? "text-white/60" : "text-[#4B5154]"}`}>
              of every payment
            </p>
            <p className={`relative mt-5 border-t pt-5 text-base font-medium ${tier.highlight ? "border-white/10 text-white/80" : "border-gray-100 text-[#4B5154]"}`}>
              {tier.threshold}
            </p>
          </motion.div>
        ))}
      </motion.div>

      <p className="mt-6 text-center text-sm text-[#4B5154]">
        These are the standard tiers, shown live in your dashboard. Rates aren't
        fixed — high-volume and select partners can be offered a{" "}
        <span className="font-semibold text-[#13181E]">special custom rate</span>.
        <a href={links.apply} target="_blank" rel="noopener noreferrer" className="ml-1 font-semibold text-[#0D99FF] hover:underline">
          Talk to us →
        </a>
      </p>
    </div>
  </section>
);

/* ═══════════════════════════════════════════════════════════════════════════
   TRACKING
   ═══════════════════════════════════════════════════════════════════════════ */
const Tracking = () => (
  <section className="bg-[#fafcfd] py-16 md:py-24">
    <div className="mx-auto max-w-7xl px-4 sm:px-6">
      <SectionHead
        eyebrow="Attribution"
        title="How referrals are tracked"
        lead="Two ways a merchant gets credited to you — use whichever fits your audience."
      />

      <motion.div
        variants={stagger}
        initial="hidden"
        whileInView="visible"
        viewport={viewport}
        className="mt-14 grid gap-6 md:grid-cols-2"
      >
        {tracking.methods.map((m, i) => (
          <motion.div key={m.title} variants={fadeUp} className="relative overflow-hidden rounded-2xl border border-gray-100 bg-white p-8 shadow-sm">
            <span className="absolute right-6 top-6 rounded-full bg-[#0D99FF]/10 px-3 py-1 text-xs font-semibold text-[#0D99FF]">
              {m.tag}
            </span>
            <span className="grid h-12 w-12 place-items-center rounded-xl bg-[#0D99FF] font-display text-lg font-bold text-white">
              {i + 1}
            </span>
            <h3 className="mt-5 font-display text-xl font-bold text-[#13181E]">{m.title}</h3>
            <p className="mt-2.5 text-base/[1.7] text-[#4B5154]">{m.body}</p>
          </motion.div>
        ))}
      </motion.div>

      {/* attribution rules */}
      <motion.div
        variants={stagger}
        initial="hidden"
        whileInView="visible"
        viewport={viewport}
        className="mt-6 grid gap-x-8 gap-y-5 rounded-2xl border border-gray-100 bg-white p-8 sm:grid-cols-2"
      >
        {tracking.rules.map((rule) => (
          <motion.div key={rule.title} variants={fadeUp} className="flex gap-3">
            <span className="mt-0.5 shrink-0 text-[#0D99FF]"><CheckIcon /></span>
            <div>
              <h4 className="font-display font-bold text-[#13181E]">{rule.title}</h4>
              <p className="mt-1 text-sm/[1.6] text-[#4B5154]">{rule.body}</p>
            </div>
          </motion.div>
        ))}
      </motion.div>
    </div>
  </section>
);

/* ═══════════════════════════════════════════════════════════════════════════
   APPS
   ═══════════════════════════════════════════════════════════════════════════ */
const Apps = () => (
  <section className="bg-white py-16 md:py-24">
    <div className="mx-auto max-w-7xl px-4 sm:px-6">
      <SectionHead
        eyebrow="Apps you can promote"
        title="Five apps. Every subscription earns."
        lead="Promote any of eFoli's Shopify apps — each one a merchant subscribes to earns you commission."
      />

      <motion.div
        variants={stagger}
        initial="hidden"
        whileInView="visible"
        viewport={viewport}
        className="mt-14 grid gap-6 sm:grid-cols-2 lg:grid-cols-3"
      >
        {apps.map((app) => (
          <motion.a
            key={app.name}
            href={app.link}
            target="_blank"
            rel="noreferrer noopener"
            variants={fadeUp}
            className="group flex items-start gap-4 rounded-2xl border border-gray-100 bg-gradient-to-br from-white to-[#f2fbfa] p-6 shadow-sm transition duration-300 hover:-translate-y-1 hover:shadow-xl"
          >
            <span className="grid h-14 w-14 shrink-0 place-items-center rounded-2xl border border-gray-100 bg-white shadow-sm">
              <img src={app.icon} alt={app.name} className="h-9 w-9 object-contain" />
            </span>
            <div>
              <h3 className="font-display text-lg font-bold text-[#13181E] transition group-hover:text-[#0D99FF]">
                {app.name}
              </h3>
              <p className="mt-1 text-sm/[1.6] text-[#4B5154]">{app.tagline}</p>
            </div>
          </motion.a>
        ))}
      </motion.div>
    </div>
  </section>
);

/* ═══════════════════════════════════════════════════════════════════════════
   GETTING PAID
   ═══════════════════════════════════════════════════════════════════════════ */
const GettingPaid = () => (
  <section className="bg-[#fafcfd] py-16 md:py-24">
    <div className="mx-auto max-w-7xl px-4 sm:px-6">
      <SectionHead
        eyebrow="Getting paid"
        title="Clear, fair payouts"
        lead={`Commissions mature over ${config.clawbackDays} days, then clear and become withdrawable.`}
      />

      <motion.div
        variants={stagger}
        initial="hidden"
        whileInView="visible"
        viewport={viewport}
        className="mt-14 grid gap-6 md:grid-cols-2 lg:grid-cols-3"
      >
        {gettingPaid.map((item) => (
          <motion.div key={item.title} variants={fadeUp} className="rounded-2xl border border-gray-100 bg-white p-7 shadow-sm">
            <h3 className="font-display text-lg font-bold text-[#13181E]">{item.title}</h3>
            <p className="mt-2 text-base/[1.7] text-[#4B5154]">{item.body}</p>
          </motion.div>
        ))}
      </motion.div>
    </div>
  </section>
);

/* ═══════════════════════════════════════════════════════════════════════════
   TERMS
   ═══════════════════════════════════════════════════════════════════════════ */
const Terms = () => (
  <section className="bg-white py-16 md:py-24">
    <div className="mx-auto max-w-7xl px-4 sm:px-6">
      <SectionHead eyebrow="Program terms" title="The fine print, in plain English" />

      <motion.div
        variants={stagger}
        initial="hidden"
        whileInView="visible"
        viewport={viewport}
        className="mt-14 grid gap-6 md:grid-cols-2"
      >
        {terms.map((term) => (
          <motion.div key={term.title} variants={fadeUp} className="rounded-2xl border border-gray-100 bg-[#fafcfd] p-7">
            <h3 className="font-display text-lg font-bold text-[#13181E]">{term.title}</h3>
            <p className="mt-2 text-base/[1.7] text-[#4B5154]">{term.body}</p>
          </motion.div>
        ))}
      </motion.div>

      {links.terms && (
        <p className="mt-8 text-center text-base text-[#4B5154]">
          Full terms:{" "}
          <a href={links.terms} target="_blank" rel="noopener noreferrer" className="font-semibold text-[#0D99FF] hover:underline">
            Partner Program Terms →
          </a>
        </p>
      )}
    </div>
  </section>
);

/* ═══════════════════════════════════════════════════════════════════════════
   FAQ
   ═══════════════════════════════════════════════════════════════════════════ */
const Faq = () => (
  <section className="bg-[#fafcfd] py-16 md:py-24">
    <div className="mx-auto max-w-3xl px-4 sm:px-6">
      <SectionHead eyebrow="FAQ" title="Questions, answered" />
      <div className="mt-10">
        <Generalfaq faqsArr={faqs} defaultOpen={0} actionBtnType="plusminus" />
      </div>
    </div>
  </section>
);

/* ═══════════════════════════════════════════════════════════════════════════
   FINAL CTA
   ═══════════════════════════════════════════════════════════════════════════ */
const FinalCta = () => (
  <section className="bg-white px-4 py-16 sm:px-6 md:py-24">
    <motion.div
      variants={fadeUp}
      initial="hidden"
      whileInView="visible"
      viewport={viewport}
      className="relative mx-auto max-w-7xl overflow-hidden rounded-2xl bg-gradient-to-br from-[#0b1120] to-[#0D2440] px-6 py-14 text-center md:px-12 md:py-20"
    >
      {/* animated glow */}
      <motion.div
        aria-hidden="true"
        className="pointer-events-none absolute -top-20 left-1/2 h-72 w-72 -translate-x-1/2 rounded-full bg-[#0D99FF]/30 blur-[100px]"
        animate={{ opacity: [0.5, 0.9, 0.5] }}
        transition={{ duration: 6, repeat: Infinity, ease: "easeInOut" }}
      />
      <h2 className="relative font-display text-3xl font-bold text-white md:text-5xl/[1.1]">
        Ready to earn recurring revenue?
      </h2>
      <p className="relative mx-auto mt-4 max-w-xl text-base/[1.75] text-white/60 md:text-lg">
        Join the eFoli Partner Program — approval takes {config.approvalTime}, and there's no cost to join.
      </p>
      <div className="relative mt-9 flex flex-wrap items-center justify-center gap-4">
        <a href={links.apply} target="_blank" rel="noopener noreferrer">
          <Button
            pClass="bg-[#0D99FF] rounded-xl px-8 py-3.5 text-white text-base font-bold font-display shadow-lg shadow-[#0D99FF]/30 transition hover:shadow-xl"
            text1="Become a partner"
            text2="Become a partner"
          />
        </a>
        <a
          href={links.signIn}
          target="_blank"
          rel="noopener noreferrer"
          className="rounded-xl border border-white/20 px-8 py-3.5 text-base font-bold font-display text-white transition hover:border-white hover:bg-white/5"
        >
          Already a partner? Sign in
        </a>
      </div>
    </motion.div>
  </section>
);

const Affiliatepage = () => (
  <>
    <Hero />
    <HowItWorks />
    <Commission />
    <Tiers />
    <Tracking />
    <Apps />
    <GettingPaid />
    <Terms />
    <FinalCta />
    <Faq />
  </>
);

export default Affiliatepage;
