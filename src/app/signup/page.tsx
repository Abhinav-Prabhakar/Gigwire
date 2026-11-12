import Link from "next/link";
import { SignupForm } from "@/components/SignupForm";
import { db } from "@/db";
import { gigs, users } from "@/db/schema";
import { sql } from "drizzle-orm";
import { Eyebrow, IconCheck, Marquee, Polaroid, Stamp } from "@/components/ui";
import { PHOTOS } from "@/lib/media";

export const dynamic = "force-dynamic";

export default async function SignupPage({
  searchParams,
}: {
  searchParams: Promise<{ role?: string; next?: string; error?: string }>;
}) {
  const sp = await searchParams;
  const next = sp.next?.startsWith("/") ? sp.next : "/gigs";

  const [counts] = await db
    .select({
      players: sql<number>`(select count(*)::int from users where role = 'musician')`,
      rooms: sql<number>`(select count(*)::int from venues)`,
      open: sql<number>`(select count(*)::int from gigs where status in ('open','interviewing'))`,
    })
    .from(users)
    .limit(1);

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
            {sp.error ? (
              <p className="mt-4 border-[3px] border-ink bg-tomato px-3 py-2 font-mono text-[11px] font-bold uppercase text-paper-2">
                {sp.error}
              </p>
            ) : null}
            <div className="mt-6">
              <SignupForm next={next} initialRole={sp.role} />
            </div>
            <p className="mt-5 text-center text-[14px]">
              Already on the board?{" "}
              <Link href="/login" className="font-bold underline decoration-tomato decoration-2 underline-offset-4">
                Log in
              </Link>
            </p>
          </div>
        </div>

        <aside className="space-y-5">
          <div className="border-[3px] border-ink bg-ink p-5 text-paper-2">
            <p className="font-mono text-[10px] font-bold uppercase tracking-[0.2em] text-marigold">Board right now</p>
            <div className="mt-3 space-y-2 font-display text-[30px] leading-none">
              <p>
                {counts?.open ?? 0} <span className="font-mono text-[11px] uppercase tracking-[0.14em] text-paper-3">open nights</span>
              </p>
              <p>
                {counts?.players ?? 0} <span className="font-mono text-[11px] uppercase tracking-[0.14em] text-paper-3">players</span>
              </p>
              <p>
                {counts?.rooms ?? 0} <span className="font-mono text-[11px] uppercase tracking-[0.14em] text-paper-3">rooms</span>
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

          <div className="border-[3px] border-ink bg-tomato px-3 py-2 text-paper-2">
            <Marquee
              slow
              items={[
                <span key="m" className="font-mono text-[11px] font-bold uppercase tracking-[0.18em]">
                  no commission · no listing fee · no percentage of your door
                </span>,
              ]}
            />
          </div>
        </aside>
      </div>
    </div>
  );
}
