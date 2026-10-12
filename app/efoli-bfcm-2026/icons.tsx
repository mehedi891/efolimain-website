/** Inline stroke icons from the BFCM 2026 design (decorative — always aria-hidden). */

interface IconProps {
  size?: number;
  strokeWidth?: number;
}

function Svg({ size = 16, strokeWidth = 2.4, children }: IconProps & { children: React.ReactNode }) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={strokeWidth}
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      {children}
    </svg>
  );
}

export const ArrowRight = (p: IconProps) => (
  <Svg {...p}>
    <path d="M5 12h14M13 6l6 6-6 6" />
  </Svg>
);

export const ArrowUpRight = (p: IconProps) => (
  <Svg {...p}>
    <path d="M7 17L17 7M8 7h9v9" />
  </Svg>
);

export const Check = (p: IconProps) => (
  <Svg size={18} strokeWidth={2.6} {...p}>
    <path d="M5 12.5l4.5 4.5L19 7.5" />
  </Svg>
);

export const Tag = (p: IconProps) => (
  <Svg size={15} strokeWidth={2.2} {...p}>
    <path d="M3 12V4h8l10 10-8 8L3 12zM7.5 8.5h.01" />
  </Svg>
);

export const Clock = (p: IconProps) => (
  <Svg size={15} strokeWidth={2.2} {...p}>
    <circle cx="12" cy="12" r="9" />
    <path d="M12 7v5l3 2" />
  </Svg>
);

export const Mail = (p: IconProps) => (
  <Svg size={22} strokeWidth={2.2} {...p}>
    <path d="M4 5h16v14H4z" />
    <path d="M4 7l8 6 8-6" />
  </Svg>
);

const GUIDE_PATHS = {
  box: "M3 8l9-5 9 5v8l-9 5-9-5V8zM3 8l9 5 9-5M12 13v8",
  tag: "M3 12V4h8l10 10-8 8L3 12zM7.5 8.5h.01",
  grid: "M4 4h7v7H4zM13 4h7v7h-7zM4 13h7v7H4zM13 13h7v7h-7z",
} as const;

export const GuideIcon = ({ name }: { name: keyof typeof GUIDE_PATHS }) => (
  <Svg size={22} strokeWidth={2}>
    <path d={GUIDE_PATHS[name]} />
  </Svg>
);
