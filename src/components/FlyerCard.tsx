"use client";

import Link from "next/link";
import type { ReactNode } from "react";
import type { GigRow } from "@/lib/demo/data";
import { SaveGigForm } from "@/components/GigCard";
import { formatGigDate, formatPay, relativeDay, timeRange } from "@/lib/format";
import {
  Chip,
  IconAmp,
  IconCash,
  IconClock,
  IconFader,
  IconPin,
  IconPlate,
  IconUsers,
} from "@/components/ui";

const TYPE_LABEL: Record<string, string> = {
  one_off: "One-off",
  residency: "Residency",
  sub: "Sub",
  opener: "Opener",
};

/**
 * The board's flyer card: a dated paper flyer with a marigold date spine,
 * a strip of tape, a typed venue line and a perforated pay stub.
 */
export function FlyerCard({ row, saved = false }: { row: GigRow; saved?: boolean }) {
  const { gig, venue } = row;
  const d = formatGigDate(gig.gigDate);
  const sets = `${gig.setsCount} ${gig.setsCount === 1 ? "set" : "sets"}`;
  const unit =
    gig.payUnit === "flat" ? `flat · ${sets}` : gig.payUnit === "hour" ? `hourly · ${sets}` : sets;
  const live = gig.status === "open" || gig.status === "interviewing";
  const flag =
    gig.status === "interviewing"
      ? "Interviewing"
      : gig.status === "filled"
        ? "Filled"
        : gig.status === "closed"
          ? "Closed"
          : relativeDay(gig.gigDate);
  const flagTone =
    gig.status === "interviewing" ? "bg-cobalt text-paper-2" : live ? "bg-tomato text-paper-2" : "bg-ink text-paper-2";

  const perks = [
    gig.backline ? { icon: <IconAmp className="h-3.5 w-3.5" />, label: "Backline" } : null,
    gig.meals ? { icon: <IconPlate className="h-3.5 w-3.5" />, label: "Meal" } : null,
    gig.tips ? { icon: <IconCash className="h-3.5 w-3.5" />, label: "Tips" } : null,
    gig.soundEngineer ? { icon: <IconFader className="h-3.5 w-3.5" />, label: "Engineer" } : null,
  ].filter(Boolean) as { icon: ReactNode; label: string }[];

  return (
    <article className="paper-grain group relative flex flex-col border-[3px] border-ink bg-paper-2 text-ink shadow-hard transition duration-200 hover:-translate-y-1 hover:shadow-hard-lg">
      <span aria-hidden className="tape !h-[22px] !w-[88px] -top-3 left-6 -rotate-2" />

      <div className="flex items-stretch border-b-[3px] border-ink">
        <div className="flex w-[74px] shrink-0 flex-col items-center border-r-[3px] border-ink bg-marigold px-1 py-2">
          <div className="flex flex-1 flex-col items-center justify-center">
            <span className="font-mono text-[10px] font-bold tracking-[0.16em]">{d.weekday}</span>
            <span className="font-display text-[32px] leading-[0.85]">{d.day}</span>
            <span className="font-mono text-[10px] font-bold tracking-[0.16em]">{d.month}</span>
          </div>
          <span
            className="mt-1 border-2 border-ink bg-paper-2 px-1 py-[1px] font-mono text-[9px] font-bold uppercase leading-tight tracking-[0.06em]"
            style={{ transform: "rotate(-3deg)" }}
          >
            {TYPE_LABEL[gig.gigType] ?? gig.gigType}
          </span>
        </div>

        <div className="min-w-0 flex-1 bg-paper-3/60 p-3">
          <p className="truncate font-mono text-[10px] font-bold uppercase tracking-[0.1em] text-ink-soft">
            {venue?.name ?? "Independent room"}
          </p>

          <h3 className="mt-1.5 font-heavy text-[17px] leading-[1.15]">
            <Link
              href={`/gigs/${gig.id}`}
              className="after:absolute after:inset-0 after:content-[''] group-hover:underline group-hover:decoration-tomato group-hover:decoration-2 group-hover:underline-offset-4"
            >
              {gig.title}
            </Link>
          </h3>

          <div className="mt-2 flex flex-wrap items-center gap-x-3 gap-y-1 font-mono text-[10.5px] font-bold uppercase tracking-[0.1em] text-ink-soft">
            <span className="flex items-center gap-1">
              <IconPin className="h-3.5 w-3.5" /> {gig.city}
              {gig.state ? `, ${gig.state}` : ""}
            </span>
            <span className="flex items-center gap-1">
              <IconClock className="h-3.5 w-3.5" /> {timeRange(gig.startTime, gig.endTime)}
            </span>
            <span className="flex items-center gap-1" title={`${row.appCount} one-sheets in`}>
              <IconUsers className="h-3.5 w-3.5" /> {row.appCount}
            </span>
          </div>
        </div>
      </div>

      <div className="flex flex-1 flex-col gap-3 p-3.5">
        <div className="flex flex-wrap gap-1.5">
          {gig.genres.slice(0, 3).map((genre) => (
            <Chip key={genre}>{genre}</Chip>
          ))}
          {gig.lineupNeeded.slice(0, 2).map((slot) => (
            <Chip key={slot} tone="cobalt">
              {slot}
            </Chip>
          ))}
          {gig.spots > 1 ? <Chip tone="moss">{gig.spots} slots</Chip> : null}
        </div>

        {gig.description ? (
          <p className="line-clamp-2 text-[14px] leading-snug text-ink-soft">{gig.description}</p>
        ) : null}

        {perks.length ? (
          <div className="mt-auto flex flex-wrap gap-x-3 gap-y-1 text-moss">
            {perks.map((perk) => (
              <span
                key={perk.label}
                className="flex items-center gap-1 font-mono text-[10px] font-bold uppercase tracking-[0.1em]"
              >
                {perk.icon}
                {perk.label}
              </span>
            ))}
          </div>
        ) : null}
      </div>

      <div className="relative flex flex-wrap items-center justify-between gap-x-3 gap-y-1.5 border-t-2 border-dashed border-ink/50 bg-paper-3/80 px-3.5 py-2.5">
        <span aria-hidden className="absolute -top-[5px] left-3 h-2 w-2 rotate-45 bg-ink" />
        <span aria-hidden className="absolute -top-[5px] right-3 h-2 w-2 rotate-45 bg-ink" />

        <div className="flex min-w-0 flex-wrap items-baseline gap-x-1.5 gap-y-0.5">
          <span className="font-display text-[24px] leading-none text-moss">
            {formatPay(gig.payAmount, gig.payUnit).replace(/ .*/, "")}
          </span>
          <span className="whitespace-nowrap font-mono text-[9.5px] font-bold uppercase tracking-[0.1em] text-ink-soft">
            {unit}
          </span>
        </div>

        <SaveGigForm gigId={gig.id} saved={saved} next="/gigs" />
      </div>

      <div className="absolute -right-3 -top-5 z-10">
        <span className={`sticker !border-ink ${flagTone}`} style={{ transform: "rotate(6deg)" }}>
          {flag}
        </span>
      </div>
    </article>
  );
}
