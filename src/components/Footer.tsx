import Link from "next/link";
import { Marquee, IconBolt } from "@/components/ui";

export function Footer() {
  return (
    <footer className="relative mt-24 border-t-[4px] border-ink bg-ink text-paper-2">
      <div className="border-b-[3px] border-paper-2/25 py-2 text-marigold">
        <Marquee
          reverse
          slow
          items={[
            <span key="1" className="font-display text-[26px] uppercase leading-none">
              Tape it up. Show up. Get paid.
            </span>,
            <span key="2" className="font-display text-[26px] uppercase leading-none stroke-text-paper">
              Gigwire
            </span>,
          ]}
        />
      </div>
      <div className="mx-auto grid max-w-[1240px] gap-10 px-4 py-14 md:grid-cols-4 md:px-8">
        <div className="md:col-span-2">
          <div className="flex items-center gap-2.5">
            <span className="flex h-9 w-9 items-center justify-center border-[3px] border-paper-2 bg-tomato text-paper-2">
              <IconBolt className="h-5 w-5" />
            </span>
            <span className="font-display text-[28px] leading-none">
              GIG<span className="text-marigold">WIRE</span>
            </span>
          </div>
          <p className="mt-4 max-w-md font-serif text-[19px] italic leading-snug text-paper-3">
            A bulletin board for rooms that need a band on Friday and players who need rent by
            Monday. No agents. No commissions. No “we’ll get back to you”.
          </p>
          <div className="mt-6 flex flex-wrap gap-2">
            {["Oakland", "Chicago", "Brooklyn", "Austin", "Portland", "New Orleans"].map((c) => (
              <Link
                key={c}
                href={`/gigs?city=${encodeURIComponent(c)}`}
                className="border-2 border-paper-2/50 px-2.5 py-1 font-mono text-[10px] font-bold uppercase tracking-[0.14em] transition hover:bg-marigold hover:text-ink"
              >
                {c}
              </Link>
            ))}
          </div>
        </div>

        {[
          {
            title: "For musicians",
            links: [
              ["Search open gigs", "/gigs"],
              ["Saved gigs", "/profile#saved"],
              ["Application tracker", "/profile"],
              ["Build a one-sheet", "/signup?role=musician"],
            ],
          },
          {
            title: "For rooms",
            links: [
              ["Post a vacancy", "/post"],
              ["Your applications", "/dashboard"],
              ["Claim your venue", "/signup?role=venue"],
              ["Pay guarantee rules", "/how-it-works"],
            ],
          },
        ].map((col) => (
          <div key={col.title}>
            <p className="font-mono text-[10px] font-bold uppercase tracking-[0.24em] text-marigold">
              {col.title}
            </p>
            <ul className="mt-4 space-y-2.5">
              {col.links.map(([label, href]) => (
                <li key={label}>
                  <Link
                    href={href}
                    className="text-[15px] font-semibold text-paper-3 transition hover:text-paper-2 hover:underline"
                  >
                    {label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        ))}
      </div>

      <div className="border-t-[3px] border-paper-2/25 px-4 py-5 md:px-8">
        <div className="mx-auto flex max-w-[1240px] flex-wrap items-center justify-between gap-3">
          <p className="font-mono text-[10px] uppercase tracking-[0.2em] text-paper-3">
            © {new Date().getFullYear()} Gigwire — printed on the internet
          </p>
          <p className="font-mono text-[10px] uppercase tracking-[0.2em] text-paper-3">
            Set in Anton, Archivo Black & Space Mono · halftone included free
          </p>
        </div>
      </div>
    </footer>
  );
}
