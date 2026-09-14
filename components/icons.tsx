// Minimal inline SVG icon set (no external icon-library dependency) covering
// what the reconciled pages need. Stroke-based, 24x24 viewbox, sized via className.
import { SVGProps } from "react";

type IconProps = SVGProps<SVGSVGElement>;

const base = (props: IconProps) => ({
  xmlns: "http://www.w3.org/2000/svg",
  viewBox: "0 0 24 24",
  fill: "none",
  stroke: "currentColor",
  strokeWidth: 1.8,
  strokeLinecap: "round" as const,
  strokeLinejoin: "round" as const,
  ...props,
});

export const IconHome = (p: IconProps) => (
  <svg {...base(p)}>
    <path d="M3 11l9-8 9 8" />
    <path d="M5 10v10h14V10" />
  </svg>
);
export const IconBox = (p: IconProps) => (
  <svg {...base(p)}>
    <path d="M21 8l-9-5-9 5 9 5 9-5z" />
    <path d="M3 8v8l9 5 9-5V8" />
    <path d="M12 13v8" />
  </svg>
);
export const IconReceipt = (p: IconProps) => (
  <svg {...base(p)}>
    <path d="M6 2h12v20l-3-2-3 2-3-2-3 2V2z" />
    <path d="M9 8h6M9 12h6" />
  </svg>
);
export const IconCog = (p: IconProps) => (
  <svg {...base(p)}>
    <circle cx="12" cy="12" r="3" />
    <path d="M19.4 15a1.7 1.7 0 00.34 1.87l.06.06a2 2 0 11-2.83 2.83l-.06-.06a1.7 1.7 0 00-1.87-.34 1.7 1.7 0 00-1 1.55V21a2 2 0 11-4 0v-.09a1.7 1.7 0 00-1-1.55 1.7 1.7 0 00-1.87.34l-.06.06a2 2 0 11-2.83-2.83l.06-.06a1.7 1.7 0 00.34-1.87 1.7 1.7 0 00-1.55-1H3a2 2 0 110-4h.09a1.7 1.7 0 001.55-1 1.7 1.7 0 00-.34-1.87l-.06-.06a2 2 0 112.83-2.83l.06.06a1.7 1.7 0 001.87.34H9a1.7 1.7 0 001-1.55V3a2 2 0 114 0v.09a1.7 1.7 0 001 1.55 1.7 1.7 0 001.87-.34l.06-.06a2 2 0 112.83 2.83l-.06.06a1.7 1.7 0 00-.34 1.87V9c.14.6.6 1.08 1.55 1H21a2 2 0 110 4h-.09a1.7 1.7 0 00-1.55 1z" />
  </svg>
);
export const IconCrown = (p: IconProps) => (
  <svg {...base(p)}>
    <path d="M3 18h18M4 18l-1-9 5 4 4-7 4 7 5-4-1 9" />
  </svg>
);
export const IconHeadset = (p: IconProps) => (
  <svg {...base(p)}>
    <path d="M3 13a9 9 0 0118 0" />
    <rect x="2" y="13" width="5" height="7" rx="1.5" />
    <rect x="17" y="13" width="5" height="7" rx="1.5" />
    <path d="M20 20a4 4 0 01-4 3h-2" />
  </svg>
);
export const IconLogout = (p: IconProps) => (
  <svg {...base(p)}>
    <path d="M9 21H5a2 2 0 01-2-2V5a2 2 0 012-2h4" />
    <path d="M16 17l5-5-5-5M21 12H9" />
  </svg>
);
export const IconClock = (p: IconProps) => (
  <svg {...base(p)}>
    <circle cx="12" cy="12" r="9" />
    <path d="M12 7v5l3 3" />
  </svg>
);
export const IconMoney = (p: IconProps) => (
  <svg {...base(p)}>
    <rect x="2" y="6" width="20" height="12" rx="2" />
    <circle cx="12" cy="12" r="3" />
  </svg>
);
export const IconCheckCircle = (p: IconProps) => (
  <svg {...base(p)}>
    <circle cx="12" cy="12" r="9" />
    <path d="M8.5 12.5l2.5 2.5 5-5" />
  </svg>
);
export const IconArrowLeft = (p: IconProps) => (
  <svg {...base(p)}>
    <path d="M19 12H5M12 19l-7-7 7-7" />
  </svg>
);
export const IconPencil = (p: IconProps) => (
  <svg {...base(p)}>
    <path d="M12 20h9" />
    <path d="M16.5 3.5a2.1 2.1 0 013 3L7 19l-4 1 1-4L16.5 3.5z" />
  </svg>
);
export const IconTrash = (p: IconProps) => (
  <svg {...base(p)}>
    <path d="M3 6h18M8 6V4a2 2 0 012-2h4a2 2 0 012 2v2m3 0-1 14a2 2 0 01-2 2H7a2 2 0 01-2-2L4 6h16z" />
  </svg>
);
export const IconPlus = (p: IconProps) => (
  <svg {...base(p)}>
    <path d="M12 5v14M5 12h14" />
  </svg>
);
export const IconSearch = (p: IconProps) => (
  <svg {...base(p)}>
    <circle cx="11" cy="11" r="7" />
    <path d="M21 21l-4.3-4.3" />
  </svg>
);
export const IconTruck = (p: IconProps) => (
  <svg {...base(p)}>
    <rect x="1" y="7" width="14" height="10" rx="1" />
    <path d="M15 10h4l3 3v4h-7z" />
    <circle cx="6" cy="19" r="1.6" />
    <circle cx="17.5" cy="19" r="1.6" />
  </svg>
);
export const IconShield = (p: IconProps) => (
  <svg {...base(p)}>
    <path d="M12 3l8 3v6c0 4.5-3 8-8 9-5-1-8-4.5-8-9V6l8-3z" />
  </svg>
);
export const IconUndo = (p: IconProps) => (
  <svg {...base(p)}>
    <path d="M3 7v6h6" />
    <path d="M3 13a9 9 0 1015-6.7L3 13z" />
  </svg>
);
export const IconMail = (p: IconProps) => (
  <svg {...base(p)}>
    <rect x="2" y="4" width="20" height="16" rx="2" />
    <path d="M2 6l10 7 10-7" />
  </svg>
);
export const IconPhone = (p: IconProps) => (
  <svg {...base(p)}>
    <path d="M22 16.9v3a2 2 0 01-2.2 2 19.8 19.8 0 01-8.6-3.1 19.5 19.5 0 01-6-6A19.8 19.8 0 012.1 4.2 2 2 0 014.1 2h3a2 2 0 012 1.7c.1.9.3 1.8.6 2.7a2 2 0 01-.4 2.1L8.1 9.7a16 16 0 006.2 6.2l1.2-1.2a2 2 0 012.1-.4c.9.3 1.8.5 2.7.6a2 2 0 011.7 2.1z" />
  </svg>
);
export const IconMapPin = (p: IconProps) => (
  <svg {...base(p)}>
    <path d="M20 10c0 6-8 12-8 12s-8-6-8-12a8 8 0 1116 0z" />
    <circle cx="12" cy="10" r="3" />
  </svg>
);
export const IconLock = (p: IconProps) => (
  <svg {...base(p)}>
    <rect x="4" y="11" width="16" height="9" rx="2" />
    <path d="M8 11V7a4 4 0 118 0v4" />
  </svg>
);
export const IconStoreSlash = (p: IconProps) => (
  <svg {...base(p)}>
    <path d="M3 9l1-5h16l1 5" />
    <path d="M5 9v11h14V9" />
    <path d="M2 2l20 20" />
  </svg>
);
export const IconWhatsApp = (p: IconProps) => (
  <svg {...base(p)}>
    <path d="M20.5 3.5a10 10 0 00-16.9 10L2 21l7.7-1.5A10 10 0 1020.5 3.5z" />
    <path d="M8.5 8.8c.3 3.3 3.4 6.4 6.7 6.7 1 .1 1.5-.6 1.5-1.3l-.1-1-2-.6-.8.8a6 6 0 01-3.4-3.4l.8-.8-.6-2-1-.1c-.7 0-1.4.5-1.3 1.5z" />
  </svg>
);
export const IconEye = (p: IconProps) => (
  <svg {...base(p)}>
    <path d="M1 12s4-7 11-7 11 7 11 7-4 7-11 7-11-7-11-7z" />
    <circle cx="12" cy="12" r="3" />
  </svg>
);
export const IconEyeOff = (p: IconProps) => (
  <svg {...base(p)}>
    <path d="M17.9 17.9A11 11 0 0112 19c-7 0-11-7-11-7a20.5 20.5 0 015.1-5.6M9.9 4.2A11 11 0 0112 4c7 0 11 7 11 7a20.6 20.6 0 01-2.6 3.6" />
    <path d="M1 1l22 22" />
    <path d="M14.1 14.1a3 3 0 01-4.2-4.2" />
  </svg>
);
export const IconChartBar = (p: IconProps) => (
  <svg {...base(p)}>
    <path d="M4 20V10M12 20V4M20 20v-7" />
  </svg>
);
export const IconGlobe = (p: IconProps) => (
  <svg {...base(p)}>
    <circle cx="12" cy="12" r="10" />
    <path d="M2 12h20M12 2a15 15 0 010 20 15 15 0 010-20z" />
  </svg>
);
export const IconBell = (p: IconProps) => (
  <svg {...base(p)}>
    <path d="M18 8a6 6 0 10-12 0c0 7-3 9-3 9h18s-3-2-3-9" />
    <path d="M13.7 21a2 2 0 01-3.4 0" />
  </svg>
);
export const IconCard = (p: IconProps) => (
  <svg {...base(p)}>
    <rect x="1" y="4" width="22" height="16" rx="2" />
    <path d="M1 10h22" />
  </svg>
);
export const IconChevronRight = (p: IconProps) => (
  <svg {...base(p)}>
    <path d="M9 6l6 6-6 6" />
  </svg>
);
export const IconUsers = (p: IconProps) => (
  <svg {...base(p)}>
    <path d="M17 21v-2a4 4 0 00-4-4H5a4 4 0 00-4 4v2" />
    <circle cx="9" cy="7" r="4" />
    <path d="M23 21v-2a4 4 0 00-3-3.87" />
    <path d="M16 3.13a4 4 0 010 7.75" />
  </svg>
);
export const IconFlag = (p: IconProps) => (
  <svg {...base(p)}>
    <path d="M4 15s1-1 4-1 5 2 8 2 4-1 4-1V3s-1 1-4 1-5-2-8-2-4 1-4 1z" />
    <path d="M4 22V3" />
  </svg>
);
export const IconSliders = (p: IconProps) => (
  <svg {...base(p)}>
    <path d="M4 21v-7M4 10V3M12 21v-9M12 8V3M20 21v-5M20 12V3" />
    <path d="M1 14h6M9 8h6M17 16h6" />
  </svg>
);
