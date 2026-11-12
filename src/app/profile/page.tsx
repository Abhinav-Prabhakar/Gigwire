import Link from "next/link";
import { getCurrentUser } from "@/lib/auth";
import { getVenueByOwner, getSavedGigs, getMusicianApplications } from "@/lib/data";
import { formatGigDate, formatPay, relativeDay } from "@/lib/format";
import { GigCard } from "@/components/GigCard";
import {
  Chip,
  DateBlock,
  Eyebrow,
  IconArrow,
  IconCheck,
  IconMusic,
  SectionHeading,
  Stamp,
  Sticker,
} from "@/components/ui";

export const dynamic = "force-dynamic";

const STATUS_TONE: Record<string, string> = {
  pending: "bg-butter",
  viewed: "bg-sky",
  accepted: "bg-moss !text-paper-2",
  declined: "bg-paper-3 opacity-70",
  withdrawn: "bg-paper-3 opacity-60",
};

export default async function ProfilePage({
  searchParams,
}: {
  searchParams: Promise<{ saved?: string; error?: string }>;
}) {
  const sp = await searchParams;
  const user = await getCurrentUser();
  if (!user) {
    return (
      <div className="mx-auto max-w-[620px] px-4 py-24 text-center md:px-8">
        <h1 className="text-[clamp(2rem,5vw,3.2rem)] uppercase leading-[0.86]">Sign in to see your sheet</h1>
        <p className="mt-4 text-[16px] text-ink-soft">Saved nights, applications and your one-sheet live in here.</p>
        <div className="mt-7 flex justify-center gap-3">
          <Link href="/login?next=%2Fprofile" className="btn btn-tomato">
            Log in
          </Link>
          <Link href="/signup?role=musician" className="btn btn-ghost">
            Make an account
          </Link>
        </div>
      </div>
    );
  }

  const isVenue = user.role === "venue";
  const [venue, savedGigs, apps] = await Promise.all([
    isVenue ? getVenueByOwner(user.id) : Promise.resolve(null),
    isVenue ? Promise.resolve([]) : getSavedGigs(user.id),
    isVenue ? Promise.resolve([]) : getMusicianApplications(user.id),
  ]);

  const booked = apps.filter((a) => a.application.status === "accepted").length;
  const waiting = apps.filter((a) => a.application.status === "pending").length;

  return (
    <div>
      <section className="relative border-b-[4px] border-ink bg-cobalt px-4 py-12 text-paper-2 md:px-8">
        <div aria-hidden className="absolute inset-0 halftone text-ink opacity-25" />
        <div className="relative mx-auto flex max-w-[1240px] flex-wrap items-end justify-between gap-8">
          <div>
            <Eyebrow className="!text-butter">{isVenue ? "Room profile" : "Player one-sheet"}</Eyebrow>
            <h1 className="mt-3 text-[clamp(2.2rem,6vw,4.4rem)] uppercase leading-[0.85]">{user.name}</h1>
            <p className="mt-2 max-w-lg font-serif text-[19px] italic text-paper-3">
              {user.headline ?? venue?.tagline ?? "No headline yet — tell bookers what you are in six words."}
            </p>
          </div>
          <div className="flex flex-wrap gap-3">
            {!isVenue ? (
              <>
                <Stat n={apps.length} label="sent" />
                <Stat n={waiting} label="waiting on a room" />
                <Stat n={booked} label="booked" />
              </>
            ) : (
              <Link href="/post" className="btn btn-marigold">
                Post a night <IconArrow className="h-4 w-4" />
              </Link>
            )}
          </div>
        </div>
      </section>

      <div className="mx-auto grid max-w-[1240px] gap-8 px-4 py-12 md:px-8 lg:grid-cols-[1fr_380px]">
        <div>
          {isVenue ? (
            <SectionHeading kicker="Your room" title="The details players see" className="max-w-xl" />
          ) : (
            <>
              <div className="flex flex-wrap items-end justify-between gap-3">
                <SectionHeading kicker="Application tracker" title="Where everything stands" />
              </div>
              <div className="mt-6 space-y-3">
                {apps.length === 0 ? (
                  <div className="card p-8 text-center">
                    <IconMusic className="mx-auto h-7 w-7 text-tomato" />
                    <p className="mt-3 font-heavy text-[17px] uppercase">No one-sheets out yet</p>
                    <p className="mt-2 text-[15px] text-ink-soft">
                      Pick a night on the board and send it. Two sentences and a link is enough.
                    </p>
                    <Link href="/gigs" className="btn btn-tomato mt-5">
                      Search the board <IconArrow className="h-4 w-4" />
                    </Link>
                  </div>
                ) : null}

                {apps.map((a) => {
                  const d = formatGigDate(a.gig?.gigDate ?? new Date().toISOString().slice(0, 10));
                  return (
                    <article
                      key={a.application.id}
                      className="flex flex-wrap items-center gap-4 border-[3px] border-ink bg-paper-2 p-4 shadow-hard-sm"
                    >
                      <DateBlock weekday={d.weekday} day={d.day} month={d.month} bg="bg-paper-3" />
                      <div className="min-w-0 flex-1">
                        <p className="font-mono text-[10.5px] uppercase tracking-[0.14em] text-ink-soft">
                          {a.gig?.city} · {relativeDay(a.gig?.gigDate ?? d.long)} ·{" "}
                          {a.gig ? formatPay(a.gig.payAmount, a.gig.payUnit) : ""}
                        </p>
                        <h3 className="mt-1 font-heavy text-[16px] leading-tight">
                          <Link href={`/gigs/${a.gig?.id}`} className="underline decoration-tomato decoration-[3px] underline-offset-4">
                            {a.gig?.title}
                          </Link>
                        </h3>
                        <p className="mt-1 line-clamp-1 text-[14px] text-ink-soft">{a.application.pitch}</p>
                      </div>
                      <div className="flex flex-col items-end gap-2">
                        <span className={`chip ${STATUS_TONE[a.application.status] ?? ""}`}>
                          {a.application.status === "pending" ? "waiting on room" : a.application.status}
                        </span>
                        {a.application.status !== "withdrawn" && a.application.status !== "accepted" ? (
                          <form action={`/api/applications/${a.application.id}`} method="post">
                            <input type="hidden" name="status" value="withdrawn" />
                            <input type="hidden" name="next" value="/profile" />
                            <button className="font-mono text-[10px] uppercase tracking-[0.12em] text-tomato underline">
                              withdraw
                            </button>
                          </form>
                        ) : null}
                      </div>
                    </article>
                  );
                })}
              </div>

              <div id="saved" className="mt-14">
                <div className="flex flex-wrap items-end justify-between gap-3">
                  <h2 className="text-[clamp(1.8rem,4.4vw,3rem)] uppercase">Pinned nights</h2>
                  <Sticker bg="bg-butter" text="text-ink" rotate="-2deg">
                    {savedGigs.length} saved
                  </Sticker>
                </div>
                {savedGigs.length ? (
                  <div className="mt-6 grid gap-6 sm:grid-cols-2">
                    {savedGigs.map((row) => (
                      <GigCard key={row.gig.id} row={row} saved />
                    ))}
                  </div>
                ) : (
                  <p className="mt-4 border-[3px] border-dashed border-ink/50 p-6 text-[15px] text-ink-soft">
                    Nothing pinned. The bookmark on any card sends a night here so you can compare two rooms side by
                    side.
                  </p>
                )}
              </div>
            </>
          )}
        </div>

        {/* ---- edit panel ---- */}
        <aside className="lg:sticky lg:top-24 lg:self-start">
          <form
            action="/api/me"
            method="post"
            className="paper-grain border-[3px] border-ink bg-paper-2 p-5 shadow-hard"
          >
            <div className="flex items-center justify-between gap-3">
              <p className="font-display text-[26px] leading-none">EDIT YOUR SHEET</p>
              <Stamp>rev. A</Stamp>
            </div>
            <p className="mt-1 font-mono text-[10px] uppercase tracking-[0.14em] text-ink-soft">
              {user.email} · {isVenue ? "room account" : "player account"}
            </p>

            {sp.saved || sp.error ? (
              <p
                className={`mt-4 flex items-center gap-2 border-[3px] border-ink px-3 py-2 font-mono text-[11px] font-bold uppercase ${
                  sp.error ? "bg-tomato text-paper-2" : "bg-moss text-paper-2"
                }`}
              >
                {sp.error ? null : <IconCheck className="h-4 w-4" />} {sp.error ?? "Saved. Bookers see it now."}
              </p>
            ) : null}

            <input type="hidden" name="next" value="/profile" />

            <div className="mt-5 space-y-4">
              <Field label="Name / band">
                <input name="name" defaultValue={user.name} className="field" required />
              </Field>
              <Field label="Headline">
                <input
                  name="headline"
                  defaultValue={user.headline ?? ""}
                  placeholder="6-piece Motown revue, two singers, horns"
                  className="field"
                />
              </Field>
              <div className="grid grid-cols-2 gap-3">
                <Field label="City">
                  <input name="city" defaultValue={user.city ?? ""} className="field" />
                </Field>
                <Field label="State">
                  <input name="state" defaultValue={user.state ?? ""} className="field" />
                </Field>
              </div>
              <Field label="One link">
                <input name="links" defaultValue={user.links ?? ""} placeholder="live video, bandcamp…" className="field" />
              </Field>
              <Field label="Roles you bring (comma separated)">
                <input name="instruments" defaultValue={user.instruments.join(", ")} placeholder="Duo, Horns" className="field" />
              </Field>
              <Field label="Your genres">
                <input name="genres" defaultValue={user.genres.join(", ")} placeholder="Jazz, Soul / Funk" className="field" />
              </Field>
              <Field label="Short bio">
                <textarea name="bio" rows={4} defaultValue={user.bio ?? ""} className="field resize-y" />
              </Field>

              {isVenue ? (
                <div className="space-y-4 border-t-[3px] border-dashed border-ink/40 pt-4">
                  <p className="font-heavy text-[12px] uppercase tracking-[0.08em] text-tomato">Your room</p>
                  <Field label="Room name">
                    <input name="venueName" defaultValue={venue?.name ?? ""} className="field" />
                  </Field>
                  <Field label="Tagline">
                    <input name="venueTagline" defaultValue={venue?.tagline ?? ""} className="field" />
                  </Field>
                  <Field label="Address">
                    <input name="venueAddress" defaultValue={venue?.address ?? ""} className="field" />
                  </Field>
                  <div className="grid grid-cols-2 gap-3">
                    <Field label="Capacity">
                      <input name="venueCapacity" type="number" min={20} defaultValue={venue?.capacity ?? 90} className="field" />
                    </Field>
                    <Field label="Cover photo URL">
                      <input name="venueCover" defaultValue={venue?.coverUrl ?? ""} className="field" placeholder="https://…" />
                    </Field>
                  </div>
                  <Field label="What the room is like">
                    <textarea name="venueDescription" rows={4} defaultValue={venue?.description ?? ""} className="field resize-y" />
                  </Field>
                </div>
              ) : null}
            </div>

            <button className="btn btn-ink mt-6 w-full">Save the sheet</button>
            <div className="mt-4 flex flex-wrap gap-2">
              {(user.genres.length ? user.genres : ["Add genres to your sheet"]).map((g) => (
                <Chip key={g} tone={user.genres.length ? "tomato" : "ink"}>
                  {g}
                </Chip>
              ))}
            </div>
          </form>

          <div className="mt-5 border-[3px] border-ink bg-ink p-5 text-paper-2">
            <p className="font-mono text-[10px] font-bold uppercase tracking-[0.2em] text-marigold">Sheet maths</p>
            <p className="mt-2 font-serif text-[18px] italic leading-snug">
              {isVenue
                ? "Rooms that state the pay get four times the replies. Rooms that reply within 24 hours get the good bands."
                : "Sheets with a live video get booked. Sheets with a résumé get skipped."}
            </p>
          </div>
        </aside>
      </div>
    </div>
  );
}

function Stat({ n, label }: { n: number; label: string }) {
  return (
    <div className="border-[3px] border-paper-2 bg-ink px-4 py-2">
      <p className="font-display text-[26px] leading-none text-butter">{n}</p>
      <p className="mt-0.5 font-mono text-[9px] uppercase tracking-[0.14em] text-paper-3">{label}</p>
    </div>
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
