"use client";

import { useState } from "react";
import { GENRES, LINEUP } from "@/lib/format";

export function SignupForm({
  next,
  initialRole = "musician",
}: {
  next: string;
  initialRole?: string;
}) {
  const [role, setRole] = useState(initialRole === "venue" ? "venue" : "musician");
  const [genres, setGenres] = useState<string[]>([]);
  const [instruments, setInstruments] = useState<string[]>([]);
  const toggle = (list: string[], set: (v: string[]) => void, value: string) =>
    set(list.includes(value) ? list.filter((x) => x !== value) : [...list, value]);

  return (
    <form action="/api/auth/signup" method="post" className="space-y-4">
      <input type="hidden" name="intent" value="signup" />
      <input type="hidden" name="role" value={role} />
      <input type="hidden" name="next" value={next} />
      {genres.map((g) => (
        <input key={`g-${g}`} type="hidden" name="genres" value={g} />
      ))}
      {instruments.map((i) => (
        <input key={`i-${i}`} type="hidden" name="instruments" value={i} />
      ))}

      <div className="grid grid-cols-2 gap-3">
        {(
          [
            ["musician", "I play", "Search gigs, apply, get booked"],
            ["venue", "I have a room", "Post vacancies, read applications"],
          ] as const
        ).map(([value, title, sub]) => (
          <button
            type="button"
            key={value}
            onClick={() => setRole(value)}
            className={`border-[3px] border-ink p-3 text-left transition ${
              role === value ? "bg-ink text-paper-2 shadow-hard-sm" : "bg-paper-2 hover:bg-butter"
            }`}
          >
            <span className="block font-heavy text-[14px] uppercase tracking-[0.04em]">{title}</span>
            <span className="mt-1 block font-mono text-[10px] uppercase leading-tight tracking-[0.06em] opacity-80">
              {sub}
            </span>
          </button>
        ))}
      </div>

      <div className="grid gap-4 sm:grid-cols-2">
        <label className="block">
          <span className="label">{role === "venue" ? "Your name" : "Your name / band name"}</span>
          <input name="name" required className="field" placeholder={role === "venue" ? "Rosa Villalobos" : "The Night Owls"} />
        </label>
        <label className="block">
          <span className="label">Email</span>
          <input name="email" type="email" required className="field" placeholder="you@room.com" />
        </label>
        <label className="block">
          <span className="label">Password (6+ characters)</span>
          <input name="password" type="password" required minLength={6} className="field" />
        </label>
        <div className="grid grid-cols-2 gap-3">
          <label className="block">
            <span className="label">City</span>
            <input name="city" className="field" placeholder="Oakland" />
          </label>
          <label className="block">
            <span className="label">State</span>
            <input name="state" className="field" placeholder="CA" />
          </label>
        </div>
      </div>

      {role === "musician" ? (
        <>
          <label className="block">
            <span className="label">Headline (what a booker reads first)</span>
            <input name="headline" className="field" placeholder="Motown revival 6-piece · two singers, horns" />
          </label>
          <label className="block">
            <span className="label">One link</span>
            <input name="links" className="field" placeholder="live video, bandcamp, instagram…" />
          </label>
          <label className="block">
            <span className="label">Short bio</span>
            <textarea name="bio" rows={3} className="field resize-y" placeholder="Who's in the band, what you need, how far you'll drive." />
          </label>
          <fieldset>
            <legend className="label">I play / I bring</legend>
            <div className="flex flex-wrap gap-1.5">
              {LINEUP.map((slot) => (
                <button
                  type="button"
                  key={slot}
                  onClick={() => toggle(instruments, setInstruments, slot)}
                  className={`border-2 border-ink px-2 py-1 font-mono text-[10px] font-bold uppercase tracking-[0.06em] transition ${
                    instruments.includes(slot) ? "bg-cobalt text-paper-2" : "bg-paper-3 hover:bg-sky"
                  }`}
                >
                  {slot}
                </button>
              ))}
            </div>
          </fieldset>
        </>
      ) : (
        <>
          <div className="grid gap-4 sm:grid-cols-2">
            <label className="block">
              <span className="label">Room name</span>
              <input name="venueName" className="field" placeholder="The Rusty Nail" />
            </label>
            <label className="block">
              <span className="label">Tagline</span>
              <input name="venueTagline" className="field" placeholder="Two rooms, one very old piano" />
            </label>
            <label className="block">
              <span className="label">Address</span>
              <input name="venueAddress" className="field" placeholder="1187 Peralta St" />
            </label>
            <label className="block">
              <span className="label">Capacity</span>
              <input name="venueCapacity" type="number" min={20} defaultValue={90} className="field" />
            </label>
          </div>
          <label className="block">
            <span className="label">What the room is like</span>
            <textarea name="venueDescription" rows={3} className="field resize-y" placeholder="Backline, curfew, crowd, how you pay." />
          </label>
        </>
      )}

      <fieldset>
        <legend className="label">{role === "venue" ? "We usually book" : "Our sound"}</legend>
        <div className="flex flex-wrap gap-1.5">
          {GENRES.map((genre) => (
            <button
              type="button"
              key={genre}
              onClick={() => toggle(genres, setGenres, genre)}
              className={`border-2 border-ink px-2 py-1 font-mono text-[10px] font-bold uppercase tracking-[0.06em] transition ${
                genres.includes(genre) ? "bg-tomato text-paper-2" : "bg-paper-3 hover:bg-butter"
              }`}
            >
              {genre}
            </button>
          ))}
        </div>
      </fieldset>

      <button className="btn btn-tomato w-full !py-4 !text-[15px]">Pin me to the board</button>
      <p className="text-center font-mono text-[10px] uppercase tracking-[0.12em] text-ink-soft">
        No card. No commission. Delete it all whenever you like.
      </p>
    </form>
  );
}
