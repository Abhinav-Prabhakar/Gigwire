import { cookies } from "next/headers";
import crypto from "node:crypto";
import { db } from "@/db";
import { users } from "@/db/schema";
import { eq } from "drizzle-orm";

const COOKIE = "gigwire_session";
const SECRET = process.env.SESSION_SECRET || "gigwire-dev-secret-do-not-use-in-prod";

export type SessionUser = {
  id: number;
  name: string;
  email: string;
  role: string;
  city: string | null;
  state: string | null;
  headline: string | null;
  bio: string | null;
  instruments: string[];
  genres: string[];
  links: string | null;
  avatarUrl: string | null;
};

export function hashPassword(password: string) {
  const salt = crypto.randomBytes(8).toString("hex");
  const hash = crypto.scryptSync(password, salt, 32).toString("hex");
  return `scrypt$${salt}$${hash}`;
}

export function verifyPassword(password: string, stored: string) {
  const [scheme, salt, hash] = stored.split("$");
  if (scheme !== "scrypt" || !salt || !hash) return false;
  const check = crypto.scryptSync(password, salt, 32).toString("hex");
  return crypto.timingSafeEqual(Buffer.from(check, "hex"), Buffer.from(hash, "hex"));
}

function sign(payload: string) {
  return crypto.createHmac("sha256", SECRET).update(payload).digest("hex");
}

export function createToken(userId: number) {
  const payload = `${userId}.${Date.now()}`;
  return `${payload}.${sign(payload)}`;
}

export function readToken(token: string | undefined): number | null {
  if (!token) return null;
  const parts = token.split(".");
  if (parts.length !== 3) return null;
  const payload = `${parts[0]}.${parts[1]}`;
  if (sign(payload) !== parts[2]) return null;
  const id = Number.parseInt(parts[0], 10);
  return Number.isFinite(id) ? id : null;
}

export const sessionCookieOptions = {
  name: COOKIE,
  httpOnly: true,
  sameSite: "lax" as const,
  path: "/",
  maxAge: 60 * 60 * 24 * 30,
  secure: process.env.NODE_ENV === "production",
};

export async function setSessionCookie(userId: number) {
  const store = await cookies();
  store.set(COOKIE, createToken(userId), sessionCookieOptions);
}

export async function clearSessionCookie() {
  const store = await cookies();
  store.set(COOKIE, "", { ...sessionCookieOptions, maxAge: 0 });
}

export async function getSessionUserId(): Promise<number | null> {
  const store = await cookies();
  return readToken(store.get(COOKIE)?.value);
}

export async function getCurrentUser(): Promise<SessionUser | null> {
  const id = await getSessionUserId();
  if (!id) return null;
  const rows = await db.select().from(users).where(eq(users.id, id)).limit(1);
  const u = rows[0];
  if (!u) return null;
  return {
    id: u.id,
    name: u.name,
    email: u.email,
    role: u.role,
    city: u.city,
    state: u.state,
    headline: u.headline,
    bio: u.bio,
    instruments: u.instruments ?? [],
    genres: u.genres ?? [],
    links: u.links,
    avatarUrl: u.avatarUrl,
  };
}

export async function requireUser(): Promise<SessionUser> {
  const user = await getCurrentUser();
  if (!user) throw new Error("UNAUTHORIZED");
  return user;
}
