import Link from "next/link";
import { getCurrentUser } from "@/lib/auth";
import { getApplicationsForVenue, getVenueByOwner, getVenueGigs, getVenueStats } from "@/lib/data";
import { formatGigDate, formatPay, relativeDay } from "@/lib/format";
import { StatusFlag } from "@/components/GigCard";
import {
  Chip,
  DateBlock,
  Eyebrow,
  IconArrow,
  IconBolt,
  IconCheck,
  IconMusic,
  IconUsers,
  Sticker,
} from "@/components/ui";
import { PHOTOS } from "@/lib/media";

export const dynamic = "force-dynamic";

export default async function DashboardPage({
  searchParams,
}: {
  searchParams: Promise<{ posted?: string; error?: string }>;
}) {
  const sp = await searchParams;
  const user = await getCurrentUser();
  if (!user) {
    return (
      <Gate
        title="Rooms log in here"
        body="Your nights, your applicant pile and one-click ‘mark filled’ all live behind this door."
      />
    );
  }
  if (user.role !== "venue") {
    return (
      <Gate
        title="You're signed in as a player"
        body="This desk is for rooms. Post a vacancy by making a room account — or stay on the board and keep applying."
        href="/gigs"
        hrefLabel="Back to the gig board"
        altHref="/signup?role=venue"
        altLabel="Make a room account"
      />
    );
  }

  const venue = await getVenueByOwner(user.id);
  if (!venue) {
    return (
      <Gate
        title="Claim your room"
        body="Add the venue name, address and capacity, then every flyer you post is on the wire."
        href="/post"
        hrefLabel="Create room profile with first flyer"
      />
    );
  }

  const [stats, venueGigs, apps] = await Promise.all([
    getVenueStats(venue.id),
    getVenueGigs(venue.id),
    getApplicationsForVenue(venue.id),
  ]);

  const byGig = new Map<number, typeof apps>();
  for (const a of apps) {
    const list = byGig.get(a.gig?.id ?? 0) ?? [];
    list.push(a);
    byGig.set(a.gig?.id ?? 0, list);
  }

  return (
    <div>
      <section className="relative overflow-hidden border-b-[4px] border-ink bg-ink px-4 py-10 text-paper-2 md:px-8">
        <div aria-hidden className="absolute inset-0 halftone text-paper-2 opacity-[0.14]" />
        <div className="relative mx-auto max-w-[1240px]">
          <Eyebrow className="!text-marigold">Booker&apos;s desk</Eyebrow>
          <div className="mt-3 flex flex-wrap items-end justify-between gap-6">
            <h1 className="text-[clamp(2.2rem,6vw,4.4rem)] uppercase leading-[0.85]">{venue.name}</h1>
            <div className="flex flex-wrap gap-3">
              <Link href="/post" className="btn btn-marigold">
                <IconBolt className="h-4 w-4" /> Post a night
              </Link>
              <Link
                href="/profile"
                className="btn border-paper-2 text-paper-2 hover:bg-paper-2 hover:!text-ink"
              >
                Room profile
              </Link>
            </div>
          </div>
          <p className="mt-2 max-w-xl font-serif text-[19px] italic text-paper-3">{venue.tagline}</p>
          <div className="mt-8 grid gap-3 sm:grid-cols-4">
            {[
              [stats.live, "nights live"],
              [stats.apps, "one-sheets in"],
              [stats.booked, "players booked"],
              [stats.filled, "slots filled"],
            ].map(([n, label]) => (
              <div key={String(label)} className="border-[3px] border-paper-2 bg-plum px-4 py-3">
                <p className="font-display text-[34px] leading-none text-butter">{n as number}</p>
                <p className="mt-1 font-mono text-[10px] uppercase tracking-[0.16em] text-paper-3">{label as string}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {sp.posted ? (
        <div className="mx-auto mt-8 max-w-[1240px] px-4 md:px-8">
          <p className="flex items-center gap-2 border-[3px] border-ink bg-moss px-4 py-3 font-mono text-[11px] font-bold uppercase tracking-[0.1em] text-paper-2">
            <IconCheck className="h-4 w-4" /> Flyer posted — gig #{sp.posted} is on the board.
          </p>
        </div>
      ) : null}

      <div className="mx-auto grid max-w-[1240px] gap-8 px-4 py-12 md:px-8 lg:grid-cols-[1.15fr_0.85fr]">
        {/* ---- your nights ---- */}
        <div>
          <h2 className="text-[clamp(1.6rem,3.6vw,2.4rem)] uppercase">Your nights</h2>
          <div className="mt-5 space-y-5">
            {venueGigs.length === 0 ? (
              <div className="card p-8 text-center">
                <IconMusic className="mx-auto h-7 w-7 text-tomato" />
                <p className="mt-3 font-heavy text-[17px] uppercase">Nothing posted yet</p>
                <p className="mt-2 text-[15px] text-ink-soft">
                  Write the first flyer — date, money, who&apos;s missing. It takes about ninety seconds.
                </p>
                <Link href="/post" className="btn btn-tomato mt-5">
                  Post a night <IconArrow className="h-4 w-4" />
                </Link>
              </div>
            ) : null}

            {venueGigs.map(({ gig }) => {
              const d = formatGigDate(gig.gigDate);
              const pile = byGig.get(gig.id) ?? [];
              return (
                <article key={gig.id} className="paper-grain border-[3px] border-ink bg-paper-2 shadow-hard">
                  <div className="flex items-start gap-4 border-b-[3px] border-ink bg-paper-3/70 p-4">
                    <DateBlock weekday={d.weekday} day={d.day} month={d.month} />
                    <div className="min-w-0 flex-1">
                      <div className="flex flex-wrap items-center gap-2">
                        <StatusFlag status={gig.status} />
                        <span className="chip bg-sky">{relativeDay(gig.gigDate)}</span>
                        <span className="chip">{pile.length} in the pile</span>
                      </div>
                      <h3 className="mt-2 font-heavy text-[18px] leading-tight">
                        <Link href={`/gigs/${gig.id}`} className="underline decoration-tomato decoration-[3px] underline-offset-4">
                          {gig.title}
                        </Link>
                      </h3>
                      <p className="mt-1 font-mono text-[11px] uppercase tracking-[0.1em] text-ink-soft">
                        {formatPay(gig.payAmount, gig.payUnit)} · {gig.setsCount} sets · {gig.city}
                      </p>
                    </div>
                  </div>
                  <div className="flex flex-wrap items-center gap-2 p-4">
                    {(["open", "interviewing", "filled"] as const).map((s) => (
                      <form key={s} action={`/api/gigs/${gig.id}/status`} method="post">
                        <input type="hidden" name="status" value={s} />
                        <input type="hidden" name="next" value="/dashboard" />
                        <button
                          className={`border-[3px] border-ink px-3 py-1.5 font-mono text-[10px] font-bold uppercase tracking-[0.12em] transition ${
                            gig.status === s ? "bg-ink text-paper-2" : "bg-paper-2 hover:bg-butter"
                          }`}
                        >
                          {gig.status === s ? "✓ " : ""}
                          {s}
                        </button>
                      </form>
                    ))}
                    <Link href={`/gigs/${gig.id}`} className="ml-auto font-mono text-[10px] font-bold uppercase tracking-[0.12em] underline">
                      Open flyer
                    </Link>
                  </div>
                </article>
              );
            })}
          </div>
        </div>

        {/* ---- inbox ---- */}
        <div>
          <div className="flex items-center justify-between gap-3">
            <h2 className="text-[clamp(1.6rem,3.6vw,2.4rem)] uppercase">The pile</h2>
            <Sticker bg="bg-bubblegum" rotate="3deg">
              {apps.length} total
            </Sticker>
          </div>

          <div className="mt-5 space-y-6">
            {apps.length === 0 ? (
              <div className="card p-6">
                <p className="font-heavy text-[15px] uppercase">Quiet inbox</p>
                <p className="mt-2 text-[15px] text-ink-soft">
                  Players tend to answer within a day when the flyer states the money. Add a date and a number and
                  watch it fill.
                </p>
              </div>
            ) : null}

            {[...byGig.entries()].map(([gigId, list]) => (
              <div key={gigId} className="border-[3px] border-ink bg-paper-2">
                <p className="border-b-[3px] border-ink bg-butter px-4 py-2 font-heavy text-[12px] uppercase tracking-[0.06em]">
                  {list[0]?.gig?.title ?? "Gig"} · {list.length} reply
                  {list.length === 1 ? "" : "ies"}
                </p>
                <ul className="divide-y-[3px] divide-dashed divide-ink/25">
                  {list.map((a) => (
                    <li key={a.application.id} className="p-4">
                      <div className="flex items-start justify-between gap-3">
                        <div className="min-w-0">
                          <p className="font-heavy text-[15px] uppercase">{a.musician?.name ?? "A player"}</p>
                          <p className="font-mono text-[10.5px] uppercase tracking-[0.1em] text-ink-soft">
                            {a.musician?.headline ?? "—"}
                          </p>
                        </div>
                        <span className="chip shrink-0">{a.application.status}</span>
                      </div>
                      <p className="mt-2.5 text-[14.5px] leading-snug text-ink-soft">{a.application.pitch}</p>
                      <div className="mt-2 flex flex-wrap gap-2">
                        {a.application.lineup ? <Chip tone="cobalt">{a.application.lineup}</Chip> : null}
                        {a.application.links ? <Chip tone="ink">{a.application.links}</Chip> : null}
                        {a.musician?.city ? (
                          <Chip>
                            <IconUsers className="h-3 w-3" /> {a.musician.city}
                          </Chip>
                        ) : null}
                      </div>
                      <div className="mt-3 flex flex-wrap gap-2">
                        {(
                          [
                            ["accepted", "Book them", "bg-moss text-paper-2"],
                            ["viewed", "Mark read", "bg-sky"],
                            ["declined", "Pass", "bg-paper-3"],
                          ] as const
                        ).map(([status, label, tone]) => (
                          <form key={status} action={`/api/applications/${a.application.id}`} method="post">
                            <input type="hidden" name="status" value={status} />
                            <input type="hidden" name="next" value="/dashboard" />
                            <button
                              className={`border-[3px] border-ink px-3 py-1.5 font-mono text-[10px] font-bold uppercase tracking-[0.12em] transition hover:shadow-hard-sm ${tone}`}
                            >
                              {label}
                            </button>
                          </form>
                        ))}
                      </div>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>

          <div className="mt-6 overflow-hidden border-[3px] border-ink">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src={venue.coverUrl ?? PHOTOS.barRed} alt="" className="h-32 w-full object-cover" loading="lazy" />
            <div className="bg-ink p-3 text-paper-2">
              <p className="font-mono text-[10px] uppercase tracking-[0.16em] text-marigold">{venue.name}</p>
              <p className="mt-1 text-[14px] leading-snug">
                {venue.address}, {venue.city} · cap {venue.capacity} ·{" "}
                <Link href="/profile" className="underline">
                  edit room profile
                </Link>
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

function Gate({
  title,
  body,
  href = "/login?next=%2Fdashboard",
  hrefLabel = "Log in as a room",
  altHref = "/signup?role=venue",
  altLabel = "Make a room account",
}: {
  title: string;
  body: string;
  href?: string;
  hrefLabel?: string;
  altHref?: string;
  altLabel?: string;
}) {
  return (
    <div className="mx-auto max-w-[760px] px-4 py-24 md:px-8">
      <div className="paper-grain relative border-[3px] border-ink bg-paper-2 p-8 text-center shadow-hard-lg">
        <span aria-hidden className="tape -top-4 left-1/2 -translate-x-1/2 -rotate-2" />
        <h1 className="text-[clamp(2rem,5.5vw,3.4rem)] uppercase leading-[0.86]">{title}</h1>
        <p className="mx-auto mt-4 max-w-md text-[16px] leading-relaxed text-ink-soft">{body}</p>
        <div className="mt-7 flex flex-wrap justify-center gap-3">
          <Link href={href} className="btn btn-tomato">
            {hrefLabel}
          </Link>
          <Link href={altHref} className="btn btn-ghost">
            {altLabel}
          </Link>
        </div>
      </div>
    </div>
  );
}
