import { NextResponse } from "next/server";
import { db } from "@/db";
import { gigs } from "@/db/schema";
import { eq } from "drizzle-orm";
import { getCurrentUser } from "@/lib/auth";
import { readForm, redirect, safeNext, str } from "@/lib/api";

export const dynamic = "force-dynamic";

export async function POST(request: Request, ctx: { params: Promise<{ id: string }> }) {
  const { id } = await ctx.params;
  const body = await readForm(request.clone());
  const next = safeNext(str(body.next) || undefined, "/dashboard");
  const user = await getCurrentUser();
  if (!user) return redirect(request, `/login?next=${encodeURIComponent(next)}`);

  const gigId = Number.parseInt(id, 10);
  const rows = await db.select().from(gigs).where(eq(gigs.id, gigId)).limit(1);
  const gig = rows[0];
  if (!gig) return NextResponse.json({ ok: false, error: "Gig not found" }, { status: 404 });

  if (user.role === "venue") {
    const status = str(body.status);
    if (!["open", "interviewing", "filled", "closed"].includes(status)) {
      return NextResponse.json({ ok: false, error: "Unknown status" }, { status: 400 });
    }
    await db.update(gigs).set({ status }).where(eq(gigs.id, gigId));
  } else if (str(body.action) === "close-own") {
    await db.update(gigs).set({ status: "closed" }).where(eq(gigs.id, gigId));
  }

  return redirect(request, next);
}
