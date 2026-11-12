"use client";

import Link from "next/link";
import { useState } from "react";
import { getApplicationsForGig } from "@/lib/demo/data";
import {
  applyToGig,
  currentUser,
  setApplicationStatus,
  setGigStatus,
  useDemo,
} from "@/lib/demo/store";
import { SaveGigForm } from "@/components/GigCard";
import { IconArrow, IconBolt, IconCheck, Stamp } from "@/components/ui";

export function ApplyRail({
  gigId,
  venueName,
  ownerId,
  status,
  appCount,
}: {
  gigId: number;
  venueName: string;
  ownerId: number | null;
  status: string;
  appCount: number;
}) {
  const state = useDemo();
  const user = currentUser(state);
  const [sent, setSent] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const isOwner = user?.role === "venue" && ownerId === user.id;
  const myApp = user
    ? state.data.applications.find((a) => a.gigId === gigId && a.musicianId === user.id) ?? null
    : null;
  const saved = user ? state.data.bookmarks.some((b) => b.musicianId === user.id && b.gigId === gigId) : false;

  return (
    <>
      <div className="paper-grain border-[3px] border-ink bg-paper-2 p-5 shadow-hard">
        <div className="flex items-start justify-between gap-3">
          <div>
            <p className="font-mono text-[10px] font-bold uppercase tracking-[0.2em] text-ink-soft">
              Apply in 30 seconds
            </p>
            <p className="mt-1 font-display text-[30px] leading-none">Send your one-sheet</p>
          </div>
          <Stamp className="border-tomato text-tomato">{status}</Stamp>
        </div>

        {status === "filled" && !isOwner ? (
          <div className="mt-4 border-[3px] border-ink bg-paper-3 p-4">
            <p className="font-heavy text-[15px] uppercase">Somebody already has this night</p>
            <p className="mt-2 text-[15px] leading-snug">
              The room marked it filled. Pin it anyway and we&apos;ll keep you posted if it opens back up.
            </p>
          </div>
        ) : isOwner ? (
          <div className="mt-4 space-y-3">
            <p className="text-[15px]">
              You posted this night. Change its state below or read the {appCount} applications on the flyer.
            </p>
            {(["open", "interviewing", "filled", "closed"] as const).map((s) => (
              <button
                key={s}
                onClick={() => setGigStatus(gigId, s)}
                className={`btn w-full ${status === s ? "btn-ink" : "btn-ghost"}`}
              >
                Mark {s}
              </button>
            ))}
            <Link href="/post" className="btn btn-tomato w-full">
              Post another night
            </Link>
          </div>
        ) : myApp || sent ? (
          <div className="mt-4 border-[3px] border-ink bg-sky p-4">
            <p className="font-heavy text-[15px] uppercase">Already in the pile</p>
            <p className="mt-2 text-[15px] leading-snug">
              {myApp
                ? `Sent ${new Date(myApp.createdAt).toLocaleDateString("en-IN", {
                    month: "short",
                    day: "numeric",
                  })} · status `
                : "One-sheet sent. "}
              <strong className="uppercase">{myApp?.status ?? "pending"}</strong>
            </p>
            <Link href="/profile" className="btn btn-ink mt-3 w-full">
              Open my tracker <IconArrow className="h-4 w-4" />
            </Link>
          </div>
        ) : user ? (
          <form
            onSubmit={(e) => {
              e.preventDefault();
              const fd = new FormData(e.currentTarget);
              const result = applyToGig(gigId, {
                pitch: String(fd.get("pitch") ?? ""),
                lineup: String(fd.get("lineup") ?? ""),
                links: String(fd.get("links") ?? ""),
              });
              if (!result.ok) {
                setError(result.error ?? "Something went sideways.");
                return;
              }
              setError(null);
              setSent(true);
            }}
            className="mt-4 space-y-3"
          >
            <div className="flex items-center gap-2 border-2 border-ink bg-paper-3 px-2.5 py-1.5">
              <span className="flex h-7 w-7 items-center justify-center border-2 border-ink bg-tomato font-heavy text-[11px] text-paper-2">
                {user.name.slice(0, 2).toUpperCase()}
              </span>
              <span className="font-mono text-[11px] font-bold uppercase tracking-[0.1em]">{user.name}</span>
            </div>
            <div>
              <label className="label" htmlFor="lineup">
                Who&apos;s coming
              </label>
              <input
                id="lineup"
                name="lineup"
                defaultValue={user.instruments.join(" / ") || "Solo act"}
                className="field"
              />
            </div>
            <div>
              <label className="label" htmlFor="links">
                Link they should click
              </label>
              <input
                id="links"
                name="links"
                defaultValue={user.links ?? ""}
                placeholder="bandcamp, live video, instagram"
                className="field"
              />
            </div>
            <div>
              <label className="label" htmlFor="pitch">
                Note to the booker
              </label>
              <textarea
                id="pitch"
                name="pitch"
                rows={4}
                defaultValue={user.headline ? `${user.headline}. ` : ""}
                className="field resize-y"
                placeholder="Set length you need, what you bring, when you can soundcheck."
              />
            </div>
            {error ? (
              <p className="border-[3px] border-ink bg-tomato px-3 py-2 font-mono text-[10px] font-bold uppercase text-paper-2">
                {error}
              </p>
            ) : null}
            <button className="btn btn-tomato w-full !py-3.5">
              Send it to {venueName} <IconBolt className="h-4 w-4" />
            </button>
            <p className="font-mono text-[10px] uppercase tracking-[0.1em] text-ink-soft">
              No cover letters. Two sentences and a link beats a PDF.
            </p>
          </form>
        ) : (
          <div className="mt-4 space-y-3">
            <p className="text-[15px] leading-snug">
              Log in as a player to apply, save this night, and track replies in one place.
            </p>
            <Link href={`/signup?role=musician&next=${encodeURIComponent(`/gigs/${gigId}`)}`} className="btn btn-tomato w-full">
              Free player account
            </Link>
            <Link href={`/login?next=${encodeURIComponent(`/gigs/${gigId}`)}`} className="btn btn-ghost w-full">
              I already have one
            </Link>
          </div>
        )}
      </div>

      <div className="flex items-center justify-between gap-3 border-[3px] border-ink bg-paper-3 p-3">
        <p className="font-mono text-[11px] font-bold uppercase tracking-[0.12em]">
          {saved ? "Pinned to your board" : "Not tonight? Pin it"}
        </p>
        <SaveGigForm gigId={gigId} saved={saved} next={`/gigs/${gigId}`} />
      </div>

      <div className="border-[3px] border-ink bg-ink p-5 text-paper-2">
        <p className="font-mono text-[10px] font-bold uppercase tracking-[0.2em] text-marigold">The GIGWIRE pledge</p>
        <ul className="mt-3 space-y-2.5 text-[14.5px] leading-snug">
          {[
            "The pay number on the flyer is the pay number.",
            "Rooms must reply — unanswered slots expire after 14 days.",
            "Zero commission. Cancelled inside 48 hours means half the money.",
          ].map((line) => (
            <li key={line} className="flex gap-2">
              <IconCheck className="mt-0.5 h-4 w-4 shrink-0 text-butter" />
              <span>{line}</span>
            </li>
          ))}
        </ul>
      </div>
    </>
  );
}

export function OwnerApplications({ gigId, ownerId }: { gigId: number; ownerId: number | null }) {
  const state = useDemo();
  const user = currentUser(state);
  const isOwner = user?.role === "venue" && ownerId === user.id;
  if (!isOwner) return null;

  const apps = getApplicationsForGig(state.data, gigId);
  if (!apps.length) return null;

  return (
    <section className="border-t-[4px] border-ink bg-ink px-4 py-14 text-paper-2 md:px-8">
      <div className="mx-auto max-w-[1240px]">
        <h2 className="text-[clamp(1.8rem,4vw,2.8rem)] uppercase">
          {apps.length} one-sheet{apps.length === 1 ? "" : "s"} for this night
        </h2>
        <div className="mt-8 grid gap-5 md:grid-cols-2">
          {apps.map((a) => (
            <div key={a.application.id} className="paper-grain border-[3px] border-paper-2 bg-ink p-5">
              <div className="flex items-start justify-between gap-3">
                <div>
                  <p className="font-heavy text-[17px] uppercase">{a.musician?.name}</p>
                  <p className="font-mono text-[11px] uppercase tracking-[0.1em] text-marigold">
                    {a.musician?.headline ?? "Player"} · {a.musician?.city ?? "—"}
                  </p>
                </div>
                <span className="border-2 border-paper-2 px-2 py-0.5 font-mono text-[10px] uppercase">
                  {a.application.status}
                </span>
              </div>
              <p className="mt-3 text-[15px] leading-snug text-paper-3">{a.application.pitch}</p>
              <p className="mt-2 font-mono text-[11px] uppercase tracking-[0.1em]">
                {a.application.lineup}
                {a.application.links ? ` · ${a.application.links}` : ""}
              </p>
              <div className="mt-4 flex flex-wrap gap-2">
                {(["accepted", "viewed", "declined"] as const).map((s) => (
                  <button
                    key={s}
                    onClick={() => setApplicationStatus(a.application.id, s)}
                    className={`border-2 border-paper-2 px-3 py-1 font-mono text-[10px] font-bold uppercase tracking-[0.12em] transition hover:bg-marigold hover:text-ink ${
                      a.application.status === s ? "bg-paper-2 text-ink" : "text-paper-2"
                    }`}
                  >
                    {s === "accepted" ? "Book them" : s === "viewed" ? "Mark read" : "Pass"}
                  </button>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
