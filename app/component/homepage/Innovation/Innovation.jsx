import mvIcon from "./mv_icon.png";
import pbIcon from "./pbLogo.png";
import drIcon from "./drLogo.png";
import emIcon from "./emLogo.png";
import pb_demo from "../../../images/pb.webp";
import dr_demo from "../../../images/dr.webp";
import mv_demo from "../../../images/mv_demo.png";
import em_demo from "../../../images/emDemo.webp";
import or_thumb from "../../../images/or_thumb.png";
import or_icon from "../../../images/or_icon.png";
import qwIcon from "./qw-icon.png";
import qw_demo from "./qw.webp";
import { Link } from "react-router";
import { motion, useScroll, useTransform } from "framer-motion";
import { useRef } from "react";

const products = [
  {
    key: "mv",
    icon: mvIcon,
    demo: mv_demo,
    name: "MultiVariants — Bulk Order",
    desc: "Simplify bulk ordering with one click. Apply flexible business rules and watch your sales grow faster with MultiVariants.",
    link: "https://multivariants.com",
    glow: "#0D99FF",
    gradient: "from-sky-400 via-blue-500 to-indigo-500",
  },
  {
    key: "pb",
    icon: pbIcon,
    demo: pb_demo,
    name: "Push Bundle — Build a Box",
    desc: "Your one-stop bundling solution for Shopify. Build custom product bundles, control pricing rules, and boost your store's AOV with ease.",
    link: "https://pushbundle.com",
    glow: "#a855f7",
    gradient: "from-fuchsia-400 via-purple-500 to-violet-600",
  },
  {
    key: "dr",
    icon: drIcon,
    demo: dr_demo,
    name: "DiscountRay — B2B Custom Pricing",
    desc: "Create personalized discounts for every customer segment. Define pricing tiers, create conditions, automate exclusive deals.",
    link: "https://discountray.com",
    glow: "#f59e0b",
    gradient: "from-amber-300 via-orange-400 to-rose-500",
  },
  {
    key: "em",
    icon: emIcon,
    demo: em_demo,
    name: "EmbedUp — Sell Anywhere",
    desc: "Turn any website or blog into a sales channel within minutes. Embed Shopify products seamlessly on WordPress, Wix, Webflow, Squarespace, and more.",
    link: "https://embedup.com",
    glow: "#10b981",
    gradient: "from-emerald-300 via-teal-400 to-cyan-500",
  },
  {
    key: "or",
    icon: or_icon,
    demo: or_thumb,
    name: "OrderRules — Store Open Limits",
    desc: "Manually toggling your store open and closed, canceling orders that exceed capacity, losing track of daily limits. OrderRules automates all of it.",
    link: "https://orderrules.com",
    glow: "#f43f5e",
    gradient: "from-rose-400 via-pink-500 to-red-500",
  },
  {
    key: "qw",
    icon: qwIcon,
    demo: qw_demo,
    name: "QuotWay — B2B Quote Requests",
    desc: "QuotWay is a Shopify quote request app for B2B and wholesale stores. Add a “Request a Quote” button, hide prices for selected buyers, manage negotiations and approvals, and convert accepted quotes into Shopify draft orders.",
    link: "https://www.quotway.com",
    glow: "#06b6d4",
    gradient: "from-cyan-300 via-sky-400 to-blue-500",
  },
];

// Renders the product logo, or a lettered gradient badge when no icon asset exists yet.
const ProductIcon = ({ p, imgClass, textClass }) =>
  p.icon ? (
    <img src={p.icon} alt={p.name} className={imgClass} />
  ) : (
    <span
      className={`bg-gradient-to-br ${p.gradient} bg-clip-text font-display font-bold text-transparent ${textClass}`}
    >
      {p.name.trim().charAt(0)}
    </span>
  );

// Renders the product screenshot (whole image, never cropped), or a branded
// gradient placeholder panel when no screenshot asset exists yet.
const DemoImage = ({ p, imgClass }) =>
  p.demo ? (
    <img src={p.demo} alt={p.name} loading="lazy" className={imgClass} />
  ) : (
    <div
      className={`grid h-full w-full place-items-center rounded-2xl bg-gradient-to-br ${p.gradient}`}
    >
      <span className="font-display text-3xl font-bold text-white/90 drop-shadow">
        {p.name.split("—")[0].trim()}
      </span>
    </div>
  );

const GoToProduct = () => (
  <span className="group/btn mt-6 inline-flex items-center gap-2 text-sm font-semibold text-white">
    <span className="relative">
      Go to product
      <span className="absolute -bottom-1 left-0 block h-px w-full origin-left scale-x-0 bg-current transition-transform duration-500 ease-out group-hover/btn:scale-x-100" />
    </span>
    <svg
      width="12"
      height="12"
      viewBox="0 0 13 13"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className="transition-transform duration-300 ease-out group-hover/card:translate-x-1 group-hover/card:-translate-y-1"
    >
      <path
        d="M10.7525 3.97035L2.0955 12.6274L0.673004 11.2049L9.33004 2.54786H1.69981V0.536133H12.7643V11.6006H10.7525V3.97035Z"
        fill="currentColor"
      />
    </svg>
  </span>
);

const StackCard = ({ p, i, total, progress }) => {
  // Each card shrinks slightly as the next one scrolls up to cover it — adds depth.
  const targetScale = 1 - (total - i) * 0.04;
  const scale = useTransform(progress, [i / total, 1], [1, targetScale]);

  return (
    // Pin below the sticky site header (~6rem tall) so cards never hide under it.
    <div className="sticky top-24 flex h-[calc(100vh-6rem)] items-center justify-center px-4 md:px-6">
      <motion.div
        style={{ scale, top: `${i * 20}px`, willChange: "transform" }}
        className="group/card relative w-full max-w-6xl origin-top transform-gpu"
      >
        {/* animated gradient glow border */}
        <div
          className={`pointer-events-none absolute -inset-px rounded-[32px] bg-gradient-to-r ${p.gradient} opacity-40 blur-md transition-opacity duration-500 group-hover/card:opacity-70`}
        />
        <Link
          to={p.link}
          target="_blank"
          className="relative flex h-[72vh] max-h-[560px] flex-col-reverse overflow-hidden rounded-[32px] border border-white/10 bg-[#0b1120] md:flex-row"
        >
          {/* spotlight glow */}
          <div
            className="pointer-events-none absolute -top-24 left-10 h-72 w-72 rounded-full opacity-40 blur-3xl transition-opacity duration-500 group-hover/card:opacity-70"
            style={{ background: p.glow }}
          />

          {/* content */}
          <div className="relative z-10 flex flex-1 flex-col justify-center p-6 sm:p-10 md:w-1/2 md:flex-none md:p-14">
            {/* big index watermark */}
            <span className="pointer-events-none absolute right-4 top-2 select-none font-display text-[120px] font-bold leading-none text-white/[0.04] md:text-[180px]">
              {String(i + 1).padStart(2, "0")}
            </span>

            <span className="inline-flex w-fit items-center gap-2 rounded-full border border-white/15 bg-white/5 px-3 py-1 text-[11px] font-semibold uppercase tracking-wider text-white/70">
              <span className="h-1.5 w-1.5 rounded-full bg-emerald-400" />
              {String(i + 1).padStart(2, "0")} / {String(total).padStart(2, "0")}
            </span>

            <div className="mt-5 flex items-center gap-3">
              <span className="grid h-12 w-12 shrink-0 place-items-center rounded-2xl border border-white/10 bg-white/10 backdrop-blur">
                <ProductIcon
                  p={p}
                  imgClass="h-8 w-8 object-contain"
                  textClass="text-2xl"
                />
              </span>
              <h4 className="font-display text-2xl font-bold text-white sm:text-3xl md:text-4xl">
                {p.name}
              </h4>
            </div>

            <p className="mt-4 max-w-xl text-base/[1.75] text-white/60">
              {p.desc}
            </p>
            <GoToProduct />
          </div>

          {/* demo — full screenshot, contained so nothing is cropped */}
          <div className="relative flex flex-1 items-center justify-center overflow-hidden p-4 sm:p-6 md:w-1/2 md:p-10">
            <DemoImage
              p={p}
              imgClass="max-h-full w-auto max-w-full rounded-xl object-contain shadow-2xl transition-transform duration-700 ease-out group-hover/card:scale-[1.03]"
            />
          </div>
        </Link>
      </motion.div>
    </div>
  );
};

const Innovation = () => {
  const stackRef = useRef(null);
  const { scrollYProgress } = useScroll({
    target: stackRef,
    offset: ["start start", "end end"],
  });

  return (
    <section className="relative bg-[#050813] pt-16 md:pt-28">
      {/* futuristic grid + aurora backdrop — kept in its OWN clipped layer so it
          doesn't create an overflow context that would break the sticky stack */}
      <div className="pointer-events-none absolute inset-0 overflow-hidden">
        <div
          className="absolute inset-0 opacity-[0.15]"
          style={{
            backgroundImage:
              "linear-gradient(to right, rgba(255,255,255,0.4) 1px, transparent 1px), linear-gradient(to bottom, rgba(255,255,255,0.4) 1px, transparent 1px)",
            backgroundSize: "40px 40px",
            maskImage:
              "radial-gradient(ellipse 80% 50% at 50% 0%, black 20%, transparent 80%)",
            animation: "efGridPan 8s linear infinite",
          }}
        />
        <div
          className="absolute -top-24 left-[10%] h-96 w-96 rounded-full bg-[#0D99FF]/25 blur-[110px]"
          style={{ animation: "efAurora 16s ease-in-out infinite", willChange: "transform" }}
        />
        <div
          className="absolute top-1/3 right-[5%] h-96 w-96 rounded-full bg-fuchsia-600/20 blur-[110px]"
          style={{ animation: "efAurora 20s ease-in-out infinite reverse", willChange: "transform" }}
        />
      </div>

      {/* heading */}
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: false, amount: 0.4 }}
        transition={{ duration: 0.6, ease: "easeOut" }}
        className="relative mx-auto max-w-3xl px-4 text-center"
      >
        <span className="inline-flex items-center gap-2 rounded-full border border-white/15 bg-white/5 px-4 py-1.5 text-xs font-semibold uppercase tracking-[0.2em] text-sky-300 backdrop-blur">
          <span className="h-1.5 w-1.5 animate-pulse rounded-full bg-sky-400" />
          Products
        </span>
        <h2 className="mt-5 font-display text-3xl font-bold md:text-5xl">
          <span
            className="bg-[linear-gradient(110deg,#ffffff,45%,#7dd3fc,55%,#ffffff)] bg-clip-text text-transparent"
            style={{
              backgroundSize: "200% auto",
              animation: "efShimmer 6s linear infinite",
            }}
          >
            Our Innovative Shopify Apps
          </span>
        </h2>
        <p className="mt-4 text-base/[1.7] text-white/50">
          Scroll to explore each app — engineered to help modern Shopify
          merchants sell smarter, scale faster, and automate the busywork.
        </p>
      </motion.div>

      {/* stacked scroll cards */}
      <div id="efProducts" ref={stackRef} className="relative mt-10">
        {products.map((p, i) => (
          <StackCard
            key={p.key}
            p={p}
            i={i}
            total={products.length}
            progress={scrollYProgress}
          />
        ))}
      </div>

      {/* small tail spacer so the last card settles before the next section */}
      <div className="h-16 md:h-24" />
    </section>
  );
};

export default Innovation;
