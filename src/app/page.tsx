import Link from "next/link";
import {
  BASE_DATASET,
  countGigs,
  getFeaturedGigs,
  getRecentVenues,
  getSpotlight,
  getStats,
} from "@/lib/demo/data";
import { GENRES, formatPay, formatPayShort, formatGigDate, relativeDay } from "@/lib/format";
import { GigCard } from "@/components/GigCard";
import { PHOTOS } from "@/lib/media";
import {
  Asterisk,
  Chip,
  Eyebrow,
  IconArrow,
  IconBolt,
  IconMusic,
  IconPin,
  IconStar,
  Marquee,
  Polaroid,
  SectionHeading,
  Squiggle,
  Stamp,
  Sticker,
} from "@/components/ui";

export default async function Home() {
  const [featured, stats, openCount, venues, spotlight] = await Promise.all([
    getFeaturedGigs(BASE_DATASET, 3),
    getStats(BASE_DATASET),
    countGigs(BASE_DATASET, { status: "open" }),
    getRecentVenues(BASE_DATASET, 6),
    getSpotlight(BASE_DATASET),
  ]);
  const star = spotlight[0];

  return (
    <div className="overflow-hidden">
      {/* ---------------- HERO COLLAGE ---------------- */}
      <section className="relative border-b-[4px] border-ink bg-paper-2">
        <div aria-hidden className="absolute inset-0 grid-lines opacity-70" />
        <div
          aria-hidden
          className="absolute -right-24 -top-24 h-[420px] w-[420px] rounded-full bg-marigold/70 halftone text-ink"
        />
        <div
          aria-hidden
          className="absolute -left-28 top-40 hidden h-[280px] w-[280px] rotate-12 rounded-full bg-sky/80 halftone-lg text-cobalt sm:block"
        />

        <div className="relative mx-auto grid max-w-[1240px] gap-12 px-4 pb-16 pt-12 md:px-8 lg:grid-cols-[1.15fr_0.85fr] lg:pb-24 lg:pt-20">
          <div>
            <div className="flex flex-wrap items-center gap-3">
              <Stamp className="border-ink text-ink">Est. tonight · 6 cities</Stamp>
              <span className="chip bg-tomato !text-paper-2">Live board · {openCount} open slots</span>
            </div>

            <h1 className="mt-6 text-[clamp(3.2rem,11vw,8.4rem)] uppercase leading-[0.82] tracking-[-0.02em]">
              <span className="block">Somebody&apos;s</span>
              <span className="relative inline-block">
                <span className="relative z-10">bar needs</span>
                <span aria-hidden className="absolute inset-x-0 bottom-[0.14em] z-0 h-[0.22em] bg-marigold" />
              </span>
              <span className="block text-tomato">a band</span>
              <span className="mt-1 flex flex-wrap items-end gap-4">
                <span className="stroke-text">tonight</span>
                <span className="font-serif text-[0.4em] italic tracking-normal text-ink-soft">.go find it</span>
              </span>
            </h1>

            <p className="mt-8 max-w-xl text-[19px] leading-relaxed text-ink-soft">
              <strong className="font-bold text-ink">GIGWIRE</strong> is a pinboard for live music. Rooms post the
              night they can&apos;t fill — date, money, backline, curfew. Players apply with a one-sheet instead of a
              résumé. Nobody takes a cut, and nothing says &ldquo;we&apos;ll be in touch&rdquo;.
            </p>

            <div className="mt-8 flex flex-wrap items-center gap-3">
              <Link href="/gigs" className="btn btn-ink !px-7 !py-4 !text-[15px]">
                <IconMusic className="h-5 w-5" /> Search {stats.openGigs} gigs
              </Link>
              <Link href="/post" className="btn btn-tomato !px-7 !py-4 !text-[15px]">
                Post a vacancy <IconArrow className="h-5 w-5" />
              </Link>
            </div>

            <div className="mt-10 grid max-w-xl grid-cols-2 gap-x-6 gap-y-4 md:grid-cols-4 md:max-w-none">
              {[
                ["₹0", "commission, ever"],
                [`${stats.venues}`, "rooms on the board"],
                [`${stats.musicians}`, "players one-sheeted"],
                [formatPayShort(stats.paid), "on the board this week"],
              ].map(([big, small]) => (
                <div key={small} className="flex items-baseline gap-2">
                  <span className="font-display text-[30px] leading-none">{big}</span>
                  <span className="max-w-[104px] font-mono text-[10px] font-bold uppercase leading-tight tracking-[0.1em] text-ink-soft">
                    {small}
                  </span>
                </div>
              ))}
            </div>
          </div>

          {/* stacked cut-out photos */}
          <div className="relative min-h-[430px] lg:min-h-[560px]">
            <div className="absolute right-0 top-0 z-20 w-[62%] max-w-[330px] rotate-[5deg]">
              <Polaroid src={PHOTOS.jazzBand} rotate="0deg" caption="The Rusty Nail, Fri, 3 sets, sold out by 10" />
            </div>
            <div className="absolute left-0 top-[27%] z-10 w-[54%] max-w-[280px] rotate-[-7deg]">
              <Polaroid
                src={PHOTOS.duoVocal}
                rotate="0deg"
                tone="bg-butter"
                caption="duo booked 48 hrs before doors"
              />
            </div>
            <div className="absolute bottom-0 right-[6%] z-30 w-[46%] max-w-[250px] rotate-[8deg]">
              <Polaroid src={PHOTOS.sax} rotate="0deg" tone="bg-sky" caption="sax for Sunday brunch — ₹6,000 flat" />
            </div>

            <div className="absolute left-[6%] top-[6%] z-40">
              <Sticker bg="bg-ink" text="text-marigold" rotate="-8deg">
                No agents
              </Sticker>
            </div>
            <div className="absolute bottom-[16%] left-[2%] z-40">
              <Sticker bg="bg-bubblegum" text="text-paper-2" rotate="4deg">
                Paid on the night
              </Sticker>
            </div>
            <div className="absolute right-[38%] top-[46%] z-40 hidden lg:block">
              <div className="spin-slow h-24 w-24 rounded-full border-[3px] border-ink bg-moss text-paper-2">
                <div className="flex h-full w-full flex-col items-center justify-center text-center font-mono text-[9px] font-bold uppercase leading-tight tracking-[0.1em]">
                  <Asterisk className="mb-1 h-4 w-4" />
                  gig
                  <br />
                  wire
                  <br />
                  pledge
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="relative border-t-[4px] border-ink bg-tomato py-2.5 text-paper-2">
          <Marquee
            items={GENRES.map((g) => (
              <Link
                key={g}
                href={`/gigs?genre=${encodeURIComponent(g)}`}
                className="font-display text-[22px] uppercase leading-none transition hover:text-butter hover:underline"
                title={`Search ${g} gigs`}
              >
                {g}
              </Link>
            ))}
          />
        </div>
      </section>

      {/* ---------------- TWO SIDES ---------------- */}
      <section id="how" className="relative py-20">
        <div className="mx-auto max-w-[1240px] px-4 md:px-8">
          <SectionHeading
            kicker="How the board works"
            title={
              <>
                Two sides of
                <br />
                the same pinboard
              </>
            }
            intro="One posting, two ways in. Rooms write the flyer, players pin their one-sheet to it, and the money is agreed before anybody loads in."
          />

          <div className="mt-12 grid gap-6 lg:grid-cols-2">
            {[
              {
                title: "If you play",
                tone: "bg-sky",
                accent: "text-cobalt",
                steps: [
                  "Filter by city, date, pay floor and what the room actually needs — horns, a pianist, a sub for one night.",
                  "Apply with a 30-second one-sheet: who&apos;s in the band, links, what you need from them.",
                  "Rooms reply in a status you can see — sent, viewed, booked. Silence is not an option on this board.",
                  "Get paid on the night. Every posting states the number before you say yes.",
                ],
                cta: ["/gigs", "Search the board"],
              },
              {
                title: "If you have a room",
                tone: "bg-butter",
                accent: "text-tomato",
                steps: [
                  "Post the night: date, set lengths, pay, backline, curfew, and exactly who&apos;s missing.",
                  "Get applications from players who already fit your genre and lineup — not a inbox of demos.",
                  "Accept, hold or close the slot. Mark it filled and it leaves the board in one click.",
                  "No commission, no booking fee, no percentage of your door. Ever.",
                ],
                cta: ["/post", "Write a vacancy"],
              },
            ].map((col, i) => (
              <div
                key={col.title}
                className={`paper-grain relative border-[3px] border-ink ${col.tone} p-7 shadow-hard-lg ${
                  i === 1 ? "lg:translate-y-8" : ""
                }`}
              >
                <span aria-hidden className="tape -top-4 left-10 -rotate-2" />
                <div className="flex items-center justify-between gap-4">
                  <h3 className={`text-[clamp(2rem,4.6vw,3rem)] uppercase ${col.accent}`}>{col.title}</h3>
                  <Stamp className={col.accent}>0{i + 1}</Stamp>
                </div>
                <ol className="mt-6 space-y-4">
                  {col.steps.map((s, idx) => (
                    <li key={idx} className="flex gap-4 border-b-2 border-dashed border-ink/25 pb-4 last:border-0">
                      <span className="flex h-8 w-8 shrink-0 items-center justify-center border-[3px] border-ink bg-paper-2 font-heavy text-[13px]">
                        {idx + 1}
                      </span>
                      <p className="text-[15.5px] leading-snug" dangerouslySetInnerHTML={{ __html: s }} />
                    </li>
                  ))}
                </ol>
                <Link href={col.cta[0]} className="btn btn-ink mt-6">
                  {col.cta[1]} <IconArrow className="h-4 w-4" />
                </Link>
              </div>
            ))}
          </div>
        </div>
      </section>

      <div className="text-tomato">
        <Squiggle />
      </div>

      {/* ---------------- FEATURED ---------------- */}
      <section className="relative border-y-[4px] border-ink bg-cobalt py-20 text-paper-2">
        <div aria-hidden className="absolute inset-0 halftone text-ink/40 opacity-40" />
        <div className="relative mx-auto max-w-[1240px] px-4 md:px-8">
          <div className="flex flex-wrap items-end justify-between gap-6">
            <div>
              <Eyebrow className="mb-4 text-butter">Pinned to the front of the board</Eyebrow>
              <h2 className="text-[clamp(2.4rem,6vw,4.4rem)] uppercase leading-[0.85]">
                Rooms paying real
                <br />
                money right now
              </h2>
            </div>
            <Link href="/gigs" className="btn btn-marigold">
              All {openCount} open gigs <IconArrow className="h-4 w-4" />
            </Link>
          </div>

          <div className="mt-12 grid gap-7 md:grid-cols-3">
            {featured.map((row, i) => (
              <div key={row.gig.id} style={{ transform: `rotate(${[-1.6, 1.1, -0.6][i] ?? 0}deg)` }}>
                <GigCard row={row} teaser />
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ---------------- SPOTLIGHT ---------------- */}
      <section className="relative overflow-hidden py-24">
        <div className="mx-auto grid max-w-[1240px] items-center gap-12 px-4 md:px-8 lg:grid-cols-[0.9fr_1.1fr]">
          <div className="relative min-h-[420px]">
            <div className="absolute left-0 top-0 w-[74%] rotate-[-4deg]">
              <Polaroid src={PHOTOS.crowdGuitar} rotate="0deg" caption="“I got the Tuesday residency off a flyer.”" />
            </div>
            <div className="absolute bottom-2 right-0 w-[46%] rotate-[7deg]">
              <Polaroid src={PHOTOS.streetBand} rotate="0deg" tone="bg-butter" />
            </div>
            <Sticker bg="bg-moss" text="text-paper-2" rotate="-12deg" className="!absolute -bottom-3 left-[38%]">
              Real player
            </Sticker>
          </div>

          <div>
            <Eyebrow className="text-ink-soft">Artist spotlight</Eyebrow>
            <h2 className="mt-4 text-[clamp(2.2rem,5.6vw,4rem)] uppercase leading-[0.86]">
              {star?.musician.headline ?? "Six gigs, three weeks, one very loud horn section"}
            </h2>
            <blockquote className="mt-7 border-l-[6px] border-tomato pl-6">
              <p className="font-serif text-[clamp(1.3rem,2.6vw,1.85rem)] italic leading-snug">
                &ldquo;I used to email forty rooms a month and hear back from two. Now I check the board on Monday,
                send six one-sheets, and by Thursday the fridge has food in it.&rdquo;
              </p>
              <footer className="mt-4 flex flex-wrap items-center gap-3">
                <span className="font-heavy text-[14px] uppercase tracking-[0.06em]">
                  {star?.musician.name ?? "Ira Sen"}
                </span>
                <Chip tone="cobalt">{star?.musician.city ?? "Mumbai"} · {star?.musician.state ?? "MH"}</Chip>
                <span className="font-mono text-[11px] uppercase tracking-[0.14em] text-moss">
                  {star?.booked ?? 6} gigs booked via the wire
                </span>
              </footer>
            </blockquote>

            <div className="mt-9 grid gap-4 sm:grid-cols-3">
              {[
                ["Mon", "Board check. Filter: horns, 30km, ₹10,000 floor."],
                ["Wed", "One-sheets out. Two rooms reply same day."],
                ["Fri", "Doors 9. Paid before load-out."],
              ].map(([day, txt]) => (
                <div key={day} className="card ruled p-4">
                  <p className="font-mono text-[10px] font-bold uppercase tracking-[0.2em] text-cobalt">{day}</p>
                  <p className="mt-2 text-[14px] font-medium leading-snug">{txt}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ---------------- ROOMS ---------------- */}
      <section className="relative border-y-[4px] border-ink bg-ink py-20 text-paper-2">
        <div className="mx-auto max-w-[1240px] px-4 md:px-8">
          <div className="flex flex-wrap items-end justify-between gap-6 text-paper-2">
            <div>
              <Eyebrow className="mb-4 !text-marigold">Rooms with a stage-shaped hole</Eyebrow>
              <h2 className="text-[clamp(2.2rem,5.4vw,3.8rem)] uppercase leading-[0.86]">The venues</h2>
            </div>
            <Link href="/rooms" className="btn border-paper-2 text-paper-2 hover:bg-marigold hover:text-ink">
              Browse all rooms <IconArrow className="h-4 w-4" />
            </Link>
          </div>

          <div className="mt-12 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {venues.map((v, i) => (
              <Link
                key={v.id}
                href={`/gigs?city=${encodeURIComponent(v.city ?? "")}`}
                className="paper-grain group relative block border-[3px] border-paper-2 bg-ink p-3 transition hover:bg-plum"
                style={{ transform: `rotate(${i % 2 ? 1.1 : -1.1}deg)` }}
              >
                <div className="overflow-hidden border-2 border-paper-2">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={v.coverUrl ?? PHOTOS.barNeon}
                    alt=""
                    loading="lazy"
                    className="h-40 w-full object-cover opacity-85 mix-blend-luminosity transition group-hover:opacity-100"
                  />
                </div>
                <div className="mt-3 flex items-start justify-between gap-3">
                  <div>
                    <h3 className="font-heavy text-[17px] uppercase leading-tight">{v.name}</h3>
                    <p className="mt-1 font-mono text-[10px] uppercase tracking-[0.14em] text-marigold">
                      <IconPin className="mr-1 inline h-3 w-3" />
                      {v.city}, {v.state} · cap {v.capacity}
                    </p>
                  </div>
                  <span className="font-mono text-[9px] uppercase tracking-[0.1em] text-paper-3">
                    {v.genres.slice(0, 2).join(" / ")}
                  </span>
                </div>
                <p className="mt-2 font-serif text-[16px] italic leading-snug text-paper-3">{v.tagline}</p>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* ---------------- POSTCARDS ---------------- */}
      <section className="relative py-20">
        <div className="mx-auto max-w-[1240px] px-4 md:px-8">
          <SectionHeading
            kicker="From the mailbag"
            title="Postcards from the load-out"
            className="max-w-2xl"
          />
          <div className="mt-12 grid gap-8 md:grid-cols-3">
            {[
              {
                quote:
                  "Posted a Tuesday vacancy at 4pm on a Monday. Four applications by dinner, a trio by Thursday, and I didn't speak to a single agent.",
                who: "Rohan Mehta",
                where: "The Kala Ghoda Room, Mumbai",
                tone: "bg-butter",
                rot: "-2.2deg",
                stars: 5,
              },
              {
                quote:
                  "I'm a sub. I don't want a career, I want next Friday. This is the only board where I can see the pay before I waste an evening on a phone call.",
                who: "Priya Raghavan",
                where: "Alto & tenor, Mumbai",
                tone: "bg-sky",
                rot: "1.6deg",
                stars: 5,
              },
              {
                quote:
                  "We had a curfew, a drunk door guy and no singer. Somebody on the wire had all three problems solved and a van.",
                who: "Sourav Chatterjee",
                where: "Banyan Courtyard, Kolkata",
                tone: "bg-bubblegum text-paper-2",
                rot: "-1.1deg",
                stars: 4,
              },
            ].map((c) => (
              <figure
                key={c.who}
                style={{ transform: `rotate(${c.rot})` }}
                className={`paper-grain relative border-[3px] border-ink ${c.tone} p-6 shadow-hard transition hover:rotate-0 hover:shadow-hard-lg`}
              >
                <span aria-hidden className="tape -top-3 right-8 rotate-6" />
                <div className="flex gap-0.5 text-tomato">
                  {Array.from({ length: c.stars }).map((_, i) => (
                    <IconStar key={i} className="h-4 w-4" />
                  ))}
                </div>
                <blockquote className="mt-4 font-serif text-[19px] leading-snug">“{c.quote}”</blockquote>
                <figcaption className="mt-5 flex items-end justify-between gap-3 border-t-2 border-dashed border-ink/40 pt-3">
                  <div>
                    <p className="font-heavy text-[13px] uppercase tracking-[0.04em]">{c.who}</p>
                    <p className="font-mono text-[10px] uppercase tracking-[0.12em] opacity-80">{c.where}</p>
                  </div>
                  <span className="flex h-11 w-11 items-center justify-center border-2 border-dashed border-ink/60 font-mono text-[8px] uppercase">
                    <IconBolt className="h-5 w-5" />
                  </span>
                </figcaption>
              </figure>
            ))}
          </div>
        </div>
      </section>

      {/* ---------------- CTA ---------------- */}
      <section className="relative px-4 pb-24 md:px-8">
        <div className="torn mx-auto max-w-[1180px] border-[4px] border-ink bg-moss px-6 py-16 text-center text-paper-2 shadow-hard-lg md:py-20">
          <p className="mx-auto max-w-2xl font-serif text-[clamp(1.6rem,4vw,2.6rem)] italic leading-tight">
            The room is booked or it isn&apos;t.
          </p>
          <h2 className="mt-4 text-[clamp(2.6rem,8vw,6rem)] uppercase leading-[0.82]">
            Put it on the wire
          </h2>
          <div className="mt-9 flex flex-wrap items-center justify-center gap-4">
            <Link href="/gigs" className="btn btn-marigold !px-7 !py-4 !text-[15px]">
              I play — find a gig
            </Link>
            <Link
              href="/post"
              className="btn !border-paper-2 bg-paper-2 !text-ink hover:bg-ink hover:!text-paper-2 !px-7 !py-4 !text-[15px]"
            >
              I have a room — post a night
            </Link>
          </div>
          <div className="mt-10 flex flex-wrap items-center justify-center gap-3">
            {spotlight.slice(0, 4).map((s, i) => (
              <span
                key={s.musician.id}
                className="flex items-center gap-2 border-2 border-paper-2/60 px-3 py-1 font-mono text-[10px] uppercase tracking-[0.12em]"
                style={{ transform: `rotate(${i % 2 ? 1.5 : -1.5}deg)` }}
              >
                {s.musician.name} · {s.booked} booked
              </span>
            ))}
          </div>
        </div>

        <div className="mx-auto mt-16 max-w-[1180px]">
          <div className="grid gap-4 sm:grid-cols-3">
            {featured.slice(0, 3).map((row) => {
              const d = formatGigDate(row.gig.gigDate);
              return (
                <Link
                  key={row.gig.id}
                  href={`/gigs/${row.gig.id}`}
                  className="card flex items-center gap-3 p-3 transition hover:bg-butter"
                >
                  <div className="flex h-12 w-12 shrink-0 flex-col items-center justify-center border-2 border-ink bg-ink text-paper-2">
                    <span className="font-mono text-[8px] uppercase">{d.month}</span>
                    <span className="font-display text-[18px] leading-none">{d.day}</span>
                  </div>
                  <div className="min-w-0">
                    <p className="truncate font-heavy text-[13px] uppercase">{row.gig.title}</p>
                    <p className="font-mono text-[10px] uppercase tracking-[0.1em] text-ink-soft">
                      {relativeDay(row.gig.gigDate)} · {formatPay(row.gig.payAmount, row.gig.payUnit)}
                    </p>
                  </div>
                </Link>
              );
            })}
          </div>
        </div>
      </section>
    </div>
  );
}
