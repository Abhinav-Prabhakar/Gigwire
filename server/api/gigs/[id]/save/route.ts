import { NextResponse } from "next/server";
import { db } from "@/db";
import { bookmarks } from "@/db/schema";
import { and, eq } from "drizzle-orm";
import { getCurrentUser } from "@/lib/auth";
import { readForm, redirect, safeNext, str } from "@/lib/api";

export const dynamic = "force-dynamic";

export async function POST(request: Request, ctx: { params: Promise<{ id: string }> }) {
  const { id } = await ctx.params;
  const body = await readForm(request.clone());
  const next = safeNext(str(body.next) || `${str(body.anchor, "")}`, "/gigs");
  const gigId = Number.parseInt(id, 10);
  const user = await getCurrentUser();

  if (!user) {
    return redirect(
      request,
      `/login?next=${encodeURIComponent(next)}&notice=${encodeURIComponent("Create a free player account to save gigs and apply in one click.")}`,
    );
  }

  const existing = await db
    .select({ id: bookmarks.id })
    .from(bookmarks)
    .where(and(eq(bookmarks.musicianId, user.id), eq(bookmarks.gigId, gigId)))
    .limit(1);

  if (existing.length) {
    await db.delete(bookmarks).where(eq(bookmarks.id, existing[0].id));
  } else {
    await db.insert(bookmarks).values({ musicianId: user.id, gigId });
  }

  return redirect(request, next);
}
