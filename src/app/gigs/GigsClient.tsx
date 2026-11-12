"use client";

import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { useMemo, useState, type ReactNode } from "react";
import {
  countGigs,
  day,
  getCities,
  getSavedGigIds,
  searchGigs,
  type GigFilters,
} from "@/lib/demo/data";
import { currentUser, useDemo } from "@/lib/demo/store";
import { GENRES, LINEUP, formatGigDate, formatPayShort } from "@/lib/format";
import { FlyerCard } from "@/components/FlyerCard";
import {
  Chip,
  Eyebrow,
  IconAmp,
  IconArrow,
  IconBolt,
  IconCash,
  IconCheck,
  IconClock,
  IconFader,
  IconMusic,
  IconPin,
  IconPlate,
  IconSearch,
  IconStar,
  Sticker,
} from "@/components/ui";

type SP = Record<string, string | string[] | undefined>;

const arr = (v: SP[string]) => (Array.isArray(v) ? v : typeof v === "string" && v ? [v] : []);
const one = (v: SP[string]) => (Array.isArray(v) ? v[0] : v) ?? "";

const TYPE_LABEL: Record<string, string> = {
  one_off: "One-off",
  residency: "Residency",
  sub: "Sub",
  opener: "Opener",
};

const PAY_MAX = 40000;

type ActiveFilter = { key: string; label: string; kind: "q" | "city" | "from" | "pay" | "type" | "genre" | "lineup" | "perk"; value?: string };

/* ------------------------------------------------------------------ */
/* Controls                                                            */
/* ------------------------------------------------------------------ */

function FilterSection({
  title,
  count,
  open,
  onToggle,
  children,
}: {
  title: string;
  count?: number;
  open: boolean;
  onToggle: () => void;
  children: ReactNode;
}) {
  return (
    <div className="border-t-2 border-dashed border-ink/30 pt-3">
      <button
        type="button"
        onClick={onToggle}
        aria-expanded={open}
        className="group flex w-full items-center justify-between gap-2 text-left"
      >
        <span className="flex items-center gap-2 font-mono text-[10px] font-bold uppercase tracking-[0.18em] text-ink-soft transition group-hover:text-ink">
          {title}
          {count ? (
            <span className="border border-ink bg-ink px-1 py-[1px] text-[9px] leading-none text-paper-2">{count}</span>
          ) : null}
        </span>
        <span aria-hidden className="font-display text-[18px] leading-none text-ink">
          {open ? "–" : "+"}
        </span>
      </button>
      {open ? <div className="mt-3">{children}</div> : null}
    </div>
  );
}

function PaySlider({ value, onCommit }: { value: number; onCommit: (n: number) => void }) {
  const [v, setV] = useState(value);
  const pct = (v / PAY_MAX) * 100;

  return (
    <div>
      <div className="flex items-end justify-between gap-2">
        <p className="font-display text-[30px] leading-none text-moss">
          {v ? `₹${v.toLocaleString("en-IN")}` : "Any"}
        </p>
        <p className="pb-1 font-mono text-[9.5px] font-bold uppercase tracking-[0.14em] text-ink-soft">
          {v ? "floor" : "no floor"}
        </p>
      </div>

      <div className="relative mt-3 h-8">
        <input
          type="range"
          min={0}
          max={PAY_MAX}
          step={1000}
          value={v}
          aria-label="Minimum pay per night"
          onChange={(e) => setV(Number(e.target.value))}
          onPointerUp={(e) => onCommit(Number(e.currentTarget.value))}
          onKeyUp={(e) => {
            if (["ArrowLeft", "ArrowRight", "ArrowUp", "ArrowDown", "Home", "End", "PageUp", "PageDown"].includes(e.key)) {
              onCommit(Number(e.currentTarget.value));
            }
          }}
          className="peer absolute inset-0 z-10 h-full w-full cursor-pointer opacity-0"
        />
        <div className="pointer-events-none absolute -inset-1 border-[3px] border-cobalt opacity-0 peer-focus-visible:opacity-100" />
        <div className="pointer-events-none absolute inset-x-0 top-1/2 h-3 -translate-y-1/2 border-[3px] border-ink bg-paper-3" />
        <div
          className="pointer-events-none absolute left-[3px] top-1/2 h-3 -translate-y-1/2 border-y-[3px] border-l-[3px] border-ink bg-marigold"
          style={{ width: pct === 0 ? 0 : `calc(${pct}% - 3px)` }}
        />
        <div
          className="pointer-events-none absolute top-1/2 h-6 w-6 -translate-y-1/2 border-[3px] border-ink bg-marigold shadow-hard-sm"
          style={{ left: `calc(${pct}% - ${pct * 0.24}px)` }}
        />
      </div>

      <div className="mt-3 flex flex-wrap gap-1.5">
        {[0, 5000, 10000, 20000].map((n) => (
          <button
            key={n}
            type="button"
            aria-pressed={v === n}
            onClick={() => {
              setV(n);
              onCommit(n);
            }}
            className={`border-2 border-ink px-2 py-1 font-mono text-[9.5px] font-bold uppercase tracking-[0.1em] transition ${
              v === n ? "bg-ink text-paper-2" : "bg-paper-3 hover:bg-butter"
            }`}
          >
            {n ? `₹${n / 1000}k+` : "Any"}
          </button>
        ))}
      </div>
    </div>
  );
}

/* ------------------------------------------------------------------ */
/* Board                                                               */
/* ------------------------------------------------------------------ */

export function GigsClient() {
  const router = useRouter();
  const params = useSearchParams();
  const state = useDemo();
  const data = state.data;
  const user = currentUser(state);
  const [filtersOpen, setFiltersOpen] = useState(false);
  const [open, setOpen] = useState({ city: true, pay: true, play: false, genre: false, offers: false, type: false });

  const toggleSection = (key: keyof typeof open) => setOpen((o) => ({ ...o, [key]: !o[key] }));

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
  const cities = getCities(data, ["open"]);
  const hot = cities.slice().sort((a, b) => b.count - a.count || a.city.localeCompare(b.city));
  const savedIds = user ? getSavedGigIds(data, user.id) : [];

  let results = searchGigs(data, filters, 100);
  if (showSaved) results = results.filter((r) => savedIds.includes(r.gig.id));

  const active: ActiveFilter[] = [
    filters.q ? { key: "q", label: `“${filters.q}”`, kind: "q" } : null,
    filters.city ? { key: "city", label: filters.city, kind: "city" } : null,
    ...(filters.genres ?? []).map((g) => ({ key: `genre:${g}`, label: g, kind: "genre" as const, value: g })),
    ...(filters.lineup ?? []).map((l) => ({ key: `lineup:${l}`, label: l, kind: "lineup" as const, value: l })),
    ...(filters.perks ?? []).map((p) => ({ key: `perk:${p}`, label: p, kind: "perk" as const, value: p })),
    filters.dateFrom ? { key: "from", label: `from ${formatGigDate(filters.dateFrom).short}`, kind: "from" } : null,
    filters.payMin ? { key: "pay", label: `₹${filters.payMin.toLocaleString("en-IN")}+`, kind: "pay" } : null,
    filters.gigType ? { key: "type", label: TYPE_LABEL[filters.gigType] ?? filters.gigType, kind: "type" } : null,
  ].filter(Boolean) as ActiveFilter[];

  const push = (mutate: (next: URLSearchParams) => void) => {
    const next = new URLSearchParams(params.toString());
    mutate(next);
    const qs = next.toString();
    router.push(qs ? `/gigs?${qs}` : "/gigs", { scroll: false });
  };

  const setOne = (key: string, value?: string | number | null) =>
    push((next) => {
      next.delete(key);
      if (value !== undefined && value !== null && `${value}` !== "") next.set(key, `${value}`);
    });

  const toggleParam = (key: string, value: string) =>
    push((next) => {
      const values = next.getAll(key);
      next.delete(key);
      const has = values.includes(value);
      (has ? values.filter((v) => v !== value) : [...values, value]).forEach((v) => next.append(key, v));
    });

  const removeFilter = (f: ActiveFilter) =>
    push((next) => {
      if (f.value) {
        const rest = next.getAll(f.kind).filter((v) => v !== f.value);
        next.delete(f.kind);
        rest.forEach((v) => next.append(f.kind, v));
      } else {
        next.delete(f.kind);
      }
    });

  const tabHref = (tab: "open" | "saved" | "all") => {
    const next = new URLSearchParams(params.toString());
    next.delete("tab");
    next.delete("status");
    if (tab === "saved") next.set("tab", "saved");
    else next.set("status", tab);
    const qs = next.toString();
    return qs ? `/gigs?${qs}` : "/gigs";
  };

  const tab = one(sp.tab) === "saved" ? "saved" : one(sp.status) === "all" ? "all" : "open";
  const openTotal = countGigs(data, { status: "open" });
  const savedOpen = savedIds.filter((id) => data.gigs.some((g) => g.id === id && g.status === "open")).length;
  const tabs: { label: string; tab: "open" | "saved" | "all"; count: number }[] = [
    { label: "Open", tab: "open", count: openTotal },
    ...(user ? [{ label: "Saved", tab: "saved" as const, count: savedOpen }] : []),
    { label: "Everything", tab: "all", count: data.gigs.length },
  ];

  const citiesInResults = new Set(results.map((r) => r.gig.city)).size;
  const topPay = results.reduce((max, r) => Math.max(max, r.gig.payAmount), 0);
  const week = Array.from({ length: 7 }, (_, i) => {
    const iso = day(i);
    return { iso, ...formatGigDate(iso) };
  });
  const maxHot = Math.max(...hot.map((h) => h.count), 1);

  const sorts: { value: string; label: string; icon: ReactNode }[] = [
    { value: "recent", label: "Featured", icon: <IconStar className="h-3.5 w-3.5" /> },
    { value: "date", label: "Soonest", icon: <IconClock className="h-3.5 w-3.5" /> },
    { value: "pay", label: "Top pay", icon: <IconCash className="h-3.5 w-3.5" /> },
  ];

  return (
    <div>
      {/* ---------------- BOARD HEADER ---------------- */}
      <section className="relative border-b-[4px] border-ink bg-ink px-4 pb-0 pt-10 text-paper-2 md:px-8">
        <div aria-hidden className="absolute inset-0 halftone text-paper-2 opacity-[0.14]" />
        <div className="relative mx-auto max-w-[1240px]">
          <div className="flex flex-wrap items-start justify-between gap-8">
            <div>
              <Eyebrow className="!text-marigold">
                {showSaved ? "Your pinned nights" : filters.status === "open" ? "Open board" : "Full board"}
              </Eyebrow>
              <h1 className="mt-3 text-[clamp(2.6rem,7vw,5rem)] uppercase leading-[0.85]">The gig board</h1>
              <p className="mt-3 max-w-xl font-serif text-[19px] italic text-paper-3">
                Every flyer states the money before you load in.
              </p>
            </div>

            <div className="grid w-full grid-cols-3 border-[3px] border-paper-2/50 sm:w-auto">
              {[
                [results.length, results.length === 1 ? "night" : "nights"],
                [citiesInResults, citiesInResults === 1 ? "city" : "cities"],
                [topPay ? formatPayShort(topPay) : "—", "top pay"],
              ].map(([big, small], i) => (
                <div
                  key={small}
                  className={`px-4 py-3 ${i < 2 ? "border-r-[3px] border-paper-2/50" : ""}`}
                >
                  <p className="font-display text-[28px] leading-none text-marigold">{big}</p>
                  <p className="mt-1 font-mono text-[10px] font-bold uppercase tracking-[0.18em] text-paper-3">
                    {small}
                  </p>
                </div>
              ))}
            </div>
          </div>

          <div className="mt-8 flex flex-wrap items-center gap-2 border-t-[3px] border-paper-2/30 pt-4">
            {tabs.map((t) => {
              const isActive = tab === t.tab;
              return (
                <Link
                  key={t.tab}
                  href={tabHref(t.tab)}
                  className={`flex items-center gap-2 border-[3px] px-3 py-1.5 font-mono text-[11px] font-bold uppercase tracking-[0.14em] transition ${
                    isActive
                      ? "border-paper-2 bg-marigold text-ink"
                      : "border-paper-2/50 text-paper-2 hover:bg-paper-2 hover:text-ink"
                  }`}
                >
                  {t.label}
                  <span
                    className={`border px-1 py-[1px] text-[9.5px] leading-none ${
                      isActive ? "border-ink bg-ink text-marigold" : "border-paper-2/50"
                    }`}
                  >
                    {t.count}
                  </span>
                </Link>
              );
            })}
          </div>
        </div>
      </section>

      <div className="mx-auto grid max-w-[1240px] gap-8 px-4 py-10 md:px-8 lg:grid-cols-[290px_1fr]">
        {/* ---------------- CLIPBOARD ---------------- */}
        <aside className="lg:sticky lg:top-24 lg:max-h-[calc(100vh-7rem)] lg:self-start lg:overflow-y-auto lg:pb-3 lg:pr-2 lg:pt-3 lg:-mr-2">
          <button
            type="button"
            onClick={() => setFiltersOpen((v) => !v)}
            aria-expanded={filtersOpen}
            className="btn btn-ink w-full !py-3 lg:hidden"
          >
            {filtersOpen ? "Hide filters" : "Filters"}
            {active.length ? <span className="text-butter">{active.length}</span> : null}
            <IconBolt className="h-4 w-4" />
          </button>

          <div className={filtersOpen ? "mt-3" : "mt-3 hidden lg:mt-0 lg:block"}>
            <div className="relative">
              <span aria-hidden className="tape -top-3 left-7 -rotate-2" />
              <div className="paper-grain border-[3px] border-ink bg-paper-2 p-4 shadow-hard">
                <div className="flex items-start justify-between gap-3">
                  <div>
                    <p className="font-heavy text-[13px] uppercase tracking-[0.06em]">The clipboard</p>
                    <p className="mt-1 font-serif text-[13px] italic leading-tight text-ink-soft">
                      Pick a city, a floor, a seat.
                    </p>
                  </div>
                  <Link
                    href="/gigs"
                    className="shrink-0 border-b-2 border-tomato pb-[1px] font-mono text-[9.5px] font-bold uppercase tracking-[0.12em] text-ink"
                  >
                    reset
                  </Link>
                </div>

                <form
                  className="mt-4"
                  onSubmit={(e) => {
                    e.preventDefault();
                    const value = String(new FormData(e.currentTarget).get("q") ?? "").trim();
                    setOne("q", value);
                  }}
                >
                  <div className="relative">
                    <IconSearch className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-ink-soft" />
                    <input
                      key={filters.q ?? "q"}
                      name="q"
                      defaultValue={filters.q}
                      placeholder="sax, ghazal duo, room…"
                      aria-label="Search the board"
                      className="field !py-2 !pl-9 !pr-11 text-[14px]"
                    />
                    <button
                      type="submit"
                      aria-label="Search"
                      className="absolute right-1.5 top-1/2 flex h-8 w-8 -translate-y-1/2 items-center justify-center border-2 border-ink bg-ink text-paper-2 transition hover:bg-tomato"
                    >
                      <IconArrow className="h-4 w-4" />
                    </button>
                  </div>
                </form>

                <div className="mt-4 space-y-3">
                  <FilterSection
                    title="City"
                    count={filters.city ? 1 : 0}
                    open={open.city}
                    onToggle={() => toggleSection("city")}
                  >
                    <button
                      type="button"
                      aria-pressed={!filters.city}
                      onClick={() => setOne("city", "")}
                      className={`flex w-full items-center gap-2 border-2 border-ink px-2 py-1.5 text-left font-mono text-[10px] font-bold uppercase tracking-[0.1em] transition ${
                        !filters.city ? "bg-cobalt text-paper-2" : "bg-paper-3 hover:bg-butter"
                      }`}
                    >
                      <IconPin className="h-3.5 w-3.5 shrink-0" /> Anywhere in India
                    </button>
                    <div className="mt-1.5 grid grid-cols-2 gap-1.5">
                      {cities.map((c) => {
                        const on = filters.city === c.city;
                        return (
                          <button
                            key={c.city}
                            type="button"
                            aria-pressed={on}
                            onClick={() => setOne("city", on ? "" : c.city)}
                            className={`flex items-center gap-1.5 border-2 border-ink px-1.5 py-1.5 text-left transition ${
                              on ? "bg-cobalt text-paper-2" : "bg-paper-3 hover:bg-butter"
                            }`}
                          >
                            <IconPin className="h-3 w-3 shrink-0" />
                            <span className="min-w-0">
                              <span className="block truncate font-heavy text-[10.5px] uppercase leading-tight">
                                {c.city}
                              </span>
                              <span className="block font-mono text-[9px] uppercase tracking-[0.1em]">
                                {c.count} open
                              </span>
                            </span>
                          </button>
                        );
                      })}
                    </div>
                  </FilterSection>

                  <FilterSection
                    title="Pay floor"
                    count={filters.payMin ? 1 : 0}
                    open={open.pay}
                    onToggle={() => toggleSection("pay")}
                  >
                    <PaySlider
                      key={filters.payMin ?? 0}
                      value={filters.payMin ?? 0}
                      onCommit={(n) => setOne("pay", n > 0 ? n : "")}
                    />
                  </FilterSection>

                  <FilterSection
                    title="I play"
                    count={(filters.lineup ?? []).length}
                    open={open.play}
                    onToggle={() => toggleSection("play")}
                  >
                    <div className="grid grid-cols-2 gap-1.5">
                      {LINEUP.map((slot) => {
                        const on = filters.lineup?.includes(slot);
                        return (
                          <button
                            key={slot}
                            type="button"
                            aria-pressed={on}
                            onClick={() => toggleParam("lineup", slot)}
                            className={`flex items-start gap-1.5 border-2 border-ink px-1.5 py-1.5 text-left font-mono text-[9.5px] font-bold uppercase leading-tight tracking-[0.04em] transition ${
                              on ? "bg-ink text-paper-2" : "bg-paper-3 hover:bg-butter"
                            }`}
                          >
                            <span
                              aria-hidden
                              className={`mt-[1px] flex h-3 w-3 shrink-0 items-center justify-center border-2 ${
                                on ? "border-paper-2 bg-marigold text-ink" : "border-ink bg-paper-2"
                              }`}
                            >
                              {on ? <IconCheck className="h-2 w-2" /> : null}
                            </span>
                            {slot}
                          </button>
                        );
                      })}
                    </div>
                  </FilterSection>

                  <FilterSection
                    title="Genre"
                    count={(filters.genres ?? []).length}
                    open={open.genre}
                    onToggle={() => toggleSection("genre")}
                  >
                    <div className="flex flex-wrap gap-1.5">
                      {GENRES.map((genre) => {
                        const on = filters.genres?.includes(genre);
                        return (
                          <button
                            key={genre}
                            type="button"
                            aria-pressed={on}
                            onClick={() => toggleParam("genre", genre)}
                            className={`border-2 border-ink px-2 py-1 font-mono text-[9.5px] font-bold uppercase tracking-[0.05em] transition ${
                              on ? "bg-marigold text-ink" : "bg-paper-3 hover:bg-butter"
                            }`}
                          >
                            {genre}
                          </button>
                        );
                      })}
                    </div>
                  </FilterSection>

                  <FilterSection
                    title="Room offers"
                    count={(filters.perks ?? []).length}
                    open={open.offers}
                    onToggle={() => toggleSection("offers")}
                  >
                    <div className="grid grid-cols-2 gap-1.5">
                      {[
                        { value: "backline", label: "Backline", icon: <IconAmp className="h-4 w-4 shrink-0" /> },
                        { value: "meals", label: "Meal", icon: <IconPlate className="h-4 w-4 shrink-0" /> },
                        { value: "tips", label: "Tips", icon: <IconCash className="h-4 w-4 shrink-0" /> },
                        { value: "engineer", label: "Engineer", icon: <IconFader className="h-4 w-4 shrink-0" /> },
                      ].map((perk) => {
                        const on = filters.perks?.includes(perk.value);
                        return (
                          <button
                            key={perk.value}
                            type="button"
                            aria-pressed={on}
                            onClick={() => toggleParam("perk", perk.value)}
                            className={`flex items-center gap-1.5 border-2 border-ink px-1.5 py-2 text-left transition ${
                              on ? "bg-moss text-paper-2" : "bg-paper-3 hover:bg-butter"
                            }`}
                          >
                            {perk.icon}
                            <span className="font-mono text-[9.5px] font-bold uppercase tracking-[0.06em]">
                              {perk.label}
                            </span>
                          </button>
                        );
                      })}
                    </div>
                  </FilterSection>

                  <FilterSection
                    title="Night type"
                    count={filters.gigType ? 1 : 0}
                    open={open.type}
                    onToggle={() => toggleSection("type")}
                  >
                    <div className="grid grid-cols-2 gap-1.5">
                      {Object.entries(TYPE_LABEL).map(([value, label]) => {
                        const on = filters.gigType === value;
                        return (
                          <button
                            key={value}
                            type="button"
                            aria-pressed={on}
                            onClick={() => setOne("type", on ? "" : value)}
                            className={`border-2 border-ink px-1.5 py-2 font-mono text-[9.5px] font-bold uppercase tracking-[0.06em] transition ${
                              on ? "bg-ink text-paper-2" : "bg-paper-3 hover:bg-butter"
                            }`}
                          >
                            {label}
                          </button>
                        );
                      })}
                    </div>
                  </FilterSection>
                </div>

                <button
                  type="button"
                  onClick={() => {
                    setFiltersOpen(false);
                    window.setTimeout(() => {
                      document
                        .getElementById("board-results")
                        ?.scrollIntoView({ behavior: "smooth", block: "start" });
                    }, 140);
                  }}
                  className="btn btn-marigold mt-5 w-full lg:hidden"
                >
                  Show {results.length} {results.length === 1 ? "night" : "nights"} <IconArrow className="h-4 w-4" />
                </button>
              </div>
            </div>

            <div className="mt-5 hidden border-[3px] border-ink bg-butter p-4 shadow-hard-sm lg:block">
              <p className="font-mono text-[10px] font-bold uppercase tracking-[0.18em]">Open nights by city</p>
              <ul className="mt-3 space-y-2">
                {hot.map((h) => (
                  <li key={h.city}>
                    <Link
                      href={`/gigs?city=${encodeURIComponent(h.city)}`}
                      className="group flex items-center gap-2"
                      title={`${h.count} open nights in ${h.city}`}
                    >
                      <span className="w-[86px] shrink-0 font-heavy text-[10.5px] uppercase leading-tight group-hover:text-tomato">
                        {h.city}
                      </span>
                      <span aria-hidden className="flex items-center gap-[3px]">
                        {Array.from({ length: maxHot }).map((_, i) => (
                          <span
                            key={i}
                            className={`h-2 w-2 border-2 border-ink ${
                              i < h.count ? "bg-tomato group-hover:bg-cobalt" : "bg-paper-2"
                            }`}
                          />
                        ))}
                      </span>
                      <span className="ml-auto font-mono text-[10px] font-bold">{h.count}</span>
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </aside>

        {/* ---------------- RESULTS ---------------- */}
        <div id="board-results" className="scroll-mt-24">
          <div className="flex flex-wrap items-end justify-between gap-5 border-b-[3px] border-ink pb-5">
            <div className="min-w-0">
              <div className="flex items-center justify-between gap-3">
                <p className="label !mb-0">Free from</p>
                {filters.dateFrom ? (
                  <button
                    type="button"
                    onClick={() => setOne("from", "")}
                    className="border-b-2 border-tomato font-mono text-[9.5px] font-bold uppercase tracking-[0.12em] text-ink"
                  >
                    any day
                  </button>
                ) : null}
              </div>
              <div className="mt-2 flex gap-1 overflow-x-auto pb-1">
                {week.map((d, i) => {
                  const on = filters.dateFrom === d.iso;
                  return (
                    <button
                      key={d.iso}
                      type="button"
                      aria-pressed={on}
                      onClick={() => setOne("from", on ? "" : d.iso)}
                      className={`flex w-[44px] shrink-0 flex-col items-center border-2 border-ink py-1.5 transition ${
                        on ? "bg-ink text-paper-2" : "bg-paper-2 hover:bg-butter"
                      }`}
                    >
                      <span className="font-mono text-[9px] font-bold uppercase tracking-[0.08em]">
                        {i === 0 ? "Today" : d.weekday}
                      </span>
                      <span className="font-display text-[18px] leading-none">{d.day}</span>
                      <span className="font-mono text-[9px] uppercase tracking-[0.08em] opacity-70">{d.month}</span>
                    </button>
                  );
                })}
              </div>
            </div>

            <div>
              <p className="label">Sort</p>
              <div className="flex flex-wrap gap-1.5">
                {sorts.map((s) => {
                  const on = (filters.sort ?? "recent") === s.value;
                  return (
                    <button
                      key={s.value}
                      type="button"
                      aria-pressed={on}
                      onClick={() => setOne("sort", s.value === "recent" ? "" : s.value)}
                      className={`flex items-center gap-1.5 border-2 border-ink px-2.5 py-1.5 font-mono text-[10px] font-bold uppercase tracking-[0.1em] transition ${
                        on ? "bg-ink text-paper-2" : "bg-paper-2 hover:bg-butter"
                      }`}
                    >
                      {s.icon}
                      {s.label}
                    </button>
                  );
                })}
              </div>
            </div>
          </div>

          <div className="mt-4 flex flex-wrap items-center gap-2">
            <p className="mr-1 flex items-baseline gap-2">
              <span className="font-display text-[34px] leading-none">{results.length}</span>
              <span className="font-mono text-[10px] font-bold uppercase tracking-[0.18em] text-ink-soft">
                {results.length === 1 ? "night" : "nights"} on the wall
              </span>
            </p>
            {active.map((f) => (
              <button key={f.key} type="button" onClick={() => removeFilter(f)} className="group" title={`Remove ${f.label}`}>
                <Chip tone="ink">
                  {f.label}
                  <span className="ml-1 text-tomato group-hover:text-butter">✕</span>
                </Chip>
              </button>
            ))}
            {active.length ? (
              <Link href="/gigs" className="font-mono text-[10px] uppercase tracking-[0.14em] text-ink underline decoration-tomato decoration-2 underline-offset-2">
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
                Hit the bookmark on any flyer and it lands here, with deadlines and applicant counts.
              </p>
            </div>
          ) : null}

          {results.length === 0 && !showSaved ? (
            <div className="card relative mt-6 p-10 text-center">
              <Sticker bg="bg-tomato" text="text-paper-2" className="!absolute -top-4 left-1/2 -translate-x-1/2">
                nothing found
              </Sticker>
              <p className="mt-3 font-display text-[clamp(1.6rem,4vw,2.4rem)] uppercase leading-[0.9]">
                The wall is empty
              </p>
              <p className="mx-auto mt-3 max-w-md font-serif text-[19px] italic leading-snug text-ink-soft">
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
              <FlyerCard key={row.gig.id} row={row} saved={savedIds.includes(row.gig.id)} />
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
