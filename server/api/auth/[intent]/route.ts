import { NextResponse } from "next/server";
import { db } from "@/db";
import { users, venues } from "@/db/schema";
import { eq } from "drizzle-orm";
import { hashPassword, setSessionCookie, verifyPassword } from "@/lib/auth";
import { list, readForm, redirect, safeNext, str, toInt } from "@/lib/api";

export const dynamic = "force-dynamic";

export async function POST(request: Request) {
  const type = request.headers.get("content-type") ?? "";
  const form = type.includes("application/json") ? null : await request.clone().formData();
  const body = await readForm(request);

  const intent = str(body.intent, "login");
  const email = str(body.email).toLowerCase();
  const password = str(body.password);
  const next = safeNext(str(body.next) || undefined, "/");
  const wantsJson = type.includes("application/json");
  const respond = (to: string) =>
    wantsJson ? NextResponse.json({ ok: true, redirect: to }) : redirect(request, to);
  const reject = async (message: string, to: string) => {
    if (wantsJson) return NextResponse.json({ ok: false, error: message }, { status: 400 });
    return redirect(request, `${to}${to.includes("?") ? "&" : "?"}error=${encodeURIComponent(message)}`);
  };

  if (intent === "signup") {
    if (!email || !/^\S+@\S+\.\S+$/.test(email)) return reject("Enter a valid email address.", "/signup");
    if (password.length < 6) return reject("Password needs at least 6 characters.", "/signup");
    const existing = await db.select({ id: users.id }).from(users).where(eq(users.email, email)).limit(1);
    if (existing.length) return reject("That email is already on the board. Try logging in.", "/login");

    const role = str(body.role, "musician") === "venue" ? "venue" : "musician";
    const name = str(body.name, "New Player");
    const inserted = await db
      .insert(users)
      .values({
        name,
        email,
        passwordHash: hashPassword(password),
        role,
        city: str(body.city) || null,
        state: str(body.state) || null,
        headline: str(body.headline) || null,
        bio: str(body.bio) || null,
        links: str(body.links) || null,
        instruments: list(str(body.instruments), "instruments", form ?? undefined),
        genres: list(str(body.genres), "genres", form ?? undefined),
        avatarUrl: str(body.avatarUrl) || null,
      })
      .returning({ id: users.id });

    const userId = userIdOf(inserted);
    if (role === "venue") {
      await db.insert(venues).values({
        ownerId: userId,
        name: str(body.venueName, name),
        tagline: str(body.venueTagline) || null,
        description: str(body.venueDescription) || null,
        city: str(body.city) || null,
        state: str(body.state) || null,
        address: str(body.venueAddress) || null,
        capacity: toInt(body.venueCapacity, 80),
        genres: list(str(body.genres), "genres", form ?? undefined),
        coverUrl: null,
      });
    }
    await setSessionCookie(userId);
    return respond(role === "venue" ? "/post?created=1" : "/gigs?created=1");
  }

  // demo quick-login: email is a raw user id marker
  const account = await db.select().from(users).where(eq(users.email, email)).limit(1);
  if (!account.length || !verifyPassword(password, account[0].passwordHash)) {
    return reject("We couldn't match that email and password.", "/login");
  }
  await setSessionCookie(account[0].id);
  return respond(account[0].role === "venue" ? "/dashboard" : "/gigs");
}

function userIdOf(rows: { id: number }[]) {
  return rows[0]?.id ?? 0;
}

