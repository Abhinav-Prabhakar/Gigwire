import Link from "next/link";
import { notFound, redirect } from "next/navigation";
import { db } from "@/db";
import { applications, users } from "@/db/schema";
import { and, eq } from "drizzle-orm";
import { getApplicationsForGig, getGig, getSavedGigIds, searchGigs } from "@/lib/data";
import { getCurrentUser } from "@/lib/auth";
import { formatGigDate, formatPay, relativeDay, timeRange } from "@/lib/format";
import { GigCard, SaveGigForm } from "@/components/GigCard";
import {
  Chip,
  DateBlock,
  Eyebrow,
  IconAmp,
  IconArrow,
  IconBolt,
  IconCheck,
  IconClock,
  IconMusic,
  IconPin,
  IconPlate,
  IconStar,
  IconUsers,
  Polaroid,
  Stamp,
  Sticker,
} from "@/components/ui";
import { PHOTOS } from "@/lib/media";

export const dynamic = "force-dynamic";

export async function generateMetadata({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const gig = await getGig(Number.parseInt(id, 10));
  if (!gig) return { title: "Gig not on the board" };
  return {
    title: `${gig.gig.title} — ${gig.venue?.name ?? "a local room"}`,
    description: `${formatPay(gig.gig.payAmount, gig.gig.payUnit)} · ${gig.gig.city} · ${gig.gig.gigDate}`,
  };
}

export default async function GigPage({
  params,
  searchParams,
}: {
  params: Promise<{ id: string }>;
  searchParams: Promise<Record<string, string | string[] | undefined>>;
}) {
  const { id } = await params;
  const sp = await searchParams;
  const gigId = Number.parseInt(id, 10);
  const data = await getGig(gigId);
  if (!data) notFound();

  const { gig, venue, appCount } = data;
  const owner = venue
    ? (await db.select().from(users).where(eq(users.id, venue.ownerId)).limit(1))[0] ?? null
    : null;
  const user = await getCurrentUser();
  const d = formatGigDate(gig.gigDate);

  const [myApp, savedIds, related] = await Promise.all([
    user
      ? db
          .select()
          .from(applications)
          .where(and(eq(applications.gigId, gigId), eq(applications.musicianId, user.id)))
          .limit(1)
          .then((r) => r[0] ?? null)
      : Promise.resolve(null),
    user ? getSavedGigIds(user.id) : Promise.resolve<number[]>([]),
    searchGigs({ city: gig.city ?? undefined, sort: "date" }, 8).then((rows) =>
      rows.filter((r) => r.gig.id !== gigId).slice(0, 3),
    ),
  ]);

  const isOwner = user?.role === "venue" && venue?.ownerId === user?.id;
  const saved = user ? savedIds.includes(gig.id) : false;
  const venueApps = isOwner ? await getApplicationsForGig(gig.id) : [];

  if (gig.status === "closed" && !isOwner) redirect("/gigs");

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
            <DateBlock
              weekday={d.weekday}
              day={d.day}
              month={d.month}
              bg="bg-marigold"
              className="!w-[104px] !py-3"
            />
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
        {/* ---------------- flyer ---------------- */}
        <div>
          {(sp.applied || sp.error || sp.saved) && (
            <div
              className={`mb-6 flex items-center gap-3 border-[3px] border-ink px-4 py-3 shadow-hard-sm ${
                sp.error ? "bg-tomato text-paper-2" : "bg-moss text-paper-2"
              }`}
            >
              <IconCheck className="h-5 w-5 shrink-0" />
              <p className="font-mono text-[12px] font-bold uppercase tracking-[0.1em]">
                {sp.error
                  ? String(sp.error)
                  : sp.saved
                    ? "Pinned to your board."
                    : "One-sheet sent. Watch your tracker."}
              </p>
            </div>
          )}

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
                <p className="mt-1 font-display text-[40px] leading-none">
                  {formatPay(gig.payAmount, gig.payUnit)}
                </p>
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
              <p className="mt-6 border-l-[6px] border-marigold pl-4 font-serif text-[18px] italic">
                {gig.payNote}
              </p>
            ) : null}
          </div>

          {/* venue panel */}
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

        {/* ---------------- apply rail ---------------- */}
        <aside className="space-y-5 lg:sticky lg:top-24 lg:self-start">
          <div className="paper-grain border-[3px] border-ink bg-paper-2 p-5 shadow-hard">
            <div className="flex items-start justify-between gap-3">
              <div>
                <p className="font-mono text-[10px] font-bold uppercase tracking-[0.2em] text-ink-soft">
                  Apply in 30 seconds
                </p>
                <p className="mt-1 font-display text-[30px] leading-none">Send your one-sheet</p>
              </div>
              <Stamp className="border-tomato text-tomato">{gig.status}</Stamp>
            </div>

            {gig.status === "filled" && !isOwner ? (
              <div className="mt-4 border-[3px] border-ink bg-paper-3 p-4">
                <p className="font-heavy text-[15px] uppercase">Somebody already has this night</p>
                <p className="mt-2 text-[15px] leading-snug">
                  The room marked it filled. Pin it anyway and we&apos;ll keep you posted if it opens back up.
                </p>
              </div>
            ) : isOwner ? (
              <div className="mt-4 space-y-3">
                <p className="text-[15px]">
                  You posted this night. Change its state below or read the {appCount} applications on the flyer.
                </p>
                {(["open", "interviewing", "filled", "closed"] as const).map((s) => (
                  <form
                    key={s}
                    action={`/api/gigs/${gig.id}/status`}
                    method="post"
                    className="flex items-center gap-3"
                  >
                    <input type="hidden" name="status" value={s} />
                    <input type="hidden" name="next" value="/dashboard" />
                    <button className={`btn w-full ${gig.status === s ? "btn-ink" : "btn-ghost"}`}>Mark {s}</button>
                  </form>
                ))}
                <Link href="/post" className="btn btn-tomato w-full">
                  Post another night
                </Link>
              </div>
            ) : myApp ? (
              <div className="mt-4 border-[3px] border-ink bg-sky p-4">
                <p className="font-heavy text-[15px] uppercase">Already in the pile</p>
                <p className="mt-2 text-[15px] leading-snug">
                  Sent {new Date(myApp.createdAt).toLocaleDateString("en-US", { month: "short", day: "numeric" })} ·
                  status <strong className="uppercase">{myApp.status}</strong>
                </p>
                <Link href="/profile" className="btn btn-ink mt-3 w-full">
                  Open my tracker <IconArrow className="h-4 w-4" />
                </Link>
              </div>
            ) : user ? (
              <form action={`/api/gigs/${gig.id}/apply`} method="post" className="mt-4 space-y-3">
                <input type="hidden" name="next" value={`/gigs/${gig.id}`} />
                <div className="flex items-center gap-2 border-2 border-ink bg-paper-3 px-2.5 py-1.5">
                  <span className="flex h-7 w-7 items-center justify-center border-2 border-ink bg-tomato font-heavy text-[11px] text-paper-2">
                    {user.name.slice(0, 2).toUpperCase()}
                  </span>
                  <span className="font-mono text-[11px] font-bold uppercase tracking-[0.1em]">{user.name}</span>
                </div>
                <div>
                  <label className="label" htmlFor="lineup">
                    Who&apos;s coming
                  </label>
                  <input
                    id="lineup"
                    name="lineup"
                    defaultValue={user.instruments.join(" / ") || "Solo act"}
                    className="field"
                  />
                </div>
                <div>
                  <label className="label" htmlFor="links">
                    Link they should click
                  </label>
                  <input
                    id="links"
                    name="links"
                    defaultValue={user.links ?? ""}
                    placeholder="bandcamp, live video, instagram"
                    className="field"
                  />
                </div>
                <div>
                  <label className="label" htmlFor="pitch">
                    Note to the booker
                  </label>
                  <textarea
                    id="pitch"
                    name="pitch"
                    rows={4}
                    defaultValue={user.headline ? `${user.headline}. ` : ""}
                    className="field resize-y"
                    placeholder="Set length you need, what you bring, when you can soundcheck."
                  />
                </div>
                <button className="btn btn-tomato w-full !py-3.5">
                  Send it to {venue?.name ?? "the room"} <IconBolt className="h-4 w-4" />
                </button>
                <p className="font-mono text-[10px] uppercase tracking-[0.1em] text-ink-soft">
                  No cover letters. Two sentences and a link beats a PDF.
                </p>
              </form>
            ) : (
              <div className="mt-4 space-y-3">
                <p className="text-[15px] leading-snug">
                  Log in as a player to apply, save this night, and track replies in one place.
                </p>
                <Link
                  href={`/signup?role=musician&next=${encodeURIComponent(`/gigs/${gig.id}`)}`}
                  className="btn btn-tomato w-full"
                >
                  Free player account
                </Link>
                <Link
                  href={`/login?next=${encodeURIComponent(`/gigs/${gig.id}`)}`}
                  className="btn btn-ghost w-full"
                >
                  I already have one
                </Link>
              </div>
            )}
          </div>

          <div className="flex items-center justify-between gap-3 border-[3px] border-ink bg-paper-3 p-3">
            <p className="font-mono text-[11px] font-bold uppercase tracking-[0.12em]">
              {saved ? "Pinned to your board" : "Not tonight? Pin it"}
            </p>
            <SaveGigForm gigId={gig.id} saved={saved} next={`/gigs/${gig.id}`} />
          </div>

          <div className="border-[3px] border-ink bg-ink p-5 text-paper-2">
            <p className="font-mono text-[10px] font-bold uppercase tracking-[0.2em] text-marigold">
              The GIGwire pledge
            </p>
            <ul className="mt-3 space-y-2.5 text-[14.5px] leading-snug">
              {[
                "The pay number on the flyer is the pay number.",
                "Rooms must reply — unanswered slots expire after 14 days.",
                "Zero commission. Cancelled inside 48 hours means half the money.",
              ].map((line) => (
                <li key={line} className="flex gap-2">
                  <IconCheck className="mt-0.5 h-4 w-4 shrink-0 text-butter" />
                  <span>{line}</span>
                </li>
              ))}
            </ul>
          </div>
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
                <GigCard key={row.gig.id} row={row} saved={user ? savedIds.includes(row.gig.id) : false} />
              ))}
            </div>
          </div>
        </section>
      ) : null}

      {venueApps.length ? (
        <section className="border-t-[4px] border-ink bg-ink px-4 py-14 text-paper-2 md:px-8">
          <div className="mx-auto max-w-[1240px]">
            <h2 className="text-[clamp(1.8rem,4vw,2.8rem)] uppercase">
              {venueApps.length} one-sheet{venueApps.length === 1 ? "" : "s"} for this night
            </h2>
            <div className="mt-8 grid gap-5 md:grid-cols-2">
              {venueApps.map((a) => (
                <div key={a.application.id} className="paper-grain border-[3px] border-paper-2 bg-ink p-5">
                  <div className="flex items-start justify-between gap-3">
                    <div>
                      <p className="font-heavy text-[17px] uppercase">{a.musician?.name}</p>
                      <p className="font-mono text-[11px] uppercase tracking-[0.1em] text-marigold">
                        {a.musician?.headline ?? "Player"} · {a.musician?.city ?? "—"}
                      </p>
                    </div>
                    <span className="border-2 border-paper-2 px-2 py-0.5 font-mono text-[10px] uppercase">
                      {a.application.status}
                    </span>
                  </div>
                  <p className="mt-3 text-[15px] leading-snug text-paper-3">{a.application.pitch}</p>
                  <p className="mt-2 font-mono text-[11px] uppercase tracking-[0.1em]">
                    {a.application.lineup}
                    {a.application.links ? ` · ${a.application.links}` : ""}
                  </p>
                  <div className="mt-4 flex flex-wrap gap-2">
                    {(["accepted", "viewed", "declined"] as const).map((s) => (
                      <form key={s} action={`/api/applications/${a.application.id}`} method="post">
                        <input type="hidden" name="status" value={s} />
                        <input type="hidden" name="next" value={`/gigs/${gig.id}`} />
                        <button
                          className={`border-2 border-paper-2 px-3 py-1 font-mono text-[10px] font-bold uppercase tracking-[0.12em] transition hover:bg-marigold hover:text-ink ${
                            a.application.status === s ? "bg-paper-2 text-ink" : "text-paper-2"
                          }`}
                        >
                          {s === "accepted" ? "Book them" : s === "viewed" ? "Mark read" : "Pass"}
                        </button>
                      </form>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>
      ) : null}
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
