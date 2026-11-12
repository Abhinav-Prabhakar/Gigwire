import { NextResponse } from "next/server";
import { db } from "@/db";
import { applications, gigs } from "@/db/schema";
import { and, eq } from "drizzle-orm";
import { getCurrentUser } from "@/lib/auth";
import { getVenueByOwner } from "@/lib/data";
import { readForm, redirect, safeNext, str } from "@/lib/api";

export const dynamic = "force-dynamic";

const VENUE_STATES = ["pending", "viewed", "accepted", "declined"];
const MUSICIAN_STATES = ["pending", "withdrawn"];

export async function POST(request: Request, ctx: { params: Promise<{ id: string }> }) {
  const { id } = await ctx.params;
  const appId = Number.parseInt(id, 10);
  const body = await readForm(request.clone());
  const next = safeNext(str(body.next) || undefined, "/dashboard");
  const status = str(body.status);

  const user = await getCurrentUser();
  if (!user) return redirect(request, `/login?next=${encodeURIComponent(next)}`);

  const rows = await db
    .select({ application: applications, gig: gigs })
    .from(applications)
    .innerJoin(gigs, eq(applications.gigId, gigs.id))
    .where(eq(applications.id, appId))
    .limit(1);
  const found = rows[0];
  if (!found) return NextResponse.json({ ok: false, error: "Application not found" }, { status: 404 });

  const isVenueOwner =
    user.role === "venue" && (await getVenueByOwner(user.id))?.id === found.gig.venueId;
  const isApplicant = found.application.musicianId === user.id;

  if (!isVenueOwner && !isApplicant) {
    return NextResponse.json({ ok: false, error: "Not your application" }, { status: 403 });
  }
  if (isVenueOwner && !VENUE_STATES.includes(status)) {
    return NextResponse.json({ ok: false, error: "Unknown status" }, { status: 400 });
  }
  if (isApplicant && !MUSICIAN_STATES.includes(status)) {
    return NextResponse.json({ ok: false, error: "Unknown status" }, { status: 400 });
  }

  await db.update(applications).set({ status }).where(eq(applications.id, appId));

  // If a band is booked, close the slot for everybody else.
  if (isVenueOwner && status === "accepted") {
    const others = await db
      .select({ id: applications.id })
      .from(applications)
      .where(and(eq(applications.gigId, found.gig.id), eq(applications.status, "pending")));
    void others;
    await db.update(gigs).set({ status: "filled" }).where(eq(gigs.id, found.gig.id));
  }

  return redirect(request, next);
}
