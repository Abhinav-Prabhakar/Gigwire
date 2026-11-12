import Link from "next/link";
import { BASE_DATASET, getRooms } from "@/lib/demo/data";
import { formatPay, formatPayShort } from "@/lib/format";
import { PHOTOS } from "@/lib/media";
import { pageUrl } from "@/lib/site";
import {
  Chip,
  Eyebrow,
  IconArrow,
  IconMusic,
  IconPin,
  IconUsers,
  Marquee,
  SectionHeading,
  Stamp,
} from "@/components/ui";

export const metadata = {
  title: "Rooms on the wire",
  description:
    "The bars, cafés, taprooms and courtyards posting live music gigs on GIGWIRE — capacity, curfew and pay, in their own words.",
  alternates: { canonical: pageUrl("/rooms") },
};

export default async function RoomsPage() {
  const rows = getRooms(BASE_DATASET);

  return (
    <div>
      <section className="relative border-b-[4px] border-ink bg-tangerine px-4 py-14 text-ink md:px-8">
        <div aria-hidden className="absolute inset-0 halftone opacity-30 text-ink" />
        <div className="relative mx-auto max-w-[1240px]">
          <Eyebrow className="text-ink">Rooms with a stage-shaped hole</Eyebrow>
          <h1 className="mt-4 text-[clamp(2.6rem,7.5vw,5.6rem)] uppercase leading-[0.84]">
            The rooms,
            <br />
            in their own words
          </h1>
          <p className="mt-5 max-w-xl text-[17px] leading-relaxed">
            Every room on this board writes their own capacity, curfew and pay. No listings agency, no “submitted by
            partner”. {rows.length} rooms, {rows.reduce((n, r) => n + r.openGigs, 0)} open nights,{" "}
            {formatPayShort(rows.reduce((n, r) => n + r.paid, 0))} on the table.
          </p>
        </div>
      </section>

      <div className="border-b-[3px] border-ink bg-ink py-2 text-marigold">
        <Marquee
          slow
          items={rows.map((r) => (
            <span key={r.venue.id} className="font-display text-[22px] uppercase leading-none">
              {r.venue.name} — {r.openGigs} open
            </span>
          ))}
        />
      </div>

      <div className="mx-auto max-w-[1240px] px-4 py-14 md:px-8">
        <SectionHeading
          kicker="Directory"
          title="Pick a room, read the flyer"
          intro="Capacity tells you how loud it gets. The genre list tells you what they've been missing."
          className="max-w-2xl"
        />

        <div className="mt-10 grid gap-7 md:grid-cols-2">
          {rows.map((r, i) => (
            <article
              key={r.venue.id}
              style={{ transform: `rotate(${i % 2 ? 0.6 : -0.6}deg)` }}
              className="paper-grain relative border-[3px] border-ink bg-paper-2 shadow-hard transition hover:-translate-y-1 hover:shadow-hard-lg"
            >
              <div className="relative border-b-[3px] border-ink">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={r.venue.coverUrl ?? PHOTOS.barNeon}
                  alt=""
                  loading="lazy"
                  className="h-48 w-full border-b-[3px] border-ink object-cover mix-blend-multiply"
                />
                <span className="absolute -bottom-4 left-5">
                  <Stamp className="border-ink bg-butter !text-ink">{r.openGigs} open nights</Stamp>
                </span>
                <span
                  className="sticker absolute right-4 top-4 bg-ink text-paper-2 !shadow-none"
                  style={{ transform: "rotate(6deg)" }}
                >
                  cap {r.capacity ?? "—"}
                </span>
              </div>
              <div className="p-5 pt-7">
                <h2 className="text-[clamp(1.5rem,3.2vw,2.1rem)] uppercase leading-none">{r.venue.name}</h2>
                <p className="mt-1 font-serif text-[17px] italic text-ink-soft">{r.venue.tagline}</p>
                <p className="mt-3 text-[15px] leading-relaxed">{r.venue.description}</p>

                <div className="mt-4 flex flex-wrap items-center gap-2">
                  <Chip tone="ink">
                    <IconPin className="h-3 w-3" /> {r.venue.city}, {r.venue.state}
                  </Chip>
                  {(r.venue.genres ?? []).map((g: string) => (
                    <Chip key={g}>{g}</Chip>
                  ))}
                  {r.owner ? (
                    <Chip tone="cobalt">
                      <IconUsers className="h-3 w-3" /> {r.owner.name}
                    </Chip>
                  ) : null}
                </div>

                <ul className="mt-5 space-y-2 border-t-[3px] border-dashed border-ink/30 pt-4">
                  {r.upcoming.length ? (
                    r.upcoming.map((g) => (
                      <li key={g.id} className="flex items-baseline justify-between gap-3">
                        <Link
                          href={`/gigs/${g.id}`}
                          className="font-heavy text-[13px] uppercase leading-tight underline decoration-tomato decoration-2 underline-offset-4"
                        >
                          {g.title}
                        </Link>
                        <span className="shrink-0 font-mono text-[11px] font-bold">{formatPay(g.payAmount, g.payUnit)}</span>
                      </li>
                    ))
                  ) : (
                    <li className="font-mono text-[11px] uppercase tracking-[0.1em] text-ink-soft">
                      Nothing posted this fortnight
                    </li>
                  )}
                </ul>

                <div className="mt-5 flex flex-wrap gap-2">
                  <Link href={`/gigs?city=${encodeURIComponent(r.venue.city ?? "")}`} className="btn btn-ink !py-2">
                    Nights in {r.venue.city} <IconArrow className="h-4 w-4" />
                  </Link>
                  <Link href="/post" className="btn btn-ghost !py-2">
                    <IconMusic className="h-4 w-4" /> Post like this
                  </Link>
                </div>
              </div>
            </article>
          ))}
        </div>
      </div>
    </div>
  );
}
