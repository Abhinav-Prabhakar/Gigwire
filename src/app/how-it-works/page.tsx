import Link from "next/link";
import { getStats } from "@/lib/data";
import { formatPay } from "@/lib/format";
import {
  Chip,
  Eyebrow,
  IconBolt,
  IconCash,
  IconCheck,
  IconClock,
  IconMusic,
  IconUsers,
  Marquee,
  Polaroid,
  SectionHeading,
  Squiggle,
  Stamp,
  Sticker,
} from "@/components/ui";
import { PHOTOS } from "@/lib/media";

export const dynamic = "force-dynamic";

export const metadata = { title: "How the board works" };

const FAQ = [
  [
    "Who pays what?",
    "Nobody pays GIGwire. Rooms post for free, players apply for free, and the money on the flyer is the money handed over after load-out — cash or transfer, agreed before you say yes. We never touch the door.",
  ],
  [
    "What if a room cancels?",
    "Our pledge asks rooms to cancel at least 72 hours out. Inside 48 hours of doors, the agreed figure is halved and paid. It isn't a legal contract, it's a reputation: rooms that break it get flagged on their flyer and players stop answering.",
  ],
  [
    "Do I need to be a 'professional'?",
    "No. Every posting carries a level tag — Anyone welcome, Any level, or Working pros. Open-mic and originals nights exist so that the second band you've ever been in can play a real room.",
  ],
  [
    "How do I not get ghosted?",
    "Every application has a visible state: sent → viewed → booked or passed. Rooms that never reply get a slower feed rank. If a night is filled, it disappears from search instead of sitting there pretending.",
  ],
  [
    "Can I post a sub for tonight?",
    "That's the whole reason the board exists. Post it, tag it 'one-night sub', and it appears at the top of every player's feed in your city with a NOW marker.",
  ],
  [
    "What's a one-sheet?",
    "Six lines: who's in the band, what it sounds like, what you need from the room, one link, and the nights you're free. It's on your profile and it's what gets attached when you apply.",
  ],
];

export default async function HowItWorks() {
  const stats = await getStats();

  return (
    <div>
      <section className="relative overflow-hidden border-b-[4px] border-ink bg-cobalt px-4 py-16 text-paper-2 md:px-8">
        <div aria-hidden className="absolute inset-0 halftone text-ink opacity-25" />
        <div aria-hidden className="absolute -bottom-24 -right-16 h-72 w-72 rounded-full bg-marigold/80 halftone text-ink" />
        <div className="relative mx-auto grid max-w-[1240px] items-end gap-10 lg:grid-cols-[1.2fr_0.8fr]">
          <div>
            <Eyebrow className="!text-butter">Rules of the board</Eyebrow>
            <h1 className="mt-4 text-[clamp(2.6rem,7.6vw,5.6rem)] uppercase leading-[0.84]">
              How a night
              <br />
              actually gets
              <br />
              <span className="stroke-text-paper">booked</span>
            </h1>
            <p className="mt-6 max-w-xl text-[18px] leading-relaxed text-paper-3">
              Four moves. A room writes the flyer, a player pins their sheet, the room says yes, and money changes
              hands in the car park. Everything else on this site is decoration — except the parts that keep score.
            </p>
            <div className="mt-8 flex flex-wrap gap-2">
              <Chip tone="ink">{stats.openGigs} live nights</Chip>
              <Chip tone="ink">{stats.venues} rooms</Chip>
              <Chip tone="ink">{stats.musicians} players</Chip>
              <Chip tone="ink">$0 commission</Chip>
            </div>
          </div>
          <div className="relative">
            <Polaroid
              src={PHOTOS.smokyStudio}
              rotate="3deg"
              tone="bg-paper-2"
              caption="load-out, 12:40am, paid"
              className="shadow-hard-lg"
            />
          </div>
        </div>
      </section>

      <div className="border-b-[3px] border-ink bg-ink py-2 text-marigold">
        <Marquee
          items={[
            "state the money",
            "say who's missing",
            "reply within 24 hours",
            "pay before load-out",
            "cancel with notice",
          ].map((t) => (
            <span key={t} className="font-display text-[24px] uppercase leading-none">
              {t}
            </span>
          ))}
        />
      </div>

      <section className="mx-auto max-w-[1240px] px-4 py-16 md:px-8">
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
          {[
            {
              icon: <IconMusic className="h-6 w-6" />,
              n: "01",
              title: "Room writes a flyer",
              body: "Date, set lengths, money, who's missing, the curfew. Ninety seconds, and it stays up until you close it.",
              tone: "bg-butter",
            },
            {
              icon: <IconUsers className="h-6 w-6" />,
              n: "02",
              title: "Players filter & apply",
              body: "They search by city, pay floor and lineup gap, then send a one-sheet — not a résumé, not a manifesto.",
              tone: "bg-sky",
            },
            {
              icon: <IconClock className="h-6 w-6" />,
              n: "03",
              title: "Room replies in the open",
              body: "Marked read, booked, or passed. The status is visible to the player, so silence stops being a strategy.",
              tone: "bg-bubblegum text-paper-2",
            },
            {
              icon: <IconCash className="h-6 w-6" />,
              n: "04",
              title: "Money in the car park",
              body: "The number on the flyer, paid after the last set. Tips on top. No invoice net-60, no 'accounting week'.",
              tone: "bg-moss text-paper-2",
            },
          ].map((step, i) => (
            <div
              key={step.n}
              style={{ transform: `rotate(${i % 2 ? 1 : -1}deg)` }}
              className={`paper-grain relative border-[3px] border-ink p-5 shadow-hard transition hover:rotate-0 ${step.tone}`}
            >
              <span aria-hidden className="tape -top-3 right-6 rotate-6" />
              <div className="flex items-center justify-between">
                {step.icon}
                <Stamp>{step.n}</Stamp>
              </div>
              <h2 className="mt-4 text-[clamp(1.4rem,2.6vw,1.9rem)] uppercase leading-[0.9]">{step.title}</h2>
              <p className="mt-3 text-[15px] leading-snug">{step.body}</p>
            </div>
          ))}
        </div>
      </section>

      <div className="text-tomato">
        <Squiggle />
      </div>

      <section className="mx-auto grid max-w-[1240px] gap-12 px-4 py-16 md:px-8 lg:grid-cols-[1fr_360px]">
        <div>
          <SectionHeading kicker="The small print, said out loud" title="Questions people actually ask" />
          <div className="mt-8 space-y-3">
            {FAQ.map(([q, a]) => (
              <details
                key={q}
                className="group border-[3px] border-ink bg-paper-2 p-5 shadow-hard-sm open:bg-butter"
              >
                <summary className="flex cursor-pointer list-none items-center justify-between gap-4">
                  <span className="font-heavy text-[16px] uppercase leading-tight">{q}</span>
                  <span className="flex h-7 w-7 shrink-0 items-center justify-center border-[3px] border-ink bg-paper-3 font-heavy group-open:bg-tomato group-open:text-paper-2">
                    +
                  </span>
                </summary>
                <p className="mt-3 max-w-2xl text-[16px] leading-relaxed text-ink-soft">{a}</p>
              </details>
            ))}
          </div>
        </div>

        <aside className="space-y-5">
          <div className="paper-grain relative border-[3px] border-ink bg-ink p-6 text-paper-2 shadow-hard">
            <Sticker bg="bg-marigold" text="text-ink" rotate="-4deg" className="!absolute -right-3 -top-4">
              the pledge
            </Sticker>
            <p className="font-display text-[30px] leading-none">Three rules</p>
            <ol className="mt-5 space-y-3.5">
              {[
                "The pay number on the flyer is the pay number.",
                "Every application gets a status, not silence.",
                "Cancel late, pay half. Break it twice and we say so.",
              ].map((t, i) => (
                <li key={t} className="flex gap-3">
                  <span className="flex h-7 w-7 shrink-0 items-center justify-center border-2 border-paper-2 font-heavy text-[12px] text-marigold">
                    {i + 1}
                  </span>
                  <span className="text-[15.5px] leading-snug text-paper-3">{t}</span>
                </li>
              ))}
            </ol>
          </div>

          <div className="border-[3px] border-ink bg-paper-2 p-5">
            <p className="font-heavy text-[14px] uppercase">Good flyers include</p>
            <ul className="mt-3 space-y-2">
              {[
                "Set lengths and changeover time",
                "What the room provides (backline, DI, mics)",
                "Load-in door and parking situation",
                "Whether you'll pay a guarantee or a split",
                "Anything about the crowd worth knowing",
              ].map((t) => (
                <li key={t} className="flex gap-2 text-[14.5px] leading-snug">
                  <IconCheck className="mt-0.5 h-4 w-4 shrink-0 text-moss" /> {t}
                </li>
              ))}
            </ul>
          </div>

          <div className="flex flex-wrap gap-3 border-[3px] border-ink bg-marigold p-5">
            <Link href="/post" className="btn btn-ink">
              <IconBolt className="h-4 w-4" /> Post a night
            </Link>
            <Link href="/gigs" className="btn btn-tomato">
              Browse {stats.openGigs} gigs
            </Link>
            <p className="mt-2 font-mono text-[10px] uppercase tracking-[0.12em] text-ink-soft">
              {formatPay(stats.paid, "flat")} currently promised on the board
            </p>
          </div>
        </aside>
      </section>
    </div>
  );
}
