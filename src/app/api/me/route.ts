import { NextResponse } from "next/server";
import { db } from "@/db";
import { users, venues } from "@/db/schema";
import { eq } from "drizzle-orm";
import { getCurrentUser } from "@/lib/auth";
import { getVenueByOwner } from "@/lib/data";
import { list, readForm, redirect, safeNext, str, toInt } from "@/lib/api";

export const dynamic = "force-dynamic";

export async function POST(request: Request) {
  const form = await request.clone().formData().catch(() => null);
  const body = await readForm(request);
  const next = safeNext(str(body.next) || undefined, "/profile");
  const user = await getCurrentUser();
  if (!user) return redirect(request, `/login?next=${encodeURIComponent(next)}`);

  await db
    .update(users)
    .set({
      name: str(body.name, user.name),
      city: str(body.city) || null,
      state: str(body.state) || null,
      headline: str(body.headline) || null,
      bio: str(body.bio) || null,
      links: str(body.links) || null,
      instruments: list(str(body.instruments), "instruments", form ?? undefined),
      genres: list(str(body.genres), "genres", form ?? undefined),
    })
    .where(eq(users.id, user.id));

  if (user.role === "venue") {
    const venue = await getVenueByOwner(user.id);
    if (venue) {
      await db
        .update(venues)
        .set({
          name: str(body.venueName, venue.name),
          tagline: str(body.venueTagline) || venue.tagline,
          description: str(body.venueDescription) || venue.description,
          address: str(body.venueAddress) || venue.address,
          capacity: toInt(body.venueCapacity, venue.capacity ?? 80),
          coverUrl: str(body.venueCover) || venue.coverUrl,
        })
        .where(eq(venues.id, venue.id));
    }
  }

  return redirect(request, `${next}${next.includes("?") ? "&" : "?"}saved=1`);
}
