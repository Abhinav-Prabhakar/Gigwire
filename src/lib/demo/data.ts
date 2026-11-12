import { BASE_DATASET, BUILD_DAY, day } from "./seed";
import type {
  AppRow,
  Dataset,
  DemoGig,
  DemoUser,
  GigFilters,
  GigRow,
} from "./types";

export { BASE_DATASET, BUILD_DAY, day } from "./seed";
export type {
  AppRow,
  Dataset,
  DemoApplication,
  DemoBookmark,
  DemoGig,
  DemoUser,
  DemoVenue,
  GigFilters,
  GigRow,
} from "./types";

/* ------------------------------------------------------------------ */
/* In-memory queries (the static stand-in for the Postgres layer)      */
/* ------------------------------------------------------------------ */

const byId = <T extends { id: number }>(rows: T[], id: number) => rows.find((r) => r.id === id) ?? null;

function withCounts(data: Dataset, rows: DemoGig[]): GigRow[] {
  return rows.map((gig) => ({
    gig,
    venue: byId(data.venues, gig.venueId),
    appCount: data.applications.filter((a) => a.gigId === gig.id).length,
  }));
}

export function filterGigs(data: Dataset, f: GigFilters): DemoGig[] {
  let rows = data.gigs.slice();

  if (f.q) {
    const q = f.q.toLowerCase();
    rows = rows.filter((g) => {
      const venue = byId(data.venues, g.venueId);
      return [g.title, g.description ?? "", venue?.name ?? "", `${g.city ?? ""}, ${g.state ?? ""}`]
        .join(" ")
        .toLowerCase()
        .includes(q);
    });
  }
  if (f.city) rows = rows.filter((g) => g.city === f.city);
  if (f.dateFrom) rows = rows.filter((g) => g.gigDate >= f.dateFrom!);
  if (f.dateTo) rows = rows.filter((g) => g.gigDate <= f.dateTo!);
  if (f.payMin && f.payMin > 0) rows = rows.filter((g) => g.payAmount >= f.payMin!);
  if (f.gigType) rows = rows.filter((g) => g.gigType === f.gigType);
  if (f.experience) rows = rows.filter((g) => g.experience === f.experience);
  if (f.status) rows = rows.filter((g) => g.status === f.status);
  if (f.genres?.length) rows = rows.filter((g) => g.genres.some((x) => f.genres!.includes(x)));
  if (f.lineup?.length) rows = rows.filter((g) => g.lineupNeeded.some((x) => f.lineup!.includes(x)));
  if (f.perks?.includes("backline")) rows = rows.filter((g) => g.backline);
  if (f.perks?.includes("meals")) rows = rows.filter((g) => g.meals);
  if (f.perks?.includes("tips")) rows = rows.filter((g) => g.tips);
  if (f.perks?.includes("engineer")) rows = rows.filter((g) => g.soundEngineer);

  const count = (g: DemoGig) => data.applications.filter((a) => a.gigId === g.id).length;
  const sort = f.sort ?? "recent";
  rows.sort((a, b) => {
    if (sort === "pay") return b.payAmount - a.payAmount || a.gigDate.localeCompare(b.gigDate);
    if (sort === "date") return a.gigDate.localeCompare(b.gigDate);
    if (sort === "applications") return count(b) - count(a) || a.id - b.id;
    return Number(b.featured) - Number(a.featured) || a.gigDate.localeCompare(b.gigDate) || a.id - b.id;
  });
  return rows;
}

export function searchGigs(data: Dataset, f: GigFilters, limit = 60): GigRow[] {
  return withCounts(data, filterGigs(data, f)).slice(0, limit);
}

export function countGigs(data: Dataset, f: GigFilters = {}): number {
  return filterGigs(data, f).length;
}

export function getGig(data: Dataset, id: number): GigRow | null {
  const gig = byId(data.gigs, id);
  if (!gig) return null;
  return withCounts(data, [gig])[0];
}

export function getCities(data: Dataset, statuses: string[] = ["open", "interviewing"]) {
  const map = new Map<string, { city: string; state: string; count: number }>();
  for (const g of data.gigs) {
    if (!statuses.includes(g.status) || !g.city) continue;
    const row = map.get(g.city) ?? { city: g.city, state: g.state ?? "", count: 0 };
    row.count += 1;
    map.set(g.city, row);
  }
  return [...map.values()].sort((a, b) => a.city.localeCompare(b.city));
}

export function getHotCities(data: Dataset, limit = 4) {
  return getCities(data)
    .slice()
    .sort((a, b) => b.count - a.count)
    .slice(0, limit);
}

export function getStats(data: Dataset) {
  const live = data.gigs.filter((g) => ["open", "interviewing"].includes(g.status));
  const today = BUILD_DAY;
  const inAWeek = day(7);
  return {
    openGigs: live.length,
    venues: data.venues.length,
    musicians: data.users.filter((u) => u.role === "musician").length,
    paid: live.reduce((n, g) => n + g.payAmount, 0),
    thisWeek: data.gigs.filter((g) => g.gigDate >= today && g.gigDate <= inAWeek).length,
  };
}

export function getFeaturedGigs(data: Dataset, limit = 3): GigRow[] {
  const rows = data.gigs
    .filter((g) => ["open", "interviewing"].includes(g.status))
    .sort((a, b) => Number(b.featured) - Number(a.featured) || a.gigDate.localeCompare(b.gigDate))
    .slice(0, limit);
  return withCounts(data, rows);
}

export function getVenueByOwner(data: Dataset, ownerId: number) {
  return data.venues.find((v) => v.ownerId === ownerId) ?? null;
}

export function getVenueStats(data: Dataset, venueId: number) {
  const gigs = data.gigs.filter((g) => g.venueId === venueId);
  const ids = new Set(gigs.map((g) => g.id));
  const apps = data.applications.filter((a) => ids.has(a.gigId));
  return {
    live: gigs.filter((g) => ["open", "interviewing"].includes(g.status)).length,
    filled: gigs.filter((g) => g.status === "filled").length,
    apps: apps.length,
    booked: apps.filter((a) => a.status === "accepted").length,
  };
}

export function getVenueGigs(data: Dataset, venueId: number): GigRow[] {
  const rows = data.gigs
    .filter((g) => g.venueId === venueId)
    .sort((a, b) => b.createdAt.localeCompare(a.createdAt) || a.id - b.id);
  return withCounts(data, rows);
}

export function getApplicationsForVenue(data: Dataset, venueId: number): AppRow[] {
  const ids = new Set(data.gigs.filter((g) => g.venueId === venueId).map((g) => g.id));
  return data.applications
    .filter((a) => ids.has(a.gigId))
    .sort((a, b) => b.createdAt.localeCompare(a.createdAt) || a.id - b.id)
    .map((application) => ({
      application,
      musician: byId(data.users, application.musicianId),
      gig: byId(data.gigs, application.gigId),
    }));
}

export function getApplicationsForGig(data: Dataset, gigId: number): AppRow[] {
  return data.applications
    .filter((a) => a.gigId === gigId)
    .sort((a, b) => b.createdAt.localeCompare(a.createdAt) || a.id - b.id)
    .map((application) => ({
      application,
      musician: byId(data.users, application.musicianId),
      gig: byId(data.gigs, application.gigId),
    }));
}

export function getMusicianApplications(data: Dataset, musicianId: number): AppRow[] {
  return data.applications
    .filter((a) => a.musicianId === musicianId)
    .sort((a, b) => {
      const da = byId(data.gigs, a.gigId)?.gigDate ?? "";
      const db = byId(data.gigs, b.gigId)?.gigDate ?? "";
      return db.localeCompare(da) || a.id - b.id;
    })
    .map((application) => ({
      application,
      musician: byId(data.users, application.musicianId),
      gig: byId(data.gigs, application.gigId),
    }));
}

export function getSavedGigIds(data: Dataset, musicianId: number): number[] {
  return data.bookmarks.filter((b) => b.musicianId === musicianId).map((b) => b.gigId);
}

export function getSavedGigs(data: Dataset, musicianId: number): GigRow[] {
  const ids = getSavedGigIds(data, musicianId);
  if (!ids.length) return [];
  const rows = data.gigs
    .filter((g) => ids.includes(g.id))
    .sort((a, b) => a.gigDate.localeCompare(b.gigDate));
  return withCounts(data, rows);
}

export function getSpotlight(data: Dataset) {
  return data.users
    .filter((u) => u.role === "musician")
    .map((musician) => ({
      musician,
      booked: data.applications.filter((a) => a.musicianId === musician.id && a.status === "accepted").length,
      applied: data.applications.filter((a) => a.musicianId === musician.id).length,
    }))
    .sort((a, b) => b.booked - a.booked || a.musician.id - b.musician.id)
    .slice(0, 4);
}

export function getRecentVenues(data: Dataset, limit = 6) {
  return data.venues.slice().sort((a, b) => a.name.localeCompare(b.name)).slice(0, limit);
}

export function getRooms(data: Dataset) {
  return data.venues
    .map((venue) => {
      const gigs = data.gigs.filter((g) => g.venueId === venue.id);
      const live = gigs.filter((g) => ["open", "interviewing"].includes(g.status));
      return {
        venue,
        owner: byId(data.users, venue.ownerId),
        openGigs: live.length,
        paid: live.reduce((n, g) => n + g.payAmount, 0),
        capacity: venue.capacity,
        upcoming: live.sort((a, b) => a.gigDate.localeCompare(b.gigDate)).slice(0, 3),
      };
    })
    .sort((a, b) => b.openGigs - a.openGigs || a.venue.name.localeCompare(b.venue.name));
}

export function getUser(data: Dataset, id: number): DemoUser | null {
  return byId(data.users, id);
}
