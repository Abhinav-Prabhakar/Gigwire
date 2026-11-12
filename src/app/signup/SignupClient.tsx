"use client";

import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { SignupForm } from "@/components/SignupForm";
import { useDemo } from "@/lib/demo/store";
import { Eyebrow, IconCheck, Polaroid, Stamp } from "@/components/ui";
import { PHOTOS } from "@/lib/media";

export function SignupClient() {
  const params = useSearchParams();
  const state = useDemo();
  const nextParam = params.get("next");
  const next = nextParam && nextParam.startsWith("/") && !nextParam.startsWith("//") ? nextParam : "/gigs";
  const role = params.get("role") ?? undefined;

  const players = state.data.users.filter((u) => u.role === "musician").length;
  const rooms = state.data.venues.length;
  const open = state.data.gigs.filter((g) => ["open", "interviewing"].includes(g.status)).length;

  return (
    <div>
      <section className="relative overflow-hidden border-b-[4px] border-ink bg-marigold px-4 py-10 md:px-8">
        <div aria-hidden className="absolute inset-0 halftone text-ink opacity-30" />
        <div className="relative mx-auto flex max-w-[1240px] flex-wrap items-end justify-between gap-6">
          <div>
            <Eyebrow className="text-ink">Join the wire</Eyebrow>
            <h1 className="mt-3 text-[clamp(2.4rem,6.5vw,4.8rem)] uppercase leading-[0.84]">
              Two minutes now.
              <br />
              Friday night later.
            </h1>
          </div>
          <div className="w-[190px] rotate-[4deg]">
            <Polaroid src={PHOTOS.bandTogether} rotate="0deg" caption="signup, no card" />
          </div>
        </div>
      </section>

      <div className="mx-auto grid max-w-[1240px] gap-10 px-4 py-14 md:px-8 lg:grid-cols-[1fr_340px]">
        <div className="relative">
          <span aria-hidden className="tape -top-4 left-14 rotate-2" />
          <div className="paper-grain border-[3px] border-ink bg-paper-2 p-6 shadow-hard-lg md:p-8">
            <div className="flex items-center justify-between gap-3">
              <h2 className="text-[clamp(1.8rem,4vw,2.6rem)] uppercase">New account</h2>
              <Stamp>Form 01-A</Stamp>
            </div>
            <div className="mt-6">
              <SignupForm next={next} initialRole={role} />
            </div>
            <p className="mt-5 text-center text-[14px]">
              Already on the board?{" "}
              <Link href="/login" className="font-bold underline decoration-tomato decoration-2 underline-offset-4">
                Log in
              </Link>
            </p>
            <p className="mt-2 text-center font-mono text-[9px] uppercase tracking-[0.12em] text-ink-soft">
              Static demo · accounts live in your browser
            </p>
          </div>
        </div>

        <aside className="space-y-5">
          <div className="border-[3px] border-ink bg-ink p-5 text-paper-2">
            <p className="font-mono text-[10px] font-bold uppercase tracking-[0.2em] text-marigold">Board right now</p>
            <div className="mt-3 space-y-2 font-display text-[30px] leading-none">
              <p>
                {open} <span className="font-mono text-[11px] uppercase tracking-[0.14em] text-paper-3">open nights</span>
              </p>
              <p>
                {players} <span className="font-mono text-[11px] uppercase tracking-[0.14em] text-paper-3">players</span>
              </p>
              <p>
                {rooms} <span className="font-mono text-[11px] uppercase tracking-[0.14em] text-paper-3">rooms</span>
              </p>
            </div>
          </div>

          <div className="border-[3px] border-ink bg-sky p-5">
            <p className="font-heavy text-[14px] uppercase">What you get</p>
            <ul className="mt-3 space-y-2 text-[15px] leading-snug">
              {[
                "A one-sheet players can actually read",
                "Saved gigs with a deadline and an applicant count",
                "Reply statuses instead of silence",
                "Pay agreed before anybody loads in",
              ].map((t) => (
                <li key={t} className="flex gap-2">
                  <IconCheck className="mt-0.5 h-4 w-4 shrink-0 text-moss" /> {t}
                </li>
              ))}
            </ul>
          </div>

          <div className="border-[3px] border-ink bg-tomato px-4 py-3 text-paper-2">
            <p className="text-center font-mono text-[10px] font-bold uppercase leading-relaxed tracking-[0.12em]">
              No commission · No listing fee · No cut of your door
            </p>
          </div>
        </aside>
      </div>
    </div>
  );
}
