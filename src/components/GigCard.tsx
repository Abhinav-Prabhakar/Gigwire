import Link from "next/link";
import type { GigRow } from "@/lib/data";
import { formatGigDate, formatPay, relativeDay, timeRange } from "@/lib/format";
import { Chip, DateBlock, IconClock, IconPin, IconUsers, IconBookmark, IconBolt } from "@/components/ui";

export function StatusFlag({ status }: { status: string }) {
  if (status === "filled")
    return <Chip tone="ink">Filled</Chip>;
  if (status === "closed") return <Chip tone="ink">Closed</Chip>;
  if (status === "interviewing") return <Chip tone="cobalt">Interviewing</Chip>;
  return <Chip tone="moss">Open</Chip>;
}

export function SaveGigForm({
  gigId,
  saved,
  next,
}: {
  gigId: number;
  saved: boolean;
  next: string;
}) {
  return (
    <form action={`/api/gigs/${gigId}/save`} method="post" className="contents">
      <input type="hidden" name="next" value={next} />
      <button
        type="submit"
        title={saved ? "Remove from saved gigs" : "Save this gig"}
        className={`relative z-20 flex h-9 w-9 items-center justify-center border-[3px] border-ink transition hover:bg-marigold ${
          saved ? "bg-marigold text-ink" : "bg-paper-2 text-ink"
        }`}
      >
        <IconBookmark className="h-4 w-4" filled={saved} />
      </button>
    </form>
  );
}

const perksFor = (row: GigRow["gig"]) => {
  const perks: string[] = [];
  if (row.backline) perks.push("Backline provided");
  if (row.meals) perks.push("Meal on arrival");
  if (row.tips) perks.push("Tip jar split");
  if (row.soundEngineer) perks.push("House engineer");
  return perks;
};

export function GigCard({
  row,
  saved = false,
  teaser = false,
}: {
  row: GigRow;
  saved?: boolean;
  teaser?: boolean;
}) {
  const { gig, venue } = row;
  const d = formatGigDate(gig.gigDate);
  const rel = relativeDay(gig.gigDate);
  const perks = perksFor(gig);

  return (
    <article
      className={`paper-grain group relative flex flex-col border-[3px] border-ink bg-paper-2 shadow-hard transition duration-200 hover:-translate-y-1 hover:shadow-hard-lg ${
        teaser ? "bg-butter" : ""
      }`}
    >
      <div className="flex items-start gap-3 border-b-[3px] border-ink bg-paper-3/70 p-3.5">
        <DateBlock weekday={d.weekday} day={d.day} month={d.month} bg={teaser ? "bg-paper-2" : "bg-marigold"} />
        <div className="min-w-0 flex-1">
          <p className="truncate font-mono text-[11px] font-bold uppercase tracking-[0.14em] text-ink-soft">
            {venue?.name ?? "Independent room"}
          </p>
          <h3 className="mt-1 font-heavy text-[17px] leading-[1.15]">
            <Link href={`/gigs/${gig.id}`} className="after:absolute after:inset-0 after:content-['']">
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
          </div>
        </div>
        <div className="hidden shrink-0 -translate-y-6 sm:block">
          <span className="sticker bg-tomato text-paper-2 !border-ink" style={{ transform: "rotate(6deg)" }}>
            {rel}
          </span>
        </div>
      </div>

      <div className="flex flex-1 flex-col gap-3 p-3.5">
        <div className="flex flex-wrap gap-1.5">
          {gig.genres.slice(0, 3).map((genre) => (
            <Chip key={genre}>{genre}</Chip>
          ))}
          {gig.lineupNeeded.slice(0, 2).map((slot) => (
            <Chip key={slot} className="bg-sky">
              {slot}
            </Chip>
          ))}
        </div>

        {!teaser && gig.description ? (
          <p className="line-clamp-2 text-[14.5px] leading-snug text-ink-soft">{gig.description}</p>
        ) : null}

        <div className="mt-auto flex flex-wrap gap-1.5">
          {perks.slice(0, 3).map((p) => (
            <span key={p} className="font-mono text-[10px] font-bold uppercase tracking-[0.1em] text-moss">
              ✦ {p}
            </span>
          ))}
        </div>
      </div>

      <div className="flex items-center justify-between gap-2 border-t-[3px] border-ink bg-paper-3/80 px-3.5 py-2.5">
        <div className="flex items-baseline gap-1.5">
          <span className="font-display text-[24px] leading-none text-moss">{formatPay(gig.payAmount, gig.payUnit).replace(/ .*/, "")}</span>
          <span className="font-mono text-[10px] font-bold uppercase tracking-[0.12em] text-ink-soft">
            {gig.payUnit === "flat" ? "flat" : gig.payUnit === "hour" ? "per hour" : "per set"} · {gig.setsCount} sets
          </span>
        </div>
        <div className="flex items-center gap-2">
          <span className="flex items-center gap-1 font-mono text-[10px] font-bold uppercase tracking-[0.1em] text-ink-soft">
            <IconUsers className="h-3.5 w-3.5" /> {row.appCount}
          </span>
          {teaser ? (
            <Link
              href={`/gigs/${gig.id}`}
              className="flex items-center gap-1 border-[3px] border-ink bg-ink px-2.5 py-1 font-mono text-[10px] font-bold uppercase tracking-[0.12em] text-paper-2 transition hover:bg-tomato"
            >
              Details <IconBolt className="h-3.5 w-3.5" />
            </Link>
          ) : (
            <SaveGigForm gigId={gig.id} saved={saved} next="/gigs" />
          )}
        </div>
      </div>
    </article>
  );
}
