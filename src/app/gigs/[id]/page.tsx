import Link from "next/link";
import { notFound } from "next/navigation";
import type { Metadata } from "next";
import { BASE_DATASET, getGig, getUser, searchGigs } from "@/lib/demo/data";
import { formatGigDate, formatPay, relativeDay, timeRange } from "@/lib/format";
import { GigCard } from "@/components/GigCard";
import { ApplyRail, OwnerApplications } from "@/components/gig/ApplyRail";
import {
  Chip,
  DateBlock,
  Eyebrow,
  IconAmp,
  IconArrow,
  IconClock,
  IconMusic,
  IconPin,
  IconPlate,
  IconStar,
  IconUsers,
  Polaroid,
  Sticker,
} from "@/components/ui";
import { PHOTOS } from "@/lib/media";
import { pageUrl } from "@/lib/site";

export function generateStaticParams() {
  return BASE_DATASET.gigs.map((gig) => ({ id: String(gig.id) }));
}

export async function generateMetadata({ params }: { params: Promise<{ id: string }> }): Promise<Metadata> {
  const { id } = await params;
  const gig = getGig(BASE_DATASET, Number.parseInt(id, 10));
  if (!gig) return { title: "Gig not on the board" };
  return {
    title: `${gig.gig.title} — ${gig.venue?.name ?? "a local room"}`,
    description: `${formatPay(gig.gig.payAmount, gig.gig.payUnit)} · ${gig.gig.city} · ${gig.gig.gigDate}. Apply with a one-sheet on GIGWIRE.`,
    alternates: { canonical: pageUrl(`/gigs/${gig.gig.id}`) },
    openGraph: {
      title: `${gig.gig.title} — ${gig.venue?.name ?? "a local room"}`,
      description: `${formatPay(gig.gig.payAmount, gig.gig.payUnit)} · ${gig.gig.city} · ${gig.gig.gigDate}`,
      url: pageUrl(`/gigs/${gig.gig.id}`),
    },
  };
}

export default async function GigPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const gigId = Number.parseInt(id, 10);
  const data = getGig(BASE_DATASET, gigId);
  if (!data) notFound();

  const { gig, venue, appCount } = data;
  const owner = venue ? getUser(BASE_DATASET, venue.ownerId) : null;
  const d = formatGigDate(gig.gigDate);

  const related = searchGigs(BASE_DATASET, { city: gig.city ?? undefined, sort: "date" }, 8)
    .filter((r) => r.gig.id !== gigId)
    .slice(0, 3);

  return (
    <div>
      <section className="relative border-b-[4px] border-ink bg-plum px-4 py-12 text-paper-2 md:px-8">
        <div aria-hidden className="absolute inset-0 halftone text-ink opacity-25" />
        <div className="relative mx-auto max-w-[1240px]">
          <Link
            href="/gigs"
            className="inline-flex items-center gap-2 font-mono text-[11px] font-bold uppercase tracking-[0.16em] text-butter underline underline-offset-4"
          >
            <IconArrow className="h-4 w-4 rotate-180" /> Back to the board
          </Link>
          <div className="mt-6 flex flex-wrap items-start gap-6">
            <DateBlock weekday={d.weekday} day={d.day} month={d.month} bg="bg-marigold" className="!w-[104px] !py-3" />
            <div className="min-w-0 flex-1">
              <h1 className="max-w-4xl text-[clamp(2rem,5.6vw,4.2rem)] uppercase leading-[0.86]">{gig.title}</h1>
              <div className="mt-4 flex flex-wrap items-center gap-x-5 gap-y-2 font-mono text-[11.5px] font-bold uppercase tracking-[0.14em] text-paper-3">
                <span className="flex items-center gap-1.5">
                  <IconPin className="h-4 w-4" /> {gig.address} · {gig.city}, {gig.state}
                </span>
                <span className="flex items-center gap-1.5">
                  <IconClock className="h-4 w-4" /> {timeRange(gig.startTime, gig.endTime)} · {gig.setsCount} sets
                </span>
                <span className="flex items-center gap-1.5">
                  <IconUsers className="h-4 w-4" /> {appCount} one-sheet{appCount === 1 ? "" : "s"} sent
                </span>
                <span className="border-2 border-butter px-2 py-0.5 text-butter">{relativeDay(gig.gigDate)}</span>
              </div>
            </div>
            <div className="hidden w-[220px] lg:block">
              <Polaroid src={venue?.coverUrl ?? PHOTOS.barNeon} rotate="3deg" caption={venue?.name ?? "The room"} />
            </div>
          </div>
        </div>
      </section>

      <div className="mx-auto grid max-w-[1240px] gap-8 px-4 py-12 md:px-8 lg:grid-cols-[1fr_380px]">
        <div>
          {gig.status === "closed" ? (
            <div className="mb-6 border-[3px] border-ink bg-paper-3 px-4 py-3 shadow-hard-sm">
              <p className="font-mono text-[12px] font-bold uppercase tracking-[0.1em]">
                This flyer has been taken down by the room. The rest of the board is still up.
              </p>
            </div>
          ) : null}

          <div className="paper-grain relative border-[3px] border-ink bg-paper-2 p-6 shadow-hard md:p-8">
            <Sticker bg="bg-butter" text="text-ink" className="!absolute -right-3 -top-5 hidden md:inline-flex">
              {gig.gigType === "residency"
                ? "Weekly gig"
                : gig.gigType === "sub"
                  ? "One-night sub"
                  : gig.gigType === "opener"
                    ? "Opening slot"
                    : "One-off night"}
            </Sticker>

            <div className="mt-2 flex flex-wrap items-center gap-2">
              {gig.genres.map((g: string) => (
                <Chip key={g} tone="tomato">
                  {g}
                </Chip>
              ))}
              {gig.lineupNeeded.map((l: string) => (
                <Chip key={l} tone="cobalt">
                  Need: {l}
                </Chip>
              ))}
              <Chip tone={gig.status === "open" ? "moss" : "ink"}>{gig.status}</Chip>
            </div>

            <div className="mt-6 grid gap-4 sm:grid-cols-2">
              <div className="border-[3px] border-ink bg-moss p-4 text-paper-2">
                <p className="font-mono text-[10px] font-bold uppercase tracking-[0.2em] opacity-80">The money</p>
                <p className="mt-1 font-display text-[40px] leading-none">{formatPay(gig.payAmount, gig.payUnit)}</p>
                <p className="mt-2 font-mono text-[11px] uppercase tracking-[0.1em] opacity-90">
                  {gig.spots > 1 ? `${gig.spots} players needed` : "1 player needed"} · paid on the night
                </p>
              </div>
              <div className="border-[3px] border-ink bg-butter p-4">
                <p className="font-mono text-[10px] font-bold uppercase tracking-[0.2em]">The night</p>
                <dl className="mt-2 space-y-1 font-mono text-[12px] uppercase tracking-[0.06em]">
                  <Row label="Start" value={gig.startTime ?? "TBA"} />
                  <Row label="Finish" value={gig.endTime ?? "TBA"} />
                  <Row label="Sets" value={`${gig.setsCount} × ~45 min`} />
                  <Row
                    label="Level"
                    value={
                      gig.experience === "pro"
                        ? "Working pros"
                        : gig.experience === "beginner_ok"
                          ? "Everyone welcome"
                          : "Any level"
                    }
                  />
                </dl>
              </div>
            </div>

            <div className="mt-4 grid gap-3 sm:grid-cols-4">
              {(
                [
                  [gig.backline, "Backline", <IconAmp key="a" className="h-5 w-5" />],
                  [gig.meals, "Meal", <IconPlate key="b" className="h-5 w-5" />],
                  [gig.tips, "Tip jar", <IconStar key="c" className="h-5 w-5" />],
                  [gig.soundEngineer, "Engineer", <IconMusic key="d" className="h-5 w-5" />],
                ] as [boolean, string, React.ReactNode][]
              ).map(([on, label, icon]) => (
                <div
                  key={label}
                  className={`flex items-center gap-2 border-[3px] border-ink px-3 py-2 ${
                    on ? "bg-sky" : "bg-paper-3 opacity-55"
                  }`}
                >
                  {icon}
                  <span className="font-mono text-[10px] font-bold uppercase tracking-[0.1em]">{label}</span>
                  <span className="ml-auto font-heavy text-[12px]">{on ? "YES" : "NO"}</span>
                </div>
              ))}
            </div>

            <div className="mt-8">
              <Eyebrow className="text-ink-soft">The room says</Eyebrow>
              <div className="mt-3 space-y-4 text-[17px] leading-relaxed">
                {(gig.description ?? "")
                  .split("\n")
                  .filter(Boolean)
                  .map((p: string, i: number) => (
                    <p key={i}>{p}</p>
                  ))}
              </div>
            </div>

            {gig.requirements ? (
              <div className="ruled mt-8 border-[3px] border-dashed border-ink p-5">
                <p className="font-heavy text-[13px] uppercase tracking-[0.06em] text-tomato">Non-negotiables</p>
                <p className="mt-2 text-[16px] leading-relaxed">{gig.requirements}</p>
              </div>
            ) : null}

            {gig.payNote ? (
              <p className="mt-6 border-l-[6px] border-marigold pl-4 font-serif text-[18px] italic">{gig.payNote}</p>
            ) : null}
          </div>

          {venue ? (
            <div className="mt-8 grid gap-5 border-[3px] border-ink bg-paper-2 p-5 shadow-hard sm:grid-cols-[190px_1fr]">
              <div className="border-[3px] border-ink">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={venue.coverUrl ?? PHOTOS.barRed}
                  alt=""
                  loading="lazy"
                  className="h-full min-h-[150px] w-full object-cover"
                />
              </div>
              <div>
                <Eyebrow className="text-ink-soft">The room</Eyebrow>
                <h2 className="mt-2 text-[clamp(1.6rem,3.4vw,2.4rem)] uppercase">{venue.name}</h2>
                <p className="font-serif text-[17px] italic text-ink-soft">{venue.tagline}</p>
                <p className="mt-3 text-[15px] leading-relaxed text-ink-soft">{venue.description}</p>
                <div className="mt-4 flex flex-wrap gap-2">
                  <Chip tone="ink">Capacity {venue.capacity}</Chip>
                  <Chip tone="ink">{venue.address}</Chip>
                  {venue.genres.map((g: string) => (
                    <Chip key={g}>{g}</Chip>
                  ))}
                  {owner ? (
                    <Chip tone="cobalt">
                      Booked by {owner.name}
                      {owner.links ? ` · ${owner.links}` : ""}
                    </Chip>
                  ) : null}
                </div>
              </div>
            </div>
          ) : null}
        </div>

        <aside className="space-y-5 lg:sticky lg:top-24 lg:self-start">
          <ApplyRail
            gigId={gig.id}
            venueName={venue?.name ?? "the room"}
            ownerId={venue?.ownerId ?? null}
            status={gig.status}
            appCount={appCount}
          />
        </aside>
      </div>

      {related.length ? (
        <section className="border-t-[4px] border-ink bg-paper-3/60 px-4 py-14 md:px-8">
          <div className="mx-auto max-w-[1240px]">
            <div className="flex flex-wrap items-end justify-between gap-4">
              <h2 className="text-[clamp(1.8rem,4vw,3rem)] uppercase">Other nights in {gig.city}</h2>
              <Link href={`/gigs?city=${encodeURIComponent(gig.city ?? "")}`} className="btn btn-ghost">
                All {gig.city} gigs <IconArrow className="h-4 w-4" />
              </Link>
            </div>
            <div className="mt-8 grid gap-6 md:grid-cols-3">
              {related.map((row) => (
                <GigCard key={row.gig.id} row={row} />
              ))}
            </div>
          </div>
        </section>
      ) : null}

      <OwnerApplications gigId={gig.id} ownerId={venue?.ownerId ?? null} />
    </div>
  );
}

function Row({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex items-baseline justify-between gap-3 border-b border-dashed border-ink/30 pb-1">
      <dt className="opacity-70">{label}</dt>
      <dd className="font-bold">{value}</dd>
    </div>
  );
}
