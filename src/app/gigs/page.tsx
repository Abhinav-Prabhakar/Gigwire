import { Suspense } from "react";
import type { Metadata } from "next";
import { GigsClient } from "./GigsClient";
import { Eyebrow } from "@/components/ui";
import { pageUrl } from "@/lib/site";

export const metadata: Metadata = {
  title: "The gig board",
  description:
    "Browse open live music gigs across India — Mumbai, Bengaluru, Delhi, Goa, Pune and Kolkata. Filter by city, date, pay floor and the seat the room is missing.",
  alternates: { canonical: pageUrl("/gigs") },
};

export default function GigsPage() {
  return (
    <Suspense fallback={<BoardSkeleton />}>
      <GigsClient />
    </Suspense>
  );
}

function BoardSkeleton() {
  return (
    <div>
      <section className="relative border-b-[4px] border-ink bg-ink px-4 py-10 text-paper-2 md:px-8">
        <div aria-hidden className="absolute inset-0 halftone text-paper-2 opacity-[0.14]" />
        <div className="relative mx-auto max-w-[1240px]">
          <Eyebrow className="!text-marigold">Open board</Eyebrow>
          <h1 className="mt-3 text-[clamp(2.6rem,7vw,5rem)] uppercase leading-[0.85]">The gig board</h1>
          <p className="mt-3 font-serif text-[19px] italic text-paper-3">Pinning the notices up…</p>
        </div>
      </section>
      <div className="mx-auto max-w-[1240px] px-4 py-10 md:px-8">
        <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-3">
          {[0, 1, 2, 3, 4, 5].map((i) => (
            <div key={i} className="h-72 animate-pulse border-[3px] border-ink bg-paper-3/60" />
          ))}
        </div>
      </div>
    </div>
  );
}
