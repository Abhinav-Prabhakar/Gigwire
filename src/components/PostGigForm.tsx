"use client";

import { useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { GENRES, LINEUP, formatGigDate, formatPay, relativeDay, timeRange } from "@/lib/format";
import { postGig } from "@/lib/demo/store";
import { Chip } from "@/components/ui";

type State = {
  title: string;
  gigDate: string;
  startTime: string;
  endTime: string;
  payAmount: string;
  payUnit: string;
  payNote: string;
  setsCount: string;
  spots: string;
  gigType: string;
  experience: string;
  genres: string[];
  lineupNeeded: string[];
  description: string;
  requirements: string;
  address: string;
  city: string;
  state: string;
  backline: boolean;
  meals: boolean;
  tips: boolean;
  soundEngineer: boolean;
};

const toggle = (list: string[], value: string) =>
  list.includes(value) ? list.filter((x) => x !== value) : [...list, value];

export function PostGigForm({ venueName, defaults }: { venueName: string; defaults: Partial<State> }) {
  const router = useRouter();
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [s, setS] = useState<State>({
    title: "",
    gigDate: "",
    startTime: "9:00 PM",
    endTime: "12:00 AM",
    payAmount: "12000",
    payUnit: "flat",
    payNote: "",
    setsCount: "2",
    spots: "1",
    gigType: "one_off",
    experience: "any",
    genres: [],
    lineupNeeded: [],
    description: "",
    requirements: "",
    address: "",
    city: "",
    state: "",
    backline: true,
    meals: true,
    tips: true,
    soundEngineer: false,
    ...defaults,
  });
  const set = <K extends keyof State>(k: K, v: State[K]) => setS((prev) => ({ ...prev, [k]: v }));

  const preview = useMemo(
    () => ({
      id: 0,
      venueId: 0,
      title: s.title || "Your headline goes here",
      description: s.description,
      requirements: s.requirements,
      gigDate: /^\d{4}-\d{2}-\d{2}$/.test(s.gigDate) ? s.gigDate : new Date().toISOString().slice(0, 10),
      startTime: s.startTime,
      endTime: s.endTime,
      payAmount: Number.parseInt(s.payAmount || "0", 10),
      payUnit: s.payUnit,
      payNote: s.payNote,
      setsCount: Number.parseInt(s.setsCount || "2", 10),
      gigType: s.gigType,
      genres: s.genres,
      lineupNeeded: s.lineupNeeded,
      experience: s.experience,
      backline: s.backline,
      meals: s.meals,
      tips: s.tips,
      soundEngineer: s.soundEngineer,
      address: s.address,
      city: s.city,
      state: s.state,
      status: "open",
      featured: false,
      spots: Number.parseInt(s.spots || "1", 10),
      createdAt: new Date(),
    }),
    [s],
  );

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    setBusy(true);
    setError(null);
    try {
      const result = postGig({
        title: s.title,
        gigDate: s.gigDate,
        startTime: s.startTime,
        endTime: s.endTime,
        payAmount: Number.parseInt(s.payAmount || "0", 10),
        payUnit: s.payUnit,
        payNote: s.payNote,
        setsCount: Number.parseInt(s.setsCount || "2", 10),
        spots: Number.parseInt(s.spots || "1", 10),
        gigType: s.gigType,
        experience: s.experience,
        genres: s.genres,
        lineupNeeded: s.lineupNeeded,
        description: s.description,
        requirements: s.requirements,
        address: s.address,
        city: s.city,
        state: s.state,
        backline: s.backline,
        meals: s.meals,
        tips: s.tips,
        soundEngineer: s.soundEngineer,
      });
      if (!result.ok) {
        setError(result.error ?? "Something went sideways. Check the highlighted fields.");
        return;
      }
      router.push("/dashboard");
    } catch {
      setError("Something went sideways — the flyer wasn't posted.");
    } finally {
      setBusy(false);
    }
  }

  const d = formatGigDate(preview.gigDate);

  return (
    <div className="grid gap-8 lg:grid-cols-[1fr_360px]">
      <form onSubmit={submit} className="space-y-7">
        <input type="hidden" name="next" value="/dashboard" />

        <Section n="01" title="The night">
          <label className="block">
            <span className="label">Headline — what a player is applying for</span>
            <input
              value={s.title}
              onChange={(e) => set("title", e.target.value)}
              className="field !text-[17px]"
              placeholder="Friday house trio — keys, bass, drums"
              required
              minLength={6}
            />
          </label>
          <div className="mt-4 grid gap-4 sm:grid-cols-4">
            <Field label="Date">
              <input
                type="date"
                value={s.gigDate}
                onChange={(e) => set("gigDate", e.target.value)}
                className="field"
                required
              />
            </Field>
            <Field label="Start">
              <input value={s.startTime} onChange={(e) => set("startTime", e.target.value)} className="field" placeholder="9:00 PM" />
            </Field>
            <Field label="Finish">
              <input value={s.endTime} onChange={(e) => set("endTime", e.target.value)} className="field" placeholder="12:30 AM" />
            </Field>
            <Field label="Sets">
              <input type="number" min={1} max={8} value={s.setsCount} onChange={(e) => set("setsCount", e.target.value)} className="field" />
            </Field>
          </div>
          <div className="mt-4 grid gap-4 sm:grid-cols-3">
            <Field label="What kind of slot">
              <select value={s.gigType} onChange={(e) => set("gigType", e.target.value)} className="field">
                <option value="one_off">One-off night</option>
                <option value="residency">Weekly residency</option>
                <option value="sub">Sub / fill-in</option>
                <option value="opener">Opening slot</option>
              </select>
            </Field>
            <Field label="Players needed">
              <input type="number" min={1} max={12} value={s.spots} onChange={(e) => set("spots", e.target.value)} className="field" />
            </Field>
            <Field label="Experience">
              <select value={s.experience} onChange={(e) => set("experience", e.target.value)} className="field">
                <option value="any">Any level</option>
                <option value="pro">Working pros only</option>
                <option value="beginner_ok">Beginners welcome</option>
              </select>
            </Field>
          </div>
        </Section>

        <Section n="02" title="The money">
          <div className="grid gap-4 sm:grid-cols-3">
            <Field label="Amount (₹)">
              <input type="number" min={0} step={10} value={s.payAmount} onChange={(e) => set("payAmount", e.target.value)} className="field !text-[19px]" required />
            </Field>
            <Field label="Paid as">
              <select value={s.payUnit} onChange={(e) => set("payUnit", e.target.value)} className="field">
                <option value="flat">Flat, per night</option>
                <option value="hour">Per hour</option>
                <option value="set">Per set</option>
              </select>
            </Field>
            <Field label="Extra note (optional)">
              <input value={s.payNote} onChange={(e) => set("payNote", e.target.value)} className="field" placeholder="plus 100% of the door over 80" />
            </Field>
          </div>
          <p className="mt-3 border-l-[6px] border-moss pl-3 font-serif text-[16px] italic leading-snug">
            Post the number you can actually pay tonight. Flyers with a real figure get roughly four times the
            applications of “share + door”.
          </p>
        </Section>

        <Section n="03" title="Who you need">
          <p className="label">Genres the room wants</p>
          <div className="flex flex-wrap gap-1.5">
            {GENRES.map((g) => (
              <button
                type="button"
                key={g}
                onClick={() => set("genres", toggle(s.genres, g))}
                className={`border-2 border-ink px-2 py-1 font-mono text-[10px] font-bold uppercase tracking-[0.06em] transition ${
                  s.genres.includes(g) ? "bg-tomato text-paper-2" : "bg-paper-3 hover:bg-butter"
                }`}
              >
                {g}
              </button>
            ))}
          </div>
          <p className="label mt-5">Seats to fill</p>
          <div className="flex flex-wrap gap-1.5">
            {LINEUP.map((l) => (
              <button
                type="button"
                key={l}
                onClick={() => set("lineupNeeded", toggle(s.lineupNeeded, l))}
                className={`border-2 border-ink px-2 py-1 font-mono text-[10px] font-bold uppercase tracking-[0.06em] transition ${
                  s.lineupNeeded.includes(l) ? "bg-cobalt text-paper-2" : "bg-paper-3 hover:bg-sky"
                }`}
              >
                {l}
              </button>
            ))}
          </div>
          <p className="label mt-5">What&apos;s in the room</p>
          <div className="grid gap-2 sm:grid-cols-4">
            {(
              [
                ["backline", "Backline provided"],
                ["meals", "Meal on arrival"],
                ["tips", "Tip jar"],
                ["soundEngineer", "House engineer"],
              ] as const
            ).map(([key, label]) => (
              <button
                type="button"
                key={key}
                onClick={() => set(key, !s[key])}
                className={`flex items-center gap-2 border-[3px] border-ink px-3 py-2 text-left font-mono text-[10px] font-bold uppercase tracking-[0.08em] transition ${
                  s[key] ? "bg-moss text-paper-2" : "bg-paper-2"
                }`}
              >
                <span className={`flex h-4 w-4 items-center justify-center border-2 border-ink ${s[key] ? "bg-paper-2" : "bg-paper-3"}`}>
                  {s[key] ? "✓" : ""}
                </span>
                {label}
              </button>
            ))}
          </div>
        </Section>

        <Section n="04" title="The fine print">
          <Field label="What the night is actually like">
            <textarea
              rows={5}
              value={s.description}
              onChange={(e) => set("description", e.target.value)}
              className="field resize-y"
              placeholder="Two 50-minute sets, room fills at 9:30, we need standards not originals, load-in through the alley…"
            />
          </Field>
          <label className="mt-4 block">
            <span className="label">Non-negotiables</span>
            <textarea
              rows={3}
              value={s.requirements}
              onChange={(e) => set("requirements", e.target.value)}
              className="field resize-y"
              placeholder="No backing tracks. Curfew is hard at 1AM. Bring your own cables."
            />
          </label>
          <div className="mt-4 grid gap-4 sm:grid-cols-3">
            <Field label="Address">
              <input value={s.address} onChange={(e) => set("address", e.target.value)} className="field" placeholder={defaults.address ?? "12 Rampart Row, Kala Ghoda"} />
            </Field>
            <Field label="City">
              <input value={s.city} onChange={(e) => set("city", e.target.value)} className="field" placeholder={defaults.city ?? "Mumbai"} />
            </Field>
            <Field label="State">
              <input value={s.state} onChange={(e) => set("state", e.target.value)} className="field" placeholder={defaults.state ?? "MH"} />
            </Field>
          </div>
        </Section>

        {error ? (
          <p className="border-[3px] border-ink bg-tomato px-4 py-3 font-mono text-[11px] font-bold uppercase tracking-[0.1em] text-paper-2">
            {error}
          </p>
        ) : null}

        <div className="flex flex-wrap items-center gap-3">
          <button className="btn btn-ink !px-8 !py-4 !text-[15px]" disabled={busy}>
            {busy ? "Pinning it up…" : "Post it to the board"}
          </button>
          <span className="font-mono text-[10px] uppercase tracking-[0.12em] text-ink-soft">
            Free · takes about 90 seconds · edit or close any time
          </span>
        </div>
      </form>

      {/* live preview */}
      <aside className="lg:sticky lg:top-24 lg:self-start">
        <p className="font-mono text-[10px] font-bold uppercase tracking-[0.2em] text-ink-soft">
          How players see it
        </p>
        <div className="mt-3 -rotate-1">
          <div className="paper-grain relative border-[3px] border-ink bg-paper-2 shadow-hard">
            <div className="flex items-start gap-3 border-b-[3px] border-ink bg-paper-3/70 p-3.5">
              <div className="flex w-[74px] shrink-0 flex-col items-center border-[3px] border-ink bg-marigold px-1 py-1.5">
                <span className="font-mono text-[10px] font-bold tracking-[0.16em]">{d.weekday}</span>
                <span className="font-display text-[30px] leading-[0.9]">{d.day}</span>
                <span className="font-mono text-[10px] font-bold tracking-[0.16em]">{d.month}</span>
              </div>
              <div className="min-w-0">
                <p className="truncate font-mono text-[11px] font-bold uppercase tracking-[0.14em] text-ink-soft">
                  {venueName}
                </p>
                <h3 className="mt-1 font-heavy text-[17px] leading-[1.15]">{preview.title}</h3>
                <p className="mt-2 font-mono text-[10px] uppercase tracking-[0.1em] text-ink-soft">
                  {preview.city ? `${preview.city}${preview.state ? `, ${preview.state}` : ""} · ` : ""}
                  {timeRange(preview.startTime, preview.endTime)} · {relativeDay(preview.gigDate)}
                </p>
              </div>
            </div>
            <div className="space-y-3 p-3.5">
              <div className="flex flex-wrap gap-1.5">
                {preview.genres.length === 0 && preview.lineupNeeded.length === 0 ? (
                  <Chip>No genre picked — players will skim past. Add at least one.</Chip>
                ) : null}
                {preview.genres.map((g) => (
                  <Chip key={g} className="bg-tomato !text-paper-2">
                    {g}
                  </Chip>
                ))}
                {preview.lineupNeeded.map((l) => (
                  <Chip key={l} className="bg-sky">
                    {l}
                  </Chip>
                ))}
              </div>
              {preview.description ? (
                <p className="line-clamp-3 text-[14.5px] leading-snug text-ink-soft">{preview.description}</p>
              ) : (
                <p className="font-serif text-[16px] italic text-ink-soft">
                  Tell them what the room feels like on that night — that&apos;s what wins the good bands.
                </p>
              )}
            </div>
            <div className="flex items-center justify-between border-t-[3px] border-ink bg-paper-3/80 px-3.5 py-2.5">
              <span className="font-display text-[24px] leading-none text-moss">
                {formatPay(preview.payAmount, preview.payUnit).replace(/ .*/, "")}
              </span>
              <span className="font-mono text-[10px] font-bold uppercase tracking-[0.12em] text-ink-soft">
                {preview.setsCount} sets · {preview.spots} needed
              </span>
            </div>
          </div>
        </div>
      </aside>
    </div>
  );
}

function Section({ n, title, children }: { n: string; title: string; children: React.ReactNode }) {
  return (
    <section className="relative border-[3px] border-ink bg-paper-2 p-5 shadow-hard-sm">
      <div className="mb-4 flex items-center gap-3 border-b-[3px] border-dashed border-ink/40 pb-3">
        <span className="flex h-8 w-8 items-center justify-center border-[3px] border-ink bg-marigold font-heavy text-[12px]">
          {n}
        </span>
        <h2 className="text-[clamp(1.4rem,3vw,2rem)] uppercase leading-none">{title}</h2>
      </div>
      {children}
    </section>
  );
}

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <label className="block">
      <span className="label">{label}</span>
      {children}
    </label>
  );
}
