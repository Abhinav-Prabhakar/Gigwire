"use client";

import Link from "next/link";
import { countGigs } from "@/lib/demo/data";
import { currentUser, currentVenue, useDemo } from "@/lib/demo/store";
import { PostGigForm } from "@/components/PostGigForm";
import { Chip, Eyebrow, IconArrow, IconBolt, IconCash, SectionHeading, Stamp, Sticker } from "@/components/ui";

export function PostClient() {
  const state = useDemo();
  const user = currentUser(state);
  const venue = currentVenue(state);
  const openCount = countGigs(state.data, { status: "open" });

  if (!user || user.role !== "venue") {
    return (
      <div className="mx-auto max-w-[1240px] px-4 py-16 md:px-8">
        <div className="grid gap-12 lg:grid-cols-[1fr_400px]">
          <div>
            <Eyebrow className="text-ink-soft">For rooms only</Eyebrow>
            <h1 className="mt-4 text-[clamp(2.4rem,6.4vw,4.6rem)] uppercase leading-[0.85]">
              A vacancy is
              <br />
              just a flyer
              <br />
              <span className="text-tomato">done properly</span>
            </h1>
            <p className="mt-6 max-w-xl text-[17px] leading-relaxed text-ink-soft">
              Date, money, lineup, curfew. That&apos;s the whole thing. Players filter by it, you reply in it, and
              nobody wastes a Tuesday night. Sign in as a room account to post, or make one — it takes two minutes and
              there is nothing to pay.
            </p>
            <div className="mt-8 flex flex-wrap gap-3">
              <Link href={`/signup?role=venue&next=${encodeURIComponent("/post")}`} className="btn btn-tomato !px-6 !py-3.5">
                Make a room account <IconArrow className="h-4 w-4" />
              </Link>
              <Link href="/login?next=%2Fpost" className="btn btn-ghost !px-6 !py-3.5">
                Log in as a room
              </Link>
            </div>
            <p className="mt-6 font-mono text-[10px] uppercase tracking-[0.14em] text-ink-soft">
              Static demo · this build keeps everything in your browser
            </p>
          </div>

          <div className="relative">
            <Sticker bg="bg-butter" text="text-ink" className="!absolute -left-4 -top-6 z-10">
              anatomy
            </Sticker>
            <div className="paper-grain rotate-1 border-[3px] border-ink bg-paper-2 p-5 shadow-hard-lg">
              <p className="font-mono text-[10px] font-bold uppercase tracking-[0.2em] text-ink-soft">
                What a good posting has
              </p>
              <ol className="mt-4 space-y-3">
                {[
                  ["Money first", "A number, per night/hour/set. Vague pay = vague bands."],
                  ["Exactly who's missing", "'Bassist and a horn', not 'musicians wanted'."],
                  ["The shape of the night", "Two 45s at 9 and 10:30. Say it."],
                  ["Curfew + noise rules", "The reason 80% of bar gigs go badly."],
                  ["Backline, meal, tips", "Free things you forget to mention."],
                ].map(([t, d], i) => (
                  <li key={t} className="flex gap-3 border-b-2 border-dashed border-ink/25 pb-3 last:border-0">
                    <span className="flex h-7 w-7 shrink-0 items-center justify-center border-[3px] border-ink bg-marigold font-heavy text-[11px]">
                      {i + 1}
                    </span>
                    <div>
                      <p className="font-heavy text-[13.5px] uppercase">{t}</p>
                      <p className="text-[14px] leading-snug text-ink-soft">{d}</p>
                    </div>
                  </li>
                ))}
              </ol>
              <div className="mt-5 flex items-center justify-between border-[3px] border-ink bg-ink px-3 py-2 text-paper-2">
                <span className="font-mono text-[10px] uppercase tracking-[0.14em]">open nights on the board</span>
                <span className="font-display text-[22px] leading-none">{openCount}</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div>
      <section className="relative border-b-[4px] border-ink bg-moss px-4 py-10 text-paper-2 md:px-8">
        <div aria-hidden className="absolute inset-0 halftone text-ink opacity-25" />
        <div className="relative mx-auto flex max-w-[1240px] flex-wrap items-end justify-between gap-6">
          <div>
            <Eyebrow className="!text-butter">Posting a night · {venue?.name ?? user.name}</Eyebrow>
            <h1 className="mt-3 text-[clamp(2.2rem,6vw,4.4rem)] uppercase leading-[0.85]">Write the flyer</h1>
          </div>
          <div className="flex flex-wrap items-center gap-2">
            <Stamp className="border-paper-2">Paid on the night</Stamp>
            <span className="chip border-paper-2 bg-paper-2 !text-ink">0% commission</span>
          </div>
        </div>
      </section>

      <div className="mx-auto max-w-[1240px] px-4 py-12 md:px-8">
        <PostGigForm
          venueName={venue?.name ?? user.name}
          defaults={{
            address: venue?.address ?? "",
            city: venue?.city ?? user.city ?? "",
            state: venue?.state ?? user.state ?? "",
          }}
        />

        <div className="mt-12 grid gap-4 sm:grid-cols-3">
          {[
            ["It stays up till you close it", "Mark a night filled in one click and it drops off the search board."],
            ["Applications land in your inbox", "One-sheet, link, and who's coming. Reply from the flyer page."],
            ["Your room profile auto-fills", `Flyers post under ${venue?.name ?? user.name} with your address and capacity.`],
          ].map(([t, d]) => (
            <div key={t} className="border-[3px] border-ink bg-paper-3 p-4">
              <IconBolt className="h-5 w-5 text-tomato" />
              <p className="mt-2 font-heavy text-[14px] uppercase leading-tight">{t}</p>
              <p className="mt-1.5 text-[14.5px] leading-snug text-ink-soft">{d}</p>
            </div>
          ))}
        </div>

        <div className="mt-10 flex flex-wrap items-center gap-3 border-t-[3px] border-dashed border-ink/40 pt-6">
          <Chip tone="ink">
            <IconCash className="h-3.5 w-3.5" /> We never touch the money
          </Chip>
          <Link href="/dashboard" className="btn btn-ghost">
            Your nights &amp; applications <IconArrow className="h-4 w-4" />
          </Link>
          <Link href="/how-it-works" className="btn btn-ghost">
            Cancellation rules
          </Link>
        </div>
      </div>
    </div>
  );
}
