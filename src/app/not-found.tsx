import Link from "next/link";
import { IconArrow, IconMusic, Sticker } from "@/components/ui";

export default function NotFound() {
  return (
    <div className="mx-auto grid max-w-[900px] place-items-center px-4 py-24 text-center md:px-8">
      <div className="relative">
        <Sticker bg="bg-tomato" text="text-paper-2" rotate="-6deg" className="!absolute -right-6 -top-6">
          wrong room
        </Sticker>
        <div className="paper-grain border-[3px] border-ink bg-paper-2 px-10 py-14 shadow-hard-lg">
          <p className="font-mono text-[11px] font-bold uppercase tracking-[0.24em] text-ink-soft">Error 404</p>
          <h1 className="mt-4 text-[clamp(3rem,10vw,6rem)] uppercase leading-[0.82]">
            Nothing
            <br />
            on this
            <br />
            <span className="text-tomato">wall</span>
          </h1>
          <p className="mx-auto mt-6 max-w-md text-[16px] leading-relaxed text-ink-soft">
            That flyer has been torn down, the night got filled, or the link had a typo in it. The board is still
            full of rooms looking for somebody.
          </p>
          <div className="mt-8 flex flex-wrap justify-center gap-3">
            <Link href="/gigs" className="btn btn-tomato">
              <IconMusic className="h-4 w-4" /> Browse open gigs
            </Link>
            <Link href="/" className="btn btn-ghost">
              Back to the front page <IconArrow className="h-4 w-4" />
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
