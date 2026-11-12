import type { ReactNode } from "react";

/* ---------------- primitives ---------------- */

export function Marquee({
  items,
  className = "",
  reverse = false,
  slow = false,
}: {
  items: ReactNode[];
  className?: string;
  reverse?: boolean;
  slow?: boolean;
}) {
  const doubled = [...items, ...items];
  return (
    <div className={`overflow-hidden ${className}`}>
      <div className={`marquee-track ${reverse ? "reverse" : ""} ${slow ? "marquee-slow" : ""}`}>
        {doubled.map((item, i) => (
          <span key={i} className="flex shrink-0 items-center gap-6 pr-6">
            {item}
            <Asterisk className="h-4 w-4 shrink-0 opacity-70" />
          </span>
        ))}
      </div>
    </div>
  );
}

export function Asterisk({ className = "" }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" className={className} fill="none" stroke="currentColor" strokeWidth="2.4">
      <path d="M12 2v20M3.5 6.5l17 11M20.5 6.5l-17 11" strokeLinecap="round" />
    </svg>
  );
}

export function Tape({ className = "" }: { className?: string }) {
  return <span aria-hidden className={`tape ${className}`} />;
}

export function Sticker({
  children,
  className = "",
  rotate = "-3deg",
  bg = "bg-bubblegum",
  text = "text-paper-2",
}: {
  children: ReactNode;
  className?: string;
  rotate?: string;
  bg?: string;
  text?: string;
}) {
  return (
    <span
      style={{ transform: `rotate(${rotate})` }}
      className={`sticker ${bg} ${text} ${className}`}
    >
      {children}
    </span>
  );
}

export function Eyebrow({ children, className = "" }: { children: ReactNode; className?: string }) {
  return (
    <p
      className={`flex items-center gap-2 font-mono text-[11px] font-bold uppercase tracking-[0.28em] ${className}`}
    >
      <span className="inline-block h-2.5 w-2.5 rotate-45 bg-tomato" />
      {children}
    </p>
  );
}

export function Stamp({ children, className = "" }: { children: ReactNode; className?: string }) {
  return (
    <span
      className={`inline-block border-[3px] border-dashed border-current px-3 py-1 font-mono text-[10px] font-bold uppercase tracking-[0.2em] ${className}`}
    >
      {children}
    </span>
  );
}

export function SectionHeading({
  kicker,
  title,
  intro,
  align = "left",
  className = "",
}: {
  kicker?: string;
  title: ReactNode;
  intro?: ReactNode;
  align?: "left" | "center";
  className?: string;
}) {
  return (
    <div className={`${align === "center" ? "mx-auto max-w-3xl text-center" : "max-w-3xl"} ${className}`}>
      {kicker ? <Eyebrow className="mb-4 justify-center text-ink-soft">{kicker}</Eyebrow> : null}
      <h2 className="text-[clamp(2.4rem,6.5vw,4.6rem)] uppercase">{title}</h2>
      {intro ? (
        <p className="mt-5 text-[17px] leading-relaxed text-ink-soft md:text-lg">{intro}</p>
      ) : null}
    </div>
  );
}

export function DateBlock({
  weekday,
  month,
  day,
  className = "",
  bg = "bg-marigold",
}: {
  weekday: string;
  month: string;
  day: string;
  className?: string;
  bg?: string;
  text?: string;
}) {
  return (
    <div
      className={`flex w-[74px] shrink-0 flex-col items-center border-[3px] border-ink px-1 py-1.5 ${bg} ${className}`}
    >
      <span className="font-mono text-[10px] font-bold tracking-[0.16em]">{weekday}</span>
      <span className="font-display text-[30px] leading-[0.9]">{day}</span>
      <span className="font-mono text-[10px] font-bold tracking-[0.16em]">{month}</span>
    </div>
  );
}

export function Chip({
  children,
  className = "",
  tone = "default",
}: {
  children: ReactNode;
  className?: string;
  tone?: "default" | "ink" | "moss" | "cobalt" | "tomato";
}) {
  const tones: Record<string, string> = {
    default: "border-ink bg-paper-3 text-ink",
    ink: "border-ink bg-ink text-paper-2",
    moss: "border-ink bg-moss text-paper-2",
    cobalt: "border-ink bg-cobalt text-paper-2",
    tomato: "border-ink bg-tomato text-paper-2",
  };
  return (
    <span
      className={`inline-flex items-center gap-1 border-2 px-2 py-[3px] font-mono text-[10px] font-bold uppercase tracking-[0.1em] ${tones[tone]} ${className}`}
    >
      {children}
    </span>
  );
}

/* ---------------- icons ---------------- */

const iconProps = { fill: "none", stroke: "currentColor", strokeWidth: 1.9, strokeLinecap: "round" as const, strokeLinejoin: "round" as const };

export function IconPin({ className = "h-4 w-4" }) {
  return (
    <svg viewBox="0 0 24 24" className={className} {...iconProps}>
      <path d="M12 21s7-6.3 7-11a7 7 0 1 0-14 0c0 4.7 7 11 7 11Z" />
      <circle cx="12" cy="10" r="2.6" />
    </svg>
  );
}
export function IconClock({ className = "h-4 w-4" }) {
  return (
    <svg viewBox="0 0 24 24" className={className} {...iconProps}>
      <circle cx="12" cy="12" r="9" />
      <path d="M12 7v5.5l3.5 2" />
    </svg>
  );
}
export function IconCash({ className = "h-4 w-4" }) {
  return (
    <svg viewBox="0 0 24 24" className={className} {...iconProps}>
      <rect x="2.5" y="6" width="19" height="12" rx="1.5" />
      <circle cx="12" cy="12" r="2.8" />
      <path d="M6 9.5v5M18 9.5v5" />
    </svg>
  );
}
export function IconMusic({ className = "h-4 w-4" }) {
  return (
    <svg viewBox="0 0 24 24" className={className} {...iconProps}>
      <path d="M9 18V5.5l10-2V16" />
      <circle cx="6.5" cy="18" r="2.6" />
      <circle cx="16.5" cy="16" r="2.6" />
    </svg>
  );
}
export function IconUsers({ className = "h-4 w-4" }) {
  return (
    <svg viewBox="0 0 24 24" className={className} {...iconProps}>
      <circle cx="9" cy="8" r="3.4" />
      <path d="M3 20c0-3.6 2.7-5.6 6-5.6s6 2 6 5.6" />
      <path d="M16 5.2a3.4 3.4 0 0 1 0 6.5M18 14.8c2 .8 3 2.6 3 5.2" />
    </svg>
  );
}
export function IconStar({ className = "h-4 w-4" }) {
  return (
    <svg viewBox="0 0 24 24" className={className} {...iconProps}>
      <path d="m12 3 2.6 6.1 6.6.5-5 4.3 1.5 6.4L12 16.9 6.3 20.3l1.5-6.4-5-4.3 6.6-.5L12 3Z" />
    </svg>
  );
}
export function IconBolt({ className = "h-4 w-4" }) {
  return (
    <svg viewBox="0 0 24 24" className={className} {...iconProps}>
      <path d="M13.5 2 4 13.5h6L9.5 22 20 10.5h-6.5L13.5 2Z" />
    </svg>
  );
}
export function IconPlate({ className = "h-4 w-4" }) {
  return (
    <svg viewBox="0 0 24 24" className={className} {...iconProps}>
      <circle cx="12" cy="12" r="9" />
      <circle cx="12" cy="12" r="4.5" />
    </svg>
  );
}
export function IconAmp({ className = "h-4 w-4" }) {
  return (
    <svg viewBox="0 0 24 24" className={className} {...iconProps}>
      <rect x="3" y="5" width="18" height="14" rx="1.5" />
      <circle cx="9" cy="13" r="3" />
      <path d="M15 10h3M15 14h3M6 8h12" />
    </svg>
  );
}
export function IconBookmark({ className = "h-4 w-4", filled = false }) {
  return (
    <svg viewBox="0 0 24 24" className={className} fill={filled ? "currentColor" : "none"} stroke="currentColor" strokeWidth="1.9" strokeLinejoin="round">
      <path d="M6 3.5h12v17l-6-4.5-6 4.5v-17Z" />
    </svg>
  );
}
export function IconArrow({ className = "h-4 w-4" }) {
  return (
    <svg viewBox="0 0 24 24" className={className} {...iconProps}>
      <path d="M4 12h15M13 6l6 6-6 6" />
    </svg>
  );
}
export function IconCheck({ className = "h-4 w-4" }) {
  return (
    <svg viewBox="0 0 24 24" className={className} {...iconProps} strokeWidth={2.6}>
      <path d="m4 12.5 5 5L20 6" />
    </svg>
  );
}
export function IconDisc({ className = "h-4 w-4" }) {
  return (
    <svg viewBox="0 0 24 24" className={className} {...iconProps}>
      <circle cx="12" cy="12" r="9" />
      <circle cx="12" cy="12" r="2.2" />
      <path d="M12 3a9 9 0 0 1 6.4 2.7" />
    </svg>
  );
}

/* ---------------- photo bits ---------------- */

export function Polaroid({
  src,
  caption,
  rotate = "-4deg",
  className = "",
  tone = "bg-paper-2",
}: {
  src: string;
  caption?: ReactNode;
  rotate?: string;
  className?: string;
  tone?: string;
}) {
  return (
    <figure
      style={{ transform: `rotate(${rotate})` }}
      className={`paper-grain relative border-[3px] border-ink p-2.5 shadow-hard-lg ${tone} ${className}`}
    >
      <span aria-hidden className="tape -top-4 left-1/2 -translate-x-1/2 -rotate-3" />
      <div className="overflow-hidden border-2 border-ink">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img src={src} alt="" loading="lazy" className="block h-full w-full object-cover mix-blend-multiply" />
      </div>
      {caption ? (
        <figcaption className="mt-2 px-1 pb-0.5 font-serif text-[14.5px] italic leading-snug text-ink-soft">
          {caption}
        </figcaption>
      ) : null}
    </figure>
  );
}

export function Squiggle({ className = "" }: { className?: string }) {
  return (
    <svg viewBox="0 0 1200 26" preserveAspectRatio="none" className={`block h-6 w-full ${className}`} fill="none">
      <path
        d="M0 14c50-14 100-14 150 0s100 14 150 0 100-14 150 0 100 14 150 0 100-14 150 0 100 14 150 0 100-14 150 0"
        stroke="currentColor"
        strokeWidth="5"
        strokeLinecap="round"
      />
    </svg>
  );
}
