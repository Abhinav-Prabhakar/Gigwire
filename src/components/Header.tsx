"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { Marquee, IconBolt } from "@/components/ui";
import { currentUser, signOut, useDemo } from "@/lib/demo/store";

export function Header() {
  const router = useRouter();
  const state = useDemo();
  const user = currentUser(state);
  const dashboard = user?.role === "venue" ? "/dashboard" : "/profile";

  const nav = [
    { href: "/gigs", label: "Find a gig" },
    { href: "/post", label: "Post a gig" },
    { href: "/rooms", label: "Rooms" },
    { href: "/how-it-works", label: "How it works" },
  ];

  return (
    <header className="relative z-50">
      <div className="border-b-[3px] border-ink bg-ink py-1.5 text-paper-2">
        <Marquee
          items={[
            <span key="a" className="font-mono text-[11px] font-bold uppercase tracking-[0.24em]">
              214 rooms booked this month
            </span>,
            <span key="b" className="font-mono text-[11px] font-bold uppercase tracking-[0.24em]">
              zero agent fees · zero ghosting
            </span>,
            <span key="c" className="font-mono text-[11px] font-bold uppercase tracking-[0.24em]">
              paid on the night, in writing
            </span>,
            <span key="d" className="font-mono text-[11px] font-bold uppercase tracking-[0.24em]">
              new gigs posted every 11 minutes
            </span>,
          ]}
        />
      </div>

      <div className="sticky top-0 z-50 border-b-[3px] border-ink bg-paper-2/95 backdrop-blur">
        <div className="mx-auto flex max-w-[1240px] items-center gap-4 px-4 py-3 md:px-8">
          <Link href="/" className="group flex items-center gap-2.5" aria-label="GIGWIRE home">
            <span className="flex h-9 w-9 items-center justify-center border-[3px] border-ink bg-tomato text-paper-2 shadow-hard-sm transition group-hover:bg-marigold group-hover:text-ink">
              <IconBolt className="h-5 w-5" />
            </span>
            <span className="font-display text-[26px] leading-none tracking-tight">
              GIG<span className="text-tomato">WIRE</span>
            </span>
          </Link>

          <nav className="ml-4 hidden items-center gap-1 lg:flex">
            {nav.map((l) => (
              <Link
                key={l.href}
                href={l.href}
                className="border-[3px] border-transparent px-3 py-1.5 font-mono text-[11px] font-bold uppercase tracking-[0.16em] transition hover:border-ink hover:bg-butter"
              >
                {l.label}
              </Link>
            ))}
          </nav>

          <div className="ml-auto flex items-center gap-2 lg:hidden">
            <Link
              href={user ? dashboard : "/login"}
              className="flex h-9 items-center border-[3px] border-ink bg-sky px-2.5 font-mono text-[10px] font-bold uppercase tracking-[0.1em]"
            >
              {user ? user.name.split(" ")[0] : "Log in"}
            </Link>
          </div>

          <div className="ml-auto hidden items-center gap-2 lg:flex">
            {user ? (
              <>
                <Link
                  href={dashboard}
                  className="hidden items-center gap-2 border-[3px] border-ink bg-sky px-3 py-1.5 shadow-hard-sm sm:flex"
                >
                  <span className="h-2 w-2 rounded-full bg-moss" />
                  <span className="font-mono text-[11px] font-bold uppercase tracking-[0.1em]">
                    {user.name.split(" ")[0]}
                  </span>
                </Link>
                <button
                  onClick={() => {
                    signOut();
                    router.push("/");
                  }}
                  className="btn btn-ghost !px-3 !py-1.5"
                >
                  Sign out
                </button>
              </>
            ) : (
              <>
                <Link
                  href="/login"
                  className="hidden font-mono text-[11px] font-bold uppercase tracking-[0.14em] underline decoration-2 underline-offset-4 sm:block"
                >
                  Log in
                </Link>
                <Link href="/post" className="btn btn-tomato !py-2">
                  Post a gig
                </Link>
              </>
            )}
          </div>
        </div>

        <div className="border-t-[3px] border-ink/15 lg:hidden">
          <div className="mx-auto flex max-w-[1240px] items-center gap-1.5 overflow-x-auto px-3 py-2">
            {[
              ...nav,
              ...(user
                ? [
                    { href: dashboard, label: "My desk" },
                    { href: "/profile", label: "My sheet" },
                  ]
                : [{ href: "/signup", label: "Sign up" }]),
            ].map((l) => (
              <Link
                key={l.href}
                href={l.href}
                className="shrink-0 border-2 border-ink bg-paper-3 px-2.5 py-1 font-mono text-[10px] font-bold uppercase tracking-[0.12em] active:bg-marigold"
              >
                {l.label}
              </Link>
            ))}
          </div>
        </div>
      </div>
    </header>
  );
}
