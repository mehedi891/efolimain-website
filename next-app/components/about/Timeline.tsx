interface TimelineEntry {
  year: string;
  side: "left" | "right";
  colorFrom: string;
  colorTo: string;
  title: string;
  descripton: string;
}

export default function Timeline() {
  const items: TimelineEntry[] = [
    { year: "2010", side: "right", colorFrom: "#a7f3d0", colorTo: "#34d399", title: 'Simplifying eCommerce for All', descripton: 'Founded EFOLI with the mission of simplifying eCommerce for merchants by solving real business problems.' },
    { year: "2012", side: "left", colorFrom: "#fde68a", colorTo: "#f59e0b", title: 'Expanding Creative Commerce', descripton: 'By 2012, we launched T-Shirt Designer v4.1, introducing affiliate shop creation and design-selling features. It also integrated with Magento and Joomla/VirtueMart platforms, expanding customization tools for online stores.' },
    { year: "2016", side: "right", colorFrom: "#bfdbfe", colorTo: "#3b82f6", title: 'Reimagining Product Customization', descripton: 'We released a brand-new Product Configurator with advanced customization for jerseys, shoes, floor mats, and more. Additionally, we launched our WordPress/WooCommerce T-Shirt Customizer Plugin, opening new possibilities for print shops.' },
    { year: "2020", side: "left", colorFrom: "#e9d5ff", colorTo: "#8b5cf6", title: 'Simplifying Bulk Buying', descripton: 'MultiVariants - Bulk Order was born to simplify complex variant sales. That same year, we won the prestigious BASIS National ICT Award, marking a major recognition of our innovation.' },
     { year: "2024", side: "right", colorFrom: "#a7f3d0", colorTo: "#34d399", title: 'Powering Smarter Discounts', descripton: 'With 15+ years of experience, we expanded our Shopify ecosystem by launching DiscountRay. This app continues our mission to empower merchants with personalized discounts, volume bundling, and automation solutions.' },
      { year: "2025", side: "left", colorFrom: "#fde68a", colorTo: "#f59e0b", title: 'Building a Connected Shopify Ecosystem', descripton: 'In 2025, we launched PushBundle and EmbedUp, expanding our Shopify app portfolio with new solutions for bundling and embedded commerce. We also introduced KivoSupport, our white-label customer support brand, now proudly supporting apps like Love Loyalty and helping Shopify apps deliver 24/7 human customer support.' },
  ];

  return (
    <section className="md:py-30 py-10">
      <div className="mx-auto max-w-5xl px-4">
        <h2 className="text-center font-display md:text-5xl text-3xl font-bold">
          Our Journey Through The Years
        </h2>

        <div className="relative md:mt-20 mt-10">
          {/* Vertical dotted line: left on mobile, centered on md+ */}
          <div className="pointer-events-none absolute top-0 h-full left-6 md:left-1/2 md:-translate-x-1/2 border-l-2 border-dotted border-zinc-300" />

          <ol className="space-y-12 sm:space-y-16">
            {items.map((it, idx) => (
              <TimelineItem key={idx} {...it} />
            ))}
          </ol>
        </div>
      </div>
    </section>
  );
}

function TimelineItem({
  year,
  side,
  colorFrom,
  colorTo,
  title = "Milestone Completed",
  descripton = "",
}: TimelineEntry) {
  const isLeft = side === "left";

  return (
    <li className="relative">
      {/* Pin anchored to the line */}
      <IconPin
        className="absolute top-0 left-6 -translate-x-1/2 md:left-1/2 md:-translate-x-1/2"
        colorFrom={colorFrom}
        colorTo={colorTo}
      />

      {/* YEAR — mobile: opposite side of card (left of the line) */}
      <div className="hidden sm:hidden absolute top-1 left-0 w-12 pr-1 text-right text-2xl font-semibold text-[#13181E]">
        {year}
      </div>

      {/* YEAR — desktop: opposite side of the card */}
      <div
        className={[
          "hidden sm:hidden lg:block absolute top-2 text-2xl font-semibold text-[#13181E]",
          // if card is LEFT, put year on RIGHT side of line
          isLeft ? "left-[calc(50%+80px)]" : "right-[calc(50%+80px)]",
        ].join(" ")}
      >
        {year}
      </div>

      {/* CARD */}
      <div
        className={[
          // mobile: push right of the line + extra top margin so it never collides with the year
          "relative ml-16 mt-6 md:mt-0 md:ml-0 md:max-w-[480px] rounded-2xl bg-white p-5 sm:p-6 shadow-lg ring-1 ring-black/5",
          // desktop positions
          isLeft
            ? "md:mr-[calc(50%+72px)] md:ml-4"
            : "md:ml-[calc(50%+72px)] md:mr-4",
        ].join(" ")}
      >

        <div
          className={[
            "absolute top-8 h-0 w-0 border-y-8 border-y-transparent drop-shadow-sm",
            "left-[-8px] border-r-8 border-r-white",
            isLeft
              ? "md:left-auto md:right-[-8px] md:border-r-0 md:border-l-8 md:border-l-white"
              : "md:left-[-8px] md:border-r-8 md:border-r-white",
          ].join(" ")}
        />
        <h3 className="text-[#13181E] text-xl font-display font-bold">
          {title}
        </h3>
        <p className="mt-2 text-sm leading-6 text-[#4b5154]">
          {descripton ||
            "At eFoli, our journey began more than 10 years ago with a simple yet powerful mission—to create solutions that blend innovation, creativity, and real-world impact."}
        </p>
      </div>
    </li>
  );
}


/* Glow pin */
function IconPin({
  className = "",
  colorFrom = "#ddd",
  colorTo = "#999",
}: {
  className?: string;
  colorFrom?: string;
  colorTo?: string;
}) {
  return (
    <div className={className}>
      <span
        className="absolute -left-8 -top-8 h-24 w-24 rounded-full blur-2xl opacity-60"
        style={{ background: `radial-gradient(closest-side, ${hexToRgba(colorFrom, 0.55)}, transparent 70%)` }}
      />
      <span
        className="relative grid h-14 w-14 place-items-center rounded-full ring-8 ring-white shadow-[0_10px_25px_-10px_rgba(0,0,0,.25)]"
        style={{ background: `linear-gradient(180deg, ${colorFrom}, ${colorTo})` }}
      >
        <svg width="20" height="20" viewBox="0 0 24 24" fill="white" stroke="white">
          <path d="M12 2l3 7h7l-5.5 4 2.5 7-7-4-7 4 2.5-7L2 9h7z" />
        </svg>
      </span>
    </div>
  );
}

function hexToRgba(hex: string, a = 1) {
  const h = hex.replace("#", "");
  const n = h.length === 3 ? h.split("").map((c) => c + c).join("") : h;
  const int = parseInt(n, 16);
  const r = (int >> 16) & 255, g = (int >> 8) & 255, b = int & 255;
  return `rgba(${r}, ${g}, ${b}, ${a})`;
}
