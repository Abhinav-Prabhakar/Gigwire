import Link from "next/link";
import { getCities, getSavedGigIds, searchGigs, type GigFilters } from "@/lib/data";
import { getCurrentUser } from "@/lib/auth";
import { GENRES, LINEUP } from "@/lib/format";
import { GigCard } from "@/components/GigCard";
import { Chip, Eyebrow, IconArrow, IconBolt, IconMusic, Sticker } from "@/components/ui";
import { db } from "@/db";
import { gigs } from "@/db/schema";
import { desc, sql } from "drizzle-orm";

export const dynamic = "force-dynamic";

type SP = Record<string, string | string[] | undefined>;

const arr = (v: SP[string]) => (Array.isArray(v) ? v : typeof v === "string" && v ? [v] : []);
const one = (v: SP[string]) => (Array.isArray(v) ? v[0] : v) ?? "";

export default async function GigsPage({ searchParams }: { searchParams: Promise<SP> }) {
  const sp = await searchParams;
  const user = await getCurrentUser();

  const filters: GigFilters = {
    q: one(sp.q) || undefined,
    city: one(sp.city) || undefined,
    genres: arr(sp.genre),
    lineup: arr(sp.lineup),
    dateFrom: one(sp.from) || undefined,
    payMin: one(sp.pay) ? Number.parseInt(one(sp.pay), 10) : undefined,
    gigType: one(sp.type) || undefined,
    perks: arr(sp.perk),
    sort: one(sp.sort) || "recent",
    status: one(sp.status) ? (one(sp.status) === "all" ? undefined : one(sp.status)) : "open",
  };

  const showSaved = one(sp.tab) === "saved";
  const [rows, cities, savedIds, hot] = await Promise.all([
    searchGigs(filters, 100),
    getCities(),
    user ? getSavedGigIds(user.id) : Promise.resolve([]),
    db
      .select({ city: gigs.city, n: sql<number>`count(*)::int` })
      .from(gigs)
      .where(sql`gigs.status in ('open','interviewing')`)
      .groupBy(gigs.city)
      .orderBy(desc(sql`count(*)`)),
  ]);

  let results = rows;
  if (showSaved) results = results.filter((r) => savedIds.includes(r.gig.id));

  const active = [
    filters.q ? [`q`, `“${filters.q}”`] : null,
    filters.city ? [`city`, filters.city] : null,
    ...filters.genres!.map((g) => [`genre:${g}`, g] as [string, string]),
    ...filters.lineup!.map((l) => [`lineup:${l}`, l] as [string, string]),
    ...filters.perks!.map((p) => [`perk:${p}`, p] as [string, string]),
    filters.dateFrom ? [`from`, `after ${filters.dateFrom}`] : null,
    filters.payMin ? [`pay`, `$${filters.payMin}+`] : null,
    filters.gigType ? [`type`, filters.gigType.replace("_", " ")] : null,
  ].filter(Boolean) as [string, string][];

  const clearHref = active.length
    ? `/gigs?${active.map(([key]) => `clear=${key}`).join("&")}`
    : "/gigs";

  return (
    <div>
      {/* header band */}
      <section className="relative border-b-[4px] border-ink bg-ink px-4 py-10 text-paper-2 md:px-8">
        <div aria-hidden className="absolute inset-0 halftone text-paper-2 opacity-[0.14]" />
        <div className="relative mx-auto flex max-w-[1240px] flex-wrap items-end justify-between gap-6">
          <div>
            <Eyebrow className="!text-marigold">{filters.status === "open" ? "Open board" : "Full board"}</Eyebrow>
            <h1 className="mt-3 text-[clamp(2.6rem,7vw,5rem)] uppercase leading-[0.85]">
              The gig board
            </h1>
            <p className="mt-3 max-w-xl font-serif text-[19px] italic text-paper-3">
              {results.length} {results.length === 1 ? "night" : "nights"} waiting for somebody with an instrument.
            </p>
          </div>
          <div className="flex flex-wrap items-center gap-2">
            {[
              ["Open only", "open"],
              ...(user ? ([["Saved", "saved"]] as [string, string][]) : []),
              ["Everything", "all"],
            ].map(([label, tab]) => {
              const base = toParams(sp, ["tab", "status"]);
              const href =
                tab === "saved"
                  ? `/gigs?tab=saved&${base}`
                  : tab === "open"
                    ? `/gigs?${base}${base ? "&" : ""}status=open`
                    : `/gigs?${base}${base ? "&" : ""}status=all`;
              const current = one(sp.tab) === "saved" ? "saved" : one(sp.status) === "all" ? "all" : "open";
              const isActive = current === tab;
              return (
                <Link
                  key={label}
                  href={href}
                  className={`border-[3px] px-3 py-1.5 font-mono text-[11px] font-bold uppercase tracking-[0.14em] transition ${
                    isActive
                      ? "border-paper-2 bg-marigold text-ink"
                      : "border-paper-2/50 text-paper-2 hover:bg-paper-2 hover:text-ink"
                  }`}
                >
                  {label}
                </Link>
              );
            })}
          </div>
        </div>
      </section>

      <div className="mx-auto grid max-w-[1240px] gap-8 px-4 py-10 md:px-8 lg:grid-cols-[290px_1fr]">
        {/* ---------------- filter rail ---------------- */}
        <aside className="lg:sticky lg:top-24 lg:self-start">
          <form action="/gigs" method="get" className="paper-grain border-[3px] border-ink bg-paper-2 p-4 shadow-hard">
            <div className="flex items-center justify-between">
              <p className="font-heavy text-[13px] uppercase tracking-[0.06em]">Narrow it down</p>
              <Link href="/gigs" className="font-mono text-[10px] uppercase tracking-[0.12em] text-tomato underline">
                reset
              </Link>
            </div>

            <div className="mt-4 space-y-4">
              <div>
                <label className="label" htmlFor="q">
                  Band, room, city, vibe
                </label>
                <input id="q" name="q" defaultValue={one(sp.q)} placeholder="e.g. horns, blues duo" className="field" />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="label" htmlFor="city">
                    City
                  </label>
                  <select id="city" name="city" defaultValue={one(sp.city)} className="field">
                    <option value="">Anywhere</option>
                    {cities.map((c) => (
                      <option key={c.city} value={c.city}>
                        {c.city} ({c.count})
                      </option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="label" htmlFor="from">
                    From date
                  </label>
                  <input id="from" name="from" type="date" defaultValue={one(sp.from)} className="field" />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="label" htmlFor="pay">
                    Pay floor $
                  </label>
                  <input id="pay" name="pay" type="number" min={0} step={20} defaultValue={one(sp.pay)} placeholder="200" className="field" />
                </div>
                <div>
                  <label className="label" htmlFor="type">
                    Gig type
                  </label>
                  <select id="type" name="type" defaultValue={one(sp.type)} className="field">
                    <option value="">Any</option>
                    <option value="one_off">One-off</option>
                    <option value="residency">Residency</option>
                    <option value="sub">Sub / fill-in</option>
                    <option value="opener">Opener</option>
                  </select>
                </div>
              </div>

              <fieldset>
                <legend className="label">I play…</legend>
                <div className="flex flex-wrap gap-1.5">
                  {LINEUP.map((slot) => (
                    <label key={slot} className="cursor-pointer">
                      <input
                        type="checkbox"
                        name="lineup"
                        value={slot}
                        defaultChecked={filters.lineup?.includes(slot)}
                        className="peer sr-only"
                      />
                      <span className="block border-2 border-ink bg-paper-3 px-2 py-1 font-mono text-[10px] font-bold uppercase tracking-[0.06em] transition peer-checked:bg-cobalt peer-checked:text-paper-2 peer-focus-visible:ring-2 peer-focus-visible:ring-cobalt">
                        {slot}
                      </span>
                    </label>
                  ))}
                </div>
              </fieldset>

              <fieldset>
                <legend className="label">Genres</legend>
                <div className="flex flex-wrap gap-1.5">
                  {GENRES.map((genre) => (
                    <label key={genre} className="cursor-pointer">
                      <input
                        type="checkbox"
                        name="genre"
                        value={genre}
                        defaultChecked={filters.genres?.includes(genre)}
                        className="peer sr-only"
                      />
                      <span className="block border-2 border-ink bg-paper-3 px-2 py-1 font-mono text-[10px] font-bold uppercase tracking-[0.06em] transition peer-checked:bg-tomato peer-checked:text-paper-2">
                        {genre}
                      </span>
                    </label>
                  ))}
                </div>
              </fieldset>

              <fieldset>
                <legend className="label">Room offers</legend>
                <div className="grid grid-cols-2 gap-1.5">
                  {[
                    ["backline", "Backline"],
                    ["meals", "Free meal"],
                    ["tips", "Tips"],
                    ["engineer", "Engineer"],
                  ].map(([value, label]) => (
                    <label key={value} className="cursor-pointer">
                      <input
                        type="checkbox"
                        name="perk"
                        value={value}
                        defaultChecked={filters.perks?.includes(value)}
                        className="peer sr-only"
                      />
                      <span className="block border-2 border-ink bg-paper-3 px-2 py-1 text-center font-mono text-[10px] font-bold uppercase tracking-[0.06em] transition peer-checked:bg-moss peer-checked:text-paper-2">
                        {label}
                      </span>
                    </label>
                  ))}
                </div>
              </fieldset>

              <div>
                <label className="label" htmlFor="sort">
                  Sort by
                </label>
                <select id="sort" name="sort" defaultValue={one(sp.sort) || "recent"} className="field">
                  <option value="recent">Soonest + featured</option>
                  <option value="date">Date (soonest)</option>
                  <option value="pay">Pay (highest)</option>
                </select>
              </div>

              <button type="submit" className="btn btn-ink w-full">
                <IconBolt className="h-4 w-4" /> Update the board
              </button>
            </div>
          </form>

          <div className="mt-5 border-[3px] border-ink bg-butter p-4">
            <p className="font-mono text-[10px] font-bold uppercase tracking-[0.18em]">Busiest rooms right now</p>
            <ul className="mt-2 space-y-1.5">
              {hot.slice(0, 4).map((h) => (
                <li key={h.city} className="flex items-center justify-between gap-2">
                  <Link
                    href={`/gigs?city=${encodeURIComponent(h.city ?? "")}`}
                    className="font-heavy text-[13px] uppercase underline decoration-2 decoration-tomato underline-offset-4"
                  >
                    {h.city}
                  </Link>
                  <span className="font-mono text-[11px]">{h.n} open</span>
                </li>
              ))}
            </ul>
          </div>
        </aside>

        {/* ---------------- results ---------------- */}
        <div>
          <div className="flex flex-wrap items-center gap-2">
            <span className="chip bg-sky">{results.length} shown</span>
            {active.map(([key, label]) => (
              <Link key={key} href={removeFilter(sp, key)} className="group">
                <Chip tone="ink">
                  {label}
                  <span className="ml-1 text-tomato group-hover:text-butter">✕</span>
                </Chip>
              </Link>
            ))}
            {active.length ? (
              <Link href="/gigs" className="font-mono text-[10px] uppercase tracking-[0.14em] text-tomato underline">
                clear all
              </Link>
            ) : null}
          </div>

          {showSaved && !user ? (
            <div className="card mt-6 flex flex-wrap items-center justify-between gap-4 p-6">
              <p className="max-w-md text-[15px]">
                Save gigs to your own pinboard — and apply with the same one-sheet. Free for players.
              </p>
              <Link href="/signup?role=musician" className="btn btn-tomato">
                Make a player account <IconArrow className="h-4 w-4" />
              </Link>
            </div>
          ) : null}

          {showSaved && user && results.length === 0 ? (
            <div className="card mt-6 p-8 text-center">
              <IconMusic className="mx-auto h-8 w-8 text-tomato" />
              <p className="mt-3 font-heavy text-[17px] uppercase">Nothing pinned yet</p>
              <p className="mt-2 text-[15px] text-ink-soft">
                Hit the bookmark on any card and it lands here, with deadlines and applicant counts.
              </p>
            </div>
          ) : null}

          {results.length === 0 && !showSaved ? (
            <div className="card relative mt-6 p-10 text-center">
              <Sticker bg="bg-tomato" text="text-paper-2" className="!absolute -top-4 left-1/2 -translate-x-1/2">
                nothing found
              </Sticker>
              <p className="mt-3 font-serif text-[21px] italic leading-snug">
                No nights match that combination. Loosen the pay floor, or widen the city — most rooms post within a
                fortnight of the date.
              </p>
              <div className="mt-6 flex flex-wrap justify-center gap-2">
                {GENRES.slice(0, 6).map((g) => (
                  <Link key={g} href={`/gigs?genre=${encodeURIComponent(g)}`}>
                    <Chip>Try {g}</Chip>
                  </Link>
                ))}
              </div>
              <Link href="/post" className="btn btn-marigold mt-7">
                Know a room that should post here? <IconArrow className="h-4 w-4" />
              </Link>
            </div>
          ) : null}

          <div className="mt-6 grid gap-6 md:grid-cols-2 xl:grid-cols-3">
            {results.map((row) => (
              <GigCard key={row.gig.id} row={row} saved={savedIds.includes(row.gig.id)} />
            ))}
          </div>

          {results.length > 0 ? (
            <p className="mt-8 border-t-[3px] border-dashed border-ink/40 pt-5 text-center font-mono text-[11px] uppercase tracking-[0.14em] text-ink-soft">
              Showing {results.length} of {rows.length} matching nights ·{" "}
              <Link href="/how-it-works" className="underline">
                how pay &amp; cancellations work
              </Link>
            </p>
          ) : null}
        </div>
      </div>
    </div>
  );
}

function toParams(sp: SP, omit: string[] = []) {
  const p = new URLSearchParams();
  for (const [k, v] of Object.entries(sp)) {
    if (omit.includes(k)) continue;
    if (Array.isArray(v)) v.forEach((x) => p.append(k, x));
    else if (v) p.set(k, v);
  }
  return p.toString();
}

function removeFilter(sp: SP, key: string) {
  const params = new URLSearchParams();
  for (const [k, v] of Object.entries(sp)) {
    if (k === "tab" || k === "sort") continue;
    if (key === "q" && k === "q") continue;
    if (key === "city" && k === "city") continue;
    if (key === "from" && k === "from") continue;
    if (key === "pay" && k === "pay") continue;
    if (key === "type" && k === "type") continue;
    if (key.startsWith("genre:") && k === "genre" && v !== key.slice(6)) {
      params.append("genre", String(v));
      continue;
    }
    if (key.startsWith("lineup:") && k === "lineup" && v !== key.slice(7)) {
      params.append("lineup", String(v));
      continue;
    }
    if (key.startsWith("perk:") && k === "perk" && v !== key.slice(5)) {
      params.append("perk", String(v));
      continue;
    }
    if (Array.isArray(v)) v.forEach((x) => params.append(k, x));
    else if (v) params.set(k, v);
  }
  const qs = params.toString();
  return `/gigs${qs ? `?${qs}` : ""}`;
}
