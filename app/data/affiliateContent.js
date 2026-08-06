/**
 * Content + configuration for the Affiliate / Partner Program page (/affiliate).
 *
 * ─────────────────────────────────────────────────────────────────────────────
 * EDIT THIS FILE to fill in the real numbers. Everything the page shows comes
 * from here, so marketing/ops can update copy and values without touching the
 * page component.
 *
 * Values marked  ⚠️ CONFIRM  are placeholders from the spec's "configurable
 * values" table — replace them with eFoli's real admin settings before launch.
 * The mechanics baked into the copy (recurring per-payment, per-app attribution,
 * first-code-wins, forward-only, maturity/clawback) are accurate — don't change.
 * ─────────────────────────────────────────────────────────────────────────────
 */

import mvIcon from "../component/homepage/Innovation/mv_icon.png";
import pbIcon from "../component/homepage/Innovation/pbLogo.png";
import drIcon from "../component/homepage/Innovation/drLogo.png";
import emIcon from "../component/homepage/Innovation/emLogo.png";
import orIcon from "../images/or_icon.png";

/* ── Links to wire up ──────────────────────────────────────────────────────
 * ⚠️ CONFIRM these partner-panel URLs before launch. */
export const links = {
  apply: "https://partners.efoli.com/signup",
  signIn: "https://partners.efoli.com/login",
  // terms: no public terms page yet — the "Full terms" link is hidden until one exists.
};

/* ── Headline numbers ─────────────────────────────────────────────────────── */
export const config = {
  topRate: 30, // %  — hero "up to X% recurring"; keep equal to the Gold tier.
  clawbackDays: 30, // maturity window before commissions clear.
  minPayout: 50, // ⚠️ CONFIRM  — USD minimum to request a withdrawal.
  currency: "USD",
  payoutMethods: ["PayPal", "Wise", "Bank transfer"], // ⚠️ CONFIRM
  approvalTime: "about a day",
};

export const hero = {
  badge: "eFoli Partner Program",
  headline: ["Turn referrals into", "recurring revenue."],
  subhead:
    "Refer merchants to eFoli's Shopify apps and earn a share of every subscription — every month they stay subscribed.",
  trustPoints: [
    {
      value: `Up to ${config.topRate}%`,
      label: "recurring",
      detail: "A share of every subscription you refer.",
    },
    {
      value: "Monthly",
      label: "payouts",
      detail: "For as long as the merchant stays subscribed.",
    },
    {
      value: "Real-time",
      label: "dashboard",
      detail: "Track referrals, earnings & payouts live.",
    },
  ],
};

export const steps = [
  {
    title: "Apply",
    body: "Submit the partner application. We review it and email you when you're approved — approval unlocks your dashboard and unique referral code.",
  },
  {
    title: "Share",
    body: "Promote eFoli's apps to your audience. Share your referral code or a one-click install link for any app.",
  },
  {
    title: "They install & subscribe",
    body: "When a merchant installs through your link (or enters your code on the subscription page) and pays for a plan, that subscription is credited to you.",
  },
  {
    title: "Earn every month",
    body: "You earn a commission on each of their subscription payments — recurring, for as long as they stay subscribed. Withdraw once your balance clears.",
  },
];

export const commission = {
  intro: "You earn a share of every subscription payment — not a one-time bounty.",
  points: [
    {
      title: "Recurring by default",
      body: "A monthly plan earns you every month; an annual plan earns on the annual payment. You keep earning for as long as they stay subscribed.",
    },
    {
      title: "Per app",
      body: "Commission is earned per app a merchant subscribes to. A client running three eFoli apps means three subscriptions earning for you.",
    },
    {
      title: "A percentage of each payment",
      body: "Your rate depends on your tier (see below). Some campaigns may use a fixed amount per payment instead.",
    },
    {
      title: "For the life of the subscription",
      body: "Most codes pay for as long as the subscription runs; some campaign codes pay for a set number of billing cycles. Your dashboard shows your code's terms.",
    },
  ],
  merchantDiscount:
    "Many partner codes also give the merchant a discount on their subscription — so your link isn't just a referral, it's a deal.",
};

/* ── Tiers ────────────────────────────────────────────────────────────────
 * Rates are confirmed. Thresholds still ⚠️ CONFIRM against Admin → Settings.
 * Rates aren't fixed — eFoli can also grant a special/custom rate (see note in
 * the Tiers section). Names are fixed (Registered / Silver / Gold). */
export const tiers = [
  {
    name: "Registered",
    threshold: "Starting tier",
    rate: 25,
    highlight: false,
  },
  {
    name: "Silver",
    threshold: "10+ active referrals", // ⚠️ CONFIRM threshold
    rate: 27.5,
    highlight: false,
  },
  {
    name: "Gold",
    threshold: "25+ active referrals", // ⚠️ CONFIRM threshold
    rate: config.topRate, // 30
    highlight: true,
  },
];

export const tracking = {
  methods: [
    {
      tag: "Easiest",
      title: "One-click install link",
      body: "Share your per-app install link. The merchant enters their store URL, installs from there, and your code applies automatically when they open the app — no manual step.",
    },
    {
      tag: "Manual",
      title: "Referral code",
      body: "The merchant installs the app the normal way, then enters your code on the app's subscription page and submits it.",
    },
  ],
  rules: [
    {
      title: "First code wins",
      body: "The first valid code applied to a given store + app is the one credited.",
    },
    {
      title: "Per app",
      body: "Your code credits the specific app it's submitted for; each app is credited separately.",
    },
    {
      title: "Forward-only",
      body: "You're credited from when the code is applied onward — payments made before aren't back-paid. So share your link early.",
    },
    {
      title: "Full visibility",
      body: "Your dashboard shows every referred store, its status, and exactly what it's earning.",
    },
  ],
};

/* ── Apps ─────────────────────────────────────────────────────────────────
 * Taglines/links reused from the homepage products section. Swap `link` for the
 * Shopify App Store listing if you'd rather point there. */
export const apps = [
  {
    name: "MultiVariants",
    icon: mvIcon,
    tagline: "One-click bulk ordering with flexible business rules.",
    link: "https://multivariants.com",
  },
  {
    name: "DiscountRay",
    icon: drIcon,
    tagline: "Personalized B2B discounts and pricing tiers per segment.",
    link: "https://discountray.com",
  },
  {
    name: "PushBundle",
    icon: pbIcon,
    tagline: "Custom product bundles that boost your store's AOV.",
    link: "https://pushbundle.com",
  },
  {
    name: "EmbedUp",
    icon: emIcon,
    tagline: "Embed Shopify products on WordPress, Wix, Webflow & more.",
    link: "https://embedup.com",
  },
  {
    name: "OrderRules",
    icon: orIcon,
    tagline: "Automate store open/close limits and daily order capacity.",
    link: "https://orderrules.com",
  },
];

export const gettingPaid = [
  {
    title: "Earnings mature first",
    body: `New commissions are pending for a ${config.clawbackDays}-day clawback window to cover refunds, then clear and become withdrawable. Your dashboard shows "clears in N days" on each.`,
  },
  {
    title: "Refunds reverse commissions",
    body: "A refund or chargeback on a referred payment reverses the matching commission — only cleared, real revenue is paid out.",
  },
  {
    title: `Withdraw from $${config.minPayout}`,
    body: `Request a withdrawal once your cleared balance reaches the ${config.currency} $${config.minPayout} minimum.`,
  },
  {
    title: "Your choice of payout",
    body: `Get paid via ${config.payoutMethods.join(", ")}. Set your payout details in the dashboard; eFoli records each payment against your balance.`,
  },
  {
    title: "One balance",
    body: "You're paid against your total across all apps, not per app.",
  },
];

/* ── Program terms (plain-English). ⚠️ CONFIRM eligibility + policy wording. */
export const terms = [
  {
    title: "Who can join",
    body: "Agencies, freelancers, developers, content creators and Shopify consultants. Applications are reviewed before approval.",
  },
  {
    title: "Honest referrals only",
    body: "Refer your own stores freely — self-referral is welcome. Just no misleading or incentivized claims or brand-bidding. Abuse voids commissions and can suspend the account.",
  },
  {
    title: "Fair & predictable",
    body: "Forward-only and first-code-wins, as described above. All amounts are in USD.",
  },
  {
    title: "Terms may evolve",
    body: "eFoli may adjust rates, tiers and terms; changes are announced in the dashboard and apply going forward.",
  },
];

export const faqs = [
  {
    question: "How much can I earn?",
    answer: `A percentage of every subscription payment your referrals make, every billing cycle they stay subscribed — up to ${config.topRate}% at the top tier. More active referrals means a higher tier and a higher rate.`,
  },
  {
    question: "Is it one-time or recurring?",
    answer:
      "Recurring. You earn on each payment for as long as the merchant stays subscribed (per your code's duration).",
  },
  {
    question: "When do I get paid?",
    answer: `Commissions clear after the ${config.clawbackDays}-day maturity window, then you can withdraw once you hit the $${config.minPayout} minimum. Payouts are sent via ${config.payoutMethods.join(", ")}.`,
  },
  {
    question: "How is a referral tracked?",
    answer:
      "Either the merchant installs through your one-click install link (code auto-applies), or they enter your code on the app's subscription page. First valid code wins, credited per app.",
  },
  {
    question: "What if they install without my link?",
    answer:
      "Have them enter your code on the subscription page afterward — you're credited from that point on (forward-only).",
  },
  {
    question: "Do my referrals get anything?",
    answer:
      "Often yes — many codes also apply a merchant discount on the subscription.",
  },
  {
    question: "How many apps can I promote?",
    answer:
      "All of them. Each app a merchant subscribes to is a separate earning subscription.",
  },
];
