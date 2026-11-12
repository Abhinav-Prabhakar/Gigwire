"use client";

import { useSyncExternalStore } from "react";
import {
  BASE_DATASET,
  type Dataset,
  type DemoApplication,
  type DemoGig,
  type DemoUser,
  type DemoVenue,
  getUser,
} from "./data";

/**
 * A tiny localStorage-backed store that stands in for the Postgres API when the
 * site is deployed as a static demo (GitHub Pages). Every write is local to the
 * browser — nothing leaves the page.
 */

const STORAGE_KEY = "gigwire.demo.v2";

type Persisted = {
  data: Dataset;
  sessionId: number | null;
  passwords: Record<string, string>;
  nextId: number;
};

export type DemoState = Persisted;

const clone = <T,>(value: T): T => JSON.parse(JSON.stringify(value)) as T;

const INITIAL: Persisted = {
  data: clone(BASE_DATASET),
  sessionId: null,
  passwords: {},
  nextId: 1000,
};

const SERVER_SNAPSHOT: Persisted = { ...INITIAL, data: BASE_DATASET };

let state: Persisted | null = null;
const listeners = new Set<() => void>();

function read(): Persisted {
  if (state) return state;
  if (typeof window === "undefined") return SERVER_SNAPSHOT;
  try {
    const raw = window.localStorage.getItem(STORAGE_KEY);
    if (raw) {
      const parsed = JSON.parse(raw) as Persisted;
      if (parsed?.data?.gigs && parsed?.data?.users) {
        state = parsed;
        return state;
      }
    }
  } catch {
    // corrupted / blocked storage — fall through to a clean board
  }
  state = INITIAL;
  return state;
}

function commit(next: Persisted) {
  state = next;
  try {
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(next));
  } catch {
    // storage full or disabled: keep the in-memory copy working
  }
  listeners.forEach((fn) => fn());
}

function subscribe(fn: () => void) {
  listeners.add(fn);
  return () => {
    listeners.delete(fn);
  };
}

export function useDemo(): Persisted {
  return useSyncExternalStore(subscribe, read, () => SERVER_SNAPSHOT);
}

export function currentUser(s: Persisted): DemoUser | null {
  return s.sessionId ? getUser(s.data, s.sessionId) : null;
}

export function currentVenue(s: Persisted): DemoVenue | null {
  const user = currentUser(s);
  if (!user) return null;
  return s.data.venues.find((v) => v.ownerId === user.id) ?? null;
}

/* ------------------------------------------------------------------ */
/* Mutations                                                           */
/* ------------------------------------------------------------------ */

export function signIn(email: string, password: string): { ok: boolean; error?: string; user?: DemoUser } {
  const s = read();
  const user = s.data.users.find((u) => u.email.toLowerCase() === email.trim().toLowerCase());
  if (!user) return { ok: false, error: "We couldn't match that email and password." };
  const expected = s.passwords[user.email] ?? "gigwire";
  if (password !== expected) return { ok: false, error: "We couldn't match that email and password." };
  commit({ ...s, sessionId: user.id });
  return { ok: true, user };
}

export type SignupInput = {
  role: "musician" | "venue";
  name: string;
  email: string;
  password: string;
  city?: string;
  state?: string;
  headline?: string;
  bio?: string;
  links?: string;
  instruments?: string[];
  genres?: string[];
  venueName?: string;
  venueTagline?: string;
  venueAddress?: string;
  venueCapacity?: number;
  venueDescription?: string;
};

export function signUp(input: SignupInput): { ok: boolean; error?: string; user?: DemoUser } {
  const s = read();
  const email = input.email.trim().toLowerCase();
  if (!/^\S+@\S+\.\S+$/.test(email)) return { ok: false, error: "Enter a valid email address." };
  if (input.password.length < 6) return { ok: false, error: "Password needs at least 6 characters." };
  if (s.data.users.some((u) => u.email.toLowerCase() === email)) {
    return { ok: false, error: "That email is already on the board. Try logging in." };
  }
  if (!input.name.trim()) return { ok: false, error: "Tell the board what to call you." };

  const id = s.nextId;
  const user: DemoUser = {
    id,
    name: input.name.trim(),
    email,
    role: input.role,
    city: input.city || null,
    state: input.state || null,
    headline: input.headline || null,
    bio: input.bio || null,
    instruments: input.instruments ?? [],
    genres: input.genres ?? [],
    links: input.links || null,
    avatarUrl: null,
    createdAt: new Date().toISOString(),
  };

  const data: Dataset = {
    ...s.data,
    users: [...s.data.users, user],
    venues: [...s.data.venues],
    gigs: [...s.data.gigs],
    applications: [...s.data.applications],
    bookmarks: [...s.data.bookmarks],
  };

  if (input.role === "venue") {
    data.venues.push({
      id: s.nextId + 1,
      ownerId: id,
      name: input.venueName || input.name,
      tagline: input.venueTagline || null,
      description: input.venueDescription || null,
      address: input.venueAddress || null,
      city: input.city || null,
      state: input.state || null,
      capacity: input.venueCapacity ?? 90,
      genres: input.genres ?? [],
      coverUrl: null,
      createdAt: new Date().toISOString(),
    });
  }

  commit({
    ...s,
    data,
    sessionId: id,
    passwords: { ...s.passwords, [email]: input.password },
    nextId: s.nextId + 2,
  });
  return { ok: true, user };
}

export function signOut() {
  const s = read();
  commit({ ...s, sessionId: null });
}

export function toggleBookmark(gigId: number) {
  const s = read();
  const user = currentUser(s);
  if (!user) return;
  const existing = s.data.bookmarks.find((b) => b.musicianId === user.id && b.gigId === gigId);
  const bookmarks = existing
    ? s.data.bookmarks.filter((b) => b.id !== existing.id)
    : [...s.data.bookmarks, { id: s.nextId, musicianId: user.id, gigId }];
  commit({
    ...s,
    data: { ...s.data, bookmarks },
    nextId: existing ? s.nextId : s.nextId + 1,
  });
}

export function applyToGig(
  gigId: number,
  input: { pitch?: string; lineup?: string; links?: string },
): { ok: boolean; error?: string } {
  const s = read();
  const user = currentUser(s);
  if (!user) return { ok: false, error: "Sign in as a player to apply." };
  if (user.role !== "musician") return { ok: false, error: "Room accounts can't send one-sheets." };
  const gig = s.data.gigs.find((g) => g.id === gigId);
  if (!gig) return { ok: false, error: "That night is no longer on the board." };
  if (["filled", "closed"].includes(gig.status)) return { ok: false, error: "That slot has already been filled." };
  if (s.data.applications.some((a) => a.gigId === gigId && a.musicianId === user.id)) {
    return { ok: false, error: "You've already sent a one-sheet for this night." };
  }
  const application: DemoApplication = {
    id: s.nextId,
    gigId,
    musicianId: user.id,
    pitch: input.pitch?.trim() || "(no note left)",
    lineup: input.lineup?.trim() || user.instruments.join(" / ") || "Solo act",
    links: input.links?.trim() || user.links || null,
    status: "pending",
    createdAt: new Date().toISOString(),
  };
  commit({
    ...s,
    data: { ...s.data, applications: [...s.data.applications, application] },
    nextId: s.nextId + 1,
  });
  return { ok: true };
}

export type PostGigInput = {
  title: string;
  gigDate: string;
  startTime?: string;
  endTime?: string;
  payAmount: number;
  payUnit?: string;
  payNote?: string;
  setsCount?: number;
  spots?: number;
  gigType?: string;
  experience?: string;
  genres?: string[];
  lineupNeeded?: string[];
  description?: string;
  requirements?: string;
  address?: string;
  city?: string;
  state?: string;
  backline?: boolean;
  meals?: boolean;
  tips?: boolean;
  soundEngineer?: boolean;
};

export function postGig(input: PostGigInput): { ok: boolean; error?: string; id?: number } {
  const s = read();
  const user = currentUser(s);
  if (!user) return { ok: false, error: "Sign in as a room first." };
  if (user.role !== "venue") return { ok: false, error: "Only room accounts can post vacancies." };
  if (input.title.trim().length < 6) return { ok: false, error: "Give the slot a clear title (6+ characters)." };
  if (!/^\d{4}-\d{2}-\d{2}$/.test(input.gigDate)) return { ok: false, error: "Pick a real date for the night." };
  if (!input.payAmount || input.payAmount < 1) return { ok: false, error: "State a pay number — even a low one beats nothing." };

  let venues = s.data.venues;
  let venue = venues.find((v) => v.ownerId === user.id) ?? null;
  let nextId = s.nextId;
  if (!venue) {
    venue = {
      id: nextId++,
      ownerId: user.id,
      name: input.city ? `${user.name}'s room` : `${user.name}'s room`,
      tagline: null,
      description: null,
      address: input.address || null,
      city: input.city || user.city || null,
      state: input.state || user.state || null,
      capacity: 90,
      genres: input.genres ?? [],
      coverUrl: null,
      createdAt: new Date().toISOString(),
    };
    venues = [...venues, venue];
  }

  const gig: DemoGig = {
    id: nextId++,
    venueId: venue.id,
    title: input.title.trim(),
    description: input.description || null,
    requirements: input.requirements || null,
    gigDate: input.gigDate,
    startTime: input.startTime || null,
    endTime: input.endTime || null,
    payAmount: Math.round(input.payAmount),
    payUnit: input.payUnit ?? "flat",
    payNote: input.payNote || null,
    setsCount: input.setsCount ?? 2,
    gigType: input.gigType ?? "one_off",
    genres: input.genres ?? [],
    lineupNeeded: input.lineupNeeded ?? [],
    experience: input.experience ?? "any",
    backline: !!input.backline,
    meals: !!input.meals,
    tips: !!input.tips,
    soundEngineer: !!input.soundEngineer,
    address: input.address || venue.address || null,
    city: input.city || venue.city || null,
    state: input.state || venue.state || null,
    status: "open",
    featured: false,
    spots: input.spots ?? 1,
    createdAt: new Date().toISOString(),
  };

  commit({
    ...s,
    data: { ...s.data, venues, gigs: [gig, ...s.data.gigs] },
    nextId,
  });
  return { ok: true, id: gig.id };
}

export function setGigStatus(gigId: number, status: string) {
  const s = read();
  commit({
    ...s,
    data: {
      ...s.data,
      gigs: s.data.gigs.map((g) => (g.id === gigId ? { ...g, status } : g)),
    },
  });
}

export function setApplicationStatus(applicationId: number, status: string) {
  const s = read();
  commit({
    ...s,
    data: {
      ...s.data,
      applications: s.data.applications.map((a) => (a.id === applicationId ? { ...a, status } : a)),
    },
  });
}

export type ProfileInput = {
  name: string;
  headline?: string;
  city?: string;
  state?: string;
  links?: string;
  bio?: string;
  instruments?: string[];
  genres?: string[];
  venueName?: string;
  venueTagline?: string;
  venueAddress?: string;
  venueCapacity?: number;
  venueCover?: string;
  venueDescription?: string;
};

export function updateProfile(input: ProfileInput) {
  const s = read();
  const user = currentUser(s);
  if (!user) return;
  const users = s.data.users.map((u) =>
    u.id === user.id
      ? {
          ...u,
          name: input.name || u.name,
          headline: input.headline || null,
          city: input.city || null,
          state: input.state || null,
          links: input.links || null,
          bio: input.bio || null,
          instruments: input.instruments ?? u.instruments,
          genres: input.genres ?? u.genres,
        }
      : u,
  );
  const venues =
    user.role === "venue"
      ? s.data.venues.map((v) =>
          v.ownerId === user.id
            ? {
                ...v,
                name: input.venueName || v.name,
                tagline: input.venueTagline || v.tagline,
                address: input.venueAddress || v.address,
                capacity: input.venueCapacity ?? v.capacity,
                coverUrl: input.venueCover || v.coverUrl,
                description: input.venueDescription || v.description,
              }
            : v,
        )
      : s.data.venues;
  commit({ ...s, data: { ...s.data, users, venues } });
}

export function resetDemo() {
  commit(INITIAL);
}
