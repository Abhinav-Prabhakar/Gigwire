import Link from "next/link";
import { Eyebrow, IconBolt, Stamp } from "@/components/ui";

export const dynamic = "force-dynamic";

const DEMO = [
  ["rosa@therustynailbar.com", "Rosa Villalobos · The Rusty Nail (room)"],
  ["delia@nightowlbookings.com", "Delia Fontaine · neo-soul trio (player)"],
  ["priya@hornline.co", "Priya Raghunathan · sax, available for subs (player)"],
  ["gerry@blueeyedoddfellows.com", "Gerry Mack · Blue Eyed Oddfellows (room)"],
];

export default async function LoginPage({
  searchParams,
}: {
  searchParams: Promise<{ next?: string; error?: string; notice?: string }>;
}) {
  const sp = await searchParams;
  const next = sp.next?.startsWith("/") ? sp.next : "/gigs";

  return (
    <div className="mx-auto grid max-w-[1240px] items-center gap-12 px-4 py-16 md:px-8 lg:grid-cols-[1.05fr_0.95fr]">
      <div>
        <Eyebrow className="text-ink-soft">Members of the wire</Eyebrow>
        <h1 className="mt-4 text-[clamp(2.6rem,7vw,5.2rem)] uppercase leading-[0.84]">
          Welcome
          <br />
          back to
          <br />
          <span className="text-tomato">the board</span>
        </h1>
        <p className="mt-6 max-w-md text-[17px] leading-relaxed text-ink-soft">
          Your saved nights, your applications and every reply a room has sent you live behind this door.
        </p>
        <div className="mt-8 max-w-md border-[3px] border-ink bg-butter p-5">
          <p className="font-heavy text-[13px] uppercase tracking-[0.06em]">Demo — one click, no typing</p>
          <p className="mt-1.5 text-[14px] leading-snug">
            Every account below uses the password <strong>gigwire</strong>. Pick a pair of shoes: a room with a gap in
            the diary, or a player with a van.
          </p>
          <div className="mt-4 space-y-2">
            {DEMO.map(([email, label]) => (
              <form key={email} action="/api/auth/login" method="post" className="flex items-center gap-2">
                <input type="hidden" name="intent" value="login" />
                <input type="hidden" name="email" value={email} />
                <input type="hidden" name="password" value="gigwire" />
                <input type="hidden" name="next" value={next} />
                <button className="flex w-full items-center gap-3 border-[3px] border-ink bg-paper-2 px-3 py-2 text-left transition hover:bg-ink hover:text-paper-2">
                  <span className="flex h-7 w-7 items-center justify-center border-2 border-ink bg-tomato text-paper-2">
                    <IconBolt className="h-4 w-4" />
                  </span>
                  <span className="font-mono text-[11px] font-bold uppercase tracking-[0.08em]">{label}</span>
                </button>
              </form>
            ))}
          </div>
        </div>
      </div>

      <div className="relative">
        <span aria-hidden className="tape -top-4 left-10 -rotate-3" />
        <form
          action="/api/auth/login"
          method="post"
          className="paper-grain ruled border-[3px] border-ink bg-paper-2 p-7 shadow-hard-lg"
        >
          <div className="flex items-center justify-between gap-3">
            <p className="font-display text-[26px] leading-none">LOG IN</p>
            <Stamp>Form 12-B</Stamp>
          </div>

          {sp.error ? (
            <p className="mt-4 border-[3px] border-ink bg-tomato px-3 py-2 font-mono text-[11px] font-bold uppercase text-paper-2">
              {sp.error}
            </p>
          ) : null}
          {sp.notice ? (
            <p className="mt-4 border-2 border-dashed border-ink px-3 py-2 font-mono text-[11px] uppercase">{sp.notice}</p>
          ) : null}

          <input type="hidden" name="intent" value="login" />
          <input type="hidden" name="next" value={next} />

          <label className="mt-5 block">
            <span className="label">Email on the account</span>
            <input name="email" type="email" required className="field" placeholder="you@yourband.com" />
          </label>
          <label className="mt-4 block">
            <span className="label">Password</span>
            <input name="password" type="password" required className="field" placeholder="gigwire" />
          </label>

          <button className="btn btn-ink mt-6 w-full !py-3.5">Open the board</button>
          <p className="mt-4 text-center text-[14px]">
            New here?{" "}
            <Link href="/signup" className="font-bold underline decoration-tomato decoration-2 underline-offset-4">
              Make an account — it&apos;s free
            </Link>
          </p>
        </form>
      </div>
    </div>
  );
}
