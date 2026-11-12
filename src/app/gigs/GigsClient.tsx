"use client";

import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { useMemo, useState } from "react";
import { getCities, getHotCities, getSavedGigIds, searchGigs, type GigFilters } from "@/lib/demo/data";
import { currentUser, useDemo } from "@/lib/demo/store";
import { GENRES, LINEUP } from "@/lib/format";
import { GigCard } from "@/components/GigCard";
import { Chip, Eyebrow, IconArrow, IconBolt, IconMusic, Sticker } from "@/components/ui";

type SP = Record<string, string | string[] | undefined>;

const arr = (v: SP[string]) => (Array.isArray(v) ? v : typeof v === "string" && v ? [v] : []);
const one = (v: SP[string]) => (Array.isArray(v) ? v[0] : v) ?? "";

export function GigsClient() {
  const router = useRouter();
  const params = useSearchParams();
  const state = useDemo();
  const data = state.data;
  const user = currentUser(state);
  const [filtersOpen, setFiltersOpen] = useState(false);

  const sp: SP = useMemo(() => {
    const out: SP = {};
    params.forEach((value, key) => {
      const prev = out[key];
      if (prev === undefined) out[key] = value;
      else if (Array.isArray(prev)) prev.push(value);
      else out[key] = [prev, value];
    });
    return out;
  }, [params]);

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
  const cities = getCities(data);
  const hot = getHotCities(data);
  const savedIds = user ? getSavedGigIds(data, user.id) : [];

  let results = searchGigs(data, filters, 100);
  if (showSaved) results = results.filter((r) => savedIds.includes(r.gig.id));

  const active = [
    filters.q ? [`q`, `“${filters.q}”`] : null,
    filters.city ? [`city`, filters.city] : null,
    ...filters.genres!.map((g) => [`genre:${g}`, g] as [string, string]),
    ...filters.lineup!.map((l) => [`lineup:${l}`, l] as [string, string]),
    ...filters.perks!.map((p) => [`perk:${p}`, p] as [string, string]),
    filters.dateFrom ? [`from`, `after ${filters.dateFrom}`] : null,
    filters.payMin ? [`pay`, `₹${filters.payMin}+`] : null,
    filters.gigType ? [`type`, filters.gigType.replace("_", " ")] : null,
  ].filter(Boolean) as [string, string][];

  const go = (next: URLSearchParams) => {
    const qs = next.toString();
    router.push(qs ? `/gigs?${qs}` : "/gigs", { scroll: false });
  };

  const tabHref = (tab: "open" | "saved" | "all") => {
    const next = new URLSearchParams(params.toString());
    next.delete("tab");
    next.delete("status");
    if (tab === "saved") next.set("tab", "saved");
    else next.set("status", tab);
    const qs = next.toString();
    return qs ? `/gigs?${qs}` : "/gigs";
  };

  const removeFilter = (key: string) => {
    const next = new URLSearchParams();
    for (const [k, v] of Object.entries(sp)) {
      if (k === "tab" || k === "sort") continue;
      const values = Array.isArray(v) ? v : [v];
      for (const value of values) {
        if (!value) continue;
        const isTarget =
          key === "q" ? k === "q" : key === "city" ? k === "city" : key === "from" ? k === "from" : key === "pay" ? k === "pay" : key === "type" ? k === "type" : key.startsWith("genre:")
            ? k === "genre" && value === key.slice(6)
            : key.startsWith("lineup:")
              ? k === "lineup" && value === key.slice(7)
              : key.startsWith("perk:")
                ? k === "perk" && value === key.slice(5)
                : false;
        if (isTarget) continue;
        next.append(k, value);
      }
    }
    const qs = next.toString();
    router.push(qs ? `/gigs?${qs}` : "/gigs", { scroll: false });
  };

  return (
    <div>
      <section className="relative border-b-[4px] border-ink bg-ink px-4 py-10 text-paper-2 md:px-8">
        <div aria-hidden className="absolute inset-0 halftone text-paper-2 opacity-[0.14]" />
        <div className="relative mx-auto flex max-w-[1240px] flex-wrap items-end justify-between gap-6">
          <div>
            <Eyebrow className="!text-marigold">{filters.status === "open" ? "Open board" : "Full board"}</Eyebrow>
            <h1 className="mt-3 text-[clamp(2.6rem,7vw,5rem)] uppercase leading-[0.85]">The gig board</h1>
            <p className="mt-3 max-w-xl font-serif text-[19px] italic text-paper-3">
              {results.length} {results.length === 1 ? "night" : "nights"} waiting for somebody with an instrument.
            </p>
          </div>
          <div className="flex flex-wrap items-center gap-2">
            {([
              ["Open only", "open"],
              ...(user ? ([["Saved", "saved"]] as [string, string][]) : []),
              ["Everything", "all"],
            ] as [string, "open" | "saved" | "all"][]).map(([label, tab]) => {
              const current = one(sp.tab) === "saved" ? "saved" : one(sp.status) === "all" ? "all" : "open";
              const isActive = current === tab;
              return (
                <Link
                  key={label}
                  href={tabHref(tab)}
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
        <aside className="lg:sticky lg:top-24 lg:self-start">
          <button
            type="button"
            onClick={() => setFiltersOpen((v) => !v)}
            aria-expanded={filtersOpen}
            className="btn btn-ink w-full !py-3 lg:hidden"
          >
            {filtersOpen ? "Hide filters" : "Filters"}
            {active.length ? <span className="ml-1 text-butter">{active.length}</span> : null}
            <IconBolt className="h-4 w-4" />
          </button>
          <div className={filtersOpen ? "mt-3" : "mt-3 hidden lg:mt-0 lg:block"}>
          <form
            key={params.toString()}
            onSubmit={(e) => {
              e.preventDefault();
              const fd = new FormData(e.currentTarget);
              const next = new URLSearchParams();
              for (const [k, v] of fd.entries()) {
                if (typeof v === "string" && v.trim()) next.append(k, v.trim());
              }
              const status = one(sp.status);
              if (status) next.set("status", status);
              if (one(sp.tab) === "saved") next.set("tab", "saved");
              go(next);
            }}
            className="paper-grain border-[3px] border-ink bg-paper-2 p-4 shadow-hard"
          >
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
                <input id="q" name="q" defaultValue={one(sp.q)} placeholder="e.g. sax, ghazal duo" className="field" />
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
                    Pay floor ₹
                  </label>
                  <input
                    id="pay"
                    name="pay"
                    type="number"
                    min={0}
                    step={500}
                    defaultValue={one(sp.pay)}
                    placeholder="5000"
                    className="field"
                  />
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
              {hot.map((h) => (
                <li key={h.city} className="flex items-center justify-between gap-2">
                  <Link
                    href={`/gigs?city=${encodeURIComponent(h.city)}`}
                    className="font-heavy text-[13px] uppercase underline decoration-2 decoration-tomato underline-offset-4"
                  >
                    {h.city}
                  </Link>
                  <span className="font-mono text-[11px]">{h.count} open</span>
                </li>
              ))}
            </ul>
          </div>
          </div>
        </aside>

        <div>
          <div className="flex flex-wrap items-center gap-2">
            <span className="chip bg-sky">{results.length} shown</span>
            {active.map(([key, label]) => (
              <button key={key} onClick={() => removeFilter(key)} className="group">
                <Chip tone="ink">
                  {label}
                  <span className="ml-1 text-tomato group-hover:text-butter">✕</span>
                </Chip>
              </button>
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
              Showing {results.length} of {data.gigs.length} nights on the board ·{" "}
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
