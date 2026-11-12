import { NextResponse } from "next/server";
import { db } from "@/db";
import { applications, gigs } from "@/db/schema";
import { and, eq } from "drizzle-orm";
import { getCurrentUser } from "@/lib/auth";
import { readForm, redirect, safeNext, str } from "@/lib/api";

export const dynamic = "force-dynamic";

export async function POST(request: Request, ctx: { params: Promise<{ id: string }> }) {
  const { id } = await ctx.params;
  const gigId = Number.parseInt(id, 10);
  const body = await readForm(request.clone());
  const next = safeNext(str(body.next) || undefined, `/gigs/${gigId}`);
  const wantsJson = (request.headers.get("content-type") ?? "").includes("application/json");

  const user = await getCurrentUser();
  if (!user) {
    const to = `/login?next=${encodeURIComponent(`/gigs/${gigId}`)}&notice=${encodeURIComponent(
      "Make a free player account to apply — one sheet, no résumé.",
    )}`;
    if (wantsJson) return NextResponse.json({ ok: false, error: "AUTH", redirect: to }, { status: 401 });
    return redirect(request, to);
  }

  const rows = await db.select().from(gigs).where(eq(gigs.id, gigId)).limit(1);
  const gig = rows[0];
  if (!gig) return NextResponse.json({ ok: false, error: "Gig not found" }, { status: 404 });
  if (gig.status === "filled" || gig.status === "closed") {
    const msg = "That slot has already been filled.";
    if (wantsJson) return NextResponse.json({ ok: false, error: msg }, { status: 409 });
    return redirect(request, `${next}?error=${encodeURIComponent(msg)}`);
  }

  const duplicate = await db
    .select({ id: applications.id })
    .from(applications)
    .where(and(eq(applications.gigId, gigId), eq(applications.musicianId, user.id)))
    .limit(1);

  if (duplicate.length) {
    const msg = "You've already sent a one-sheet for this night. It's in your tracker.";
    if (wantsJson) return NextResponse.json({ ok: false, error: msg }, { status: 409 });
    return redirect(request, `${next}?error=${encodeURIComponent(msg)}`);
  }

  await db.insert(applications).values({
    gigId,
    musicianId: user.id,
    pitch: str(body.pitch, "(no note left)"),
    lineup: str(body.lineup) || user.instruments.join(" / ") || "Solo act",
    links: str(body.links) || user.links || null,
  });

  if (wantsJson) return NextResponse.json({ ok: true, redirect: `${next}?applied=1` });
  return redirect(request, `${next}?applied=1`);
}
