import { NextResponse } from "next/server";
import { db } from "@/db";
import { gigs, venues } from "@/db/schema";
import { getVenueByOwner } from "@/lib/data";
import { getCurrentUser } from "@/lib/auth";
import { list, readForm, redirect, safeNext, str, toBool, toInt } from "@/lib/api";

export const dynamic = "force-dynamic";

export async function GET() {
  return NextResponse.json({ ok: true });
}

export async function POST(request: Request) {
  const form = await request.clone().formData().catch(() => null);
  const body = await readForm(request);
  const wantsJson = (request.headers.get("content-type") ?? "").includes("application/json");
  const next = safeNext(str(body.next) || undefined, "/dashboard");

  const user = await getCurrentUser();
  if (!user) {
    if (wantsJson) return NextResponse.json({ ok: false, error: "Sign in as a venue first." }, { status: 401 });
    return redirect(request, `/login?next=${encodeURIComponent("/post")}`);
  }
  if (user.role !== "venue") {
    const msg = encodeURIComponent("Only room accounts can post vacancies. Sign up as a venue to try it.");
    if (wantsJson) return NextResponse.json({ ok: false, error: decodeURIComponent(msg) }, { status: 403 });
    return redirect(request, `/post?error=${msg}`);
  }

  const title = str(body.title);
  const gigDate = str(body.gigDate);
  const payAmount = toInt(body.payAmount, 0);
  const errors: string[] = [];
  if (title.length < 6) errors.push("Give the slot a clear title (6+ characters).");
  if (!/^\d{4}-\d{2}-\d{2}$/.test(gigDate)) errors.push("Pick a real date for the night.");
  if (payAmount < 1) errors.push("State a pay number — even a low one beats nothing.");
  if (errors.length) {
    if (wantsJson) return NextResponse.json({ ok: false, error: errors.join(" ") }, { status: 422 });
    return redirect(request, `/post?error=${encodeURIComponent(errors.join(" "))}`);
  }

  let venue = await getVenueByOwner(user.id);
  const venueName = str(body.venueName);
  if (!venue) {
    await db.insert(venues).values({
      ownerId: user.id,
      name: venueName || `${user.name}'s room`,
      tagline: str(body.venueTagline) || null,
      city: str(body.city) || user.city || null,
      state: str(body.state) || user.state || null,
      address: str(body.address) || null,
      capacity: toInt(body.capacity, 80),
      genres: [],
    });
    venue = await getVenueByOwner(user.id);
  }
  if (!venue) {
    const msg = "We couldn't create your venue record. Try again.";
    if (wantsJson) return NextResponse.json({ ok: false, error: msg }, { status: 500 });
    return redirect(request, `/post?error=${encodeURIComponent(msg)}`);
  }

  const inserted = await db
    .insert(gigs)
    .values({
      venueId: venue.id,
      title,
      description: str(body.description) || null,
      requirements: str(body.requirements) || null,
      gigDate,
      startTime: str(body.startTime) || null,
      endTime: str(body.endTime) || null,
      payAmount,
      payUnit: ["flat", "hour", "set"].includes(str(body.payUnit)) ? str(body.payUnit) : "flat",
      payNote: str(body.payNote) || null,
      setsCount: Math.max(1, toInt(body.setsCount, 2)),
      gigType: ["one_off", "residency", "sub", "opener"].includes(str(body.gigType))
        ? str(body.gigType)
        : "one_off",
      genres: list(str(body.genres), "genres", form ?? undefined),
      lineupNeeded: list(str(body.lineupNeeded), "lineupNeeded", form ?? undefined),
      experience: ["any", "pro", "beginner_ok"].includes(str(body.experience)) ? str(body.experience) : "any",
      backline: toBool(body.backline),
      meals: toBool(body.meals),
      tips: toBool(body.tips),
      soundEngineer: toBool(body.soundEngineer),
      address: str(body.address) || venue.address || null,
      city: str(body.city) || venue.city || null,
      state: str(body.state) || venue.state || null,
      status: "open",
      spots: Math.max(1, toInt(body.spots, 1)),
    })
    .returning({ id: gigs.id });

  const id = inserted[0]?.id ?? 0;
  if (wantsJson) return NextResponse.json({ ok: true, id, redirect: `/gigs/${id}` });
  return redirect(request, next.includes("dashboard") ? `/dashboard?posted=${id}` : next);
}
